"""
Loom AI — deterministic CSV import pipeline.

Usage
-----
    cd backend
    python -m app.data.import_csv

What this script does
---------------------
1. Reads each source CSV from the DATA_DIR defined in .env.
2. Validates every row against explicit rules (see _validate_* functions).
3. Reports ALL invalid rows — never silently discards them.
4. Imports valid rows into PostgreSQL in dependency order:
       machines → production_logs → breakdown_events → revenue_logs
5. Is idempotent: running it twice will not create duplicate records
   (it uses INSERT ... ON CONFLICT DO NOTHING for machines, and
   skips rows that would violate unique constraints for production_logs).
6. After import, prints a verification summary comparing CSV counts vs DB counts.

Validation rules
----------------
machines.csv
  - Required columns present
  - machine_id not empty
  - granularity ∈ {real_grounded, synthetic_loom_number}
  - department not empty
  - machine_type not empty

production_log.csv
  - Required columns present
  - date parseable as YYYY-MM-DD
  - shift ∈ {1, 2, 3}
  - machine_id exists in machines (from CSV, not DB — import order is enforced)
  - target_qty > 0
  - actual_qty >= 0
  - efficiency_pct ∈ [0, 110]  (allow slight overrun)
  - No duplicates within the batch (machine_id + date + shift)

breakdown_events.csv
  - Required columns present
  - date parseable as YYYY-MM-DD
  - shift ∈ {1, 2, 3}
  - machine_id exists in known machines
  - reason not empty
  - duration_minutes > 0
  - (No unique constraint — multiple breakdowns per shift are valid)

revenue_log.csv
  - Required columns present
  - date parseable as YYYY-MM-DD
  - shift ∈ {1, 2, 3}
  - machine_id exists in known machines AND is a Weaving machine
  - fabric_style not empty
  - revenue >= 0

CRITICAL: This script treats every validation failure as a loud error.
The operator must fix the source CSV before the row is accepted.
"""
from __future__ import annotations

import sys
from dataclasses import dataclass, field
from datetime import date as DateType
from pathlib import Path
from typing import Any

import pandas as pd
from sqlalchemy import text
from sqlalchemy.dialects.postgresql import insert as pg_insert

# Allow running as `python -m app.data.import_csv` from the backend/ dir.
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.config import settings
from app.database import engine, get_session
from app.db_models import Base, BreakdownEvent, Machine, ProductionLog, RevenueLog

# ─────────────────────────────────────────────────────────────────────────────
# Validation result types
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class InvalidRow:
    row_index: int          # 0-based row index within the CSV
    row_data: dict[str, Any]
    reasons: list[str]


@dataclass
class ValidationResult:
    table: str
    valid_rows: list[dict[str, Any]] = field(default_factory=list)
    invalid_rows: list[InvalidRow] = field(default_factory=list)

    @property
    def has_errors(self) -> bool:
        return len(self.invalid_rows) > 0

    def report(self) -> None:
        print(f"\n{'='*60}")
        print(f"  {self.table}")
        print(f"{'='*60}")
        print(f"  Valid rows   : {len(self.valid_rows)}")
        print(f"  Invalid rows : {len(self.invalid_rows)}")
        if self.invalid_rows:
            print(f"\n  INVALID ROWS (will NOT be imported):")
            for inv in self.invalid_rows:
                print(f"\n  Row {inv.row_index + 2} (CSV line {inv.row_index + 2}):")  # +2: 1 for header, 1 for 0-index
                for reason in inv.reasons:
                    print(f"    ✗ {reason}")


# ─────────────────────────────────────────────────────────────────────────────
# Column specifications
# ─────────────────────────────────────────────────────────────────────────────

REQUIRED_COLUMNS = {
    "machines": {"machine_id", "unit", "department", "machine_type", "granularity"},
    "production_log": {
        "date", "shift", "machine_id", "target_qty", "actual_qty", "efficiency_pct"
    },
    "breakdown_events": {
        "date", "shift", "machine_id", "reason", "duration_minutes"
    },
    "revenue_log": {
        "date", "shift", "machine_id", "fabric_style", "revenue"
    },
}

VALID_GRANULARITIES = {"real_grounded", "synthetic_loom_number"}
VALID_SHIFTS = {1, 2, 3}
DATE_FORMAT = "%Y-%m-%d"
DATE_MIN = DateType(2020, 1, 1)
DATE_MAX = DateType(2030, 12, 31)


