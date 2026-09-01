"""
Loom AI v2 — ATM-only demo data generator.

Generates beam_run, assignment, production_log, stop_event, fabric_roll
for ATM's 192 seeded looms over July 2026 (the month the real baseline
table in docs/V2_DESIGN.md §3 covers). Vendor units are NOT generated —
they only have the vendor_unit_monthly_summary rows loaded by
app.seed.masters (design correction §1.1).

Determinism: every draw goes through one numpy.random.default_rng(DEMO_SEED)
instance threaded explicitly through the call chain — no bare `random.*`
calls anywhere in this module, so re-running produces identical output.

Efficiency model (design correction #1 — READ app/analytics/formulas.py
first): `loom_efficiency_pct` is constructed directly as a target value
(schedule-time basis) from unit/shift/style/loom effects, and
`actual_picks` is derived from it via the exact inverse of
`formulas.loom_efficiency_pct`. `performance_eff_pct` (how fast the loom
ran while running) is then drawn independently >= that target, and
`running_minutes` is derived from it — this guarantees the
loom_efficiency/performance/utilization identity holds BY CONSTRUCTION,
not by after-the-fact adjustment.

Calibration (design correction #2 — the calibration step never tunes
`unit_target_eff`, the one confirmed real number): because
`actual_picks` scales linearly in `std_rpm` for a fixed target
`loom_efficiency_pct`, a single closed-form scale factor on `std_rpm`
recalibrates BOTH total kilo-picks and total metres simultaneously
(they scale by the same factor) — no iterative regeneration is needed
for this linear case. The factor is computed once, applied, and logged.
"""
from __future__ import annotations

import datetime
from dataclasses import dataclass
from decimal import Decimal

import numpy as np
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import DEMO_SEED
from app.db_models import (
    Assignment,
    BeamRun,
    DataSource,
    Employee,
    EmployeeRole,
    FabricRoll,
    Loom,
    ProductionLog,
    ReasonCategory,
    ReasonCode,
    ShiftMaster,
    StopEvent,
    StopStatus,
    Style,
    Unit,
)

MONTH_START = datetime.date(2026, 7, 1)
MONTH_END = datetime.date(2026, 7, 31)
SCHEDULED_MINUTES = 480

UNIT_TARGET_EFF = Decimal("89.6")  # the one confirmed real number — never tuned (correction #2)
ATM_TARGET_KILO_PICKS = Decimal("3331544")
ATM_TARGET_METRES = Decimal("1541450")
ATM_TARGET_ROLLS = 2474

SHIFT_EFF_FACTOR = {"1": 1.0, "2": 91.18 / 89.48, "3": 88.03 / 89.48}

# Style-selection weights within a loom's style pool. The real ATM implied
# picks/metre (~2161, see test_demo_picks_per_metre_ratio) is very close
# to the dominant plain construction's own ppm (~2165, style '66X55...'),
# which means that style is the overwhelming majority of ATM's real
# volume — the other 9 styles are lower-volume specialty orders (satins,
# high-crimp slubs). Uniform random selection across the pool pulls the
# average picks/metre well above the real ratio (satin styles run 2-3x
# denser); this weighting corrects that without touching the calibration
# factor, which only rescales volume, not mix.
DOMINANT_STYLE_CODE = '30s VSF X 30s VSF /66X55&43&57-63" Plain'
# Weight chosen so the pool-average picks/metre converges close to the
# dominant style's own ~2165 ppm (itself already within 0.2% of the real
# implied 2161 ppm) — the other 9 styles range 1732-4331 ppm, so even a
# fairly high weight is needed to keep them from pulling the average up.
DOMINANT_STYLE_WEIGHT = 500.0
OTHER_STYLE_WEIGHT = 1.0

