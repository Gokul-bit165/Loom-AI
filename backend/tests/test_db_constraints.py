"""
Database constraint tests for Loom AI V1.

Tests covered
-------------
Machine
  - valid machine inserts
  - invalid granularity is rejected by DB check constraint
  - invalid source_type is rejected by DB check constraint

ProductionLog
  - valid production row inserts
  - duplicate (machine_id + date + shift) raises IntegrityError
  - foreign key on non-existent machine_id raises IntegrityError
  - invalid shift value raises IntegrityError
  - negative actual_qty raises IntegrityError
  - zero or negative target_qty raises IntegrityError
  - efficiency_pct > 110 raises IntegrityError

BreakdownEvent
  - multiple breakdown events per machine per shift are ALLOWED
  - foreign key on non-existent machine_id raises IntegrityError
  - duration_minutes = 0 raises IntegrityError
  - negative duration_minutes raises IntegrityError
  - invalid shift raises IntegrityError

RevenueLog
  - valid revenue row inserts
  - multiple revenue rows per machine per shift are ALLOWED
  - foreign key on non-existent machine_id raises IntegrityError
  - negative revenue raises IntegrityError
  - invalid shift raises IntegrityError

Cross-table
  - deleting a machine that has production rows is BLOCKED (ondelete=RESTRICT)
"""
from __future__ import annotations

import datetime

import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Machine, ProductionLog, BreakdownEvent, RevenueLog

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

TODAY = datetime.date(2026, 8, 26)


def make_production(machine_id: str, *, date=TODAY, shift: int = 1) -> ProductionLog:
    return ProductionLog(
        date=date,
        shift=shift,
        machine_id=machine_id,
        target_qty=1000,
        actual_qty=950,
        efficiency_pct=95.00,
    )


def make_breakdown(machine_id: str, *, date=TODAY, shift: int = 1) -> BreakdownEvent:
    return BreakdownEvent(
        date=date,
        shift=shift,
        machine_id=machine_id,
        reason="Weft break PBM",
        duration_minutes=30,
        source_type="synthetic",
    )


def make_revenue(machine_id: str, *, date=TODAY, shift: int = 1) -> RevenueLog:
    return RevenueLog(
        date=date,
        shift=shift,
        machine_id=machine_id,
        fabric_style="Excel Slub",
        revenue=4500.00,
        source_type="derived",
    )


# ─────────────────────────────────────────────────────────────────────────────
# Machine tests
# ─────────────────────────────────────────────────────────────────────────────

class TestMachine:

    def test_valid_weaving_machine(self, db_session: Session) -> None:
        m = Machine(
            machine_id="TOY-99",
            unit="Unit I",
            department="Weaving",
            machine_type="Toyota",
            granularity="synthetic_loom_number",
            source_type="synthetic",
            active=True,
        )
        db_session.add(m)
        db_session.flush()
        assert db_session.get(Machine, "TOY-99") is not None

    def test_valid_spinning_machine(self, db_session: Session) -> None:
        m = Machine(
            machine_id="RF-99",
            unit="Unit I",
            department="Spinning",
            machine_type="RingFrame",
            granularity="real_grounded",
            source_type="synthetic",
            active=True,
        )
        db_session.add(m)
        db_session.flush()
        fetched = db_session.get(Machine, "RF-99")
        assert fetched is not None
        assert fetched.granularity == "real_grounded"

    def test_invalid_granularity_rejected(self, db_session: Session) -> None:
        """DB check constraint must reject unknown granularity values."""
        m = Machine(
            machine_id="BAD-01",
            unit="Unit I",
            department="Weaving",
            machine_type="Toyota",
            granularity="made_up_value",  # invalid
            source_type="synthetic",
            active=True,
        )
        db_session.add(m)
        with pytest.raises(IntegrityError, match="ck_machine_granularity_valid"):
            db_session.flush()

    def test_invalid_source_type_rejected(self, db_session: Session) -> None:
        """DB check constraint must reject unknown source_type values."""
        m = Machine(
            machine_id="BAD-02",
            unit="Unit I",
            department="Weaving",
            machine_type="Toyota",
            granularity="synthetic_loom_number",
            source_type="invented",  # invalid
            active=True,
        )
        db_session.add(m)
        with pytest.raises(IntegrityError, match="ck_machine_source_type_valid"):
            db_session.flush()

    def test_created_at_auto_populated(self, db_session: Session, sample_machine: Machine) -> None:
        db_session.refresh(sample_machine)
        assert sample_machine.created_at is not None


# ─────────────────────────────────────────────────────────────────────────────
# ProductionLog tests
# ─────────────────────────────────────────────────────────────────────────────

