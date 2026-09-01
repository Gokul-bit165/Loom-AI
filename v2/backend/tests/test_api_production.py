"""
Tests for /api/v2/production endpoints.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routers.deps import get_session


def test_production_summary_endpoint(client):
    resp = client.get("/api/v2/production/summary?unit=ATM&date=2026-07-31")
    assert resp.status_code == 200
    data = resp.json()
    assert data["unit_code"] == "ATM"
    assert data["date"] == "2026-07-31"
    assert len(data["shifts"]) == 3
    assert data["day_total"]["shift_code"] == "ALL"
    assert float(data["day_total"]["metres"]) > 0
    assert data["day_total"]["actual_eff"] is not None
    assert 70 <= float(data["day_total"]["actual_eff"]) <= 100
