"""
Loom AI v2 — deterministic weaving formulas.

Every function here is pure (no DB, no I/O) so it can be unit-tested in
isolation and reused identically by the demo generator, the analytics
layer, and the suggestion rule engine — one implementation, never
duplicated.

Design rule (Anti-Slop rule 4 / design correction #1): a function returns
None, never a fabricated 0, when its inputs make the result undefined
(e.g. a zero denominator). Callers must render "No data" rather than "0%"
for a None result.

THE EFFICIENCY SPLIT (design correction #1 — read this before touching
anything that says "efficiency"):

  loom_efficiency_pct   -- THE mill's EFF%. Denominator is SCHEDULED
                           minutes. This is what reconciles against the
                           real July-2026 baseline (ATM 89.6%, etc.) and
                           is what "efficiency" means everywhere in the
                           product unless explicitly qualified otherwise.

  performance_eff_pct   -- Speed efficiency while the loom was actually
                           running. Denominator is RUNNING minutes.
                           Diagnostic only: separates "this loom runs
                           slow" from "this loom doesn't run". Never
                           shown as an unqualified "efficiency" number.

  utilization_pct       -- running_min / scheduled_min * 100.

  Identity (enforced by test_loom_efficiency_reconciles_with_performance_and_utilization):
      loom_efficiency_pct ~= performance_eff_pct * utilization_pct / 100
"""
from __future__ import annotations

import datetime
from decimal import Decimal, InvalidOperation
from typing import Optional, Union

Number = Union[int, float, Decimal]


def _to_decimal(value: Optional[Number]) -> Optional[Decimal]:
    if value is None:
        return None
    try:
        return value if isinstance(value, Decimal) else Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        return None


def _safe_div(numerator: Optional[Number], denominator: Optional[Number]) -> Optional[Decimal]:
    num = _to_decimal(numerator)
    denom = _to_decimal(denominator)
    if num is None or denom is None or denom == 0:
        return None
    return num / denom


def loom_efficiency_pct(
    actual_picks: Optional[Number],
    std_rpm: Optional[Number],
    scheduled_min: Optional[Number],
) -> Optional[Decimal]:
    """actual_picks / (std_rpm * scheduled_min) * 100.

    This is THE mill's EFF% — the headline number everywhere. Denominator
    is SCHEDULED minutes (not running minutes — see module docstring).
    None if std_rpm or scheduled_min is missing/zero.
    """
    std_rpm_d = _to_decimal(std_rpm)
    scheduled_d = _to_decimal(scheduled_min)
    if std_rpm_d is None or scheduled_d is None:
        return None
    denom = std_rpm_d * scheduled_d
    result = _safe_div(actual_picks, denom)
    return None if result is None else round(result * 100, 2)


def performance_eff_pct(
    actual_picks: Optional[Number],
    std_rpm: Optional[Number],
    running_min: Optional[Number],
) -> Optional[Decimal]:
    """actual_picks / (std_rpm * running_min) * 100.

    Diagnostic only. None if std_rpm or running_min is missing/zero
    (e.g. the loom never ran this shift — no performance figure exists).
    """
    std_rpm_d = _to_decimal(std_rpm)
    running_d = _to_decimal(running_min)
    if std_rpm_d is None or running_d is None:
        return None
    denom = std_rpm_d * running_d
    result = _safe_div(actual_picks, denom)
    return None if result is None else round(result * 100, 2)


def utilization_pct(
    running_min: Optional[Number],
    scheduled_min: Optional[Number],
) -> Optional[Decimal]:
    """running_min / scheduled_min * 100."""
    result = _safe_div(running_min, scheduled_min)
    return None if result is None else round(result * 100, 2)


def kilo_picks(picks_per_metre: Optional[Number], metres: Optional[Number]) -> Optional[Decimal]:
    """(picks_per_metre * metres) / 1000 — a derivation, used to assert
    consistency with a stored kilo_picks value, not to silently overwrite it."""
    ppm = _to_decimal(picks_per_metre)
    m = _to_decimal(metres)
    if ppm is None or m is None:
        return None
    return round((ppm * m) / Decimal(1000), 4)


def picks_per_metre_from_pick_density(picks_per_inch: Optional[Number]) -> Optional[Decimal]:
    """picks_per_inch * 39.3701 (inches per metre).

    Style codes like '66X55' encode ends/inch x picks/inch — this derives
    a real picks_per_metre from that density instead of a generic
    construction default (design correction #3).
    """
    ppi = _to_decimal(picks_per_inch)
    if ppi is None:
        return None
    return round(ppi * Decimal("39.3701"), 3)


