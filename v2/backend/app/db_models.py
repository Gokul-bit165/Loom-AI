"""
Loom AI v2 — SQLAlchemy ORM models.

Mirrors the corrected DDL in docs/V2_DESIGN.md §2 exactly (post design-
review corrections: no TimescaleDB, production_target and fabric_roll
added, vendor_unit_monthly_summary added, loom_efficiency_pct/
performance_eff_pct split honored in analytics, not stored — see
app/analytics/formulas.py).

Vendor units (CVF/SKT/VPN/METRO/TPN) never get loom/production_log/
stop_event rows in this schema — only vendor_unit_monthly_summary. Do not
add a data path that writes vendor loom-level data; that was the explicit,
reviewed decision in docs/V2_DESIGN.md §1.1.
"""
from __future__ import annotations

import datetime
import enum
from typing import Optional

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Text,
    Time,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


# ── Enums (Python side; DB side uses matching Postgres ENUM types) ─────────

class DataSource(str, enum.Enum):
    DEMO = "DEMO"
    CSV_IMPORT = "CSV_IMPORT"
    MANUAL_ENTRY = "MANUAL_ENTRY"
    CONTROLLER_FEED = "CONTROLLER_FEED"


class RateSource(str, enum.Enum):
    CONFIRMED = "CONFIRMED"
    ESTIMATED = "ESTIMATED"


class LoomMake(str, enum.Enum):
    TSUDAKOMA = "TSUDAKOMA"
    SULZER = "SULZER"


class EmployeeRole(str, enum.Enum):
    WEAVER = "WEAVER"
    TRAINING_WEAVER = "TRAINING_WEAVER"
    FABRIC_CHECKER = "FABRIC_CHECKER"
    LOADMAN = "LOADMAN"
    SHIFT_FITTER = "SHIFT_FITTER"
    HEAD_FITTER = "HEAD_FITTER"
    KNOTTER = "KNOTTER"
    GAITER = "GAITER"
    ELECTRICIAN = "ELECTRICIAN"
    OILER = "OILER"
    QUALITY_CHECKER = "QUALITY_CHECKER"
    SWEEPER = "SWEEPER"
    # Unenumerated designations: the source brief's role table itemises 123
    # employees, while the department-total is 137. The 14 difference are
    # real employees whose designations are not listed. Seeded as OTHER with
    # employee_code='UNCONFIRMED-N' so headcount reconciles to the real 137
    # without inventing job titles. See masters.py docstring for full audit.
    OTHER = "OTHER"


class EmployeeGrade(str, enum.Enum):
    G1 = "G1"
    G1_PLUS = "G1_PLUS"
    G2 = "G2"
    G2_PLUS = "G2_PLUS"
    G3 = "G3"
    G3_PLUS = "G3_PLUS"
    G4 = "G4"
    G5 = "G5"
    G6 = "G6"
    G6_PLUS = "G6_PLUS"


class StopStatus(str, enum.Enum):
    RAISED = "RAISED"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    ATTENDING = "ATTENDING"
    RESOLVED = "RESOLVED"


class ReasonCategory(str, enum.Enum):
    MECHANICAL = "MECHANICAL"
    ELECTRICAL = "ELECTRICAL"
    MATERIAL = "MATERIAL"
    MANPOWER = "MANPOWER"
    PLANNED = "PLANNED"
    UTILITY = "UTILITY"
    QUALITY = "QUALITY"
    OTHER = "OTHER"


class UserRole(str, enum.Enum):
    owner = "owner"
    pm = "pm"
    supervisor = "supervisor"
    vendor_coordinator = "vendor_coordinator"


class SuggestionStatus(str, enum.Enum):
    OPEN = "OPEN"
    ACKED = "ACKED"
    DISMISSED = "DISMISSED"
    DONE = "DONE"