# Reason category weights, anchored to the plant's own MRM (42.9%/74.9%
# stoppage shares in comparable categories, ~9.5 EB-failure hrs + 24
# voltage events/month plant-wide). ELECTRICAL dominates.
REASON_WEIGHTS: dict[ReasonCategory, float] = {
    ReasonCategory.ELECTRICAL: 0.50,
    ReasonCategory.MECHANICAL: 0.20,
    ReasonCategory.MATERIAL: 0.10,
    ReasonCategory.MANPOWER: 0.08,
    ReasonCategory.PLANNED: 0.12,
}
REASON_CODE_BY_CATEGORY = {
    ReasonCategory.ELECTRICAL: ["POWER_FAILURE", "VOLTAGE_FLUCTUATION", "ELECTRICAL_BREAKDOWN"],
    ReasonCategory.MECHANICAL: ["MECHANICAL_BREAKDOWN", "WEFT_FEEDER_FAULT", "AIR_PRESSURE_LOW"],
    ReasonCategory.MATERIAL: ["WARP_BREAK", "WEFT_BREAK"],
    ReasonCategory.MANPOWER: ["NO_WEAVER"],
    ReasonCategory.PLANNED: ["SORT_BEAM_CHANGE", "KNOTTING", "GAITING", "PREVENTIVE_MAINTENANCE", "ROLL_DOFFING"],
}
# Typical single-event duration bounds (minutes) per category — electrical/
# mechanical longer-tailed than material/manpower, per design §3 Step 5.
DURATION_BOUNDS_MIN = {
    ReasonCategory.ELECTRICAL: (10, 90),
    ReasonCategory.MECHANICAL: (15, 150),
    ReasonCategory.MATERIAL: (3, 15),
    ReasonCategory.MANPOWER: (30, 240),
    ReasonCategory.PLANNED: (10, 60),
}


@dataclass
class LoomProfile:
    loom: Loom
    style_pool: list[Style]
    efficiency_offset: float
    break_offset: float
    degrade_window: tuple[datetime.date, datetime.date] | None  # (start, breakdown_day)


