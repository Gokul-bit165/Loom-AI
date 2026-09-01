"""
FastAPI Router for Q5 Breakdown & Downtime.
"""
from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_session
from app.routers.common import parse_query_date
from app.services.breakdown_service import BreakdownService


router = APIRouter(prefix="/api/breakdown", tags=["Breakdown (Q5)"])


def get_db():
    with get_session() as session:
        yield session


@router.get(
    "/ranking",
    summary="Get Breakdown & Downtime Rankings (Q5)",
    description="Returns deterministic machine downtime rankings, reason distributions, and worst-performing machines.",
)
def get_breakdown_ranking_endpoint(
    period: str = Query("today", description="Aggregation period: 'today' or 'month'"),
    date: str | None = Query(None, description="Analysis date in YYYY-MM-DD format"),
    department: str | None = Query(None, description="Filter by department"),
    machine_type: str | None = Query(None, description="Filter by machine type"),
    machine_id: str | None = Query(None, description="Filter by specific machine ID"),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    norm_period = period.strip().lower()
    if norm_period not in ("today", "month"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "INVALID_PERIOD",
                "message": f"Invalid period '{period}'. Allowed values are 'today' or 'month'.",
            },
        )

    parsed_date = parse_query_date(date)
    service = BreakdownService(db)
    return service.get_ranking(
        period=norm_period,
        date=parsed_date,
        department=department,
        machine_type=machine_type,
        machine_id=machine_id,
    )
