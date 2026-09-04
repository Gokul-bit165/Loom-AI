"""
Loom AI v2 — Golden Production Test Dataset Fixture.

Represents a verified, ground-truth factory dataset:
- 3 Looms (AJ-001, AJ-002, SZ-001)
- 2 Shifts (Shift 1, Shift 2)
- 2 Styles (Plain VSF @ 2,165.356 ppm, Slub @ 2,677.167 ppm)
- Known target, actual, downtime, and repair values with exact mathematical outcomes.
"""
from decimal import Decimal

GOLDEN_PRODUCTION_METRICS = {
    "ATM_2026_07_31": {
        "actual_metres": 49748.8,
        "target_metres": 50018.7,
        "gap_metres": -269.9,
        "gap_pct": -0.54,
        "efficiency_pct": 89.26,
        "kilo_picks": 107547.6,
        "warp_breaks": 3632,
        "weft_breaks": 10406,
        "tolerance": 0.05,
    }
}
