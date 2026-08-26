"""
Pydantic schema for a validated, normalized Revenue record.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, field_validator


class RevenueRecord(BaseModel):
    """
    A validated, normalized revenue log row.

    Business rules enforced here
    ----------------------------
    - date required
    - shift must be 1, 2, or 3
    - machine_id must not be empty
    - fabric_style required (cannot be empty)
    - revenue must be >= 0
    - source_type in {'synthetic', 'real', 'derived'}
    """

    model_config = ConfigDict(frozen=True)

    date: datetime.date
    shift: int
    machine_id: str
    fabric_style: str
    revenue: Decimal

    # Provenance fields
    source_file: str
    source_row: int
    source_type: str = "derived"
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

    @field_validator("fabric_style")
    @classmethod
    def fabric_style_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("fabric_style is required and cannot be empty")
        return v

    @field_validator("revenue")
    @classmethod
    def revenue_must_be_nonneg(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError(f"revenue must be >= 0; got {v}")
        return v

    @field_validator("source_type")
    @classmethod
    def source_type_must_be_valid(cls, v: str) -> str:
        valid = {"synthetic", "real", "derived"}
        if v not in valid:
            raise ValueError(f"source_type must be one of {valid}; got {v!r}")
        return v