class ConfidenceLevel(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


# ── 1. Masters ───────────────────────────────────────────────────────────

class Unit(Base):
    __tablename__ = "unit"

    unit_id: int = Column(Integer, primary_key=True, autoincrement=True)
    code: str = Column(String(20), nullable=False, unique=True)
    name: str = Column(String(150), nullable=False)
    is_own_unit: bool = Column(Boolean, nullable=False, default=False)
    timezone: str = Column(String(50), nullable=False, default="Asia/Kolkata")
    active: bool = Column(Boolean, nullable=False, default=True)
    created_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    sheds = relationship("Shed", back_populates="unit")
    looms = relationship("Loom", back_populates="unit")
    employees = relationship("Employee", back_populates="unit")

    def __repr__(self) -> str:
        return f"<Unit {self.code} own={self.is_own_unit}>"


class Shed(Base):
    __tablename__ = "shed"

    shed_id: int = Column(Integer, primary_key=True, autoincrement=True)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id", ondelete="RESTRICT"), nullable=False)
    code: str = Column(String(20), nullable=False)
    name: str = Column(String(100), nullable=False)

    unit = relationship("Unit", back_populates="sheds")

    __table_args__ = (UniqueConstraint("unit_id", "code", name="uq_shed_unit_code"),)


class LoomType(Base):
    __tablename__ = "loom_type"

    loom_type_code: str = Column(String(10), primary_key=True)
    make: str = Column(Enum(LoomMake, name="loom_make"), nullable=False)
    description: str = Column(String(150), nullable=True)


class Style(Base):
    __tablename__ = "style"

    style_id: int = Column(Integer, primary_key=True, autoincrement=True)
    style_code: str = Column(String(150), nullable=False, unique=True)
    loom_type_code: str = Column(String(10), ForeignKey("loom_type.loom_type_code"), nullable=True)
    warp_ends: int = Column(Integer, nullable=False)
    reed_pick: str = Column(String(30), nullable=True)
    width_inch = Column(Numeric(6, 2), nullable=True)
    weave_construction: str = Column(String(30), nullable=True)
    picks_per_metre = Column(Numeric(10, 3), nullable=False)
    std_crimp_pct = Column(Numeric(5, 2), nullable=False)
    std_rpm = Column(Numeric(8, 2), nullable=False)
    std_efficiency_pct = Column(Numeric(5, 2), nullable=False)
    revenue_per_metre = Column(Numeric(10, 2), nullable=True)
    revenue_rate_source: str = Column(
        Enum(RateSource, name="rate_source"), nullable=False, default=RateSource.ESTIMATED
    )
    active: bool = Column(Boolean, nullable=False, default=True)

    def __repr__(self) -> str:
        return f"<Style {self.style_code}>"


class StyleUnitCrimpMonthly(Base):
    """Real, confirmed monthly crimp aggregates (Jul-2026 Vendor MRM).
    Kept separate from any per-shift actual_crimp_pct, which stays NULL
    on production_log until a lab feed exists (Q18-Q20 BLOCKED)."""
    __tablename__ = "style_unit_crimp_monthly"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    style_id: int = Column(Integer, ForeignKey("style.style_id"), nullable=False)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id"), nullable=False)
    month: datetime.date = Column(Date, nullable=False)
    crimp_pct = Column(Numeric(5, 2), nullable=False)
    source: str = Column(Enum(RateSource, name="crimp_rate_source"), nullable=False, default=RateSource.CONFIRMED)

    __table_args__ = (UniqueConstraint("style_id", "unit_id", "month", name="uq_style_unit_crimp_month"),)


class ShiftMaster(Base):
    __tablename__ = "shift_master"

    shift_id: int = Column(Integer, primary_key=True, autoincrement=True)
    code: str = Column(String(5), nullable=False, unique=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    crosses_midnight: bool = Column(Boolean, nullable=False, default=False)
    scheduled_minutes: int = Column(Integer, nullable=False, default=480)


class Employee(Base):
    __tablename__ = "employee"

    employee_id: int = Column(Integer, primary_key=True, autoincrement=True)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id", ondelete="RESTRICT"), nullable=False)
    employee_code: str = Column(String(30), nullable=True)
    name: str = Column(String(150), nullable=False)
    role: str = Column(Enum(EmployeeRole, name="employee_role"), nullable=False)
    grade: str = Column(Enum(EmployeeGrade, name="employee_grade"), nullable=True)
    std_looms: int = Column(Integer, nullable=True)
    std_efficiency_pct = Column(Numeric(5, 2), nullable=True)
    active: bool = Column(Boolean, nullable=False, default=True)
    source: str = Column(Enum(DataSource, name="data_source"), nullable=False, default=DataSource.DEMO)
    ingested_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    unit = relationship("Unit", back_populates="employees")

    __table_args__ = (Index("ix_employee_unit_role", "unit_id", "role"),)


class ReasonCode(Base):
    __tablename__ = "reason_code"

    reason_code_id: int = Column(Integer, primary_key=True, autoincrement=True)
    code: str = Column(String(30), nullable=False, unique=True)
    label_en: str = Column(String(150), nullable=False)
    label_ta: str = Column(String(150), nullable=False)
    category: str = Column(Enum(ReasonCategory, name="reason_category"), nullable=False)


class CostMaster(Base):
    __tablename__ = "cost_master"

    cost_master_id: int = Column(Integer, primary_key=True, autoincrement=True)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id"), nullable=True)
    effective_from: datetime.date = Column(Date, nullable=False)
    effective_to: datetime.date = Column(Date, nullable=True)
    rate_per_kwh = Column(Numeric(10, 2), nullable=True)
    yarn_rate_per_kg = Column(Numeric(10, 2), nullable=True)
    other = Column(Text, nullable=True)  # JSON-as-text for cross-DB portability in tests
    source: str = Column(Enum(RateSource, name="cost_rate_source"), nullable=False, default=RateSource.ESTIMATED)


# ── 2. Loom master ───────────────────────────────────────────────────────

class Loom(Base):
    """ATM only in v2 (design correction: vendor units carry no looms —
    see docs/V2_DESIGN.md §1.1). Nothing in the ORM enforces that at the
    DB level (a legitimate vendor loom register could arrive later), but
    the seed/demo generator must never create Loom rows for a unit where
    Unit.is_own_unit is False."""
    __tablename__ = "loom"

    loom_id: int = Column(Integer, primary_key=True, autoincrement=True)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id", ondelete="RESTRICT"), nullable=False)
    shed_id: int = Column(Integer, ForeignKey("shed.shed_id", ondelete="SET NULL"), nullable=True)
    loom_no: str = Column(String(30), nullable=False)
    loom_type_code: str = Column(String(10), ForeignKey("loom_type.loom_type_code", ondelete="RESTRICT"), nullable=False)
    install_date: datetime.date = Column(Date, nullable=True)
    active: bool = Column(Boolean, nullable=False, default=True)
    register_confirmed: bool = Column(Boolean, nullable=False, default=False)
    source: str = Column(Enum(DataSource, name="loom_data_source"), nullable=False, default=DataSource.DEMO)
    ingested_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    unit = relationship("Unit", back_populates="looms")

    __table_args__ = (
        UniqueConstraint("unit_id", "loom_no", name="uq_loom_unit_no"),
        Index("ix_loom_unit_active", "unit_id", "active"),
    )

    def __repr__(self) -> str:
        return f"<Loom {self.loom_no} unit={self.unit_id}>"


# ── 3. Operational ───────────────────────────────────────────────────────

class BeamRun(Base):
    __tablename__ = "beam_run"

    beam_run_id: int = Column(Integer, primary_key=True, autoincrement=True)
    loom_id: int = Column(Integer, ForeignKey("loom.loom_id", ondelete="RESTRICT"), nullable=False)
    style_id: int = Column(Integer, ForeignKey("style.style_id", ondelete="RESTRICT"), nullable=False)
    started_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False)
    ended_at: datetime.datetime = Column(DateTime(timezone=True), nullable=True)
    source: str = Column(Enum(DataSource, name="beam_data_source"), nullable=False, default=DataSource.DEMO)

    __table_args__ = (Index("ix_beam_run_loom_time", "loom_id", "started_at"),)


class Assignment(Base):
    __tablename__ = "assignment"

    assignment_id: int = Column(Integer, primary_key=True, autoincrement=True)
    loom_id: int = Column(Integer, ForeignKey("loom.loom_id", ondelete="RESTRICT"), nullable=False)
    shift_id: int = Column(Integer, ForeignKey("shift_master.shift_id", ondelete="RESTRICT"), nullable=False)
    work_date: datetime.date = Column(Date, nullable=False)
    employee_id: int = Column(Integer, ForeignKey("employee.employee_id", ondelete="RESTRICT"), nullable=False)
    source: str = Column(Enum(DataSource, name="assignment_data_source"), nullable=False, default=DataSource.DEMO)
    ingested_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    __table_args__ = (UniqueConstraint("loom_id", "shift_id", "work_date", name="uq_assignment_loom_shift_date"),)


class ImportBatch(Base):
    __tablename__ = "import_batch"

    import_batch_id: int = Column(Integer, primary_key=True, autoincrement=True)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id"), nullable=False)
    template_code: str = Column(String(50), nullable=False)
    uploaded_by: str = Column(String(100), nullable=True)
    uploaded_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    row_count: int = Column(Integer, nullable=False, default=0)
    accepted_count: int = Column(Integer, nullable=False, default=0)
    rejected_count: int = Column(Integer, nullable=False, default=0)
    status: str = Column(String(30), nullable=False, default="PENDING_REVIEW")
    notes: str = Column(Text, nullable=True)


class ProductionTarget(Base):
    __tablename__ = "production_target"

    target_id: int = Column(Integer, primary_key=True, autoincrement=True)
    loom_id: int = Column(Integer, ForeignKey("loom.loom_id"), nullable=True)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id", ondelete="RESTRICT"), nullable=False)
    work_date: datetime.date = Column(Date, nullable=False)
    shift_id: int = Column(Integer, ForeignKey("shift_master.shift_id"), nullable=True)
    style_id: int = Column(Integer, ForeignKey("style.style_id"), nullable=True)
    available_hours = Column(Numeric(5, 2), nullable=False)
    target_metres = Column(Numeric(12, 3), nullable=True)
    target_kilo_picks = Column(Numeric(14, 4), nullable=True)
    target_efficiency_pct = Column(Numeric(5, 2), nullable=True)
    basis_note: str = Column(Text, nullable=True)
    source: str = Column(Enum(DataSource, name="target_data_source"), nullable=False, default=DataSource.DEMO)
    ingested_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("loom_id", "work_date", "shift_id", name="uq_target_loom_date_shift"),
        Index("ix_target_unit_date", "unit_id", "work_date"),
    )