def generate_atm_month(session: Session, seed: int = DEMO_SEED) -> dict:
    """Generates one calendar month (July 2026) of ATM demo data.
    Returns a summary dict of totals for the reconciliation tests."""
    rng = np.random.default_rng(seed)

    atm = session.execute(select(Unit).where(Unit.code == "ATM")).scalar_one()
    looms = session.execute(select(Loom).where(Loom.unit_id == atm.unit_id)).scalars().all()
    styles = session.execute(select(Style)).scalars().all()
    shifts = session.execute(select(ShiftMaster)).scalars().all()
    reason_codes = {rc.code: rc for rc in session.execute(select(ReasonCode)).scalars().all()}
    weavers = session.execute(
        select(Employee).where(
            Employee.unit_id == atm.unit_id,
            Employee.role.in_([EmployeeRole.WEAVER, EmployeeRole.TRAINING_WEAVER]),
        )
    ).scalars().all()

    # Pool by MAKE (airjet vs Sulzer), not by exact loom_type_code — a
    # 910-type airjet loom can still run a style catalogued under '810',
    # the two Tsudakoma models are interchangeable for style assignment.
    # (Bug found via test_demo_atm_matches_vendor_mrm: restricting to the
    # exact code cut the dominant style out of half the airjet looms'
    # pools entirely, since it happened to be catalogued under '810'.)
    airjet_codes = {"810", "910"}
    sulzer_codes = {"340", "280", "TS", "SZ"}
    airjet_styles = [s for s in styles if s.loom_type_code in airjet_codes]
    sulzer_styles = [s for s in styles if s.loom_type_code in sulzer_codes]

    # ── Step 3: per-loom persistent effects ─────────────────────────────
    # 85% normal ~ N(+1.6, 1.5), 15% chronic ~ N(-9, 2). The +1.6 mean on
    # the normal group compensates the chronic group's -9pp*0.15 pull so
    # the weighted average offset is ~0 and the unit mean stays anchored
    # at UNIT_TARGET_EFF (documented compensation, not an accident).
    profiles: list[LoomProfile] = []
    degrade_loom_indices = set(rng.choice(len(looms), size=min(2, len(looms)), replace=False))
    for i, loom in enumerate(looms):
        is_chronic = rng.random() < 0.15
        eff_offset = rng.normal(-9.0, 2.0) if is_chronic else rng.normal(1.6, 1.5)
        eff_offset = float(np.clip(eff_offset, -20.0, 10.0))
        break_offset = max(0.0, -eff_offset * 0.15 + rng.normal(0, 0.3))

        degrade_window = None
        if i in degrade_loom_indices:
            start_day = int(rng.integers(1, 15))
            degrade_window = (
                MONTH_START + datetime.timedelta(days=start_day),
                MONTH_START + datetime.timedelta(days=start_day + 9),
            )

        pool = airjet_styles if loom.loom_type_code in airjet_codes else sulzer_styles
        profiles.append(LoomProfile(loom=loom, style_pool=pool, efficiency_offset=eff_offset,
                                     break_offset=break_offset, degrade_window=degrade_window))

    # ── Step 2: beam runs (style changes every 6-12 days per loom) ──────
    beam_run_by_loom_day: dict[tuple[int, datetime.date], BeamRun] = {}
    for profile in profiles:
        pool_weights = np.array(
            [DOMINANT_STYLE_WEIGHT if s.style_code == DOMINANT_STYLE_CODE else OTHER_STYLE_WEIGHT
             for s in profile.style_pool]
        )
        pool_weights = pool_weights / pool_weights.sum()
        current_day = MONTH_START
        while current_day <= MONTH_END:
            style = profile.style_pool[int(rng.choice(len(profile.style_pool), p=pool_weights))]
            run_length = int(rng.integers(6, 13))
            run_end = min(current_day + datetime.timedelta(days=run_length - 1), MONTH_END)
            beam_run = BeamRun(
                loom_id=profile.loom.loom_id, style_id=style.style_id,
                started_at=datetime.datetime.combine(current_day, datetime.time(0, 0)),
                ended_at=datetime.datetime.combine(run_end, datetime.time(23, 59)),
                source=DataSource.DEMO,
            )
            session.add(beam_run)
            session.flush()
            day = current_day
            while day <= run_end:
                beam_run_by_loom_day[(profile.loom.loom_id, day)] = beam_run
                day += datetime.timedelta(days=1)
            current_day = run_end + datetime.timedelta(days=1)

    # ── Assignment: round-robin weavers across looms per shift/date ─────
    _generate_assignments(session, looms, shifts, weavers, rng)

    # ── Step 4-5: per-shift production + stop events ─────────────────────
    raw_rows: list[dict] = []
    day = MONTH_START
    while day <= MONTH_END:
        for shift in shifts:
            for profile in profiles:
                style = beam_run_by_loom_day[(profile.loom.loom_id, day)]
                raw_rows.append(
                    _generate_one_shift(session, profile, style, day, shift, rng, reason_codes)
                )
        day += datetime.timedelta(days=1)

    # ── Step 6: closed-form calibration on std_rpm (correction #2) ──────
    raw_total_kilo_picks = sum(r["actual_picks"] for r in raw_rows) / Decimal(1000)
    calibration_factor = (
        (ATM_TARGET_KILO_PICKS / raw_total_kilo_picks) if raw_total_kilo_picks > 0 else Decimal(1)
    )
    _apply_calibration(session, raw_rows, calibration_factor)

    # ── Step 7: fabric rolls, calibrated on roll count ───────────────────
    total_metres = sum(r["metres"] for r in raw_rows)
    _generate_fabric_rolls(session, raw_rows, total_metres, rng)

    session.flush()

    total_kilo_picks = sum(r["actual_picks"] for r in raw_rows) / Decimal(1000)
    total_actual_picks = sum(r["actual_picks"] for r in raw_rows)
    weighted_eff = sum(Decimal(str(r["loom_efficiency_pct"])) * r["actual_picks"] for r in raw_rows) / (
        total_actual_picks or 1
    )

    return {
        "ATM": {
            "kilo_picks": float(total_kilo_picks),
            "metres": float(total_metres),
            "eff": float(weighted_eff),
            "rolls": len(session.execute(select(FabricRoll)).scalars().all()),
            "calibration_factor": float(calibration_factor),
            "row_count": len(raw_rows),
        }
    }