# ─────────────────────────────────────────────────────────────────────────────
# Helper functions
# ─────────────────────────────────────────────────────────────────────────────

def _check_columns(df: pd.DataFrame, table: str) -> list[str]:
    """Return a list of missing required columns."""
    required = REQUIRED_COLUMNS[table]
    present = set(df.columns)
    missing = required - present
    return sorted(missing)


def _parse_date(value: Any) -> DateType | None:
    """Parse a date string to a date object; return None on failure."""
    try:
        return pd.to_datetime(str(value), format=DATE_FORMAT).date()
    except Exception:
        return None


def _is_valid_date(d: DateType) -> bool:
    return DATE_MIN <= d <= DATE_MAX


# ─────────────────────────────────────────────────────────────────────────────
# Per-table validation
# ─────────────────────────────────────────────────────────────────────────────

def validate_machines(df: pd.DataFrame) -> ValidationResult:
    result = ValidationResult(table="machines.csv")

    missing_cols = _check_columns(df, "machines")
    if missing_cols:
        raise SystemExit(
            f"FATAL: machines.csv is missing required columns: {missing_cols}\n"
            "Cannot continue — fix the source file."
        )

    for idx, row in df.iterrows():
        errors: list[str] = []

        if not str(row["machine_id"]).strip():
            errors.append("machine_id is empty")
        if not str(row["unit"]).strip():
            errors.append("unit is empty")
        if not str(row["department"]).strip():
            errors.append("department is empty")
        if not str(row["machine_type"]).strip():
            errors.append("machine_type is empty")
        if str(row["granularity"]).strip() not in VALID_GRANULARITIES:
            errors.append(
                f"granularity '{row['granularity']}' not in {VALID_GRANULARITIES}"
            )

        if errors:
            result.invalid_rows.append(InvalidRow(int(idx), dict(row), errors))
        else:
            result.valid_rows.append(
                {
                    "machine_id": str(row["machine_id"]).strip(),
                    "unit": str(row["unit"]).strip(),
                    "department": str(row["department"]).strip(),
                    "machine_type": str(row["machine_type"]).strip(),
                    "granularity": str(row["granularity"]).strip(),
                    "source_type": "synthetic",
                    "active": True,
                }
            )

    return result


def validate_production_log(
    df: pd.DataFrame, known_machine_ids: set[str]
) -> ValidationResult:
    result = ValidationResult(table="production_log.csv")

    missing_cols = _check_columns(df, "production_log")
    if missing_cols:
        raise SystemExit(
            f"FATAL: production_log.csv is missing required columns: {missing_cols}"
        )

    seen_keys: set[tuple] = set()  # detect within-batch duplicates

    for idx, row in df.iterrows():
        errors: list[str] = []

        # Date
        d = _parse_date(row["date"])
        if d is None:
            errors.append(f"date '{row['date']}' cannot be parsed as YYYY-MM-DD")
        elif not _is_valid_date(d):
            errors.append(f"date {d} is outside the allowed range {DATE_MIN} – {DATE_MAX}")

        # Shift
        try:
            shift = int(row["shift"])
            if shift not in VALID_SHIFTS:
                errors.append(f"shift {shift} not in {{1, 2, 3}}")
        except (ValueError, TypeError):
            shift = None
            errors.append(f"shift '{row['shift']}' is not a valid integer")

        # Machine ID
        machine_id = str(row["machine_id"]).strip()
        if not machine_id:
            errors.append("machine_id is empty")
        elif machine_id not in known_machine_ids:
            errors.append(f"machine_id '{machine_id}' not found in machines.csv")

        # Quantities
        try:
            target_qty = float(row["target_qty"])
            if target_qty <= 0:
                errors.append(f"target_qty {target_qty} must be > 0")
        except (ValueError, TypeError):
            target_qty = None
            errors.append(f"target_qty '{row['target_qty']}' is not a valid number")

        try:
            actual_qty = float(row["actual_qty"])
            if actual_qty < 0:
                errors.append(f"actual_qty {actual_qty} must be >= 0")
        except (ValueError, TypeError):
            actual_qty = None
            errors.append(f"actual_qty '{row['actual_qty']}' is not a valid number")

        try:
            eff = float(row["efficiency_pct"])
            if not (0 <= eff <= 110):
                errors.append(f"efficiency_pct {eff} must be between 0 and 110")
        except (ValueError, TypeError):
            eff = None
            errors.append(f"efficiency_pct '{row['efficiency_pct']}' is not a valid number")

        # Within-batch duplicate check
        if d is not None and shift is not None and machine_id:
            key = (machine_id, d, shift)
            if key in seen_keys:
                errors.append(
                    f"Duplicate row within batch: machine_id={machine_id} date={d} shift={shift}"
                )
            else:
                seen_keys.add(key)

        if errors:
            result.invalid_rows.append(InvalidRow(int(idx), dict(row), errors))
        else:
            result.valid_rows.append(
                {
                    "date": d,
                    "shift": shift,
                    "machine_id": machine_id,
                    "target_qty": target_qty,
                    "actual_qty": actual_qty,
                    "efficiency_pct": eff,
                }
            )

    return result


