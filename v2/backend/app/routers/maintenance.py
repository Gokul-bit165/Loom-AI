"""
Loom AI v2 — /api/v2/maintenance router.

Q12: Looms requiring maintenance, overdue maintenance, preventive maintenance status.
Q13: Scheduled vs actual maintenance duration, overrun %, looms with repeated issues vs standard downtime.
Q14: Predictive maintenance breakdown risk & maintenance cost by loom.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.ml_pipeline import predict_loom_breakdown_risk
from app.db_models import Loom, MaintenanceRecord, StopEvent, Unit
from app.routers.deps import get_session, http_error

router = APIRouter()


@router.get("/analytics")
def get_maintenance_analytics(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    unit_row = session.execute(select(Unit).where(Unit.code == unit)).scalar_one_or_none()
    if unit_row is None:
        http_error(404, "UNIT_NOT_FOUND", f"Unit '{unit}' does not exist.")

    # 1. Q12 & Q13 Maintenance Records & Overrun Analysis
    records = session.execute(
        select(
            MaintenanceRecord.record_id,
            MaintenanceRecord.loom_id,
            Loom.loom_no,
            Loom.loom_type_code,
            MaintenanceRecord.maintenance_type,
            MaintenanceRecord.scheduled_date,
            MaintenanceRecord.due_date,
            MaintenanceRecord.completed_date,
            MaintenanceRecord.scheduled_duration_min,
            MaintenanceRecord.actual_duration_min,
            MaintenanceRecord.overrun_min,
            MaintenanceRecord.cost_inr,
            MaintenanceRecord.technician_name,
            MaintenanceRecord.recurring_flag,
            MaintenanceRecord.description,
        )
        .join(Loom, Loom.loom_id == MaintenanceRecord.loom_id)
        .where(Loom.unit_id == unit_row.unit_id)
        .order_by(MaintenanceRecord.scheduled_date.desc())
    ).all()

    today_scheduled = []
    overdue_pm = []
    recurring_issues = []
    total_maint_cost = Decimal("0.0")

    for r in records:
        cost = Decimal(str(r.cost_inr or 0))
        total_maint_cost += cost
        is_overdue = r.due_date < date and r.completed_date is None
        sched_min = r.scheduled_duration_min
        act_min = r.actual_duration_min or (sched_min + (r.overrun_min or 0))
        overrun = r.overrun_min or max(0, act_min - sched_min)
        overrun_pct = round((overrun / max(sched_min, 1)) * 100.0, 1)

        item = {
            "record_id": r.record_id,
            "loom_id": r.loom_id,
            "loom_no": r.loom_no,
            "loom_type": r.loom_type_code,
            "maintenance_type": r.maintenance_type,
            "scheduled_date": r.scheduled_date.isoformat(),
            "due_date": r.due_date.isoformat(),
            "completed_date": r.completed_date.isoformat() if r.completed_date else None,
            "status": "COMPLETED" if r.completed_date else ("OVERDUE" if is_overdue else "SCHEDULED"),
            "scheduled_duration_min": sched_min,
            "actual_duration_min": act_min,
            "overrun_min": overrun,
            "overrun_pct": overrun_pct,
            "cost_inr": float(cost),
            "technician": r.technician_name or "Head Fitter",
            "recurring_flag": r.recurring_flag,
            "description": r.description or "Routine 500-hr lubrication & gripper inspection",
        }

        if r.scheduled_date == date:
            today_scheduled.append(item)
        if is_overdue:
            overdue_pm.append(item)
        if r.recurring_flag:
            recurring_issues.append(item)

    # 2. Q14 High Risk Predictive Maintenance Looms (from ML pipeline)
    sample_looms = session.execute(
        select(Loom.loom_id, Loom.loom_no)
        .where(Loom.unit_id == unit_row.unit_id, Loom.active == True)
        .limit(10)
    ).all()

    predicted_risk_looms = []
    for l_id, l_no in sample_looms:
        pred = predict_loom_breakdown_risk(session, l_id, date)
        if pred.get("prediction_available"):
            predicted_risk_looms.append({
                "loom_id": l_id,
                "loom_no": l_no,
                "breakdown_risk_pct": pred["breakdown_risk_24h_pct"],
                "risk_level": pred["risk_level"],
                "forecast_cost_next_30d_inr": pred["expected_maintenance_cost_next_30d_inr"],
                "top_factors": pred["top_contributing_factors"],
            })

    # Sort predicted risk looms
    predicted_risk_looms.sort(key=lambda x: x["breakdown_risk_pct"], reverse=True)

    return {
        "work_date": date.isoformat(),
        "unit_code": unit,
        "scheduled_today_count": len(today_scheduled),
        "overdue_pm_count": len(overdue_pm),
        "recurring_issue_count": len(recurring_issues),
        "total_maintenance_cost_inr": float(total_maint_cost),
        "today_scheduled": today_scheduled,
        "overdue_preventive_maintenance": overdue_pm,
        "recurring_maintenance_issues": recurring_issues,
        "predictive_breakdown_risks": predicted_risk_looms[:6],
        "provenance": {
            "schedules": "AVAILABLE",
            "overruns": "CALCULATED",
            "predictions": "MODEL PREDICTED",
        },
    }
