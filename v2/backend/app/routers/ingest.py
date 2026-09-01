"""
Loom AI v2 — /api/v2/ingest router.

POST /api/v2/ingest/preview  — parse + validate, return diff (no DB write)
POST /api/v2/ingest/commit   — commit the validated batch using lossless supersede
DELETE /api/v2/ingest/batches/{id} — lossless rollback
"""
from __future__ import annotations

import datetime

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db_models import ImportBatch, Unit
from app.ingest.commit import commit_batch, rollback_batch
from app.ingest.parser import HeaderMappingError, parse_wide_prep_sheet, parse_long_loom_sheet
from app.ingest.registry import get_template
from app.ingest.validator import validate_rows
from app.routers.deps import get_session, http_error
from app.schemas import CommitResponse, PreviewResponse, PreviewRowInsert, PreviewRowReject

router = APIRouter()


def _parse_by_template(file_bytes: bytes, filename: str, template_code: str, work_date: datetime.date):
    if template_code == "MILL_DAILY_PREP_WIDE":
        return parse_wide_prep_sheet(file_bytes, work_date)
    is_csv = filename.endswith(".csv")
    return parse_long_loom_sheet(file_bytes, work_date, is_csv=is_csv)


@router.post("/preview", response_model=PreviewResponse)
async def ingest_preview(
    file: UploadFile = File(...),
    template_code: str = Form("MILL_DAILY_PREP_WIDE"),
    unit: str = Form("ATM"),
    work_date: datetime.date = Form(...),
    session: Session = Depends(get_session),
) -> PreviewResponse:
    try:
        tmpl = get_template(template_code)
    except KeyError as e:
        http_error(400, "UNKNOWN_TEMPLATE", str(e))

    file_bytes = await file.read()
    filename = file.filename or ""

    try:
        raw_rows = _parse_by_template(file_bytes, filename, template_code, work_date)
    except HeaderMappingError as e:
        http_error(422, "HEADER_MAPPING_ERROR", str(e))
    except Exception as e:
        http_error(422, "PARSE_ERROR", f"Could not parse sheet: {e}")

    unit_row = session.execute(select(Unit).where(Unit.code == unit)).scalar_one_or_none()
    if unit_row is None:
        http_error(404, "UNIT_NOT_FOUND", f"Unit '{unit}' not found.")

    valid_rows, rejected_rows = validate_rows(raw_rows, unit, template_code, session)

    to_insert = [
        PreviewRowInsert(
            loom_no=vr.loom_no or f"DEPT-SHIFT-{vr.shift_code}",
            shift_code=vr.shift_code,
            metres=vr.actual_metres,
            running_minutes=vr.running_minutes,
            warp_breaks=vr.warp_breaks,
            weft_breaks=vr.weft_breaks,
        )
        for vr in valid_rows if not vr.is_duplicate
    ]
    to_update = [
        PreviewRowInsert(
            loom_no=vr.loom_no or f"DEPT-SHIFT-{vr.shift_code}",
            shift_code=vr.shift_code,
            metres=vr.actual_metres,
            running_minutes=vr.running_minutes,
            warp_breaks=vr.warp_breaks,
            weft_breaks=vr.weft_breaks,
        )
        for vr in valid_rows if vr.is_duplicate
    ]
    to_reject = [
        PreviewRowReject(
            row_index=rr.row_index,
            raw_data=rr.raw_data,
            error_code=rr.error_code,
            error_detail=rr.error_detail,
        )
        for rr in rejected_rows
    ]

    summary = f"{len(to_insert)} to insert, {len(to_update)} to update (supersede), {len(to_reject)} rejected"

    return PreviewResponse(
        template_code=template_code,
        work_date=work_date,
        to_insert=to_insert,
        to_update=to_update,
        to_reject=to_reject,
        summary=summary,
    )


@router.post("/commit", response_model=CommitResponse)
async def ingest_commit(
    file: UploadFile = File(...),
    template_code: str = Form("MILL_DAILY_PREP_WIDE"),
    unit: str = Form("ATM"),
    work_date: datetime.date = Form(...),
    uploaded_by: str = Form("clerk"),
    session: Session = Depends(get_session),
) -> CommitResponse:
    try:
        tmpl = get_template(template_code)
    except KeyError as e:
        http_error(400, "UNKNOWN_TEMPLATE", str(e))

    file_bytes = await file.read()
    filename = file.filename or ""

    try:
        raw_rows = _parse_by_template(file_bytes, filename, template_code, work_date)
    except Exception as e:
        http_error(422, "PARSE_ERROR", f"Could not parse sheet: {e}")

    unit_row = session.execute(select(Unit).where(Unit.code == unit)).scalar_one_or_none()
    if unit_row is None:
        http_error(404, "UNIT_NOT_FOUND", f"Unit '{unit}' not found.")

    valid_rows, rejected_rows = validate_rows(raw_rows, unit, template_code, session)

    if rejected_rows and not valid_rows:
        http_error(422, "ALL_ROWS_REJECTED", f"All {len(rejected_rows)} rows rejected.")

    batch = commit_batch(valid_rows, unit_row.unit_id, work_date, template_code, uploaded_by, session)
    session.commit()

    return CommitResponse(
        import_batch_id=batch.import_batch_id,
        accepted=len(valid_rows),
        rejected=len(rejected_rows),
        status="COMMITTED",
    )


@router.delete("/batches/{batch_id}", response_model=CommitResponse)
def rollback_batch_endpoint(
    batch_id: int,
    session: Session = Depends(get_session),
) -> CommitResponse:
    batch = session.get(ImportBatch, batch_id)
    if batch is None:
        http_error(404, "BATCH_NOT_FOUND", f"Import batch {batch_id} does not exist.")
    if batch.status == "ROLLED_BACK":
        http_error(409, "ALREADY_ROLLED_BACK", f"Batch {batch_id} was already rolled back.")

    deleted = rollback_batch(batch_id, session)
    session.commit()

    return CommitResponse(
        import_batch_id=batch_id,
        accepted=0,
        rejected=deleted,
        status="ROLLED_BACK",
    )
