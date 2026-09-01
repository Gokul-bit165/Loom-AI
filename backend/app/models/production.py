"""
Pydantic schema for a validated, normalized Production record.

A ProductionRecord is produced by the validation layer after a raw CSV row
passes all field-level checks. It is the contract the repository uses to
perform the DB insert.

Machine existence is NOT checked here — that cross-entity check is done in
the ValidationService using the MachineRepository.
"""
from __future__ import annotations

import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, field_validator, model_validator


class ProductionRecord(BaseModel):
    """
    A validated, normalized production log row.

    All types are enforced at construction time.
    If any field_validator raises, the row is rejected.

    Business rules enforced here
    ----------------------------
    - shift must be 1, 2, or 3
    - target_qty must be >= 0
    - actual_qty must be >= 0
    - efficiency_pct must be in [0, 100]
      (Note: the DB permits up to 110 as a safety net; we validate at 100
       to match the business definition of maximum efficiency.)

    Business rules NOT enforced here (done in ValidationService)
    ------------------------------------------------------------
    - machine_id must exist in the machines table
    - duplicate (machine_id, date, shift) within batch
    """

    model_config = ConfigDict(frozen=True)

    # ── Business fields ───────────────────────────────────────────────────────
    date: datetime.date
    shift: int
    machine_id: str
    target_qty: Decimal
    actual_qty: Decimal
    efficiency_pct: Decimal

    # ── Provenance fields (set by the parser, not present in raw CSV) ─────────
    source_file: str
    source_row: int   # 1-based position in the source file
    source_type: str  # synthetic | real | derived
    import_batch_id: int | None = None  # set after the ImportBatch is persisted

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

    @field_validator("target_qty")
    @classmethod
    def target_must_be_nonneg(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError(f"target_qty must be >= 0; got {v}")
        return v

    @field_validator("actual_qty")
    @classmethod
    def actual_must_be_nonneg(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError(f"actual_qty must be >= 0; got {v}")
        return v

    @field_validator("efficiency_pct")
    @classmethod
    def efficiency_must_be_in_range(cls, v: Decimal) -> Decimal:
        if not (Decimal(0) <= v <= Decimal(100)):
            raise ValueError(f"efficiency_pct must be 0–100; got {v}")
        return v

    @field_validator("source_type")
    @classmethod
    def source_type_must_be_valid(cls, v: str) -> str:
        valid = {"synthetic", "real", "derived"}
        if v not in valid:
            raise ValueError(f"source_type must be one of {valid}; got {v!r}")
        return v
