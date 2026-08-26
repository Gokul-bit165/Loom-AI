"""
Tests for Ingestion Pipeline and Data Quality Reports.
"""
from pathlib import Path
import pytest
from sqlalchemy.orm import Session

from app.ingestion.pipeline import IngestionPipeline
from app.db_models import Machine, ProductionLog, BreakdownEvent, RevenueLog, ImportBatch


def test_pipeline_ingests_valid_data_and_produces_report(db_session: Session, tmp_path: Path):
    # Setup test CSVs
    machines_csv = tmp_path / "machines.csv"
    machines_csv.write_text(
        "machine_id,unit,department,machine_type,granularity\n"
        "TOY-01,Unit I,Weaving,Toyota,synthetic_loom_number\n"
        "RF-01,Unit I,Spinning,RingFrame,real_grounded\n",
        encoding="utf-8",
    )

    prod_csv = tmp_path / "prod.csv"
    prod_csv.write_text(
        "date,shift,machine_id,target_qty,actual_qty,efficiency_pct\n"
        "2026-08-14,1,TOY-01,21700,20500,94.47\n"
        "2026-08-14,1,RF-01,2500,2400,96.00\n",
        encoding="utf-8",
    )

    bd_csv = tmp_path / "bd.csv"
    bd_csv.write_text(
        "date,shift,machine_id,reason,duration_minutes\n"
        "2026-08-14,1,TOY-01,Loom runout,30\n",
        encoding="utf-8",
    )

    rev_csv = tmp_path / "rev.csv"
    rev_csv.write_text(
        "date,shift,machine_id,fabric_style,revenue\n"
        "2026-08-14,1,TOY-01,Excel Slub,4500.00\n",
        encoding="utf-8",
    )

    pipeline = IngestionPipeline(db_session)
    report = pipeline.run(
        machines_file=machines_csv,
        production_file=prod_csv,
        breakdown_file=bd_csv,
        revenue_file=rev_csv,
        source_type="synthetic",
        is_demo=True,
        dataset_label="Test Dataset",
    )

    assert report.import_batch_id is not None
    assert report.is_demo is True
    assert report.datasets["machines"].records_accepted == 2
    assert report.datasets["production"].records_accepted == 2
    assert report.datasets["breakdown"].records_accepted == 1
    assert report.datasets["revenue"].records_accepted == 1
    assert report.total_rejected == 0

    # Verify provenance in DB
    batch = db_session.get(ImportBatch, report.import_batch_id)
    assert batch is not None
    assert batch.production_accepted == 2
    assert batch.is_demo is True


def test_pipeline_catches_and_reports_malformed_rows(db_session: Session, tmp_path: Path):
    machines_csv = tmp_path / "machines.csv"
    machines_csv.write_text(
        "machine_id,unit,department,machine_type,granularity\n"
        "TOY-01,Unit I,Weaving,Toyota,synthetic_loom_number\n",
        encoding="utf-8",
    )

    # Malformed production CSV with:
    # 1. Valid row
    # 2. Unknown machine
    # 3. Missing date
    # 4. Duplicate row
    # 5. Invalid efficiency
    prod_csv = tmp_path / "prod_bad.csv"
    prod_csv.write_text(
        "date,shift,machine_id,target_qty,actual_qty,efficiency_pct\n"
        "2026-08-14,1,TOY-01,21700,20500,94.47\n"
        "2026-08-14,1,GHOST-99,21700,20500,94.47\n"
        ",1,TOY-01,21700,20500,94.47\n"
        "2026-08-14,1,TOY-01,21700,20500,94.47\n"
        "2026-08-14,2,TOY-01,21700,20500,150.00\n",
        encoding="utf-8",
    )

    bd_csv = tmp_path / "bd_bad.csv"
    bd_csv.write_text(
        "date,shift,machine_id,reason,duration_minutes\n"
        "2026-08-14,1,TOY-01,,30\n",  # missing reason
        encoding="utf-8",
    )

    rev_csv = tmp_path / "rev_bad.csv"
    rev_csv.write_text(
        "date,shift,machine_id,fabric_style,revenue\n"
        "2026-08-14,1,TOY-01,Excel Slub,-50\n",  # negative revenue
        encoding="utf-8",
    )

    pipeline = IngestionPipeline(db_session)
    report = pipeline.run(
        machines_file=machines_csv,
        production_file=prod_csv,
        breakdown_file=bd_csv,
        revenue_file=rev_csv,
        source_type="synthetic",
        is_demo=True,
    )

    p_summary = report.datasets["production"]
    assert p_summary.records_received == 5
    assert p_summary.records_accepted == 1
    assert p_summary.records_rejected == 4
    assert p_summary.unknown_machines_count == 1
    assert p_summary.missing_values_count == 1
    assert p_summary.duplicates_count == 1
    assert p_summary.invalid_values_count == 1

    assert report.datasets["breakdown"].records_rejected == 1
    assert report.datasets["revenue"].records_rejected == 1
