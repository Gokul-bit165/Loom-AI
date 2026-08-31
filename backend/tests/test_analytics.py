"""
Tests for Deterministic Analytics Engine (Q1, Q5, Q21) and Rule-Based Recommendations.
"""
import datetime
from decimal import Decimal
from typing import Any
import pytest
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.analytics.production import get_production_variance, get_production_trend
from app.analytics.breakdown import get_breakdown_ranking
from app.analytics.revenue import get_revenue_summary
from app.analytics.recommendations import (
    generate_recommendations,
    get_production_recommendations,
    get_breakdown_recommendations,
    get_revenue_recommendations,
)
from app.analytics.common import PerformanceStatus, classify_performance
from app.db_models import Machine, ProductionLog, BreakdownEvent, RevenueLog


@pytest.fixture()
def seeded_test_db(db_session: Session) -> dict[str, Any]:
    """
    Populates test database with a multi-day scenario:
    - 2 weaving machines: TOY-01 (healthy), TOY-08 (chronic underperformer)
    - 2 spinning machines: RF-01 (healthy), RF-11 (chronic underperformer)
    - Dates: 2026-08-13 (previous day) and 2026-08-14 (target day)
    - Includes breakdowns, shifts, and revenues
    """
    m1 = Machine(machine_id="TOY-01", unit="Unit I", department="Weaving", machine_type="Toyota", granularity="synthetic_loom_number")
    m2 = Machine(machine_id="TOY-08", unit="Unit I", department="Weaving", machine_type="Toyota", granularity="synthetic_loom_number")
    m3 = Machine(machine_id="RF-01", unit="Unit I", department="Spinning", machine_type="RingFrame", granularity="real_grounded")
    m4 = Machine(machine_id="RF-11", unit="Unit I", department="Spinning", machine_type="RingFrame", granularity="real_grounded")
    db_session.add_all([m1, m2, m3, m4])
    db_session.flush()

    d_prev = datetime.date(2026, 8, 13)
    d_curr = datetime.date(2026, 8, 14)

    # 1. Production entries
    # Day 1
    db_session.add(ProductionLog(date=d_prev, shift=1, machine_id="TOY-01", target_qty=10000, actual_qty=9600, efficiency_pct=96.0))
    db_session.add(ProductionLog(date=d_prev, shift=1, machine_id="TOY-08", target_qty=10000, actual_qty=7800, efficiency_pct=78.0))
    db_session.add(ProductionLog(date=d_prev, shift=1, machine_id="RF-01", target_qty=2500, actual_qty=2450, efficiency_pct=98.0))
    db_session.add(ProductionLog(date=d_prev, shift=1, machine_id="RF-11", target_qty=2500, actual_qty=1900, efficiency_pct=76.0))

    # Day 2 (Target date)
    db_session.add(ProductionLog(date=d_curr, shift=1, machine_id="TOY-01", target_qty=10000, actual_qty=9500, efficiency_pct=95.0))
    db_session.add(ProductionLog(date=d_curr, shift=2, machine_id="TOY-01", target_qty=10000, actual_qty=9700, efficiency_pct=97.0))
    db_session.add(ProductionLog(date=d_curr, shift=1, machine_id="TOY-08", target_qty=10000, actual_qty=7700, efficiency_pct=77.0))
    db_session.add(ProductionLog(date=d_curr, shift=2, machine_id="TOY-08", target_qty=10000, actual_qty=7900, efficiency_pct=79.0))
    db_session.add(ProductionLog(date=d_curr, shift=1, machine_id="RF-01", target_qty=2500, actual_qty=2400, efficiency_pct=96.0))
    db_session.add(ProductionLog(date=d_curr, shift=1, machine_id="RF-11", target_qty=2500, actual_qty=1850, efficiency_pct=74.0))

    # 2. Breakdown entries
    db_session.add(BreakdownEvent(date=d_curr, shift=1, machine_id="TOY-08", reason="Loom runout", duration_minutes=90))
    db_session.add(BreakdownEvent(date=d_curr, shift=2, machine_id="TOY-08", reason="Weft break PBM", duration_minutes=45))
    db_session.add(BreakdownEvent(date=d_curr, shift=1, machine_id="RF-11", reason="Full cleaning work", duration_minutes=120))
    db_session.add(BreakdownEvent(date=d_curr, shift=1, machine_id="TOY-01", reason="Voltage fluctuation PBM", duration_minutes=15))

    # 3. Revenue entries (Weaving only)
    db_session.add(RevenueLog(date=d_prev, shift=1, machine_id="TOY-01", fabric_style="Excel Slub", revenue=2100.00))
    db_session.add(RevenueLog(date=d_prev, shift=1, machine_id="TOY-08", fabric_style="Liveaco Compact", revenue=1500.00))

    db_session.add(RevenueLog(date=d_curr, shift=1, machine_id="TOY-01", fabric_style="Excel Slub", revenue=2050.00))
    db_session.add(RevenueLog(date=d_curr, shift=2, machine_id="TOY-01", fabric_style="VSF Export", revenue=2300.00))
    db_session.add(RevenueLog(date=d_curr, shift=1, machine_id="TOY-08", fabric_style="Liveaco Compact", revenue=1520.00))
    db_session.add(RevenueLog(date=d_curr, shift=2, machine_id="TOY-08", fabric_style="Liveaco Compact", revenue=1560.00))

    db_session.flush()
    return {"target_date": d_curr, "prev_date": d_prev}


