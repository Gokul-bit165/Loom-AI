"""Add import_batches table and provenance foreign keys

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-26
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Create import_batches table
    op.create_table(
        "import_batches",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "import_timestamp",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("source_file", sa.String(500), nullable=False),
        sa.Column("source_type", sa.String(20), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("dataset_label", sa.String(100), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("imported_by", sa.String(100), nullable=True),
        sa.Column("production_accepted", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("production_rejected", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("breakdown_accepted", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("breakdown_rejected", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("revenue_accepted", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("revenue_rejected", sa.Integer(), nullable=False, server_default="0"),
        sa.CheckConstraint(
            "source_type IN ('synthetic', 'real', 'derived')",
            name="ck_import_batch_source_type_valid",
        ),
    )

    # 2. Add import_batch_id column and foreign key to production_logs, breakdown_events, revenue_logs
    op.add_column("production_logs", sa.Column("import_batch_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_production_import_batch",
        "production_logs",
        "import_batches",
        ["import_batch_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.add_column("breakdown_events", sa.Column("import_batch_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_breakdown_import_batch",
        "breakdown_events",
        "import_batches",
        ["import_batch_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.add_column("revenue_logs", sa.Column("import_batch_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_revenue_import_batch",
        "revenue_logs",
        "import_batches",
        ["import_batch_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_revenue_import_batch", "revenue_logs", type_="foreignkey")
    op.drop_column("revenue_logs", "import_batch_id")

    op.drop_constraint("fk_breakdown_import_batch", "breakdown_events", type_="foreignkey")
    op.drop_column("breakdown_events", "import_batch_id")

    op.drop_constraint("fk_production_import_batch", "production_logs", type_="foreignkey")
    op.drop_column("production_logs", "import_batch_id")

    op.drop_table("import_batches")
