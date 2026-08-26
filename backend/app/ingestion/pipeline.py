"""
Ingestion Pipeline orchestrating Parsing, Validation, and Repository Persistence.
"""
from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from app.ingestion.csv_parser import CSVParser
from app.models.quality_report import DatasetQualitySummary, PipelineQualityReport
from app.repositories.breakdown_repo import BreakdownRepository
from app.repositories.import_batch_repo import ImportBatchRepository
from app.repositories.machine_repo import MachineRepository
from app.repositories.production_repo import ProductionRepository
from app.repositories.revenue_repo import RevenueRepository
from app.validation.breakdown_validator import BreakdownValidator
from app.validation.machine_validator import MachineValidator
from app.validation.production_validator import ProductionValidator
from app.validation.revenue_validator import RevenueValidator


class IngestionPipeline:
    """
    Coordinates end-to-end ingestion:
    File -> Parser -> Validation -> Repository (DB) -> Quality Report
    """

    def __init__(self, session: Session):
        self.session = session
        self.parser = CSVParser()

        self.batch_repo = ImportBatchRepository(session)
        self.machine_repo = MachineRepository(session)
        self.production_repo = ProductionRepository(session)
        self.breakdown_repo = BreakdownRepository(session)
        self.revenue_repo = RevenueRepository(session)

    def run(
        self,
        machines_file: str | Path,
        production_file: str | Path,
        breakdown_file: str | Path,
        revenue_file: str | Path,
        source_type: str = "synthetic",
        is_demo: bool = True,
        dataset_label: str = "Demo / Synthetic Data — Not Live Factory Data",
        notes: str | None = "Ingestion pipeline run",
    ) -> PipelineQualityReport:
        now = datetime.now()

        # 1. Create ImportBatch record for provenance
        batch = self.batch_repo.create_batch(
            source_file=Path(production_file).name,
            source_type=source_type,
            is_demo=is_demo,
            dataset_label=dataset_label,
            notes=notes,
        )

        report = PipelineQualityReport(
            import_batch_id=batch.id,
            import_timestamp=now,
            is_demo=is_demo,
            dataset_label=dataset_label,
        )

        # 2. Ingest Machines
        machines_path = Path(machines_file)
        m_summary = DatasetQualitySummary(
            dataset_name="Machines Master",
            source_file=machines_path.name,
        )
        raw_machines = self.parser.parse(machines_path)
        m_summary.records_received = len(raw_machines)

        m_val = MachineValidator()
        valid_machines, rejected_machines = m_val.validate_batch(raw_machines, source_file=machines_path.name)
        m_summary.records_accepted = len(valid_machines)
        for rej in rejected_machines:
            m_summary.record_rejection(rej)

        self.machine_repo.upsert_batch(valid_machines)
        report.datasets["machines"] = m_summary

        # Retrieve registered machine sets for downstream FK validation
        known_machines = self.machine_repo.get_all_machine_ids()
        weaving_machines = self.machine_repo.get_weaving_machine_ids()

        # 3. Ingest Production Log
        prod_path = Path(production_file)
        p_summary = DatasetQualitySummary(
            dataset_name="Production Log",
            source_file=prod_path.name,
        )
        raw_production = self.parser.parse(prod_path)
        p_summary.records_received = len(raw_production)

        existing_keys = self.production_repo.get_existing_keys()
        p_val = ProductionValidator(known_machines=known_machines, existing_keys=existing_keys)
        valid_production, rejected_production = p_val.validate_batch(
            raw_production,
            source_file=prod_path.name,
            source_type=source_type,
            import_batch_id=batch.id,
        )
        for rej in rejected_production:
            p_summary.record_rejection(rej)

        p_inserted, p_skipped = self.production_repo.insert_batch(valid_production)
        p_summary.records_accepted = p_inserted
        p_summary.duplicates_count += p_skipped
        report.datasets["production"] = p_summary

        # 4. Ingest Breakdown Events
        bd_path = Path(breakdown_file)
        bd_summary = DatasetQualitySummary(
            dataset_name="Breakdown Events",
            source_file=bd_path.name,
        )
        raw_bd = self.parser.parse(bd_path)
        bd_summary.records_received = len(raw_bd)

        bd_val = BreakdownValidator(known_machines=known_machines)
        valid_bd, rejected_bd = bd_val.validate_batch(
            raw_bd,
            source_file=bd_path.name,
            source_type=source_type,
            import_batch_id=batch.id,
        )
        for rej in rejected_bd:
            bd_summary.record_rejection(rej)

        bd_inserted = self.breakdown_repo.insert_batch(valid_bd)
        bd_summary.records_accepted = bd_inserted
        report.datasets["breakdown"] = bd_summary

        # 5. Ingest Revenue Log
        rev_path = Path(revenue_file)
        rev_summary = DatasetQualitySummary(
            dataset_name="Revenue Log",
            source_file=rev_path.name,
        )
        raw_rev = self.parser.parse(rev_path)
        rev_summary.records_received = len(raw_rev)

        rev_val = RevenueValidator(known_machines=known_machines, weaving_machines=weaving_machines)
        valid_rev, rejected_rev = rev_val.validate_batch(
            raw_rev,
            source_file=rev_path.name,
            source_type="derived",
            import_batch_id=batch.id,
        )
        for rej in rejected_rev:
            rev_summary.record_rejection(rej)

        rev_inserted = self.revenue_repo.insert_batch(valid_rev)
        rev_summary.records_accepted = rev_inserted
        report.datasets["revenue"] = rev_summary

        # 6. Update Batch stats
        self.batch_repo.update_counts(
            batch_id=batch.id,
            prod_acc=p_summary.records_accepted,
            prod_rej=p_summary.records_rejected,
            bd_acc=bd_summary.records_accepted,
            bd_rej=bd_summary.records_rejected,
            rev_acc=rev_summary.records_accepted,
            rev_rej=rev_summary.records_rejected,
        )

        return report
