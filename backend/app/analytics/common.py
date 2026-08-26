"""
Loom AI — Common utilities and deterministic rules for the analytics engine.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from enum import Enum
from typing import Any


class PerformanceStatus(str, Enum):
    """
    Deterministic performance status classification based on efficiency %.
    """
    OPTIMAL = "OPTIMAL"          # Efficiency >= 95.0%
    ACCEPTABLE = "ACCEPTABLE"    # Efficiency >= 90.0% and < 95.0%
    UNDERPERFORMING = "UNDERPERFORMING"  # Efficiency >= 80.0% and < 90.0%
    CRITICAL = "CRITICAL"        # Efficiency < 80.0%


def classify_performance(efficiency_pct: float | Decimal) -> PerformanceStatus:
    eff = float(efficiency_pct)
    if eff >= 95.0:
        return PerformanceStatus.OPTIMAL
    elif eff >= 90.0:
        return PerformanceStatus.ACCEPTABLE
    elif eff >= 80.0:
        return PerformanceStatus.UNDERPERFORMING
    else:
        return PerformanceStatus.CRITICAL


def safe_divide(numerator: float | Decimal, denominator: float | Decimal, default: float = 0.0) -> float:
    try:
        num = float(numerator)
        denom = float(denominator)
        if denom == 0.0:
            return default
        return num / denom
    except (ZeroDivisionError, ValueError, TypeError):
        return default


def safe_pct_change(current: float | Decimal, previous: float | Decimal) -> float | None:
    try:
        curr = float(current)
        prev = float(previous)
        if prev == 0.0:
            return None
        return round(((curr - prev) / prev) * 100.0, 2)
    except (ZeroDivisionError, ValueError, TypeError):
        return None


def get_month_date_range(target_date: datetime.date) -> tuple[datetime.date, datetime.date]:
    """
    Returns (start_of_month, target_date) for MTD aggregations.
    """
    start_of_month = target_date.replace(day=1)
    return start_of_month, target_date
