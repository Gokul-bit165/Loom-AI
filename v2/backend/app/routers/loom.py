"""
Loom AI v2 — /api/v2/looms router.

Q3: GET /api/v2/looms/          — Operations table (paginated, server-sorted, batch cohort)
Q4: GET /api/v2/looms/{id}/detail — Loom Detail with trend, stops, pareto, diagnostic sentence
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Literal, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.analytics.cohort import get_all_cohort_stats_for_window, get_cohort_stats, CohortResult
from app.analytics.formulas import (
    loom_efficiency_pct,
    performance_eff_pct,
    utilization_pct,
)
from app.db_models import (
    CostMaster,
    Employee,
    Loom,
    ProductionLog,
    RateSource,
    ReasonCode,
    Shed,
    ShiftMaster,
    StopEvent,
    Style,
    Unit,
)
from app.routers.deps import get_session, http_error
from app.schemas import (
    LoomDetailResponse,
    LoomRow,
    LoomsResponse,
    ReasonParetoRow,
    RupeeAmount,
    StopEventRow,
    TrendPoint,
    WeaverRecord,
)

router = APIRouter()

_REVENUE_PER_METRE = Decimal("40.00")
_REVENUE_RATE_SOURCE = "ESTIMATED"
_REVENUE_RATE_BASIS = "Rs.40.00/metre -- placeholder rate card"


def _status_from_eff(eff: Optional[Decimal], target: Decimal = Decimal("89.6")) -> str:
    if eff is None:
        return "GREY"
    if float(eff) < float(target) - 10:
        return "RED"
    if float(eff) < float(target) - 3:
        return "AMBER"
    return "GREEN"


def _rupee_lost(metres_lost: Optional[Decimal]) -> RupeeAmount:
    if metres_lost is None:
        return RupeeAmount(value=None, rate_source=_REVENUE_RATE_SOURCE, rate_basis=_REVENUE_RATE_BASIS)
    val = round(metres_lost * _REVENUE_PER_METRE, 0)
    return RupeeAmount(value=val, rate_source=_REVENUE_RATE_SOURCE, rate_basis=_REVENUE_RATE_BASIS)


def _diagnostic_sentence(
    loom_no: str,
    loom_eff: Optional[Decimal],
    perf_eff: Optional[Decimal],
    util: Optional[Decimal],
) -> Optional[str]:
    """Deterministic one-line diagnostic from the three-function split.
    Returns None if any input is missing (never fabricates a sentence)."""
    if loom_eff is None or perf_eff is None or util is None:
        return None
    eff_f = float(loom_eff)
    perf_f = float(perf_eff)
    util_f = float(util)

    if eff_f >= 87.0:
        return f"{loom_no} is on target at {eff_f:.1f}% loom efficiency."
    if util_f < 80.0 and perf_f >= 90.0:
        return (
            f"{loom_no} is at {eff_f:.1f}% loom efficiency. "
            f"Performance while running is {perf_f:.1f}%. "
            "This is a stoppage problem, not a machine-speed problem."
        )
    if perf_f < 90.0 and util_f >= 80.0:
        return (
            f"{loom_no} is at {eff_f:.1f}% loom efficiency. "
            f"Utilisation is {util_f:.1f}% (loom runs often). "
            f"Speed while running is {perf_f:.1f}% -- check RPM setting and style tension."
        )
    return (
        f"{loom_no} is at {eff_f:.1f}% loom efficiency "
        f"(utilisation {util_f:.1f}%, speed-when-running {perf_f:.1f}%). "
        "Both stoppage and speed are contributing."
    )


# ── Operations list ──────────────────────────────────────────────────────────

@router.get("/", response_model=LoomsResponse)
def list_looms(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    shift: Optional[str] = Query(None, description="1, 2, or 3; omit for all shifts"),
    sort: Literal[
        "eff_asc", "eff_desc", "loom_no_asc", "rupee_desc"
    ] = Query("eff_asc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    session: Session = Depends(get_session),
) -> LoomsResponse:
    # Validate unit
    unit_row = session.execute(select(Unit).where(Unit.code == unit)).scalar_one_or_none()
    if unit_row is None:
        http_error(404, "UNIT_NOT_FOUND", f"Unit '{unit}' does not exist.")

    # 1. Fetch cohort map in ONE single query for all styles/loom types in 30d window
    cohort_map = get_all_cohort_stats_for_window(session, date)

    # 2. Build operations rows query (filtered by is_current=True)
    q = (
        select(
            ProductionLog,
            Loom.loom_no,
            Loom.loom_type_code,
            Loom.register_confirmed,
            Style.style_code,
            Style.picks_per_metre,
            Style.style_id,
            ShiftMaster.code.label("shift_code"),
            Shed.code.label("shed_code"),
            Employee.name.label("weaver_name"),
        )
        .join(Loom, Loom.loom_id == ProductionLog.loom_id)
        .join(Style, Style.style_id == ProductionLog.style_id)
        .join(ShiftMaster, ShiftMaster.shift_id == ProductionLog.shift_id)
        .outerjoin(Shed, Shed.shed_id == Loom.shed_id)
        .outerjoin(Employee, Employee.employee_id == ProductionLog.employee_id)
        .where(
            Loom.unit_id == unit_row.unit_id,
            ProductionLog.work_date == date,
            ProductionLog.is_current == True,
        )
    )
    if isinstance(shift, str) and shift:
        q = q.where(ShiftMaster.code == shift)

    rows = session.execute(q).all()
    if not rows:
        return LoomsResponse(looms=[], total=0, page=page, page_size=page_size)

    data_as_of = max(r.ProductionLog.ingested_at for r in rows)
    source_mix = list({str(r.ProductionLog.source) for r in rows})

    loom_rows: list[LoomRow] = []
    for r in rows:
        pl = r.ProductionLog
        eff = loom_efficiency_pct(pl.actual_picks, pl.std_rpm_snapshot, pl.scheduled_minutes)
        perf = performance_eff_pct(pl.actual_picks, pl.std_rpm_snapshot, pl.running_minutes)
        util = utilization_pct(pl.running_minutes, pl.scheduled_minutes)

        cohort = cohort_map.get(
            (r.style_id, r.loom_type_code),
            CohortResult(None, None, 0, "30d", False),
        )
        cohort_gap = (
            round(eff - cohort.median_eff, 2)
            if (eff is not None and cohort.sufficient and cohort.median_eff is not None)
            else None
        )

        total_picks_k = float(pl.actual_picks) / 1000.0 if pl.actual_picks else None
        warp_rate = round(Decimal(str(pl.warp_breaks / total_picks_k)), 3) if total_picks_k else None
        weft_rate = round(Decimal(str(pl.weft_breaks / total_picks_k)), 3) if total_picks_k else None

        actual_metres = float(pl.metres)
        full_eff_metres = (
            float(pl.std_rpm_snapshot) * pl.scheduled_minutes / float(r.picks_per_metre)
            if (pl.std_rpm_snapshot and r.picks_per_metre) else None
        )
        rupee_obj = _rupee_lost(
            Decimal(str(full_eff_metres - actual_metres))
            if (full_eff_metres is not None and full_eff_metres > actual_metres)
            else Decimal("0")
        )

        loom_rows.append(LoomRow(
            loom_id=pl.loom_id,
            loom_no=r.loom_no,
            loom_type_code=r.loom_type_code,
            shed_code=r.shed_code,
            style_code=r.style_code,
            shift_code=r.shift_code,
            weaver_name=r.weaver_name,
            metres=pl.metres,
            kilo_picks=pl.kilo_picks,
            scheduled_minutes=pl.scheduled_minutes,
            running_minutes=pl.running_minutes,
            stopped_minutes=pl.scheduled_minutes - pl.running_minutes,
            loom_efficiency_pct=eff,
            performance_eff_pct=perf,
            utilization_pct=util,
            cohort_gap_pp=cohort_gap,
            cohort_loom_count=cohort.loom_count,
            cohort_window=cohort.window,
            warp_breaks_per_1000=warp_rate,
            weft_breaks_per_1000=weft_rate,
            warp_breaks=pl.warp_breaks,
            weft_breaks=pl.weft_breaks,
            rupee_lost=rupee_obj,
            status=_status_from_eff(eff),
        ))

    # Sort
    if sort == "eff_asc":
        loom_rows.sort(key=lambda x: float(x.loom_efficiency_pct or 0))
    elif sort == "eff_desc":
        loom_rows.sort(key=lambda x: float(x.loom_efficiency_pct or 0), reverse=True)
    elif sort == "loom_no_asc":
        loom_rows.sort(key=lambda x: x.loom_no)
    elif sort == "rupee_desc":
        loom_rows.sort(key=lambda x: float(x.rupee_lost.value or 0), reverse=True)

    total = len(loom_rows)
    start = (page - 1) * page_size
    paged = loom_rows[start : start + page_size]

    return LoomsResponse(
        looms=paged,
        total=total,
        page=page,
        page_size=page_size,
        data_as_of=data_as_of,
        source_mix=source_mix,
    )


# ── Loom Detail ──────────────────────────────────────────────────────────────

@router.get("/{loom_id}/detail", response_model=LoomDetailResponse)
def loom_detail(
    loom_id: int,
    days: int = Query(30, ge=1, le=365),
    session: Session = Depends(get_session),
) -> LoomDetailResponse:
    loom = session.get(Loom, loom_id)
    if loom is None:
        http_error(404, "LOOM_NOT_FOUND", f"Loom {loom_id} does not exist.")

    shed = session.get(Shed, loom.shed_id) if loom.shed_id else None

    latest_date_row = session.execute(
        select(ProductionLog.work_date)
        .where(ProductionLog.loom_id == loom_id, ProductionLog.is_current == True)
        .order_by(ProductionLog.work_date.desc())
        .limit(1)
    ).scalar_one_or_none()
    as_of = latest_date_row or datetime.date.today()
    window_start = as_of - datetime.timedelta(days=days - 1)

    trend_rows = session.execute(
        select(
            ProductionLog.work_date,
            func.sum(ProductionLog.actual_picks).label("picks"),
            func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
            func.sum(ProductionLog.scheduled_minutes).label("sched"),
            Style.style_code,
        )
        .join(Style, Style.style_id == ProductionLog.style_id)
        .where(
            ProductionLog.loom_id == loom_id,
            ProductionLog.work_date >= window_start,
            ProductionLog.work_date <= as_of,
            ProductionLog.is_current == True,
        )
        .group_by(ProductionLog.work_date, Style.style_code)
        .order_by(ProductionLog.work_date)
    ).all()

    prev_style: Optional[str] = None
    trend: list[TrendPoint] = []
    for tr in trend_rows:
        eff = loom_efficiency_pct(tr.picks, tr.avg_rpm, tr.sched)
        style_changed = prev_style is not None and tr.style_code != prev_style
        trend.append(TrendPoint(
            date=tr.work_date,
            loom_efficiency_pct=eff,
            style_code=tr.style_code,
            style_changed=style_changed,
        ))
        prev_style = tr.style_code

    stop_rows = session.execute(
        select(StopEvent, ReasonCode.code, ReasonCode.label_en, ReasonCode.category)
        .outerjoin(ReasonCode, ReasonCode.reason_code_id == StopEvent.reason_code_id)
        .where(
            StopEvent.loom_id == loom_id,
            StopEvent.raised_at >= datetime.datetime.combine(window_start, datetime.time.min),
        )
        .order_by(StopEvent.raised_at.desc())
    ).all()

    stop_events: list[StopEventRow] = []
    for sr in stop_rows:
        se = sr.StopEvent
        dur = None
        if se.resolved_at and se.raised_at:
            dur = Decimal(str((se.resolved_at - se.raised_at).total_seconds() / 60)).quantize(Decimal("0.1"))
        stop_events.append(StopEventRow(
            stop_event_id=se.stop_event_id,
            raised_at=se.raised_at,
            resolved_at=se.resolved_at,
            reason_label_en=sr.label_en,
            reason_category=str(sr.category) if sr.category else None,
            duration_min=dur,
            status=str(se.status),
        ))

    pareto_events = session.execute(
        select(
            ReasonCode.code,
            ReasonCode.label_en,
            StopEvent.raised_at,
            StopEvent.resolved_at,
        )
        .join(ReasonCode, ReasonCode.reason_code_id == StopEvent.reason_code_id)
        .where(
            StopEvent.loom_id == loom_id,
            StopEvent.raised_at >= datetime.datetime.combine(window_start, datetime.time.min),
        )
    ).all()

    pareto_dict: dict[str, dict[str, Any]] = {}
    for pe in pareto_events:
        c = pe.code
        if c not in pareto_dict:
            pareto_dict[c] = {
                "code": c,
                "label": pe.label_en,
                "count": 0,
                "total_min": 0.0,
            }
        pareto_dict[c]["count"] += 1
        dur = 0.0
        if pe.raised_at:
            res_time = pe.resolved_at or datetime.datetime.utcnow()
            dur = max(0.0, (res_time - pe.raised_at).total_seconds() / 60.0)
        pareto_dict[c]["total_min"] += dur

    total_stops = sum(p["count"] for p in pareto_dict.values()) or 1
    reason_pareto: list[ReasonParetoRow] = [
        ReasonParetoRow(
            reason_code=p["code"],
            reason_label_en=p["label"],
            count=p["count"],
            total_minutes=round(Decimal(str(p["total_min"])), 1),
            pct_of_loom_downtime=round(Decimal(str(p["count"] * 100 / total_stops)), 1),
            vs_plant_pct=None,
        )
        for p in sorted(pareto_dict.values(), key=lambda x: x["count"], reverse=True)
    ]

    break_row = session.execute(
        select(
            func.sum(ProductionLog.warp_breaks).label("warp"),
            func.sum(ProductionLog.weft_breaks).label("weft"),
            func.sum(ProductionLog.actual_picks).label("picks"),
        )
        .where(
            ProductionLog.loom_id == loom_id,
            ProductionLog.work_date >= window_start,
            ProductionLog.is_current == True,
        )
    ).one()
    picks_k = float(break_row.picks or 0) / 1000.0
    warp_per_1000 = round(Decimal(str((break_row.warp or 0) / picks_k)), 3) if picks_k else None
    weft_per_1000 = round(Decimal(str((break_row.weft or 0) / picks_k)), 3) if picks_k else None

    month_eff_rows = session.execute(
        select(
            func.sum(ProductionLog.actual_picks).label("picks"),
            func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
            func.sum(ProductionLog.scheduled_minutes).label("sched"),
            func.sum(ProductionLog.running_minutes).label("running"),
            func.sum(ProductionLog.metres).label("metres"),
        )
        .where(
            ProductionLog.loom_id == loom_id,
            ProductionLog.work_date >= window_start,
            ProductionLog.is_current == True,
        )
    ).one()

    loom_eff_month = loom_efficiency_pct(month_eff_rows.picks, month_eff_rows.avg_rpm, month_eff_rows.sched)
    perf_eff_month = performance_eff_pct(month_eff_rows.picks, month_eff_rows.avg_rpm, month_eff_rows.running)
    util_month = utilization_pct(month_eff_rows.running, month_eff_rows.sched)

    style_last = session.execute(
        select(Style.picks_per_metre)
        .join(ProductionLog, ProductionLog.style_id == Style.style_id)
        .where(ProductionLog.loom_id == loom_id, ProductionLog.is_current == True)
        .order_by(ProductionLog.work_date.desc())
        .limit(1)
    ).scalar_one_or_none()
    full_metres = (
        float(month_eff_rows.avg_rpm) * int(month_eff_rows.sched) / float(style_last)
        if (month_eff_rows.avg_rpm and month_eff_rows.sched and style_last)
        else None
    )
    actual_metres_month = float(month_eff_rows.metres or 0)
    metres_lost = (full_metres - actual_metres_month) if full_metres and full_metres > actual_metres_month else 0.0
    rupee_lost_month = _rupee_lost(Decimal(str(metres_lost)))

    weaver_rows = session.execute(
        select(
            Employee.employee_id,
            Employee.name,
            Employee.grade,
            func.count(ProductionLog.production_log_id).label("days_run"),
            func.sum(ProductionLog.actual_picks).label("picks"),
            func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
            func.sum(ProductionLog.scheduled_minutes).label("sched"),
        )
        .join(Employee, Employee.employee_id == ProductionLog.employee_id)
        .where(
            ProductionLog.loom_id == loom_id,
            ProductionLog.work_date >= window_start,
            ProductionLog.is_current == True,
        )
        .group_by(Employee.employee_id, Employee.name, Employee.grade)
        .order_by(func.count(ProductionLog.production_log_id).desc())
    ).all()

    weavers: list[WeaverRecord] = [
        WeaverRecord(
            employee_id=wr.employee_id,
            name=wr.name,
            grade=str(wr.grade) if wr.grade else None,
            days_run=wr.days_run,
            mean_eff=loom_efficiency_pct(wr.picks, wr.avg_rpm, wr.sched),
        )
        for wr in weaver_rows
    ]

    data_as_of = session.execute(
        select(func.max(ProductionLog.ingested_at))
        .where(ProductionLog.loom_id == loom_id, ProductionLog.is_current == True)
    ).scalar_one_or_none()

    return LoomDetailResponse(
        loom_id=loom.loom_id,
        loom_no=loom.loom_no,
        loom_type_code=loom.loom_type_code,
        shed_code=shed.code if shed else None,
        register_confirmed=loom.register_confirmed,
        trend=trend,
        stop_events=stop_events,
        reason_pareto=reason_pareto,
        warp_per_1000=warp_per_1000,
        weft_per_1000=weft_per_1000,
        cohort_warp_p90=None,
        cohort_weft_p90=None,
        weavers=weavers,
        rupee_lost_month=rupee_lost_month,
        diagnostic_sentence=_diagnostic_sentence(loom.loom_no, loom_eff_month, perf_eff_month, util_month),
        data_as_of=data_as_of,
        source_mix=["DEMO"],
    )
