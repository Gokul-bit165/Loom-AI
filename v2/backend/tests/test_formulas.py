"""
Unit tests for app.analytics.formulas.

Every formula gets: a normal case, a zero-denominator case, and a
None-input case, per docs/V2_DESIGN.md task 0.4 definition of done.
These tests need no database — formulas.py is pure Python.
"""
import datetime
from decimal import Decimal

from app.analytics import formulas as f


# ── loom_efficiency_pct (THE mill's EFF% — correction #1) ──────────────────

def test_loom_efficiency_pct_normal():
    # 40000 picks at 400 rpm over 480 scheduled minutes = 40000/(400*480)*100
    result = f.loom_efficiency_pct(actual_picks=172_800, std_rpm=400, scheduled_min=480)
    assert result == Decimal("90.00")


def test_loom_efficiency_pct_zero_scheduled_min():
    assert f.loom_efficiency_pct(actual_picks=1000, std_rpm=400, scheduled_min=0) is None


def test_loom_efficiency_pct_none_input():
    assert f.loom_efficiency_pct(actual_picks=None, std_rpm=400, scheduled_min=480) is None
    assert f.loom_efficiency_pct(actual_picks=1000, std_rpm=None, scheduled_min=480) is None


# ── performance_eff_pct (diagnostic, running-time basis) ────────────────────

def test_performance_eff_pct_normal():
    # Same picks over fewer (running) minutes => higher than loom_efficiency_pct
    result = f.performance_eff_pct(actual_picks=172_800, std_rpm=400, running_min=432)
    assert result == Decimal("100.00")


def test_performance_eff_pct_zero_running_min():
    assert f.performance_eff_pct(actual_picks=1000, std_rpm=400, running_min=0) is None


def test_performance_eff_pct_none_input():
    assert f.performance_eff_pct(None, 400, 480) is None


# ── utilization_pct + the reconciliation identity (correction #1) ──────────

def test_utilization_pct_normal():
    assert f.utilization_pct(running_min=432, scheduled_min=480) == Decimal("90.00")


def test_utilization_pct_zero_scheduled():
    assert f.utilization_pct(running_min=432, scheduled_min=0) is None


def test_utilization_pct_none_input():
    assert f.utilization_pct(None, 480) is None


def test_loom_efficiency_reconciles_with_performance_and_utilization():
    actual_picks, std_rpm, running_min, scheduled_min = 172_800, 400, 432, 480
    loom_eff = f.loom_efficiency_pct(actual_picks, std_rpm, scheduled_min)
    perf_eff = f.performance_eff_pct(actual_picks, std_rpm, running_min)
    util = f.utilization_pct(running_min, scheduled_min)
    implied = perf_eff * util / 100
    assert abs(implied - loom_eff) <= Decimal("0.5")


# ── kilo_picks / picks_per_metre_from_pick_density (correction #3) ─────────

def test_kilo_picks_normal():
    assert f.kilo_picks(picks_per_metre=2161, metres=1000) == Decimal("2161.0000")


def test_kilo_picks_none_input():
    assert f.kilo_picks(None, 1000) is None


def test_kilo_picks_zero_metres():
    assert f.kilo_picks(2161, 0) == Decimal("0.0000")


def test_picks_per_metre_from_pick_density_normal():
    # 55 picks/inch (the '66X55' style) -> 55 * 39.3701 = 2165.3555 -> rounds to 2165.356
    result = f.picks_per_metre_from_pick_density(55)
    assert abs(result - Decimal("2165.356")) < Decimal("0.01")


def test_picks_per_metre_from_pick_density_none_input():
    assert f.picks_per_metre_from_pick_density(None) is None


# ── breaks per 1000 picks ───────────────────────────────────────────────────

def test_warp_breaks_per_1000_normal():
    assert f.warp_breaks_per_1000(warp_breaks=5, actual_picks=10_000) == Decimal("0.500")


def test_warp_breaks_per_1000_zero_picks():
    assert f.warp_breaks_per_1000(warp_breaks=5, actual_picks=0) is None


def test_weft_breaks_per_1000_none_input():
    assert f.weft_breaks_per_1000(None, 10_000) is None


# ── cohort_gap_pp ────────────────────────────────────────────────────────────

def test_cohort_gap_pp_normal():
    assert f.cohort_gap_pp(loom_efficiency_pct_value=82.0, cohort_median_eff=90.0) == Decimal("-8.00")


