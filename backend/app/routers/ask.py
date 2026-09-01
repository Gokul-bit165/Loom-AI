"""
FastAPI Router for Natural Language Management Assistant (/api/ask).
"""
from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_session
from app.routers.common import parse_query_date
from app.schemas import AskQuestionRequest
from app.services.ask_service import AskService


router = APIRouter(prefix="/api", tags=["Assistant (Ask)"])


def get_db():
    with get_session() as session:
        yield session


@router.post(
    "/ask",
    summary="Ask Question (Q&A Router)",
    description="Routes natural-language management questions to the corresponding deterministic analytics service.",
)
def ask_question_endpoint(
    req: AskQuestionRequest,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    parsed_date = parse_query_date(req.date) if req.date else None
    service = AskService(db)
    return service.route_question(
        question=req.question,
        date=parsed_date,
        department=req.department,
        machine_id=req.machine_id,
    )
