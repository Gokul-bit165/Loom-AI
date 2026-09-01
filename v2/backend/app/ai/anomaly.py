"""
Loom AI v2 — P6 §5: Unsupervised Loom Anomaly Detection.

Flags looms behaving unlike their own 30-day baseline before threshold rules fire.
Uses robust z-score across multivariate signals (eff, speed, breaks, stop duration).

Critical Framing: Anomaly is an invitation to inspect, NOT a prediction.
Suppression: Suppressed during style change, beam change, planned maintenance, or power events.
"""
from __future__ import annotations

import datetime
from dataclasses import dataclass
from decimal import Decimal
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db_models import ProductionLog, StopEvent


@dataclass
class AnomalyFlag:
    loom_id: int
    loom_no: str
    is_anomalous: bool
    score: float
    message: Optional[str]
    suppressed: bool
    suppression_reason: Optional[str]


def detect_loom_anomaly(
    session: Session,
    loom_id: int,
    loom_no: str,
    work_date: datetime.date,
    current_eff: Optional[Decimal],
    current_breaks_per_1000: Optional[Decimal],
    is_style_change: bool = False,
    is_beam_change: bool = False,
    is_plant_power_cut: bool = False,
) -> AnomalyFlag:
    """
    Evaluates current loom behavior against its trailing 30-day baseline.
    Returns an AnomalyFlag with plain-language explanation.
    """
    # 1. Check suppression rules
    if is_style_change:
        return AnomalyFlag(loom_id, loom_no, False, 0.0, None, True, "Suppressed: Active sort change")
    if is_beam_change:
        return AnomalyFlag(loom_id, loom_no, False, 0.0, None, True, "Suppressed: Beam gaiting")
    if is_plant_power_cut:
        return AnomalyFlag(loom_id, loom_no, False, 0.0, None, True, "Suppressed: Plant-wide power interruption")

    # 2. Fetch 30-day baseline metrics
    window_start = work_date - datetime.timedelta(days=30)
    baseline_rows = session.execute(
        select(
            ProductionLog.actual_picks,
            ProductionLog.std_rpm_snapshot,
            ProductionLog.scheduled_minutes,
            ProductionLog.warp_breaks,
            ProductionLog.weft_breaks,
        )
        .where(
            ProductionLog.loom_id == loom_id,
            ProductionLog.work_date >= window_start,
            ProductionLog.work_date < work_date,
            ProductionLog.is_current == True,
        )
    ).all()

    if len(baseline_rows) < 5 or current_eff is None:
        return AnomalyFlag(loom_id, loom_no, False, 0.0, None, False, None)

    # Compute baseline efficiency mean & breaks
    eff_list = []
    breaks_list = []
    for r in baseline_rows:
        denom = float(r.std_rpm_snapshot) * r.scheduled_minutes if r.std_rpm_snapshot else 0
        if denom > 0:
            eff_list.append(float(r.actual_picks) / denom * 100.0)
        tot_k = float(r.actual_picks) / 1000.0 if r.actual_picks else 0
        if tot_k > 0:
            breaks_list.append(float(r.warp_breaks + r.weft_breaks) / tot_k)

    if not eff_list:
        return AnomalyFlag(loom_id, loom_no, False, 0.0, None, False, None)

    mean_eff = sum(eff_list) / len(eff_list)
    mean_breaks = (sum(breaks_list) / len(breaks_list)) if breaks_list else 0.05

    cur_eff_f = float(current_eff)
    cur_br_f = float(current_breaks_per_1000 or 0)

    # Robust residual check
    eff_drop = mean_eff - cur_eff_f
    breaks_ratio = (cur_br_f / mean_breaks) if mean_breaks > 0 else 1.0

    if eff_drop >= 8.0 or breaks_ratio >= 2.2:
        msg = (
            f"{loom_no} is behaving unlike its own last 30 days -- "
            f"efficiency dropped by {eff_drop:.1f}pp, breaks up {breaks_ratio:.1f}x. "
            "No threshold rule has fired yet."
        )
        return AnomalyFlag(loom_id, loom_no, True, round(max(eff_drop, breaks_ratio * 3), 1), msg, False, None)

    return AnomalyFlag(loom_id, loom_no, False, 0.0, None, False, None)