def test_cohort_gap_pp_none_cohort():
    assert f.cohort_gap_pp(82.0, None) is None


def test_cohort_gap_pp_none_loom():
    assert f.cohort_gap_pp(None, 90.0) is None


# ── mtbf_hours / mttr_min / response_min ────────────────────────────────────

def test_mtbf_hours_normal():
    assert f.mtbf_hours(running_min_total=1200, stop_count=4) == Decimal("5.00")


def test_mtbf_hours_zero_stop_count():
    assert f.mtbf_hours(running_min_total=1200, stop_count=0) is None


def test_mtbf_hours_none_input():
    assert f.mtbf_hours(None, 4) is None


def test_mttr_min_normal():
    attending = datetime.datetime(2026, 7, 1, 10, 0, 0)
    resolved = datetime.datetime(2026, 7, 1, 10, 35, 0)
    assert f.mttr_min(resolved, attending) == Decimal("35.00")


def test_mttr_min_none_unresolved():
    attending = datetime.datetime(2026, 7, 1, 10, 0, 0)
    assert f.mttr_min(None, attending) is None


def test_response_min_normal():
    raised = datetime.datetime(2026, 7, 1, 10, 0, 0)
    acked = datetime.datetime(2026, 7, 1, 10, 8, 0)
    assert f.response_min(acked, raised) == Decimal("8.00")


def test_response_min_none_input():
    assert f.response_min(None, None) is None


# ── lost_metres / lost_revenue ──────────────────────────────────────────────

def test_lost_metres_normal():
    # rate = 1000 metres / 480 running min = 2.0833 m/min; * 60 stopped min
    result = f.lost_metres(metres=1000, running_min=480, stopped_min=60)
    assert abs(result - Decimal("125.0")) < Decimal("0.1")


def test_lost_metres_zero_running_min():
    assert f.lost_metres(metres=1000, running_min=0, stopped_min=60) is None


def test_lost_metres_none_input():
    assert f.lost_metres(None, 480, 60) is None


def test_lost_revenue_normal():
    value, rate_source = f.lost_revenue(lost_metres_value=125, revenue_per_metre=40, rate_source="ESTIMATED")
    assert value == Decimal("5000.00")
    assert rate_source == "ESTIMATED"


def test_lost_revenue_none_input():
    value, rate_source = f.lost_revenue(None, 40, "ESTIMATED")
    assert value is None
    assert rate_source == "ESTIMATED"  # rate_source always returned even when value is None


# ── efficiency_gap_value ─────────────────────────────────────────────────────

def test_efficiency_gap_value_normal():
    result = f.efficiency_gap_value(
        cohort_p90_eff=95.0, loom_efficiency_pct_value=85.0, potential_metres=1000, revenue_per_metre=40
    )
    assert result == Decimal("4000.00")


def test_efficiency_gap_value_no_gap_returns_none():
    # loom already at/above cohort p90 -> no "opportunity", never negative
    result = f.efficiency_gap_value(
        cohort_p90_eff=90.0, loom_efficiency_pct_value=95.0, potential_metres=1000, revenue_per_metre=40
    )
    assert result is None


def test_efficiency_gap_value_none_input():
    assert f.efficiency_gap_value(None, 85.0, 1000, 40) is None


# ── crimp_deviation_pp (Q18-Q20 BLOCKED but formula is correct/tested now) ──

def test_crimp_deviation_pp_normal():
    assert f.crimp_deviation_pp(actual_crimp_pct=6.0, std_crimp_pct=5.48) == Decimal("0.52")


def test_crimp_deviation_pp_none_actual():
    # This is the expected v2 state for every per-shift row until a lab feed connects.
    assert f.crimp_deviation_pp(None, 5.48) is None


def test_crimp_deviation_pp_none_std():
    assert f.crimp_deviation_pp(6.0, None) is None


# ── weaver_index ─────────────────────────────────────────────────────────────

def test_weaver_index_normal():
    assert f.weaver_index(weaver_efficiency_pct=95.0, std_efficiency_pct=97.5) == Decimal("0.9744")


def test_weaver_index_zero_std():
    assert f.weaver_index(weaver_efficiency_pct=95.0, std_efficiency_pct=0) is None


def test_weaver_index_none_input():
    assert f.weaver_index(None, 97.5) is None
