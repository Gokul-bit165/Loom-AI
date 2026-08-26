"""
Loom AI — Q21 Revenue & Loss Analytics.

Deterministic aggregation of today's revenue, month-to-date revenue,
machine contributions, and fabric style breakdowns.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any

import pandas as pd
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.analytics.common import get_month_date_range, safe_divide, safe_pct_change
from app.db_models import Machine, RevenueLog, ImportBatch


def get_revenue_summary(
    session: Session,
    date: datetime.date | str | None = None,
    department: str | None = None,
    machine_id: str | None = None,
    fabric_style: str | None = None,
) -> dict[str, Any]:
    """
    Computes deterministic Revenue metrics, machine/style rankings, and MTD totals (Q21).

    Parameters
    ----------
    session : Session
        Active SQLAlchemy database session.
    date : datetime.date | str | None
        Target date. If None, resolves to latest date available in revenue_logs.
    department : str | None
        Optional department filter.
    machine_id : str | None
        Optional machine ID filter.
    fabric_style : str | None
        Optional fabric style filter (e.g. 'Excel Slub', 'VSF Export').

    Returns
    -------
    dict[str, Any]
        Deterministic structured payload containing today_revenue, mtd_revenue,
        previous_day_revenue, change_vs_previous_day_pct, machine_ranking,
        fabric_style_ranking, best_machine, worst_machine, best_style, worst_style,
        revenue_loss status, and evidence.
    """
    # 1. Resolve date
    if date is None:
        max_date_stmt = select(func.max(RevenueLog.date))
        latest_date = session.execute(max_date_stmt).scalar()
        target_date = latest_date or datetime.date.today()
    elif isinstance(date, str):
        target_date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    else:
        target_date = date

    prev_date = target_date - datetime.timedelta(days=1)
    mtd_start, _ = get_month_date_range(target_date)

    # 2. Base query builder
    def build_query(start_d: datetime.date, end_d: datetime.date):
        stmt = (
            select(
                RevenueLog.id,
                RevenueLog.date,
                RevenueLog.shift,
                RevenueLog.machine_id,
                RevenueLog.fabric_style,
                RevenueLog.revenue,
                RevenueLog.source_type,
                Machine.department,
                Machine.machine_type,
                Machine.granularity,
            )
            .join(Machine, RevenueLog.machine_id == Machine.machine_id)
            .where(RevenueLog.date >= start_d)
            .where(RevenueLog.date <= end_d)
        )
        if department:
            stmt = stmt.where(Machine.department == department)
        if machine_id:
            stmt = stmt.where(RevenueLog.machine_id == machine_id)
        if fabric_style:
            stmt = stmt.where(RevenueLog.fabric_style == fabric_style)
        return stmt

    curr_rows = session.execute(build_query(target_date, target_date)).all()
    prev_rows = session.execute(build_query(prev_date, prev_date)).all()
    mtd_rows = session.execute(build_query(mtd_start, target_date)).all()

    # Get provenance / demo status from latest batch
    latest_batch_stmt = select(ImportBatch).order_by(ImportBatch.id.desc()).limit(1)
    latest_batch = session.execute(latest_batch_stmt).scalar_one_or_none()
    is_demo = latest_batch.is_demo if latest_batch else True
    dataset_label = latest_batch.dataset_label if latest_batch else "Synthetic Factory Data V1"

    today_rev = round(float(sum(r.revenue for r in curr_rows)), 2)
    prev_rev = round(float(sum(r.revenue for r in prev_rows)), 2)
    mtd_rev = round(float(sum(r.revenue for r in mtd_rows)), 2)
    change_vs_prev_pct = safe_pct_change(today_rev, prev_rev) if prev_rows else None

    if not curr_rows:
        return {
            "summary": {
                "date": target_date.isoformat(),
                "today_revenue": today_rev,
                "mtd_revenue": mtd_rev,
                "previous_day_revenue": prev_rev,
                "change_vs_previous_day_pct": change_vs_prev_pct,
                "mtd_start_date": mtd_start.isoformat(),
            },
            "machine_ranking": [],
            "fabric_style_ranking": [],
            "best_machine": None,
            "worst_machine": None,
            "best_style": None,
            "worst_style": None,
            "revenue_loss": {
                "revenue_loss_available": False,
                "reason": (
                    "Deterministic revenue loss calculation requires standard order book rates, "
                    "contracted delivery penalties, and margin profiles per loom. Raw production logs "
                    "do not record customer pricing commitments. To maintain trust and avoid "
                    "fabricating numbers, revenue loss is marked unavailable."
                ),
            },
            "data_quality": {
                "records_analyzed": len(curr_rows),
                "is_demo": is_demo,
                "dataset_label": dataset_label,
            },
            "evidence": {
                "revenue_log_ids": [],
            },
        }

    df_curr = pd.DataFrame(
        [
            {
                "id": r.id,
                "date": r.date,
                "shift": r.shift,
                "machine_id": r.machine_id,
                "fabric_style": r.fabric_style,
                "revenue": float(r.revenue),
                "source_type": r.source_type,
                "department": r.department,
                "machine_type": r.machine_type,
                "granularity": r.granularity,
            }
            for r in curr_rows
        ]
    )

    # Machine Ranking
    m_groups = df_curr.groupby(["machine_id", "machine_type", "department", "granularity"])
    machine_ranking: list[dict[str, Any]] = []

    for (m_id, m_type, dept, gran), m_df in m_groups:
        m_rev = round(float(m_df["revenue"].sum()), 2)
        m_pct = round(safe_divide(m_rev, today_rev) * 100.0, 2)
        styles = sorted(m_df["fabric_style"].unique().tolist())
        log_ids = m_df["id"].tolist()

        machine_ranking.append(
            {
                "machine_id": m_id,
                "machine_type": m_type,
                "department": dept,
                "granularity": gran,
                "fabric_styles": styles,
                "total_revenue": m_rev,
                "percentage_of_total": m_pct,
                "evidence": {
                    "revenue_log_ids": log_ids,
                },
            }
        )

    # Sort descending by revenue (best first)
    machine_ranking.sort(key=lambda x: (-x["total_revenue"], x["machine_id"]))

    best_machine = machine_ranking[0] if machine_ranking else None
    worst_machine = machine_ranking[-1] if machine_ranking else None

    # Fabric Style Ranking
    s_groups = df_curr.groupby("fabric_style")
    style_ranking: list[dict[str, Any]] = []

    for style, s_df in s_groups:
        s_rev = round(float(s_df["revenue"].sum()), 2)
        s_pct = round(safe_divide(s_rev, today_rev) * 100.0, 2)
        m_count = int(s_df["machine_id"].nunique())

        style_ranking.append(
            {
                "fabric_style": style,
                "total_revenue": s_rev,
                "percentage_of_total": s_pct,
                "machine_count": m_count,
            }
        )

    style_ranking.sort(key=lambda x: -x["total_revenue"])

    best_style = style_ranking[0] if style_ranking else None
    worst_style = style_ranking[-1] if style_ranking else None

    return {
        "summary": {
            "date": target_date.isoformat(),
            "today_revenue": today_rev,
            "mtd_revenue": mtd_rev,
            "previous_day_revenue": prev_rev,
            "change_vs_previous_day_pct": change_vs_prev_pct,
            "mtd_start_date": mtd_start.isoformat(),
        },
        "machine_ranking": machine_ranking,
        "fabric_style_ranking": style_ranking,
        "best_machine": best_machine,
        "worst_machine": worst_machine,
        "best_style": best_style,
        "worst_style": worst_style,
        "revenue_loss": {
            "revenue_loss_available": False,
            "reason": (
                "Deterministic revenue loss calculation requires standard order book rates, "
                "contracted delivery penalties, and margin profiles per loom. Raw production logs "
                "do not record customer pricing commitments. To maintain trust and avoid "
                "fabricating numbers, revenue loss is marked unavailable."
            ),
        },
        "data_quality": {
            "records_analyzed": len(curr_rows),
            "unique_machines_recorded": int(df_curr["machine_id"].nunique()),
            "is_demo": is_demo,
            "dataset_label": dataset_label,
        },
        "evidence": {
            "revenue_log_ids": df_curr["id"].tolist(),
        },
    }
