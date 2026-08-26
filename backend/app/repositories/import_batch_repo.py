"""
Repository for managing ImportBatch provenance metadata.
"""
from __future__ import annotations

from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from app.db_models import ImportBatch


class ImportBatchRepository:

    def __init__(self, session: Session):
        self.session = session

    def create_batch(
        self,
        source_file: str,
        source_type: str = "synthetic",
        is_demo: bool = True,
        dataset_label: str = "Synthetic Factory Data",
        notes: str | None = None,
        imported_by: str | None = "system",
    ) -> ImportBatch:
        batch = ImportBatch(
            source_file=source_file,
            source_type=source_type,
            is_demo=is_demo,
            dataset_label=dataset_label,
            notes=notes,
            imported_by=imported_by,
        )
        self.session.add(batch)
        self.session.flush()
        return batch

    def update_counts(
        self,
        batch_id: int,
        prod_acc: int = 0,
        prod_rej: int = 0,
        bd_acc: int = 0,
        bd_rej: int = 0,
        rev_acc: int = 0,
        rev_rej: int = 0,
    ) -> ImportBatch | None:
        batch = self.session.get(ImportBatch, batch_id)
        if batch:
            batch.production_accepted = prod_acc
            batch.production_rejected = prod_rej
            batch.breakdown_accepted = bd_acc
            batch.breakdown_rejected = bd_rej
            batch.revenue_accepted = rev_acc
            batch.revenue_rejected = rev_rej
            self.session.flush()
        return batch

    def get_latest_batch(self) -> ImportBatch | None:
        stmt = select(ImportBatch).order_by(desc(ImportBatch.id)).limit(1)
        return self.session.execute(stmt).scalar_one_or_none()
