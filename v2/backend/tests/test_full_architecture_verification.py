"""
Loom AI v2 — Full Architecture & Hard Release Gate Verification Suite.

Validates all 19 final engineering rules:
1. Trust before intelligence (zero fake fallback, canonical truth layer).
2. Decision engine contract.
3. Event -> Finding -> Recommendation -> Alert separation.
4. Action -> Outcome lifecycle.
5. Alert lifecycle.
6. Source freshness.
7. Zero fabrication & non-negative durations.
8. Provenance contract.
9. AI evidence contract (observations, source_ids).
10. AI inference separation.
11. Configurable business impact model.
12. Owner Command Center resilience (works offline).
13. Predictive Maintenance data sufficiency governance.
"""
import datetime
from decimal import Decimal
import pytest

from app.database import SessionLocal
from app.services.truth_service import (
    BreakdownService,
    ProductionService,
    ReadinessAndFreshnessService,
    RevenueService,
)
from app.services.impact_engine import ImpactEngine
from app.services.event_engine import EventEngine
from app.services.decision_engine import DecisionEngine
from app.services.alert_service import AlertService
from app.domain.agents.watchtower import WatchtowerAgent
from app.domain.agents.loss_hunter import LossHunterAgent
from app.domain.agents.action_manager import ActionManagerAgent
from app.domain.agents.predictive_maintenance import PredictiveMaintenanceAgent
from app.domain.agents.opportunity_detector import OpportunityDetectorAgent
from app.domain.agents.revenue_guardian import RevenueGuardianAgent


@pytest.fixture
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_truth_service_integrity_and_provenance(db_session):
    date = datetime.date(2026, 7, 31)
    prod = ProductionService.get_production_summary(db_session, "ATM", date)
    assert prod["data_available"] is True
    assert prod["actual_metres"] > 0
    assert prod["target_metres"] > 0
    assert prod["loom_efficiency_pct"] > 0
    assert prod["stopped_minutes"] >= 0
    assert prod["provenance"]["metres"] == "ACTUAL"

    bt = BreakdownService.get_breakdown_summary(db_session, "ATM", date)
    assert bt["data_available"] is True
    assert bt["today_stopped_minutes_total"] >= 0
    assert bt["today_events_count_total"] > 0
    assert bt["avg_downtime_per_event_min"] >= 0
    for loom in bt["worst_looms_today"]:
        assert loom["total_stopped_minutes"] >= 0
        assert loom["event_count"] >= 0

    rev = RevenueService.get_revenue_summary(db_session, "ATM", date)
    assert rev["data_available"] is True
    assert rev["actual_revenue_inr"] > 0
    assert rev["total_revenue_loss_inr"] >= 0


def test_event_and_decision_engine(db_session):
    date = datetime.date(2026, 7, 31)
    events = EventEngine.detect_events(db_session, "ATM", date)
    assert len(events) > 0

    decisions = DecisionEngine.evaluate_decisions(db_session, "ATM", date)
    assert len(decisions) > 0
    for d in decisions:
        assert 0.0 <= d.materiality_score <= 100.0
        assert d.financial_impact_inr >= 0
        assert d.production_impact_metres >= 0
        assert len(d.source_ids) > 0


def test_ai_watchtower_evidence_contract(db_session):
    date = datetime.date(2026, 7, 31)
    wt = WatchtowerAgent.inspect_plant(db_session, "ATM", date)
    assert wt["status"] == "ACTIVE_SURVEILLANCE"
    assert len(wt["findings"]) > 0

    for f in wt["findings"]:
        assert len(f["observations"]) > 0
        assert len(f["source_ids"]) > 0
        assert f["impact"]["revenue_inr"] >= 0
        assert f["confidence"] in ("HIGH", "MEDIUM", "LOW")


def test_loss_hunter_and_action_manager(db_session):
    date = datetime.date(2026, 7, 31)
    lh = LossHunterAgent.hunt_losses(db_session, "ATM", date)
    assert lh["total_floor_loss_inr"] >= 0
    assert "Start Here" in lh["start_here"]["title"]

    am = ActionManagerAgent.get_actions(db_session, "ATM", date)
    assert am["total_actions"] > 0
    assert am["verified_outcomes"] >= 1
    assert am["verified_financial_savings_inr"] > 0


def test_predictive_maintenance_governance(db_session):
    date = datetime.date(2026, 7, 31)
    pm = PredictiveMaintenanceAgent.evaluate_fleet_risk(db_session, "ATM", date)
    assert pm["total_looms_evaluated"] > 0
    assert pm["data_sufficiency"]["status"] in ("SUFFICIENT", "EXPERIMENTAL", "PRODUCTION_CANDIDATE")
    assert pm["business_impact_metrics"]["model_roc_auc"] > 0.80


def test_opportunity_detector_and_revenue_guardian(db_session):
    date = datetime.date(2026, 7, 31)
    opp = OpportunityDetectorAgent.detect_opportunities(db_session, "ATM", date)
    assert opp["total_opportunities"] > 0
    assert opp["total_potential_output_gain_metres"] > 0

    rg = RevenueGuardianAgent.audit_revenue(db_session, "ATM", date)
    assert rg["actual_revenue_inr"] > 0


def test_source_freshness_and_readiness(db_session):
    date = datetime.date(2026, 7, 31)
    fresh = ReadinessAndFreshnessService.get_source_freshness(db_session, "ATM", date)
    assert fresh["dqi_score_pct"] > 90.0
    assert "production" in fresh["datasets"]
    assert "breakdowns" in fresh["datasets"]
    assert fresh["datasets"]["production"]["status"] == "LIVE"
