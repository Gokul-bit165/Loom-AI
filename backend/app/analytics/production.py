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
from app.db_models import BreakdownEvent, Machine, ProductionLog, ImportBatch

# Assumed hours in a single production shift, used only to turn a target
# quantity into an hourly expected rate for the ESTIMATED production-loss
# calculation below. This is a planning assumption, not a measured value —
# every figure derived from it is tagged "ESTIMATED" in the response.
ASSUMED_SHIFT_HOURS = 8.0


def _trailing_average_actual(
    session: Session,
    target_date: datetime.date,
    window_days: int,
    department: str | None,
    machine_type: str | None,
    machine_id: str | None,
    shift: int | None,
) -> dict[str, Any]:
    """
    Average of total daily actual production over the `window_days` calendar
    days strictly before `target_date` (does not include target_date itself).
    Returns None-safe payload: if no data exists in the window, average is
    None and days_with_data is 0 so callers can render "insufficient history"
    instead of a misleading zero.
    """
    window_start = target_date - datetime.timedelta(days=window_days)
    window_end = target_date - datetime.timedelta(days=1)

    stmt = (
        select(ProductionLog.date, ProductionLog.actual_qty)
        .join(Machine, ProductionLog.machine_id == Machine.machine_id)
        .where(ProductionLog.date >= window_start)
        .where(ProductionLog.date <= window_end)
    )
    if department:
        stmt = stmt.where(Machine.department == department)
    if machine_type:
        stmt = stmt.where(Machine.machine_type == machine_type)
    if machine_id:
        stmt = stmt.where(ProductionLog.machine_id == machine_id)
    if shift:
        stmt = stmt.where(ProductionLog.shift == shift)

    rows = session.execute(stmt).all()
    if not rows:
        return {"average_actual": None, "days_with_data": 0, "window_days": window_days}

    daily_totals: dict[datetime.date, float] = {}
    for r in rows:
        daily_totals[r.date] = daily_totals.get(r.date, 0.0) + float(r.actual_qty)

    days_with_data = len(daily_totals)
    average_actual = round(sum(daily_totals.values()) / days_with_data, 2)
    return {
        "average_actual": average_actual,
        "days_with_data": days_with_data,
        "window_days": window_days,
    }


def _estimated_production_loss(
    session: Session,
    target_date: datetime.date,
    department: str | None,
    machine_type: str | None,
    machine_id: str | None,
    shift: int | None,
) -> dict[str, Any]:
    """
    ESTIMATED (not measured) production quantity lost to breakdown downtime
    on target_date, computed per machine as:
        expected_rate_per_hour = machine's target_qty for that shift / ASSUMED_SHIFT_HOURS
        estimated_loss = expected_rate_per_hour * (breakdown downtime_minutes / 60)
    Only covers machine/shift combinations that have both a production_logs
    row (for the target rate) and a breakdown_events row (for downtime) on
    target_date — this is a deliberate scope limit, not a bug: without a
    production target for that shift there is no basis for an expected rate.
    """
    prod_stmt = (
        select(
            ProductionLog.machine_id,
            ProductionLog.shift,
            ProductionLog.target_qty,
        )
        .join(Machine, ProductionLog.machine_id == Machine.machine_id)
        .where(ProductionLog.date == target_date)
    )
    if department:
        prod_stmt = prod_stmt.where(Machine.department == department)
    if machine_type:
        prod_stmt = prod_stmt.where(Machine.machine_type == machine_type)
    if machine_id:
        prod_stmt = prod_stmt.where(ProductionLog.machine_id == machine_id)
    if shift:
        prod_stmt = prod_stmt.where(ProductionLog.shift == shift)

    target_by_key = {
        (r.machine_id, r.shift): float(r.target_qty) for r in session.execute(prod_stmt).all()
    }
    if not target_by_key:
        return {
            "estimated_production_loss_qty": 0.0,
            "is_estimated": True,
            "methodology": (
                "expected_rate_per_hour (target_qty / assumed 8h shift) x downtime_hours, "
                "per machine/shift with recorded breakdown events"
            ),
            "machines_with_loss": [],
        }

    bd_stmt = (
        select(BreakdownEvent.machine_id, BreakdownEvent.shift, BreakdownEvent.duration_minutes)
        .where(BreakdownEvent.date == target_date)
    )
    if machine_id:
        bd_stmt = bd_stmt.where(BreakdownEvent.machine_id == machine_id)
    if shift:
        bd_stmt = bd_stmt.where(BreakdownEvent.shift == shift)

    loss_by_machine: dict[str, float] = {}
    for r in session.execute(bd_stmt).all():
        key = (r.machine_id, r.shift)
        target_qty = target_by_key.get(key)
        if target_qty is None:
            continue
        expected_rate_per_hour = safe_divide(target_qty, ASSUMED_SHIFT_HOURS)
        downtime_hours = float(r.duration_minutes) / 60.0
        loss_by_machine[r.machine_id] = loss_by_machine.get(r.machine_id, 0.0) + (
            expected_rate_per_hour * downtime_hours
        )

    machines_with_loss = sorted(
        (
            {"machine_id": m, "estimated_loss_qty": round(v, 2)}
            for m, v in loss_by_machine.items()
        ),
        key=lambda x: -x["estimated_loss_qty"],
    )
    total_loss = round(sum(loss_by_machine.values()), 2)

    return {
        "estimated_production_loss_qty": total_loss,
        "is_estimated": True,
        "methodology": (
            "expected_rate_per_hour (target_qty / assumed 8h shift) x downtime_hours, "
            "per machine/shift with recorded breakdown events"
        ),
        "machines_with_loss": machines_with_loss,
    }


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

    # 1b. Trailing averages (7-day / 30-day) and estimated production loss —
    # computed regardless of whether target_date has data, so an empty day
    # still explains itself against recent history.
    avg_7d = _trailing_average_actual(session, target_date, 7, department, machine_type, machine_id, shift)
    avg_30d = _trailing_average_actual(session, target_date, 30, department, machine_type, machine_id, shift)
    production_loss = _estimated_production_loss(
        session, target_date, department, machine_type, machine_id, shift
    )

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
            "trailing_averages": {"avg_7d": avg_7d, "avg_30d": avg_30d},
            "production_loss": production_loss,
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

    worst_machine = machine_perf[0] if machine_perf else None
    best_machine = machine_perf[-1] if machine_perf else None
    largest_variance_machine = (
        min(machine_perf, key=lambda x: x["variance"]) if machine_perf else None
    )
    biggest_loss_contributor = (
        production_loss["machines_with_loss"][0]
        if production_loss["machines_with_loss"]
        else None
    )

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
        "trailing_averages": {"avg_7d": avg_7d, "avg_30d": avg_30d},
        "production_loss": production_loss,
        "best_machine": best_machine,
        "worst_machine": worst_machine,
        "largest_variance_machine": largest_variance_machine,
        "biggest_loss_contributor": biggest_loss_contributor,
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


