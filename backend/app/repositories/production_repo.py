"""
Repository for ProductionLog entries.
"""
from __future__ import annotations

from typing import Any
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.db_models import ProductionLog
from app.models.production import ProductionRecord


class ProductionRepository:

    def __init__(self, session: Session):
        self.session = session

    def get_existing_keys(self) -> set[tuple[str, Any, int]]:
        stmt = select(ProductionLog.machine_id, ProductionLog.date, ProductionLog.shift)
        results = self.session.execute(stmt).all()
        return {(r[0], r[1], r[2]) for r in results}

    def insert_batch(self, records: list[ProductionRecord], batch_size: int = 500) -> tuple[int, int]:
        if not records:
            return 0, 0

        inserted = 0
        rows = [
            {
                "date": r.date,
                "shift": r.shift,
                "machine_id": r.machine_id,
                "target_qty": r.target_qty,
                "actual_qty": r.actual_qty,
                "efficiency_pct": r.efficiency_pct,
                "import_batch_id": r.import_batch_id,
            }
            for r in records
        ]

        for i in range(0, len(rows), batch_size):
            chunk = rows[i : i + batch_size]
            stmt = (
                pg_insert(ProductionLog)
                .values(chunk)
                .on_conflict_do_nothing(
                    index_elements=None,
                    constraint="uq_production_machine_date_shift",
                )
            )
            res = self.session.execute(stmt)
            inserted += res.rowcount

        self.session.flush()
        skipped = len(records) - inserted
        return inserted, skipped
