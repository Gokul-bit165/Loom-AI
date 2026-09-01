"""
Loom AI v2 — /api/v2/ai router (P6 The AI Layer).

Exposes:
1. GET  /api/v2/ai/q14-countdown    — Honest label countdown & Q14 readiness
2. POST /api/v2/ai/voice-entry       — Speech transcript mapping to reason code (with visual confirmation)
3. POST /api/v2/ai/classify-remark   — Free text remark to structured reason code
4. GET  /api/v2/ai/forecast          — Trailing 7-day production forecast & target probability
5. GET  /api/v2/ai/anomaly           — Unsupervised loom anomaly flag
6. GET  /api/v2/ai/model-cards       — Model cards, ownership, and auto-demote status
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.ai.anomaly import detect_loom_anomaly
from app.ai.classifier import classify_remark
from app.ai.drift import MODEL_REGISTRY, check_and_apply_auto_demote
from app.ai.forecast import forecast_loom_shift_production
from app.ai.labels_counter import get_q14_countdown_status
from app.ai.language_layer import format_suggestion_phrase, parse_voice_entry
from app.routers.deps import get_session

router = APIRouter()


class VoiceEntryRequest(BaseModel):
    transcript: str


class ClassifyRemarkRequest(BaseModel):
    raw_remark: str


@router.get("/q14-countdown")
def get_q14_status(unit: str = Query("ATM"), session: Session = Depends(get_session)):
    status = get_q14_countdown_status(session, unit_code=unit)
    return {
        "labelled_stop_events": status.labelled_stop_events,
        "distinct_failure_modes": status.distinct_failure_modes,
        "months_of_history": status.months_of_history,
        "is_q14_viable": status.is_q14_viable,
        "status_sentence": status.status_sentence,
    }


@router.post("/voice-entry")
def process_voice_entry(req: VoiceEntryRequest):
    return parse_voice_entry(req.transcript)


@router.post("/classify-remark")
def process_classify_remark(req: ClassifyRemarkRequest):
    res = classify_remark(req.raw_remark)
    return {
        "reason_code": res.reason_code,
        "confidence": res.confidence,
        "method": res.method,
        "classifier_assigned": res.classifier_assigned,
        "needs_manual_review": res.needs_manual_review,
    }


@router.get("/forecast")
def get_loom_forecast(
    loom_id: int = Query(...),
    style_id: int = Query(...),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
):
    fc = forecast_loom_shift_production(session, loom_id, style_id, date)
    return {
        "basis": fc.basis,
        "projected_shift_metres": fc.projected_shift_metres,
        "target_metres": fc.target_metres,
        "projected_gap_metres": fc.projected_gap_metres,
        "target_hit_probability_pct": fc.target_hit_probability_pct,
        "confidence_interval_low": fc.confidence_interval_low,
        "confidence_interval_high": fc.confidence_interval_high,
        "basis_days": fc.basis_days,
    }


@router.get("/anomaly")
def check_loom_anomaly(
    loom_id: int = Query(...),
    loom_no: str = Query(...),
    date: datetime.date = Query(...),
    eff: Optional[Decimal] = Query(None),
    breaks_per_1000: Optional[Decimal] = Query(None),
    is_style_change: bool = Query(False),
    is_beam_change: bool = Query(False),
    is_power_cut: bool = Query(False),
    session: Session = Depends(get_session),
):
    anom = detect_loom_anomaly(
        session,
        loom_id=loom_id,
        loom_no=loom_no,
        work_date=date,
        current_eff=eff,
        current_breaks_per_1000=breaks_per_1000,
        is_style_change=is_style_change,
        is_beam_change=is_beam_change,
        is_plant_power_cut=is_power_cut,
    )
    return {
        "loom_id": anom.loom_id,
        "loom_no": anom.loom_no,
        "is_anomalous": anom.is_anomalous,
        "score": anom.score,
        "message": anom.message,
        "suppressed": anom.suppressed,
        "suppression_reason": anom.suppression_reason,
    }


@router.get("/model-cards")
def get_model_cards():
    return {k: v.__dict__ for k, v in MODEL_REGISTRY.items()}