# ─────────────────────────────────────────────────────────────────────────────
# Q1 Production Analytics Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_q1_production_variance_summary(db_session: Session, seeded_test_db: dict):
    res = get_production_variance(db_session, date="2026-08-14")
    summary = res["summary"]

    assert summary["date"] == "2026-08-14"
    # Target: TOY-01(20k) + TOY-08(20k) + RF-01(2.5k) + RF-11(2.5k) = 45,000
    assert summary["total_target"] == 45000.0
    # Actual: TOY-01(19.2k) + TOY-08(15.6k) + RF-01(2.4k) + RF-11(1.85k) = 39,050
    assert summary["total_actual"] == 39050.0
    assert summary["variance_qty"] == -5950.0
    assert summary["variance_pct"] == round((-5950.0 / 45000.0) * 100, 2)
    assert summary["average_efficiency"] == round((39050.0 / 45000.0) * 100, 2)

    # Previous day actual: 9600 + 7800 + 2450 + 1900 = 21,750
    assert summary["previous_day_actual"] == 21750.0
    assert summary["change_vs_previous_day_pct"] is not None


def test_q1_production_machine_performance_and_classification(db_session: Session, seeded_test_db: dict):
    res = get_production_variance(db_session, date="2026-08-14")
    perf = res["machine_performance"]
    assert len(perf) == 4

    perf_by_id = {m["machine_id"]: m for m in perf}

    # TOY-01: 19,200 / 20,000 = 96.0% -> OPTIMAL
    assert perf_by_id["TOY-01"]["efficiency"] == 96.0
    assert perf_by_id["TOY-01"]["performance_status"] == PerformanceStatus.OPTIMAL.value
    assert len(perf_by_id["TOY-01"]["evidence"]["production_log_ids"]) == 2

    # TOY-08: 15,600 / 20,000 = 78.0% -> CRITICAL
    assert perf_by_id["TOY-08"]["efficiency"] == 78.0
    assert perf_by_id["TOY-08"]["performance_status"] == PerformanceStatus.CRITICAL.value

    # RF-11: 1,850 / 2,500 = 74.0% -> CRITICAL
    assert perf_by_id["RF-11"]["efficiency"] == 74.0
    assert perf_by_id["RF-11"]["performance_status"] == PerformanceStatus.CRITICAL.value


def test_q1_production_trailing_averages_and_loss_estimate(db_session: Session, seeded_test_db: dict):
    res = get_production_variance(db_session, date="2026-08-14")

    # Trailing averages on 2026-08-14 strictly look at 2026-08-13 (21,750 total)
    assert res["trailing_averages"]["avg_7d"]["average_actual"] == 21750.0
    assert res["trailing_averages"]["avg_7d"]["days_with_data"] == 1
    assert res["trailing_averages"]["avg_30d"]["average_actual"] == 21750.0

    # Production loss estimate:
    # TOY-08 shift 1: (10000/8) * (90/60) = 1250 * 1.5 = 1875
    # TOY-08 shift 2: (10000/8) * (45/60) = 1250 * 0.75 = 937.5
    # TOY-08 total = 2812.5
    # RF-11 shift 1: (2500/8) * (120/60) = 312.5 * 2 = 625
    # TOY-01 shift 1: (10000/8) * (15/60) = 1250 * 0.25 = 312.5
    # Total loss = 2812.5 + 625 + 312.5 = 3750.0
    loss = res["production_loss"]
    assert loss["is_estimated"] is True
    assert loss["estimated_production_loss_qty"] == 3750.0
    assert len(loss["machines_with_loss"]) == 3
    assert loss["machines_with_loss"][0]["machine_id"] == "TOY-08"
    assert loss["machines_with_loss"][0]["estimated_loss_qty"] == 2812.5

    # Best and worst machines
    assert res["worst_machine"]["machine_id"] == "RF-11"
    assert res["best_machine"]["machine_id"] == "TOY-01"
    assert res["largest_variance_machine"]["machine_id"] == "TOY-08"
    assert res["biggest_loss_contributor"]["machine_id"] == "TOY-08"


