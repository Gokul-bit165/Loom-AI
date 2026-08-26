"""
app/validation/rules.py — Core utility parsing and validation functions.
"""
from __future__ import annotations

import datetime
from decimal import Decimal, InvalidOperation
from typing import Any


def parse_date(value: Any) -> datetime.date | None:
    if value is None:
        return None
    val_str = str(value).strip()
    if not val_str:
        return None
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%Y/%m/%d"):
        try:
            return datetime.datetime.strptime(val_str, fmt).date()
        except ValueError:
            continue
    return None


def parse_int(value: Any) -> int | None:
    if value is None:
        return None
    val_str = str(value).strip()
    if not val_str:
        return None
    try:
        # Handle float strings like "1.0"
        return int(float(val_str))
    except (ValueError, TypeError):
        return None


def parse_decimal(value: Any) -> Decimal | None:
    if value is None:
        return None
    val_str = str(value).strip()
    if not val_str:
        return None
    try:
        return Decimal(val_str)
    except (InvalidOperation, TypeError, ValueError):
        return None


def is_blank(value: Any) -> bool:
    if value is None:
        return True
    val_str = str(value).strip()
    return val_str == "" or val_str.lower() in ("nan", "none", "null", "n/a")