def _breaks_per_1000(breaks: Optional[int], actual_picks: Optional[Number]) -> Optional[Decimal]:
    picks_d = _to_decimal(actual_picks)
    if picks_d is None or picks_d == 0:
        return None
    picks_in_thousands = picks_d / Decimal(1000)
    result = _safe_div(breaks, picks_in_thousands)
    return None if result is None else round(result, 3)


def warp_breaks_per_1000(warp_breaks: Optional[int], actual_picks: Optional[Number]) -> Optional[Decimal]:
    return _breaks_per_1000(warp_breaks, actual_picks)


def weft_breaks_per_1000(weft_breaks: Optional[int], actual_picks: Optional[Number]) -> Optional[Decimal]:
    return _breaks_per_1000(weft_breaks, actual_picks)


def cohort_gap_pp(
    loom_efficiency_pct_value: Optional[Number],
    cohort_median_eff: Optional[Number],
) -> Optional[Decimal]:
    """loom_efficiency_pct - cohort_median_eff, in percentage points.

    Both inputs MUST be loom_efficiency_pct (scheduled-time basis) — never
    performance_eff_pct, which would compare stoppage-hidden figures.
    None (never 0) when no cohort exists (design note about the
    ALL_HISTORY fallback and the <5-loom suggestion gate lives in the
    rule engine, not here — this function only computes the gap when both
    inputs are present).
    """
    loom_eff = _to_decimal(loom_efficiency_pct_value)
    cohort_eff = _to_decimal(cohort_median_eff)
    if loom_eff is None or cohort_eff is None:
        return None
    return round(loom_eff - cohort_eff, 2)


def mtbf_hours(running_min_total: Optional[Number], stop_count: Optional[int]) -> Optional[Decimal]:
    """Mean time between failures, in hours."""
    running_hours = _safe_div(running_min_total, 60)
    if running_hours is None:
        return None
    result = _safe_div(running_hours, stop_count)
    return None if result is None else round(result, 2)


def _minutes_between(later: Optional[datetime.datetime], earlier: Optional[datetime.datetime]) -> Optional[Decimal]:
    if later is None or earlier is None:
        return None
    delta = later - earlier
    return round(Decimal(delta.total_seconds()) / Decimal(60), 2)


def mttr_min(resolved_at: Optional[datetime.datetime], attending_at: Optional[datetime.datetime]) -> Optional[Decimal]:
    """Mean time to repair: resolved_at - attending_at, in minutes."""
    return _minutes_between(resolved_at, attending_at)


def response_min(acknowledged_at: Optional[datetime.datetime], raised_at: Optional[datetime.datetime]) -> Optional[Decimal]:
    """Response time: acknowledged_at - raised_at, in minutes."""
    return _minutes_between(acknowledged_at, raised_at)


def lost_metres(
    metres: Optional[Number],
    running_min: Optional[Number],
    stopped_min: Optional[Number],
) -> Optional[Decimal]:
    """(metres / running_min) * stopped_min — metres that would have been
    woven during the stopped time, at this shift's own realized rate.
    None if running_min is missing/zero (no rate to project from)."""
    rate_per_min = _safe_div(metres, running_min)
    if rate_per_min is None:
        return None
    stopped = _to_decimal(stopped_min)
    if stopped is None:
        return None
    return round(rate_per_min * stopped, 3)


def lost_revenue(
    lost_metres_value: Optional[Number],
    revenue_per_metre: Optional[Number],
    rate_source: str,
) -> tuple[Optional[Decimal], str]:
    """Returns (value, rate_source). Caller MUST render rate_source in the
    UI (Anti-Slop rule 8) — a ₹ figure without its rate assumption visible
    is not allowed."""
    lm = _to_decimal(lost_metres_value)
    rate = _to_decimal(revenue_per_metre)
    if lm is None or rate is None:
        return None, rate_source
    return round(lm * rate, 2), rate_source


