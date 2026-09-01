"""Initial schema — Loom AI V1

Creates the four core tables:
  - machines
  - production_logs
  - breakdown_events
  - revenue_logs

with all constraints, indexes, and check constraints defined in models.py.

Revision ID: 0001
Revises: (none — initial migration)
Create Date: 2026-08-26
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision: str = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── machines ──────────────────────────────────────────────────────────────
    op.create_table(
        "machines",
        sa.Column("machine_id", sa.String(20), primary_key=True, comment="e.g. TOY-01, RF-06"),
        sa.Column("unit", sa.String(50), nullable=False, comment="e.g. Unit I"),
        sa.Column("department", sa.String(50), nullable=False, comment="Weaving | Spinning | Preparatory"),
        sa.Column("machine_type", sa.String(50), nullable=False),
        sa.Column(
            "granularity",
            sa.String(50),
            nullable=False,
            comment="real_grounded | synthetic_loom_number",
        ),
        sa.Column(
            "source_type",
            sa.String(20),
            nullable=False,
            server_default="synthetic",
            comment="synthetic | real | derived",
        ),
        sa.Column("active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.CheckConstraint(
            "granularity IN ('real_grounded', 'synthetic_loom_number')",
            name="ck_machine_granularity_valid",
        ),
        sa.CheckConstraint(
            "source_type IN ('synthetic', 'real', 'derived')",
            name="ck_machine_source_type_valid",
        ),
    )

    # ── production_logs ───────────────────────────────────────────────────────
    op.create_table(
        "production_logs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("date", sa.Date(), nullable=False, comment="Production date"),
        sa.Column("shift", sa.SmallInteger(), nullable=False, comment="1 | 2 | 3"),
        sa.Column(
            "machine_id",
            sa.String(20),
            sa.ForeignKey("machines.machine_id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("target_qty", sa.Numeric(14, 2), nullable=False),
        sa.Column("actual_qty", sa.Numeric(14, 2), nullable=False),
        sa.Column("efficiency_pct", sa.Numeric(6, 2), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.UniqueConstraint("machine_id", "date", "shift", name="uq_production_machine_date_shift"),
        sa.CheckConstraint("shift IN (1, 2, 3)", name="ck_production_shift_valid"),
        sa.CheckConstraint("target_qty > 0", name="ck_production_target_positive"),
        sa.CheckConstraint("actual_qty >= 0", name="ck_production_actual_nonneg"),
        sa.CheckConstraint(
            "efficiency_pct >= 0 AND efficiency_pct <= 110",
            name="ck_production_efficiency_range",
        ),
    )
    op.create_index("ix_production_date", "production_logs", ["date"])
    op.create_index("ix_production_machine_id", "production_logs", ["machine_id"])
    op.create_index("ix_production_date_machine", "production_logs", ["date", "machine_id"])

    # ── breakdown_events ──────────────────────────────────────────────────────
    op.create_table(
        "breakdown_events",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("date", sa.Date(), nullable=False, comment="Date of breakdown"),
        sa.Column("shift", sa.SmallInteger(), nullable=False, comment="1 | 2 | 3"),
        sa.Column(
            "machine_id",
            sa.String(20),
            sa.ForeignKey("machines.machine_id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("reason", sa.String(200), nullable=False),
        sa.Column("duration_minutes", sa.Integer(), nullable=False),
        sa.Column("source_type", sa.String(20), nullable=False, server_default="synthetic"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.CheckConstraint("shift IN (1, 2, 3)", name="ck_breakdown_shift_valid"),
        sa.CheckConstraint("duration_minutes > 0", name="ck_breakdown_duration_positive"),
        sa.CheckConstraint(
            "source_type IN ('synthetic', 'real', 'derived')",
            name="ck_breakdown_source_type_valid",
        ),
    )
    op.create_index("ix_breakdown_date", "breakdown_events", ["date"])
    op.create_index("ix_breakdown_machine_id", "breakdown_events", ["machine_id"])
    op.create_index("ix_breakdown_date_machine", "breakdown_events", ["date", "machine_id"])
    op.create_index("ix_breakdown_reason", "breakdown_events", ["reason"])

    # ── revenue_logs ──────────────────────────────────────────────────────────
    op.create_table(
        "revenue_logs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("date", sa.Date(), nullable=False, comment="Revenue date"),
        sa.Column("shift", sa.SmallInteger(), nullable=False, comment="1 | 2 | 3"),
        sa.Column(
            "machine_id",
            sa.String(20),
            sa.ForeignKey("machines.machine_id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("fabric_style", sa.String(100), nullable=False),
        sa.Column("revenue", sa.Numeric(14, 4), nullable=False, comment="In Indian Rupees"),
        sa.Column("source_type", sa.String(20), nullable=False, server_default="derived"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.CheckConstraint("shift IN (1, 2, 3)", name="ck_revenue_shift_valid"),
        sa.CheckConstraint("revenue >= 0", name="ck_revenue_nonneg"),
        sa.CheckConstraint(
            "source_type IN ('synthetic', 'real', 'derived')",
            name="ck_revenue_source_type_valid",
        ),
    )
    op.create_index("ix_revenue_date", "revenue_logs", ["date"])
    op.create_index("ix_revenue_machine_id", "revenue_logs", ["machine_id"])
    op.create_index("ix_revenue_date_machine", "revenue_logs", ["date", "machine_id"])
    op.create_index("ix_revenue_fabric_style", "revenue_logs", ["fabric_style"])


def downgrade() -> None:
    op.drop_table("revenue_logs")
    op.drop_table("breakdown_events")
    op.drop_table("production_logs")
    op.drop_table("machines")
