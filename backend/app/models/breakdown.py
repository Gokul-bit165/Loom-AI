"""
Pydantic schema for a validated, normalized Breakdown Event record.
"""
from __future__ import annotations

import datetime
from pydantic import BaseModel, ConfigDict, field_validator


class BreakdownRecord(BaseModel):
    """
    A validated, normalized breakdown event row.

    Business rules enforced here
    ----------------------------
    - date required
    - shift must be 1, 2, or 3
    - machine_id must not be empty
    - reason must not be empty
    - duration_minutes must be > 0
    - source_type in {'synthetic', 'real', 'derived'}
    """

    model_config = ConfigDict(frozen=True)

    date: datetime.date
    shift: int
    machine_id: str
    reason: str
    duration_minutes: int

    # Provenance fields
    source_file: str
    source_row: int
    source_type: str = "synthetic"
    import_batch_id: int | None = None

    @field_validator("shift")
    @classmethod
    def shift_must_be_valid(cls, v: int) -> int:
        if v not in (1, 2, 3):
            raise ValueError(f"shift must be 1, 2, or 3; got {v!r}")
        return v

    @field_validator("machine_id")
    @classmethod
    def machine_id_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("machine_id must not be empty")
        return v

    @field_validator("reason")
    @classmethod
    def reason_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("reason must not be empty")
        return v

    @field_validator("duration_minutes")
    @classmethod
    def duration_must_be_positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError(f"duration_minutes must be > 0; got {v}")
        return v

    @field_validator("source_type")
    @classmethod
    def source_type_must_be_valid(cls, v: str) -> str:
        valid = {"synthetic", "real", "derived"}
        if v not in valid:
            raise ValueError(f"source_type must be one of {valid}; got {v!r}")
        return v
