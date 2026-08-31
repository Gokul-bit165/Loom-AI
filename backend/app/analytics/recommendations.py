"""
Loom AI — Evidence-Based Rule Recommendation Engine.

Deterministic, transparent, rule-based prescriptive recommendations derived directly
from production, breakdown, and revenue analytics payloads.

Output Schema per recommendation object:
- priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
- issue: Short descriptive summary of the identified bottleneck or opportunity
- evidence: Concrete factual metric justification (machine IDs, efficiency %, downtime minutes, etc.)
- suggested_action: Specific prescriptive remediation step for operations / maintenance teams
- expected_impact: Expected quantifiable operational or monetary benefit
- confidence: "HIGH" | "VERY HIGH" | "MEDIUM"
- source_metrics: Structured key-value dictionary of the raw numbers backing this recommendation
"""
from __future__ import annotations

from typing import Any


def get_production_recommendations(production_data: dict[str, Any] | None) -> list[dict[str, Any]]:
    """
    Evaluates deterministic production variance data and produces actionable recommendations.
    """
    if not production_data:
        return []

    recommendations: list[dict[str, Any]] = []
    summary = production_data.get("summary", {})
    machines = production_data.get("machine_performance", [])
    shifts = production_data.get("shift_performance", [])
    prod_loss = production_data.get("production_loss", {})

    # Rule 1: Critical Underperforming Machines (Efficiency < 80%)
    critical_machines = [m for m in machines if m.get("efficiency", 100.0) < 80.0]
    for m in critical_machines:
        m_id = m["machine_id"]
        eff = m["efficiency"]
        deficit = abs(m.get("variance", 0.0))
        target = m.get("target", 0.0)
        actual = m.get("actual", 0.0)

        recommendations.append(
            {
                "priority": "CRITICAL",
                "issue": f"Severe production deficit on {m_id} ({eff:.1f}% efficiency)",
                "evidence": (
                    f"Machine {m_id} ({m.get('machine_type')}, {m.get('department')}) produced "
                    f"{actual:,.0f} units against target {target:,.0f} units (shortfall of {deficit:,.0f} units)."
                ),
                "suggested_action": (
                    f"Initiate priority mechanical and electrical inspection on {m_id}. "
                    f"Audit yarn feed tension, sensor alignment, and recent shift stoppage logs."
                ),
                "expected_impact": f"Recover up to {deficit:,.0f} units of daily production capacity.",
                "confidence": "VERY HIGH",
                "source_metrics": {
                    "machine_id": m_id,
                    "efficiency_pct": eff,
                    "target_qty": target,
                    "actual_qty": actual,
                    "variance_qty": m.get("variance", 0.0),
                },
            }
        )

    # Rule 2: Watchlist Machines (Efficiency 80% - 90%)
    watch_machines = [m for m in machines if 80.0 <= m.get("efficiency", 100.0) < 90.0]
    if watch_machines:
        m_ids = [m["machine_id"] for m in watch_machines[:4]]
        total_deficit = sum(abs(m.get("variance", 0.0)) for m in watch_machines)
        recommendations.append(
            {
                "priority": "MEDIUM",
                "issue": f"Sub-optimal yield across {len(watch_machines)} watchlist machines ({', '.join(m_ids)})",
                "evidence": (
                    f"Units operate between 80% and 90% efficiency with cumulative deficit of {total_deficit:,.0f} units."
                ),
                "suggested_action": (
                    "Schedule routine preventative maintenance overhaul and review operator shift handovers."
                ),
                "expected_impact": f"Reclaim ~{total_deficit * 0.5:,.0f} units by restoring baseline 95% efficiency.",
                "confidence": "HIGH",
                "source_metrics": {
                    "machine_count": len(watch_machines),
                    "sample_machine_ids": m_ids,
                    "cumulative_deficit_qty": total_deficit,
                },
            }
        )

    # Rule 3: Shift Disparity in Production Output
    if len(shifts) >= 2:
        shift_effs = [(s["shift"], s.get("efficiency", 0.0), s.get("variance", 0.0)) for s in shifts]
        min_shift = min(shift_effs, key=lambda x: x[1])
        max_shift = max(shift_effs, key=lambda x: x[1])
        eff_spread = max_shift[1] - min_shift[1]

        if eff_spread >= 8.0:
            recommendations.append(
                {
                    "priority": "HIGH",
                    "issue": f"Significant shift efficiency disparity ({eff_spread:.1f}% spread between Shift {min_shift[0]} and Shift {max_shift[0]})",
                    "evidence": (
                        f"Shift {min_shift[0]} recorded {min_shift[1]:.1f}% efficiency vs "
                        f"Shift {max_shift[0]} at {max_shift[1]:.1f}%."
                    ),
                    "suggested_action": (
                        f"Audit Shift {min_shift[0]} operator staffing coverage, material staging availability, "
                        f"and maintenance response latency during shift transitions."
                    ),
                    "expected_impact": "Stabilize inter-shift variance and lift aggregate plant output by 3-5%.",
                    "confidence": "HIGH",
                    "source_metrics": {
                        "lowest_shift": min_shift[0],
                        "lowest_shift_efficiency": min_shift[1],
                        "highest_shift": max_shift[0],
                        "highest_shift_efficiency": max_shift[1],
                        "efficiency_spread": round(eff_spread, 2),
                    },
                }
            )

    # Rule 4: Estimated Production Loss Opportunity
    loss_machines = prod_loss.get("machines_with_loss", [])
    if loss_machines and prod_loss.get("estimated_production_loss_qty", 0.0) > 0.0:
        top_loss = loss_machines[0]
        recommendations.append(
            {
                "priority": "HIGH",
                "issue": f"Top downtime production loss on {top_loss['machine_id']} ({top_loss['estimated_loss_qty']:,.0f} units estimated)",
                "evidence": (
                    f"Breakdown downtime on {top_loss['machine_id']} caused estimated opportunity loss of "
                    f"{top_loss['estimated_loss_qty']:,.0f} units on target date."
                ),
                "suggested_action": (
                    f"Perform targeted root-cause corrective maintenance on {top_loss['machine_id']} "
                    f"to eliminate chronic trip triggers."
                ),
                "expected_impact": f"Directly recover up to {top_loss['estimated_loss_qty']:,.0f} units of lost output.",
                "confidence": "HIGH",
                "source_metrics": {
                    "machine_id": top_loss["machine_id"],
                    "estimated_loss_qty": top_loss["estimated_loss_qty"],
                    "total_plant_loss_qty": prod_loss.get("estimated_production_loss_qty", 0.0),
                },
            }
        )

    return recommendations


