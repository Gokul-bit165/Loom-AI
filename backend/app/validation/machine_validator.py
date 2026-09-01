"""
Validator for raw Machine master rows into normalized MachineRecord objects.
"""
from __future__ import annotations

from typing import Any

from app.models.common import RejectedRow, ValidationCategory
from app.models.machine import MachineRecord
from app.validation.rules import is_blank


class MachineValidator:
    """
    Validates machine master records.
    """

    VALID_GRANULARITIES = {"real_grounded", "synthetic_loom_number"}
    VALID_SOURCE_TYPES = {"synthetic", "real", "derived"}

    def validate_row(
        self,
        raw_row: dict[str, Any],
        source_row: int,
        source_file: str = "machines.csv",
    ) -> MachineRecord | RejectedRow:
        errors: list[str] = []
        category = ValidationCategory.INVALID_VALUE

        machine_id = str(raw_row.get("machine_id", "")).strip()
        unit = str(raw_row.get("unit", "")).strip()
        department = str(raw_row.get("department", "")).strip()
        machine_type = str(raw_row.get("machine_type", "")).strip()
        granularity = str(raw_row.get("granularity", "")).strip()
        source_type = str(raw_row.get("source_type", "synthetic")).strip()

        if is_blank(machine_id):
            errors.append("machine_id is required")
            category = ValidationCategory.MISSING_VALUE
        if is_blank(unit):
            errors.append("unit is required")
            category = ValidationCategory.MISSING_VALUE
        if is_blank(department):
            errors.append("department is required")
            category = ValidationCategory.MISSING_VALUE
        if is_blank(machine_type):
            errors.append("machine_type is required")
            category = ValidationCategory.MISSING_VALUE
        if granularity not in self.VALID_GRANULARITIES:
            errors.append(f"granularity '{granularity}' not in {self.VALID_GRANULARITIES}")
        if source_type not in self.VALID_SOURCE_TYPES:
            errors.append(f"source_type '{source_type}' not in {self.VALID_SOURCE_TYPES}")

        if errors:
            return RejectedRow.create(
                source_row=source_row,
                raw_data=raw_row,
                reasons=errors,
                category=category,
            )

        return MachineRecord(
            machine_id=machine_id,
            unit=unit,
            department=department,
            machine_type=machine_type,
            granularity=granularity,
            source_type=source_type,
            source_file=source_file,
            source_row=source_row,
        )

    def validate_batch(
        self,
        raw_rows: list[dict[str, Any]],
        source_file: str = "machines.csv",
    ) -> tuple[list[MachineRecord], list[RejectedRow]]:
        valid_records: list[MachineRecord] = []
        rejected_rows: list[RejectedRow] = []

        for idx, row in enumerate(raw_rows, start=2):
            result = self.validate_row(raw_row=row, source_row=idx, source_file=source_file)
            if isinstance(result, MachineRecord):
                valid_records.append(result)
            else:
                rejected_rows.append(result)

        return valid_records, rejected_rows
