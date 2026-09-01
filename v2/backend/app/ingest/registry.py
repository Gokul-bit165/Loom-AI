"""
Loom AI v2 — Ingest template registry.

Templates:
1. MILL_DAILY_PREP_WIDE (Primary / Priority):
   Matches ATM's actual Daily Preparatory Production Report:
   - Metric-as-rows, shift-as-columns (I, II, III, TOTAL, REMARKS).
   - "TARGET @ 22.5 HRS" encodes department available hours directly in row header.
   - Remarks block is grouped under shift headers (e.g. "SHIFT : 1", "CARD : 9 & 10 ESS STOP - 360 MIN.").
   - Stated EFFI % in the sheet serves as a mathematical cross-check against computed efficiency.

2. LOOM_LONG_FORMAT:
   Standard clean per-loom CSV/Excel layout for future digital feeds/controller exports.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ColumnSpec:
    canonical: str
    required: bool
    aliases: tuple[str, ...]


@dataclass(frozen=True)
class Template:
    code: str
    description: str
    layout: str  # "wide_department" | "long_loom"


MILL_DAILY_PREP_WIDE = Template(
    code="MILL_DAILY_PREP_WIDE",
    description="ATM Daily Preparatory Production Report (wide shift-columns, metric-as-rows, available-hours in target label)",
    layout="wide_department",
)

LOOM_LONG_FORMAT = Template(
    code="LOOM_LONG_FORMAT",
    description="Clean per-loom tabular format (loom_no, shift, metres, breaks, running_min)",
    layout="long_loom",
)

REGISTRY: dict[str, Template] = {
    MILL_DAILY_PREP_WIDE.code: MILL_DAILY_PREP_WIDE,
    LOOM_LONG_FORMAT.code: LOOM_LONG_FORMAT,
}


def get_template(code: str) -> Template:
    tmpl = REGISTRY.get(code)
    if tmpl is None:
        raise KeyError(f"Unknown template: '{code}'. Known: {list(REGISTRY)}")
    return tmpl
