"""
Loom AI v2 — /api/v2/breakdown router.

Single canonical endpoint for breakdown & stoppage intelligence, consuming BreakdownService.
"""
from __future__ import annotations

import datetime
from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.routers.deps import get_session, http_error
from app.schemas import BreakdownLoomRow, BreakdownSummaryResponse, ReasonParetoRow, RupeeAmount
from app.services.truth_service import BreakdownService

router = APIRouter()


@router.get("/summary", response_model=BreakdownSummaryResponse)
def breakdown_summary(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> BreakdownSummaryResponse:
    res = BreakdownService.get_breakdown_summary(session, unit, date)
    if not res.get("data_available"):
        http_error(404, "DATA_NOT_FOUND", res.get("reason", "No breakdown records available."))

    worst_looms = [
        BreakdownLoomRow(
            loom_id=r["loom_id"],
            loom_no=r["loom_no"],
            loom_type_code=r["loom_type_code"],
            total_stopped_minutes=r["total_stopped_minutes"],
            event_count=r["event_count"],
            dominant_reason_en=r["dominant_reason_en"],
            dominant_reason_category=r["dominant_reason_category"],
        )
        for r in res.get("worst_looms_today", [])
    ]

    monthly_looms = [
        BreakdownLoomRow(
            loom_id=r["loom_id"],
            loom_no=r["loom_no"],
            loom_type_code=r["loom_type_code"],
            total_stopped_minutes=r["total_stopped_minutes"],
            event_count=r["event_count"],
            dominant_reason_en=r["dominant_reason_en"],
            dominant_reason_category=r["dominant_reason_category"],
        )
        for r in res.get("monthly_top_looms", [])
    ]

    pareto = [
        ReasonParetoRow(
            reason_code=p["reason_code"],
            reason_label_en=p["reason_label_en"],
            count=p["count"],
            total_minutes=Decimal(str(p["total_minutes"])),
            pct_of_loom_downtime=Decimal(str(p["pct_of_loom_downtime"])),
            vs_plant_pct=Decimal(str(p["vs_plant_pct"])),
        )
        for p in res.get("reason_pareto", [])
    ]

    rupee_val = res.get("today_rupee_loss_total", {}).get("value", 0.0)
    rupee_obj = RupeeAmount(
        value=Decimal(str(rupee_val)),
        rate_source="ESTIMATED",
        rate_basis="Rs.40.00/metre std selling price",
    )

    avg_dt = Decimal(str(res.get("avg_downtime_per_event_min", 0.0)))

    return BreakdownSummaryResponse(
        date=date,
        unit_code=unit,
        today_stopped_minutes_total=res.get("today_stopped_minutes_total", 0),
        today_events_count_total=res.get("today_events_count_total", 0),
        today_rupee_loss_total=rupee_obj,
        category_downtime_minutes=res.get("category_downtime_minutes", {}),
        worst_looms_today=worst_looms,
        monthly_top_looms=monthly_looms,
        avg_downtime_per_event_min=avg_dt,
        reason_pareto=pareto,
        total_rupee_lost=rupee_obj,
        source_mix=["ACTUAL_PLC_STOPS"],
    )