class TestProductionLog:

    def test_valid_production_row(self, db_session: Session, sample_machine: Machine) -> None:
        p = make_production(sample_machine.machine_id)
        db_session.add(p)
        db_session.flush()
        assert p.id is not None

    def test_duplicate_machine_date_shift_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        """Unique constraint uq_production_machine_date_shift must fire."""
        p1 = make_production(sample_machine.machine_id, shift=1)
        p2 = make_production(sample_machine.machine_id, shift=1)  # same key
        db_session.add(p1)
        db_session.flush()
        db_session.add(p2)
        with pytest.raises(IntegrityError, match="uq_production_machine_date_shift"):
            db_session.flush()

    def test_different_shifts_allowed(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        """Same machine same date but different shifts should be fine."""
        for shift in (1, 2, 3):
            db_session.add(make_production(sample_machine.machine_id, shift=shift))
        db_session.flush()  # must not raise

    def test_different_dates_allowed(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        for delta in range(3):
            d = TODAY + datetime.timedelta(days=delta)
            db_session.add(make_production(sample_machine.machine_id, date=d))
        db_session.flush()  # must not raise

    def test_nonexistent_machine_id_rejected(self, db_session: Session) -> None:
        """Foreign key must prevent referencing a machine that does not exist."""
        p = make_production("GHOST-99")
        db_session.add(p)
        with pytest.raises(IntegrityError):
            db_session.flush()

    def test_invalid_shift_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        p = ProductionLog(
            date=TODAY, shift=4,  # invalid
            machine_id=sample_machine.machine_id,
            target_qty=1000, actual_qty=900, efficiency_pct=90,
        )
        db_session.add(p)
        with pytest.raises(IntegrityError, match="ck_production_shift_valid"):
            db_session.flush()

    def test_zero_shift_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        p = ProductionLog(
            date=TODAY, shift=0,  # invalid
            machine_id=sample_machine.machine_id,
            target_qty=1000, actual_qty=900, efficiency_pct=90,
        )
        db_session.add(p)
        with pytest.raises(IntegrityError, match="ck_production_shift_valid"):
            db_session.flush()

    def test_negative_actual_qty_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        p = ProductionLog(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            target_qty=1000, actual_qty=-1,  # invalid
            efficiency_pct=0,
        )
        db_session.add(p)
        with pytest.raises(IntegrityError, match="ck_production_actual_nonneg"):
            db_session.flush()

    def test_zero_target_qty_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        p = ProductionLog(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            target_qty=0,  # invalid — must be > 0
            actual_qty=0, efficiency_pct=0,
        )
        db_session.add(p)
        with pytest.raises(IntegrityError, match="ck_production_target_positive"):
            db_session.flush()

    def test_efficiency_over_110_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        p = ProductionLog(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            target_qty=1000, actual_qty=1200,
            efficiency_pct=120,  # > 110 — invalid
        )
        db_session.add(p)
        with pytest.raises(IntegrityError, match="ck_production_efficiency_range"):
            db_session.flush()

    def test_zero_actual_qty_allowed(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        """Actual qty of 0 is valid (machine was down all shift)."""
        p = ProductionLog(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            target_qty=1000, actual_qty=0, efficiency_pct=0,
        )
        db_session.add(p)
        db_session.flush()  # must not raise


# ─────────────────────────────────────────────────────────────────────────────
# BreakdownEvent tests
# ─────────────────────────────────────────────────────────────────────────────

class TestBreakdownEvent:

    def test_valid_breakdown_row(self, db_session: Session, sample_machine: Machine) -> None:
        b = make_breakdown(sample_machine.machine_id)
        db_session.add(b)
        db_session.flush()
        assert b.id is not None

    def test_multiple_breakdowns_per_shift_allowed(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        """
        CRITICAL: There is NO unique constraint on (machine_id, date, shift).
        A machine can break down more than once in the same shift.
        """
        b1 = BreakdownEvent(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            reason="Weft break PBM",
            duration_minutes=15,
            source_type="synthetic",
        )
        b2 = BreakdownEvent(
            date=TODAY, shift=1,  # same machine, same date, same shift
            machine_id=sample_machine.machine_id,
            reason="Voltage fluctuation PBM",
            duration_minutes=17,
            source_type="synthetic",
        )
        db_session.add_all([b1, b2])
        db_session.flush()  # must NOT raise
        assert b1.id != b2.id

    def test_nonexistent_machine_id_rejected(self, db_session: Session) -> None:
        b = make_breakdown("GHOST-99")
        db_session.add(b)
        with pytest.raises(IntegrityError):
            db_session.flush()

    def test_zero_duration_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        b = BreakdownEvent(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            reason="Weft break PBM",
            duration_minutes=0,  # invalid — must be > 0
            source_type="synthetic",
        )
        db_session.add(b)
        with pytest.raises(IntegrityError, match="ck_breakdown_duration_positive"):
            db_session.flush()

    def test_negative_duration_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        b = BreakdownEvent(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            reason="Weft break PBM",
            duration_minutes=-5,  # invalid
            source_type="synthetic",
        )
        db_session.add(b)
        with pytest.raises(IntegrityError, match="ck_breakdown_duration_positive"):
            db_session.flush()

    def test_invalid_shift_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        b = BreakdownEvent(
            date=TODAY, shift=9,  # invalid
            machine_id=sample_machine.machine_id,
            reason="Weft break PBM",
            duration_minutes=30,
            source_type="synthetic",
        )
        db_session.add(b)
        with pytest.raises(IntegrityError, match="ck_breakdown_shift_valid"):
            db_session.flush()

    def test_all_breakdown_reasons_accepted(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        """Reason is free text — no constraint on its value."""
        reasons = [
            "Weft break PBM",
            "Loom runout",
            "Sort change work",
            "Traveller change work",
            "Voltage fluctuation PBM",
            "Full cleaning work",
            "Bobbin shortage",
            "Maintenance - scheduled",
        ]
        for i, reason in enumerate(reasons):
            b = BreakdownEvent(
                date=TODAY, shift=1 + (i % 3),
                machine_id=sample_machine.machine_id,
                reason=reason,
                duration_minutes=30,
                source_type="synthetic",
            )
            db_session.add(b)
        db_session.flush()  # must not raise


# ─────────────────────────────────────────────────────────────────────────────
# RevenueLog tests
# ─────────────────────────────────────────────────────────────────────────────

class TestRevenueLog:

    def test_valid_revenue_row(self, db_session: Session, sample_machine: Machine) -> None:
        r = make_revenue(sample_machine.machine_id)
        db_session.add(r)
        db_session.flush()
        assert r.id is not None

    def test_multiple_revenue_rows_per_shift_allowed(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        """Multiple fabric styles can contribute revenue in the same shift."""
        styles = ["Excel Slub", "Liveaco Compact", "VSF Export"]
        for style in styles:
            r = RevenueLog(
                date=TODAY, shift=1,
                machine_id=sample_machine.machine_id,
                fabric_style=style,
                revenue=1500.00,
                source_type="derived",
            )
            db_session.add(r)
        db_session.flush()  # must NOT raise

    def test_nonexistent_machine_id_rejected(self, db_session: Session) -> None:
        r = make_revenue("GHOST-99")
        db_session.add(r)
        with pytest.raises(IntegrityError):
            db_session.flush()

    def test_negative_revenue_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        r = RevenueLog(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            fabric_style="Excel Slub",
            revenue=-100,  # invalid
            source_type="derived",
        )
        db_session.add(r)
        with pytest.raises(IntegrityError, match="ck_revenue_nonneg"):
            db_session.flush()

    def test_zero_revenue_allowed(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        """Zero revenue is valid (machine down all shift, no production)."""
        r = RevenueLog(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            fabric_style="Excel Slub",
            revenue=0,
            source_type="derived",
        )
        db_session.add(r)
        db_session.flush()  # must not raise

    def test_invalid_shift_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        r = RevenueLog(
            date=TODAY, shift=5,  # invalid
            machine_id=sample_machine.machine_id,
            fabric_style="Excel Slub",
            revenue=4500,
            source_type="derived",
        )
        db_session.add(r)
        with pytest.raises(IntegrityError, match="ck_revenue_shift_valid"):
            db_session.flush()

    def test_invalid_source_type_rejected(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        r = RevenueLog(
            date=TODAY, shift=1,
            machine_id=sample_machine.machine_id,
            fabric_style="Excel Slub",
            revenue=4500,
            source_type="unknown",  # invalid
        )
        db_session.add(r)
        with pytest.raises(IntegrityError, match="ck_revenue_source_type_valid"):
            db_session.flush()


# ─────────────────────────────────────────────────────────────────────────────
# Cross-table / referential integrity tests
# ─────────────────────────────────────────────────────────────────────────────

class TestReferentialIntegrity:

    def test_cannot_delete_machine_with_production_rows(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        """
        ondelete=RESTRICT must prevent deletion of a machine that has
        production records referencing it.
        """
        p = make_production(sample_machine.machine_id)
        db_session.add(p)
        db_session.flush()

        db_session.delete(sample_machine)
        with pytest.raises(IntegrityError):
            db_session.flush()

    def test_cannot_delete_machine_with_breakdown_events(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        b = make_breakdown(sample_machine.machine_id)
        db_session.add(b)
        db_session.flush()

        db_session.delete(sample_machine)
        with pytest.raises(IntegrityError):
            db_session.flush()

    def test_cannot_delete_machine_with_revenue_rows(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        r = make_revenue(sample_machine.machine_id)
        db_session.add(r)
        db_session.flush()

        db_session.delete(sample_machine)
        with pytest.raises(IntegrityError):
            db_session.flush()

    def test_production_machine_relationship(
        self, db_session: Session, sample_machine: Machine
    ) -> None:
        """ORM relationship must allow navigation from ProductionLog → Machine."""
        p = make_production(sample_machine.machine_id)
        db_session.add(p)
        db_session.flush()
        db_session.refresh(p)

        assert p.machine is not None
        assert p.machine.machine_id == sample_machine.machine_id
        assert p.machine.department == "Weaving"

    def test_spinning_machine_can_have_breakdown(
        self, db_session: Session, sample_spinning_machine: Machine
    ) -> None:
        """Both Spinning and Weaving machines should appear in breakdown_events."""
        b = make_breakdown(sample_spinning_machine.machine_id)
        db_session.add(b)
        db_session.flush()
        assert b.id is not None
