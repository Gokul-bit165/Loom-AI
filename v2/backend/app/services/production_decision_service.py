"""
Loom AI v2 — Production Decision Service.

Deterministic business rules and priority ranking:
- Today's Situation (1 concise verdict sentence + 3 dominant drivers)
- Loom Performance Rankings (Top/Bottom output & efficiency, Potential Improvement Opportunities)
- Fair Weaver Performance Ratings with qualification thresholds (assigned hours >= 6.0, looms >= 4)
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db_models import (
    Assignment,
    Employee,
    Loom,
    ProductionLog,
    ShiftMaster,
    Style,
    Unit,
)


class ProductionDecisionService:
    @staticmethod
    def generate_production_verdict(
        today_position: Dict[str, Any],
        top_losses: List[Dict[str, Any]],
        shortfall_decomp: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Generates today's concise situation sentence and dominant drivers."""
        primary = today_position.get("primary_kpis", {})
        gap_pct = primary.get("gap_pct", 0.0)
        gap_m = primary.get("gap_metres", 0.0)
        eff = primary.get("efficiency_pct", 0.0)

        top_loom_names = [l["loom_no"] for l in top_losses[:3]]
        loom_str = ", ".join(top_loom_names) if top_loom_names else "3 airjet looms"

        if gap_pct < -2.0:
            verdict_sentence = f"Production is {abs(gap_pct):.1f}% below plan ({abs(gap_m):,.0f} m gap). Shortfall is concentrated in {loom_str}."
        elif gap_pct < 0:
            verdict_sentence = f"Production is slightly below plan by {abs(gap_pct):.1f}% ({abs(gap_m):,.0f} m). Asset efficiency is {eff:.1f}%."
        else:
            verdict_sentence = f"Production is exceeding plan by +{gap_pct:.1f}% (+{gap_m:,.0f} m) at {eff:.1f}% plant efficiency."

        categories = shortfall_decomp.get("categories", [])
        drivers = []
        for cat in categories[:3]:
            drivers.append(f"{cat['name']} ({cat['share_pct']}%)")

        return {
            "verdict_sentence": verdict_sentence,
            "status": "CRITICAL" if gap_pct < -5.0 else ("ATTENTION" if gap_pct < 0 else "ON_TRACK"),
            "dominant_drivers": drivers,
            "primary_issue": categories[0]["name"] if categories else "Downtime",
        }

    @staticmethod
    def get_loom_performance_rankings(
        session: Session, unit_code: str, work_date: datetime.date
    ) -> Dict[str, Any]:
        """
        Q3: Looms with highest and lowest production and efficiency,
        plus Potential Improvement Opportunities.
        """
        unit = session.execute(select(Unit).where(Unit.code == unit_code)).scalar_one_or_none()
        if not unit:
            return {}

        rows = (
            session.execute(
                select(
                    ProductionLog.loom_id,
                    Loom.loom_no,
                    Loom.loom_type_code,
                    func.sum(ProductionLog.metres).label("metres"),
                    func.sum(ProductionLog.actual_picks).label("actual_picks"),
                    func.sum(ProductionLog.scheduled_minutes).label("sched"),
                    func.sum(ProductionLog.running_minutes).label("running"),
                    func.sum(ProductionLog.warp_breaks).label("warp_breaks"),
                    func.sum(ProductionLog.weft_breaks).label("weft_breaks"),
                    func.avg(ProductionLog.std_rpm_snapshot).label("avg_rpm"),
                    func.avg(Style.picks_per_metre).label("ppm"),
                    func.avg(Style.std_efficiency_pct).label("std_eff"),
                    Style.style_code,
                )
                .join(Loom, Loom.loom_id == ProductionLog.loom_id)
                .join(Style, Style.style_id == ProductionLog.style_id)
                .where(
                    Loom.unit_id == unit.unit_id,
                    ProductionLog.work_date == work_date,
                    ProductionLog.is_current == True,
                )
                .group_by(ProductionLog.loom_id, Loom.loom_no, Loom.loom_type_code, Style.style_code)
            )
            .all()
        )

        loom_list = []
        for r in rows:
            sched = int(r.sched or 1440)
            running = int(r.running or 0)
            stopped = max(0, sched - running)
            actual_m = float(r.metres or 0)
            rpm = float(r.avg_rpm or 650)
            ppm = float(r.ppm or 2165.356)
            std_eff = float(r.std_eff or 90.0)

            target_m = (sched * rpm * (std_eff / 100.0)) / ppm
            picks = int(r.actual_picks or 0)
            eff = round((picks / (sched * rpm)) * 100.0, 1) if (sched * rpm) > 0 else 0.0
            gap_m = round(actual_m - target_m, 1)

            # Potential Improvement Opportunity:
            # gap to benchmark * recoverability factor * runtime availability
            eff_gap = max(0.0, std_eff - eff)
            # Higher recoverable if stopped minutes are high
            recoverability_factor = min(1.0, stopped / 300.0) if stopped > 60 else 0.4
            opportunity_score = round(eff_gap * recoverability_factor, 1)

            loom_list.append({
                "loom_id": r.loom_id,
                "loom_no": r.loom_no,
                "loom_type": r.loom_type_code,
                "style_code": r.style_code,
                "actual_metres": round(actual_m, 1),
                "target_metres": round(target_m, 1),
                "variance_metres": gap_m,
                "efficiency_pct": eff,
                "std_efficiency_pct": std_eff,
                "efficiency_gap_pp": round(std_eff - eff, 1),
                "stopped_minutes": stopped,
                "warp_breaks": int(r.warp_breaks or 0),
                "weft_breaks": int(r.weft_breaks or 0),
                "opportunity_score": opportunity_score,
            })

        top_output = sorted(loom_list, key=lambda x: x["actual_metres"], reverse=True)[:5]
        bottom_output = sorted(loom_list, key=lambda x: x["actual_metres"])[:5]
        top_eff = sorted(loom_list, key=lambda x: x["efficiency_pct"], reverse=True)[:5]
        bottom_eff = sorted(loom_list, key=lambda x: x["efficiency_pct"])[:5]
        top_improvable = sorted(loom_list, key=lambda x: x["opportunity_score"], reverse=True)[:5]

        return {
            "top_output_looms": top_output,
            "bottom_output_looms": bottom_output,
            "top_efficiency_looms": top_eff,
            "bottom_efficiency_looms": bottom_eff,
            "potential_improvement_opportunities": top_improvable,
            "total_looms_evaluated": len(loom_list),
        }

    @staticmethod
    def get_weaver_performance_ratings(
        session: Session, unit_code: str, work_date: datetime.date
    ) -> Dict[str, Any]:
        """
        Q3: Weaver performance rankings normalized by assigned looms and shift duration,
        filtered through qualification gates (assigned hours >= 6.0, looms >= 4).
        """
        unit = session.execute(select(Unit).where(Unit.code == unit_code)).scalar_one_or_none()
        if not unit:
            return {}

        # Query assignments on work_date
        assignments = (
            session.execute(
                select(
                    Assignment.employee_id,
                    Assignment.loom_id,
                    Assignment.shift_id,
                    Employee.name.label("employee_name"),
                    Employee.employee_code,
                    Employee.grade,
                    ProductionLog.metres,
                    ProductionLog.actual_picks,
                    ProductionLog.scheduled_minutes,
                    ProductionLog.std_rpm_snapshot,
                    Style.std_efficiency_pct,
                )
                .join(Employee, Employee.employee_id == Assignment.employee_id)
                .join(
                    ProductionLog,
                    (ProductionLog.loom_id == Assignment.loom_id)
                    & (ProductionLog.shift_id == Assignment.shift_id)
                    & (ProductionLog.work_date == Assignment.work_date)
                    & (ProductionLog.is_current == True),
                )
                .join(Style, Style.style_id == ProductionLog.style_id)
                .where(
                    Assignment.work_date == work_date,
                    Employee.unit_id == unit.unit_id,
                )
            )
            .all()
        )

        weaver_map: Dict[int, Dict[str, Any]] = {}
        for a in assignments:
            eid = a.employee_id
            if eid not in weaver_map:
                weaver_map[eid] = {
                    "employee_id": eid,
                    "name": a.employee_name,
                    "code": a.employee_code or f"EMP-{eid}",
                    "grade": str(a.grade.value) if hasattr(a.grade, "value") else str(a.grade or "G2"),
                    "looms": set(),
                    "total_metres": Decimal("0.0"),
                    "actual_picks": 0,
                    "theo_picks": Decimal("0.0"),
                    "sched_minutes": 0,
                }
            weaver_map[eid]["looms"].add(a.loom_id)
            weaver_map[eid]["total_metres"] += Decimal(str(a.metres or 0))
            weaver_map[eid]["actual_picks"] += int(a.actual_picks or 0)
            sched = int(a.scheduled_minutes or 480)
            rpm = Decimal(str(a.std_rpm_snapshot or 650))
            weaver_map[eid]["theo_picks"] += Decimal(sched) * rpm
            weaver_map[eid]["sched_minutes"] += sched

        qualified = []
        unqualified = []

        for eid, w in weaver_map.items():
            loom_count = len(w["looms"])
            hours = round(w["sched_minutes"] / 60.0, 1)
            eff = (
                round((Decimal(w["actual_picks"]) / w["theo_picks"]) * Decimal("100.0"), 1)
                if w["theo_picks"] > 0
                else Decimal("0.0")
            )
            eff_float = float(eff)

            # Qualification gate: assigned hours >= 6.0 and >= 4 looms
            if hours >= 6.0 and loom_count >= 4:
                if eff_float >= 92.0:
                    label = "Strong Performer"
                    category = "STRONG"
                elif eff_float >= 88.0:
                    label = "Stable Performer"
                    category = "STABLE"
                elif eff_float >= 84.0:
                    label = "Needs Review"
                    category = "NEEDS_REVIEW"
                else:
                    label = "Development Opportunity"
                    category = "DEVELOPMENT"

                qualified.append({
                    "employee_id": eid,
                    "name": w["name"],
                    "code": w["code"],
                    "grade": w["grade"],
                    "looms_handled": loom_count,
                    "assigned_hours": hours,
                    "total_metres": float(round(w["total_metres"], 1)),
                    "efficiency_pct": eff_float,
                    "performance_label": label,
                    "category": category,
                })
            else:
                unqualified.append({
                    "employee_id": eid,
                    "name": w["name"],
                    "looms_handled": loom_count,
                    "assigned_hours": hours,
                    "reason": "Insufficient operating hours (<6.0h) or <4 looms assigned",
                })

        qualified.sort(key=lambda x: x["efficiency_pct"], reverse=True)
        top_weavers = qualified[:5]
        attention_weavers = [w for w in qualified if w["category"] in ("NEEDS_REVIEW", "DEVELOPMENT")][:5]

        return {
            "top_weavers": top_weavers,
            "attention_required_weavers": attention_weavers,
            "total_qualified": len(qualified),
            "unqualified_count": len(unqualified),
        }
