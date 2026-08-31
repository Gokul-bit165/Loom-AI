"""Enterprise relational schema & data dependency map

Revision ID: 0003
Revises: 0002
Create Date: 2026-08-28
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision: str = "0003"
down_revision: str | None = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── 1. Create Master Tables ───────────────────────────────────────────────
    
    # shift_master
    op.create_table(
        "shift_master",
        sa.Column("shift_id", sa.String(10), primary_key=True),
        sa.Column("shift_name", sa.String(50), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
    )

    # fabric_master
    op.create_table(
        "fabric_master",
        sa.Column("fabric_style_id", sa.String(30), primary_key=True),
        sa.Column("fabric_style_name", sa.String(100), nullable=False),
        sa.Column("fabric_type", sa.String(100), nullable=True),
        sa.Column("yarn_count", sa.String(50), nullable=True),
        sa.Column("width_cm", sa.Numeric(10, 2), nullable=True),
        sa.Column("gsm", sa.Numeric(10, 2), nullable=True),
        sa.Column("standard_rate_per_kg", sa.Numeric(12, 2), nullable=True),
        sa.Column("standard_rate_per_meter", sa.Numeric(12, 2), nullable=True),
    )

    # customer_master
    op.create_table(
        "customer_master",
        sa.Column("customer_id", sa.String(30), primary_key=True),
        sa.Column("customer_name", sa.String(150), nullable=False),
        sa.Column("customer_type", sa.String(50), nullable=True),
    )

    # order_master
    op.create_table(
        "order_master",
        sa.Column("order_id", sa.String(30), primary_key=True),
        sa.Column(
            "customer_id",
            sa.String(30),
            sa.ForeignKey("customer_master.customer_id", ondelete="RESTRICT"),
            nullable=True,
        ),
        sa.Column(
            "fabric_style_id",
            sa.String(30),
            sa.ForeignKey("fabric_master.fabric_style_id", ondelete="RESTRICT"),
            nullable=True,
        ),
        sa.Column("order_date", sa.Date(), nullable=False),
        sa.Column("required_date", sa.Date(), nullable=True),
        sa.Column("order_quantity_kg", sa.Numeric(14, 2), nullable=True),
        sa.Column("order_quantity_meter", sa.Numeric(14, 2), nullable=True),
        sa.Column("selling_rate_per_kg", sa.Numeric(12, 2), nullable=False),
        sa.Column("selling_rate_per_meter", sa.Numeric(12, 2), nullable=True),
        sa.Column("order_status", sa.String(30), nullable=False, server_default="IN_PROGRESS"),
    )

    # ── 1b. Loosen production target constraint (0 → allowed, matches ORM) ─────
    op.drop_constraint("ck_production_target_positive", "production_logs", type_="check")
    op.create_check_constraint(
        "ck_production_target_nonneg", "production_logs", "target_qty >= 0"
    )

    # ── 2. Extend machines table ──────────────────────────────────────────────
    op.add_column("machines", sa.Column("loom_number", sa.String(50), nullable=True))
    op.add_column("machines", sa.Column("machine_model", sa.String(100), nullable=True))
    op.add_column("machines", sa.Column("manufacturer", sa.String(100), nullable=True))
    op.add_column("machines", sa.Column("installation_date", sa.Date(), nullable=True))
    op.add_column("machines", sa.Column("status", sa.String(30), nullable=False, server_default="ACTIVE"))

    # ── 3. Extend production_logs table ───────────────────────────────────────
    op.add_column(
        "production_logs",
        sa.Column(
            "fabric_style_id",
            sa.String(30),
            sa.ForeignKey("fabric_master.fabric_style_id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.add_column(
        "production_logs",
        sa.Column(
            "order_id",
            sa.String(30),
            sa.ForeignKey("order_master.order_id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.add_column("production_logs", sa.Column("target_production_kg", sa.Numeric(14, 2), nullable=True))
    op.add_column("production_logs", sa.Column("actual_production_kg", sa.Numeric(14, 2), nullable=True))
    op.add_column("production_logs", sa.Column("target_production_meter", sa.Numeric(14, 2), nullable=True))
    op.add_column("production_logs", sa.Column("actual_production_meter", sa.Numeric(14, 2), nullable=True))
    op.add_column("production_logs", sa.Column("running_hours", sa.Numeric(8, 2), nullable=False, server_default="8.0"))
    op.add_column("production_logs", sa.Column("available_hours", sa.Numeric(8, 2), nullable=False, server_default="8.0"))
    op.add_column("production_logs", sa.Column("machine_speed_rpm", sa.Numeric(10, 2), nullable=True))
    op.add_column("production_logs", sa.Column("total_picks", sa.BigInteger(), nullable=True))
    op.add_column("production_logs", sa.Column("kilo_pick", sa.Numeric(12, 4), nullable=True))
    op.add_column("production_logs", sa.Column("warp_break_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("production_logs", sa.Column("weft_break_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("production_logs", sa.Column("data_source", sa.String(30), nullable=False, server_default="MACHINE"))

    # ── 4. Extend breakdown_events table ──────────────────────────────────────
    op.add_column(
        "breakdown_events",
        sa.Column(
            "production_id",
            sa.Integer(),
            sa.ForeignKey("production_logs.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.add_column("breakdown_events", sa.Column("start_time", sa.DateTime(timezone=True), nullable=True))
    op.add_column("breakdown_events", sa.Column("end_time", sa.DateTime(timezone=True), nullable=True))
    op.add_column("breakdown_events", sa.Column("breakdown_reason_code", sa.String(30), nullable=True))
    op.add_column("breakdown_events", sa.Column("breakdown_category", sa.String(50), nullable=True))
    op.add_column("breakdown_events", sa.Column("maintenance_action", sa.String(255), nullable=True))
    op.add_column("breakdown_events", sa.Column("root_cause", sa.String(255), nullable=True))
    op.add_column("breakdown_events", sa.Column("production_loss_kg", sa.Numeric(14, 2), nullable=True))
    op.add_column("breakdown_events", sa.Column("data_source", sa.String(30), nullable=False, server_default="OPERATOR"))

    # ── 5. Create New Domain Tables ───────────────────────────────────────────
    
    # quality_records
    op.create_table(
        "quality_records",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column(
            "production_id",
            sa.Integer(),
            sa.ForeignKey("production_logs.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "machine_id",
            sa.String(20),
            sa.ForeignKey("machines.machine_id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("production_date", sa.Date(), nullable=False),
        sa.Column(
            "fabric_style_id",
            sa.String(30),
            sa.ForeignKey("fabric_master.fabric_style_id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("defect_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("warp_defect_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("weft_defect_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("rejected_quantity_kg", sa.Numeric(14, 2), nullable=False, server_default="0"),
        sa.Column("rejected_quantity_meter", sa.Numeric(14, 2), nullable=False, server_default="0"),
        sa.Column("quality_grade", sa.String(30), nullable=False, server_default="A_GRADE"),
        sa.Column("data_source", sa.String(30), nullable=False, server_default="OPERATOR"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_quality_records_date", "quality_records", ["production_date"])
    op.create_index("ix_quality_records_machine", "quality_records", ["machine_id"])

    # loom_energy
    op.create_table(
        "loom_energy",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column(
            "machine_id",
            sa.String(20),
            sa.ForeignKey("machines.machine_id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("energy_date", sa.Date(), nullable=False),
        sa.Column("shift", sa.SmallInteger(), nullable=False),
        sa.Column("electricity_kwh", sa.Numeric(14, 3), nullable=False),
        sa.Column("compressed_air_consumption", sa.Numeric(14, 3), nullable=True),
        sa.Column("air_pressure_bar", sa.Numeric(10, 3), nullable=True),
        sa.Column("data_source", sa.String(30), nullable=False, server_default="MACHINE"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("shift IN (1, 2, 3)", name="ck_energy_shift_valid"),
        sa.CheckConstraint("electricity_kwh >= 0", name="ck_energy_electricity_nonneg"),
    )
    op.create_index("ix_energy_machine_date", "loom_energy", ["machine_id", "energy_date"])

    # maintenance_records
    op.create_table(
        "maintenance_records",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column(
            "machine_id",
            sa.String(20),
            sa.ForeignKey("machines.machine_id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("maintenance_date", sa.Date(), nullable=False),
        sa.Column("maintenance_type", sa.String(50), nullable=False),
        sa.Column("maintenance_reason", sa.String(150), nullable=True),
        sa.Column("maintenance_action", sa.String(255), nullable=True),
        sa.Column("downtime_minutes", sa.Numeric(10, 2), nullable=True),
        sa.Column("maintenance_cost", sa.Numeric(14, 2), nullable=True),
        sa.Column("technician", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_maintenance_machine_date", "maintenance_records", ["machine_id", "maintenance_date"])

    # machine_sensor_data
    op.create_table(
        "machine_sensor_data",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column(
            "machine_id",
            sa.String(20),
            sa.ForeignKey("machines.machine_id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("recorded_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("machine_speed_rpm", sa.Numeric(10, 2), nullable=True),
        sa.Column("air_pressure_bar", sa.Numeric(10, 3), nullable=True),
        sa.Column("temperature_celsius", sa.Numeric(10, 2), nullable=True),
        sa.Column("vibration_level", sa.Numeric(10, 3), nullable=True),
        sa.Column("running_status", sa.String(30), nullable=False, server_default="RUNNING"),
        sa.Column("alarm_code", sa.String(50), nullable=True),
        sa.Column("data_source", sa.String(30), nullable=False, server_default="MACHINE"),
    )
    op.create_index("ix_sensor_machine_time", "machine_sensor_data", ["machine_id", "recorded_at"])


def downgrade() -> None:
    op.drop_constraint("ck_production_target_nonneg", "production_logs", type_="check")
    op.create_check_constraint(
        "ck_production_target_positive", "production_logs", "target_qty > 0"
    )

    op.drop_table("machine_sensor_data")
    op.drop_table("maintenance_records")
    op.drop_table("loom_energy")
    op.drop_table("quality_records")

    op.drop_column("breakdown_events", "data_source")
    op.drop_column("breakdown_events", "production_loss_kg")
    op.drop_column("breakdown_events", "root_cause")
    op.drop_column("breakdown_events", "maintenance_action")
    op.drop_column("breakdown_events", "breakdown_category")
    op.drop_column("breakdown_events", "breakdown_reason_code")
    op.drop_column("breakdown_events", "end_time")
    op.drop_column("breakdown_events", "start_time")
    op.drop_column("breakdown_events", "production_id")

    op.drop_column("production_logs", "data_source")
    op.drop_column("production_logs", "weft_break_count")
    op.drop_column("production_logs", "warp_break_count")
    op.drop_column("production_logs", "kilo_pick")
    op.drop_column("production_logs", "total_picks")
    op.drop_column("production_logs", "machine_speed_rpm")
    op.drop_column("production_logs", "available_hours")
    op.drop_column("production_logs", "running_hours")
    op.drop_column("production_logs", "actual_production_meter")
    op.drop_column("production_logs", "target_production_meter")
    op.drop_column("production_logs", "actual_production_kg")
    op.drop_column("production_logs", "target_production_kg")
    op.drop_column("production_logs", "order_id")
    op.drop_column("production_logs", "fabric_style_id")

    op.drop_column("machines", "status")
    op.drop_column("machines", "installation_date")
    op.drop_column("machines", "manufacturer")
    op.drop_column("machines", "machine_model")
    op.drop_column("machines", "loom_number")

    op.drop_table("order_master")
    op.drop_table("customer_master")
    op.drop_table("fabric_master")
    op.drop_table("shift_master")
