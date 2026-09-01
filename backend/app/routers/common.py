"""
Router helper functions and query parameter parsers.
"""
from __future__ import annotations

import datetime
from fastapi import HTTPException, status


def parse_query_date(date_str: str | None) -> datetime.date | None:
    """
    Parses date query parameter. Raises HTTP 400 on malformed date string.
    """
    if not date_str:
        return None
    try:
        return datetime.datetime.strptime(date_str.strip(), "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "INVALID_DATE_FORMAT",
                "message": f"Invalid date '{date_str}'. Expected YYYY-MM-DD format (e.g. 2026-08-29).",
            },
        )
