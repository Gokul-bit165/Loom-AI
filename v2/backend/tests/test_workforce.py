"""
Tests for Workforce Intelligence router /api/v2/workforce
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_workforce_overview():
    resp = client.get("/api/v2/workforce/overview")
    assert resp.status_code == 200
    data = resp.json()
    assert data["metrics"]["employees_reviewed"] == 137
    assert data["metrics"]["promotion_ready_count"] >= 5
    assert data["metrics"]["high_capability_count"] == 37
    assert len(data["department_breakdown"]) >= 5
    assert len(data["pds_by_grade"]) >= 5


def test_workforce_employees_filter():
    resp = client.get("/api/v2/workforce/employees?department=AIRJET WEAVING")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_returned"] == 57
    for emp in data["employees"]:
        assert emp["dept"] == "AIRJET WEAVING"


def test_promotion_ready_candidates():
    resp = client.get("/api/v2/workforce/promotion-ready")
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] > 0
    candidate = data["candidates"][0]
    assert "name" in candidate
    assert "readiness_score" in candidate
    assert candidate["readiness_score"] >= 80


def test_loom_capability_matrix():
    resp = client.get("/api/v2/workforce/loom-capability-matrix")
    assert resp.status_code == 200
    data = resp.json()
    assert data["groups"]["8_looms"]["count"] == 37
    assert data["groups"]["7_looms"]["count"] == 17
    assert data["groups"]["4_looms"]["count"] == 5


def test_grade_alignment_mismatches():
    resp = client.get("/api/v2/workforce/grade-alignment-mismatches")
    assert resp.status_code == 200
    data = resp.json()
    assert data["category_a"]["count"] == 8
    assert data["category_b"]["count"] == 7


def test_pay_progression():
    resp = client.get("/api/v2/workforce/pay-progression")
    assert resp.status_code == 200
    data = resp.json()
    assert data["financial_summary"]["daily_increment_budget_rs"] >= 0
    assert data["candidate_count"] >= 8


def test_training_queue():
    resp = client.get("/api/v2/workforce/training-queue")
    assert resp.status_code == 200
    data = resp.json()
    assert data["trainee_count"] >= 5
    assert data["queue_count"] >= 10


def test_single_employee_and_decision():
    resp = client.get("/api/v2/workforce/employee/10518")
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "THANGAMANI SELVARAJ"
    assert data["looms_count"] == 8
    assert data["grade"] == "G1+"

    # Post management review decision
    post_resp = client.post(
        "/api/v2/workforce/employee/10518/decision",
        json={"decision": "APPROVED_FOR_CYCLE", "reviewed_by": "Senior Operations Architect", "notes": "Top 8-loom performer verified"},
    )
    assert post_resp.status_code == 200
    res_data = post_resp.json()
    assert res_data["status"] == "success"
    assert res_data["review"]["decision"] == "APPROVED_FOR_CYCLE"