def efficiency_gap_value(
    cohort_p90_eff: Optional[Number],
    loom_efficiency_pct_value: Optional[Number],
    potential_metres: Optional[Number],
    revenue_per_metre: Optional[Number],
) -> Optional[Decimal]:
    """(cohort_p90_eff - loom_eff)/100 * potential_metres * revenue_per_metre.
    None if the loom is already at/above cohort_p90 (no gap) or any input
    is missing — never returns a negative "opportunity"."""
    p90 = _to_decimal(cohort_p90_eff)
    loom_eff = _to_decimal(loom_efficiency_pct_value)
    metres = _to_decimal(potential_metres)
    rate = _to_decimal(revenue_per_metre)
    if p90 is None or loom_eff is None or metres is None or rate is None:
        return None
    gap_pct = p90 - loom_eff
    if gap_pct <= 0:
        return None
    return round((gap_pct / Decimal(100)) * metres * rate, 2)


def crimp_deviation_pp(
    actual_crimp_pct: Optional[Number],
    std_crimp_pct: Optional[Number],
) -> Optional[Decimal]:
    """actual_crimp_pct - std_crimp_pct, in percentage points.

    None while actual_crimp_pct is unmeasured (Q18-Q20 BLOCKED pending a
    lab feed) — never silently 0. This function is correct and tested now
    so it activates the moment real crimp data connects."""
    actual = _to_decimal(actual_crimp_pct)
    std = _to_decimal(std_crimp_pct)
    if actual is None or std is None:
        return None
    return round(actual - std, 2)


def weaver_index(
    weaver_efficiency_pct: Optional[Number],
    std_efficiency_pct: Optional[Number],
) -> Optional[Decimal]:
    """weaver_efficiency_pct / std_efficiency_pct.

    weaver_efficiency_pct must be a loom_efficiency_pct-basis figure
    aggregated over the weaver's looms/shifts, not performance_eff_pct.
    A value < 1.0 means the weaver is below their own grade's standard
    (e.g. below the 97.5% in "8-Looms + 97.5%")."""
    result = _safe_div(weaver_efficiency_pct, std_efficiency_pct)
    return None if result is None else round(result, 4)


# ── Q2: Warp / Weft Extra Timing Analytics ──────────────────────────────────

def extra_warp_time(
    actual_warp_time_min: Optional[Number],
    std_warp_time_min: Optional[Number],
) -> Optional[Decimal]:
    """max(actual_warp_time - std_warp_time, 0)."""
    act = _to_decimal(actual_warp_time_min)
    std = _to_decimal(std_warp_time_min)
    if act is None or std is None:
        return None
    return max(Decimal("0.0"), act - std)


def extra_weft_time(
    actual_weft_time_min: Optional[Number],
    std_weft_time_min: Optional[Number],
) -> Optional[Decimal]:
    """max(actual_weft_time - std_weft_time, 0)."""
    act = _to_decimal(actual_weft_time_min)
    std = _to_decimal(std_weft_time_min)
    if act is None or std is None:
        return None
    return max(Decimal("0.0"), act - std)


def warp_weft_production_loss(
    extra_warp_min: Optional[Number],
    extra_weft_min: Optional[Number],
    std_rpm: Optional[Number],
    picks_per_metre: Optional[Number],
) -> Optional[Decimal]:
    """((extra_warp_min + extra_weft_min) * std_rpm) / picks_per_metre."""
    ew = _to_decimal(extra_warp_min) or Decimal("0.0")
    et = _to_decimal(extra_weft_min) or Decimal("0.0")
    rpm = _to_decimal(std_rpm)
    ppm = _to_decimal(picks_per_metre)
    if rpm is None or ppm is None or ppm == 0:
        return None
    total_extra_min = ew + et
    if total_extra_min <= 0:
        return Decimal("0.0")
    lost = (total_extra_min * rpm) / ppm
    return round(lost, 3)


# ── Q3: Composite Performance Score (CPS) ──────────────────────────────────

