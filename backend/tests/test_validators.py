"""
Tests for Data Quality Validation Layer (Production, Breakdown, Revenue, Machines).
"""
import datetime
from decimal import Decimal
import pytest

from app.models.common import ValidationCategory, RejectedRow
from app.models.production import ProductionRecord
from app.models.breakdown import BreakdownRecord
from app.models.revenue import RevenueRecord
from app.models.machine import MachineRecord
from app.validation.production_validator import ProductionValidator
from app.validation.breakdown_validator import BreakdownValidator
from app.validation.revenue_validator import RevenueValidator
from app.validation.machine_validator import MachineValidator


KNOWN_MACHINES = {"TOY-01", "TOY-02", "RF-01", "RF-02"}
WEAVING_MACHINES = {"TOY-01", "TOY-02"}


# ─────────────────────────────────────────────────────────────────────────────
# Production Validator Tests
# ─────────────────────────────────────────────────────────────────────────────

class TestProductionValidator:

    def test_valid_production_row(self):
        validator = ProductionValidator(known_machines=KNOWN_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "1",
            "machine_id": "TOY-01",
            "target_qty": "21700",
            "actual_qty": "20500",
            "efficiency_pct": "94.47",
        }
        res = validator.validate_row(raw, source_row=2, source_file="prod.csv")
        assert isinstance(res, ProductionRecord)
        assert res.date == datetime.date(2026, 8, 14)
        assert res.shift == 1
        assert res.machine_id == "TOY-01"
        assert res.target_qty == Decimal("21700")
        assert res.actual_qty == Decimal("20500")
        assert res.efficiency_pct == Decimal("94.47")

    def test_missing_date_rejected(self):
        validator = ProductionValidator(known_machines=KNOWN_MACHINES)
        raw = {
            "date": "",
            "shift": "1",
            "machine_id": "TOY-01",
            "target_qty": "21700",
            "actual_qty": "20500",
            "efficiency_pct": "94.47",
        }
        res = validator.validate_row(raw, source_row=2, source_file="prod.csv")
        assert isinstance(res, RejectedRow)
        assert res.category == ValidationCategory.MISSING_VALUE
        assert any("date is required" in r for r in res.reasons)

    def test_invalid_date_format_rejected(self):
        validator = ProductionValidator(known_machines=KNOWN_MACHINES)
        raw = {
            "date": "invalid-date",
            "shift": "1",
            "machine_id": "TOY-01",
            "target_qty": "21700",
            "actual_qty": "20500",
            "efficiency_pct": "94.47",
        }
        res = validator.validate_row(raw, source_row=2, source_file="prod.csv")
        assert isinstance(res, RejectedRow)
        assert any("invalid date format" in r for r in res.reasons)

    def test_invalid_shift_rejected(self):
        validator = ProductionValidator(known_machines=KNOWN_MACHINES)
        for bad_shift in ("0", "4", "abc", "-1"):
            raw = {
                "date": "2026-08-14",
                "shift": bad_shift,
                "machine_id": "TOY-01",
                "target_qty": "21700",
                "actual_qty": "20500",
                "efficiency_pct": "94.47",
            }
            res = validator.validate_row(raw, source_row=2, source_file="prod.csv")
            assert isinstance(res, RejectedRow)
            assert any("shift must be 1, 2, or 3" in r for r in res.reasons)

    def test_unknown_machine_rejected(self):
        validator = ProductionValidator(known_machines=KNOWN_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "1",
            "machine_id": "UNKNOWN-99",
            "target_qty": "21700",
            "actual_qty": "20500",
            "efficiency_pct": "94.47",
        }
        res = validator.validate_row(raw, source_row=2, source_file="prod.csv")
        assert isinstance(res, RejectedRow)
        assert res.category == ValidationCategory.UNKNOWN_MACHINE
        assert any("unknown machine_id" in r for r in res.reasons)

    def test_negative_target_and_actual_rejected(self):
        validator = ProductionValidator(known_machines=KNOWN_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "1",
            "machine_id": "TOY-01",
            "target_qty": "-500",
            "actual_qty": "-10",
            "efficiency_pct": "50",
        }
        res = validator.validate_row(raw, source_row=2, source_file="prod.csv")
        assert isinstance(res, RejectedRow)
        assert any("target_qty must be >= 0" in r for r in res.reasons)
        assert any("actual_qty must be >= 0" in r for r in res.reasons)

    def test_efficiency_out_of_range_rejected(self):
        validator = ProductionValidator(known_machines=KNOWN_MACHINES)
        for bad_eff in ("-1", "101", "150"):
            raw = {
                "date": "2026-08-14",
                "shift": "1",
                "machine_id": "TOY-01",
                "target_qty": "21700",
                "actual_qty": "20500",
                "efficiency_pct": bad_eff,
            }
            res = validator.validate_row(raw, source_row=2, source_file="prod.csv")
            assert isinstance(res, RejectedRow)
            assert any("efficiency_pct must be between 0 and 100" in r for r in res.reasons)

    def test_duplicate_in_batch_detected(self):
        validator = ProductionValidator(known_machines=KNOWN_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "1",
            "machine_id": "TOY-01",
            "target_qty": "21700",
            "actual_qty": "20500",
            "efficiency_pct": "94.47",
        }
        res1 = validator.validate_row(raw, source_row=2, source_file="prod.csv")
        res2 = validator.validate_row(raw, source_row=3, source_file="prod.csv")
        assert isinstance(res1, ProductionRecord)
        assert isinstance(res2, RejectedRow)
        assert res2.category == ValidationCategory.DUPLICATE
        assert any("duplicate production row" in r for r in res2.reasons)


