"""
Loom AI v2 — /api/v2/breakdown router.

Q5: worst looms by downtime today + month
Q6: reason pareto + avg downtime per event
Q7: ₹ lost to breakdowns
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import Date, Numeric, func, select
from sqlalchemy.orm import Session

from app.db_models import Loom, ProductionLog, ReasonCode, ShiftMaster, StopEvent, Unit
from app.routers.deps import get_session, http_error
from app.schemas import BreakdownLoomRow, BreakdownSummaryResponse, ReasonParetoRow, RupeeAmount

router = APIRouter()

_REVENUE_PER_METRE = Decimal("40.00")
_REVENUE_RATE_SOURCE = "ESTIMATED"


@router.get("/summary", response_model=BreakdownSummaryResponse)
def breakdown_summary(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> BreakdownSummaryResponse:
    unit_row = session.execute(
        select(Unit).where(Unit.code == unit)
    ).scalar_one_or_none()
    if unit_row is None:
        http_error(404, "UNIT_NOT_FOUND", f"Unit '{unit}' does not exist.")

    day_start = datetime.datetime.combine(date, datetime.time.min)
    day_end = datetime.datetime.combine(date, datetime.time.max)
    month_start = datetime.datetime.combine(date.replace(day=1), datetime.time.min)

    # Q5a — worst looms by stopped minutes TODAY
    today_stops = session.execute(
        select(
            Loom.loom_id,
            Loom.loom_no,
            Loom.loom_type_code,
            func.sum(
                (func.extract("epoch",
                    func.coalesce(StopEvent.resolved_at, func.now()) - StopEvent.raised_at
                ) / 60).cast(Numeric)
            ).label("stopped_min"),
            func.count(StopEvent.stop_event_id).label("events"),
        )
        .join(StopEvent, StopEvent.loom_id == Loom.loom_id)
        .where(
            Loom.unit_id == unit_row.unit_id,
            StopEvent.raised_at >= day_start,
            StopEvent.raised_at <= day_end,
        )
        .group_by(Loom.loom_id, Loom.loom_no, Loom.loom_type_code)
        .order_by(func.sum(
            func.extract("epoch",
                func.coalesce(StopEvent.resolved_at, func.now()) - StopEvent.raised_at
            ) / 60
        ).desc())
        .limit(10)
    ).all()

    # Q5b — worst looms by event count THIS MONTH
    month_stops = session.execute(
        select(
            Loom.loom_id,
            Loom.loom_no,
            Loom.loom_type_code,
            func.count(StopEvent.stop_event_id).label("events"),
            func.sum(
                (func.extract("epoch",
                    func.coalesce(StopEvent.resolved_at, func.now()) - StopEvent.raised_at
                ) / 60).cast(Numeric)
            ).label("stopped_min"),
        )
        .join(StopEvent, StopEvent.loom_id == Loom.loom_id)
        .where(
            Loom.unit_id == unit_row.unit_id,
            StopEvent.raised_at >= month_start,
            StopEvent.raised_at <= day_end,
        )
        .group_by(Loom.loom_id, Loom.loom_no, Loom.loom_type_code)
        .order_by(func.count(StopEvent.stop_event_id).desc())
        .limit(10)
    ).all()

    def _to_loom_row(row) -> BreakdownLoomRow:
        return BreakdownLoomRow(
            loom_id=row.loom_id,
            loom_no=row.loom_no,
            loom_type_code=row.loom_type_code,
            total_stopped_minutes=int(row.stopped_min or 0),
            event_count=int(row.events or 0),
            dominant_reason_en=None,
            dominant_reason_category=None,
        )

    # Q6 — reason pareto across all looms, this month
    pareto_rows = session.execute(
        select(
            ReasonCode.code,
            ReasonCode.label_en,
            func.count(StopEvent.stop_event_id).label("cnt"),
            func.sum(
                func.extract("epoch",
                    func.coalesce(StopEvent.resolved_at, func.now()) - StopEvent.raised_at
                ) / 60
            ).label("total_min"),
        )
        .join(ReasonCode, ReasonCode.reason_code_id == StopEvent.reason_code_id)
        .join(Loom, Loom.loom_id == StopEvent.loom_id)
        .where(
            Loom.unit_id == unit_row.unit_id,
            StopEvent.raised_at >= month_start,
            StopEvent.raised_at <= day_end,
        )
        .group_by(ReasonCode.code, ReasonCode.label_en)
        .order_by(func.count(StopEvent.stop_event_id).desc())
    ).all()

    total_events = sum(pr.cnt for pr in pareto_rows) or 1
    reason_pareto = [
        ReasonParetoRow(
            reason_code=pr.code,
            reason_label_en=pr.label_en,
            count=pr.cnt,
            total_minutes=round(Decimal(str(pr.total_min or 0)), 1),
            pct_of_loom_downtime=round(Decimal(str(pr.cnt * 100 / total_events)), 1),
            vs_plant_pct=None,
        )
        for pr in pareto_rows
    ]

    # Q6 — avg downtime per event
    avg_row = session.execute(
        select(
            func.avg(
                func.extract("epoch",
                    func.coalesce(StopEvent.resolved_at, func.now()) - StopEvent.raised_at
                ) / 60
            ).label("avg_min")
        )
        .join(Loom, Loom.loom_id == StopEvent.loom_id)
        .where(
            Loom.unit_id == unit_row.unit_id,
            StopEvent.raised_at >= month_start,
        )
    ).one()
    avg_downtime = round(Decimal(str(avg_row.avg_min or 0)), 1) if avg_row.avg_min else None

    # Q7 — ₹ lost to breakdowns
    total_rupee = session.execute(
        select(
            func.sum(
                (func.extract("epoch",
                    func.coalesce(StopEvent.resolved_at, func.now()) - StopEvent.raised_at
                ) / 60 *
                func.coalesce(ProductionLog.std_rpm_snapshot, 0) /
                func.coalesce(func.cast(40, Numeric), 1)
                ).cast(Numeric) * Decimal("40.00")
            ).label("rupee")
        )
        .select_from(StopEvent)
        .join(Loom, Loom.loom_id == StopEvent.loom_id)
        .outerjoin(
            ProductionLog,
            (ProductionLog.loom_id == StopEvent.loom_id) &
            (ProductionLog.work_date == func.cast(StopEvent.raised_at, Date))
        )
        .where(
            Loom.unit_id == unit_row.unit_id,
            StopEvent.raised_at >= month_start,
            StopEvent.raised_at <= day_end,
            (ProductionLog.is_current == True) | (ProductionLog.production_log_id.is_(None)),
        )
    ).scalar_one_or_none()

    data_as_of = session.execute(
        select(func.max(ProductionLog.ingested_at))
        .join(Loom, Loom.loom_id == ProductionLog.loom_id)
        .where(
            Loom.unit_id == unit_row.unit_id,
            ProductionLog.work_date == date,
            ProductionLog.is_current == True,
        )
    ).scalar_one_or_none()

    rupee_val = round(Decimal(str(total_rupee or 0)), 0) if total_rupee else Decimal("0")
    rupee_obj = RupeeAmount(
        value=rupee_val,
        rate_source=_REVENUE_RATE_SOURCE,
        rate_basis="Rs.40.00/metre -- placeholder rate card",
    )

    return BreakdownSummaryResponse(
        date=date,
        unit_code=unit,
        worst_looms_today=[_to_loom_row(r) for r in today_stops],
        monthly_top_looms=[_to_loom_row(r) for r in month_stops],
        avg_downtime_per_event_min=avg_downtime,
        reason_pareto=reason_pareto,
        total_rupee_lost=rupee_obj,
        data_as_of=data_as_of,
        source_mix=["DEMO"],
    )