def _generate_assignments(session: Session, looms, shifts, weavers, rng) -> None:
    if not weavers:
        return
    day = MONTH_START
    while day <= MONTH_END:
        for shift in shifts:
            loom_idx = 0
            weaver_cycle = 0
            while loom_idx < len(looms):
                weaver = weavers[weaver_cycle % len(weavers)]
                block = weaver.std_looms or 4
                for loom in looms[loom_idx: loom_idx + block]:
                    session.add(
                        Assignment(
                            loom_id=loom.loom_id, shift_id=shift.shift_id, work_date=day,
                            employee_id=weaver.employee_id, source=DataSource.DEMO,
                        )
                    )
                loom_idx += block
                weaver_cycle += 1
        day += datetime.timedelta(days=1)
    session.flush()


def _generate_one_shift(session, profile: LoomProfile, beam_run: BeamRun, day, shift, rng, reason_codes) -> dict:
    style: Style = session.get(Style, beam_run.style_id)

    style_penalty = float(style.std_efficiency_pct) - 90.0  # baseline dominant style's std_eff
    shift_multiplier = SHIFT_EFF_FACTOR[shift.code]
    daily_noise = float(rng.normal(0, 1.0))

    degrade_delta = 0.0
    if profile.degrade_window:
        start, breakdown_day = profile.degrade_window
        if start <= day <= breakdown_day:
            days_in = (day - start).days
            degrade_delta = -0.5 * days_in

    base_eff = (float(UNIT_TARGET_EFF) * shift_multiplier) + style_penalty + profile.efficiency_offset + daily_noise + degrade_delta
    loom_eff = float(np.clip(base_eff, 40.0, 100.0))

    std_rpm = float(style.std_rpm)
    actual_picks = round(std_rpm * SCHEDULED_MINUTES * loom_eff / 100.0)

    # performance_eff_pct >= loom_eff (running-time basis is always >=
    # schedule-time basis) — drawn independently, then running_minutes
    # derived, guaranteeing the identity holds by construction.
    performance_eff = float(np.clip(rng.normal(97.0, 1.5), max(loom_eff, 80.0), 100.0))
    running_minutes = min(SCHEDULED_MINUTES, round(actual_picks / (std_rpm * performance_eff / 100.0)))
    stopped_minutes = SCHEDULED_MINUTES - running_minutes

    metres = actual_picks / float(style.picks_per_metre) if style.picks_per_metre else 0.0

    warp_rate_per_hr = 0.63 + profile.break_offset  # ATM baseline anchor
    weft_rate_per_hr = 2.26 + profile.break_offset
    running_hours = running_minutes / 60.0
    warp_breaks = int(rng.poisson(max(warp_rate_per_hr * running_hours, 0.01)))
    weft_breaks = int(rng.poisson(max(weft_rate_per_hr * running_hours, 0.01)))

    prod_log = ProductionLog(
        loom_id=profile.loom.loom_id, work_date=day, shift_id=shift.shift_id,
        beam_run_id=beam_run.beam_run_id, style_id=style.style_id, employee_id=None,
        scheduled_minutes=SCHEDULED_MINUTES, running_minutes=running_minutes,
        std_rpm_snapshot=Decimal(str(round(std_rpm, 2))),
        actual_picks=actual_picks, metres=Decimal(str(round(metres, 3))),
        kilo_picks=Decimal(str(round(actual_picks / 1000.0, 4))),
        warp_breaks=warp_breaks, weft_breaks=weft_breaks,
        actual_crimp_pct=None,  # stays NULL — Q18-Q20 BLOCKED (design note §1.3)
        source=DataSource.DEMO,
    )
    session.add(prod_log)
    session.flush()

    _generate_stop_events(session, profile.loom, day, shift, stopped_minutes, reason_codes, rng)

    return {
        "loom_id": profile.loom.loom_id, "production_log": prod_log,
        "actual_picks": actual_picks, "metres": Decimal(str(round(metres, 3))),
        "loom_efficiency_pct": loom_eff,
        "std_rpm": std_rpm, "picks_per_metre": style.picks_per_metre,
    }