def get_production_trend(
    session: Session,
    date: datetime.date | str | None = None,
    days: int = 14,
    department: str | None = None,
    machine_type: str | None = None,
    machine_id: str | None = None,
) -> dict[str, Any]:
    """
    Computes deterministic daily production trajectory over the last `days` ending on `date`.
    """
    if date is None:
        max_date_stmt = select(func.max(ProductionLog.date))
        latest_date = session.execute(max_date_stmt).scalar()
        target_date = latest_date or datetime.date.today()
    elif isinstance(date, str):
        target_date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    else:
        target_date = date

    start_date = target_date - datetime.timedelta(days=days - 1)

    stmt = (
        select(
            ProductionLog.date,
            ProductionLog.target_qty,
            ProductionLog.actual_qty,
        )
        .join(Machine, ProductionLog.machine_id == Machine.machine_id)
        .where(ProductionLog.date >= start_date)
        .where(ProductionLog.date <= target_date)
    )
    if department:
        stmt = stmt.where(Machine.department == department)
    if machine_type:
        stmt = stmt.where(Machine.machine_type == machine_type)
    if machine_id:
        stmt = stmt.where(ProductionLog.machine_id == machine_id)

    rows = session.execute(stmt).all()

    # Aggregate by date
    daily_agg: dict[datetime.date, dict[str, float]] = {}
    # Pre-populate all dates in range so there are no missing gaps
    curr_d = start_date
    while curr_d <= target_date:
        daily_agg[curr_d] = {"target": 0.0, "actual": 0.0}
        curr_d += datetime.timedelta(days=1)

    for r in rows:
        if r.date in daily_agg:
            daily_agg[r.date]["target"] += float(r.target_qty)
            daily_agg[r.date]["actual"] += float(r.actual_qty)

    trend_points: list[dict[str, Any]] = []
    for d, vals in sorted(daily_agg.items()):
        act = round(vals["actual"], 2)
        tgt = round(vals["target"], 2)
        eff = round(safe_divide(act, tgt) * 100.0, 2) if tgt > 0 else 0.0
        is_target_day = (d == target_date)
        day_label = d.strftime("%d %b")
        if is_target_day:
            day_label += " (Today)"

        trend_points.append(
            {
                "date": d.isoformat(),
                "day": day_label,
                "actual": act,
                "target": tgt,
                "efficiency": eff,
            }
        )

    # Provenance
    latest_batch_stmt = select(ImportBatch).order_by(ImportBatch.id.desc()).limit(1)
    latest_batch = session.execute(latest_batch_stmt).scalar_one_or_none()
    is_demo = latest_batch.is_demo if latest_batch else True
    dataset_label = latest_batch.dataset_label if latest_batch else "Synthetic Factory Data V1"

    return {
        "start_date": start_date.isoformat(),
        "target_date": target_date.isoformat(),
        "days": days,
        "trend_points": trend_points,
        "data_quality": {
            "records_analyzed": len(rows),
            "is_demo": is_demo,
            "dataset_label": dataset_label,
        },
    }

