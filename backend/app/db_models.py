"""
Loom AI — SQLAlchemy ORM models (Enterprise & V1).

Design principles
-----------------
1. PROVENANCE FIRST: every fact table carries source_type, data_source, and import_batch_id
   so the UI and AI can always tell a manager whether a number came from real PLC measurements,
   ERP systems, manual operator logs, derived calculations, or ML predictions.

2. EXTENSIBILITY: normalized master tables (Loom, Shift, Fabric, Customer, Order)
   and operational records (Production, Breakdown, Quality, Energy, Maintenance, Sensor Data).

3. CONSTRAINTS IN THE DB: enforced at the PostgreSQL level, not only in app code.

4. NUMERIC PRECISION: revenue and quantities use Numeric (fixed-point),
   not Float, to avoid floating-point rounding surprises in financial and production totals.
"""
from datetime import datetime, time, date

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    Column,
    Date,
    DateTime,
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


# ─────────────────────────────────────────────────────────────────────────────
# 0. Import Batch — provenance anchor for every import
# ─────────────────────────────────────────────────────────────────────────────

class ImportBatch(Base):
    """
    One record per CSV import run.
    """
    __tablename__ = "import_batches"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    import_timestamp: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    source_file: str = Column(String(500), nullable=False, comment="Filename of the imported CSV/Excel")
    source_type: str = Column(
        String(20),
        nullable=False,
        comment="synthetic | real | derived",
    )
    is_demo: bool = Column(
        Boolean,
        nullable=False,
        default=True,
        comment="True = synthetic/demo data. UI must display a clear warning.",
    )
    dataset_label: str = Column(
        String(100),
        nullable=True,
        comment="Human-readable label shown in the UI data-provenance badge",
    )
    notes: str = Column(Text, nullable=True)
    imported_by: str = Column(String(100), nullable=True)

    production_accepted: int = Column(Integer, nullable=False, default=0)
    production_rejected: int = Column(Integer, nullable=False, default=0)
    breakdown_accepted: int = Column(Integer, nullable=False, default=0)
    breakdown_rejected: int = Column(Integer, nullable=False, default=0)
    revenue_accepted: int = Column(Integer, nullable=False, default=0)
    revenue_rejected: int = Column(Integer, nullable=False, default=0)

    __table_args__ = (
        CheckConstraint(
            "source_type IN ('synthetic', 'real', 'derived')",
            name="ck_import_batch_source_type_valid",
        ),
    )

    def __repr__(self) -> str:
        label = "DEMO" if self.is_demo else "REAL"
        return f"<ImportBatch {self.id} [{label}] {self.source_file} @ {self.import_timestamp}>"


# ─────────────────────────────────────────────────────────────────────────────
# 1. Master Data Tables
# ─────────────────────────────────────────────────────────────────────────────

class ShiftMaster(Base):
    """
    Standard operating shifts (e.g. S1, S2, S3).
    """
    __tablename__ = "shift_master"

    shift_id: str = Column(String(10), primary_key=True)
    shift_name: str = Column(String(50), nullable=False)
    start_time: time = Column(Time, nullable=False)
    end_time: time = Column(Time, nullable=False)

    def __repr__(self) -> str:
        return f"<ShiftMaster {self.shift_id}: {self.shift_name}>"


class FabricMaster(Base):
    """
    Fabric style catalog and standard rates.
    """
    __tablename__ = "fabric_master"

    fabric_style_id: str = Column(String(30), primary_key=True)
    fabric_style_name: str = Column(String(100), nullable=False)
    fabric_type: str = Column(String(100), nullable=True)
    yarn_count: str = Column(String(50), nullable=True)
    width_cm = Column(Numeric(10, 2), nullable=True)
    gsm = Column(Numeric(10, 2), nullable=True)
    standard_rate_per_kg = Column(Numeric(12, 2), nullable=True)
    standard_rate_per_meter = Column(Numeric(12, 2), nullable=True)

    orders = relationship("OrderMaster", back_populates="fabric_style")
    production_logs = relationship("ProductionLog", back_populates="fabric_style")

    def __repr__(self) -> str:
        return f"<FabricMaster {self.fabric_style_id}: {self.fabric_style_name}>"


