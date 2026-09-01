"""
Loom AI v2 — /api/v2/exports router.

GET /api/v2/exports/daily-report-html  — Print-CSS HTML daily report
GET /api/v2/exports/whatsapp           — 6-line plain text
GET /api/v2/exports/operations-xlsx    — styled Excel table
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, Response
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from app.db_models import ProductionLog, Unit
from app.exports.daily_html import render_daily_report_html
from app.exports.whatsapp import build_whatsapp_text
from app.exports.xlsx import export_operations_to_xlsx
from app.routers.breakdown import breakdown_summary
from app.routers.deps import get_session, http_error
from app.routers.loom import list_looms
from app.routers.production import production_summary
from app.schemas import WhatsAppResponse

router = APIRouter()


@router.get("/daily-report-html", response_class=HTMLResponse)
def get_daily_report_html(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> HTMLResponse:
    prod_resp = production_summary(unit=unit, date=date, session=session)
    bkd_resp = breakdown_summary(unit=unit, date=date, session=session)

    shifts_dict = [s.model_dump() for s in prod_resp.shifts]
    day_total_dict = prod_resp.day_total.model_dump()
    issues_dict = [p.model_dump() for p in bkd_resp.reason_pareto[:5]]

    html = render_daily_report_html(
        date=date,
        unit_code=unit,
        shifts_summary=shifts_dict,
        day_total=day_total_dict,
        top_issues=issues_dict,
        data_as_of=prod_resp.data_as_of,
    )
    return HTMLResponse(content=html, status_code=200)


@router.get("/whatsapp", response_model=WhatsAppResponse)
def get_whatsapp_export(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> WhatsAppResponse:
    prod_resp = production_summary(unit=unit, date=date, session=session)
    bkd_resp = breakdown_summary(unit=unit, date=date, session=session)
    looms_resp = list_looms(unit=unit, date=date, sort="eff_desc", page=1, page_size=200, session=session)

    best_loom = looms_resp.looms[0] if looms_resp.looms else None
    worst_loom = looms_resp.looms[-1] if looms_resp.looms else None

    top_issue = bkd_resp.reason_pareto[0] if bkd_resp.reason_pareto else None
    top_issue_dur_str = f"{int(top_issue.total_minutes // 60)}h {int(top_issue.total_minutes % 60)}m" if top_issue else None

    text = build_whatsapp_text(
        date=date,
        unit_code=unit,
        actual_eff=prod_resp.day_total.actual_eff,
        target_eff=Decimal("93.0"),   # mill headline target
        rupee_lost=bkd_resp.total_rupee_lost.value,
        top_issue_label=top_issue.reason_label_en if top_issue else None,
        top_issue_duration_str=top_issue_dur_str,
        top_issue_pct=top_issue.pct_of_loom_downtime if top_issue else None,
        best_loom_no=best_loom.loom_no if best_loom else None,
        best_loom_eff=best_loom.loom_efficiency_pct if best_loom else None,
        worst_loom_no=worst_loom.loom_no if worst_loom else None,
        worst_loom_eff=worst_loom.loom_efficiency_pct if worst_loom else None,
    )

    return WhatsAppResponse(
        text=text,
        generated_at=datetime.datetime.now(datetime.timezone.utc),
        data_as_of=prod_resp.data_as_of,
    )


@router.get("/operations-xlsx")
def get_operations_xlsx(
    unit: str = Query("ATM"),
    date: datetime.date = Query(...),
    session: Session = Depends(get_session),
) -> Response:
    looms_resp = list_looms(unit=unit, date=date, sort="loom_no_asc", page=1, page_size=300, session=session)
    rows_data = [l.model_dump() for l in looms_resp.looms]
    xlsx_bytes = export_operations_to_xlsx(rows_data, title=f"ATM_{date}")

    return Response(
        content=xlsx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=ATM_Operations_{date}.xlsx"},
    )