class ProductionLog(Base):
    __tablename__ = "production_log"

    production_log_id: int = Column(Integer, primary_key=True, autoincrement=True)
    loom_id: int = Column(Integer, ForeignKey("loom.loom_id", ondelete="RESTRICT"), nullable=False)
    work_date: datetime.date = Column(Date, nullable=False, comment="Calendar date the SHIFT STARTED")
    shift_id: int = Column(Integer, ForeignKey("shift_master.shift_id", ondelete="RESTRICT"), nullable=False)
    beam_run_id: int = Column(Integer, ForeignKey("beam_run.beam_run_id", ondelete="SET NULL"), nullable=True)
    style_id: int = Column(Integer, ForeignKey("style.style_id", ondelete="RESTRICT"), nullable=False)
    employee_id: int = Column(Integer, ForeignKey("employee.employee_id", ondelete="SET NULL"), nullable=True)

    scheduled_minutes: int = Column(Integer, nullable=False, default=480)
    running_minutes: int = Column(Integer, nullable=False)
    std_rpm_snapshot = Column(Numeric(8, 2), nullable=False, comment="style.std_rpm frozen at run time")
    actual_picks: int = Column(BigInteger, nullable=False)
    metres = Column(Numeric(12, 3), nullable=False)
    kilo_picks = Column(Numeric(14, 4), nullable=False)
    warp_breaks: int = Column(Integer, nullable=False, default=0)
    weft_breaks: int = Column(Integer, nullable=False, default=0)
    actual_crimp_pct = Column(Numeric(5, 2), nullable=True, comment="NULL until lab feed exists (Q18-Q20 BLOCKED)")

    actual_warp_time_min = Column(Numeric(6, 2), nullable=True, default=0)
    actual_weft_time_min = Column(Numeric(6, 2), nullable=True, default=0)
    standard_warp_time_min = Column(Numeric(6, 2), nullable=True, default=15.0)
    standard_weft_time_min = Column(Numeric(6, 2), nullable=True, default=10.0)

    source: str = Column(Enum(DataSource, name="prodlog_data_source"), nullable=False, default=DataSource.DEMO)
    ingested_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    import_batch_id: int = Column(Integer, ForeignKey("import_batch.import_batch_id", ondelete="SET NULL"), nullable=True)
    superseded_by_batch_id: int = Column(Integer, ForeignKey("import_batch.import_batch_id", ondelete="SET NULL"), nullable=True)
    is_current: bool = Column(Boolean, nullable=False, default=True)

    __table_args__ = (
        Index(
            "uq_prodlog_current",
            "loom_id",
            "work_date",
            "shift_id",
            unique=True,
            postgresql_where=(is_current == True),
            sqlite_where=(is_current == True),
        ),
        CheckConstraint("running_minutes <= scheduled_minutes", name="ck_prodlog_running_le_scheduled"),
        CheckConstraint("metres >= 0 AND kilo_picks >= 0 AND actual_picks >= 0", name="ck_prodlog_nonneg"),
        CheckConstraint("warp_breaks >= 0 AND weft_breaks >= 0", name="ck_prodlog_breaks_nonneg"),
        Index("ix_prodlog_date_loom", "work_date", "loom_id"),
        Index("ix_prodlog_style", "style_id"),
        Index("ix_prodlog_employee", "employee_id"),
        Index("ix_prodlog_is_current", "is_current"),
    )

    def __repr__(self) -> str:
        return f"<ProductionLog loom={self.loom_id} {self.work_date} shift={self.shift_id} current={self.is_current}>"


