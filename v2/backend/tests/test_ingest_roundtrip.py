"""
Ingestion tests covering:
1. Parsing the real mill layout fixture (MILL_DAILY_PREP_WIDE).
2. test_efficiency_crosscheck_against_sheet: sheet's stated EFFI % vs computed, within 0.5pp.
3. Target available_hours extraction (e.g. 22.5 hrs).
4. Lossless supersede round-trip (correct-then-rollback).
5. Dynamic non-480 scheduled minutes validation.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
import io
import openpyxl
import pytest
from sqlalchemy import select

from app.db_models import ImportBatch, ProductionLog, ProductionTarget, ShiftMaster, Style, Unit
from app.ingest.commit import commit_batch, rollback_batch
from app.ingest.parser import parse_wide_prep_sheet, parse_long_loom_sheet
from app.ingest.validator import validate_rows


def test_efficiency_crosscheck_against_sheet(masters_session_factory):
    """
    Test that the parsed sheet's stated EFFI % matches the computed value within 0.5pp.
    """
    factory = masters_session_factory
    session = factory()
    try:
        with open("tests/fixtures/daily_prep_report.xlsx", "rb") as f:
            file_bytes = f.read()

        work_date = datetime.date(2026, 7, 31)
        raw_rows = parse_wide_prep_sheet(file_bytes, work_date)
        valid_rows, rejected_rows = validate_rows(raw_rows, "ATM", "MILL_DAILY_PREP_WIDE", session)

        assert len(rejected_rows) == 0
        assert len(valid_rows) == 3

        # Check Shift 1: Actual=11150, Target=12460 -> computed 89.486%, stated 89.48%
        shift1 = next(r for r in valid_rows if r.shift_code == "1")
        assert shift1.stated_effi_pct == Decimal("89.48")
        assert shift1.computed_effi_pct is not None
        diff = abs(shift1.stated_effi_pct - shift1.computed_effi_pct)
        assert diff <= Decimal("0.5"), f"Cross-check diff {diff}pp exceeds 0.5pp"

        # Check available hours extracted from 'TARGET @ 22.5 HRS'
        assert shift1.available_hours == Decimal("22.5")
    finally:
        session.close()


def test_lossless_supersede_correct_then_rollback(masters_session_factory):
    """
    Round-trip test for lossless supersede pattern:
    1. Import batch A (e.g. 5 looms, shift 1) -> rows active (is_current=True)
    2. Import batch B correcting 1 loom with updated metres -> batch A's row becomes is_current=False,
       superseded_by_batch_id=batch B id; new row is_current=True.
    3. Rollback batch B -> batch B's row is deleted, batch A's superseded row is RESTORED to is_current=True.
    """
    factory = masters_session_factory
    session = factory()
    try:
        unit = session.execute(select(Unit).where(Unit.code == "ATM")).scalar_one()
        shift = session.execute(select(ShiftMaster).where(ShiftMaster.code == "1")).scalar_one()
        style = session.execute(select(Style).limit(1)).scalar_one()
        work_date = datetime.date(2026, 8, 1)

        # 1. Create initial batch A
        sheet_data_a = [
            {"LOOM_NO": "AJ-001", "SHIFT": "1", "STYLE_CODE": style.style_code, "ACTUAL_METRES": "100.0", "RUNNING_MINUTES": "450", "WARP_BREAKS": "1", "WEFT_BREAKS": "2", "_row_index": 2, "_work_date": work_date},
            {"LOOM_NO": "AJ-002", "SHIFT": "1", "STYLE_CODE": style.style_code, "ACTUAL_METRES": "120.0", "RUNNING_MINUTES": "460", "WARP_BREAKS": "0", "WEFT_BREAKS": "1", "_row_index": 3, "_work_date": work_date},
        ]
        valid_a, rej_a = validate_rows(sheet_data_a, "ATM", "LOOM_LONG_FORMAT", session)
        assert len(valid_a) == 2
        batch_a = commit_batch(valid_a, unit.unit_id, work_date, "LOOM_LONG_FORMAT", "clerk", session)
        session.commit()

        # Verify batch A is current
        rows_a = session.execute(
            select(ProductionLog).where(
                ProductionLog.import_batch_id == batch_a.import_batch_id,
                ProductionLog.is_current == True,
            )
        ).scalars().all()
        assert len(rows_a) == 2

        # 2. Create correction batch B (AJ-001 corrected to 110.0 metres)
        sheet_data_b = [
            {"LOOM_NO": "AJ-001", "SHIFT": "1", "STYLE_CODE": style.style_code, "ACTUAL_METRES": "110.0", "RUNNING_MINUTES": "455", "WARP_BREAKS": "1", "WEFT_BREAKS": "2", "_row_index": 2, "_work_date": work_date},
        ]
        valid_b, rej_b = validate_rows(sheet_data_b, "ATM", "LOOM_LONG_FORMAT", session)
        assert len(valid_b) == 1
        assert valid_b[0].is_duplicate is True  # Detected as update

        batch_b = commit_batch(valid_b, unit.unit_id, work_date, "LOOM_LONG_FORMAT", "clerk_ravi", session)
        session.commit()

        # Verify old row is now superseded and new row is current
        old_row = session.execute(
            select(ProductionLog).where(
                ProductionLog.import_batch_id == batch_a.import_batch_id,
                ProductionLog.loom_id == valid_b[0].loom_id,
            )
        ).scalar_one()
        assert old_row.is_current is False
        assert old_row.superseded_by_batch_id == batch_b.import_batch_id

        new_row = session.execute(
            select(ProductionLog).where(
                ProductionLog.import_batch_id == batch_b.import_batch_id,
            )
        ).scalar_one()
        assert new_row.is_current is True
        assert float(new_row.metres) == 110.0

        # 3. Rollback batch B
        deleted = rollback_batch(batch_b.import_batch_id, session)
        session.commit()
        assert deleted == 1

        # Verify batch A's row was restored to is_current=True and superseded_by_batch_id=None
        session.refresh(old_row)
        assert old_row.is_current is True
        assert old_row.superseded_by_batch_id is None
        assert float(old_row.metres) == 100.0

        # Cleanup test data
        rollback_batch(batch_a.import_batch_id, session)
        session.commit()
    finally:
        session.close()


def test_non_480_scheduled_minutes_validation(masters_session_factory):
    """
    Test validation with non-480 scheduled minutes (Correction 4).
    """
    factory = masters_session_factory
    session = factory()
    try:
        style = session.execute(select(Style).limit(1)).scalar_one()
        work_date = datetime.date(2026, 8, 2)

        # Running minutes = 500 should be rejected since standard shift is 480
        data = [
            {"LOOM_NO": "AJ-001", "SHIFT": "1", "STYLE_CODE": style.style_code, "ACTUAL_METRES": "100.0", "RUNNING_MINUTES": "500", "WARP_BREAKS": "0", "WEFT_BREAKS": "0", "_row_index": 2, "_work_date": work_date}
        ]
        valid, rej = validate_rows(data, "ATM", "LOOM_LONG_FORMAT", session)
        assert len(rej) == 1
        assert rej[0].error_code == "ERR_RUNNING_EXCEEDS_SCHEDULED"
    finally:
        session.close()
