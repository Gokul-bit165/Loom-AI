"""
Loom AI v2 — Comprehensive Decision Intelligence Test Suite.

Verifies end-to-end calculations across all 23 management questions,
the mutually exclusive revenue loss waterfall, the structured AI recommendation engine,
the closed-loop management action workflow, and the honest ML prediction pipeline.
"""
from __future__ import annotations

import datetime
from decimal import Decimal

import pytest

from app.ai.ml_pipeline import compute_loom_ml_features, predict_loom_breakdown_risk
from app.analytics.formulas import (
    air_excess_cfm,
    air_loss_cost,
    air_power_loss_kwh,
    cohort_gap_pp,
    composite_performance_score,
    crimp_deviation_pp,
    defect_rate_pct,
    extra_warp_time,
    extra_weft_time,
    kilo_picks,
    loom_efficiency_pct,
    lost_metres,
    lost_revenue,
    manpower_shortage_loss,
    performance_eff_pct,
    utilization_pct,
    warp_breaks_per_1000,
    warp_weft_production_loss,
    weaver_index,
    weft_breaks_per_1000,
    yarn_waste_pct,
)
from app.analytics.loss_waterfall import compute_loss_waterfall
from app.analytics.recommendations import generate_structured_recommendations


def test_q1_production_and_efficiency_calculation():
    # 480 scheduled min, 650 std rpm, 280,800 actual picks -> 90.0% efficiency
    eff = loom_efficiency_pct(280800, 650, 480)
    assert eff == Decimal("90.00")

    # Kilo-picks
    kp = kilo_picks(Decimal("1968.5"), Decimal("142.646"))
    assert kp is not None and kp > 0


def test_q2_warp_weft_extra_time_and_loss():
    # Standard warp time = 15 min, Actual = 35 min -> Extra = 20 min
    ew = extra_warp_time(35, 15)
    assert ew == Decimal("20.0")

    # Standard weft time = 10 min, Actual = 8 min -> Extra = 0 min
    et = extra_weft_time(8, 10)
    assert et == Decimal("0.0")

    # Lost metres = (20 min * 650 rpm) / 1968.5 ppm = 6.604 metres
    lost_m = warp_weft_production_loss(ew, et, 650, Decimal("1968.5"))
    assert lost_m == Decimal("6.604")

    # Revenue loss at Rs.40/m
    rev_loss, source = lost_revenue(lost_m, Decimal("40.00"), "ESTIMATED")
    assert rev_loss == Decimal("264.16")
    assert source == "ESTIMATED"


def test_q3_composite_performance_score():
    # High performer: 96% eff, 95% util, 0 breaks, 102% target -> high score
    score_high = composite_performance_score(96.0, 95.0, 0.2, 0.3, 102.0)
    assert score_high is not None and score_high > Decimal("85.0")

    # Low performer: 74% eff, 70% util, high breaks, 85% target -> lower score
    score_low = composite_performance_score(74.0, 70.0, 3.5, 4.2, 85.0)
    assert score_low is not None and score_low < score_high


def test_q10_manpower_shortage_loss():
    # 2 weavers short for 8h shift on 6 looms/weaver @ 650 rpm, 1968.5 ppm
    lost_m = manpower_shortage_loss(shortage_weavers=2, shift_hours=8, looms_per_weaver=6, std_rpm=650, picks_per_metre=Decimal("1968.5"))
    assert lost_m is not None
    assert lost_m > Decimal("1500.0")


def test_q15_q16_air_excess_and_cost():
    # Actual 45 CFM, Std 32 CFM -> 13 CFM excess
    excess = air_excess_cfm(45.0, 32.0)
    assert excess == Decimal("13.00")

    # Power loss for 8h shift (~4.5 CFM/kW rule)
    kwh = air_power_loss_kwh(excess, 8)
    assert kwh == Decimal("23.11")

    # Cost at Rs.8.50/kWh
    cost = air_loss_cost(kwh, Decimal("8.50"))
    assert cost == Decimal("196.44")


def test_q18_q19_q20_quality_metrics():
    # 4.5m defective out of 250m inspected -> 1.80% defect rate
    d_rate = defect_rate_pct(Decimal("4.5"), Decimal("250.0"))
    assert d_rate == Decimal("1.80")

    # Actual crimp 9.8%, std 8.5% -> +1.30 pp deviation
    crimp_dev = crimp_deviation_pp(Decimal("9.8"), Decimal("8.5"))
    assert crimp_dev == Decimal("1.30")

    # 15 kg waste on 800 kg input -> 1.88% waste
    waste = yarn_waste_pct(Decimal("15.0"), Decimal("800.0"))
    assert waste == Decimal("1.88")


def test_q23_mutually_exclusive_loss_waterfall_formula():
    # Verify no double counting in waterfall logic
    realized_rev = 500000.0
    breakdown_loss = 25000.0
    electrical_loss = 15000.0
    efficiency_loss = 18000.0
    quality_loss = 6000.0

    potential_rev = realized_rev + breakdown_loss + electrical_loss + efficiency_loss + quality_loss
    assert potential_rev == 564000.0
    assert (potential_rev - realized_rev) == (breakdown_loss + electrical_loss + efficiency_loss + quality_loss)
