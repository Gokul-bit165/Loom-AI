"""
Loom AI v2 — reconciliation tests (task 0.6).

These are the tests that gate P1: per docs/V2_DESIGN.md §6, "nothing in
P1+ starts until 0.2-0.6 are green." Generating a full ATM month is
expensive, so it's done once per test module (module-scoped fixture) and
every test in this file reads from that one generation.
"""
from __future__ import annotations

import statistics
from decimal import Decimal

import pytest
from sqlalchemy import func, select

from app.config import DEMO_SEED
from app.db_models import (
    FabricRoll,
    Loom,
    ProductionLog,
    Unit,
    VendorUnitMonthlySummary,
)
from app.seed.demo_generator import generate_atm_month

ATM_EXPECTED = {"eff": 89.6, "kilo_picks": 3_331_544, "metres": 1_541_450, "rolls": 2_474}
VENDOR_EXPECTED = {
    "VPN": {"eff": 93.9, "kilo_picks": 473_905, "metres": 261_892, "rolls": 381},
    "CVF": {"eff": 90.6, "kilo_picks": 4_742_548, "metres": 2_054_906, "rolls": 3_354},
    "SKT": {"eff": 87.2, "kilo_picks": 1_218_425, "metres": 499_839, "rolls": 1_019},
    "METRO": {"eff": 84.3, "kilo_picks": 423_515, "metres": 191_497, "rolls": 277},
    "TPN": {"eff": 83.7, "kilo_picks": 374_280, "metres": 139_530, "rolls": 255},
}
IMPLIED_PICKS_PER_METRE = {"ATM": 2161}  # only ATM is generated; vendor units carry no loom data


def test_demo_atm_matches_vendor_mrm(generated_atm_month):
    _session, totals = generated_atm_month
    got = totals["ATM"]
    exp = ATM_EXPECTED
    assert abs(got["kilo_picks"] - exp["kilo_picks"]) / exp["kilo_picks"] <= 0.02, got
    assert abs(got["metres"] - exp["metres"]) / exp["metres"] <= 0.02, got
    assert abs(got["rolls"] - exp["rolls"]) / exp["rolls"] <= 0.05, got  # roll count has coarser rounding
    assert abs(got["eff"] - exp["eff"]) <= 1.0, got  # percentage points


def test_vendor_summary_rows_match_source_exactly(generated_atm_month):
    session, _totals = generated_atm_month
    for unit_code, exp in VENDOR_EXPECTED.items():
        unit = session.execute(select(Unit).where(Unit.code == unit_code)).scalar_one()
        row = session.execute(
            select(VendorUnitMonthlySummary).where(VendorUnitMonthlySummary.unit_id == unit.unit_id)
        ).scalar_one()
        assert float(row.efficiency_pct) == exp["eff"]
        assert float(row.month_kilo_picks) == exp["kilo_picks"]
        assert float(row.month_metres) == exp["metres"]
        assert row.month_rolls == exp["rolls"]


def test_vendor_units_have_no_loom_rows(generated_atm_month):
    """Structural guard for design correction/resolution §1.1 — vendor
    units must never accumulate fabricated per-loom data."""
    session, _totals = generated_atm_month
    for unit_code in VENDOR_EXPECTED:
        unit = session.execute(select(Unit).where(Unit.code == unit_code)).scalar_one()
        loom_count = session.execute(
            select(func.count()).select_from(Loom).where(Loom.unit_id == unit.unit_id)
        ).scalar_one()
        assert loom_count == 0, f"{unit_code} must have zero loom rows, found {loom_count}"


def test_demo_picks_per_metre_ratio(generated_atm_month):
    _session, totals = generated_atm_month
    got = totals["ATM"]
    implied = (got["kilo_picks"] * 1000) / got["metres"]
    expected_ppm = IMPLIED_PICKS_PER_METRE["ATM"]
    assert abs(implied - expected_ppm) / expected_ppm <= 0.10, (
        f"implied picks/metre {implied:.1f} should be near {expected_ppm} "
        "(the value implied by the real July-2026 baseline table)"
    )


