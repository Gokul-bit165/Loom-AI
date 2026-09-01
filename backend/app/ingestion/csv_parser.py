"""
CSV Parser implementation for Loom AI ingestion.
"""
from __future__ import annotations

import csv
from pathlib import Path
from typing import Any

from app.ingestion.base import BaseParser


class CSVParser(BaseParser):
    """
    Parses CSV files into normalized list of row dictionaries.
    Preserves raw string values, preserves whitespace, and does NOT silently
    convert empty cells to 0 or NaN.
    """

    def parse(self, file_path: str | Path) -> list[dict[str, Any]]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {path}")

        rows: list[dict[str, Any]] = []
        with open(path, mode="r", encoding="utf-8-sig", newline="") as f:
            reader = csv.DictReader(f)
            if reader.fieldnames is None:
                return []
            
            # Clean header names (strip spaces)
            cleaned_fieldnames = [name.strip() for name in reader.fieldnames if name]
            reader.fieldnames = cleaned_fieldnames

            for row in reader:
                # Strip keys, keep original values as raw strings
                clean_row = {
                    (k.strip() if k else ""): (v if v is not None else "")
                    for k, v in row.items()
                    if k is not None
                }
                rows.append(clean_row)

        return rows
