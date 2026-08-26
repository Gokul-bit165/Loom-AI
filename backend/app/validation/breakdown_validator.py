"""
Validator for raw Breakdown Event records into normalized BreakdownRecord objects.
"""
from __future__ import annotations

from typing import Any

from app.models.breakdown import BreakdownRecord
from app.models.common import RejectedRow, ValidationCategory
from app.validation.rules import is_blank, parse_date, parse_int


class BreakdownValidator:
    """
    Validates raw breakdown event rows:
    - date required and valid
    - shift required (1, 2, or 3)
    - machine_id required and must exist
    - duration_minutes required and > 0
    - reason required and non-empty
    """

    def __init__(self, known_machines: set[str]):
        self.known_machines = {m.strip() for m in known_machines}

    def validate_row(
        self,
        raw_row: dict[str, Any],
        source_row: int,
        source_file: str,
        source_type: str = "synthetic",
        import_batch_id: int | None = None,
    ) -> BreakdownRecord | RejectedRow:
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

        # 4. Reason check
        reason_raw = raw_row.get("reason")
        reason = ""
        if is_blank(reason_raw):
            errors.append("reason is required and cannot be empty")
            category = ValidationCategory.MISSING_VALUE
        else:
            reason = str(reason_raw).strip()

        # 5. Duration check
        duration_raw = raw_row.get("duration_minutes")
        parsed_duration = None
        if is_blank(duration_raw):
            errors.append("duration_minutes is required")
            category = ValidationCategory.MISSING_VALUE
        else:
            parsed_duration = parse_int(duration_raw)
            if parsed_duration is None:
                errors.append(f"duration_minutes '{duration_raw}' is not a valid integer")
            elif parsed_duration <= 0:
                errors.append(f"duration_minutes must be > 0; got {parsed_duration}")

        if errors:
            return RejectedRow.create(
                source_row=source_row,
                raw_data=raw_row,
                reasons=errors,
                category=category,
            )

        return BreakdownRecord(
            date=parsed_date,
            shift=parsed_shift,
            machine_id=machine_id,
            reason=reason,
            duration_minutes=parsed_duration,
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
    ) -> tuple[list[BreakdownRecord], list[RejectedRow]]:
        valid_records: list[BreakdownRecord] = []
        rejected_rows: list[RejectedRow] = []

        for idx, row in enumerate(raw_rows, start=2):
            result = self.validate_row(
                raw_row=row,
                source_row=idx,
                source_file=source_file,
                source_type=source_type,
                import_batch_id=import_batch_id,
            )
            if isinstance(result, BreakdownRecord):
                valid_records.append(result)
            else:
                rejected_rows.append(result)

        return valid_records, rejected_rows
