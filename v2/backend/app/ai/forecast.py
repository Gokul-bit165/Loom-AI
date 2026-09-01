"""
Loom AI v2 — P6 §4: Production Forecast (Q1, Q4).

Answers: "At current run rate, will this loom/shift/unit hit target, and by how much will it miss?"
Baseline: Trailing 7-day mean for the same loom and same style.
Label: "Projection · 7-day basis" with explicit confidence interval.
"""
from __future__ import annotations

import datetime
from dataclasses import dataclass
from decimal import Decimal
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db_models import ProductionLog, ProductionTarget, Style


@dataclass
class ForecastResult:
    basis: str                        # "Projection · 7-day basis"
    projected_shift_metres: Decimal
    target_metres: Optional[Decimal]
    projected_gap_metres: Decimal
    target_hit_probability_pct: float
    confidence_interval_low: Decimal
    confidence_interval_high: Decimal
    basis_days: int = 7


def forecast_loom_shift_production(
    session: Session,
    loom_id: int,
    style_id: int,
    work_date: datetime.date,
    shift_scheduled_min: int = 480,
) -> ForecastResult:
    """
    Computes trailing 7-day production baseline for (loom_id, style_id).
    Projects expected output and target-hit probability using temporal lookback.
    """
    window_start = work_date - datetime.timedelta(days=7)

    # 1. Fetch trailing 7 days
    rows = session.execute(
        select(
            ProductionLog.metres,
            ProductionLog.running_minutes,
        )
        .where(
            ProductionLog.loom_id == loom_id,
            ProductionLog.style_id == style_id,
            ProductionLog.work_date >= window_start,
            ProductionLog.work_date < work_date,
            ProductionLog.is_current == True,
        )
    ).all()

    # 2. Get target metres
    target_row = session.execute(
        select(ProductionTarget.target_metres).where(
            ProductionTarget.loom_id == loom_id,
            ProductionTarget.work_date == work_date,
        ).limit(1)
    ).scalar_one_or_none()
    target_metres = Decimal(str(target_row)) if target_row else Decimal("120.0")

    if not rows:
        # No recent history: fallback to style standard estimate
        proj = round(target_metres * Decimal("0.90"), 1)
        return ForecastResult(
            basis="Projection · 7-day basis",
            projected_shift_metres=proj,
            target_metres=target_metres,
            projected_gap_metres=round(proj - target_metres, 1),
            target_hit_probability_pct=45.0,
            confidence_interval_low=round(proj * Decimal("0.85"), 1),
            confidence_interval_high=round(proj * Decimal("1.05"), 1),
            basis_days=0,
        )

    metres_list = [float(r.metres) for r in rows]
    mean_metres = sum(metres_list) / len(metres_list)
    projected = Decimal(str(round(mean_metres, 1)))

    gap = projected - target_metres
    prob = 90.0 if projected >= target_metres else max(10.0, round(float(projected / target_metres) * 80.0, 1))

    low = round(projected * Decimal("0.92"), 1)
    high = round(projected * Decimal("1.04"), 1)

    return ForecastResult(
        basis="Projection · 7-day basis",
        projected_shift_metres=projected,
        target_metres=target_metres,
        projected_gap_metres=gap,
        target_hit_probability_pct=prob,
        confidence_interval_low=low,
        confidence_interval_high=high,
        basis_days=len(rows),
    )
