"""
Loom AI — Q5 Breakdown & Downtime Analytics.

Deterministic ranking of machine downtime, breakdown event frequencies,
reason distribution, and chronic downtime patterns.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any

import pandas as pd
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.analytics.common import get_month_date_range, safe_divide
from app.db_models import BreakdownEvent, Machine, ImportBatch


def get_breakdown_ranking(
    session: Session,
    period: str = "today",
    date: datetime.date | str | None = None,
    department: str | None = None,
    machine_type: str | None = None,
    machine_id: str | None = None,
) -> dict[str, Any]:
    """
    Computes deterministic Breakdown & Downtime rankings and metrics (Q5).

    Parameters
    ----------
    session : Session
        Active SQLAlchemy database session.
    period : str
        'today' or 'month'.
    date : datetime.date | str | None
        Target date. If None, resolves to latest date available in breakdown_events or production_logs.
    department : str | None
        Optional department filter.
    machine_type : str | None
        Optional machine type filter.
    machine_id : str | None
        Optional single machine ID filter.

    Returns
    -------
    dict[str, Any]
        Deterministic structured payload containing total_downtime_minutes, total_events,
        machine_ranking, reason_ranking, highest_downtime_machine, lowest_downtime_machine,
        recurring_reasons, and evidence.
    """
    # 1. Resolve date
    if date is None:
        max_date_stmt = select(func.max(BreakdownEvent.date))
        latest_date = session.execute(max_date_stmt).scalar()
        target_date = latest_date or datetime.date.today()
    elif isinstance(date, str):
        target_date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    else:
        target_date = date

    if period == "month":
        start_date, end_date = get_month_date_range(target_date)
    else:
        start_date, end_date = target_date, target_date

    # 2. Query breakdown events and machine master
    stmt = (
        select(
            BreakdownEvent.id,
            BreakdownEvent.date,
            BreakdownEvent.shift,
            BreakdownEvent.machine_id,
            BreakdownEvent.reason,
            BreakdownEvent.duration_minutes,
            BreakdownEvent.source_type,
            Machine.department,
            Machine.machine_type,
            Machine.granularity,
        )
        .join(Machine, BreakdownEvent.machine_id == Machine.machine_id)
        .where(BreakdownEvent.date >= start_date)
        .where(BreakdownEvent.date <= end_date)
    )

    if department:
        stmt = stmt.where(Machine.department == department)
    if machine_type:
        stmt = stmt.where(Machine.machine_type == machine_type)
    if machine_id:
        stmt = stmt.where(BreakdownEvent.machine_id == machine_id)

    rows = session.execute(stmt).all()

    # Get provenance / demo status from latest batch
    latest_batch_stmt = select(ImportBatch).order_by(ImportBatch.id.desc()).limit(1)
    latest_batch = session.execute(latest_batch_stmt).scalar_one_or_none()
    is_demo = latest_batch.is_demo if latest_batch else True
    dataset_label = latest_batch.dataset_label if latest_batch else "Synthetic Factory Data V1"

    if not rows:
        return {
            "period_info": {
                "period": period,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
            },
            "total_downtime_minutes": 0,
            "total_events": 0,
            "average_event_duration": 0,
            "machine_ranking": [],
            "breakdown_count_ranking": [],
            "reason_ranking": [],
            "shift_ranking": [],
            "highest_downtime_machine": None,
            "lowest_downtime_machine": None,
            "most_breakdown_events_machine": None,
            "highest_downtime_shift": None,
            "recurring_reasons": [],
            "data_quality": {
                "records_analyzed": 0,
                "is_demo": is_demo,
                "dataset_label": dataset_label,
            },
            "evidence": {
                "breakdown_event_ids": [],
            },
        }

    df = pd.DataFrame(
        [
            {
                "id": r.id,
                "date": r.date,
                "shift": r.shift,
                "machine_id": r.machine_id,
                "reason": r.reason,
                "duration_minutes": int(r.duration_minutes),
                "source_type": r.source_type,
                "department": r.department,
                "machine_type": r.machine_type,
                "granularity": r.granularity,
            }
            for r in rows
        ]
    )

    total_downtime = int(df["duration_minutes"].sum())
    total_events = len(df)

    # Machine Ranking
    m_groups = df.groupby(["machine_id", "machine_type", "department", "granularity"])
    machine_ranking: list[dict[str, Any]] = []

    for (m_id, m_type, dept, gran), m_df in m_groups:
        m_events = len(m_df)
        m_dt = int(m_df["duration_minutes"].sum())
        m_avg = round(safe_divide(m_dt, m_events), 1)
        m_pct = round(safe_divide(m_dt, total_downtime) * 100.0, 2)
        event_ids = m_df["id"].tolist()

        machine_ranking.append(
            {
                "machine_id": m_id,
                "machine_type": m_type,
                "department": dept,
                "granularity": gran,
                "event_count": m_events,
                "downtime_minutes": m_dt,
                "average_event_duration": m_avg,
                "percentage_of_total_downtime": m_pct,
                "evidence": {
                    "breakdown_event_ids": event_ids,
                },
            }
        )

    # Sort descending by downtime minutes (worst first)
    machine_ranking.sort(key=lambda x: (-x["downtime_minutes"], -x["event_count"], x["machine_id"]))

    highest_machine = machine_ranking[0] if machine_ranking else None
    # Lowest downtime machine among machines with recorded events
    lowest_machine = machine_ranking[-1] if machine_ranking else None

    # Reason Ranking
    r_groups = df.groupby("reason")
    reason_ranking: list[dict[str, Any]] = []

    for reason, r_df in r_groups:
        r_events = len(r_df)
        r_dt = int(r_df["duration_minutes"].sum())
        r_avg = round(safe_divide(r_dt, r_events), 1)
        r_pct = round(safe_divide(r_dt, total_downtime) * 100.0, 2)

        reason_ranking.append(
            {
                "reason": reason,
                "event_count": r_events,
                "total_downtime_minutes": r_dt,
                "average_event_duration": r_avg,
                "percentage_of_total_downtime": r_pct,
            }
        )

    reason_ranking.sort(key=lambda x: (-x["total_downtime_minutes"], -x["event_count"]))

    # Pareto cumulative % by downtime — lets the UI draw a Pareto chart and
    # answer "which reasons explain 80% of downtime" without recomputing.
    cumulative = 0.0
    for r in reason_ranking:
        cumulative += r["percentage_of_total_downtime"]
        r["cumulative_percentage"] = round(cumulative, 2)

    # Recurring reasons: top 3 reasons by event frequency
    recurring_reasons = sorted(reason_ranking, key=lambda x: -x["event_count"])[:3]

    # Breakdown-COUNT ranking — deliberately separate from the downtime
    # ranking above. Per the product brief: a machine with the most
    # breakdown *events* is not necessarily the machine with the most
    # downtime *minutes*, and collapsing the two into one KPI hides that.
    count_ranking = sorted(
        machine_ranking,
        key=lambda x: (-x["event_count"], -x["downtime_minutes"], x["machine_id"]),
    )
    most_breakdown_events_machine = count_ranking[0] if count_ranking else None

    # Shift comparison — total downtime and event count per shift.
    shift_groups = df.groupby("shift")
    shift_ranking: list[dict[str, Any]] = []
    for s_num, s_df in shift_groups:
        s_events = len(s_df)
        s_dt = int(s_df["duration_minutes"].sum())
        shift_ranking.append(
            {
                "shift": int(s_num),
                "event_count": s_events,
                "downtime_minutes": s_dt,
                "percentage_of_total_downtime": round(safe_divide(s_dt, total_downtime) * 100.0, 2),
            }
        )
    shift_ranking.sort(key=lambda x: -x["downtime_minutes"])
    highest_downtime_shift = shift_ranking[0] if shift_ranking else None

    return {
        "period_info": {
            "period": period,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        },
        "total_downtime_minutes": total_downtime,
        "total_events": total_events,
        "average_event_duration": round(safe_divide(total_downtime, total_events), 1),
        "machine_ranking": machine_ranking,
        "breakdown_count_ranking": count_ranking,
        "reason_ranking": reason_ranking,
        "shift_ranking": shift_ranking,
        "highest_downtime_machine": highest_machine,
        "lowest_downtime_machine": lowest_machine,
        "most_breakdown_events_machine": most_breakdown_events_machine,
        "highest_downtime_shift": highest_downtime_shift,
        "recurring_reasons": recurring_reasons,
        "data_quality": {
            "records_analyzed": total_events,
            "unique_machines_with_breakdown": int(df["machine_id"].nunique()),
            "is_demo": is_demo,
            "dataset_label": dataset_label,
        },
        "evidence": {
            "breakdown_event_ids": df["id"].tolist(),
        },
    }
