"""
Tests for /api/v2/looms endpoints and diagnostic sentence logic.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.db_models import Loom
from app.main import app
from app.routers.deps import get_session
from app.routers.loom import _diagnostic_sentence


def test_list_looms_operations_table(client):
    resp = client.get("/api/v2/looms/?unit=ATM&date=2026-07-31&page=1&page_size=200")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] > 100
    assert len(data["looms"]) > 0

    first = data["looms"][0]
    assert "loom_no" in first
    assert "loom_efficiency_pct" in first
    assert "rupee_lost" in first
    assert "rate_source" in first["rupee_lost"]
    assert first["rupee_lost"]["rate_source"] == "ESTIMATED"
    assert "cohort_window" in first


def test_loom_detail_endpoint(client, generated_atm_month):
    session, _ = generated_atm_month
    loom = session.execute(select(Loom).limit(1)).scalar_one()

    resp = client.get(f"/api/v2/looms/{loom.loom_id}/detail?days=30")
    assert resp.status_code == 200
    data = resp.json()
    assert data["loom_id"] == loom.loom_id
    assert data["loom_no"] == loom.loom_no
    assert "trend" in data
    assert "stop_events" in data
    assert "reason_pareto" in data
    assert "diagnostic_sentence" in data
    assert data["diagnostic_sentence"] is not None


def test_diagnostic_sentence_stoppage_vs_speed():
    """
    Test the diagnostic sentence logic directly in both directions:
    1. High performance + low utilization -> 'stoppage problem'
    2. Low performance + high utilization -> 'speed problem'
    """
    # Case 1: stoppage problem (perf=96%, util=75%, loom_eff=72%)
    s1 = _diagnostic_sentence(
        loom_no="AJ-112",
        loom_eff=Decimal("72.0"),
        perf_eff=Decimal("96.0"),
        util=Decimal("75.0"),
    )
    assert "stoppage problem" in s1
    assert "machine-speed problem" in s1

    # Case 2: speed problem (perf=85%, util=92%, loom_eff=78%)
    s2 = _diagnostic_sentence(
        loom_no="AJ-114",
        loom_eff=Decimal("78.0"),
        perf_eff=Decimal("85.0"),
        util=Decimal("92.0"),
    )
    assert "check RPM setting" in s2 or "Speed while running" in s2

    # Case 3: on target (loom_eff=91%)
    s3 = _diagnostic_sentence(
        loom_no="AJ-001",
        loom_eff=Decimal("91.0"),
        perf_eff=Decimal("98.0"),
        util=Decimal("93.0"),
    )
    assert "on target" in s3
