"""
Service layer for Q1 Production vs Target.
"""
from __future__ import annotations

import datetime
from typing import Any
from sqlalchemy.orm import Session

from app.analytics.production import get_production_variance, get_production_trend
from app.analytics.recommendations import get_production_recommendations


class ProductionService:

    def __init__(self, session: Session):
        self.session = session

    def get_variance(
        self,
        date: datetime.date | None = None,
        department: str | None = None,
        machine_type: str | None = None,
        machine_id: str | None = None,
        shift: int | None = None,
    ) -> dict[str, Any]:
        """
        Invokes deterministic production analytics and prepares API payload.
        """
        raw_result = get_production_variance(
            session=self.session,
            date=date,
            department=department,
            machine_type=machine_type,
            machine_id=machine_id,
            shift=shift,
        )

        target_date_str = raw_result["summary"]["date"]
        data_quality = raw_result["data_quality"]

        # If 0 records were found, return an explicit no-data representation
        has_data = data_quality["records_analyzed"] > 0

        # Generate deterministic recommendations
        recommendations = get_production_recommendations(raw_result) if has_data else []

        data_payload = {
            "has_data": has_data,
            "summary": raw_result["summary"],
            "trailing_averages": raw_result.get("trailing_averages", {}),
            "production_loss": raw_result.get("production_loss", {}),
            "best_machine": raw_result.get("best_machine"),
            "worst_machine": raw_result.get("worst_machine"),
            "largest_variance_machine": raw_result.get("largest_variance_machine"),
            "biggest_loss_contributor": raw_result.get("biggest_loss_contributor"),
            "machine_performance": raw_result["machine_performance"],
            "shift_performance": raw_result["shift_performance"],
            "previous_day_comparison": raw_result["previous_day_comparison"],
            "recommendations": recommendations,
            "evidence": raw_result["evidence"],
        }

        metadata = {
            "date": target_date_str,
            "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "dataset": "synthetic" if data_quality["is_demo"] else "production",
            "source_type": "synthetic",
        }

        return {
            "data": data_payload,
            "metadata": metadata,
            "data_quality": data_quality,
        }

    def get_trend(
        self,
        date: datetime.date | None = None,
        days: int = 14,
        department: str | None = None,
        machine_type: str | None = None,
        machine_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Invokes deterministic 14-day production trajectory analytics.
        """
        trend_res = get_production_trend(
            session=self.session,
            date=date,
            days=days,
            department=department,
            machine_type=machine_type,
            machine_id=machine_id,
        )

        data_quality = trend_res["data_quality"]
        metadata = {
            "start_date": trend_res["start_date"],
            "target_date": trend_res["target_date"],
            "days": days,
            "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "dataset": "synthetic" if data_quality["is_demo"] else "production",
            "source_type": "synthetic",
        }

        return {
            "data": {
                "start_date": trend_res["start_date"],
                "target_date": trend_res["target_date"],
                "days": trend_res["days"],
                "trend_points": trend_res["trend_points"],
            },
            "metadata": metadata,
            "data_quality": data_quality,
        }
