"""
Integration tests for FastAPI endpoints, request validation, and error response envelopes.
"""
from __future__ import annotations

import datetime
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.db_models import Machine, ProductionLog, BreakdownEvent, RevenueLog


@pytest.fixture()
def api_test_client(db_session: Session) -> TestClient:
    """
    TestClient with dependency override to use the isolated test database session.
    """
    from app.routers.production import get_db as get_db_prod
    from app.routers.breakdown import get_db as get_db_bd
    from app.routers.revenue import get_db as get_db_rev
    from app.routers.ask import get_db as get_db_ask

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db_prod] = override_get_db
    app.dependency_overrides[get_db_bd] = override_get_db
    app.dependency_overrides[get_db_rev] = override_get_db
    app.dependency_overrides[get_db_ask] = override_get_db

    # Seed test data
    m = Machine(
        machine_id="TOY-01",
        unit="Unit I",
        department="Weaving",
        machine_type="Toyota",
        granularity="synthetic_loom_number",
    )
    db_session.add(m)
    db_session.flush()

    d = datetime.date(2026, 8, 29)
    db_session.add(ProductionLog(date=d, shift=1, machine_id="TOY-01", target_qty=20000, actual_qty=19000, efficiency_pct=95.0))
    db_session.add(BreakdownEvent(date=d, shift=1, machine_id="TOY-01", reason="Weft break PBM", duration_minutes=30))
    db_session.add(RevenueLog(date=d, shift=1, machine_id="TOY-01", fabric_style="Excel Slub", revenue=4500.00))
    db_session.flush()

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# Health Check Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_health_check(api_test_client: TestClient):
    res = api_test_client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    res_api = api_test_client.get("/api/health")
    assert res_api.status_code == 200
    assert res_api.json()["status"] == "healthy"


# ─────────────────────────────────────────────────────────────────────────────
# Q1 Production API Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_get_production_variance_valid(api_test_client: TestClient):
    res = api_test_client.get("/api/production/variance?date=2026-08-29")
    assert res.status_code == 200
    body = res.json()

    assert "data" in body
    assert "metadata" in body
    assert "data_quality" in body

    data = body["data"]
    assert data["has_data"] is True
    assert data["summary"]["total_target"] == 20000.0
    assert data["summary"]["total_actual"] == 19000.0
    assert data["summary"]["average_efficiency"] == 95.0
    assert len(data["machine_performance"]) == 1
    assert data["machine_performance"][0]["machine_id"] == "TOY-01"


def test_get_production_variance_invalid_date(api_test_client: TestClient):
    res = api_test_client.get("/api/production/variance?date=not-a-valid-date")
    assert res.status_code == 400
    body = res.json()
    assert "error" in body
    assert body["error"]["code"] == "INVALID_DATE_FORMAT"


def test_get_production_variance_no_data_date(api_test_client: TestClient):
    res = api_test_client.get("/api/production/variance?date=2035-01-01")
    assert res.status_code == 200
    body = res.json()
    assert body["data"]["has_data"] is False
    assert body["data"]["summary"]["total_actual"] == 0.0


# ─────────────────────────────────────────────────────────────────────────────
# Q5 Breakdown API Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_get_breakdown_ranking_valid_today(api_test_client: TestClient):
    res = api_test_client.get("/api/breakdown/ranking?period=today&date=2026-08-29")
    assert res.status_code == 200
    body = res.json()

    assert "data" in body
    assert "metadata" in body
    assert "data_quality" in body

    data = body["data"]
    assert data["has_data"] is True
    assert data["total_downtime_minutes"] == 30
    assert data["total_events"] == 1
    assert data["highest_downtime_machine"]["machine_id"] == "TOY-01"


def test_get_breakdown_ranking_valid_month(api_test_client: TestClient):
    res = api_test_client.get("/api/breakdown/ranking?period=month&date=2026-08-29")
    assert res.status_code == 200
    body = res.json()
    assert body["data"]["period_info"]["period"] == "month"
    assert body["data"]["total_downtime_minutes"] == 30


def test_get_breakdown_ranking_invalid_period(api_test_client: TestClient):
    res = api_test_client.get("/api/breakdown/ranking?period=year&date=2026-08-29")
    assert res.status_code == 400
    body = res.json()
    assert "error" in body
    assert body["error"]["code"] == "INVALID_PERIOD"


# ─────────────────────────────────────────────────────────────────────────────
# Q21 Revenue API Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_get_revenue_summary_valid(api_test_client: TestClient):
    res = api_test_client.get("/api/revenue/summary?date=2026-08-29")
    assert res.status_code == 200
    body = res.json()

    assert "data" in body
    assert "metadata" in body
    assert "data_quality" in body

    data = body["data"]
    assert data["has_data"] is True
    assert data["summary"]["today_revenue"] == 4500.0
    assert data["best_machine"]["machine_id"] == "TOY-01"
    assert data["revenue_loss"]["revenue_loss_available"] is False


def test_get_revenue_summary_invalid_date(api_test_client: TestClient):
    res = api_test_client.get("/api/revenue/summary?date=2026-13-45")
    assert res.status_code == 400
    body = res.json()
    assert "error" in body
    assert body["error"]["code"] == "INVALID_DATE_FORMAT"


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/ask Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_post_ask_production_intent(api_test_client: TestClient):
    payload = {"question": "How did our production perform today?", "date": "2026-08-29"}
    res = api_test_client.post("/api/ask", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert body["scope"] == "Q1"
    assert "answer" in body
    assert "key_findings" in body
    assert "suggestions" in body
    assert "summary" in body["analytics_data"]


def test_post_ask_breakdown_intent(api_test_client: TestClient):
    payload = {"question": "Which machine had the highest breakdown and downtime?", "date": "2026-08-29"}
    res = api_test_client.post("/api/ask", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert body["scope"] == "Q5"
    assert "highest_downtime_machine" in body["analytics_data"]


def test_post_ask_revenue_intent(api_test_client: TestClient):
    payload = {"question": "How is revenue performing across fabric styles?", "date": "2026-08-29"}
    res = api_test_client.post("/api/ask", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert body["scope"] == "Q21"
    assert "best_style" in body["analytics_data"]


def test_post_ask_validation_error(api_test_client: TestClient):
    # Empty question
    payload = {"question": ""}
    res = api_test_client.post("/api/ask", json=payload)
    assert res.status_code == 422
    body = res.json()
    assert "error" in body
    assert body["error"]["code"] == "REQUEST_VALIDATION_ERROR"
