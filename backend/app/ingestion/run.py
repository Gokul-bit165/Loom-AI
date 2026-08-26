"""
Command line runner for Loom AI data ingestion and quality reporting.

Usage:
    cd backend
    python -m app.ingestion.run
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.config import settings
from app.database import get_session
from app.ingestion.pipeline import IngestionPipeline


def main() -> None:
    print("\nStarting Loom AI Data Ingestion Pipeline...")
    machines_csv = settings.csv_path(settings.csv_machines)
    production_csv = settings.csv_path(settings.csv_production)
    breakdown_csv = settings.csv_path(settings.csv_breakdown)
    revenue_csv = settings.csv_path(settings.csv_revenue)

    with get_session() as session:
        pipeline = IngestionPipeline(session)
        report = pipeline.run(
            machines_file=machines_csv,
            production_file=production_csv,
            breakdown_file=breakdown_csv,
            revenue_file=revenue_csv,
            source_type="synthetic",
            is_demo=True,
            dataset_label="Synthetic Grounded Factory V1",
            notes="CLI Ingestion Run",
        )

    # Print quality report
    print("\n" + report.format_full_report())


if __name__ == "__main__":
    main()