def _generate_stop_events(session, loom: Loom, day, shift, stopped_minutes: int, reason_codes, rng) -> None:
    if stopped_minutes <= 0:
        return
    remaining = stopped_minutes
    shift_start = datetime.datetime.combine(day, datetime.time(0, 0))
    cursor_minute = 0
    categories = list(REASON_WEIGHTS.keys())
    weights = np.array(list(REASON_WEIGHTS.values()))
    weights = weights / weights.sum()

    n_events = int(rng.integers(1, 5))
    for i in range(n_events):
        if remaining <= 0:
            break
        category = categories[rng.choice(len(categories), p=weights)]
        low, high = DURATION_BOUNDS_MIN[category]
        duration = min(remaining, int(rng.integers(low, high + 1)))
        if duration <= 0:
            continue
        code = REASON_CODE_BY_CATEGORY[category][int(rng.integers(0, len(REASON_CODE_BY_CATEGORY[category])))]
        reason = reason_codes.get(code)

        raised_at = shift_start + datetime.timedelta(minutes=cursor_minute + int(rng.integers(0, 30)))
        acknowledged_at = raised_at + datetime.timedelta(minutes=int(rng.integers(5, 21)))
        attending_at = acknowledged_at + datetime.timedelta(minutes=int(rng.integers(2, 16)))
        resolved_at = attending_at + datetime.timedelta(minutes=duration)

        session.add(
            StopEvent(
                loom_id=loom.loom_id, work_date=day, shift_id=shift.shift_id,
                raised_at=raised_at, acknowledged_at=acknowledged_at,
                attending_at=attending_at, resolved_at=resolved_at,
                reason_code_id=reason.reason_code_id if reason else None,
                raw_remark=None, status=StopStatus.RESOLVED,
                source=DataSource.DEMO,
            )
        )
        remaining -= duration
        cursor_minute += duration + 30


def _apply_calibration(session, raw_rows: list[dict], factor: Decimal) -> None:
    """Closed-form rescale of actual_picks/metres/kilo_picks by `factor`
    (see module docstring — exploits linearity in std_rpm, no iteration
    needed). Bounded: refuses to apply a factor outside [0.5, 2.0], which
    would indicate a wrong seed assumption (e.g. std_rpm) rather than
    something a scale factor should paper over (design correction #2)."""
    if factor < Decimal("0.5") or factor > Decimal("2.0"):
        raise ValueError(
            f"Calibration factor {factor} is outside [0.5, 2.0] — this indicates a wrong "
            "seed assumption (std_rpm, loom count, or scheduled_minutes), not something "
            "a scale factor should paper over. Stopping per design correction #2."
        )
    for row in raw_rows:
        new_picks = int(round(row["actual_picks"] * factor))
        row["actual_picks"] = new_picks
        new_metres = Decimal(str(new_picks)) / Decimal(str(row["picks_per_metre"]))
        row["metres"] = round(new_metres, 3)
        prod_log: ProductionLog = row["production_log"]
        prod_log.actual_picks = new_picks
        prod_log.metres = row["metres"]
        prod_log.kilo_picks = round(Decimal(new_picks) / Decimal(1000), 4)


def _generate_fabric_rolls(session, raw_rows: list[dict], total_metres: Decimal, rng) -> None:
    """A single shift (~76 m for one loom) rarely completes a whole roll
    (~551 m at ATM's target ratio) — rolls accumulate across shifts on the
    same loom, in chronological order, and a roll is doffed each time the
    running total crosses the per-roll threshold, carrying the remainder
    forward. This is what makes the total land near ATM_TARGET_ROLLS
    instead of rounding almost every row down to zero."""
    if total_metres <= 0:
        return
    metres_per_roll = float(total_metres / Decimal(ATM_TARGET_ROLLS))

    accumulator: dict[int, float] = {}
    for row in sorted(raw_rows, key=lambda r: (r["loom_id"], r["production_log"].work_date, r["production_log"].shift_id)):
        loom_id = row["loom_id"]
        accumulator[loom_id] = accumulator.get(loom_id, 0.0) + float(row["metres"])
        while accumulator[loom_id] >= metres_per_roll:
            accumulator[loom_id] -= metres_per_roll
            weight = float(rng.uniform(50, 200))
            session.add(
                FabricRoll(
                    loom_id=loom_id, style_id=row["production_log"].style_id,
                    work_date=row["production_log"].work_date, shift_id=row["production_log"].shift_id,
                    metres=Decimal(str(round(metres_per_roll, 2))),
                    weight_kg=Decimal(str(round(weight, 2))),
                    source=DataSource.DEMO,
                )
            )
