"""
Loom AI v2 — /api/v2/recommendations router.

Manages closed-loop management decision workflow:
OPEN -> ACKNOWLEDGED -> ASSIGNED -> COMPLETED -> VERIFIED
"""
from __future__ import annotations

import datetime
import json
from typing import Any, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.analytics.recommendations import generate_structured_recommendations
from app.db_models import DecisionActionRecord, Loom, Unit
from app.routers.deps import get_session, http_error

router = APIRouter()


class ActionUpdateRequest(BaseModel):
    status: str  # ACKNOWLEDGED, ASSIGNED, COMPLETED, VERIFIED
    assignee: Optional[str] = None
    action_taken: Optional[str] = None
    after_metrics: Optional[str] = None


@router.get("/")
def get_all_recommendations(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    status: Optional[str] = Query(None),
    session: Session = Depends(get_session),
) -> list[dict[str, Any]]:
    unit_row = session.execute(select(Unit).where(Unit.code == unit)).scalar_one_or_none()
    if unit_row is None:
        http_error(404, "UNIT_NOT_FOUND", f"Unit '{unit}' does not exist.")

    # Generate current day recommendations
    recs = generate_structured_recommendations(session, unit_id=unit_row.unit_id, work_date=date)

    # Check if any persisted actions exist in DB
    persisted = session.execute(select(DecisionActionRecord)).scalars().all()
    persisted_map = {p.recommendation_id: p for p in persisted}

    merged = []
    for r in recs:
        rec_id = r["recommendation_id"]
        if rec_id in persisted_map:
            p = persisted_map[rec_id]
            r["status"] = p.status
            r["assignee"] = p.assignee
            r["action_taken"] = p.action_taken
            r["acknowledged_at"] = p.acknowledged_at.isoformat() if p.acknowledged_at else None
            r["completed_at"] = p.completed_at.isoformat() if p.completed_at else None
            r["verified_at"] = p.verified_at.isoformat() if p.verified_at else None

        if status is None or r["status"] == status:
            merged.append(r)

    return merged


@router.post("/{recommendation_id}/action")
def update_recommendation_action(
    recommendation_id: str,
    req: ActionUpdateRequest,
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    record = session.execute(
        select(DecisionActionRecord).where(DecisionActionRecord.recommendation_id == recommendation_id)
    ).scalar_one_or_none()

    now = datetime.datetime.now(datetime.timezone.utc)

    if record is None:
        record = DecisionActionRecord(
            recommendation_id=recommendation_id,
            priority="P1",
            category="GENERAL",
            issue="Operational Diagnostic",
            recommended_action="Execute floor corrective action",
            status=req.status,
            assignee=req.assignee,
            action_taken=req.action_taken,
        )
        session.add(record)

    record.status = req.status
    if req.assignee:
        record.assignee = req.assignee
    if req.action_taken:
        record.action_taken = req.action_taken
    if req.after_metrics:
        record.after_metrics = req.after_metrics

    if req.status == "ACKNOWLEDGED":
        record.acknowledged_at = now
    elif req.status == "COMPLETED":
        record.completed_at = now
    elif req.status == "VERIFIED":
        record.verified_at = now

    session.commit()
    return {
        "ok": True,
        "recommendation_id": recommendation_id,
        "status": record.status,
        "assignee": record.assignee,
        "updated_at": now.isoformat(),
    }