def test_demo_efficiency_has_real_spread(generated_atm_month):
    """F2 regression guard, strengthened per correction C: distinctness
    alone can pass on float noise while still looking dead on screen."""
    session, _totals = generated_atm_month
    rows = session.execute(
        select(
            ProductionLog.loom_id,
            func.sum(ProductionLog.actual_picks).label("total_picks"),
            func.sum(ProductionLog.metres).label("total_metres"),
            func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
            func.sum(ProductionLog.scheduled_minutes).label("total_scheduled"),
        ).group_by(ProductionLog.loom_id)
    ).all()
    assert len(rows) >= 100

    effs = []
    for r in rows:
        denom = float(r.avg_rpm) * float(r.total_scheduled)
        eff = (float(r.total_picks) / denom) * 100 if denom else 0.0
        effs.append(eff)

    signatures = {(round(e, 3), round(float(rows[i].total_metres), 1)) for i, e in enumerate(effs)}
    assert len(signatures) >= len(rows) * 0.95  # allow rare coincidental ties, not systematic uniformity

    # Calibration fix check: DB-computed efficiency must be in the correct
    # range (~89.6%), not the broken 65.2% produced when only actual_picks
    # was scaled without updating std_rpm_snapshot.
    unit_mean = statistics.mean(effs)
    assert 85.0 <= unit_mean <= 95.0, (
        f"DB-computed efficiency mean {unit_mean:.1f}% is outside [85, 95]% — "
        "likely the calibration bug (scaling actual_picks without std_rpm_snapshot)"
    )

    assert statistics.pstdev(effs) >= 2.0, f"stdev too low: {statistics.pstdev(effs):.2f} (F2 regression)"
    effs_sorted = sorted(effs)
    p10_cutoff = effs_sorted[len(effs_sorted) // 10]
    median = statistics.median(effs_sorted)
    assert median - p10_cutoff >= 5.0, (
        f"worst-10% tail too shallow: median={median:.1f} p10={p10_cutoff:.1f} (need >=5pp gap)"
    )


def test_demo_efficiency_distribution_shape(generated_atm_month):
    """Per handoff pre-P1 requirement: four gates that catch the v1 F2 failure
    wearing a different hat (a flat tail piling at a clip floor).

    Required shape: dense body 87-92%, thinning shoulder through low 80s,
    3-5 looms in the 70s, nothing below 70%. Worst-20 must span >=6pp (not
    a flat cluster, which is the signature of values piling against a floor).
    """
    session, _totals = generated_atm_month
    rows = session.execute(
        select(
            ProductionLog.loom_id,
            func.sum(ProductionLog.actual_picks).label("total_picks"),
            func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
            func.sum(ProductionLog.scheduled_minutes).label("total_scheduled"),
        ).group_by(ProductionLog.loom_id)
    ).all()

    effs = []
    for r in rows:
        denom = float(r.avg_rpm) * float(r.total_scheduled)
        eff = (float(r.total_picks) / denom) * 100 if denom else 0.0
        effs.append(eff)

    effs_sorted = sorted(effs)
    unit_mean = statistics.mean(effs)
    floor = unit_mean - 20.0

    # Gate 1: Real stdev — not noise, not uniform.
    assert statistics.pstdev(effs) >= 2.0, (
        f"stdev={statistics.pstdev(effs):.2f}pp < 2.0pp — distribution too tight, likely F2 regression"
    )

    # Gate 2: Floor enforced — no loom below unit_mean - 20pp.
    # Domain reality: a loom at mean-20% would have been pulled off the floor.
    violators = [e for e in effs if e < floor]
    assert not violators, (
        f"{len(violators)} loom(s) below floor ({floor:.1f}%): min={min(violators):.2f}% "
        f"— floor clip was not applied after all additive terms (shift/style/noise/degrade)"
    )

    # Gate 3: Real tail — p10 at least 5pp below median.
    p10 = effs_sorted[len(effs_sorted) // 10]
    median = statistics.median(effs_sorted)
    assert p10 <= median - 5.0, (
        f"worst-10% tail too shallow: median={median:.1f}% p10={p10:.1f}% "
        f"gap={median-p10:.2f}pp (need >=5pp) — chronic underperformers not producing a real tail"
    )

    # Gate 4: Worst-20 not flat — must span >=6pp.
    # A 4pp span across 20 looms is the signature of values piling against a
    # clip floor (the F2 failure). Real chronic underperformers have variable
    # performance within the tail due to different styles, shifts, and noise.
    worst_20_span = effs_sorted[19] - effs_sorted[0]
    assert worst_20_span >= 6.0, (
        f"worst-20 span={worst_20_span:.2f}pp < 6pp — flat tail, values piling at clip floor "
        f"(worst={effs_sorted[0]:.2f}%, 20th-worst={effs_sorted[19]:.2f}%)"
    )




def test_loom_efficiency_reconciles_with_performance_and_utilization(generated_atm_month):
    """Identity check for design correction #1's three-function split,
    verified on real generated rows, not just the pure-function unit
    test in test_formulas.py."""
    session, _totals = generated_atm_month
    rows = session.execute(select(ProductionLog).limit(200)).scalars().all()
    assert rows
    for row in rows:
        loom_eff = float(row.actual_picks) / (float(row.std_rpm_snapshot) * row.scheduled_minutes) * 100
        if row.running_minutes == 0:
            continue
        perf_eff = float(row.actual_picks) / (float(row.std_rpm_snapshot) * row.running_minutes) * 100
        util = row.running_minutes / row.scheduled_minutes * 100
        implied = perf_eff * util / 100
        assert abs(implied - loom_eff) <= 0.5, (row.production_log_id, implied, loom_eff)


def test_demo_fabric_roll_totals_are_reasonable(generated_atm_month):
    session, _totals = generated_atm_month
    roll_count = session.execute(select(func.count()).select_from(FabricRoll)).scalar_one()
    assert abs(roll_count - ATM_EXPECTED["rolls"]) / ATM_EXPECTED["rolls"] <= 0.05


@pytest.mark.skip(
    reason=(
        "compute_morning_brief / loss-decomposition is a P1+ module, not built in P0 "
        "(docs/V2_DESIGN.md task list). This test is a placeholder marking the "
        "reconciliation contract the Morning Brief must satisfy once it exists — "
        "loss causes must sum to the headline loss figure within 0.5%."
    )
)
def test_demo_loss_causes_sum_to_headline():
    pass
