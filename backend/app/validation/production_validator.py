"""
Validator for raw Production records into normalized ProductionRecord objects.
"""
from __future__ import annotations

from typing import Any

from app.models.common import RejectedRow, ValidationCategory
from app.models.production import ProductionRecord
from app.validation.rules import is_blank, parse_date, parse_decimal, parse_int


class ProductionValidator:
    """
    Validates raw production rows against business constraints:
    - date required and valid
    - shift must be 1, 2, or 3
    - machine_id must exist in known machines
    - target_qty >= 0
    - actual_qty >= 0
    - efficiency_pct >= 0 and <= 100
    - duplicate (machine_id, date, shift) detection within batch / known records
    """

    def __init__(self, known_machines: set[str], existing_keys: set[tuple[str, Any, int]] | None = None):
        self.known_machines = {m.strip() for m in known_machines}
        self.seen_keys: set[tuple[str, Any, int]] = set(existing_keys or [])

    def validate_row(
        self,
        raw_row: dict[str, Any],
        source_row: int,
        source_file: str,
        source_type: str = "synthetic",
        import_batch_id: int | None = None,
    ) -> ProductionRecord | RejectedRow:
        errors: list[str] = []
        category: ValidationCategory = ValidationCategory.INVALID_VALUE

        # 1. Date check
        date_raw = raw_row.get("date")
        parsed_date = None
        if is_blank(date_raw):
            errors.append("date is required and cannot be empty")
            category = ValidationCategory.MISSING_VALUE
        else:
            parsed_date = parse_date(date_raw)
            if parsed_date is None:
                errors.append(f"invalid date format '{date_raw}' (expected YYYY-MM-DD)")

        # 2. Shift check
        shift_raw = raw_row.get("shift")
        parsed_shift = None
        if is_blank(shift_raw):
            errors.append("shift is required and cannot be empty")
            if category != ValidationCategory.MISSING_VALUE:
                category = ValidationCategory.MISSING_VALUE
        else:
            parsed_shift = parse_int(shift_raw)
            if parsed_shift not in (1, 2, 3):
                errors.append(f"shift must be 1, 2, or 3; got '{shift_raw}'")

        # 3. Machine check
        machine_raw = raw_row.get("machine_id")
        machine_id = ""
        if is_blank(machine_raw):
            errors.append("machine_id is required and cannot be empty")
            category = ValidationCategory.MISSING_VALUE
        else:
            machine_id = str(machine_raw).strip()
            if machine_id not in self.known_machines:
                errors.append(f"unknown machine_id '{machine_id}'")
                category = ValidationCategory.UNKNOWN_MACHINE

        # 4. Target Qty check
        target_raw = raw_row.get("target_qty")
        parsed_target = None
        if is_blank(target_raw):
            errors.append("target_qty is required")
            category = ValidationCategory.MISSING_VALUE
        else:
            parsed_target = parse_decimal(target_raw)
            if parsed_target is None:
                errors.append(f"target_qty '{target_raw}' is not a valid number")
            elif parsed_target < 0:
                errors.append(f"target_qty must be >= 0; got {parsed_target}")

        # 5. Actual Qty check
        actual_raw = raw_row.get("actual_qty")
        parsed_actual = None
        if is_blank(actual_raw):
            errors.append("actual_qty is required")
            category = ValidationCategory.MISSING_VALUE
        else:
            parsed_actual = parse_decimal(actual_raw)
            if parsed_actual is None:
                errors.append(f"actual_qty '{actual_raw}' is not a valid number")
            elif parsed_actual < 0:
                errors.append(f"actual_qty must be >= 0; got {parsed_actual}")

        # 6. Efficiency check
        eff_raw = raw_row.get("efficiency_pct")
        parsed_eff = None
        if is_blank(eff_raw):
            errors.append("efficiency_pct is required")
            category = ValidationCategory.MISSING_VALUE
        else:
            parsed_eff = parse_decimal(eff_raw)
            if parsed_eff is None:
                errors.append(f"efficiency_pct '{eff_raw}' is not a valid number")
            elif not (0 <= parsed_eff <= 100):
                errors.append(f"efficiency_pct must be between 0 and 100; got {parsed_eff}")

        # 7. Duplicate check
        if parsed_date and parsed_shift and machine_id:
            key = (machine_id, parsed_date, parsed_shift)
            if key in self.seen_keys:
                errors.append(f"duplicate production row for machine '{machine_id}', date {parsed_date}, shift {parsed_shift}")
                category = ValidationCategory.DUPLICATE
            else:
                self.seen_keys.add(key)

        if errors:
            return RejectedRow.create(
                source_row=source_row,
                raw_data=raw_row,
                reasons=errors,
                category=category,
            )

        return ProductionRecord(
            date=parsed_date,
            shift=parsed_shift,
            machine_id=machine_id,
            target_qty=parsed_target,
            actual_qty=parsed_actual,
            efficiency_pct=parsed_eff,
            source_file=source_file,
            source_row=source_row,
            source_type=source_type,
            import_batch_id=import_batch_id,
        )

    def validate_batch(
        self,
        raw_rows: list[dict[str, Any]],
        source_file: str,
        source_type: str = "synthetic",
        import_batch_id: int | None = None,
    ) -> tuple[list[ProductionRecord], list[RejectedRow]]:
        valid_records: list[ProductionRecord] = []
        rejected_rows: list[RejectedRow] = []

        for idx, row in enumerate(raw_rows, start=2):  # row 1 is header
            result = self.validate_row(
                raw_row=row,
                source_row=idx,
                source_file=source_file,
                source_type=source_type,
                import_batch_id=import_batch_id,
            )
            if isinstance(result, ProductionRecord):
                valid_records.append(result)
            else:
                rejected_rows.append(result)

        return valid_records, rejected_rows