class StopEvent(Base):
    __tablename__ = "stop_event"

    stop_event_id: int = Column(Integer, primary_key=True, autoincrement=True)
    loom_id: int = Column(Integer, ForeignKey("loom.loom_id", ondelete="RESTRICT"), nullable=False)
    work_date: datetime.date = Column(Date, nullable=False)
    shift_id: int = Column(Integer, ForeignKey("shift_master.shift_id", ondelete="RESTRICT"), nullable=False)

    raised_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False)
    acknowledged_at: datetime.datetime = Column(DateTime(timezone=True), nullable=True)
    attending_at: datetime.datetime = Column(DateTime(timezone=True), nullable=True)
    resolved_at: datetime.datetime = Column(DateTime(timezone=True), nullable=True)

    reason_code_id: int = Column(Integer, ForeignKey("reason_code.reason_code_id", ondelete="SET NULL"), nullable=True)
    raw_remark: str = Column(Text, nullable=True)
    status: str = Column(Enum(StopStatus, name="stop_status"), nullable=False, default=StopStatus.RAISED)
    raised_by: str = Column(String(100), nullable=True)
    resolved_by: str = Column(String(100), nullable=True)

    source: str = Column(Enum(DataSource, name="stopevent_data_source"), nullable=False, default=DataSource.DEMO)
    ingested_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    import_batch_id: int = Column(Integer, ForeignKey("import_batch.import_batch_id", ondelete="SET NULL"), nullable=True)

    # P6 Training Label Capture (close-out form ground truth)
    failed_component: str = Column(String(50), nullable=True)  # e.g. "weft_feeder", "main_nozzle", ...
    fix_action: str = Column(String(50), nullable=True)        # "adjust", "clean", "replace_part", "reset", "no_fault_found"
    was_predictable: str = Column(String(20), nullable=True)   # "YES", "NO", "UNSURE"
    classifier_assigned: bool = Column(Boolean, nullable=False, default=False)

    __table_args__ = (
        CheckConstraint(
            "(acknowledged_at IS NULL OR acknowledged_at >= raised_at) AND "
            "(attending_at IS NULL OR acknowledged_at IS NULL OR attending_at >= acknowledged_at) AND "
            "(resolved_at IS NULL OR attending_at IS NULL OR resolved_at >= attending_at)",
            name="ck_stop_lifecycle_order",
        ),
        Index("ix_stopevent_loom_date", "loom_id", "work_date"),
        Index("ix_stopevent_reason", "reason_code_id"),
    )

    def __repr__(self) -> str:
        return f"<StopEvent loom={self.loom_id} {self.work_date} status={self.status}>"


