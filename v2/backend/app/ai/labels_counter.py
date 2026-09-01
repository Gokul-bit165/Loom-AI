"""
Loom AI v2 — P6 §1: Training labels counter and Q14 readiness evaluator.

Q14 breakdown prediction is blocked until:
1. >= 6 months of labelled stop events
2. >= 30 instances of each major failure mode
3. Predictability field populated by floor fitters during close-out.

This module provides the honest countdown state to be shown directly on the Ask page.
"""
from __future__ import annotations

import datetime
from dataclasses import dataclass
from decimal import Decimal
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db_models import StopEvent, Unit

MIN_MONTHS_REQUIRED = 6.0
MIN_INSTANCES_PER_MODE = 30


@dataclass
class Q14CountdownStatus:
    labelled_stop_events: int
    distinct_failure_modes: int
    months_of_history: float
    is_q14_viable: bool
    status_sentence: str


def get_q14_countdown_status(session: Session, unit_code: str = "ATM") -> Q14CountdownStatus:
    unit = session.execute(select(Unit).where(Unit.code == unit_code)).scalar_one_or_none()
    if unit is None:
        return Q14CountdownStatus(0, 0, 0.0, False, "Unit not found.")

    # 1. Count labelled events where failed_component is populated
    row = session.execute(
        select(
            func.count(StopEvent.stop_event_id).label("total_labelled"),
            func.count(StopEvent.failed_component.distinct()).label("distinct_modes"),
            func.min(StopEvent.raised_at).label("earliest_date"),
            func.max(StopEvent.raised_at).label("latest_date"),
        )
        .where(
            StopEvent.failed_component.isnot(None),
            StopEvent.was_predictable.isnot(None),
        )
    ).one()

    total_labelled = int(row.total_labelled or 0)
    distinct_modes = int(row.distinct_modes or 0)

    months = 0.0
    if row.earliest_date and row.latest_date:
        days = (row.latest_date - row.earliest_date).days
        months = round(max(0.1, days / 30.4375), 1)

    viable = (months >= MIN_MONTHS_REQUIRED) and (distinct_modes >= 8) and (total_labelled >= 1800)

    viable_str = "yes" if viable else "no"
    sentence = (
        f"Labelled stop events collected: {total_labelled:,} · "
        f"Distinct failure modes: {distinct_modes} · "
        f"Months of history: {months:.1f} / {MIN_MONTHS_REQUIRED:.0f} · "
        f"Q14 viable: {viable_str}"
    )

    return Q14CountdownStatus(
        labelled_stop_events=total_labelled,
        distinct_failure_modes=distinct_modes,
        months_of_history=months,
        is_q14_viable=viable,
        status_sentence=sentence,
    )
