"""
Loom AI v2 — Operational Decision Engine.

Answers the critical question:
"Is this material enough to warrant human management intervention?"

Evaluates events and exceptions against multidimensional materiality scoring:
Materiality Score = f(Severity, Downtime Magnitude, Recurrence, Financial Exposure, Production Deficit)
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.services.event_engine import EventEngine, OperationalEvent
from app.services.impact_engine import ImpactEngine


class Decision(BaseModel):
    decision_id: str
    entity_type: str                  # "LOOM" | "SHIFT" | "PLANT" | "STYLE" | "OPERATOR"
    entity_id: str
    decision_type: str                # "BREAKDOWN_ESCALATION" | "PRODUCTION_SHORTFALL" | "MAINTENANCE_REQUIRED" | "AIR_LEAK"
    severity: str                     # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
    materiality_score: float          # 0.0 to 100.0
    financial_impact_inr: float       # Rupee exposure
    production_impact_metres: float   # Metres lost
    urgency: str                      # "IMMEDIATE" | "SAME_SHIFT" | "TODAY" | "MONITOR"
    confidence: str                   # "HIGH" | "MEDIUM" | "LOW"
    should_intervene: bool            # True if warrants human management attention
    rationale: str
    event_id: str
    source_ids: List[str]


class DecisionEngine:
    @staticmethod
    def evaluate_decisions(
        session: Session, unit_code: str, work_date: datetime.date
    ) -> List[Decision]:
        events = EventEngine.detect_events(session, unit_code, work_date)
        decisions: List[Decision] = []

        for ev in events:
            # 1. Production Shortfall Event
            if ev.event_type == "ProductionShortfallDetected":
                var_pct = abs(ev.metrics_snapshot.get("variance_pct", 0.0))
                deficit_m = abs(ev.metrics_snapshot.get("actual_metres", 0.0) - ev.metrics_snapshot.get("target_metres", 0.0))
                fin_loss = deficit_m * 40.0

                score = min(100.0, 50.0 + (var_pct * 3.5) + (fin_loss / 10000.0))
                should_act = score >= 65.0 or fin_loss > 40000.0

                decisions.append(
                    Decision(
                        decision_id=f"DEC-PROD-{work_date.strftime('%Y%m%d')}",
                        entity_type="PLANT",
                        entity_id=unit_code,
                        decision_type="PRODUCTION_SHORTFALL",
                        severity=ev.severity,
                        materiality_score=round(score, 1),
                        financial_impact_inr=round(fin_loss, 0),
                        production_impact_metres=round(deficit_m, 1),
                        urgency="IMMEDIATE" if score > 80 else "SAME_SHIFT",
                        confidence="HIGH",
                        should_intervene=should_act,
                        rationale=f"Plant production deficit is {var_pct:.1f}% below target, causing ₹{fin_loss:,.0f} revenue exposure across 192 looms.",
                        event_id=ev.event_id,
                        source_ids=ev.source_ids,
                    )
                )

            # 2. Severe Downtime Spike
            elif ev.event_type == "BreakdownSpikeDetected":
                lid = ev.loom_id or 0
                dt_min = float(ev.metrics_snapshot.get("downtime_minutes", 0))
                impact = ImpactEngine.calculate_downtime_loss(session, lid, dt_min, work_date)

                lost_m = impact["estimated_metres_lost"]
                lost_inr = impact["estimated_revenue_exposure_inr"]

                score = min(100.0, (dt_min / 480.0 * 60.0) + (lost_inr / 500.0))
                should_act = dt_min >= 150 or lost_inr >= 15000.0

                decisions.append(
                    Decision(
                        decision_id=f"DEC-BKDN-L{lid}-{work_date.strftime('%Y%m%d')}",
                        entity_type="LOOM",
                        entity_id=str(ev.loom_no or lid),
                        decision_type="BREAKDOWN_ESCALATION",
                        severity=ev.severity,
                        materiality_score=round(score, 1),
                        financial_impact_inr=lost_inr,
                        production_impact_metres=lost_m,
                        urgency="IMMEDIATE" if dt_min > 240 else "SAME_SHIFT",
                        confidence="HIGH",
                        should_intervene=should_act,
                        rationale=f"Loom {ev.loom_no} stoppage of {dt_min:.0f} min exceeds 30-day baseline, resulting in {lost_m:.0f}m lost output (₹{lost_inr:,.0f} exposure).",
                        event_id=ev.event_id,
                        source_ids=ev.source_ids,
                    )
                )

            # 3. Maintenance Overrun
            elif ev.event_type == "MaintenanceOverrunDetected":
                overrun = float(ev.metrics_snapshot.get("overrun_min", 0))
                impact = ImpactEngine.calculate_downtime_loss(session, ev.loom_id or 0, overrun, work_date)
                lost_inr = impact["estimated_revenue_exposure_inr"]

                score = min(100.0, 40.0 + (overrun * 0.8))
                decisions.append(
                    Decision(
                        decision_id=f"DEC-MAINT-L{ev.loom_id}-{work_date.strftime('%Y%m%d')}",
                        entity_type="LOOM",
                        entity_id=str(ev.loom_no or ev.loom_id),
                        decision_type="MAINTENANCE_REQUIRED",
                        severity=ev.severity,
                        materiality_score=round(score, 1),
                        financial_impact_inr=lost_inr,
                        production_impact_metres=impact["estimated_metres_lost"],
                        urgency="SAME_SHIFT" if overrun > 30 else "TODAY",
                        confidence="HIGH",
                        should_intervene=overrun >= 30,
                        rationale=f"Overrun of {overrun:.0f} min by technician {ev.metrics_snapshot.get('technician', 'fitter')} delays shift restart.",
                        event_id=ev.event_id,
                        source_ids=ev.source_ids,
                    )
                )

            # 4. Air Leakage Anomaly
            elif ev.event_type == "PneumaticAirLeakDetected":
                excess = float(ev.metrics_snapshot.get("excess_cfm", 0.0))
                # Approx Rs.12 per excess CFM per shift in compressor power
                energy_loss_inr = round(excess * 12.0 * 8.0, 0)

                decisions.append(
                    Decision(
                        decision_id=f"DEC-AIR-L{ev.loom_id}-{work_date.strftime('%Y%m%d')}",
                        entity_type="LOOM",
                        entity_id=str(ev.loom_no or ev.loom_id),
                        decision_type="AIR_LEAK",
                        severity="MEDIUM",
                        materiality_score=round(min(100.0, 30.0 + (excess * 4.0)), 1),
                        financial_impact_inr=energy_loss_inr,
                        production_impact_metres=0.0,
                        urgency="TODAY",
                        confidence="HIGH",
                        should_intervene=excess >= 10.0,
                        rationale=f"Loom {ev.loom_no} is leaking +{excess:.1f} CFM pneumatic air, wasting ~₹{energy_loss_inr:,.0f}/shift in compressor power.",
                        event_id=ev.event_id,
                        source_ids=ev.source_ids,
                    )
                )

        # Sort by materiality score descending
        decisions.sort(key=lambda x: x.materiality_score, reverse=True)
        return decisions
