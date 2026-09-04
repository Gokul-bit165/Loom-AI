"""
Loom AI v2 — Calibrate realistic date diversity across July 2026.
Transforms uniform synthetic data into distinct, realistic textile mill operational days.
"""
import sqlite3
import random

def calibrate():
    conn = sqlite3.connect('loom_ai_v2.db')
    c = conn.cursor()

    # Distinct daily operational multipliers & characteristics
    # (day_str, volume_mult, warp_mult, weft_mult, run_min_mult)
    DATE_PROFILES = {
        '2026-07-31': (1.000, 1.00, 1.00, 1.000),  # Baseline: 49,748m (89.3%)
        '2026-07-30': (1.018, 0.85, 0.90, 1.015),  # High Output: ~50,600m (91.1%) - Shift 2 star
        '2026-07-29': (0.958, 1.15, 1.35, 0.985),  # Speed/Friction Drag: ~47,650m (85.7%)
        '2026-07-28': (0.924, 1.10, 1.20, 0.915),  # Mechanical Breakdown: ~45,950m (82.6%) - High downtime
        '2026-07-27': (0.978, 1.05, 1.00, 0.975),  # Monday Stabilization: ~48,650m (87.5%)
        '2026-07-26': (0.892, 0.95, 1.05, 0.885),  # Power Cut / Utility Outage: ~44,350m (79.8%)
        '2026-07-25': (1.058, 0.70, 0.75, 1.045),  # Peak Banner Day: ~52,650m (94.7%) - All green
        '2026-07-24': (1.002, 0.95, 0.98, 1.000),  # Stable Friday: ~49,850m (89.7%)
        '2026-07-23': (0.942, 1.40, 1.10, 0.935),  # Heavy Sort Change / Beam Knotting: ~46,850m (84.3%)
        '2026-07-22': (0.865, 1.20, 1.80, 0.860),  # Compressor Failure / Air Drop: ~43,050m (77.4%)
        '2026-07-21': (0.965, 1.05, 1.10, 0.960),  # Post-Compressor Recovery: ~48,000m (86.4%)
        '2026-07-20': (1.042, 0.75, 0.80, 1.035),  # High Performance Run: ~51,850m (93.3%)
        '2026-07-19': (0.990, 0.98, 1.00, 0.990),  # Sunday: ~49,250m (88.6%)
        '2026-07-18': (0.935, 1.85, 1.25, 0.945),  # Warp Breakage Spike (Spinning defect): ~46,500m (83.6%)
        '2026-07-17': (1.010, 0.90, 0.95, 1.005),  # Above plan: ~50,250m (90.4%)
        '2026-07-16': (0.995, 1.00, 1.00, 0.995),  # Standard: ~49,500m (89.1%)
        '2026-07-15': (1.035, 0.80, 0.85, 1.030),  # Mid-Month Peak: ~51,500m (92.7%)
        '2026-07-14': (0.980, 1.05, 1.02, 0.980),  # Normal: ~48,750m (87.7%)
        '2026-07-13': (0.975, 1.08, 1.05, 0.975),  # Monday: ~48,500m (87.3%)
        '2026-07-12': (0.920, 1.10, 1.40, 0.910),  # Humidifier Trip: ~45,750m (82.3%)
        '2026-07-11': (1.020, 0.85, 0.88, 1.015),  # Strong Saturday: ~50,750m (91.3%)
        '2026-07-10': (0.915, 1.10, 1.15, 0.905),  # PM Overhaul Day: ~45,500m (81.8%)
        '2026-07-09': (0.990, 0.98, 1.02, 0.990),  # Normal: ~49,250m (88.6%)
        '2026-07-08': (1.015, 0.88, 0.92, 1.010),  # On Target: ~50,500m (90.9%)
        '2026-07-07': (0.970, 1.05, 1.10, 0.970),  # Tuesday: ~48,250m (86.8%)
        '2026-07-06': (0.960, 1.10, 1.15, 0.955),  # Monday Ramp: ~47,750m (85.9%)
        '2026-07-05': (0.985, 0.98, 1.00, 0.985),  # Sunday: ~49,000m (88.1%)
        '2026-07-04': (1.025, 0.82, 0.86, 1.020),  # Saturday Sprint: ~51,000m (91.8%)
        '2026-07-03': (1.005, 0.95, 0.95, 1.000),  # Steady: ~50,000m (89.9%)
        '2026-07-02': (0.975, 1.05, 1.05, 0.970),  # Steady: ~48,500m (87.3%)
        '2026-07-01': (0.968, 1.10, 1.08, 0.965),  # Kickoff: ~48,150m (86.6%)
    }

    # Apply calibration per date
    for date_str, (vol_mult, warp_mult, weft_mult, run_mult) in DATE_PROFILES.items():
        if vol_mult == 1.0 and warp_mult == 1.0 and weft_mult == 1.0:
            continue  # Leave July 31 exact baseline unchanged

        # Update production_log rows for this date
        c.execute('''
            UPDATE production_log
            SET metres = ROUND(metres * ?, 1),
                actual_picks = CAST(ROUND(actual_picks * ?) AS INTEGER),
                kilo_picks = ROUND(kilo_picks * ?, 1),
                running_minutes = MIN(scheduled_minutes, CAST(ROUND(running_minutes * ?) AS INTEGER)),
                warp_breaks = CAST(ROUND(warp_breaks * ?) AS INTEGER),
                weft_breaks = CAST(ROUND(weft_breaks * ?) AS INTEGER)
            WHERE work_date = ?
        ''', (vol_mult, vol_mult, vol_mult, run_mult, warp_mult, weft_mult, date_str))

    # Introduce distinct shift bottlenecks for key dates:
    # 1. On July 30: Shift 1 is weak (factor 0.94), Shift 2 is star (factor 1.06)
    c.execute('''
        UPDATE production_log
        SET metres = ROUND(metres * 0.94, 1),
            actual_picks = CAST(ROUND(actual_picks * 0.94) AS INTEGER),
            kilo_picks = ROUND(kilo_picks * 0.94, 1),
            running_minutes = CAST(ROUND(running_minutes * 0.93) AS INTEGER)
        WHERE work_date = '2026-07-30' AND shift_id = 1
    ''')
    c.execute('''
        UPDATE production_log
        SET metres = ROUND(metres * 1.06, 1),
            actual_picks = CAST(ROUND(actual_picks * 1.06) AS INTEGER),
            kilo_picks = ROUND(kilo_picks * 1.06, 1),
            running_minutes = MIN(480, CAST(ROUND(running_minutes * 1.04) AS INTEGER))
        WHERE work_date = '2026-07-30' AND shift_id = 2
    ''')

    # 2. On July 28 (Breakdown day): Make Looms 64 and 140 suffer heavy downtime
    c.execute('''
        UPDATE production_log
        SET metres = ROUND(metres * 0.15, 1),
            actual_picks = CAST(ROUND(actual_picks * 0.15) AS INTEGER),
            kilo_picks = ROUND(kilo_picks * 0.15, 1),
            running_minutes = 60
        WHERE work_date = '2026-07-28' AND loom_id IN (64, 140)
    ''')

    # 3. On July 26 (Power outage): Shift 2 drops 35% across all looms
    c.execute('''
        UPDATE production_log
        SET metres = ROUND(metres * 0.65, 1),
            actual_picks = CAST(ROUND(actual_picks * 0.65) AS INTEGER),
            kilo_picks = ROUND(kilo_picks * 0.65, 1),
            running_minutes = CAST(ROUND(running_minutes * 0.65) AS INTEGER)
        WHERE work_date = '2026-07-26' AND shift_id = 2
    ''')

    # 4. On July 22 (Compressor drop): Airjet looms (loom_id <= 128) lose 25% speed & output
    c.execute('''
        UPDATE production_log
        SET metres = ROUND(metres * 0.75, 1),
            actual_picks = CAST(ROUND(actual_picks * 0.75) AS INTEGER),
            kilo_picks = ROUND(kilo_picks * 0.75, 1),
            running_minutes = CAST(ROUND(running_minutes * 0.78) AS INTEGER),
            weft_breaks = CAST(weft_breaks * 2.2 AS INTEGER)
        WHERE work_date = '2026-07-22' AND loom_id <= 128
    ''')

    conn.commit()

    # Print verification across sample dates
    c.execute('''
        SELECT work_date, ROUND(SUM(metres), 1), ROUND(SUM(kilo_picks), 1), SUM(warp_breaks), SUM(weft_breaks)
        FROM production_log
        WHERE work_date IN ('2026-07-31', '2026-07-30', '2026-07-29', '2026-07-28', '2026-07-26', '2026-07-25', '2026-07-22', '2026-07-20')
        GROUP BY work_date
        ORDER BY work_date DESC
    ''')
    print("Calibrated date verification:")
    for row in c.fetchall():
        print(f"Date {row[0]}: Metres = {row[1]:,}, Kilo-picks = {row[2]:,}, Warp Breaks = {row[3]:,}, Weft Breaks = {row[4]:,}")

    conn.close()

if __name__ == '__main__':
    calibrate()
