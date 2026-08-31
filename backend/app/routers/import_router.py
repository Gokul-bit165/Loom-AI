"""
Loom AI — Import & Template Download Endpoints.
"""
from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, Query, Response, UploadFile, status
from fastapi.responses import JSONResponse

from app.services.import_service import (
    generate_template_bytes,
    process_uploaded_shift_file,
)

import_router = APIRouter(prefix="/api/import", tags=["Data Import & Templates"])


@import_router.get("/template", summary="Download Shift 1,2,3 Production Data Template (Excel or CSV)")
def download_template(
    format: str = Query("xlsx", pattern="^(xlsx|csv|excel)$", description="Format: xlsx (default) or csv"),
    date: Optional[str] = Query(None, description="Target date in YYYY-MM-DD format (defaults to today)"),
):
    """
    Downloads a pre-formatted Excel (.xlsx) or CSV template with 3 rows per machine (Shift 1, 2, 3)
    ready for entering factory floor numbers and uploading.
    """
    try:
        content_bytes, media_type, filename = generate_template_bytes(format_type=format, target_date=date)
        return Response(
            content=content_bytes,
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not generate template: {str(e)}",
        )


@import_router.post("/upload", summary="Upload Excel (.xlsx) or CSV Shift Production Data")
async def upload_shift_data(
    file: UploadFile = File(..., description="Excel (.xlsx) or CSV file with Shift 1, 2, 3 data"),
    user_name: str = Form("owner", description="Name of the user uploading the file"),
):
    """
    Ingests daily shift data across Shift 1, 2, and 3 from an uploaded Excel or CSV file.
    Updates production logs, breakdown events, and revenue logs.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload.",
        )

    ext = file.filename.lower().split(".")[-1]
    if ext not in ["xlsx", "xls", "csv"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload an Excel (.xlsx) or CSV (.csv) file.",
        )

    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        result = process_uploaded_shift_file(
            file_bytes=file_bytes,
            filename=file.filename,
            user_name=user_name,
        )
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process file: {str(e)}",
        )
