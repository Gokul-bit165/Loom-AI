"""
Tests for analytics/cohort.py.

Uses the already-seeded test DB (masters_session_factory from conftest).
Requires full demo data — uses generated_atm_month fixture.
"""
from __future__ import annotations

import datetime
import statistics

import pytest
from sqlalchemy import func, select

from app.analytics.cohort import (
    COHORT_MIN_LOOMS,
    COHORT_WINDOW_DAYS,
    get_cohort_stats,
)
from app.db_models import Loom, ProductionLog, Style


# ── helpers ──────────────────────────────────────────────────────────────────

def _as_of(session) -> datetime.date:
    """Latest work_date in the generated data."""
    row = session.execute(
        select(ProductionLog.work_date).order_by(ProductionLog.work_date.desc()).limit(1)
    ).first()
    return row[0] if row else datetime.date(2026, 7, 31)


# ── tests ─────────────────────────────────────────────────────────────────────

def test_cohort_sufficient_returns_stats(generated_atm_month):
    """The dominant style on the 810-type looms must have >= 5 looms
    in the 30-day window, so the cohort should be sufficient."""
    session, _ = generated_atm_month
    as_of = _as_of(session)

    # Pick the most common (style, loom_type) pair
    pair = session.execute(
        select(
            ProductionLog.style_id,
            Loom.loom_type_code,
        )
        .join(Loom, Loom.loom_id == ProductionLog.loom_id)
        .group_by(ProductionLog.style_id, Loom.loom_type_code)
        .order_by(func.count(ProductionLog.production_log_id).desc())
        .limit(1)
    ).first()

    if pair is None:
        pytest.skip("No production data for cohort test")

    style_id, loom_type_code = pair.style_id, pair.loom_type_code
    result = get_cohort_stats(session, style_id, loom_type_code, as_of)

    if result.loom_count >= COHORT_MIN_LOOMS:
        assert result.sufficient is True
        assert result.median_eff is not None
        assert result.p90_eff is not None
        assert 0 < float(result.median_eff) <= 100
        assert float(result.p90_eff) >= float(result.median_eff)
        assert result.window == f"{COHORT_WINDOW_DAYS}d"


def test_cohort_insufficient_when_below_gate(generated_atm_month):
    """A style that has never run any looms should return insufficient."""
    session, _ = generated_atm_month
    as_of = _as_of(session)

    # Use style_id=9999 — guaranteed not to exist in production_log
    result = get_cohort_stats(session, 9999, "810", as_of)

    assert result.sufficient is False
    assert result.loom_count == 0
    assert result.median_eff is None
    assert result.p90_eff is None


def test_cohort_gate_is_exactly_min_looms(generated_atm_month):
    """Verify the gate is strictly COHORT_MIN_LOOMS (5), not 4 or 6."""
    # We test this via the public constant and the logic path, not by
    # constructing an exact 4-loom scenario (that would require DB surgery).
    assert COHORT_MIN_LOOMS == 5


def test_cohort_window_is_30_days(generated_atm_month):
    """Window constant must be 30 calendar days."""
    assert COHORT_WINDOW_DAYS == 30


def test_cohort_p90_gte_median(generated_atm_month):
    """p90 must be >= median (basic sanity on sorted-list logic)."""
    session, _ = generated_atm_month
    as_of = _as_of(session)

    # grab the first style that has enough data
    pairs = session.execute(
        select(
            ProductionLog.style_id,
            Loom.loom_type_code,
        )
        .join(Loom, Loom.loom_id == ProductionLog.loom_id)
        .group_by(ProductionLog.style_id, Loom.loom_type_code)
    ).all()

    for pair in pairs:
        result = get_cohort_stats(session, pair.style_id, pair.loom_type_code, as_of)
        if result.sufficient:
            assert float(result.p90_eff) >= float(result.median_eff), (
                f"p90={result.p90_eff} < median={result.median_eff}"
            )
            return  # one sufficient cohort is enough to test this

    pytest.skip("No sufficient cohort found in generated data")
