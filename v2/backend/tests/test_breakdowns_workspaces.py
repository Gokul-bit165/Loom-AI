"""
Tests for Loom AI v2 — Breakdown Workspaces (Root Cause, Anomalies, Loss Impact).
"""
from __future__ import annotations

import datetime
from decimal import Decimal
import pytest


def test_root_cause_events_and_investigation(client):
    # 1. Candidate events listing
    resp = client.get("/api/v2/breakdowns/root-cause/events?unit=ATM&date=2026-07-31")
    assert resp.status_code == 200
    events = resp.json()
    assert isinstance(events, list)
    assert len(events) > 0

    first_event = events[0]
    event_id = first_event["stop_event_id"]
    assert "loom_no" in first_event
    assert "duration_minutes" in first_event

    # 2. Detailed event investigation
    detail_resp = client.get(f"/api/v2/breakdowns/root-cause/{event_id}")
    assert detail_resp.status_code == 200
    data = detail_resp.json()
    assert data["found"] is True
    assert "event" in data
    assert data["event"]["stop_event_id"] == event_id

    # 3. Evidence timeline
    assert "timeline" in data
    assert len(data["timeline"]) >= 1

    # 4. Baseline comparison
    assert "baseline_comparison" in data
    assert "current_duration_min" in data["baseline_comparison"]
    assert "expected_duration_min" in data["baseline_comparison"]

    # 5. Causal evidence chain
    assert "evidence_chain" in data
    assert any(item["tier"] == "OBSERVED" for item in data["evidence_chain"])

    # 6. Contributing factors
    assert "contributing_factors" in data
    assert len(data["contributing_factors"]) >= 2
    assert "evidence_strength" in data["contributing_factors"][0]

    # 7. Business impact
    assert "business_impact" in data
    assert "lost_meters" in data["business_impact"]
    assert data["business_impact"]["rate_source"] in ("CONFIRMED", "RATE_MISSING")

    # 8. Recommendation
    assert "recommendation" in data
    assert "why_this_step" in data["recommendation"]


def test_anomalies_engine(client):
    resp = client.get("/api/v2/breakdowns/anomalies?unit=ATM&date=2026-07-31")
    assert resp.status_code == 200
    data = resp.json()

    assert "summary" in data
    assert "timeline" in data
    assert "anomalies" in data
    assert data["summary"]["detection_engine_status"] == "ONLINE"
    assert data["summary"]["evaluated_looms_count"] > 0

    if data["anomalies"]:
        first = data["anomalies"][0]
        assert "affected_loom_no" in first
        assert "normal_baseline" in first
        assert "current_value" in first
        assert "pattern_type" in first
        assert "correlated_signals" in first
        assert "impact" in first

    # Severity filtering
    resp_crit = client.get("/api/v2/breakdowns/anomalies?unit=ATM&date=2026-07-31&severity=CRITICAL")
    assert resp_crit.status_code == 200
    crit_data = resp_crit.json()
    for a in crit_data["anomalies"]:
        assert a["severity"] == "CRITICAL"


def test_loss_impact_engine(client):
    resp = client.get("/api/v2/breakdowns/loss-impact?unit=ATM&date=2026-07-31")
    assert resp.status_code == 200
    data = resp.json()

    # 1. Today's loss position
    assert "summary" in data
    summary = data["summary"]
    assert "total_lost_meters" in summary
    assert "total_rupee_exposure" in summary
    assert "worst_shift" in summary

    # 2. Loss waterfall
    assert "waterfall" in data
    assert len(data["waterfall"]) >= 4

    # 3. Category breakdown
    assert "category_breakdown" in data
    assert len(data["category_breakdown"]) >= 3
    total_pct = sum(c["percentage_share"] for c in data["category_breakdown"])
    # Percentages should sum to approx 100%
    assert 95.0 <= total_pct <= 105.0

    # 4. Top loss machines
    assert "top_loss_machines" in data
    assert len(data["top_loss_machines"]) > 0
    # Top machine should have higher or equal rupee exposure than next
    if len(data["top_loss_machines"]) > 1:
        assert data["top_loss_machines"][0]["rupee_exposure"] >= data["top_loss_machines"][1]["rupee_exposure"]

    # 5. Shift breakdown
    assert "shift_breakdown" in data
    assert any(s["is_worst_shift"] is True for s in data["shift_breakdown"])

    # 6. Recovery opportunity
    assert "recovery_opportunity" in data
    assert "potential_recovery_rupees" in data["recovery_opportunity"]
    assert "confirmed_loss_rupees" in data["recovery_opportunity"]

    # 7. Management priorities
    assert "management_priorities" in data
    assert len(data["management_priorities"]) <= 3
