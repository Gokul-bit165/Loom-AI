"""
Loom AI — Q1 Production vs Target Analytics.

Deterministic calculation of production metrics, variance, shift performance,
machine-level drilldown, and day-over-day trends.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any

import pandas as pd
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.analytics.common import (
    classify_performance,
    safe_divide,
    safe_pct_change,
)
from app.db_models import Machine, ProductionLog, ImportBatch


def get_production_variance(
    session: Session,
    date: datetime.date | str | None = None,
    department: str | None = None,
    machine_type: str | None = None,
    machine_id: str | None = None,
    shift: int | None = None,
) -> dict[str, Any]:
    """
    Computes deterministic Production vs Target metrics (Q1).

    Parameters
    ----------
    session : Session
        Active SQLAlchemy database session.
    date : datetime.date | str | None
        Target analysis date. If None, resolves to the latest date available in production_logs.
    department : str | None
        Optional department filter (e.g. 'Weaving', 'Spinning').
    machine_type : str | None
        Optional machine type filter (e.g. 'Toyota', 'RingFrame', 'Vortex').
    machine_id : str | None
        Optional single machine filter (e.g. 'TOY-01', 'RF-11').
    shift : int | None
        Optional shift filter (1, 2, or 3).

    Returns
    -------
    dict[str, Any]
        Deterministic structured payload containing summary, machine_performance,
        shift_performance, previous_day_comparison, data_quality, and evidence.
    """
    # 1. Resolve date
    if date is None:
        max_date_stmt = select(func.max(ProductionLog.date))
        latest_date = session.execute(max_date_stmt).scalar()
        target_date = latest_date or datetime.date.today()
    elif isinstance(date, str):
        target_date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    else:
        target_date = date

    prev_date = target_date - datetime.timedelta(days=1)

    # 2. Build Query for Target Date & Previous Date
    def build_query(query_date: datetime.date):
        stmt = (
            select(
                ProductionLog.id,
                ProductionLog.date,
                ProductionLog.shift,
                ProductionLog.machine_id,
                ProductionLog.target_qty,
                ProductionLog.actual_qty,
                ProductionLog.efficiency_pct,
                Machine.department,
                Machine.machine_type,
                Machine.granularity,
                Machine.source_type,
            )
            .join(Machine, ProductionLog.machine_id == Machine.machine_id)
            .where(ProductionLog.date == query_date)
        )
        if department:
            stmt = stmt.where(Machine.department == department)
        if machine_type:
            stmt = stmt.where(Machine.machine_type == machine_type)
        if machine_id:
            stmt = stmt.where(ProductionLog.machine_id == machine_id)
        if shift:
            stmt = stmt.where(ProductionLog.shift == shift)
        return stmt

    curr_rows = session.execute(build_query(target_date)).all()
    prev_rows = session.execute(build_query(prev_date)).all()

    # Get provenance / demo status from latest batch
    latest_batch_stmt = select(ImportBatch).order_by(ImportBatch.id.desc()).limit(1)
    latest_batch = session.execute(latest_batch_stmt).scalar_one_or_none()
    is_demo = latest_batch.is_demo if latest_batch else True
    dataset_label = latest_batch.dataset_label if latest_batch else "Synthetic Factory Data V1"

    if not curr_rows:
        return {
            "summary": {
                "date": target_date.isoformat(),
                "total_target": 0.0,
                "total_actual": 0.0,
                "variance_qty": 0.0,
                "variance_pct": 0.0,
                "average_efficiency": 0.0,
                "previous_day_actual": 0.0 if not prev_rows else float(sum(r.actual_qty for r in prev_rows)),
                "change_vs_previous_day_pct": None,
            },
            "machine_performance": [],
            "shift_performance": [],
            "previous_day_comparison": {
                "current_date": target_date.isoformat(),
                "previous_date": prev_date.isoformat(),
                "current_actual": 0.0,
                "previous_actual": 0.0 if not prev_rows else float(sum(r.actual_qty for r in prev_rows)),
                "change_qty": 0.0,
                "change_pct": None,
            },
            "data_quality": {
                "records_analyzed": 0,
                "machines_counted": 0,
                "is_demo": is_demo,
                "dataset_label": dataset_label,
            },
            "evidence": {
                "production_log_ids": [],
            },
        }

    # Convert to DataFrame for deterministic vectorized aggregations
    df_curr = pd.DataFrame(
        [
            {
                "id": r.id,
                "date": r.date,
                "shift": r.shift,
                "machine_id": r.machine_id,
                "target_qty": float(r.target_qty),
                "actual_qty": float(r.actual_qty),
                "efficiency_pct": float(r.efficiency_pct),
                "department": r.department,
                "machine_type": r.machine_type,
                "granularity": r.granularity,
                "source_type": r.source_type,
            }
            for r in curr_rows
        ]
    )

    prev_actual = float(sum(r.actual_qty for r in prev_rows)) if prev_rows else 0.0

    # Summary aggregations
    total_target = round(float(df_curr["target_qty"].sum()), 2)
    total_actual = round(float(df_curr["actual_qty"].sum()), 2)
    variance_qty = round(total_actual - total_target, 2)
    variance_pct = round(safe_divide(variance_qty, total_target) * 100.0, 2)
    average_efficiency = round(safe_divide(total_actual, total_target) * 100.0, 2)
    change_vs_prev_pct = safe_pct_change(total_actual, prev_actual) if prev_rows else None

    # Machine-wise breakdown
    machine_groups = df_curr.groupby(["machine_id", "machine_type", "department", "granularity"])
    machine_perf: list[dict[str, Any]] = []

    for (m_id, m_type, dept, gran), m_df in machine_groups:
        m_target = round(float(m_df["target_qty"].sum()), 2)
        m_actual = round(float(m_df["actual_qty"].sum()), 2)
        m_var = round(m_actual - m_target, 2)
        m_eff = round(safe_divide(m_actual, m_target) * 100.0, 2)
        m_status = classify_performance(m_eff).value
        log_ids = m_df["id"].tolist()

        machine_perf.append(
            {
                "machine_id": m_id,
                "machine_type": m_type,
                "department": dept,
                "granularity": gran,
                "target": m_target,
                "actual": m_actual,
                "variance": m_var,
                "efficiency": m_eff,
                "performance_status": m_status,
                "evidence": {
                    "production_log_ids": log_ids,
                },
            }
        )

    # Sort machine performance by efficiency ascending (underperformers first)
    machine_perf.sort(key=lambda x: (x["efficiency"], x["machine_id"]))

    # Shift-wise breakdown
    shift_groups = df_curr.groupby("shift")
    shift_perf: list[dict[str, Any]] = []

    for s_num, s_df in shift_groups:
        s_target = round(float(s_df["target_qty"].sum()), 2)
        s_actual = round(float(s_df["actual_qty"].sum()), 2)
        s_var = round(s_actual - s_target, 2)
        s_eff = round(safe_divide(s_actual, s_target) * 100.0, 2)
        s_ids = s_df["id"].tolist()

        shift_perf.append(
            {
                "shift": int(s_num),
                "target": s_target,
                "actual": s_actual,
                "variance": s_var,
                "efficiency": s_eff,
                "evidence": {
                    "production_log_ids": s_ids,
                },
            }
        )

    shift_perf.sort(key=lambda x: x["shift"])

    return {
        "summary": {
            "date": target_date.isoformat(),
            "total_target": total_target,
            "total_actual": total_actual,
            "variance_qty": variance_qty,
            "variance_pct": variance_pct,
            "average_efficiency": average_efficiency,
            "previous_day_actual": prev_actual,
            "change_vs_previous_day_pct": change_vs_prev_pct,
        },
        "machine_performance": machine_perf,
        "shift_performance": shift_perf,
        "previous_day_comparison": {
            "current_date": target_date.isoformat(),
            "previous_date": prev_date.isoformat(),
            "current_actual": total_actual,
            "previous_actual": prev_actual,
            "change_qty": round(total_actual - prev_actual, 2),
            "change_pct": change_vs_prev_pct,
        },
        "data_quality": {
            "records_analyzed": len(df_curr),
            "machines_counted": int(df_curr["machine_id"].nunique()),
            "is_demo": is_demo,
            "dataset_label": dataset_label,
        },
        "evidence": {
            "production_log_ids": df_curr["id"].tolist(),
        },
    }