class FabricRoll(Base):
    __tablename__ = "fabric_roll"

    roll_id: int = Column(Integer, primary_key=True, autoincrement=True)
    loom_id: int = Column(Integer, ForeignKey("loom.loom_id", ondelete="RESTRICT"), nullable=False)
    style_id: int = Column(Integer, ForeignKey("style.style_id", ondelete="RESTRICT"), nullable=False)
    work_date: datetime.date = Column(Date, nullable=False)
    shift_id: int = Column(Integer, ForeignKey("shift_master.shift_id"), nullable=True)
    metres = Column(Numeric(10, 2), nullable=False)
    weight_kg = Column(Numeric(8, 2), nullable=True)
    doffed_at: datetime.datetime = Column(DateTime(timezone=True), nullable=True)
    source: str = Column(Enum(DataSource, name="roll_data_source"), nullable=False, default=DataSource.DEMO)
    ingested_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    __table_args__ = (
        CheckConstraint("metres >= 0", name="ck_roll_metres_nonneg"),
        Index("ix_roll_loom_date", "loom_id", "work_date"),
    )


class VendorUnitMonthlySummary(Base):
    """The ONLY data table populated for vendor units (design correction
    §1.1) — real July-2026 Vendor MRM figures, source='CSV_IMPORT'."""
    __tablename__ = "vendor_unit_monthly_summary"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id", ondelete="RESTRICT"), nullable=False)
    month: datetime.date = Column(Date, nullable=False)
    efficiency_pct = Column(Numeric(5, 2), nullable=False)
    kilo_picks_day_avg = Column(Numeric(14, 2), nullable=True)
    metres_day_avg = Column(Numeric(14, 2), nullable=True)
    warp_breaks_per_hr = Column(Numeric(6, 3), nullable=True)
    weft_breaks_per_hr = Column(Numeric(6, 3), nullable=True)
    month_kilo_picks = Column(Numeric(16, 2), nullable=False)
    month_metres = Column(Numeric(16, 2), nullable=False)
    month_rolls: int = Column(Integer, nullable=True)
    source: str = Column(String(30), nullable=False, default="CSV_IMPORT")

    __table_args__ = (UniqueConstraint("unit_id", "month", name="uq_vendor_summary_unit_month"),)


