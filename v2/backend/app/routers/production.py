"""
Loom AI v2 — /api/v2/production router.

Canonical Production Intelligence Module Endpoints:
- GET  /api/v2/production/intelligence : Single-viewport Today workspace (KPIs, Verdict, Act Now, Recovery, AI Lead, Availability)
- GET  /api/v2/production/performance  : Deep loom rankings, Potential Improvement Opportunities, Weaver ratings
- GET  /api/v2/production/shifts       : Shift 1, 2, 3 comparison, telemetry, breaks, downtime
- GET  /api/v2/production/repair-time  : Q2 Warp & Weft repair time loss and financial exposure
- GET  /api/v2/production/history      : Historical performance direction, time-series, consistency quadrants
- GET  /api/v2/production/loom/{id}    : Single-loom 360° drilldown
- POST /api/v2/production/ai/explain   : Dynamic contextual Explain -> Decide -> Act drawer
- GET  /api/v2/production/summary      : Backward-compatible summary endpoint
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, Query, Body
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db_models import Loom, ProductionLog, ShiftMaster, Unit
from app.routers.deps import get_session, http_error
from app.schemas import ProductionSummaryResponse, ShiftSummary
from app.services.production_truth_service import ProductionTruthService
from app.services.production_impact_service import ProductionImpactService
from app.services.production_decision_service import ProductionDecisionService
from app.services.production_ai_service import ProductionAiService
from app.services.production_history_service import ProductionHistoryService, ProductionConsistencyConfig

router = APIRouter()


class ExplainRequest(BaseModel):
    context_type: str = "PRODUCTION_GAP"
    entity_id: Optional[str] = None
    date: str = "2026-07-31"
    shift_id: Optional[str] = None
    requested_analysis: str = "WHY"


@router.get("/intelligence")
def production_intelligence(
    unit: str = Query("ATM"),
    date: Optional[datetime.date] = Query(None),
    session: Session = Depends(get_session),
) -> Dict[str, Any]:
    """
    Single-viewport Today decision payload:
    Target, Actual, Gap, Efficiency, Situation verdict, Act Now recovery queue,
    Potential Recovery, Shortfall decomposition, AI synthesized lead, and Triage summary.
    """
    work_date = ProductionTruthService.get_work_date_or_latest(session, unit, date)

    today_pos = ProductionTruthService.get_today_production_position(session, unit, work_date)
    if not today_pos.get("data_available", True):
        return today_pos

    shortfall_decomp = ProductionImpactService.get_shortfall_decomposition(session, unit, work_date)
    top_losses = ProductionImpactService.get_top_production_losses(session, unit, work_date)
    recovery = ProductionImpactService.get_potential_recovery_estimate(session, unit, work_date)
    verdict = ProductionDecisionService.generate_production_verdict(today_pos, top_losses, shortfall_decomp)
    ai_lead = ProductionAiService.get_synthesized_lead_insight(top_losses, recovery)

    return {
        "unit_code": unit,
        "work_date": work_date.isoformat(),
        "today_position": today_pos,
        "situation_verdict": verdict,
        "act_now_queue": top_losses[:3],
        "top_losses_all": top_losses,
        "potential_recovery": recovery,
        "shortfall_decomposition": shortfall_decomp,
        "ai_insight_lead": ai_lead,
        "data_availability": today_pos.get("data_availability", {}),
    }


@router.get("/performance")
def production_performance(
    unit: str = Query("ATM"),
    date: Optional[datetime.date] = Query(None),
    session: Session = Depends(get_session),
) -> Dict[str, Any]:
    """Q3: Deep loom performance rankings and fair weaver ratings."""
    work_date = ProductionTruthService.get_work_date_or_latest(session, unit, date)
    loom_rankings = ProductionDecisionService.get_loom_performance_rankings(session, unit, work_date)
    weaver_ratings = ProductionDecisionService.get_weaver_performance_ratings(session, unit, work_date)

    return {
        "unit_code": unit,
        "work_date": work_date.isoformat(),
        "loom_performance": loom_rankings,
        "weaver_performance": weaver_ratings,
    }


@router.get("/shifts")
def production_shifts(
    unit: str = Query("ATM"),
    date: Optional[datetime.date] = Query(None),
    session: Session = Depends(get_session),
) -> Dict[str, Any]:
    """Shift 1, 2, 3 performance breakdown and comparison."""
    work_date = ProductionTruthService.get_work_date_or_latest(session, unit, date)
    shifts = ProductionTruthService.get_shift_performance_breakdown(session, unit, work_date)
    return {
        "unit_code": unit,
        "work_date": work_date.isoformat(),
        "shifts": shifts,
    }


@router.get("/repair-time")
def production_repair_time(
    unit: str = Query("ATM"),
    date: Optional[datetime.date] = Query(None),
    session: Session = Depends(get_session),
) -> Dict[str, Any]:
    """Q2: Standard vs actual warp and weft repair time and financial exposure."""
    work_date = ProductionTruthService.get_work_date_or_latest(session, unit, date)
    return ProductionImpactService.get_repair_time_analysis(session, unit, work_date)


@router.get("/history")
def production_history(
    unit: str = Query("ATM"),
    window: str = Query("30D"),
    date: Optional[datetime.date] = Query(None),
    session: Session = Depends(get_session),
) -> Dict[str, Any]:
    """Q4: Historical performance direction, time-series, and consistency quadrants."""
    work_date = ProductionTruthService.get_work_date_or_latest(session, unit, date)
    direction = ProductionHistoryService.get_historical_direction(session, unit, work_date)
    timeline = ProductionHistoryService.get_historical_timeline(session, unit, window, work_date)
    quadrants = ProductionHistoryService.get_loom_consistency_quadrants(session, unit, work_date)

    return {
        "unit_code": unit,
        "work_date": work_date.isoformat(),
        "direction": direction,
        "timeline": timeline,
        "consistency_quadrants": quadrants,
    }


@router.get("/loom/{loom_id}")
def production_loom_drilldown(
    loom_id: int,
    date: Optional[datetime.date] = Query(None),
    session: Session = Depends(get_session),
) -> Dict[str, Any]:
    """Single-loom 360° profile drilldown."""
    work_date = ProductionTruthService.get_work_date_or_latest(session, "ATM", date)
    detail = ProductionHistoryService.get_loom_drilldown_detail(session, loom_id, work_date)
    if not detail.get("found", True):
        http_error(404, "LOOM_NOT_FOUND", f"Loom with ID {loom_id} not found.")
    return detail


@router.post("/ai/explain")
def production_ai_explain(
    req: ExplainRequest = Body(...),
    unit: str = Query("ATM"),
    session: Session = Depends(get_session),
) -> Dict[str, Any]:
    """
    Explain -> Decide -> Act drawer payload:
    Dynamically generates structured evidence, impact, risk of inaction, and action controls.
    """
    try:
        work_date = datetime.date.fromisoformat(req.date)
    except Exception:
        work_date = datetime.date(2026, 7, 31)

    return ProductionAiService.explain_context(
        session=session,
        unit_code=unit,
        context_type=req.context_type,
        entity_id=req.entity_id,
        work_date=work_date,
        shift_id=req.shift_id,
        requested_analysis=req.requested_analysis,
    )


# ── Backward-Compatible Legacy Endpoints ────────────────────────────────────

@router.get("/summary", response_model=ProductionSummaryResponse)
def production_summary(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> ProductionSummaryResponse:
    """Legacy summary endpoint preserving backward compatibility with tests."""
    unit_row = session.execute(select(Unit).where(Unit.code == unit)).scalar_one_or_none()
    if unit_row is None:
        http_error(404, "UNIT_NOT_FOUND", f"Unit '{unit}' does not exist.")

    shifts_meta = session.execute(select(ShiftMaster).order_by(ShiftMaster.code)).scalars().all()
    shift_summaries: list[ShiftSummary] = []
    day_picks = Decimal("0")
    day_metres = Decimal("0")
    day_sched_min = 0
    day_running_min = 0

    for sm in shifts_meta:
        rows = session.execute(
            select(
                func.sum(ProductionLog.actual_picks).label("picks"),
                func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
                func.sum(ProductionLog.scheduled_minutes).label("sched"),
                func.sum(ProductionLog.running_minutes).label("running"),
                func.sum(ProductionLog.metres).label("metres"),
                func.sum(ProductionLog.kilo_picks).label("kilo_picks"),
                func.count(ProductionLog.loom_id).label("loom_count"),
            )
            .join(Loom, Loom.loom_id == ProductionLog.loom_id)
            .where(
                Loom.unit_id == unit_row.unit_id,
                ProductionLog.work_date == date,
                ProductionLog.shift_id == sm.shift_id,
                ProductionLog.is_current == True,
            )
        ).one()

        sched = int(rows.sched or sm.scheduled_minutes or 480)
        rpm = float(rows.avg_rpm or 650)
        picks = int(rows.picks or 0)
        eff = round((picks / (sched * rpm)) * 100.0, 2) if (sched * rpm) > 0 else Decimal("0.0")

        stopped = sched - (int(rows.running or 0))
        shift_summaries.append(
            ShiftSummary(
                shift_code=sm.code,
                target_eff=Decimal("90.0"),
                actual_eff=Decimal(str(eff)),
                metres=Decimal(str(rows.metres or 0)),
                kilo_picks=Decimal(str(rows.kilo_picks or 0)),
                loom_count=int(rows.loom_count or 0),
                stopped_minutes_total=max(0, stopped),
            )
        )
        day_picks += Decimal(str(rows.picks or 0))
        day_metres += Decimal(str(rows.metres or 0))
        day_sched_min += sched
        day_running_min += int(rows.running or 0)

    effs_with_data = [s.actual_eff for s in shift_summaries if s.actual_eff is not None]
    day_eff_avg = round(sum(effs_with_data) / len(effs_with_data), 2) if effs_with_data else None

    return ProductionSummaryResponse(
        date=date,
        unit_code=unit,
        shifts=shift_summaries,
        day_total=ShiftSummary(
            shift_code="ALL",
            target_eff=None,
            actual_eff=day_eff_avg,
            metres=day_metres,
            kilo_picks=Decimal(str(sum(float(s.kilo_picks) for s in shift_summaries))),
            loom_count=max(s.loom_count for s in shift_summaries) if shift_summaries else 0,
            stopped_minutes_total=max(0, day_sched_min - day_running_min),
        ),
        data_as_of=datetime.datetime.now(datetime.timezone.utc),
        source_mix=["ACTUAL", "CONTROLLER_FEED"],
    )


@router.get("/comparison")
def production_comparison(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict:
    from app.services.truth_service import ProductionService
    return ProductionService.get_production_comparison(session, unit, date)
