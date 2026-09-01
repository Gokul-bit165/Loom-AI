"""
Base Parser interface for source data files (CSV, Excel, future PDF).
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any


class BaseParser(ABC):
    """
    Abstract base class for all file parsers.
    Parsers are responsible only for extracting raw tabular row dictionaries
    from raw file formats without making business assumptions or mutating values.
    """

    @abstractmethod
    def parse(self, file_path: str | Path) -> list[dict[str, Any]]:
        """
        Parse the given file and return a list of row dictionaries.
        Keys are column names trimmed of whitespace.
        Values are raw strings or raw cells without silent truncation or default coercion.
        """
        pass