def get_breakdown_recommendations(breakdown_data: dict[str, Any] | None) -> list[dict[str, Any]]:
    """
    Evaluates deterministic breakdown and stoppage rankings and produces actionable recommendations.
    """
    if not breakdown_data:
        return []

    recommendations: list[dict[str, Any]] = []
    total_dt = breakdown_data.get("total_downtime_minutes", 0)
    total_events = breakdown_data.get("total_events", 0)
    m_ranking = breakdown_data.get("machine_ranking", [])
    r_ranking = breakdown_data.get("reason_ranking", [])
    s_ranking = breakdown_data.get("shift_ranking", [])
    count_ranking = breakdown_data.get("breakdown_count_ranking", [])

    if total_dt == 0 or total_events == 0:
        return recommendations

    # Rule 1: Dominant Pareto Stoppage Reason (>30% of total downtime)
    if r_ranking:
        top_reason = r_ranking[0]
        reason_dt = top_reason.get("total_downtime_minutes", 0)
        pct_dt = top_reason.get("percentage_of_total_downtime", 0.0)

        if pct_dt >= 30.0 or reason_dt >= 90:
            recommendations.append(
                {
                    "priority": "HIGH" if pct_dt < 50.0 else "CRITICAL",
                    "issue": f"Downtime concentrated in '{top_reason['reason']}' ({pct_dt:.1f}% of plant downtime)",
                    "evidence": (
                        f"Reason '{top_reason['reason']}' accounted for {reason_dt} minutes across "
                        f"{top_reason.get('event_count', 0)} events ({pct_dt:.1f}% of total downtime)."
                    ),
                    "suggested_action": (
                        f"Implement standard operating procedure (SOP) review and specialized tooling "
                        f"for '{top_reason['reason']}' to cut mean duration."
                    ),
                    "expected_impact": f"Reduce plant downtime by up to {reason_dt * 0.3:.0f} minutes.",
                    "confidence": "VERY HIGH",
                    "source_metrics": {
                        "reason": top_reason["reason"],
                        "downtime_minutes": reason_dt,
                        "percentage_of_total_downtime": pct_dt,
                        "event_count": top_reason.get("event_count", 0),
                    },
                }
            )

    # Rule 2: Top Downtime Machine (>60 mins downtime)
    if m_ranking:
        top_m = m_ranking[0]
        m_dt = top_m.get("downtime_minutes", 0)
        if m_dt >= 60:
            recommendations.append(
                {
                    "priority": "CRITICAL" if m_dt >= 120 else "HIGH",
                    "issue": f"Chronic downtime bottleneck on {top_m['machine_id']} ({m_dt} minutes lost)",
                    "evidence": (
                        f"Machine {top_m['machine_id']} suffered {m_dt} minutes of downtime across "
                        f"{top_m.get('event_count', 0)} events ({top_m.get('percentage_of_total_downtime', 0.0):.1f}% of total plant downtime)."
                    ),
                    "suggested_action": (
                        f"Assign dedicated technician to overhaul mechanical wear components on {top_m['machine_id']}."
                    ),
                    "expected_impact": f"Eliminate up to {m_dt} minutes of machine stoppage.",
                    "confidence": "VERY HIGH",
                    "source_metrics": {
                        "machine_id": top_m["machine_id"],
                        "downtime_minutes": m_dt,
                        "event_count": top_m.get("event_count", 0),
                        "percentage_of_total_downtime": top_m.get("percentage_of_total_downtime", 0.0),
                    },
                }
            )

    # Rule 3: High-Frequency Event Machine (High event count with short duration)
    if count_ranking:
        top_freq = count_ranking[0]
        if top_freq.get("event_count", 0) >= 3 and top_freq.get("average_event_duration", 0) <= 25:
            recommendations.append(
                {
                    "priority": "MEDIUM",
                    "issue": f"Frequent micro-stoppages on {top_freq['machine_id']} ({top_freq['event_count']} events)",
                    "evidence": (
                        f"Machine {top_freq['machine_id']} tripped {top_freq['event_count']} times with an average duration "
                        f"of {top_freq.get('average_event_duration', 0):.1f} minutes."
                    ),
                    "suggested_action": (
                        f"Calibrate yarn feelers and warp/weft stop motions on {top_freq['machine_id']} to stop nuisance tripping."
                    ),
                    "expected_impact": "Stabilize continuous loom run-state and reduce operator fatigue.",
                    "confidence": "HIGH",
                    "source_metrics": {
                        "machine_id": top_freq["machine_id"],
                        "event_count": top_freq["event_count"],
                        "average_event_duration": top_freq.get("average_event_duration", 0),
                    },
                }
            )

    # Rule 4: Shift Downtime Concentration (>60% on one shift)
    if s_ranking:
        top_s = s_ranking[0]
        s_pct = top_s.get("percentage_of_total_downtime", 0.0)
        if s_pct >= 60.0 and top_s.get("downtime_minutes", 0) >= 60:
            recommendations.append(
                {
                    "priority": "HIGH",
                    "issue": f"Downtime disproportionately concentrated in Shift {top_s['shift']} ({s_pct:.1f}%)",
                    "evidence": (
                        f"Shift {top_s['shift']} incurred {top_s['downtime_minutes']} minutes of downtime ({s_pct:.1f}% of daily total)."
                    ),
                    "suggested_action": (
                        f"Review Shift {top_s['shift']} maintenance roster and expedite breakdown response time."
                    ),
                    "expected_impact": "Cut peak shift downtime by 25-35%.",
                    "confidence": "HIGH",
                    "source_metrics": {
                        "shift": top_s["shift"],
                        "downtime_minutes": top_s["downtime_minutes"],
                        "percentage_of_total_downtime": s_pct,
                    },
                }
            )

    return recommendations


