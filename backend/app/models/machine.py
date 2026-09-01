"""
Pydantic schema for a validated Machine master record.
"""
from __future__ import annotations

from pydantic import BaseModel, ConfigDict, field_validator


class MachineRecord(BaseModel):
    """
    A validated machine master record.
    """

    model_config = ConfigDict(frozen=True)

    machine_id: str
    unit: str
    department: str
    machine_type: str
    granularity: str
    source_type: str = "synthetic"
    active: bool = True

    # Provenance fields
    source_file: str = "machines.csv"
    source_row: int = 1

    @field_validator("machine_id", "unit", "department", "machine_type")
    @classmethod
    def field_must_not_be_empty(cls, v: str, info) -> str:
        v = v.strip()
        if not v:
            raise ValueError(f"{info.field_name} must not be empty")
        return v

    @field_validator("granularity")
    @classmethod
    def granularity_must_be_valid(cls, v: str) -> str:
        valid = {"real_grounded", "synthetic_loom_number"}
        if v not in valid:
            raise ValueError(f"granularity must be one of {valid}; got {v!r}")
        return v

    @field_validator("source_type")
    @classmethod
    def source_type_must_be_valid(cls, v: str) -> str:
        valid = {"synthetic", "real", "derived"}
        if v not in valid:
            raise ValueError(f"source_type must be one of {valid}; got {v!r}")
        return v
