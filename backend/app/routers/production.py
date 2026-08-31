"""
FastAPI Router for Q1 Production vs Target.
"""
from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_session
from app.routers.common import parse_query_date
from app.services.production_service import ProductionService


router = APIRouter(prefix="/api/production", tags=["Production (Q1)"])


def get_db():
    with get_session() as session:
        yield session


@router.get(
    "/variance",
    summary="Get Production vs Target Variance (Q1)",
    description="Returns deterministic production metrics, machine performance drilldown, and day-over-day variance.",
)
def get_production_variance_endpoint(
    date: str | None = Query(None, description="Analysis date in YYYY-MM-DD format (defaults to latest available)"),
    department: str | None = Query(None, description="Filter by department (e.g. 'Weaving', 'Spinning')"),
    machine_type: str | None = Query(None, description="Filter by machine type (e.g. 'Toyota', 'RingFrame')"),
    machine_id: str | None = Query(None, description="Filter by specific machine ID (e.g. 'TOY-01')"),
    shift: int | None = Query(None, ge=1, le=3, description="Filter by shift (1, 2, or 3)"),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    parsed_date = parse_query_date(date)
    service = ProductionService(db)
    return service.get_variance(
        date=parsed_date,
        department=department,
        machine_type=machine_type,
        machine_id=machine_id,
        shift=shift,
    )


@router.get(
    "/trend",
    summary="Get 14-Day Production Trajectory (Q1)",
    description="Returns daily actual output, planned target, and efficiency trajectory over the last N days.",
)
def get_production_trend_endpoint(
    date: str | None = Query(None, description="End date in YYYY-MM-DD format (defaults to latest available)"),
    days: int = Query(14, ge=1, le=90, description="Number of trailing days (default 14)"),
    department: str | None = Query(None, description="Filter by department"),
    machine_type: str | None = Query(None, description="Filter by machine type"),
    machine_id: str | None = Query(None, description="Filter by machine ID"),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    parsed_date = parse_query_date(date)
    service = ProductionService(db)
    return service.get_trend(
        date=parsed_date,
        days=days,
        department=department,
        machine_type=machine_type,
        machine_id=machine_id,
    )
