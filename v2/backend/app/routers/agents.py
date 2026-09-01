"""
Loom AI v2 — /api/v2/agents router.

Thin router layer delegating to isolated domain agents and canonical truth services:
1. AI Watchtower
2. Loss Hunter
3. Action Manager
4. Predictive Maintenance
5. Production Opportunity Detector
6. Revenue & Loss Guardian
"""
from __future__ import annotations

import datetime
from typing import Any, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.domain.agents.action_manager import ActionManagerAgent
from app.domain.agents.loss_hunter import LossHunterAgent
from app.domain.agents.opportunity_detector import OpportunityDetectorAgent
from app.domain.agents.predictive_maintenance import PredictiveMaintenanceAgent
from app.domain.agents.revenue_guardian import RevenueGuardianAgent
from app.domain.agents.watchtower import WatchtowerAgent
from app.routers.deps import get_session
from app.services.alert_service import AlertService
from app.services.decision_engine import DecisionEngine
from app.services.truth_service import ReadinessAndFreshnessService

router = APIRouter()


class ActionUpdateRequest(BaseModel):
    status: str  # OPEN, ACKNOWLEDGED, ASSIGNED, STARTED, COMPLETED, VERIFIED
    assignee: Optional[str] = None
    action_taken: Optional[str] = None
    outcome_status: Optional[str] = None


@router.get("/overview")
def get_agents_overview(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    wt = WatchtowerAgent.inspect_plant(session, unit, date)
    lh = LossHunterAgent.hunt_losses(session, unit, date)
    am = ActionManagerAgent.get_actions(session, unit, date)
    pm = PredictiveMaintenanceAgent.evaluate_fleet_risk(session, unit, date)
    od = OpportunityDetectorAgent.detect_opportunities(session, unit, date)
    rg = RevenueGuardianAgent.audit_revenue(session, unit, date)
    freshness = ReadinessAndFreshnessService.get_source_freshness(session, unit, date)
    alerts = AlertService.generate_alerts(session, unit, date)

    return {
        "unit_code": unit,
        "work_date": date.isoformat(),
        "freshness": freshness,
        "active_alerts_count": len(alerts),
        "agents": {
            "watchtower": {
                "name": "AI Watchtower",
                "status": wt.get("status", "ACTIVE"),
                "findings_count": wt.get("findings_count", 0),
            },
            "loss_hunter": {
                "name": "Loss Hunter",
                "total_loss_inr": lh.get("total_floor_loss_inr", 0.0),
                "top_loss_driver": lh.get("start_here", {}).get("title", ""),
            },
            "action_manager": {
                "name": "Action Manager",
                "total_actions": am.get("total_actions", 0),
                "open_actions": am.get("open_actions", 0),
                "verified_savings_inr": am.get("verified_financial_savings_inr", 0.0),
            },
            "predictive_maintenance": {
                "name": "Predictive Maintenance",
                "high_risk_looms": pm.get("high_risk_count", 0),
                "data_sufficiency": pm.get("data_sufficiency", {}).get("status", "READY"),
            },
            "opportunity_detector": {
                "name": "Opportunity Detector",
                "potential_output_gain_m": od.get("total_potential_output_gain_metres", 0.0),
                "potential_revenue_gain_inr": od.get("total_potential_revenue_gain_inr", 0.0),
            },
            "revenue_guardian": {
                "name": "Revenue Guardian",
                "revenue_at_risk_inr": rg.get("total_revenue_at_risk_inr", 0.0),
                "exposure_pct": rg.get("exposure_share_pct", 0.0),
            },
        },
    }


@router.get("/watchtower")
def get_watchtower_findings(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    return WatchtowerAgent.inspect_plant(session, unit, date)


@router.get("/loss-hunter")
def get_loss_hunter(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    return LossHunterAgent.hunt_losses(session, unit, date)


@router.get("/action-manager")
def get_action_manager(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    return ActionManagerAgent.get_actions(session, unit, date)


@router.get("/predictive-maintenance")
def get_predictive_maintenance(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    return PredictiveMaintenanceAgent.evaluate_fleet_risk(session, unit, date)


@router.get("/opportunity-detector")
def get_opportunity_detector(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    return OpportunityDetectorAgent.detect_opportunities(session, unit, date)


@router.get("/revenue-guardian")
def get_revenue_guardian(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    return RevenueGuardianAgent.audit_revenue(session, unit, date)


@router.get("/alerts")
def get_persistent_alerts(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> list[dict[str, Any]]:
    alerts = AlertService.generate_alerts(session, unit, date)
    return [a.dict() for a in alerts]


@router.get("/freshness")
def get_source_freshness(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    return ReadinessAndFreshnessService.get_source_freshness(session, unit, date)


@router.get("/decisions")
def get_decision_stream(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> list[dict[str, Any]]:
    decisions = DecisionEngine.evaluate_decisions(session, unit, date)
    return [d.dict() for d in decisions]