class CustomerMaster(Base):
    """
    Customer master catalog.
    """
    __tablename__ = "customer_master"

    customer_id: str = Column(String(30), primary_key=True)
    customer_name: str = Column(String(150), nullable=False)
    customer_type: str = Column(String(50), nullable=True)

    orders = relationship("OrderMaster", back_populates="customer")

    def __repr__(self) -> str:
        return f"<CustomerMaster {self.customer_id}: {self.customer_name}>"


class OrderMaster(Base):
    """
    Customer sales order records.
    """
    __tablename__ = "order_master"

    order_id: str = Column(String(30), primary_key=True)
    customer_id: str = Column(String(30), ForeignKey("customer_master.customer_id", ondelete="RESTRICT"), nullable=True)
    fabric_style_id: str = Column(String(30), ForeignKey("fabric_master.fabric_style_id", ondelete="RESTRICT"), nullable=True)
    order_date: date = Column(Date, nullable=False)
    required_date: date = Column(Date, nullable=True)
    order_quantity_kg = Column(Numeric(14, 2), nullable=True)
    order_quantity_meter = Column(Numeric(14, 2), nullable=True)
    selling_rate_per_kg = Column(Numeric(12, 2), nullable=False)
    selling_rate_per_meter = Column(Numeric(12, 2), nullable=True)
    order_status: str = Column(String(30), nullable=False, default="IN_PROGRESS")

    customer = relationship("CustomerMaster", back_populates="orders")
    fabric_style = relationship("FabricMaster", back_populates="orders")
    production_logs = relationship("ProductionLog", back_populates="order")

    def __repr__(self) -> str:
        return f"<OrderMaster {self.order_id} ({self.order_status})>"


# ─────────────────────────────────────────────────────────────────────────────
# 2. Machine Master
# ─────────────────────────────────────────────────────────────────────────────

class Machine(Base):
    """
    One row per physical (or synthetic) machine / loom.
    """
    __tablename__ = "machines"

    machine_id: str = Column(String(20), primary_key=True, comment="e.g. TOY-01, RF-06, VTX-12")
    loom_number: str = Column(String(50), nullable=True)
    unit: str = Column(String(50), nullable=False, comment="e.g. Unit I")
    department: str = Column(String(50), nullable=False, comment="Weaving | Spinning | Preparatory")
    machine_type: str = Column(String(50), nullable=False)
    machine_model: str = Column(String(100), nullable=True)
    manufacturer: str = Column(String(100), nullable=True)
    installation_date: date = Column(Date, nullable=True)
    status: str = Column(String(30), nullable=False, default="ACTIVE")
    granularity: str = Column(
        String(50),
        nullable=False,
        comment="real_grounded | synthetic_loom_number",
    )
    source_type: str = Column(
        String(20),
        nullable=False,
        default="synthetic",
        comment="synthetic | real | derived",
    )
    active: bool = Column(Boolean, nullable=False, default=True)
    created_at: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    production_logs = relationship("ProductionLog", back_populates="machine", lazy="dynamic")
    breakdown_events = relationship("BreakdownEvent", back_populates="machine", lazy="dynamic")
    revenue_logs = relationship("RevenueLog", back_populates="machine", lazy="dynamic")
    quality_records = relationship("QualityRecord", back_populates="machine", lazy="dynamic")
    energy_records = relationship("LoomEnergy", back_populates="machine", lazy="dynamic")
    maintenance_records = relationship("MaintenanceRecord", back_populates="machine", lazy="dynamic")
    sensor_records = relationship("MachineSensorData", back_populates="machine", lazy="dynamic")

    __table_args__ = (
        CheckConstraint(
            "granularity IN ('real_grounded', 'synthetic_loom_number')",
            name="ck_machine_granularity_valid",
        ),
        CheckConstraint(
            "source_type IN ('synthetic', 'real', 'derived')",
            name="ck_machine_source_type_valid",
        ),
    )

    def __repr__(self) -> str:
        return f"<Machine {self.machine_id} ({self.machine_type}, {self.department})>"


# ─────────────────────────────────────────────────────────────────────────────
# 3. Production Log
# ─────────────────────────────────────────────────────────────────────────────