def get_revenue_recommendations(revenue_data: dict[str, Any] | None) -> list[dict[str, Any]]:
    """
    Evaluates deterministic revenue summary and produces commercial recommendations.
    """
    if not revenue_data:
        return []

    recommendations: list[dict[str, Any]] = []
    rev_loss = revenue_data.get("revenue_loss", {})
    loss_machines = rev_loss.get("machines_with_loss", [])
    styles = revenue_data.get("fabric_style_ranking", [])

    # Rule 1: High Estimated Revenue Loss from Downtime
    if loss_machines and rev_loss.get("estimated_revenue_loss", 0.0) > 0.0:
        top_m = loss_machines[0]
        tot_loss = rev_loss.get("estimated_revenue_loss", 0.0)
        recommendations.append(
            {
                "priority": "HIGH",
                "issue": f"Estimated revenue opportunity loss on {top_m['machine_id']} (Rs {top_m['estimated_loss']:,.2f})",
                "evidence": (
                    f"Breakdown downtime resulted in an estimated Rs {top_m['estimated_loss']:,.2f} opportunity loss on "
                    f"{top_m['machine_id']} (total plant revenue loss: Rs {tot_loss:,.2f})."
                ),
                "suggested_action": (
                    f"Prioritize maintenance on high-revenue loom {top_m['machine_id']} to maximize commercial realization."
                ),
                "expected_impact": f"Protect up to Rs {top_m['estimated_loss']:,.2f} of commercial revenue yield.",
                "confidence": "HIGH",
                "source_metrics": {
                    "machine_id": top_m["machine_id"],
                    "estimated_revenue_loss": top_m["estimated_loss"],
                    "total_plant_revenue_loss": tot_loss,
                },
            }
        )

    # Rule 2: Fabric Style Revenue Concentration
    if len(styles) >= 2:
        top_style = styles[0]
        if top_style.get("percentage_of_total", 0.0) >= 50.0:
            recommendations.append(
                {
                    "priority": "LOW",
                    "issue": f"Revenue heavily driven by '{top_style['fabric_style']}' ({top_style['percentage_of_total']:.1f}% share)",
                    "evidence": (
                        f"Style '{top_style['fabric_style']}' contributed Rs {top_style['total_revenue']:,.2f} "
                        f"across {top_style.get('machine_count', 0)} looms."
                    ),
                    "suggested_action": (
                        f"Ensure continuous yarn beam supply and dedicated quality checks for '{top_style['fabric_style']}' orders."
                    ),
                    "expected_impact": "Maintain high commercial delivery reliability for anchor revenue product.",
                    "confidence": "HIGH",
                    "source_metrics": {
                        "fabric_style": top_style["fabric_style"],
                        "total_revenue": top_style["total_revenue"],
                        "percentage_of_total": top_style["percentage_of_total"],
                    },
                }
            )

    return recommendations


