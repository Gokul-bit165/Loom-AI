"""
Loom AI v2 — /api/v2/production router.

Q1: GET /api/v2/production/summary — day-level summary by shift
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.analytics.formulas import loom_efficiency_pct
from app.db_models import Loom, ProductionLog, ProductionTarget, ShiftMaster, Unit
from app.routers.deps import get_session, http_error
from app.schemas import ProductionSummaryResponse, ShiftSummary

router = APIRouter()


@router.get("/summary", response_model=ProductionSummaryResponse)
def production_summary(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> ProductionSummaryResponse:
    unit_row = session.execute(
        select(Unit).where(Unit.code == unit)
    ).scalar_one_or_none()
    if unit_row is None:
        http_error(404, "UNIT_NOT_FOUND", f"Unit '{unit}' does not exist.")

    shifts_meta = session.execute(
        select(ShiftMaster).order_by(ShiftMaster.code)
    ).scalars().all()

    shift_summaries: list[ShiftSummary] = []
    day_picks = Decimal("0")
    day_metres = Decimal("0")
    day_sched_min = 0
    day_running_min = 0

    for sm in shifts_meta:
        rows = session.execute(
            select(
                func.sum(ProductionLog.actual_picks).label("picks"),
                func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
                func.sum(ProductionLog.scheduled_minutes).label("sched"),
                func.sum(ProductionLog.running_minutes).label("running"),
                func.sum(ProductionLog.metres).label("metres"),
                func.sum(ProductionLog.kilo_picks).label("kilo_picks"),
                func.count(ProductionLog.loom_id).label("loom_count"),
            )
            .join(Loom, Loom.loom_id == ProductionLog.loom_id)
            .where(
                Loom.unit_id == unit_row.unit_id,
                ProductionLog.work_date == date,
                ProductionLog.shift_id == sm.shift_id,
                ProductionLog.is_current == True,
            )
        ).one()

        eff = loom_efficiency_pct(rows.picks, rows.avg_rpm, rows.sched)

        # Target efficiency from production_target (if any)
        target_row = session.execute(
            select(ProductionTarget.target_efficiency_pct)
            .where(
                ProductionTarget.unit_id == unit_row.unit_id,
                ProductionTarget.work_date == date,
                ProductionTarget.shift_id == sm.shift_id,
                ProductionTarget.loom_id.is_(None),
            )
            .limit(1)
        ).scalar_one_or_none()

        stopped = (int(rows.sched or 0)) - (int(rows.running or 0))
        shift_summaries.append(ShiftSummary(
            shift_code=sm.code,
            target_eff=Decimal(str(target_row)) if target_row else None,
            actual_eff=eff,
            metres=Decimal(str(rows.metres or 0)),
            kilo_picks=Decimal(str(rows.kilo_picks or 0)),
            loom_count=int(rows.loom_count or 0),
            stopped_minutes_total=max(0, stopped),
        ))
        day_picks += Decimal(str(rows.picks or 0))
        day_metres += Decimal(str(rows.metres or 0))
        day_sched_min += int(rows.sched or 0)
        day_running_min += int(rows.running or 0)

    day_eff = loom_efficiency_pct(
        int(day_picks),
        None,   # can't avg rpm across shifts meaningfully — use aggregate
        day_sched_min,
    )
    # For day total, use metres-based efficiency proxy instead
    # (correct approach: sum picks / sum (avg_rpm * sched) is only meaningful per-loom)
    # Show day total as unweighted avg of shift efficiencies that have data
    effs_with_data = [s.actual_eff for s in shift_summaries if s.actual_eff is not None]
    day_eff_avg = (
        round(sum(effs_with_data) / len(effs_with_data), 2) if effs_with_data else None
    )

    data_as_of = session.execute(
        select(func.max(ProductionLog.ingested_at))
        .join(Loom, Loom.loom_id == ProductionLog.loom_id)
        .where(
            Loom.unit_id == unit_row.unit_id,
            ProductionLog.work_date == date,
            ProductionLog.is_current == True,
        )
    ).scalar_one_or_none()

    source_mix = session.execute(
        select(ProductionLog.source.distinct())
        .join(Loom, Loom.loom_id == ProductionLog.loom_id)
        .where(
            Loom.unit_id == unit_row.unit_id,
            ProductionLog.work_date == date,
            ProductionLog.is_current == True,
        )
    ).scalars().all()

    return ProductionSummaryResponse(
        date=date,
        unit_code=unit,
        shifts=shift_summaries,
        day_total=ShiftSummary(
            shift_code="ALL",
            target_eff=None,
            actual_eff=day_eff_avg,
            metres=day_metres,
            kilo_picks=Decimal(str(sum(float(s.kilo_picks) for s in shift_summaries))),
            loom_count=max(s.loom_count for s in shift_summaries) if shift_summaries else 0,
            stopped_minutes_total=day_sched_min - day_running_min,
        ),
        data_as_of=data_as_of,
        source_mix=[str(s) for s in source_mix] if source_mix else ["DEMO"],
    )


@router.get("/comparison")
def production_comparison(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> dict:
    from app.services.truth_service import ProductionService
    return ProductionService.get_production_comparison(session, unit, date)

