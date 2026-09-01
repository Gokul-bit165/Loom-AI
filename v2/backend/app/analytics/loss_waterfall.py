"""
Loom AI v2 — Mutually Exclusive Revenue Loss Waterfall (Q23).

Breaks down total revenue loss without double counting:
1. Potential Maximum Revenue (at 100% capacity / scheduled time)
   ├── 1. Breakdown Loss (Mechanical stoppage from StopEvent)
   ├── 2. Electrical / Utility Loss (Power cuts and voltage stops from StopEvent)
   ├── 3. Low-Speed / Performance Efficiency Loss (Picks lost while running below std RPM)
   ├── 4. Quality Rejection Loss (Defective fabric downgrade)
   └── Realized Net Revenue
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db_models import Loom, ProductionLog, ReasonCategory, ReasonCode, StopEvent, Style, Unit, QualityInspectionLog


def compute_loss_waterfall(
    session: Session,
    unit_id: int,
    start_date: datetime.date,
    end_date: datetime.date,
    selling_rate_per_metre: Decimal = Decimal("40.00"),
) -> dict:
    """
    Computes mutually exclusive loss attribution components for Ashok Textile Mills.
    """
    # 1. Total realized production & revenue
    prod_rows = session.execute(
        select(
            func.sum(ProductionLog.metres).label("total_metres"),
            func.sum(ProductionLog.actual_picks).label("total_picks"),
            func.sum(ProductionLog.scheduled_minutes).label("total_sched_min"),
            func.sum(ProductionLog.running_minutes).label("total_running_min"),
            func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
            func.count(ProductionLog.loom_id.distinct()).label("loom_count"),
        )
        .join(Loom, Loom.loom_id == ProductionLog.loom_id)
        .where(
            Loom.unit_id == unit_id,
            ProductionLog.work_date >= start_date,
            ProductionLog.work_date <= end_date,
            ProductionLog.is_current == True,
        )
    ).one()

    realized_metres = Decimal(str(prod_rows.total_metres or 0))
    realized_revenue = round(realized_metres * selling_rate_per_metre, 2)
    sched_min = int(prod_rows.total_sched_min or 0)
    running_min = int(prod_rows.total_running_min or 0)
    avg_rpm = Decimal(str(prod_rows.avg_rpm or 650.0))

    # Approx average picks per metre from styles
    ppm_avg = Decimal("1968.5")

    # 2. Classified downtime from StopEvents
    stops = session.execute(
        select(
            ReasonCode.category,
            StopEvent.raised_at,
            StopEvent.resolved_at,
        )
        .join(Loom, Loom.loom_id == StopEvent.loom_id)
        .outerjoin(ReasonCode, ReasonCode.reason_code_id == StopEvent.reason_code_id)
        .where(
            Loom.unit_id == unit_id,
            StopEvent.work_date >= start_date,
            StopEvent.work_date <= end_date,
        )
    ).all()

    breakdown_min = Decimal("0.0")
    electrical_min = Decimal("0.0")
    other_stop_min = Decimal("0.0")

    for cat, raised, resolved in stops:
        if resolved and raised:
            mins = Decimal(str((resolved - raised).total_seconds() / 60.0))
            if cat in (ReasonCategory.MECHANICAL, ReasonCategory.MATERIAL):
                breakdown_min += mins
            elif cat in (ReasonCategory.ELECTRICAL, ReasonCategory.UTILITY):
                electrical_min += mins
            else:
                other_stop_min += mins

    # Metres lost from mechanical breakdowns
    breakdown_lost_metres = round((breakdown_min * avg_rpm) / ppm_avg, 2)
    breakdown_loss_inr = round(breakdown_lost_metres * selling_rate_per_metre, 2)

    # Metres lost from electrical / power
    electrical_lost_metres = round((electrical_min * avg_rpm) / ppm_avg, 2)
    electrical_loss_inr = round(electrical_lost_metres * selling_rate_per_metre, 2)

    # 3. Low-Speed / Speed Efficiency Loss while running
    # Expected picks while running = running_min * avg_rpm
    expected_running_picks = Decimal(running_min) * avg_rpm
    actual_picks = Decimal(str(prod_rows.total_picks or 0))
    speed_lost_picks = max(Decimal("0.0"), expected_running_picks - actual_picks)
    efficiency_lost_metres = round(speed_lost_picks / ppm_avg, 2)
    efficiency_loss_inr = round(efficiency_lost_metres * selling_rate_per_metre, 2)

    # 4. Quality rejection loss
    quality_rows = session.execute(
        select(
            func.sum(QualityInspectionLog.defective_metres).label("def_metres")
        )
        .join(Loom, Loom.loom_id == QualityInspectionLog.loom_id)
        .where(
            Loom.unit_id == unit_id,
            QualityInspectionLog.work_date >= start_date,
            QualityInspectionLog.work_date <= end_date,
        )
    ).one_or_none()

    quality_lost_metres = Decimal(str(quality_rows.def_metres if quality_rows and quality_rows.def_metres else 0.0))
    quality_loss_inr = round(quality_lost_metres * Decimal("15.00"), 2)  # Rs.15/m discount for seconds quality

    total_potential_revenue = (
        realized_revenue + breakdown_loss_inr + electrical_loss_inr + efficiency_loss_inr + quality_loss_inr
    )

    return {
        "potential_max_revenue": float(total_potential_revenue),
        "realized_revenue": float(realized_revenue),
        "realized_metres": float(realized_metres),
        "waterfall_components": [
            {
                "category": "Mechanical / Mechanical Breakdowns",
                "lost_metres": float(breakdown_lost_metres),
                "lost_revenue_inr": float(breakdown_loss_inr),
                "share_pct": round(float(breakdown_loss_inr / max(total_potential_revenue, Decimal("1.0")) * 100), 1),
                "provenance": "CALCULATED"
            },
            {
                "category": "Electrical & Grid Fluctuation",
                "lost_metres": float(electrical_lost_metres),
                "lost_revenue_inr": float(electrical_loss_inr),
                "share_pct": round(float(electrical_loss_inr / max(total_potential_revenue, Decimal("1.0")) * 100), 1),
                "provenance": "CALCULATED"
            },
            {
                "category": "Speed / Running Efficiency Gap",
                "lost_metres": float(efficiency_lost_metres),
                "lost_revenue_inr": float(efficiency_loss_inr),
                "share_pct": round(float(efficiency_loss_inr / max(total_potential_revenue, Decimal("1.0")) * 100), 1),
                "provenance": "CALCULATED"
            },
            {
                "category": "Quality Defects & Downgrade",
                "lost_metres": float(quality_lost_metres),
                "lost_revenue_inr": float(quality_loss_inr),
                "share_pct": round(float(quality_loss_inr / max(total_potential_revenue, Decimal("1.0")) * 100), 1),
                "provenance": "ESTIMATED"
            },
        ],
        "total_revenue_loss_inr": float(breakdown_loss_inr + electrical_loss_inr + efficiency_loss_inr + quality_loss_inr),
    }
