"""
Loom AI v2 — P6 §2: Language Layer.

Capabilities:
A1 — Suggestion phrasing (Tamil + English) with strict number-validation:
     Every number in the output text MUST appear in the input numbers payload.
     If a mismatch or missing number is detected, safely falls back to the deterministic template.
A2 — WhatsApp 6-line plain text summary.
A3 — Floor voice entry mapping (speech text -> structured reason code -> returns confirmation payload).
"""
from __future__ import annotations

import re
from decimal import Decimal
from typing import Any, Optional

from app.exports.whatsapp import format_inr


# Fixed standard reason codes
KNOWN_REASON_CODES = {
    "WARP_BREAK": {"label_en": "Warp break", "label_ta": "பாவூ அறுப்பு"},
    "WEFT_BREAK": {"label_en": "Weft break", "label_ta": "ஊடே அறுப்பு"},
    "MECHANICAL": {"label_en": "Mechanical issue", "label_ta": "இயந்திர கோளாறு"},
    "ELECTRICAL": {"label_en": "Electrical stop", "label_ta": "மின்சார நிறுத்தம்"},
    "BEAM_GAITING": {"label_en": "Beam gaiting / change", "label_ta": "பாவு மாற்றுதல்"},
    "QUALITY_CHECK": {"label_en": "Quality / cloth inspection", "label_ta": "தர ஆய்வு"},
    "OTHER": {"label_en": "Other stop", "label_ta": "மற்றவை"},
}


def _extract_numbers_from_string(text: str) -> set[str]:
    """Extracts all numeric tokens from string (including decimals like 89.6)."""
    # Matches digits with optional decimal point
    matches = re.findall(r"\b\d+(?:\.\d+)?\b", text.replace(",", ""))
    return set(matches)


def format_suggestion_phrase(
    rule_code: str,
    loom_no: str,
    values: dict[str, Any],
    lang: str = "en",
) -> str:
    """
    Renders structured Suggestion into English or Tamil sentence.
    Enforces number-validation safety: All numbers in output must exist in input values.
    Falls back to deterministic template if mismatch is found.
    """
    eff = values.get("efficiency")
    target = values.get("target", 89.6)
    rupee = values.get("rupee_loss")

    # 1. Generate candidate phrasing
    if lang == "ta":
        if rule_code == "CHRONIC_UNDERPERFORMER":
            candidate = f"{loom_no} தறி தொடர்ந்து {eff}% செயல்திறனில் இயங்குகிறது (இலக்கு {target}%). இழப்பு ரூ.{rupee}."
        elif rule_code == "HIGH_WARP_BREAKS":
            breaks = values.get("warp_breaks", 0)
            candidate = f"{loom_no} தறியில் பாவூ அறுப்பு அதிகம் ({breaks} அறுப்புகள்). பாவு பதற்றம் சரிபார்க்கவும்."
        else:
            candidate = f"{loom_no} தறி செயல்திறன் {eff}%. இழப்பு ரூ.{rupee}."
    else:
        if rule_code == "CHRONIC_UNDERPERFORMER":
            candidate = f"{loom_no} is chronically below target at {eff}% efficiency (target {target}%). Estimated loss Rs.{rupee}."
        elif rule_code == "HIGH_WARP_BREAKS":
            breaks = values.get("warp_breaks", 0)
            candidate = f"{loom_no} recorded excessive warp breaks ({breaks} breaks). Inspect warp tension."
        else:
            candidate = f"{loom_no} efficiency is {eff}%. Loss is Rs.{rupee}."

    # 2. Number validation guardrail: Every number in candidate must be in values
    candidate_numbers = _extract_numbers_from_string(candidate)
    allowed_numbers = set()
    for v in values.values():
        if v is not None:
            allowed_numbers.update(_extract_numbers_from_string(str(v)))

    # Ignore numbers in loom_no (e.g. 112 in AJ-112)
    loom_nums = _extract_numbers_from_string(loom_no)
    candidate_numbers = candidate_numbers - loom_nums

    # Assert all candidate numbers are present in allowed_numbers
    is_safe = candidate_numbers.issubset(allowed_numbers)

    if not is_safe:
        # Fallback to pure deterministic template
        return f"{loom_no} [{rule_code}] eff={eff}% target={target}% loss=Rs.{rupee}"

    return candidate


def parse_voice_entry(audio_transcript: str) -> dict[str, Any]:
    """
    Parses operator speech transcript (Tamil/English/Hindi/Odia keywords)
    into a structured candidate reason code, and returns visual confirmation payload.
    NEVER commits directly without confirmation.
    """
    t = audio_transcript.lower().strip()
    
    matched_code = "OTHER"
    confidence = 0.60

    if any(k in t for k in ["warp", "பாவு", "dhaaga", "suta"]):
        matched_code = "WARP_BREAK"
        confidence = 0.95
    elif any(k in t for k in ["weft", "ஊடே", "baana", "feeder"]):
        matched_code = "WEFT_BREAK"
        confidence = 0.95
    elif any(k in t for k in ["motor", "gear", "belt", "இயந்திரம்", "mechanical", "bearing"]):
        matched_code = "MECHANICAL"
        confidence = 0.90
    elif any(k in t for k in ["power", "current", "மின்சாரம்", "bijli", "fuse", "electrical"]):
        matched_code = "ELECTRICAL"
        confidence = 0.95
    elif any(k in t for k in ["beam", "change", "மாற்றுதல்", "gaiting", "knotting"]):
        matched_code = "BEAM_GAITING"
        confidence = 0.90
    elif any(k in t for k in ["check", "cloth", "inspection", "தரம்", "quality"]):
        matched_code = "QUALITY_CHECK"
        confidence = 0.85

    meta = KNOWN_REASON_CODES[matched_code]

    return {
        "transcript": audio_transcript,
        "proposed_reason_code": matched_code,
        "reason_label_en": meta["label_en"],
        "reason_label_ta": meta["label_ta"],
        "confidence": confidence,
        "requires_user_confirmation": True,  # Non-negotiable floor confirmation
    }