class ProductionLog(Base):
    """
    One record = one machine × one date × one shift.
    """
    __tablename__ = "production_logs"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    date: date = Column(Date, nullable=False, comment="Production date")
    shift: int = Column(SmallInteger, nullable=False, comment="1 | 2 | 3")
    machine_id: str = Column(
        String(20),
        ForeignKey("machines.machine_id", ondelete="RESTRICT"),
        nullable=False,
    )
    fabric_style_id: str = Column(
        String(30),
        ForeignKey("fabric_master.fabric_style_id", ondelete="SET NULL"),
        nullable=True,
    )
    order_id: str = Column(
        String(30),
        ForeignKey("order_master.order_id", ondelete="SET NULL"),
        nullable=True,
    )

    target_qty = Column(Numeric(14, 2), nullable=False, comment="Target quantity (meters/kg)")
    actual_qty = Column(Numeric(14, 2), nullable=False, comment="Actual quantity produced")
    efficiency_pct = Column(Numeric(6, 2), nullable=False, comment="actual / target × 100")

    target_production_kg = Column(Numeric(14, 2), nullable=True)
    actual_production_kg = Column(Numeric(14, 2), nullable=True)
    target_production_meter = Column(Numeric(14, 2), nullable=True)
    actual_production_meter = Column(Numeric(14, 2), nullable=True)

    running_hours = Column(Numeric(8, 2), nullable=False, default=8.0)
    available_hours = Column(Numeric(8, 2), nullable=False, default=8.0)

    machine_speed_rpm = Column(Numeric(10, 2), nullable=True)
    total_picks = Column(BigInteger, nullable=True)
    kilo_pick = Column(Numeric(12, 4), nullable=True)

    warp_break_count: int = Column(Integer, nullable=False, default=0)
    weft_break_count: int = Column(Integer, nullable=False, default=0)

    data_source: str = Column(String(30), nullable=False, default="MACHINE")
    import_batch_id: int = Column(
        Integer,
        ForeignKey("import_batches.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    machine = relationship("Machine", back_populates="production_logs")
    fabric_style = relationship("FabricMaster", back_populates="production_logs")
    order = relationship("OrderMaster", back_populates="production_logs")
    import_batch = relationship("ImportBatch")
    breakdowns = relationship("BreakdownEvent", back_populates="production_log")
    quality_records = relationship("QualityRecord", back_populates="production_log")

    __table_args__ = (
        UniqueConstraint(
            "machine_id", "date", "shift",
            name="uq_production_machine_date_shift",
        ),
        CheckConstraint("shift IN (1, 2, 3)", name="ck_production_shift_valid"),
        CheckConstraint("target_qty >= 0", name="ck_production_target_nonneg"),
        CheckConstraint("actual_qty >= 0", name="ck_production_actual_nonneg"),
        CheckConstraint(
            "efficiency_pct >= 0 AND efficiency_pct <= 110",
            name="ck_production_efficiency_range",
        ),
        Index("ix_production_date", "date"),
        Index("ix_production_machine_id", "machine_id"),
        Index("ix_production_date_machine", "date", "machine_id"),
    )

    def __repr__(self) -> str:
        return f"<ProductionLog {self.machine_id} {self.date} S{self.shift}>"


# ─────────────────────────────────────────────────────────────────────────────
# 4. Breakdown Event
# ─────────────────────────────────────────────────────────────────────────────

class BreakdownEvent(Base):
    """
    One record = one breakdown event on one machine in one shift.
    """
    __tablename__ = "breakdown_events"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    date: date = Column(Date, nullable=False)
    shift: int = Column(SmallInteger, nullable=False, comment="1 | 2 | 3")
    machine_id: str = Column(
        String(20),
        ForeignKey("machines.machine_id", ondelete="RESTRICT"),
        nullable=False,
    )
    production_id: int = Column(
        Integer,
        ForeignKey("production_logs.id", ondelete="SET NULL"),
        nullable=True,
    )

    start_time: datetime = Column(DateTime(timezone=True), nullable=True)
    end_time: datetime = Column(DateTime(timezone=True), nullable=True)

    reason: str = Column(String(200), nullable=False)
    breakdown_reason_code: str = Column(String(30), nullable=True)
    breakdown_category: str = Column(String(50), nullable=True)
    maintenance_action: str = Column(String(255), nullable=True)
    root_cause: str = Column(String(255), nullable=True)
    production_loss_kg = Column(Numeric(14, 2), nullable=True)

    duration_minutes: int = Column(Integer, nullable=False, comment="Downtime in minutes (> 0)")
    source_type: str = Column(String(20), nullable=False, default="synthetic")
    data_source: str = Column(String(30), nullable=False, default="OPERATOR")

    import_batch_id: int = Column(
        Integer,
        ForeignKey("import_batches.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    machine = relationship("Machine", back_populates="breakdown_events")
    production_log = relationship("ProductionLog", back_populates="breakdowns")
    import_batch = relationship("ImportBatch")

    __table_args__ = (
        CheckConstraint("shift IN (1, 2, 3)", name="ck_breakdown_shift_valid"),
        CheckConstraint("duration_minutes > 0", name="ck_breakdown_duration_positive"),
        CheckConstraint(
            "source_type IN ('synthetic', 'real', 'derived')",
            name="ck_breakdown_source_type_valid",
        ),
        Index("ix_breakdown_date", "date"),
        Index("ix_breakdown_machine_id", "machine_id"),
        Index("ix_breakdown_date_machine", "date", "machine_id"),
        Index("ix_breakdown_reason", "reason"),
    )

    def __repr__(self) -> str:
        return f"<BreakdownEvent {self.machine_id} {self.date} S{self.shift} {self.reason[:30]}>"


# ─────────────────────────────────────────────────────────────────────────────
# 5. Revenue Log
# ─────────────────────────────────────────────────────────────────────────────

class RevenueLog(Base):
    """
    One record = one fabric-style revenue contribution.
    """
    __tablename__ = "revenue_logs"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    date: date = Column(Date, nullable=False)
    shift: int = Column(SmallInteger, nullable=False, comment="1 | 2 | 3")
    machine_id: str = Column(
        String(20),
        ForeignKey("machines.machine_id", ondelete="RESTRICT"),
        nullable=False,
    )
    fabric_style: str = Column(String(100), nullable=False)
    revenue = Column(Numeric(14, 4), nullable=False, comment="Revenue in Indian Rupees (Rs)")
    source_type: str = Column(String(20), nullable=False, default="derived")
    import_batch_id: int = Column(
        Integer,
        ForeignKey("import_batches.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    machine = relationship("Machine", back_populates="revenue_logs")
    import_batch = relationship("ImportBatch")

    __table_args__ = (
        CheckConstraint("shift IN (1, 2, 3)", name="ck_revenue_shift_valid"),
        CheckConstraint("revenue >= 0", name="ck_revenue_nonneg"),
        CheckConstraint(
            "source_type IN ('synthetic', 'real', 'derived')",
            name="ck_revenue_source_type_valid",
        ),
        Index("ix_revenue_date", "date"),
        Index("ix_revenue_machine_id", "machine_id"),
        Index("ix_revenue_date_machine", "date", "machine_id"),
        Index("ix_revenue_fabric_style", "fabric_style"),
    )

    def __repr__(self) -> str:
        return f"<RevenueLog {self.machine_id} {self.date} S{self.shift} {self.fabric_style}>"


# ─────────────────────────────────────────────────────────────────────────────
# 6. Quality Records
# ─────────────────────────────────────────────────────────────────────────────

class QualityRecord(Base):
    """
    Shift and machine quality inspection, defects, and grade record.
    """
    __tablename__ = "quality_records"

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    production_id: int = Column(Integer, ForeignKey("production_logs.id", ondelete="SET NULL"), nullable=True)
    machine_id: str = Column(String(20), ForeignKey("machines.machine_id", ondelete="RESTRICT"), nullable=False)
    production_date: date = Column(Date, nullable=False)
    fabric_style_id: str = Column(String(30), ForeignKey("fabric_master.fabric_style_id", ondelete="SET NULL"), nullable=True)

    defect_count: int = Column(Integer, nullable=False, default=0)
    warp_defect_count: int = Column(Integer, nullable=False, default=0)
    weft_defect_count: int = Column(Integer, nullable=False, default=0)

    rejected_quantity_kg = Column(Numeric(14, 2), nullable=False, default=0)
    rejected_quantity_meter = Column(Numeric(14, 2), nullable=False, default=0)
    quality_grade: str = Column(String(30), nullable=False, default="A_GRADE")

    data_source: str = Column(String(30), nullable=False, default="OPERATOR")
    created_at: datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    machine = relationship("Machine", back_populates="quality_records")
    production_log = relationship("ProductionLog", back_populates="quality_records")

    __table_args__ = (
        Index("ix_quality_records_date", "production_date"),
        Index("ix_quality_records_machine", "machine_id"),
    )

    def __repr__(self) -> str:
        return f"<QualityRecord {self.machine_id} {self.production_date} Grade={self.quality_grade}>"


# ─────────────────────────────────────────────────────────────────────────────
# 7. Energy Records
# ─────────────────────────────────────────────────────────────────────────────

class LoomEnergy(Base):
    """
    Loom electricity and compressed air consumption per shift.
    """
    __tablename__ = "loom_energy"

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    machine_id: str = Column(String(20), ForeignKey("machines.machine_id", ondelete="RESTRICT"), nullable=False)
    energy_date: date = Column(Date, nullable=False)
    shift: int = Column(SmallInteger, nullable=False)

    electricity_kwh = Column(Numeric(14, 3), nullable=False)
    compressed_air_consumption = Column(Numeric(14, 3), nullable=True)
    air_pressure_bar = Column(Numeric(10, 3), nullable=True)

    data_source: str = Column(String(30), nullable=False, default="MACHINE")
    created_at: datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    machine = relationship("Machine", back_populates="energy_records")

    __table_args__ = (
        CheckConstraint("shift IN (1, 2, 3)", name="ck_energy_shift_valid"),
        CheckConstraint("electricity_kwh >= 0", name="ck_energy_electricity_nonneg"),
        Index("ix_energy_machine_date", "machine_id", "energy_date"),
    )

    def __repr__(self) -> str:
        return f"<LoomEnergy {self.machine_id} {self.energy_date} S{self.shift}: {self.electricity_kwh} kWh>"


# ─────────────────────────────────────────────────────────────────────────────
# 8. Maintenance Records
# ─────────────────────────────────────────────────────────────────────────────

class MaintenanceRecord(Base):
    """
    Maintenance interventions and cost tracking.
    """
    __tablename__ = "maintenance_records"

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    machine_id: str = Column(String(20), ForeignKey("machines.machine_id", ondelete="RESTRICT"), nullable=False)
    maintenance_date: date = Column(Date, nullable=False)

    maintenance_type: str = Column(String(50), nullable=False)
    maintenance_reason: str = Column(String(150), nullable=True)
    maintenance_action: str = Column(String(255), nullable=True)

    downtime_minutes = Column(Numeric(10, 2), nullable=True)
    maintenance_cost = Column(Numeric(14, 2), nullable=True)
    technician: str = Column(String(100), nullable=True)

    created_at: datetime = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    machine = relationship("Machine", back_populates="maintenance_records")

    __table_args__ = (
        Index("ix_maintenance_machine_date", "machine_id", "maintenance_date"),
    )

    def __repr__(self) -> str:
        return f"<MaintenanceRecord {self.machine_id} {self.maintenance_date} {self.maintenance_type}>"


# ─────────────────────────────────────────────────────────────────────────────
# 9. Machine Sensor Data (IoT / PLC)
# ─────────────────────────────────────────────────────────────────────────────

class MachineSensorData(Base):
    """
    High-frequency PLC telemetry for vibration, temperature, speed, and pressure.
    """
    __tablename__ = "machine_sensor_data"

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    machine_id: str = Column(String(20), ForeignKey("machines.machine_id", ondelete="RESTRICT"), nullable=False)
    recorded_at: datetime = Column(DateTime(timezone=True), nullable=False)

    machine_speed_rpm = Column(Numeric(10, 2), nullable=True)
    air_pressure_bar = Column(Numeric(10, 3), nullable=True)
    temperature_celsius = Column(Numeric(10, 2), nullable=True)
    vibration_level = Column(Numeric(10, 3), nullable=True)

    running_status: str = Column(String(30), nullable=False, default="RUNNING")
    alarm_code: str = Column(String(50), nullable=True)
    data_source: str = Column(String(30), nullable=False, default="MACHINE")

    machine = relationship("Machine", back_populates="sensor_records")

    __table_args__ = (
        Index("ix_sensor_machine_time", "machine_id", "recorded_at"),
    )

    def __repr__(self) -> str:
        return f"<MachineSensorData {self.machine_id} @ {self.recorded_at} {self.running_status}>"
