"""
Loom AI v2 — Pydantic response schemas.

Rules:
- Never expose raw ORM objects. Every API response uses one of these models.
- All monetary fields carry rate_source (CONFIRMED | ESTIMATED) — the UI
  renders an EST chip for ESTIMATED (Anti-Slop rule 8).
- All responses carry data_as_of (last ingested_at) and source_mix.
- None is used for missing data — callers render "No data" not "0" (rule 4).
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ── Shared base ─────────────────────────────────────────────────────────────

class DataEnvelope(BaseModel):
    """Every API response wraps data in this envelope."""
    model_config = ConfigDict(from_attributes=True)
    data_as_of: Optional[datetime.datetime] = None
    source_mix: list[str] = ["DEMO"]   # e.g. ["DEMO"] or ["CSV_IMPORT", "MANUAL_ENTRY"]


class ErrorDetail(BaseModel):
    code: str
    detail: str
    data_as_of: Optional[datetime.datetime] = None


class ErrorResponse(BaseModel):
    ok: bool = False
    error: ErrorDetail


# ── Loom / Operations ────────────────────────────────────────────────────────

class RupeeAmount(BaseModel):
    """Monetary figure paired with its rate assumption and provenance.
    Never split value and rate_source into separate sibling fields."""
    value: Optional[Decimal] = None
    rate_source: str = "ESTIMATED"  # "CONFIRMED" | "ESTIMATED"
    rate_basis: str = "Rs.40.00/metre -- placeholder rate card"


class CohortStats(BaseModel):
    """Rolling 30-day cohort for (style, loom_type). None when < 5 looms."""
    median_eff: Optional[Decimal] = None
    p90_eff: Optional[Decimal] = None
    loom_count: int = 0
    window: str = "30d"          # "30d" | "ALL_HISTORY -- insufficient recent data"
    sufficient: bool = False     # False when loom_count < 5 -- suppresses suggestions


class LoomRow(BaseModel):
    """One row in the Operations table."""
    model_config = ConfigDict(from_attributes=True)

    loom_id: int
    loom_no: str
    loom_type_code: str
    shed_code: Optional[str] = None
    style_code: str
    shift_code: str
    weaver_name: Optional[str] = None

    # Production metrics (all schedule-time basis unless qualified)
    metres: Decimal
    kilo_picks: Decimal
    scheduled_minutes: int
    running_minutes: int
    stopped_minutes: int

    # Efficiency split (design correction #1 -- see formulas.py)
    loom_efficiency_pct: Optional[Decimal] = None     # THE mill's EFF% (scheduled basis)
    performance_eff_pct: Optional[Decimal] = None     # diagnostic only (running basis)
    utilization_pct: Optional[Decimal] = None

    # Cohort comparison -- None when insufficient data
    cohort_gap_pp: Optional[Decimal] = None           # loom_eff - cohort_median_eff
    cohort_loom_count: int = 0
    cohort_window: str = "30d"

    # Break rates
    warp_breaks_per_1000: Optional[Decimal] = None
    weft_breaks_per_1000: Optional[Decimal] = None
    warp_breaks: int = 0
    weft_breaks: int = 0

    # Revenue (always wrapped with rate source and basis)
    rupee_lost: RupeeAmount = RupeeAmount()

    # Status for colour coding: RED | AMBER | GREEN | GREY
    status: str = "GREY"


class LoomsResponse(DataEnvelope):
    looms: list[LoomRow]
    total: int
    page: int
    page_size: int


# ── Loom Detail ──────────────────────────────────────────────────────────────

class TrendPoint(BaseModel):
    date: datetime.date
    loom_efficiency_pct: Optional[Decimal]
    style_code: str
    style_changed: bool = False


class StopEventRow(BaseModel):
    stop_event_id: int
    raised_at: datetime.datetime
    resolved_at: Optional[datetime.datetime]
    reason_label_en: Optional[str]
    reason_category: Optional[str]
    duration_min: Optional[Decimal]
    status: str


class ReasonParetoRow(BaseModel):
    reason_code: str
    reason_label_en: str
    count: int
    total_minutes: Decimal
    pct_of_loom_downtime: Decimal
    vs_plant_pct: Optional[Decimal]    # difference vs plant-wide share


class WeaverRecord(BaseModel):
    employee_id: int
    name: str
    grade: Optional[str]
    days_run: int
    mean_eff: Optional[Decimal]


class LoomDetailResponse(DataEnvelope):
    loom_id: int
    loom_no: str
    loom_type_code: str
    shed_code: Optional[str]
    register_confirmed: bool

    trend: list[TrendPoint]
    stop_events: list[StopEventRow]
    reason_pareto: list[ReasonParetoRow]

    # Break rates vs cohort
    warp_per_1000: Optional[Decimal]
    weft_per_1000: Optional[Decimal]
    cohort_warp_p90: Optional[Decimal]
    cohort_weft_p90: Optional[Decimal]

    weavers: list[WeaverRecord]

    rupee_lost_month: RupeeAmount = RupeeAmount()

    # The diagnostic sentence -- deterministic, computed from the three-function split.
    # e.g. "AJ-112 is at 81% loom efficiency. Performance while running is 96%.
    #        This is a stoppage problem, not a machine-speed problem."
    diagnostic_sentence: Optional[str]


# ── Production summary ───────────────────────────────────────────────────────

class ShiftSummary(BaseModel):
    shift_code: str
    target_eff: Optional[Decimal]
    actual_eff: Optional[Decimal]
    metres: Decimal
    kilo_picks: Decimal
    loom_count: int
    stopped_minutes_total: int


class ProductionSummaryResponse(DataEnvelope):
    date: datetime.date
    unit_code: str
    shifts: list[ShiftSummary]
    day_total: ShiftSummary


# ── Breakdown summary ────────────────────────────────────────────────────────

class BreakdownLoomRow(BaseModel):
    loom_id: int
    loom_no: str
    loom_type_code: str
    total_stopped_minutes: int
    event_count: int
    dominant_reason_en: Optional[str]
    dominant_reason_category: Optional[str]


class BreakdownSummaryResponse(DataEnvelope):
    date: datetime.date
    unit_code: str
    today_stopped_minutes_total: int = 0
    today_events_count_total: int = 0
    today_rupee_loss_total: RupeeAmount = RupeeAmount()
    category_downtime_minutes: dict[str, float] = {}
    worst_looms_today: list[BreakdownLoomRow] = []     # Q5: highest breakdown-time today
    monthly_top_looms: list[BreakdownLoomRow] = []      # Q5: most breakdowns this month
    avg_downtime_per_event_min: Optional[Decimal] = None  # Q6
    reason_pareto: list[ReasonParetoRow] = []           # Q6
    total_rupee_lost: RupeeAmount = RupeeAmount()


# ── Ingest preview ───────────────────────────────────────────────────────────

class PreviewRowInsert(BaseModel):
    loom_no: str
    shift_code: str
    metres: Decimal
    running_minutes: int
    warp_breaks: int
    weft_breaks: int


class PreviewRowReject(BaseModel):
    row_index: int
    raw_data: dict
    error_code: str
    error_detail: str


class PreviewResponse(BaseModel):
    template_code: str
    work_date: datetime.date
    to_insert: list[PreviewRowInsert]
    to_update: list[PreviewRowInsert]   # existing rows that would be overwritten
    to_reject: list[PreviewRowReject]
    summary: str   # "30 rows to insert, 0 to update, 2 rejected"


class CommitResponse(BaseModel):
    import_batch_id: int
    accepted: int
    rejected: int
    status: str


# ── Exports ──────────────────────────────────────────────────────────────────

class WhatsAppResponse(BaseModel):
    text: str           # 6-line plain text, no markdown chars
    generated_at: datetime.datetime
    data_as_of: Optional[datetime.datetime]
