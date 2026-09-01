"""
Tests for /api/v2/breakdown endpoints.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routers.deps import get_session


def test_breakdown_summary_endpoint(client):
    resp = client.get("/api/v2/breakdown/summary?unit=ATM&date=2026-07-31")
    assert resp.status_code == 200
    data = resp.json()
    assert data["unit_code"] == "ATM"
    assert "worst_looms_today" in data
    assert "monthly_top_looms" in data
    assert "reason_pareto" in data
    assert "total_rupee_lost" in data
    assert "value" in data["total_rupee_lost"]
    assert "rate_source" in data["total_rupee_lost"]
    assert data["total_rupee_lost"]["rate_source"] == "ESTIMATED"