# ─────────────────────────────────────────────────────────────────────────────
# Breakdown Validator Tests
# ─────────────────────────────────────────────────────────────────────────────

class TestBreakdownValidator:

    def test_valid_breakdown_row(self):
        validator = BreakdownValidator(known_machines=KNOWN_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "2",
            "machine_id": "RF-01",
            "reason": "Weft break PBM",
            "duration_minutes": "45",
        }
        res = validator.validate_row(raw, source_row=2, source_file="bd.csv")
        assert isinstance(res, BreakdownRecord)
        assert res.date == datetime.date(2026, 8, 14)
        assert res.duration_minutes == 45
        assert res.reason == "Weft break PBM"

    def test_missing_reason_rejected(self):
        validator = BreakdownValidator(known_machines=KNOWN_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "2",
            "machine_id": "RF-01",
            "reason": "",
            "duration_minutes": "45",
        }
        res = validator.validate_row(raw, source_row=2, source_file="bd.csv")
        assert isinstance(res, RejectedRow)
        assert any("reason is required" in r for r in res.reasons)

    def test_duration_zero_or_negative_rejected(self):
        validator = BreakdownValidator(known_machines=KNOWN_MACHINES)
        for bad_dur in ("0", "-15", "abc"):
            raw = {
                "date": "2026-08-14",
                "shift": "2",
                "machine_id": "RF-01",
                "reason": "Weft break",
                "duration_minutes": bad_dur,
            }
            res = validator.validate_row(raw, source_row=2, source_file="bd.csv")
            assert isinstance(res, RejectedRow)
            assert any("duration_minutes" in r for r in res.reasons)


# ─────────────────────────────────────────────────────────────────────────────
# Revenue Validator Tests
# ─────────────────────────────────────────────────────────────────────────────

class TestRevenueValidator:

    def test_valid_revenue_row(self):
        validator = RevenueValidator(known_machines=KNOWN_MACHINES, weaving_machines=WEAVING_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "1",
            "machine_id": "TOY-01",
            "fabric_style": "Excel Slub",
            "revenue": "4500.50",
        }
        res = validator.validate_row(raw, source_row=2, source_file="rev.csv")
        assert isinstance(res, RevenueRecord)
        assert res.fabric_style == "Excel Slub"
        assert res.revenue == Decimal("4500.50")

    def test_missing_fabric_style_rejected(self):
        validator = RevenueValidator(known_machines=KNOWN_MACHINES, weaving_machines=WEAVING_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "1",
            "machine_id": "TOY-01",
            "fabric_style": "",
            "revenue": "4500.50",
        }
        res = validator.validate_row(raw, source_row=2, source_file="rev.csv")
        assert isinstance(res, RejectedRow)
        assert any("fabric_style is required" in r for r in res.reasons)

    def test_negative_revenue_rejected(self):
        validator = RevenueValidator(known_machines=KNOWN_MACHINES, weaving_machines=WEAVING_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "1",
            "machine_id": "TOY-01",
            "fabric_style": "Excel Slub",
            "revenue": "-100",
        }
        res = validator.validate_row(raw, source_row=2, source_file="rev.csv")
        assert isinstance(res, RejectedRow)
        assert any("revenue must be >= 0" in r for r in res.reasons)

    def test_non_weaving_machine_revenue_rejected(self):
        validator = RevenueValidator(known_machines=KNOWN_MACHINES, weaving_machines=WEAVING_MACHINES)
        raw = {
            "date": "2026-08-14",
            "shift": "1",
            "machine_id": "RF-01",  # RF is spinning, not weaving
            "fabric_style": "Excel Slub",
            "revenue": "4500.50",
        }
        res = validator.validate_row(raw, source_row=2, source_file="rev.csv")
        assert isinstance(res, RejectedRow)
        assert any("not a Weaving machine" in r for r in res.reasons)


# ─────────────────────────────────────────────────────────────────────────────
# Machine Validator Tests
# ─────────────────────────────────────────────────────────────────────────────

class TestMachineValidator:

    def test_valid_machine(self):
        validator = MachineValidator()
        raw = {
            "machine_id": "TOY-01",
            "unit": "Unit I",
            "department": "Weaving",
            "machine_type": "Toyota",
            "granularity": "synthetic_loom_number",
            "source_type": "synthetic",
        }
        res = validator.validate_row(raw, source_row=2)
        assert isinstance(res, MachineRecord)
        assert res.machine_id == "TOY-01"

    def test_invalid_granularity(self):
        validator = MachineValidator()
        raw = {
            "machine_id": "TOY-01",
            "unit": "Unit I",
            "department": "Weaving",
            "machine_type": "Toyota",
            "granularity": "invalid_granularity",
        }
        res = validator.validate_row(raw, source_row=2)
        assert isinstance(res, RejectedRow)
        assert any("granularity" in r for r in res.reasons)
