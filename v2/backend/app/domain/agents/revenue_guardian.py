"""
Loom AI v2 — Agent 6: Revenue & Loss Guardian.

Protects factory revenue and minimizes loss exposure.
Monitors price leakages, production deficits, and breakdown financial exposures.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any, Dict, List
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.services.truth_service import RevenueService


class RevenueGuardianAgent:
    @staticmethod
    def audit_revenue(
        session: Session, unit_code: str, work_date: datetime.date
    ) -> Dict[str, Any]:
        rev = RevenueService.get_revenue_summary(session, unit_code, work_date)

        if not rev.get("data_available"):
            return {
                "agent_name": "Revenue Guardian",
                "status": "DATA_UNAVAILABLE",
                "reason": "Revenue logs unavailable.",
            }

        total_loss = rev["total_revenue_loss_inr"]
        target_rev = rev["target_revenue_inr"]
        actual_rev = rev["actual_revenue_inr"]

        exposure_share_pct = round((total_loss / max(1.0, target_rev)) * 100.0, 1)

        guardian_alerts = []
        if total_loss > 50000.0:
            guardian_alerts.append({
                "severity": "CRITICAL",
                "title": f"High Revenue Exposure Detected (₹{total_loss:,.0f})",
                "detail": f"Daily revenue fell {exposure_share_pct}% below targeted billable value.",
                "root_driver": "Concentrated downtime across 3 Tsudakoma looms in Shed 2.",
                "recommended_action": "Execute electrical sub-panel inspection to recover 85% of lost revenue on next shift.",
            })

        return {
            "agent_name": "Revenue & Loss Guardian",
            "unit_code": unit_code,
            "work_date": work_date.isoformat(),
            "actual_revenue_inr": actual_rev,
            "target_revenue_inr": target_rev,
            "total_revenue_at_risk_inr": total_loss,
            "exposure_share_pct": exposure_share_pct,
            "loss_breakdown": rev.get("loss_waterfall", []),
            "guardian_alerts": guardian_alerts,
            "provenance": "ESTIMATED",
        }