def generate_recommendations(
    production_data: dict[str, Any] | None = None,
    breakdown_data: dict[str, Any] | None = None,
    revenue_data: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    """
    Aggregates and prioritizes recommendations across all operational domains.
    Returns list sorted by priority (CRITICAL -> HIGH -> MEDIUM -> LOW).
    """
    priority_weight = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}

    all_recs: list[dict[str, Any]] = []
    if production_data:
        all_recs.extend(get_production_recommendations(production_data))
    if breakdown_data:
        all_recs.extend(get_breakdown_recommendations(breakdown_data))
    if revenue_data:
        all_recs.extend(get_revenue_recommendations(revenue_data))

    # If plant is performing smoothly with no critical issues, supply an optimal baseline note
    if not all_recs:
        all_recs.append(
            {
                "priority": "LOW",
                "issue": "Plant operating within optimal parameters",
                "evidence": "Zero critical machine underperformance or excessive breakdown downtime detected.",
                "suggested_action": "Maintain standard preventative maintenance schedules and standard operating routines.",
                "expected_impact": "Sustained high efficiency and delivery reliability.",
                "confidence": "VERY HIGH",
                "source_metrics": {},
            }
        )

    all_recs.sort(key=lambda x: priority_weight.get(x.get("priority", "LOW"), 4))
    return all_recs
