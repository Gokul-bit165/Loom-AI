"""
Loom AI v2 — 30-day rolling cohort statistics.

The cohort for a given loom is defined as:
  all production_log rows for looms of the SAME loom_type_code running the
  SAME style_code within a 30-day window ending on as_of_date.

Gate: if fewer than 5 distinct looms are in the cohort, returns None.
Callers MUST render "cohort: N looms -- insufficient" (not a blank, not 0).

Performance optimization (Correction 5):
  get_all_cohort_stats_for_window() computes cohort stats for ALL (style_id, loom_type_code)
  pairs in the 30-day window in a SINGLE batch query, avoiding the N+1 192 correlated subqueries.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db_models import Loom, ProductionLog
from app.analytics.formulas import loom_efficiency_pct as calc_loom_eff

COHORT_MIN_LOOMS = 5          # gate: fewer than this -> None
COHORT_WINDOW_DAYS = 30


class CohortResult:
    """Immutable cohort statistics. None values mean insufficient data."""
    __slots__ = ("median_eff", "p90_eff", "loom_count", "window", "sufficient")

    def __init__(
        self,
        median_eff: Optional[Decimal],
        p90_eff: Optional[Decimal],
        loom_count: int,
        window: str,
        sufficient: bool,
    ):
        self.median_eff = median_eff
        self.p90_eff = p90_eff
        self.loom_count = loom_count
        self.window = window
        self.sufficient = sufficient


def get_all_cohort_stats_for_window(
    session: Session,
    as_of_date: datetime.date,
) -> dict[tuple[int, str], CohortResult]:
    """
    Computes rolling 30-day cohort stats for ALL (style_id, loom_type_code) pairs
    in a SINGLE query. Returns a dict keyed by (style_id, loom_type_code).
    """
    window_start = as_of_date - datetime.timedelta(days=COHORT_WINDOW_DAYS - 1)

    # 1 single query grouping by (style_id, loom_type_code, loom_id)
    # to get per-loom aggregates over the 30-day window
    rows = session.execute(
        select(
            ProductionLog.style_id,
            Loom.loom_type_code,
            ProductionLog.loom_id,
            func.sum(ProductionLog.actual_picks).label("total_picks"),
            func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
            func.sum(ProductionLog.scheduled_minutes).label("total_sched"),
        )
        .join(Loom, Loom.loom_id == ProductionLog.loom_id)
        .where(
            ProductionLog.work_date >= window_start,
            ProductionLog.work_date <= as_of_date,
            ProductionLog.is_current == True,
        )
        .group_by(ProductionLog.style_id, Loom.loom_type_code, ProductionLog.loom_id)
    ).all()

    # Group by (style_id, loom_type_code) -> list of loom efficiencies
    grouped: dict[tuple[int, str], list[Decimal]] = {}
    for r in rows:
        key = (r.style_id, r.loom_type_code)
        if key not in grouped:
            grouped[key] = []
        eff = calc_loom_eff(
            actual_picks=int(r.total_picks),
            std_rpm=Decimal(str(r.avg_rpm)),
            scheduled_min=int(r.total_sched),
        )
        if eff is not None:
            grouped[key].append(eff)

    result_map: dict[tuple[int, str], CohortResult] = {}
    for key, effs in grouped.items():
        loom_count = len(effs)
        if loom_count < COHORT_MIN_LOOMS:
            result_map[key] = CohortResult(
                median_eff=None,
                p90_eff=None,
                loom_count=loom_count,
                window=f"{COHORT_WINDOW_DAYS}d",
                sufficient=False,
            )
        else:
            effs_sorted = sorted(effs)
            n = len(effs_sorted)
            median_eff = effs_sorted[n // 2]
            p90_idx = int(n * 0.90)
            p90_eff = effs_sorted[min(p90_idx, n - 1)]
            result_map[key] = CohortResult(
                median_eff=round(median_eff, 2),
                p90_eff=round(p90_eff, 2),
                loom_count=loom_count,
                window=f"{COHORT_WINDOW_DAYS}d",
                sufficient=True,
            )

    return result_map


def get_cohort_stats(
    session: Session,
    style_id: int,
    loom_type_code: str,
    as_of_date: datetime.date,
) -> CohortResult:
    """Convenience helper for single loom lookup."""
    all_map = get_all_cohort_stats_for_window(session, as_of_date)
    return all_map.get(
        (style_id, loom_type_code),
        CohortResult(None, None, 0, f"{COHORT_WINDOW_DAYS}d", False),
    )
