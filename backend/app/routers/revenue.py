"""
FastAPI Router for Q21 Revenue & Loss.
"""
from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_session
from app.routers.common import parse_query_date
from app.services.revenue_service import RevenueService


router = APIRouter(prefix="/api/revenue", tags=["Revenue (Q21)"])


def get_db():
    with get_session() as session:
        yield session


@router.get(
    "/summary",
    summary="Get Revenue & Style Summary (Q21)",
    description="Returns today's revenue, MTD totals, fabric style rankings, and deterministic revenue loss status.",
)
def get_revenue_summary_endpoint(
    date: str | None = Query(None, description="Analysis date in YYYY-MM-DD format"),
    department: str | None = Query(None, description="Filter by department"),
    machine_id: str | None = Query(None, description="Filter by specific machine ID"),
    fabric_style: str | None = Query(None, description="Filter by fabric style (e.g. 'Excel Slub')"),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    parsed_date = parse_query_date(date)
    service = RevenueService(db)
    return service.get_summary(
        date=parsed_date,
        department=department,
        machine_id=machine_id,
        fabric_style=fabric_style,
    )