def validate_breakdown_events(
    df: pd.DataFrame, known_machine_ids: set[str]
) -> ValidationResult:
    result = ValidationResult(table="breakdown_events.csv")

    missing_cols = _check_columns(df, "breakdown_events")
    if missing_cols:
        raise SystemExit(
            f"FATAL: breakdown_events.csv is missing required columns: {missing_cols}"
        )

    for idx, row in df.iterrows():
        errors: list[str] = []

        # Date
        d = _parse_date(row["date"])
        if d is None:
            errors.append(f"date '{row['date']}' cannot be parsed as YYYY-MM-DD")
        elif not _is_valid_date(d):
            errors.append(f"date {d} is outside the allowed range")

        # Shift
        try:
            shift = int(row["shift"])
            if shift not in VALID_SHIFTS:
                errors.append(f"shift {shift} not in {{1, 2, 3}}")
        except (ValueError, TypeError):
            shift = None
            errors.append(f"shift '{row['shift']}' is not a valid integer")

        # Machine ID
        machine_id = str(row["machine_id"]).strip()
        if not machine_id:
            errors.append("machine_id is empty")
        elif machine_id not in known_machine_ids:
            errors.append(f"machine_id '{machine_id}' not found in machines.csv")

        # Reason
        reason = str(row["reason"]).strip()
        if not reason:
            errors.append("reason is empty")

        # Duration
        try:
            duration = int(row["duration_minutes"])
            if duration <= 0:
                errors.append(f"duration_minutes {duration} must be > 0")
        except (ValueError, TypeError):
            duration = None
            errors.append(f"duration_minutes '{row['duration_minutes']}' is not a valid integer")

        if errors:
            result.invalid_rows.append(InvalidRow(int(idx), dict(row), errors))
        else:
            result.valid_rows.append(
                {
                    "date": d,
                    "shift": shift,
                    "machine_id": machine_id,
                    "reason": reason,
                    "duration_minutes": duration,
                    "source_type": "synthetic",
                }
            )

    return result


def validate_revenue_log(
    df: pd.DataFrame, known_machine_ids: set[str], weaving_machine_ids: set[str]
) -> ValidationResult:
    result = ValidationResult(table="revenue_log.csv")

    missing_cols = _check_columns(df, "revenue_log")
    if missing_cols:
        raise SystemExit(
            f"FATAL: revenue_log.csv is missing required columns: {missing_cols}"
        )

    for idx, row in df.iterrows():
        errors: list[str] = []

        # Date
        d = _parse_date(row["date"])
        if d is None:
            errors.append(f"date '{row['date']}' cannot be parsed as YYYY-MM-DD")
        elif not _is_valid_date(d):
            errors.append(f"date {d} is outside the allowed range")

        # Shift
        try:
            shift = int(row["shift"])
            if shift not in VALID_SHIFTS:
                errors.append(f"shift {shift} not in {{1, 2, 3}}")
        except (ValueError, TypeError):
            shift = None
            errors.append(f"shift '{row['shift']}' is not a valid integer")

        # Machine ID — must be a Weaving machine
        machine_id = str(row["machine_id"]).strip()
        if not machine_id:
            errors.append("machine_id is empty")
        elif machine_id not in known_machine_ids:
            errors.append(f"machine_id '{machine_id}' not found in machines.csv")
        elif machine_id not in weaving_machine_ids:
            errors.append(
                f"machine_id '{machine_id}' is not a Weaving machine; "
                "revenue is only expected for Weaving in V1"
            )

        # Fabric style
        fabric_style = str(row["fabric_style"]).strip()
        if not fabric_style:
            errors.append("fabric_style is empty")

        # Revenue
        try:
            revenue = float(row["revenue"])
            if revenue < 0:
                errors.append(f"revenue {revenue} must be >= 0")
        except (ValueError, TypeError):
            revenue = None
            errors.append(f"revenue '{row['revenue']}' is not a valid number")

        if errors:
            result.invalid_rows.append(InvalidRow(int(idx), dict(row), errors))
        else:
            result.valid_rows.append(
                {
                    "date": d,
                    "shift": shift,
                    "machine_id": machine_id,
                    "fabric_style": fabric_style,
                    "revenue": revenue,
                    "source_type": "derived",
                }
            )

    return result


