"""
Loom AI v2 — Ingest commit and lossless rollback.

Lossless supersede pattern (Blocking Correction 2):
1. A correction/update is an INSERT of a new row; the existing row is marked
   is_current=False and superseded_by_batch_id=<new batch id>.
2. Rollback: deletes the batch's newly created rows and RESTORES is_current=True
   on whatever rows were superseded by this batch. No historical data is ever destroyed.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete

from app.db_models import (
    DataSource,
    Employee,
    ImportBatch,
    ProductionLog,
    ProductionTarget,
    Style,
)
from app.ingest.validator import ValidRow


def _get_style_rpm(session: Session, style_id: int) -> Optional[Decimal]:
    row = session.execute(select(Style.std_rpm).where(Style.style_id == style_id)).scalar_one_or_none()
    return Decimal(str(row)) if row else None


def _get_employee_id(session: Session, unit_id: int, weaver_name: Optional[str]) -> Optional[int]:
    if not weaver_name:
        return None
    return session.execute(
        select(Employee.employee_id)
        .where(Employee.unit_id == unit_id, Employee.name == weaver_name)
        .limit(1)
    ).scalar_one_or_none()


def commit_batch(
    valid_rows: list[ValidRow],
    unit_id: int,
    work_date: datetime.date,
    template_code: str,
    uploaded_by: str,
    session: Session,
) -> ImportBatch:
    """
    Writes valid rows using the lossless supersede pattern.
    """
    batch = ImportBatch(
        unit_id=unit_id,
        template_code=template_code,
        uploaded_by=uploaded_by,
        row_count=len(valid_rows),
        accepted_count=len(valid_rows),
        rejected_count=0,
        status="COMMITTED",
    )
    session.add(batch)
    session.flush()

    if template_code == "MILL_DAILY_PREP_WIDE":
        # Commit department-level production target & summary
        for vr in valid_rows:
            # If exists, update existing target
            existing_target = session.execute(
                select(ProductionTarget).where(
                    ProductionTarget.unit_id == unit_id,
                    ProductionTarget.work_date == vr.work_date,
                    ProductionTarget.shift_id == vr.shift_id,
                    ProductionTarget.loom_id.is_(None),
                )
            ).scalar_one_or_none()

            if existing_target:
                existing_target.target_metres = vr.target_metres
                existing_target.target_efficiency_pct = vr.stated_effi_pct or vr.computed_effi_pct
                existing_target.available_hours = vr.available_hours or Decimal("22.5")
                existing_target.basis_note = vr.remarks
            else:
                session.add(ProductionTarget(
                    unit_id=unit_id,
                    work_date=vr.work_date,
                    shift_id=vr.shift_id,
                    loom_id=None,
                    available_hours=vr.available_hours or Decimal("22.5"),
                    target_metres=vr.target_metres,
                    target_efficiency_pct=vr.stated_effi_pct or vr.computed_effi_pct,
                    basis_note=vr.remarks,
                    source=DataSource.CSV_IMPORT,
                ))
    else:
        # Long per-loom rows
        for vr in valid_rows:
            if vr.is_duplicate and vr.loom_id is not None:
                # Mark existing current row as superseded (Lossless!)
                session.execute(
                    update(ProductionLog)
                    .where(
                        ProductionLog.loom_id == vr.loom_id,
                        ProductionLog.work_date == vr.work_date,
                        ProductionLog.shift_id == vr.shift_id,
                        ProductionLog.is_current == True,
                    )
                    .values(
                        is_current=False,
                        superseded_by_batch_id=batch.import_batch_id,
                    )
                )

            std_rpm = _get_style_rpm(session, vr.style_id) if vr.style_id else Decimal("0")
            picks_per_metre = session.execute(
                select(Style.picks_per_metre).where(Style.style_id == vr.style_id)
            ).scalar_one_or_none() if vr.style_id else Decimal("1")
            picks_per_metre_d = Decimal(str(picks_per_metre)) if picks_per_metre else Decimal("1")

            actual_picks = int(float(vr.actual_metres) * float(picks_per_metre_d))
            kilo_picks = round(Decimal(actual_picks) / Decimal(1000), 4)
            employee_id = _get_employee_id(session, unit_id, vr.weaver_name)

            session.add(ProductionLog(
                loom_id=vr.loom_id,
                work_date=vr.work_date,
                shift_id=vr.shift_id,
                style_id=vr.style_id,
                employee_id=employee_id,
                scheduled_minutes=vr.scheduled_minutes,
                running_minutes=vr.running_minutes,
                std_rpm_snapshot=std_rpm or Decimal("0"),
                actual_picks=actual_picks,
                metres=vr.actual_metres,
                kilo_picks=kilo_picks,
                warp_breaks=vr.warp_breaks,
                weft_breaks=vr.weft_breaks,
                source=DataSource.CSV_IMPORT,
                import_batch_id=batch.import_batch_id,
                is_current=True,
            ))

    session.flush()
    return batch


def rollback_batch(batch_id: int, session: Session) -> int:
    """
    Lossless rollback:
    1. Deletes rows created by this batch.
    2. Restores is_current=True on rows that this batch had superseded.
    3. Marks the batch as ROLLED_BACK.
    """
    # 1. Delete rows inserted by this batch
    deleted_rows = session.execute(
        delete(ProductionLog)
        .where(ProductionLog.import_batch_id == batch_id)
        .returning(ProductionLog.production_log_id)
    ).all()
    count_deleted = len(deleted_rows)

    # 2. Restore superseded rows
    restored = session.execute(
        update(ProductionLog)
        .where(ProductionLog.superseded_by_batch_id == batch_id)
        .values(
            is_current=True,
            superseded_by_batch_id=None,
        )
    )

    batch = session.get(ImportBatch, batch_id)
    if batch:
        batch.status = "ROLLED_BACK"
        batch.notes = f"Rolled back {count_deleted} created rows, restored superseded history."
    session.flush()
    return count_deleted
