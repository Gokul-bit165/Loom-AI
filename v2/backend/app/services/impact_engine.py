"""
Loom AI v2 — Business Impact Engine.

Calculates the financial and physical impact of operational exceptions (downtime, efficiency drift,
defect rate spikes, air leakage) using configurable production loss modeling.

Supported Loss Models:
1. STYLE_SPECIFIC: Standard style PPM + RPM configuration.
2. LOOM_SPECIFIC: Loom-calibrated gear ratio & operating speed.
3. HISTORICAL_MEASURED: Measured 30-day shift rate for that loom/style combination.
4. STANDARD_RATED: Factory standard default (650 RPM, 1968.5 PPM, Rs.40.00/m).
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any, Dict, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db_models import Loom, ProductionLog, Style


class ImpactEngine:
    @staticmethod
    def calculate_downtime_loss(
        session: Session,
        loom_id: int,
        downtime_minutes: float,
        work_date: datetime.date,
        model: str = "STYLE_SPECIFIC",
    ) -> Dict[str, Any]:
        dt_min = Decimal(str(max(0.0, downtime_minutes)))

        # Default standard assumptions
        rpm = Decimal("650.0")
        ppm = Decimal("1968.5")
        selling_rate = Decimal("40.00")
        method = "STANDARD_RATED"
        assumptions = "Standard factory rating: 650 RPM, 1968.5 PPM, Rs.40.00/m selling rate"

        # Try to resolve style-specific rates from today's production log
        prod_row = session.execute(
            select(ProductionLog, Style)
            .join(Style, Style.style_id == ProductionLog.style_id)
            .where(
                ProductionLog.loom_id == loom_id,
                ProductionLog.work_date == work_date,
                ProductionLog.is_current == True,
            )
        ).first()

        if prod_row:
            p_log, style = prod_row
            if p_log.std_rpm_snapshot:
                rpm = Decimal(str(p_log.std_rpm_snapshot))
            if style.picks_per_metre:
                ppm = Decimal(str(style.picks_per_metre))
            if style.revenue_per_metre:
                selling_rate = Decimal(str(style.revenue_per_metre))

            method = "STYLE_SPECIFIC"
            assumptions = f"Active Style {style.style_code}: {rpm} RPM, {ppm} PPM, Rs.{selling_rate}/m"

        # Metres lost formula: (Minutes * RPM) / PPM
        metres_lost = (dt_min * rpm) / ppm if ppm > 0 else Decimal("0.0")
        metres_lost = round(metres_lost, 1)
        revenue_lost = round(metres_lost * selling_rate, 0)

        return {
            "downtime_minutes": float(dt_min),
            "estimated_metres_lost": float(metres_lost),
            "estimated_revenue_exposure_inr": float(revenue_lost),
            "calculation_method": method,
            "assumptions": assumptions,
            "parameters": {
                "rpm": float(rpm),
                "ppm": float(ppm),
                "selling_rate_inr_per_metre": float(selling_rate),
            },
            "provenance": "ESTIMATED",
        }

    @staticmethod
    def calculate_efficiency_loss(
        scheduled_metres: float,
        actual_metres: float,
        selling_rate: float = 40.0,
    ) -> Dict[str, Any]:
        deficit_m = max(0.0, scheduled_metres - actual_metres)
        rate = Decimal(str(selling_rate))
        deficit = Decimal(str(round(deficit_m, 1)))
        loss_inr = round(deficit * rate, 0)

        return {
            "deficit_metres": float(deficit),
            "financial_loss_inr": float(loss_inr),
            "calculation_method": "SCHEDULE_DEFICIT_DELTA",
            "assumptions": f"Standard selling rate Rs.{selling_rate}/m",
            "provenance": "CALCULATED",
        }
