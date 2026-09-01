"""
Diagnostic: print the full monthly loom_efficiency_pct histogram for ATM,
in 2pp buckets. Also prints worst-20 looms and checks floor application.

Run from v2/backend with DB credentials set.
"""
from __future__ import annotations
import os, sys, statistics

os.environ.setdefault("V2_POSTGRES_USER", "loom_ai")
os.environ.setdefault("V2_POSTGRES_PASSWORD", "loom_ai_pass_2026")
os.environ.setdefault("V2_POSTGRES_DB", "loom_ai_v2")
os.environ.setdefault("V2_POSTGRES_TEST_DB", "loom_ai_v2_test")

import numpy as np
from decimal import Decimal
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import sessionmaker

from app.config import settings, DEMO_SEED
from app.db_models import Base, ProductionLog, Loom, Unit
from app.seed.masters import seed_masters
from app.seed.demo_generator import generate_atm_month, UNIT_TARGET_EFF

# ── PART 1: Offset distribution simulation (no DB) ──────────────────────
print("=" * 70)
print("PART 1: Per-loom offset distribution (simulation, no DB needed)")
print("=" * 70)

rng = np.random.default_rng(DEMO_SEED)
N_LOOMS = 192
UNIT_MEAN = float(UNIT_TARGET_EFF)  # 89.6
FLOOR_SPEC = UNIT_MEAN - 20  # 69.6

offsets = []
chronic_mask = []
for i in range(N_LOOMS):
    is_chronic = rng.random() < 0.15
    chronic_mask.append(is_chronic)
    off = rng.normal(-9.0, 2.0) if is_chronic else rng.normal(1.6, 1.5)
    off = float(np.clip(off, -20.0, 10.0))
    offsets.append(off)

print(f"Chronic looms: {sum(chronic_mask)} ({100*sum(chronic_mask)/N_LOOMS:.1f}%)")
print(f"Offset range: [{min(offsets):.2f}, {max(offsets):.2f}] pp")

# Worst-case base_eff analysis
SHIFT3_FACTOR = 88.03 / 89.48  # 0.984
worst_offset = min(offsets)
worst_case_no_noise = UNIT_MEAN * SHIFT3_FACTOR + worst_offset
print(f"\nWorst-case base_eff (shift3, no noise/style/degrade):")
print(f"  {UNIT_MEAN:.1f} * {SHIFT3_FACTOR:.4f} + ({worst_offset:.2f}) = {worst_case_no_noise:.2f}%")
print(f"  With daily_noise=-3: {worst_case_no_noise - 3:.2f}%")
print(f"  With style_penalty=-2: {worst_case_no_noise - 5:.2f}%")
print(f"  With degrade_delta=-5: {worst_case_no_noise - 10:.2f}%")
print(f"  Floor spec: {FLOOR_SPEC:.1f}% — violations CAN occur when stacking")

# ── PART 2: DB-backed histogram ──────────────────────────────────────────
print("\n" + "=" * 70)
print("PART 2: Real generated distribution (using test DB)")
print("=" * 70)

engine = create_engine(settings.test_database_url(), future=True)
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine, future=True)
session = Session()
seed_masters(session)
session.commit()

print("Generating ATM month (seed=42)...")
totals = generate_atm_month(session, seed=DEMO_SEED)
session.commit()
print(f"Generated: {totals['ATM']['row_count']} production_log rows")
print(f"Calibration factor: {totals['ATM']['calibration_factor']:.4f}")

rows = session.execute(
    select(
        ProductionLog.loom_id,
        func.sum(ProductionLog.actual_picks).label("total_picks"),
        func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
        func.sum(ProductionLog.scheduled_minutes).label("total_scheduled"),
        func.sum(ProductionLog.metres).label("total_metres"),
    ).group_by(ProductionLog.loom_id)
).all()

effs = []
for r in rows:
    denom = float(r.avg_rpm) * float(r.total_scheduled)
    eff = (float(r.total_picks) / denom) * 100 if denom else 0.0
    effs.append(eff)

effs_sorted = sorted(effs)
unit_mean = statistics.mean(effs)
floor_spec = unit_mean - 20.0

print(f"\nATM Monthly Loom Efficiency (n={len(effs)} looms)")
print(f"  Mean: {unit_mean:.2f}%  (target: 89.6%)")
print(f"  Stdev: {statistics.pstdev(effs):.2f} pp  (need >=2.0)")
print(f"  Min: {min(effs):.2f}%  Max: {max(effs):.2f}%")
print(f"  Floor spec (mean-20): {floor_spec:.2f}%")
print(f"  Below floor: {sum(1 for e in effs if e < floor_spec)} looms")

p10_idx = len(effs_sorted) // 10
p10 = effs_sorted[p10_idx]
median = statistics.median(effs_sorted)
print(f"  Median: {median:.2f}%  P10: {p10:.2f}%  Gap: {median-p10:.2f}pp (need >=5pp)")
print(f"  Worst-20 span: {effs_sorted[19]-effs_sorted[0]:.2f}pp (need >=6pp)")

# Histogram
print("\nHistogram (2pp buckets):")
lo_bound = int(min(effs)) - 1
hi_bound = int(max(effs)) + 2
for lo in range(lo_bound, hi_bound, 2):
    hi = lo + 2
    count = sum(1 for e in effs if lo <= e < hi)
    if count == 0 and lo < 80 and lo > int(min(effs)) + 2:
        continue
    bar = "#" * count
    flags = []
    if lo < floor_spec and count > 0:
        flags.append("FLOOR VIOLATION")
    if lo <= 73 and count > 0:
        flags.append("TOO LOW -- weaving master would pull loom")
    flag_str = "  <- " + ", ".join(flags) if flags else ""
    print(f"  {lo:3d}-{hi:3d}%: {bar:20s} ({count:3d}){flag_str}")

print("\nWorst 20 looms:")
for i, e in enumerate(effs_sorted[:20]):
    flag = "  <- BELOW FLOOR" if e < floor_spec else ""
    print(f"  #{i+1:2d}: {e:.2f}%{flag}")

# Check test requirements
print("\n--- Test gate checks ---")
print(f"  stdev >= 2.0 pp:  {'PASS' if statistics.pstdev(effs) >= 2.0 else 'FAIL'} ({statistics.pstdev(effs):.2f})")
print(f"  min >= mean-20:   {'PASS' if min(effs) >= floor_spec else 'FAIL'} (min={min(effs):.2f}, floor={floor_spec:.2f})")
print(f"  p10 <= mean-5pp:  {'PASS' if p10 <= unit_mean - 5 else 'FAIL'} (p10={p10:.2f}, threshold={unit_mean-5:.2f})")
print(f"  worst-20 span>=6: {'PASS' if effs_sorted[19]-effs_sorted[0] >= 6 else 'FAIL'} (span={effs_sorted[19]-effs_sorted[0]:.2f})")

session.close()
engine.dispose()
print("\nDone.")
