"""
Tests for Ingestion Parsers.
"""
import tempfile
from pathlib import Path
import pytest

from app.ingestion.csv_parser import CSVParser


def test_csv_parser_reads_normal_file(tmp_path: Path):
    csv_file = tmp_path / "sample.csv"
    csv_file.write_text(
        "machine_id,unit,department\n"
        "TOY-01,Unit I,Weaving\n"
        "RF-01,Unit I,Spinning\n",
        encoding="utf-8",
    )

    parser = CSVParser()
    rows = parser.parse(csv_file)

    assert len(rows) == 2
    assert rows[0]["machine_id"] == "TOY-01"
    assert rows[0]["unit"] == "Unit I"
    assert rows[1]["machine_id"] == "RF-01"


def test_csv_parser_preserves_empty_cells_without_coercion(tmp_path: Path):
    csv_file = tmp_path / "empty_cells.csv"
    csv_file.write_text(
        "machine_id,target_qty,actual_qty\n"
        "TOY-01,,100\n",
        encoding="utf-8",
    )

    parser = CSVParser()
    rows = parser.parse(csv_file)

    assert len(rows) == 1
    # Missing cell must be empty string, NOT coerced to 0 or NaN
    assert rows[0]["target_qty"] == ""
    assert rows[0]["actual_qty"] == "100"


def test_csv_parser_handles_whitespace_in_headers(tmp_path: Path):
    csv_file = tmp_path / "spaces.csv"
    csv_file.write_text(
        " machine_id ,  shift , date \n"
        "TOY-01, 1 , 2026-08-14 \n",
        encoding="utf-8",
    )

    parser = CSVParser()
    rows = parser.parse(csv_file)

    assert len(rows) == 1
    assert "machine_id" in rows[0]
    assert "shift" in rows[0]
    assert "date" in rows[0]


def test_csv_parser_raises_on_missing_file():
    parser = CSVParser()
    with pytest.raises(FileNotFoundError):
        parser.parse("non_existent_file_123.csv")