def composite_performance_score(
    efficiency_pct: Optional[Number],
    utilization_pct_val: Optional[Number],
    warp_breaks_per_1000_val: Optional[Number],
    weft_breaks_per_1000_val: Optional[Number],
    target_achievement_pct: Optional[Number],
) -> Optional[Decimal]:
    """
    Transparent Loom Performance Score (Q3):
    CPS = (0.40 * Norm(Eff)) + (0.30 * Norm(Util)) + (0.15 * Norm(1 - BreakRate)) + (0.15 * Norm(TargetAch))
    Score is on a 0 - 100 scale.
    """
    eff = _to_decimal(efficiency_pct)
    util = _to_decimal(utilization_pct_val)
    if eff is None or util is None:
        return None
    
    # Base normalization
    norm_eff = min(Decimal("100.0"), max(Decimal("0.0"), eff))
    norm_util = min(Decimal("100.0"), max(Decimal("0.0"), util))
    
    # Break rate penalty (lower breaks = higher score)
    wbr = _to_decimal(warp_breaks_per_1000_val) or Decimal("0.0")
    tbr = _to_decimal(weft_breaks_per_1000_val) or Decimal("0.0")
    total_breaks = wbr + tbr
    norm_breaks = max(Decimal("0.0"), Decimal("100.0") - (total_breaks * Decimal("20.0")))
    
    # Target achievement
    ach = _to_decimal(target_achievement_pct) or Decimal("100.0")
    norm_ach = min(Decimal("100.0"), max(Decimal("0.0"), ach))
    
    cps = (
        (norm_eff * Decimal("0.40")) +
        (norm_util * Decimal("0.30")) +
        (norm_breaks * Decimal("0.15")) +
        (norm_ach * Decimal("0.15"))
    )
    return round(cps, 1)


# ── Q15-Q17: Air & Compressor Intelligence ──────────────────────────────────

def air_excess_cfm(actual_cfm: Optional[Number], standard_cfm: Optional[Number]) -> Optional[Decimal]:
    """max(actual_cfm - standard_cfm, 0)."""
    act = _to_decimal(actual_cfm)
    std = _to_decimal(standard_cfm)
    if act is None or std is None:
        return None
    return max(Decimal("0.0"), round(act - std, 2))


def air_power_loss_kwh(excess_cfm: Optional[Number], running_hours: Optional[Number]) -> Optional[Decimal]:
    """(excess_cfm / 4.5) * running_hours (~4.5 CFM per kW rule of thumb)."""
    ex = _to_decimal(excess_cfm)
    hrs = _to_decimal(running_hours)
    if ex is None or hrs is None:
        return None
    if ex <= 0:
        return Decimal("0.0")
    kwh = (ex / Decimal("4.5")) * hrs
    return round(kwh, 2)


def air_loss_cost(power_loss_kwh: Optional[Number], tariff_per_kwh: Optional[Number] = Decimal("8.50")) -> Optional[Decimal]:
    """power_loss_kwh * tariff_per_kwh."""
    pwr = _to_decimal(power_loss_kwh)
    rate = _to_decimal(tariff_per_kwh)
    if pwr is None or rate is None:
        return None
    return round(pwr * rate, 2)


# ── Q18-Q20: Quality Intelligence ──────────────────────────────────────────

def defect_rate_pct(defective_metres: Optional[Number], total_inspected_metres: Optional[Number]) -> Optional[Decimal]:
    """(defective_metres / total_inspected_metres) * 100."""
    result = _safe_div(defective_metres, total_inspected_metres)
    return None if result is None else round(result * Decimal("100.0"), 2)


def yarn_waste_pct(waste_kg: Optional[Number], yarn_input_kg: Optional[Number]) -> Optional[Decimal]:
    """(waste_kg / yarn_input_kg) * 100."""
    result = _safe_div(waste_kg, yarn_input_kg)
    return None if result is None else round(result * Decimal("100.0"), 2)


# ── Q10: Manpower Shortage Loss Model ──────────────────────────────────────

def manpower_shortage_loss(
    shortage_weavers: Optional[int],
    shift_hours: Optional[Number] = Decimal("8.0"),
    looms_per_weaver: Optional[Number] = Decimal("6.0"),
    std_rpm: Optional[Number] = Decimal("650.0"),
    picks_per_metre: Optional[Number] = Decimal("1968.5"),
) -> Optional[Decimal]:
    """
    shortage_hours = shortage_weavers * shift_hours
    unattended_loom_hours = shortage_hours * looms_per_weaver
    lost_metres = unattended_loom_hours * 60 * std_rpm / picks_per_metre
    """
    if shortage_weavers is None or shortage_weavers <= 0:
        return Decimal("0.0")
    sh = Decimal(str(shortage_weavers))
    hrs = _to_decimal(shift_hours)
    lpw = _to_decimal(looms_per_weaver)
    rpm = _to_decimal(std_rpm)
    ppm = _to_decimal(picks_per_metre)
    if hrs is None or lpw is None or rpm is None or ppm is None or ppm == 0:
        return None
    unattended_loom_hrs = sh * hrs * lpw
    lost_metres = (unattended_loom_hrs * Decimal("60.0") * rpm) / ppm
    return round(lost_metres, 2)

