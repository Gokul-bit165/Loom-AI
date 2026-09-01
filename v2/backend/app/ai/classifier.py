"""
Loom AI v2 — P6 §3: Classifier (Free text -> Structured Reason Code).

Rules:
1. Rule/regex parser attempts the match first (fast, auditable, deterministic).
2. Only on low confidence, fallback classifier proposes a code strictly from the FIXED ENUM.
3. Anything below CONFIDENCE_THRESHOLD routes to manual review (ROUTE_TO_REVIEW).
4. Every classifier-assigned code is tagged classifier_assigned=True for auditability.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional

CONFIDENCE_THRESHOLD = 0.75

REASON_REGEX_RULES = [
    (r"\b(warp\s*break|warp\s*cut|paavu|dhaaga)\b", "WARP_BREAK", 0.98),
    (r"\b(weft\s*break|weft\s*cut|feeder\s*fault|baana|oode)\b", "WEFT_BREAK", 0.98),
    (r"\b(motor|gear|belt|bearing|cam|mechanical|dobby)\b", "MECHANICAL", 0.92),
    (r"\b(power|electrical|voltage|fuse|ess\s*stop|eb\s*cut|current)\b", "ELECTRICAL", 0.96),
    (r"\b(beam\s*change|gaiting|knotting|drawing)\b", "BEAM_GAITING", 0.94),
    (r"\b(inspection|quality|defect|smash|mending)\b", "QUALITY_CHECK", 0.88),
]


@dataclass
class ClassificationResult:
    reason_code: str
    confidence: float
    method: str              # "REGEX_RULE" | "CLASSIFIER_FALLBACK" | "ROUTE_TO_REVIEW"
    classifier_assigned: bool
    needs_manual_review: bool


def classify_remark(raw_remark: Optional[str]) -> ClassificationResult:
    if not raw_remark or not raw_remark.strip():
        return ClassificationResult(
            reason_code="OTHER",
            confidence=0.5,
            method="ROUTE_TO_REVIEW",
            classifier_assigned=False,
            needs_manual_review=True,
        )

    text = raw_remark.lower().strip()

    # 1. Regex rule check
    for pattern, code, conf in REASON_REGEX_RULES:
        if re.search(pattern, text):
            return ClassificationResult(
                reason_code=code,
                confidence=conf,
                method="REGEX_RULE",
                classifier_assigned=False,
                needs_manual_review=False,
            )

    # 2. Heuristic fallback (strictly within fixed enum)
    if "stop" in text or "hold" in text:
        return ClassificationResult(
            reason_code="OTHER",
            confidence=0.70,
            method="CLASSIFIER_FALLBACK",
            classifier_assigned=True,
            needs_manual_review=True,  # Under 0.75 threshold
        )

    # 3. Route to review
    return ClassificationResult(
        reason_code="OTHER",
        confidence=0.40,
        method="ROUTE_TO_REVIEW",
        classifier_assigned=True,
        needs_manual_review=True,
    )
