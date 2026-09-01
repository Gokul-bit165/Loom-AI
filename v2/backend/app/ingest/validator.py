"""
Loom AI v2 — Ingest validator.

Enforces:
1. Shift scheduled minutes validated against `shift_master.scheduled_minutes` (never hardcoded 480).
2. Available hours captured in `production_target.available_hours`.
3. Mathematical cross-check: Stated EFFI % in source sheet vs computed efficiency
   (asserts agreement within ±0.5pp; produces a validation warning if mismatch).
4. Errors (ERR_*) block the row from commit; warnings (WARN_*) pass through to preview.
"""
from __future__ import annotations

import datetime
from dataclasses import dataclass, field
from decimal import Decimal, InvalidOperation
from typing import Any, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db_models import Loom, ProductionLog, ShiftMaster, Style, Unit, ProductionTarget


@dataclass
class ValidRow:
    row_index: int
    loom_id: Optional[int]
    loom_no: Optional[str]
    shift_id: int
    shift_code: str
    style_id: Optional[int]
    style_code: Optional[str]
    actual_metres: Decimal
    running_minutes: int
    scheduled_minutes: int
    warp_breaks: int = 0
    weft_breaks: int = 0
    target_metres: Optional[Decimal] = None
    stated_effi_pct: Optional[Decimal] = None
    computed_effi_pct: Optional[Decimal] = None
    available_hours: Optional[Decimal] = None
    weaver_name: Optional[str] = None
    remarks: Optional[str] = None
    work_date: datetime.date = datetime.date.today()
    is_duplicate: bool = False
    warnings: list[str] = field(default_factory=list)


@dataclass
class RejectedRow:
    row_index: int
    raw_data: dict
    error_code: str
    error_detail: str


def _to_decimal(v: Any) -> Optional[Decimal]:
    if v is None or str(v).strip() == "":
        return None
    try:
        return Decimal(str(v).strip())
    except InvalidOperation:
        return None


def _to_int(v: Any) -> Optional[int]:
    d = _to_decimal(v)
    return int(d) if d is not None else None


