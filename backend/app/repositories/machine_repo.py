"""
Repository for Machine master data.
"""
from __future__ import annotations

from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.db_models import Machine
from app.models.machine import MachineRecord


class MachineRepository:

    def __init__(self, session: Session):
        self.session = session

    def get_all_machine_ids(self) -> set[str]:
        stmt = select(Machine.machine_id)
        results = self.session.execute(stmt).scalars().all()
        return set(results)

    def get_weaving_machine_ids(self) -> set[str]:
        stmt = select(Machine.machine_id).where(Machine.department == "Weaving")
        results = self.session.execute(stmt).scalars().all()
        return set(results)

    def get_by_id(self, machine_id: str) -> Machine | None:
        return self.session.get(Machine, machine_id)

    def get_all(self) -> list[Machine]:
        stmt = select(Machine).order_by(Machine.department, Machine.machine_id)
        return list(self.session.execute(stmt).scalars().all())

    def upsert_batch(self, records: list[MachineRecord]) -> int:
        if not records:
            return 0
        rows = [
            {
                "machine_id": r.machine_id,
                "unit": r.unit,
                "department": r.department,
                "machine_type": r.machine_type,
                "granularity": r.granularity,
                "source_type": r.source_type,
                "active": r.active,
            }
            for r in records
        ]
        stmt = pg_insert(Machine).values(rows).on_conflict_do_nothing(index_elements=["machine_id"])
        result = self.session.execute(stmt)
        self.session.flush()
        return result.rowcount