# ─────────────────────────────────────────────────────────────────────────────
# Import functions
# ─────────────────────────────────────────────────────────────────────────────

BATCH_SIZE = 500


def import_machines(rows: list[dict]) -> int:
    """Insert machines. Uses ON CONFLICT DO NOTHING — safe to re-run."""
    if not rows:
        return 0
    stmt = pg_insert(Machine).values(rows).on_conflict_do_nothing(index_elements=["machine_id"])
    with get_session() as session:
        result = session.execute(stmt)
        return result.rowcount


def import_production_logs(rows: list[dict]) -> tuple[int, int]:
    """
    Insert production log rows.
    Uses ON CONFLICT DO NOTHING on (machine_id, date, shift).
    Returns (inserted, skipped_duplicates).
    """
    if not rows:
        return 0, 0

    inserted = 0
    with get_session() as session:
        for i in range(0, len(rows), BATCH_SIZE):
            batch = rows[i : i + BATCH_SIZE]
            stmt = (
                pg_insert(ProductionLog)
                .values(batch)
                .on_conflict_do_nothing(
                    index_elements=None,
                    constraint="uq_production_machine_date_shift",
                )
            )
            result = session.execute(stmt)
            inserted += result.rowcount

    skipped = len(rows) - inserted
    return inserted, skipped


def import_breakdown_events(rows: list[dict]) -> int:
    """
    Insert breakdown events. No unique constraint — all rows are inserted.
    However, this import is NOT idempotent: running twice will create duplicates.
    The caller must ensure this is run only once, or the table must be truncated first.
    """
    if not rows:
        return 0
    inserted = 0
    with get_session() as session:
        for i in range(0, len(rows), BATCH_SIZE):
            batch = rows[i : i + BATCH_SIZE]
            session.execute(pg_insert(BreakdownEvent).values(batch))
            inserted += len(batch)
    return inserted


def import_revenue_logs(rows: list[dict]) -> int:
    """
    Insert revenue log rows.
    Like breakdown events, revenue has no unique constraint — all rows are inserted.
    Not idempotent; run only once or truncate first.
    """
    if not rows:
        return 0
    inserted = 0
    with get_session() as session:
        for i in range(0, len(rows), BATCH_SIZE):
            batch = rows[i : i + BATCH_SIZE]
            session.execute(pg_insert(RevenueLog).values(batch))
            inserted += len(batch)
    return inserted


# ─────────────────────────────────────────────────────────────────────────────
# Verification
# ─────────────────────────────────────────────────────────────────────────────

def verify_counts(machines_valid: int, prod_valid: int, bd_valid: int, rev_valid: int) -> None:
    """Compare expected counts (from CSV) vs actual DB counts."""
    print("\n" + "="*60)
    print("  POST-IMPORT VERIFICATION")
    print("="*60)

    queries = {
        "machines": ("SELECT COUNT(*) FROM machines", machines_valid),
        "production_logs": ("SELECT COUNT(*) FROM production_logs", prod_valid),
        "breakdown_events": ("SELECT COUNT(*) FROM breakdown_events", bd_valid),
        "revenue_logs": ("SELECT COUNT(*) FROM revenue_logs", rev_valid),
    }

    all_ok = True
    with engine.connect() as conn:
        for table, (sql, expected) in queries.items():
            actual = conn.execute(text(sql)).scalar()
            status = "OK" if actual >= expected else "MISMATCH"
            if actual < expected:
                all_ok = False
            print(f"  {table:<20} expected >= {expected:>6}   actual {actual:>6}   {status}")

    if all_ok:
        print("\n  All counts verified. Import complete.")
    else:
        print("\n  WARNING: Some counts do not match. Check the import log above.")


