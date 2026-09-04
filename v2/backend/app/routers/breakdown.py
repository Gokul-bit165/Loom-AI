"""
Loom AI v2 — /api/v2/breakdown router.

Single canonical endpoint for breakdown & stoppage intelligence, consuming BreakdownService.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.routers.deps import get_session, http_error
from app.schemas import (
    AbnormalPatternRow,
    BreakdownLoomRow,
    BreakdownSummaryResponse,
    PeerBenchmarkRow,
    ReasonParetoRow,
    RupeeAmount,
    ShiftBreakdownRow,
)
from app.services.truth_service import BreakdownService
from app.services.root_cause_service import RootCauseService
from app.services.anomaly_service import AnomalyService
from app.services.breakdown_loss_service import BreakdownLossService

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
            dominant_reason_en=r.get("dominant_reason_en"),
            dominant_reason_category=r.get("dominant_reason_category"),
            lost_meters=r.get("lost_meters"),
            rupee_exposure=r.get("rupee_exposure"),
            efficiency_pct=r.get("efficiency_pct"),
            style_code=r.get("style_code"),
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
            dominant_reason_en=r.get("dominant_reason_en"),
            dominant_reason_category=r.get("dominant_reason_category"),
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
            vs_plant_pct=Decimal(str(p.get("vs_plant_pct") or 0)),
            avg_duration_min=p.get("avg_duration_min"),
            expected_duration_min=p.get("expected_duration_min"),
            variance_min=p.get("variance_min"),
            category=p.get("category"),
        )
        for p in res.get("reason_pareto", [])
    ]

    # Best peer benchmark
    peer_raw = res.get("best_peer_benchmark")
    peer_obj = PeerBenchmarkRow(**peer_raw) if peer_raw else None

    # Highest downtime loom
    highest_raw = res.get("highest_downtime_loom")
    highest_obj = BreakdownLoomRow(**highest_raw) if highest_raw else (worst_looms[0] if worst_looms else None)

    # Chronic monthly offender
    chronic_raw = res.get("chronic_monthly_offender")
    chronic_obj = BreakdownLoomRow(**chronic_raw) if chronic_raw else (monthly_looms[0] if monthly_looms else None)

    # Abnormal patterns
    patterns = [AbnormalPatternRow(**pat) for pat in res.get("abnormal_patterns", [])]

    # Shift breakdown matrix
    shifts = [ShiftBreakdownRow(**s) for s in res.get("shift_breakdown_matrix", [])]

    # Grounded rupee financial exposure
    rupee_dict = res.get("today_financial_exposure") or res.get("today_rupee_loss_total") or {}
    rupee_val = rupee_dict.get("value", 0.0)
    rate_src = rupee_dict.get("rate_source", "ESTIMATED")
    rate_basis = rupee_dict.get("rate_basis", "Calculated from active Style masters")

    rupee_obj = RupeeAmount(
        value=Decimal(str(rupee_val)),
        rate_source=rate_src,
        rate_basis=rate_basis,
    )

    avg_dt = Decimal(str(res.get("avg_downtime_per_event_min", 0.0)))

    return BreakdownSummaryResponse(
        date=date,
        unit_code=unit,
        today_stopped_minutes_total=res.get("today_stopped_minutes_total", 0),
        today_events_count_total=res.get("today_events_count_total", 0),
        today_rupee_loss_total=rupee_obj,
        today_financial_exposure=rupee_obj,
        category_downtime_minutes=res.get("category_downtime_minutes", {}),
        worst_looms_today=worst_looms,
        highest_downtime_loom=highest_obj,
        best_peer_benchmark=peer_obj,
        monthly_top_looms=monthly_looms,
        chronic_monthly_offender=chronic_obj,
        avg_downtime_per_event_min=avg_dt,
        reason_pareto=pareto,
        abnormal_patterns=patterns,
        shift_breakdown_matrix=shifts,
        event_classification_summary=res.get("event_classification_summary", {}),
        micro_stops_minutes=res.get("micro_stops_minutes", 0),
        micro_stops_count=res.get("micro_stops_count", 0),
        breakdown_minutes=res.get("breakdown_minutes", 0),
        breakdown_count=res.get("breakdown_count", 0),
        total_meters_lost=res.get("total_meters_lost", 0.0),
        potential_recovery=res.get("potential_recovery", {}),
        total_rupee_lost=rupee_obj,
        source_mix=["ACTUAL_PLC_STOPS"],
    )


@router.get("/root-cause/events")
def list_root_cause_events(
    unit: str = Query("ATM"),
    date: Optional[datetime.date] = Query(None),
    loom_id: Optional[int] = Query(None),
    shift_id: Optional[int] = Query(None),
    limit: int = Query(50),
    session: Session = Depends(get_session),
):
    """List candidate breakdown StopEvents for Root Cause Investigation."""
    return RootCauseService.list_candidate_events(
        session, unit_code=unit, date=date, loom_id=loom_id, shift_id=shift_id, limit=limit
    )


@router.get("/root-cause/{event_id}")
def get_root_cause_investigation(
    event_id: int,
    session: Session = Depends(get_session),
):
    """Deep investigative telemetry, evidence chain, and baseline for one StopEvent."""
    res = RootCauseService.get_event_investigation(session, event_id=event_id)
    if not res.get("found"):
        http_error(404, "EVENT_NOT_FOUND", res.get("error", "Event not found."))
    return res


@router.get("/anomalies")
def get_breakdown_anomalies(
    unit: str = Query("ATM"),
    date: Optional[datetime.date] = Query(None),
    shift_id: Optional[int] = Query(None),
    loom_id: Optional[int] = Query(None),
    severity: Optional[str] = Query(None),
    session: Session = Depends(get_session),
):
    """Plant-wide breakdown anomaly detection, time-of-day timeline, and baseline deviation."""
    return AnomalyService.detect_anomalies(
        session, unit_code=unit, date=date, shift_id=shift_id, loom_id=loom_id, severity=severity
    )


@router.get("/loss-impact")
def get_breakdown_loss_impact(
    unit: str = Query("ATM"),
    date: Optional[datetime.date] = Query(None),
    window: str = Query("TODAY"),
    session: Session = Depends(get_session),
):
    """Authoritative breakdown financial loss waterfall, category shares, and top loss looms."""
    return BreakdownLossService.get_loss_impact(
        session, unit_code=unit, date=date, window=window
    )


