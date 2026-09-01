"""
Data Quality Report models for tracking ingestion statistics and validation failures.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from app.models.common import RejectedRow, ValidationCategory


@dataclass
class DatasetQualitySummary:
    """
    Summary metrics for a single dataset (e.g. Production, Breakdown, Revenue, Machines).
    """
    dataset_name: str
    source_file: str
    records_received: int = 0
    records_accepted: int = 0
    records_rejected: int = 0
    duplicates_count: int = 0
    missing_values_count: int = 0
    invalid_values_count: int = 0
    unknown_machines_count: int = 0
    rejected_details: list[RejectedRow] = field(default_factory=list)

    def record_rejection(self, rejected: RejectedRow) -> None:
        self.records_rejected += 1
        self.rejected_details.append(rejected)
        if rejected.category == ValidationCategory.DUPLICATE:
            self.duplicates_count += 1
        elif rejected.category == ValidationCategory.MISSING_VALUE:
            self.missing_values_count += 1
        elif rejected.category == ValidationCategory.UNKNOWN_MACHINE:
            self.unknown_machines_count += 1
        elif rejected.category == ValidationCategory.INVALID_VALUE:
            self.invalid_values_count += 1

    def format_summary(self) -> str:
        lines = [
            f"--- {self.dataset_name} ({self.source_file}) ---",
            f"  Records received : {self.records_received:,}",
            f"  Records accepted : {self.records_accepted:,}",
            f"  Records rejected : {self.records_rejected:,}",
            f"  Duplicates       : {self.duplicates_count:,}",
            f"  Missing values   : {self.missing_values_count:,}",
            f"  Invalid values   : {self.invalid_values_count:,}",
            f"  Unknown machines : {self.unknown_machines_count:,}",
        ]
        if self.records_rejected > 0:
            lines.append("  Sample Rejection Details:")
            for rej in self.rejected_details[:5]:
                lines.append(f"    Line {rej.source_row} [{rej.category.value}]: {', '.join(rej.reasons)}")
            if len(self.rejected_details) > 5:
                lines.append(f"    ... and {len(self.rejected_details) - 5} more rejected rows.")
        return "\n".join(lines)


@dataclass
class PipelineQualityReport:
    """
    Complete report across all datasets ingested in a pipeline execution.
    """
    import_batch_id: int | None
    import_timestamp: datetime
    is_demo: bool
    dataset_label: str
    datasets: dict[str, DatasetQualitySummary] = field(default_factory=dict)

    @property
    def total_received(self) -> int:
        return sum(d.records_received for d in self.datasets.values())

    @property
    def total_accepted(self) -> int:
        return sum(d.records_accepted for d in self.datasets.values())

    @property
    def total_rejected(self) -> int:
        return sum(d.records_rejected for d in self.datasets.values())

    def format_full_report(self) -> str:
        border = "=" * 65
        provenance_banner = "DEMO / SYNTHETIC DATA -- Not Live Plant Measurements" if self.is_demo else "LIVE PRODUCTION DATA"
        lines = [
            border,
            "                   DATA IMPORT QUALITY REPORT",
            border,
            f" Batch ID     : {self.import_batch_id if self.import_batch_id else 'Dry Run / Pre-persist'}",
            f" Timestamp    : {self.import_timestamp.isoformat()}",
            f" Dataset Label: {self.dataset_label}",
            f" Provenance   : {provenance_banner}",
            border,
        ]
        for summary in self.datasets.values():
            lines.append(summary.format_summary())
            lines.append("-" * 65)

        lines.extend([
            f" TOTALS: Received: {self.total_received:,} | Accepted: {self.total_accepted:,} | Rejected: {self.total_rejected:,}",
            border,
        ])
        return "\n".join(lines)
