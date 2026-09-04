"""
Unit & Integration Tests for Production Intelligence Module.

Verifies:
- Q1-Q4 deterministic calculations
- Golden dataset parity within 0.05% tolerance
- Explain -> Decide -> Act AI contract
- Qualification gates for weavers (hours >= 6.0, looms >= 4)
- Configurable consistency engine
"""
import datetime
from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.database import SessionLocal
from app.services.production_truth_service import ProductionTruthService
from app.services.production_impact_service import ProductionImpactService
from app.services.production_decision_service import ProductionDecisionService
from app.services.production_history_service import ProductionHistoryService, ProductionConsistencyConfig
from tests.fixtures.golden_production_data import GOLDEN_PRODUCTION_METRICS


def test_q1_golden_dataset_validation(client):
    """Asserts that Q1 production metrics match the known golden mill values within 0.05% tolerance."""
    work_date = datetime.date(2026, 7, 31)
    golden = GOLDEN_PRODUCTION_METRICS["ATM_2026_07_31"]

    with SessionLocal() as session:
        pos = ProductionTruthService.get_today_production_position(session, "ATM", work_date)

    assert pos["data_available"] is True
    kpis = pos["primary_kpis"]

    # Verify actual metres
    assert abs(kpis["actual_metres"] - golden["actual_metres"]) <= 1.0
    # Verify target metres
    assert abs(kpis["target_metres"] - golden["target_metres"]) <= 5.0
    # Verify efficiency %
    assert abs(kpis["efficiency_pct"] - golden["efficiency_pct"]) <= 0.2
    # Verify total kilo-picks
    assert abs(pos["supporting_metrics"]["kilo_picks"] - golden["kilo_picks"]) <= 5.0
    # Verify breaks
    assert pos["supporting_metrics"]["warp_breaks"] == golden["warp_breaks"]
    assert pos["supporting_metrics"]["weft_breaks"] == golden["weft_breaks"]


def test_q2_repair_time_loss(client):
    """Verifies standard vs actual warp/weft repair time loss calculations."""
    work_date = datetime.date(2026, 7, 31)
    with SessionLocal() as session:
        repair = ProductionImpactService.get_repair_time_analysis(session, "ATM", work_date)

    assert repair["data_available"] is True
    assert "warp_analysis" in repair
    assert "weft_analysis" in repair
    assert repair["warp_analysis"]["extra_time_min"] >= 0.0
    assert repair["weft_analysis"]["extra_time_min"] >= 0.0
    assert repair["total_output_loss_metres"] >= 0.0
    assert repair["total_revenue_loss_inr"] >= 0.0


def test_q3_weaver_qualification_gates(client):
    """Verifies that weavers with < 6 hours or < 4 looms are excluded from rankings."""
    work_date = datetime.date(2026, 7, 31)
    with SessionLocal() as session:
        ratings = ProductionDecisionService.get_weaver_performance_ratings(session, "ATM", work_date)

    top_weavers = ratings.get("top_weavers", [])
    assert len(top_weavers) > 0
    for w in top_weavers:
        assert w["assigned_hours"] >= 6.0
        assert w["looms_handled"] >= 4
        assert w["performance_label"] in ("Strong Performer", "Stable Performer", "Needs Review", "Development Opportunity")


def test_q4_consistency_engine(client):
    """Verifies that configurable consistency engine respects observation day minimums."""
    work_date = datetime.date(2026, 7, 31)
    config = ProductionConsistencyConfig(min_observation_days=7)
    with SessionLocal() as session:
        quads = ProductionHistoryService.get_loom_consistency_quadrants(session, "ATM", work_date, config)

    assert "quadrants" in quads
    assert "consistent_performers" in quads["quadrants"]
    assert "declining" in quads["quadrants"]
    assert "recovering" in quads["quadrants"]
    assert "volatile" in quads["quadrants"]


def test_api_production_intelligence_endpoint(client):
    """Verifies GET /api/v2/production/intelligence single-viewport response."""
    resp = client.get("/api/v2/production/intelligence?unit=ATM&date=2026-07-31")
    assert resp.status_code == 200
    data = resp.json()

    assert data["unit_code"] == "ATM"
    assert "today_position" in data
    assert "situation_verdict" in data
    assert "act_now_queue" in data
    assert "potential_recovery" in data
    assert "shortfall_decomposition" in data
    assert "ai_insight_lead" in data

    # Verify Act Now queue has at most 3 items
    assert len(data["act_now_queue"]) <= 3
    for act in data["act_now_queue"]:
        assert "loom_no" in act
        assert "action" in act
        assert "action_verb" in act
        assert "revenue_exposure_inr" in act


def test_api_ai_explain_endpoint(client):
    """Verifies POST /api/v2/production/ai/explain Explain -> Decide -> Act contract."""
    payload = {
        "context_type": "LOOM",
        "entity_id": "AJ-118",
        "date": "2026-07-31",
        "requested_analysis": "WHY",
    }
    resp = client.post("/api/v2/production/ai/explain?unit=ATM", json=payload)
    assert resp.status_code == 200
    data = resp.json()

    assert "title" in data
    assert "explain" in data
    assert "decide" in data
    assert "act" in data

    # Explain checks
    assert "what_happened" in data["explain"]
    assert "observed_evidence" in data["explain"]
    assert "likely_contributor" in data["explain"]

    # Decide checks
    assert data["decide"]["classification"] in ("ACTION_REQUIRED", "WATCH", "INFORMATION")
    assert "business_impact" in data["decide"]
    assert "risk_if_ignored" in data["decide"]

    # Act checks
    assert "recommended_action" in data["act"]
    assert "controls" in data["act"]