class MaintenanceRecord(Base):
    __tablename__ = "maintenance_record"

    record_id = Column(Integer, primary_key=True, autoincrement=True)
    loom_id = Column(Integer, ForeignKey("loom.loom_id", ondelete="RESTRICT"), nullable=False)
    maintenance_type = Column(String(30), nullable=False, default="PREVENTIVE")  # PREVENTIVE, CORRECTIVE, OVERHAUL
    scheduled_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    completed_date = Column(Date, nullable=True)
    scheduled_duration_min = Column(Integer, nullable=False, default=120)
    actual_duration_min = Column(Integer, nullable=True)
    overrun_min = Column(Integer, nullable=True, default=0)
    cost_inr = Column(Numeric(10, 2), nullable=True, default=0)
    technician_name = Column(String(100), nullable=True)
    recurring_flag = Column(Boolean, nullable=False, default=False)
    description = Column(Text, nullable=True)
    source = Column(Enum(DataSource, name="maint_data_source"), nullable=False, default=DataSource.DEMO)

    __table_args__ = (
        Index("ix_maint_loom_date", "loom_id", "scheduled_date"),
    )


class AirConsumptionLog(Base):
    __tablename__ = "air_consumption_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    loom_id = Column(Integer, ForeignKey("loom.loom_id", ondelete="RESTRICT"), nullable=False)
    work_date = Column(Date, nullable=False)
    shift_id = Column(Integer, ForeignKey("shift_master.shift_id"), nullable=False)
    actual_cfm = Column(Numeric(8, 2), nullable=False)
    standard_cfm = Column(Numeric(8, 2), nullable=False, default=32.0)
    excess_cfm = Column(Numeric(8, 2), nullable=False, default=0.0)
    line_pressure_bar = Column(Numeric(5, 2), nullable=True, default=6.2)
    power_kwh = Column(Numeric(10, 2), nullable=True, default=0.0)
    air_cost_inr = Column(Numeric(10, 2), nullable=True, default=0.0)
    source = Column(Enum(DataSource, name="air_data_source"), nullable=False, default=DataSource.DEMO)

    __table_args__ = (
        Index("ix_air_loom_date", "loom_id", "work_date"),
    )