def test_q1_production_trend(db_session: Session, seeded_test_db: dict):
    res = get_production_trend(db_session, date="2026-08-14", days=7)
    assert res["days"] == 7
    assert len(res["trend_points"]) == 7
    # Last point is today (2026-08-14)
    last_pt = res["trend_points"][-1]
    assert last_pt["date"] == "2026-08-14"
    assert last_pt["actual"] == 39050.0
    assert last_pt["target"] == 45000.0
    assert last_pt["efficiency"] == 86.78
    assert "(Today)" in last_pt["day"]


def test_q1_production_filters(db_session: Session, seeded_test_db: dict):
    # Filter by department
    res_dept = get_production_variance(db_session, date="2026-08-14", department="Weaving")
    assert len(res_dept["machine_performance"]) == 2
    assert {m["machine_id"] for m in res_dept["machine_performance"]} == {"TOY-01", "TOY-08"}

    # Filter by shift
    res_shift = get_production_variance(db_session, date="2026-08-14", shift=2)
    assert len(res_shift["machine_performance"]) == 2


def test_q1_production_empty_date(db_session: Session):
    res = get_production_variance(db_session, date="2030-01-01")
    assert res["summary"]["total_target"] == 0.0
    assert res["summary"]["total_actual"] == 0.0
    assert len(res["machine_performance"]) == 0
    assert len(res["evidence"]["production_log_ids"]) == 0


# ─────────────────────────────────────────────────────────────────────────────
# Q5 Breakdown Analytics Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_q5_breakdown_ranking_today(db_session: Session, seeded_test_db: dict):
    res = get_breakdown_ranking(db_session, period="today", date="2026-08-14")

    # Total downtime: TOY-08 (90+45=135) + RF-11 (120) + TOY-01 (15) = 270 min
    assert res["total_downtime_minutes"] == 270
    assert res["total_events"] == 4
    assert res["average_event_duration"] == 67.5

    ranking = res["machine_ranking"]
    assert len(ranking) == 3

    # Highest downtime machine: TOY-08 (135 min)
    assert ranking[0]["machine_id"] == "TOY-08"
    assert ranking[0]["downtime_minutes"] == 135
    assert ranking[0]["event_count"] == 2
    assert ranking[0]["average_event_duration"] == 67.5
    assert ranking[0]["percentage_of_total_downtime"] == 50.0

    assert res["highest_downtime_machine"]["machine_id"] == "TOY-08"
    assert res["lowest_downtime_machine"]["machine_id"] == "TOY-01"
    assert res["most_breakdown_events_machine"]["machine_id"] == "TOY-08"

    # Shift ranking
    # Shift 1: TOY-08(90) + RF-11(120) + TOY-01(15) = 225 min (83.33%)
    # Shift 2: TOY-08(45) = 45 min (16.67%)
    assert len(res["shift_ranking"]) == 2
    assert res["highest_downtime_shift"]["shift"] == 1
    assert res["highest_downtime_shift"]["downtime_minutes"] == 225

    # Evidence IDs present
    assert len(ranking[0]["evidence"]["breakdown_event_ids"]) == 2
    assert len(res["evidence"]["breakdown_event_ids"]) == 4


def test_q5_breakdown_reason_ranking_and_pareto(db_session: Session, seeded_test_db: dict):
    res = get_breakdown_ranking(db_session, period="today", date="2026-08-14")
    reasons = res["reason_ranking"]
    assert len(reasons) == 4
    # Full cleaning work: 120 min (RF-11)
    assert reasons[0]["reason"] == "Full cleaning work"
    assert reasons[0]["total_downtime_minutes"] == 120
    assert "cumulative_percentage" in reasons[0]
    # Last reason cumulative percentage must be 100.0
    assert reasons[-1]["cumulative_percentage"] == 100.0


def test_q5_breakdown_month_period(db_session: Session, seeded_test_db: dict):
    res = get_breakdown_ranking(db_session, period="month", date="2026-08-14")
    assert res["period_info"]["period"] == "month"
    assert res["period_info"]["start_date"] == "2026-08-01"
    assert res["total_downtime_minutes"] == 270


