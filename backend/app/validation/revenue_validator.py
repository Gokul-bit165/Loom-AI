"""
Validator for raw Revenue records into normalized RevenueRecord objects.
"""
from __future__ import annotations

from typing import Any

from app.models.common import RejectedRow, ValidationCategory
from app.models.revenue import RevenueRecord
from app.validation.rules import is_blank, parse_date, parse_decimal, parse_int


class RevenueValidator:
    """
    Validates raw revenue rows:
    - date required and valid
    - shift required (1, 2, or 3)
    - machine_id required and must exist in known machines
    - fabric_style required (cannot be empty)
    - revenue must be >= 0
    """

    def __init__(self, known_machines: set[str], weaving_machines: set[str] | None = None):
        self.known_machines = {m.strip() for m in known_machines}
        self.weaving_machines = {m.strip() for m in weaving_machines} if weaving_machines else None

    def validate_row(
        self,
        raw_row: dict[str, Any],
        source_row: int,
        source_file: str,
        source_type: str = "derived",
        import_batch_id: int | None = None,
    ) -> RevenueRecord | RejectedRow:
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
            elif self.weaving_machines is not None and machine_id not in self.weaving_machines:
                errors.append(f"machine_id '{machine_id}' is not a Weaving machine; revenue is only expected for Weaving")

        # 4. Fabric Style check
        style_raw = raw_row.get("fabric_style")
        style = ""
        if is_blank(style_raw):
            errors.append("fabric_style is required when revenue is style-specific")
            category = ValidationCategory.MISSING_VALUE
        else:
            style = str(style_raw).strip()

        # 5. Revenue check
        revenue_raw = raw_row.get("revenue")
        parsed_revenue = None
        if is_blank(revenue_raw):
            errors.append("revenue is required")
            category = ValidationCategory.MISSING_VALUE
        else:
            parsed_revenue = parse_decimal(revenue_raw)
            if parsed_revenue is None:
                errors.append(f"revenue '{revenue_raw}' is not a valid number")
            elif parsed_revenue < 0:
                errors.append(f"revenue must be >= 0; got {parsed_revenue}")

        if errors:
            return RejectedRow.create(
                source_row=source_row,
                raw_data=raw_row,
                reasons=errors,
                category=category,
            )

        return RevenueRecord(
            date=parsed_date,
            shift=parsed_shift,
            machine_id=machine_id,
            fabric_style=style,
            revenue=parsed_revenue,
            source_file=source_file,
            source_row=source_row,
            source_type=source_type,
            import_batch_id=import_batch_id,
        )

    def validate_batch(
        self,
        raw_rows: list[dict[str, Any]],
        source_file: str,
        source_type: str = "derived",
        import_batch_id: int | None = None,
    ) -> tuple[list[RevenueRecord], list[RejectedRow]]:
        valid_records: list[RevenueRecord] = []
        rejected_rows: list[RejectedRow] = []

        for idx, row in enumerate(raw_rows, start=2):
            result = self.validate_row(
                raw_row=row,
                source_row=idx,
                source_file=source_file,
                source_type=source_type,
                import_batch_id=import_batch_id,
            )
            if isinstance(result, RevenueRecord):
                valid_records.append(result)
            else:
                rejected_rows.append(result)

        return valid_records, rejected_rows