class QualityInspectionLog(Base):
    __tablename__ = "quality_inspection_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    loom_id = Column(Integer, ForeignKey("loom.loom_id", ondelete="RESTRICT"), nullable=False)
    style_id = Column(Integer, ForeignKey("style.style_id"), nullable=False)
    work_date = Column(Date, nullable=False)
    shift_id = Column(Integer, ForeignKey("shift_master.shift_id"), nullable=False)
    inspected_metres = Column(Numeric(10, 2), nullable=False)
    defective_metres = Column(Numeric(10, 2), nullable=False, default=0.0)
    defect_count = Column(Integer, nullable=False, default=0)
    defect_rate_pct = Column(Numeric(5, 2), nullable=False, default=0.0)
    defect_category = Column(String(50), nullable=True)  # WARP_FLOAT, WEFT_MISS, OIL_STAIN, REED_MARK
    actual_crimp_pct = Column(Numeric(5, 2), nullable=True)
    standard_crimp_pct = Column(Numeric(5, 2), nullable=True)
    yarn_waste_kg = Column(Numeric(8, 2), nullable=True, default=0.0)
    source = Column(Enum(DataSource, name="quality_data_source"), nullable=False, default=DataSource.DEMO)

    __table_args__ = (
        Index("ix_quality_loom_date", "loom_id", "work_date"),
    )


class ManpowerAttendanceLog(Base):
    __tablename__ = "manpower_attendance_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    unit_id = Column(Integer, ForeignKey("unit.unit_id"), nullable=False)
    work_date = Column(Date, nullable=False)
    shift_id = Column(Integer, ForeignKey("shift_master.shift_id"), nullable=False)
    total_headcount = Column(Integer, nullable=False)
    present_count = Column(Integer, nullable=False)
    absent_count = Column(Integer, nullable=False)
    attendance_pct = Column(Numeric(5, 2), nullable=False)
    required_headcount = Column(Integer, nullable=False, default=45)
    shortage_count = Column(Integer, nullable=False, default=0)
    shortage_hours = Column(Numeric(8, 2), nullable=True, default=0.0)
    estimated_loss_metres = Column(Numeric(10, 2), nullable=True, default=0.0)
    source = Column(Enum(DataSource, name="manpower_data_source"), nullable=False, default=DataSource.DEMO)

    __table_args__ = (
        UniqueConstraint("unit_id", "work_date", "shift_id", name="uq_manpower_unit_date_shift"),
    )


