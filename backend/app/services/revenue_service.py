"""
Service layer for Q21 Revenue & Loss.
"""
from __future__ import annotations

import datetime
from typing import Any
from sqlalchemy.orm import Session

from app.analytics.revenue import get_revenue_summary


class RevenueService:

    def __init__(self, session: Session):
        self.session = session

    def get_summary(
        self,
        date: datetime.date | None = None,
        department: str | None = None,
        machine_id: str | None = None,
        fabric_style: str | None = None,
    ) -> dict[str, Any]:
        """
        Invokes deterministic revenue analytics and prepares API payload.
        """
        raw_result = get_revenue_summary(
            session=self.session,
            date=date,
            department=department,
            machine_id=machine_id,
            fabric_style=fabric_style,
        )

        data_quality = raw_result["data_quality"]
        has_data = data_quality["records_analyzed"] > 0

        data_payload = {
            "has_data": has_data,
            "summary": raw_result["summary"],
            "machine_ranking": raw_result["machine_ranking"],
            "fabric_style_ranking": raw_result["fabric_style_ranking"],
            "best_machine": raw_result["best_machine"],
            "worst_machine": raw_result["worst_machine"],
            "best_style": raw_result["best_style"],
            "worst_style": raw_result["worst_style"],
            "revenue_loss": raw_result["revenue_loss"],
            "evidence": raw_result["evidence"],
        }

        metadata = {
            "date": raw_result["summary"]["date"],
            "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "dataset": "synthetic" if data_quality["is_demo"] else "production",
            "source_type": "derived",
        }

        return {
            "data": data_payload,
            "metadata": metadata,
            "data_quality": data_quality,
        }
