"""
Pydantic DTOs / Schemas for FastAPI requests and responses.
"""
from __future__ import annotations

import datetime
from typing import Any, Generic, TypeVar
from pydantic import BaseModel, Field


T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: dict[str, Any] = Field(default_factory=dict)


class ErrorResponse(BaseModel):
    error: ErrorDetail


class ResponseMetadata(BaseModel):
    date: str | None = None
    generated_at: str
    dataset: str = "synthetic"
    source_type: str = "synthetic"


class DataQualityInfo(BaseModel):
    records_analyzed: int
    is_demo: bool
    dataset_label: str
    machines_counted: int | None = None
    unique_machines_recorded: int | None = None
    unique_machines_with_breakdown: int | None = None


class StandardApiResponse(BaseModel, Generic[T]):
    data: T
    metadata: ResponseMetadata
    data_quality: DataQualityInfo


class AskQuestionRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=500, description="Natural language question about factory metrics")
    date: str | None = Field(None, description="Optional target date in YYYY-MM-DD format")
    department: str | None = Field(None, description="Optional department filter")
    machine_id: str | None = Field(None, description="Optional machine ID filter")