# ── 4. Recommendation / Decision Loop / Audit / Auth ────────────────────────────

class DecisionActionRecord(Base):
    """Closed loop decision intelligence tracking:
    OPEN -> ACKNOWLEDGED -> ASSIGNED -> COMPLETED -> VERIFIED"""
    __tablename__ = "decision_action_record"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recommendation_id = Column(String(50), nullable=False, unique=True)
    priority = Column(String(10), nullable=False)  # P1, P2, P3, P4
    category = Column(String(50), nullable=False)
    loom_id = Column(Integer, ForeignKey("loom.loom_id"), nullable=True)
    loom_no = Column(String(30), nullable=True)
    issue = Column(String(255), nullable=False)
    metrics_json = Column(Text, nullable=True)
    evidence_json = Column(Text, nullable=True)
    probable_cause = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=False)
    expected_impact_json = Column(Text, nullable=True)
    confidence = Column(String(20), nullable=False, default="HIGH")  # HIGH, MEDIUM, LOW
    status = Column(String(20), nullable=False, default="OPEN")  # OPEN, ACKNOWLEDGED, ASSIGNED, COMPLETED, VERIFIED
    assignee = Column(String(100), nullable=True)
    action_taken = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    before_metrics = Column(Text, nullable=True)
    after_metrics = Column(Text, nullable=True)

    __table_args__ = (
        Index("ix_decision_status", "status"),
        Index("ix_decision_priority", "priority"),
    )


class SuggestionLog(Base):
    __tablename__ = "suggestion_log"

    suggestion_id: int = Column(Integer, primary_key=True, autoincrement=True)
    rule_code: str = Column(String(50), nullable=False)
    generated_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    work_date: datetime.date = Column(Date, nullable=False)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id"), nullable=False)
    loom_id: int = Column(Integer, ForeignKey("loom.loom_id"), nullable=True)
    employee_id: int = Column(Integer, ForeignKey("employee.employee_id"), nullable=True)
    shift_id: int = Column(Integer, ForeignKey("shift_master.shift_id"), nullable=True)
    style_id: int = Column(Integer, ForeignKey("style.style_id"), nullable=True)
    rupee_impact = Column(Numeric(14, 2), nullable=True)
    confidence: str = Column(Enum(ConfidenceLevel, name="confidence_level"), nullable=False)
    basis: str = Column(Text, nullable=False)
    status: str = Column(Enum(SuggestionStatus, name="suggestion_status"), nullable=False, default=SuggestionStatus.OPEN)
    acted_by: str = Column(String(100), nullable=True)
    acted_at: datetime.datetime = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("ix_suggestion_unit_date", "unit_id", "work_date"),
        Index("ix_suggestion_rule", "rule_code"),
    )


class UserAccount(Base):
    __tablename__ = "user_account"

    user_id: int = Column(Integer, primary_key=True, autoincrement=True)
    username: str = Column(String(100), nullable=False, unique=True)
    password_hash: str = Column(String(255), nullable=False)
    role: str = Column(Enum(UserRole, name="user_role"), nullable=False)
    language_pref: str = Column(String(5), nullable=False, default="en")
    active: bool = Column(Boolean, nullable=False, default=True)
    created_at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class UserUnitScope(Base):
    __tablename__ = "user_unit_scope"

    user_id: int = Column(Integer, ForeignKey("user_account.user_id", ondelete="CASCADE"), primary_key=True)
    unit_id: int = Column(Integer, ForeignKey("unit.unit_id", ondelete="CASCADE"), primary_key=True)


class AuditLog(Base):
    __tablename__ = "audit_log"

    audit_id: int = Column(Integer, primary_key=True, autoincrement=True)
    user_id: int = Column(Integer, ForeignKey("user_account.user_id"), nullable=True)
    action: str = Column(String(100), nullable=False)
    entity: str = Column(String(50), nullable=False)
    entity_id: int = Column(Integer, nullable=True)
    at: datetime.datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    payload: str = Column(Text, nullable=True)
