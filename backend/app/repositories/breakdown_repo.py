"""
Repository for BreakdownEvent entries.
"""
from __future__ import annotations

from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.db_models import BreakdownEvent
from app.models.breakdown import BreakdownRecord


class BreakdownRepository:

    def __init__(self, session: Session):
        self.session = session

    def insert_batch(self, records: list[BreakdownRecord], batch_size: int = 500) -> int:
        if not records:
            return 0

        rows = [
            {
                "date": r.date,
                "shift": r.shift,
                "machine_id": r.machine_id,
                "reason": r.reason,
                "duration_minutes": r.duration_minutes,
                "source_type": r.source_type,
                "import_batch_id": r.import_batch_id,
            }
            for r in records
        ]

        inserted = 0
        for i in range(0, len(rows), batch_size):
            chunk = rows[i : i + batch_size]
            stmt = pg_insert(BreakdownEvent).values(chunk)
            self.session.execute(stmt)
            inserted += len(chunk)

        self.session.flush()
        return inserted
