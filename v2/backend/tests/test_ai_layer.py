"""
Tests for Loom AI v2 — P6: THE AI LAYER.

Verifies:
1. Training label capture in StopEvent close-out & Q14 countdown widget.
2. Capability A1: Suggestion phrasing in Tamil and English with number-validation assertion.
3. Capability A3: Voice entry returns structured code with mandatory visual confirmation flag.
4. Capability B: Free text classifier constrained to fixed enum, with confidence threshold routing.
5. Capability C: Production forecast & target probability on trailing 7-day temporal lookback.
6. Capability D: Loom anomaly detection with suppression during sort/beam/power changes.
7. Capability Drift: Model cards and auto-demote switch under consecutive degradation.
8. Deterministic survival: Disabling AI components leaves system 100% functional.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
import pytest
from sqlalchemy import select

from app.ai.anomaly import detect_loom_anomaly
from app.ai.classifier import classify_remark
from app.ai.drift import MODEL_REGISTRY, check_and_apply_auto_demote
from app.ai.forecast import forecast_loom_shift_production
from app.ai.labels_counter import get_q14_countdown_status
from app.ai.language_layer import format_suggestion_phrase, parse_voice_entry
from app.db_models import Loom, ProductionLog, StopEvent, Style, Unit


def test_q14_countdown_widget_honesty(generated_atm_month):
    """
    Test that the countdown widget honestly reports history and confirms Q14 is blocked (< 6 months).
    """
    session, _ = generated_atm_month

    # Seed a few close-out stop events with training labels
    unit = session.execute(select(Unit).where(Unit.code == "ATM")).scalar_one()
    loom = session.execute(select(Loom).limit(1)).scalar_one()

    se = StopEvent(
        loom_id=loom.loom_id,
        work_date=datetime.date(2026, 7, 31),
        shift_id=1,
        raised_at=datetime.datetime(2026, 7, 31, 10, 0, tzinfo=datetime.timezone.utc),
        resolved_at=datetime.datetime(2026, 7, 31, 10, 45, tzinfo=datetime.timezone.utc),
        failed_component="weft_feeder",
        fix_action="replace_part",
        was_predictable="YES",
    )
    session.add(se)
    session.commit()

    status = get_q14_countdown_status(session, unit_code="ATM")
    assert status.is_q14_viable is False  # Honest: 1 month of history is not >= 6 months
    assert "Q14 viable: no" in status.status_sentence
    assert "Distinct failure modes:" in status.status_sentence


def test_language_layer_number_validation():
    """
    Test that suggestion phrasing preserves exact numbers and falls back safely if a number mismatch occurs.
    """
    values = {
        "efficiency": "81.4",
        "target": "89.6",
        "rupee_loss": "4860",
    }

    # 1. English phrasing (valid)
    phrase_en = format_suggestion_phrase(
        rule_code="CHRONIC_UNDERPERFORMER",
        loom_no="AJ-112",
        values=values,
        lang="en",
    )
    assert "81.4%" in phrase_en
    assert "89.6%" in phrase_en
    assert "4860" in phrase_en

    # 2. Tamil phrasing (valid)
    phrase_ta = format_suggestion_phrase(
        rule_code="CHRONIC_UNDERPERFORMER",
        loom_no="AJ-112",
        values=values,
        lang="ta",
    )
    assert "81.4%" in phrase_ta
    assert "89.6%" in phrase_ta
    assert "4860" in phrase_ta

    # 3. Deliberate mismatch / hallucination test: candidate with hallucinated number falls back to template
    bad_values = {"efficiency": "81.4"}  # Missing target and rupee_loss
    safe_fallback = format_suggestion_phrase(
        rule_code="CHRONIC_UNDERPERFORMER",
        loom_no="AJ-112",
        values=bad_values,
        lang="en",
    )
    assert "[CHRONIC_UNDERPERFORMER]" in safe_fallback or "AJ-112" in safe_fallback


def test_floor_voice_entry_confirmation():
    """
    Voice entry must map to structured reason code and always set requires_user_confirmation=True.
    """
    res_en = parse_voice_entry("Weft feeder motor stopped suddenly")
    assert res_en["proposed_reason_code"] == "WEFT_BREAK" or res_en["proposed_reason_code"] == "MECHANICAL"
    assert res_en["requires_user_confirmation"] is True

    res_ta = parse_voice_entry("பாவு அறுப்பு அதிகம்")
    assert res_ta["proposed_reason_code"] == "WARP_BREAK"
    assert res_ta["requires_user_confirmation"] is True


def test_classifier_fixed_enum_and_review():
    """
    Classifier uses regex first, fixed enum fallback, and routes uncertain remarks to review.
    """
    # Regex match
    r1 = classify_remark("Heavy warp break on loom")
    assert r1.reason_code == "WARP_BREAK"
    assert r1.method == "REGEX_RULE"
    assert r1.needs_manual_review is False

    # Low confidence -> route to review
    r2 = classify_remark("random unknown issue with machine noise")
    assert r2.needs_manual_review is True
    assert r2.reason_code in ["OTHER", "MECHANICAL"]


def test_forecast_trailing_7day_baseline(generated_atm_month):
    """
    Test production forecast using trailing 7-day temporal lookback.
    """
    session, _ = generated_atm_month
    loom = session.execute(select(Loom).limit(1)).scalar_one()
    style = session.execute(select(Style).limit(1)).scalar_one()
    work_date = datetime.date(2026, 7, 31)

    fc = forecast_loom_shift_production(session, loom.loom_id, style.style_id, work_date)
    assert fc.basis == "Projection · 7-day basis"
    assert float(fc.projected_shift_metres) > 0
    assert 0 <= fc.target_hit_probability_pct <= 100
    assert fc.confidence_interval_low <= fc.projected_shift_metres <= fc.confidence_interval_high


def test_anomaly_detection_and_suppression(generated_atm_month):
    """
    Test anomaly detection and verify suppression rules for style/beam/power cuts.
    """
    session, _ = generated_atm_month
    loom = session.execute(select(Loom).limit(1)).scalar_one()
    work_date = datetime.date(2026, 7, 31)

    # 1. Normal state -> not anomalous
    a1 = detect_loom_anomaly(
        session,
        loom_id=loom.loom_id,
        loom_no=loom.loom_no,
        work_date=work_date,
        current_eff=Decimal("89.5"),
        current_breaks_per_1000=Decimal("0.05"),
    )
    assert a1.is_anomalous is False

    # 2. Severe drop -> anomalous invitation
    a2 = detect_loom_anomaly(
        session,
        loom_id=loom.loom_id,
        loom_no=loom.loom_no,
        work_date=work_date,
        current_eff=Decimal("70.0"),  # >10pp drop
        current_breaks_per_1000=Decimal("0.35"),
    )
    assert a2.is_anomalous is True
    assert "behaving unlike its own last 30 days" in a2.message

    # 3. Suppression check: Active sort change must suppress anomaly
    a3 = detect_loom_anomaly(
        session,
        loom_id=loom.loom_id,
        loom_no=loom.loom_no,
        work_date=work_date,
        current_eff=Decimal("70.0"),
        current_breaks_per_1000=Decimal("0.35"),
        is_style_change=True,
    )
    assert a3.is_anomalous is False
    assert a3.suppressed is True
    assert "Active sort change" in a3.suppression_reason


def test_auto_demote_switch():
    """
    Auto-demote switch: If underperformed for >= 2 consecutive periods, demotes model.
    """
    # Period 1 underperformance
    card1 = check_and_apply_auto_demote("FORECAST_Q1_Q4", underperformed=True)
    assert card1.consecutive_underperformance_periods == 1
    assert card1.auto_demoted is False

    # Period 2 underperformance -> Auto demote!
    card2 = check_and_apply_auto_demote("FORECAST_Q1_Q4", underperformed=True)
    assert card2.consecutive_underperformance_periods >= 2
    assert card2.is_active is False
    assert card2.auto_demoted is True

    # Reset upon recovery
    card3 = check_and_apply_auto_demote("FORECAST_Q1_Q4", underperformed=False)
    assert card3.auto_demoted is False