# ─────────────────────────────────────────────────────────────────────────────
# Q21 Revenue Analytics Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_q21_revenue_summary(db_session: Session, seeded_test_db: dict):
    res = get_revenue_summary(db_session, date="2026-08-14")
    summary = res["summary"]

    # Today revenue: TOY-01 (2050+2300=4350) + TOY-08 (1520+1560=3080) = 7430.00
    assert summary["today_revenue"] == 7430.00
    # Previous day revenue: TOY-01 (2100) + TOY-08 (1500) = 3600.00
    assert summary["previous_day_revenue"] == 3600.00
    # MTD revenue: 3600 + 7430 = 11030.00
    assert summary["mtd_revenue"] == 11030.00

    # Best & worst machine
    assert res["best_machine"]["machine_id"] == "TOY-01"
    assert res["best_machine"]["total_revenue"] == 4350.00
    assert res["worst_machine"]["machine_id"] == "TOY-08"
    assert res["worst_machine"]["total_revenue"] == 3080.00

    # Fabric style ranking
    assert res["best_style"]["fabric_style"] == "Liveaco Compact"
    assert res["best_style"]["total_revenue"] == 3080.00

    # Revenue loss check: estimated loss from downtime
    rev_loss = res["revenue_loss"]
    assert rev_loss["is_estimated"] is True
    assert rev_loss["revenue_loss_available"] is False
    assert rev_loss["estimated_revenue_loss"] > 0.0
    # TOY-08 shift 1: (1520/8) * (90/60) = 190 * 1.5 = 285.0
    # TOY-08 shift 2: (1560/8) * (45/60) = 195 * 0.75 = 146.25
    # TOY-01 shift 1: (2050/8) * (15/60) = 256.25 * 0.25 = 64.0625
    # Total = 285 + 146.25 + 64.06 = 495.31
    assert round(rev_loss["estimated_revenue_loss"], 2) == 495.31
    assert res["biggest_revenue_loss_contributor"]["machine_id"] == "TOY-08"

    # Evidence IDs present
    assert len(res["evidence"]["revenue_log_ids"]) == 4


# ─────────────────────────────────────────────────────────────────────────────
# Recommendation Engine Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_recommendation_engine_generates_evidence_grounded_rules(db_session: Session, seeded_test_db: dict):
    prod_data = get_production_variance(db_session, date="2026-08-14")
    bd_data = get_breakdown_ranking(db_session, period="today", date="2026-08-14")
    rev_data = get_revenue_summary(db_session, date="2026-08-14")

    recs = generate_recommendations(
        production_data=prod_data,
        breakdown_data=bd_data,
        revenue_data=rev_data,
    )

    assert len(recs) >= 3
    # Check that recommendation objects follow required schema
    for r in recs:
        assert r["priority"] in ("CRITICAL", "HIGH", "MEDIUM", "LOW")
        assert len(r["issue"]) > 5
        assert len(r["evidence"]) > 5
        assert len(r["suggested_action"]) > 5
        assert len(r["expected_impact"]) > 5
        assert r["confidence"] in ("VERY HIGH", "HIGH", "MEDIUM")
        assert isinstance(r["source_metrics"], dict)

    # Critical underperformer rule must trigger for TOY-08 and RF-11
    priorities = [r["priority"] for r in recs]
    assert "CRITICAL" in priorities

    issues = [r["issue"] for r in recs]
    assert any("TOY-08" in iss for iss in issues)
    assert any("RF-11" in iss for iss in issues)


# ─────────────────────────────────────────────────────────────────────────────
# Synthetic Anomaly Detection Verification
# ─────────────────────────────────────────────────────────────────────────────

def test_algorithm_discovers_chronic_underperformers(db_session: Session, seeded_test_db: dict):
    """
    Verifies that the analytics algorithms automatically classify
    RF-11 and TOY-08 as underperforming based purely on computed metrics,
    without any hardcoded machine ID assumptions in the analytics logic.
    """
    prod_res = get_production_variance(db_session, date="2026-08-14")
    bad_machines = [
        m["machine_id"]
        for m in prod_res["machine_performance"]
        if m["performance_status"] in (PerformanceStatus.UNDERPERFORMING.value, PerformanceStatus.CRITICAL.value)
    ]

    assert "TOY-08" in bad_machines
    assert "RF-11" in bad_machines
    assert "TOY-01" not in bad_machines
    assert "RF-01" not in bad_machines
