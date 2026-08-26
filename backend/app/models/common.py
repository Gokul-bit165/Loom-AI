"""
Common types shared across all Pydantic models in app/models/.

RejectedRow  — represents a source row that failed validation.
ValidationCategory — the class of failure for structured reporting.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class ValidationCategory(str, Enum):
    """
    Specific category of validation failure.

    Used in the DataQualityReport to bucket rejections.
    UI can display these with different severity colours:
      - MISSING_VALUE → orange
      - INVALID_VALUE → red
      - UNKNOWN_MACHINE → yellow
      - DUPLICATE → grey
    """
    MISSING_VALUE = "missing_value"
    INVALID_VALUE = "invalid_value"
    UNKNOWN_MACHINE = "unknown_machine"
    DUPLICATE = "duplicate"


@dataclass(frozen=True)
class RejectedRow:
    """
    One source row that failed validation.

    Every rejected row is reported — never silently dropped.

    Attributes
    ----------
    source_row : int
        1-based row index in the source file (header = row 1, first data = row 2).
    raw_data : dict[str, str]
        The raw cell values exactly as read from the source file.
        Never modified, even if the values are obviously wrong.
    reasons : list[str]
        All reasons this row was rejected (multiple violations can exist).
    category : ValidationCategory
        The primary category of failure (for bucketing in the quality report).
    """
    source_row: int
    raw_data: dict[str, Any]
    reasons: tuple[str, ...]  # immutable — frozen dataclass
    category: ValidationCategory

    @classmethod
    def create(
        cls,
        source_row: int,
        raw_data: dict[str, Any],
        reasons: list[str],
        category: ValidationCategory,
    ) -> "RejectedRow":
        return cls(
            source_row=source_row,
            raw_data=dict(raw_data),
            reasons=tuple(reasons),
            category=category,
        )
