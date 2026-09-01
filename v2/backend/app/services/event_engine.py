"""
Loom AI v2 — Operational Event Engine.

Scans canonical floor telemetry to detect material operational events and anomalies.
Emits structured typed events that feed the Decision Engine and specialized AI agents.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db_models import (
    AirConsumptionLog,
    Loom,
    MaintenanceRecord,
    ProductionLog,
    QualityInspectionLog,
    ReasonCode,
    ShiftMaster,
    StopEvent,
    Unit,
)
from app.services.truth_service import BreakdownService, ProductionService


class OperationalEvent(BaseModel):
    event_id: str
    event_type: str
    loom_id: Optional[int] = None
    loom_no: Optional[str] = None
    shift_code: Optional[str] = None
    timestamp: str
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    title: str
    description: str
    metrics_snapshot: Dict[str, Any]
    source_ids: List[str]


class EventEngine:
    @staticmethod
    def detect_events(
        session: Session, unit_code: str, work_date: datetime.date
    ) -> List[OperationalEvent]:
        events: List[OperationalEvent] = []
        unit = session.execute(select(Unit).where(Unit.code == unit_code)).scalar_one_or_none()
        if not unit:
            return events

        # 1. Plant Production Shortfall Check
        prod = ProductionService.get_production_summary(session, unit_code, work_date)
        if prod.get("data_available"):
            var_pct = prod.get("variance_pct", 0.0)
            if var_pct < -5.0:
                events.append(
                    OperationalEvent(
                        event_id=f"EVT-PROD-SHORTFALL-{work_date.strftime('%Y%m%d')}",
                        event_type="ProductionShortfallDetected",
                        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                        severity="CRITICAL" if var_pct < -8.0 else "HIGH",
                        title=f"Plant Production Shortfall ({abs(var_pct):.1f}% below target)",
                        description=f"Floor produced {prod['actual_metres']:,.0f}m against target {prod['target_metres']:,.0f}m ({prod['variance_metres']:,.0f}m deficit).",
                        metrics_snapshot={
                            "actual_metres": prod["actual_metres"],
                            "target_metres": prod["target_metres"],
                            "variance_pct": var_pct,
                            "efficiency_pct": prod["loom_efficiency_pct"],
                        },
                        source_ids=[f"prod_log_{work_date.strftime('%Y%m%d')}"],
                    )
                )

        # 2. Individual Loom Breakdown Spikes (> 120 minutes downtime today)
        bt = BreakdownService.get_breakdown_summary(session, unit_code, work_date)
        if bt.get("data_available"):
            for l in bt.get("worst_looms_today", []):
                dt_min = l["total_stopped_minutes"]
                if dt_min >= 120:
                    events.append(
                        OperationalEvent(
                            event_id=f"EVT-BKDN-SPIKE-L{l['loom_id']}-{work_date.strftime('%Y%m%d')}",
                            event_type="BreakdownSpikeDetected",
                            loom_id=l["loom_id"],
                            loom_no=l["loom_no"],
                            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                            severity="CRITICAL" if dt_min > 240 else "HIGH",
                            title=f"Severe Downtime Spike on Loom {l['loom_no']} ({dt_min} min)",
                            description=f"Loom {l['loom_no']} logged {dt_min} minutes downtime today across {l['event_count']} stoppages. Predominant reason: {l['dominant_reason_en']}.",
                            metrics_snapshot={
                                "downtime_minutes": dt_min,
                                "stop_count": l["event_count"],
                                "dominant_reason": l["dominant_reason_en"],
                            },
                            source_ids=[f"stopevent_loom_{l['loom_id']}_{work_date.strftime('%Y%m%d')}"],
                        )
                    )

            # 3. Chronic Micro-Stop Churn (> 20 stop events this month)
            for ml in bt.get("monthly_top_looms", []):
                if ml["event_count"] >= 20:
                    events.append(
                        OperationalEvent(
                            event_id=f"EVT-CHRONIC-STOP-L{ml['loom_id']}",
                            event_type="ChronicMicroStopDetected",
                            loom_id=ml["loom_id"],
                            loom_no=ml["loom_no"],
                            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                            severity="MEDIUM",
                            title=f"Chronic Micro-Stops on Loom {ml['loom_no']} ({ml['event_count']} stops)",
                            description=f"Loom {ml['loom_no']} has logged {ml['event_count']} stops this month ({ml['total_stopped_minutes']} cumulative min). High churn indicates feeder/tension calibration defect.",
                            metrics_snapshot={
                                "month_stops": ml["event_count"],
                                "cumulative_minutes": ml["total_stopped_minutes"],
                            },
                            source_ids=[f"stopevents_month_loom_{ml['loom_id']}"],
                        )
                    )

        # 4. Maintenance Overrun Check
        maint_records = (
            session.execute(
                select(MaintenanceRecord, Loom.loom_no)
                .join(Loom, Loom.loom_id == MaintenanceRecord.loom_id)
                .where(
                    Loom.unit_id == unit.unit_id,
                    MaintenanceRecord.scheduled_date == work_date,
                )
            )
            .all()
        )
        for mr, l_no in maint_records:
            overrun = mr.overrun_min or 0
            if overrun >= 20 or mr.recurring_flag:
                events.append(
                    OperationalEvent(
                        event_id=f"EVT-MAINT-OVERRUN-R{mr.record_id}",
                        event_type="MaintenanceOverrunDetected",
                        loom_id=mr.loom_id,
                        loom_no=l_no,
                        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                        severity="HIGH" if overrun > 45 else "MEDIUM",
                        title=f"Maintenance Task Overrun on Loom {l_no} (+{overrun} min)",
                        description=f"Task duration exceeded standard schedule by {overrun} minutes. Recurring issue flag: {mr.recurring_flag}.",
                        metrics_snapshot={
                            "scheduled_min": mr.scheduled_duration_min,
                            "actual_min": mr.actual_duration_min,
                            "overrun_min": overrun,
                            "technician": mr.technician_name,
                        },
                        source_ids=[f"maint_rec_{mr.record_id}"],
                    )
                )

        # 5. Air Leak / Pressure Anomaly
        air_logs = (
            session.execute(
                select(AirConsumptionLog, Loom.loom_no)
                .join(Loom, Loom.loom_id == AirConsumptionLog.loom_id)
                .where(
                    Loom.unit_id == unit.unit_id,
                    AirConsumptionLog.work_date == work_date,
                    AirConsumptionLog.excess_cfm > 8.0,
                )
            )
            .all()
        )
        for al, l_no in air_logs:
            events.append(
                OperationalEvent(
                    event_id=f"EVT-AIR-LEAK-L{al.loom_id}",
                    event_type="PneumaticAirLeakDetected",
                    loom_id=al.loom_id,
                    loom_no=l_no,
                    timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                    severity="MEDIUM",
                    title=f"Pneumatic Air Anomaly on Loom {l_no} (+{al.excess_cfm} CFM excess)",
                    description=f"Loom {l_no} air consumption measured {al.actual_cfm} CFM vs {al.standard_cfm} CFM standard. Pneumatic leakage detected at main regulator valve.",
                    metrics_snapshot={
                        "actual_cfm": float(al.actual_cfm),
                        "standard_cfm": float(al.standard_cfm),
                        "excess_cfm": float(al.excess_cfm),
                    },
                    source_ids=[f"air_log_{al.id}"],
                )
            )

        return events
