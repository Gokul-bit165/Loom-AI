"""
Industrial Event Classification Engine for Loom AI v2.

Implements multi-dimensional event classification based on real factory parameters:
classification = f(source_reason, duration, recurrence, intervention_type, technician, machine_state)

Classifies events into:
- MICRO_STOP: Brief yarn break (<=5 min standard) cleared by weaver
- OPERATOR_STOP: Extended stop due to operator latency, absenteeism, or patrolling delay
- PROCESS_STOP: Beam runout, style tuning, warp tension settling
- UTILITY_STOP: Pneumatic air pressure drops, voltage dips, power interruption
- MECHANICAL_BREAKDOWN: Mechanical component failure, tape/feeder/cutter jam requiring fitter
- ELECTRICAL_BREAKDOWN: Inverter trips, drive faults, sensor failure requiring electrician
- PLANNED_MAINTENANCE: Scheduled maintenance, knotting, gaiting, doffing
- UNKNOWN: Unclassified or missing telemetry
"""
from __future__ import annotations

import enum
from dataclasses import dataclass
from typing import Optional


class EventClass(str, enum.Enum):
    MICRO_STOP = "MICRO_STOP"
    OPERATOR_STOP = "OPERATOR_STOP"
    PROCESS_STOP = "PROCESS_STOP"
    UTILITY_STOP = "UTILITY_STOP"
    MECHANICAL_BREAKDOWN = "MECHANICAL_BREAKDOWN"
    ELECTRICAL_BREAKDOWN = "ELECTRICAL_BREAKDOWN"
    PLANNED_MAINTENANCE = "PLANNED_MAINTENANCE"
    UNKNOWN = "UNKNOWN"


@dataclass(frozen=True)
class ClassificationThresholds:
    """Configurable mill threshold parameters."""
    micro_stop_max_minutes: float = 5.0
    operator_latency_threshold_min: float = 5.0
    chronic_recurrence_window_min: int = 60
    chronic_recurrence_count_threshold: int = 3


DEFAULT_THRESHOLDS = ClassificationThresholds()


def classify_stop_event(
    reason_code: Optional[str],
    category: Optional[str],
    duration_min: float,
    technician: Optional[str] = None,
    raw_remark: Optional[str] = None,
    recurrence_count: int = 1,
    thresholds: ClassificationThresholds = DEFAULT_THRESHOLDS,
) -> EventClass:
    """
    Deterministically classify a stop event using multi-dimensional industrial criteria.
    Never relies on duration alone.
    """
    code_upper = (reason_code or "").upper().strip()
    cat_upper = (category or "").upper().strip()
    remark_lower = (raw_remark or "").lower()
    has_technician = bool(technician and technician.strip())

    # 1. Planned Operations & Maintenance
    if cat_upper == "PLANNED" or code_upper in {
        "SORT_BEAM_CHANGE",
        "KNOTTING",
        "GAITING",
        "PREVENTIVE_MAINTENANCE",
        "ROLL_DOFFING",
        "CLEANING",
    }:
        return EventClass.PLANNED_MAINTENANCE

    # 2. Utility Interruptions (Central compressor air drops, grid power dips)
    if cat_upper == "UTILITY" or code_upper in {
        "AIR_PRESSURE_LOW",
        "POWER_FAILURE",
        "VOLTAGE_FLUCTUATION",
        "COMPRESSOR_DROP",
    }:
        # If an electrical technician had to repair an onboard breaker/drive, it's electrical breakdown
        if has_technician and ("drive" in remark_lower or "inverter" in remark_lower or "motor" in remark_lower):
            return EventClass.ELECTRICAL_BREAKDOWN
        return EventClass.UTILITY_STOP

    # 3. Manpower & Operator Allocation
    if cat_upper == "MANPOWER" or code_upper in {"NO_WEAVER", "ABSENTEEISM", "OPERATOR_DELAY"}:
        return EventClass.OPERATOR_STOP

    # 4. Electrical Breakdowns
    if cat_upper == "ELECTRICAL" or code_upper in {
        "ELECTRICAL_BREAKDOWN",
        "INVERTER_TRIP",
        "MOTOR_TRIP",
        "SENSOR_FAULT",
        "PCB_FAULT",
    }:
        return EventClass.ELECTRICAL_BREAKDOWN

    # 5. Mechanical Breakdowns
    if cat_upper == "MECHANICAL" or code_upper in {
        "MECHANICAL_BREAKDOWN",
        "WEFT_FEEDER_FAULT",
        "RAPIER_TAPE_JAM",
        "CUTTER_FAULT",
        "CAM_BOX_OVERHEAT",
    }:
        return EventClass.MECHANICAL_BREAKDOWN

    # 6. Yarn & Material Breaks (Weft Break / Warp Break)
    if cat_upper == "MATERIAL" or code_upper in {"WARP_BREAK", "WEFT_BREAK", "YARN_BREAK"}:
        # If a technician or fitter was summoned, a mechanical jam/warp tangle occurred
        if has_technician or "fitter" in remark_lower or "mechanic" in remark_lower:
            return EventClass.MECHANICAL_BREAKDOWN
        # Brief yarn break handled by weaver in routine cycle
        if duration_min <= thresholds.micro_stop_max_minutes:
            return EventClass.MICRO_STOP
        # Prolonged yarn break with no technician -> operator latency / patrolling issue
        return EventClass.OPERATOR_STOP

    # 7. Process / Beam Adjustments
    if "tension" in remark_lower or "crimp" in remark_lower or "beam runout" in remark_lower:
        return EventClass.PROCESS_STOP

    # 8. Technician presence default to breakdown
    if has_technician:
        return EventClass.MECHANICAL_BREAKDOWN

    # 9. Fallback duration rule
    if duration_min <= thresholds.micro_stop_max_minutes:
        return EventClass.MICRO_STOP

    return EventClass.UNKNOWN
