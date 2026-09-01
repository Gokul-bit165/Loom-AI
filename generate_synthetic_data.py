"""
Synthetic data generator for the Loom AI Reporting System (V1).

GROUNDING NOTE — what's real-shaped vs guessed:
- Machine TYPES, target magnitudes, and breakdown REASON TEXT are taken directly
  from the actual daily reports supplied (Unit I/II Production Report, Spinning
  Production Report, Preparatory Production Report — Aug 2026).
- Individual LOOM NUMBERS under each weaving brand (Toyota/Tsudakoma/Sulzer) are
  GUESSED — the real reports only report brand-level totals for weaving, not
  per-loom. This is flagged so it's obvious what needs real-data confirmation
  later (does a per-loom weaving log exist on the shop floor?).
- Individual machine numbers for Ring Frame / Vortex / Airjet ARE grounded —
  Image 2 shows numbered items 1-12 with per-item remarks.
- Efficiency/breakdown distributions are synthetic but seeded so 4 machines are
  chronic underperformers — deliberate signal for the analytics layer to find.
"""
import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

random.seed(42)
np.random.seed(42)

START_DATE = datetime(2026, 6, 1)
NUM_DAYS = 90
SHIFTS = [1, 2, 3]

# --- Machine master -----------------------------------------------------
weaving_machines = (
    [{"machine_id": f"TOY-{i:02d}", "unit": "Unit I", "department": "Weaving",
      "machine_type": "Toyota", "granularity": "synthetic_loom_number"} for i in range(1, 16)]
    + [{"machine_id": f"TSU-{i:02d}", "unit": "Unit I", "department": "Weaving",
        "machine_type": "Tsudakoma", "granularity": "synthetic_loom_number"} for i in range(1, 11)]
    + [{"machine_id": f"SUL-{i:02d}", "unit": "Unit I", "department": "Weaving",
        "machine_type": "Sulzer", "granularity": "synthetic_loom_number"} for i in range(1, 6)]
)
spinning_machines = (
    [{"machine_id": f"RF-{i:02d}", "unit": "Unit I", "department": "Spinning",
      "machine_type": "RingFrame", "granularity": "real_grounded"} for i in range(1, 13)]
    + [{"machine_id": f"VTX-{i:02d}", "unit": "Unit I", "department": "Spinning",
        "machine_type": "Vortex", "granularity": "real_grounded"} for i in range(1, 13)]
    + [{"machine_id": f"AJ-{i:02d}", "unit": "Unit I", "department": "Spinning",
        "machine_type": "Airjet", "granularity": "real_grounded"} for i in range(1, 6)]
)
machines_df = pd.DataFrame(weaving_machines + spinning_machines)

# Bake in chronic underperformers on purpose (signal for Q1/Q5 to detect)
chronic_bad = random.sample(list(machines_df.machine_id), 4)

fabric_styles = [
    {"style_id": "FS-01", "name": "Excel Slub", "rate_per_kg": 215},
    {"style_id": "FS-02", "name": "Liveaco Compact", "rate_per_kg": 198},
    {"style_id": "FS-03", "name": "VSF Export", "rate_per_kg": 240},
]

# Reason text pulled verbatim-in-spirit from your reports (Img 1-3 remarks columns)
breakdown_reasons = [
    ("Weft break PBM", 15, 45),
    ("Loom runout", 20, 60),
    ("Sort change work", 30, 90),
    ("Traveller change work", 10, 30),
    ("Voltage fluctuation PBM", 5, 20),
    ("Full cleaning work", 60, 150),
    ("Bobbin shortage", 30, 120),
    ("Maintenance - scheduled", 60, 180),
]

TARGET_BY_TYPE = {
    "RingFrame": 2500, "Vortex": 4700, "Airjet": 3750,
    "Toyota": 21700, "Tsudakoma": 15000, "Sulzer": 2700,
}

production_logs, breakdown_events, revenue_logs = [], [], []

for day in range(NUM_DAYS):
    date = (START_DATE + timedelta(days=day)).date().isoformat()
    for shift in SHIFTS:
        for _, m in machines_df.iterrows():
            base_eff = 0.78 if m.machine_id in chronic_bad else 0.95
            eff = float(np.clip(np.random.normal(base_eff, 0.05), 0.5, 1.0))
            target = TARGET_BY_TYPE.get(m.machine_type, 3000)
            actual = int(target * eff)

            production_logs.append({
                "date": date, "shift": shift, "machine_id": m.machine_id,
                "unit": m.unit, "department": m.department, "machine_type": m.machine_type,
                "target_qty": target, "actual_qty": actual, "efficiency_pct": round(eff * 100, 2),
            })

            breakdown_chance = 0.35 if m.machine_id in chronic_bad else 0.12
            if random.random() < breakdown_chance:
                reason, lo, hi = random.choice(breakdown_reasons)
                breakdown_events.append({
                    "date": date, "shift": shift, "machine_id": m.machine_id,
                    "unit": m.unit, "department": m.department,
                    "reason": reason, "duration_minutes": random.randint(lo, hi),
                })

            if m.department == "Weaving":
                style = random.choice(fabric_styles)
                revenue = round(actual / 1000 * style["rate_per_kg"] * random.uniform(0.9, 1.1), 2)
                revenue_logs.append({
                    "date": date, "shift": shift, "machine_id": m.machine_id,
                    "unit": m.unit, "fabric_style": style["name"], "revenue": revenue,
                })

pd.DataFrame(machines_df).to_csv("data/machines.csv", index=False)
pd.DataFrame(production_logs).to_csv("data/production_log.csv", index=False)
pd.DataFrame(breakdown_events).to_csv("data/breakdown_events.csv", index=False)
pd.DataFrame(revenue_logs).to_csv("data/revenue_log.csv", index=False)

print(f"machines: {len(machines_df)}")
print(f"production_logs: {len(production_logs)}")
print(f"breakdown_events: {len(breakdown_events)}")
print(f"revenue_logs: {len(revenue_logs)}")
print(f"chronic underperformers (for you to verify the analytics layer finds these): {chronic_bad}")
