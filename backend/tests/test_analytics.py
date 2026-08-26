"""
Tests for Deterministic Analytics Engine (Q1, Q5, Q21) and Synthetic Anomaly Detection.
"""
import datetime
from decimal import Decimal
from typing import Any
import pytest
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.analytics.production import get_production_variance
from app.analytics.breakdown import get_breakdown_ranking
from app.analytics.revenue import get_revenue_summary
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


def test_q1_production_filters(db_session: Session, seeded_test_db: dict):
    # Filter by department
    res_dept = get_production_variance(db_session, date="2026-08-14", department="Weaving")
    assert len(res_dept["machine_performance"]) == 2
    assert {m["machine_id"] for m in res_dept["machine_performance"]} == {"TOY-01", "TOY-08"}

    # Filter by shift
    res_shift = get_production_variance(db_session, date="2026-08-14", shift=2)
    assert len(res_shift["machine_performance"]) == 2  # Only TOY-01 and TOY-08 have shift 2 in fixture


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

    # Evidence IDs present
    assert len(ranking[0]["evidence"]["breakdown_event_ids"]) == 2
    assert len(res["evidence"]["breakdown_event_ids"]) == 4


def test_q5_breakdown_reason_ranking(db_session: Session, seeded_test_db: dict):
    res = get_breakdown_ranking(db_session, period="today", date="2026-08-14")
    reasons = res["reason_ranking"]
    assert len(reasons) == 4
    # Full cleaning work: 120 min (RF-11)
    assert reasons[0]["reason"] == "Full cleaning work"
    assert reasons[0]["total_downtime_minutes"] == 120


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
    # Liveaco Compact: 1520 + 1560 = 3080
    # VSF Export: 2300
    # Excel Slub: 2050
    assert res["best_style"]["fabric_style"] == "Liveaco Compact"
    assert res["best_style"]["total_revenue"] == 3080.00

    # Revenue loss check: must be deterministically unavailable
    assert res["revenue_loss"]["revenue_loss_available"] is False
    assert "not record customer pricing commitments" in res["revenue_loss"]["reason"]

    # Evidence IDs present
    assert len(res["evidence"]["revenue_log_ids"]) == 4


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
