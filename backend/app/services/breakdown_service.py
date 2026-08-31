"""
Service layer for Q5 Breakdown & Downtime.
"""
from __future__ import annotations

import datetime
from typing import Any
from sqlalchemy.orm import Session

from app.analytics.breakdown import get_breakdown_ranking
from app.analytics.recommendations import get_breakdown_recommendations


class BreakdownService:

    def __init__(self, session: Session):
        self.session = session

    def get_ranking(
        self,
        period: str = "today",
        date: datetime.date | None = None,
        department: str | None = None,
        machine_type: str | None = None,
        machine_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Invokes deterministic breakdown analytics and prepares API payload.
        """
        raw_result = get_breakdown_ranking(
            session=self.session,
            period=period,
            date=date,
            department=department,
            machine_type=machine_type,
            machine_id=machine_id,
        )

        data_quality = raw_result["data_quality"]
        has_data = data_quality["records_analyzed"] > 0

        # Generate deterministic recommendations
        recommendations = get_breakdown_recommendations(raw_result) if has_data else []

        data_payload = {
            "has_data": has_data,
            "period_info": raw_result["period_info"],
            "total_downtime_minutes": raw_result["total_downtime_minutes"],
            "total_events": raw_result["total_events"],
            "average_event_duration": raw_result.get("average_event_duration", 0),
            "machine_ranking": raw_result["machine_ranking"],
            "breakdown_count_ranking": raw_result.get("breakdown_count_ranking", []),
            "reason_ranking": raw_result["reason_ranking"],
            "shift_ranking": raw_result.get("shift_ranking", []),
            "highest_downtime_machine": raw_result["highest_downtime_machine"],
            "lowest_downtime_machine": raw_result["lowest_downtime_machine"],
            "most_breakdown_events_machine": raw_result.get("most_breakdown_events_machine"),
            "highest_downtime_shift": raw_result.get("highest_downtime_shift"),
            "recurring_reasons": raw_result["recurring_reasons"],
            "recommendations": recommendations,
            "evidence": raw_result["evidence"],
        }

        metadata = {
            "date": raw_result["period_info"]["end_date"],
            "period": period,
            "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "dataset": "synthetic" if data_quality["is_demo"] else "production",
            "source_type": "synthetic",
        }

        return {
            "data": data_payload,
            "metadata": metadata,
            "data_quality": data_quality,
        }