# ─────────────────────────────────────────────────────────────────────────────
# Guard against re-import of non-idempotent tables
# ─────────────────────────────────────────────────────────────────────────────

def _table_is_populated(table_name: str) -> bool:
    with engine.connect() as conn:
        count = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}")).scalar()
        return (count or 0) > 0


# ─────────────────────────────────────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────────────────────────────────────

def main() -> None:
    print("\n" + "="*60)
    print("  LOOM AI — CSV IMPORT PIPELINE")
    print("="*60)
    print(f"  Data directory : {settings.data_root}")
    print(f"  Database       : {settings.postgres_db} @ {settings.postgres_host}")

    # ── 1. Load CSVs ──────────────────────────────────────────────────────────
    def load_csv(filename: str) -> pd.DataFrame:
        path = settings.csv_path(filename)
        if not path.exists():
            raise SystemExit(f"FATAL: CSV file not found: {path}")
        print(f"\n  Loading {path.name} ...")
        df = pd.read_csv(path, dtype=str)  # read all as str; validate types explicitly
        print(f"    Rows: {len(df)}")
        return df

    machines_df   = load_csv(settings.csv_machines)
    production_df = load_csv(settings.csv_production)
    breakdown_df  = load_csv(settings.csv_breakdown)
    revenue_df    = load_csv(settings.csv_revenue)

    # ── 2. Validate ───────────────────────────────────────────────────────────
    print("\n\n" + "="*60)
    print("  VALIDATION")
    print("="*60)

    machines_result = validate_machines(machines_df)
    machines_result.report()

    known_ids = {r["machine_id"] for r in machines_result.valid_rows}
    weaving_ids = {
        r["machine_id"]
        for r in machines_result.valid_rows
        if r["department"] == "Weaving"
    }

    prod_result = validate_production_log(production_df, known_ids)
    prod_result.report()

    bd_result = validate_breakdown_events(breakdown_df, known_ids)
    bd_result.report()

    rev_result = validate_revenue_log(revenue_df, known_ids, weaving_ids)
    rev_result.report()

    # ── 3. Stop if any validation errors ─────────────────────────────────────
    total_errors = sum(
        len(r.invalid_rows)
        for r in [machines_result, prod_result, bd_result, rev_result]
    )
    if total_errors > 0:
        print(f"\n\n  IMPORT ABORTED — {total_errors} invalid rows found.")
        print("  Fix the source CSVs and re-run. No data was written to the database.")
        sys.exit(1)

    # ── 4. Guard: warn if non-idempotent tables already have data ─────────────
    print("\n\n" + "="*60)
    print("  PRE-IMPORT CHECKS")
    print("="*60)

    abort = False
    for table in ("breakdown_events", "revenue_logs"):
        if _table_is_populated(table):
            print(f"\n  WARNING: {table} already contains rows.")
            print(f"  Re-importing will create DUPLICATES (no unique key on this table).")
            print(f"  To re-import, run:  TRUNCATE {table} CASCADE;  in psql first.")
            abort = True

    if abort:
        print(
            "\n  Import aborted. Resolve the above warnings and re-run.\n"
            "  Machines and production_logs are safe to re-run (ON CONFLICT DO NOTHING)."
        )
        sys.exit(1)

    # ── 5. Import ─────────────────────────────────────────────────────────────
    print("\n\n" + "="*60)
    print("  IMPORTING")
    print("="*60)

    n_machines = import_machines(machines_result.valid_rows)
    print(f"  machines        : {n_machines} inserted  (ON CONFLICT DO NOTHING)")

    n_prod_ins, n_prod_skip = import_production_logs(prod_result.valid_rows)
    print(f"  production_logs : {n_prod_ins} inserted, {n_prod_skip} skipped (duplicates)")

    n_bd = import_breakdown_events(bd_result.valid_rows)
    print(f"  breakdown_events: {n_bd} inserted")

    n_rev = import_revenue_logs(rev_result.valid_rows)
    print(f"  revenue_logs    : {n_rev} inserted")

    # ── 6. Verify ─────────────────────────────────────────────────────────────
    verify_counts(
        machines_valid=len(machines_result.valid_rows),
        prod_valid=len(prod_result.valid_rows),
        bd_valid=len(bd_result.valid_rows),
        rev_valid=len(rev_result.valid_rows),
    )


if __name__ == "__main__":
    main()
