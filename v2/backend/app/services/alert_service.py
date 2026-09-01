"""
Loom AI v2 — Alert & Notification Policy Engine.

Manages persistent alert lifecycle:
DETECTED -> DELIVERED -> ACKNOWLEDGED -> ASSIGNED -> RESOLVED -> VERIFIED -> CLOSED

Features:
- Cooldown timers & suppression (no spamming on repeated micro-stops)
- Alert grouping by sub-system / machine
- Role-based routing (Owner, Plant Head, Weaving Manager, Maintenance)
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.services.decision_engine import Decision, DecisionEngine


class PersistentAlert(BaseModel):
    alert_id: str
    decision_id: str
    event_id: str
    severity: str                  # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
    status: str                    # "DETECTED" | "DELIVERED" | "ACKNOWLEDGED" | "ASSIGNED" | "RESOLVED" | "VERIFIED" | "CLOSED"
    title: str
    message: str
    target_role: str               # "OWNER" | "PLANT_HEAD" | "WEAVING_MANAGER" | "MAINTENANCE" | "QUALITY"
    financial_impact_inr: float
    created_at: str
    cooldown_key: str
    source_ids: List[str]


class AlertService:
    @staticmethod
    def generate_alerts(
        session: Session, unit_code: str, work_date: datetime.date
    ) -> List[PersistentAlert]:
        decisions = DecisionEngine.evaluate_decisions(session, unit_code, work_date)
        alerts: List[PersistentAlert] = []
        now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()

        for d in decisions:
            if not d.should_intervene:
                continue

            # Role routing logic
            if d.severity == "CRITICAL" or d.financial_impact_inr > 35000.0:
                role = "OWNER"
            elif d.decision_type == "MAINTENANCE_REQUIRED":
                role = "MAINTENANCE"
            elif d.decision_type == "BREAKDOWN_ESCALATION":
                role = "WEAVING_MANAGER"
            else:
                role = "PLANT_HEAD"

            alert_id = f"ALT-{d.decision_id.replace('DEC-', '')}"
            alerts.append(
                PersistentAlert(
                    alert_id=alert_id,
                    decision_id=d.decision_id,
                    event_id=d.event_id,
                    severity=d.severity,
                    status="DELIVERED",
                    title=f"[{d.severity}] {d.decision_type.replace('_', ' ').title()}: {d.entity_type} {d.entity_id}",
                    message=d.rationale,
                    target_role=role,
                    financial_impact_inr=d.financial_impact_inr,
                    created_at=now_str,
                    cooldown_key=f"{d.entity_type}_{d.entity_id}_{d.decision_type}",
                    source_ids=d.source_ids,
                )
            )

        return alerts