def validate_rows(
    raw_rows: list[dict],
    unit_code: str,
    template_code: str,
    session: Session,
) -> tuple[list[ValidRow], list[RejectedRow]]:
    """
    Validates parsed rows according to template structure and database master data.
    """
    unit = session.execute(select(Unit).where(Unit.code == unit_code)).scalar_one_or_none()
    if unit is None:
        raise ValueError(f"Unit '{unit_code}' not found in database.")

    # Pre-fetch lookup caches
    shifts = {
        sm.code: sm
        for sm in session.execute(select(ShiftMaster)).scalars().all()
    }
    
    valid: list[ValidRow] = []
    rejected: list[RejectedRow] = []

    if template_code == "MILL_DAILY_PREP_WIDE":
        # Department/shift level wide report validation
        for row in raw_rows:
            idx = row.get("_row_index", 0)
            work_date = row.get("_work_date")
            raw_display = {k: v for k, v in row.items() if not k.startswith("_")}

            def reject(code: str, detail: str):
                rejected.append(RejectedRow(idx, raw_display, code, detail))

            shift_code = str(row.get("SHIFT") or "").strip()
            if shift_code not in shifts:
                reject("ERR_UNKNOWN_SHIFT", f"Shift '{shift_code}' not found in shift_master.")
                continue
            sm = shifts[shift_code]

            actual_val = _to_decimal(row.get("ACTUAL_PRODUCTION"))
            if actual_val is None or actual_val < 0:
                reject("ERR_INVALID_ACTUAL", f"Actual production '{actual_val}' is invalid or missing.")
                continue

            target_val = _to_decimal(row.get("TARGET_PRODUCTION"))
            sched_val = _to_decimal(row.get("SCHEDULED_PRODUCTION"))
            stated_eff = _to_decimal(row.get("STATED_EFFI_PCT"))
            avail_hrs = _to_decimal(row.get("AVAILABLE_HOURS")) or Decimal("22.5")
            remarks = row.get("REMARKS")

            warnings: list[str] = []

            # Cross-check stated EFFI % vs computed (Actual / Target or Actual / Sched)
            computed_eff: Optional[Decimal] = None
            if target_val and target_val > 0:
                computed_eff = round((actual_val / target_val) * 100, 2)
            elif sched_val and sched_val > 0:
                computed_eff = round((actual_val / sched_val) * 100, 2)

            if stated_eff is not None and computed_eff is not None:
                diff = abs(stated_eff - computed_eff)
                if diff > Decimal("0.5"):
                    warnings.append(
                        f"WARN_EFFI_CROSSCHECK_MISMATCH: Sheet states {stated_eff}%, "
                        f"computed value is {computed_eff}% (diff: {diff}pp > 0.5pp)"
                    )

            # Check if department targets already exist for this date & shift
            is_dup = session.execute(
                select(ProductionTarget.target_id).where(
                    ProductionTarget.unit_id == unit.unit_id,
                    ProductionTarget.work_date == work_date,
                    ProductionTarget.shift_id == sm.shift_id,
                    ProductionTarget.loom_id.is_(None),
                )
            ).scalar_one_or_none() is not None

            if is_dup:
                warnings.append("WARN_DUPLICATE: Target/production record will be updated.")

            valid.append(ValidRow(
                row_index=idx,
                loom_id=None,
                loom_no=None,
                shift_id=sm.shift_id,
                shift_code=shift_code,
                style_id=None,
                style_code=None,
                actual_metres=actual_val,
                running_minutes=sm.scheduled_minutes,
                scheduled_minutes=sm.scheduled_minutes,
                target_metres=target_val,
                stated_effi_pct=stated_eff,
                computed_effi_pct=computed_eff,
                available_hours=avail_hrs,
                remarks=remarks,
                work_date=work_date,
                is_duplicate=is_dup,
                warnings=warnings,
            ))

    else:
        # Per-loom long layout
        loom_map = {
            l.loom_no: l.loom_id
            for l in session.execute(select(Loom).where(Loom.unit_id == unit.unit_id, Loom.active == True)).scalars().all()
        }
        styles = {
            s.style_code: s
            for s in session.execute(select(Style)).scalars().all()
        }

        for row in raw_rows:
            idx = row.get("_row_index", 0)
            work_date = row.get("_work_date")
            raw_display = {k: v for k, v in row.items() if not k.startswith("_")}

            def reject(code: str, detail: str):
                rejected.append(RejectedRow(idx, raw_display, code, detail))

            loom_no = str(row.get("LOOM_NO") or "").strip()
            if not loom_no or loom_no not in loom_map:
                reject("ERR_UNKNOWN_LOOM", f"Loom '{loom_no}' not in ATM loom register.")
                continue
            loom_id = loom_map[loom_no]

            shift_code = str(row.get("SHIFT") or "").strip()
            if shift_code not in shifts:
                reject("ERR_UNKNOWN_SHIFT", f"Shift '{shift_code}' invalid.")
                continue
            sm = shifts[shift_code]

            style_code = str(row.get("STYLE_CODE") or "").strip()
            if not style_code or style_code not in styles:
                reject("ERR_UNKNOWN_STYLE", f"Style '{style_code}' invalid.")
                continue
            style_obj = styles[style_code]

            actual_metres = _to_decimal(row.get("ACTUAL_METRES"))
            if actual_metres is None or actual_metres < 0:
                reject("ERR_INVALID_METRES", "Actual metres missing or negative.")
                continue

            running_min = _to_int(row.get("RUNNING_MINUTES"))
            if running_min is None or running_min < 0:
                reject("ERR_INVALID_RUNNING_MINUTES", "Running minutes missing or negative.")
                continue
            # Validate against actual shift scheduled minutes (Correction 4)
            if running_min > sm.scheduled_minutes:
                reject(
                    "ERR_RUNNING_EXCEEDS_SCHEDULED",
                    f"Running minutes ({running_min}) exceeds shift scheduled minutes ({sm.scheduled_minutes})."
                )
                continue

            warp_breaks = _to_int(row.get("WARP_BREAKS")) or 0
            weft_breaks = _to_int(row.get("WEFT_BREAKS")) or 0
            if warp_breaks < 0 or weft_breaks < 0:
                reject("ERR_NEGATIVE_BREAKS", "Breaks cannot be negative.")
                continue

            warnings: list[str] = []
            is_dup = session.execute(
                select(ProductionLog.production_log_id).where(
                    ProductionLog.loom_id == loom_id,
                    ProductionLog.work_date == work_date,
                    ProductionLog.shift_id == sm.shift_id,
                    ProductionLog.is_current == True,
                )
            ).scalar_one_or_none() is not None
            if is_dup:
                warnings.append("WARN_DUPLICATE: Existing record will be superseded on commit.")

            valid.append(ValidRow(
                row_index=idx,
                loom_id=loom_id,
                loom_no=loom_no,
                shift_id=sm.shift_id,
                shift_code=shift_code,
                style_id=style_obj.style_id,
                style_code=style_code,
                actual_metres=actual_metres,
                running_minutes=running_min,
                scheduled_minutes=sm.scheduled_minutes,
                warp_breaks=warp_breaks,
                weft_breaks=weft_breaks,
                target_metres=_to_decimal(row.get("TARGET_METRES")),
                weaver_name=str(row.get("WEAVER_NAME") or "").strip() or None,
                remarks=str(row.get("REMARKS") or "").strip() or None,
                work_date=work_date,
                is_duplicate=is_dup,
                warnings=warnings,
            ))

    return valid, rejected
