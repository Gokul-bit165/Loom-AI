"""
AI Management Assistant Engine.

Coordinates:
User Question -> Intent Classification -> Deterministic Analytics ->
Prompt Engineering -> Claude LLM -> Structured Narrative & Recommendations
"""
from __future__ import annotations

import datetime
from typing import Any
from sqlalchemy.orm import Session

from app.analytics.breakdown import get_breakdown_ranking
from app.analytics.production import get_production_variance
from app.analytics.revenue import get_revenue_summary
from app.assistant.client import LLMClient
from app.assistant.intent import QueryIntent, classify_query_intent
from app.assistant.prompts import build_user_prompt


class AssistantEngine:
    """
    Main entry point for AI Management Assistant explanations.
    """

    def __init__(self, session: Session, llm_client: LLMClient | None = None):
        self.session = session
        self.llm = llm_client or LLMClient()

    def process_query(
        self,
        question: str,
        date: datetime.date | None = None,
        department: str | None = None,
        machine_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Executes end-to-end assistant workflow for a user question.
        """
        classified = classify_query_intent(question)

        # 1. Reject out-of-scope queries
        if not classified.is_supported or classified.intent == QueryIntent.OUT_OF_SCOPE:
            return {
                "answer": (
                    "This question is outside the current V1 scope. "
                    "Loom AI V1 currently supports Q1 (Production, Output & Efficiency), "
                    "Q5 (Breakdowns, Downtime & Stoppages), and Q21 (Revenue & Fabric Styles)."
                ),
                "key_findings": [],
                "suggestions": [],
                "evidence": [],
                "data_quality": {},
                "scope": "OUT_OF_SCOPE",
                "ai_status": "out_of_scope",
                "analytics_data": {},
            }

        # 2. Invoke deterministic analytics based on intent
        scope_str = classified.intent.value  # "Q1", "Q5", or "Q21"

        if classified.intent == QueryIntent.Q1_PRODUCTION:
            raw_analytics = get_production_variance(
                session=self.session,
                date=date,
                department=department,
                machine_id=machine_id,
            )
            evidence_list = raw_analytics.get("evidence", {}).get("production_log_ids", [])
        elif classified.intent == QueryIntent.Q5_BREAKDOWN:
            raw_analytics = get_breakdown_ranking(
                session=self.session,
                period=classified.period,
                date=date,
                department=department,
                machine_id=machine_id,
            )
            evidence_list = raw_analytics.get("evidence", {}).get("breakdown_event_ids", [])
        elif classified.intent == QueryIntent.Q21_REVENUE:
            raw_analytics = get_revenue_summary(
                session=self.session,
                date=date,
                department=department,
                machine_id=machine_id,
            )
            evidence_list = raw_analytics.get("evidence", {}).get("revenue_log_ids", [])
        else:
            raw_analytics = {}
            evidence_list = []

        data_quality = raw_analytics.get("data_quality", {})
        metadata = {
            "query_date": str(date) if date else "latest",
            "scope": scope_str,
            "period": classified.period,
            "is_demo": data_quality.get("is_demo", True),
            "dataset_label": data_quality.get("dataset_label", "Synthetic Factory Data"),
        }

        # 3. Construct prompt and send to LLM
        user_prompt = build_user_prompt(
            question=question,
            scope=scope_str,
            analytics_data=raw_analytics,
            data_quality=data_quality,
            metadata=metadata,
        )

        llm_response = self.llm.generate_explanation(user_prompt)

        # 4. Handle LLM failure or parse success
        if llm_response and isinstance(llm_response, dict) and "answer" in llm_response:
            ai_status = "success"
            answer_text = llm_response.get("answer", "")
            key_findings = llm_response.get("key_findings", [])
            suggestions = llm_response.get("suggestions", [])
        else:
            # Deterministic fallback explanation
            ai_status = "unavailable"
            answer_text = (
                "AI narrative explanation is temporarily unavailable. "
                "The verified deterministic analytics and underlying metrics are provided below."
            )
            key_findings = self._generate_fallback_findings(classified.intent, raw_analytics)
            suggestions = self._generate_fallback_suggestions(classified.intent, raw_analytics)

        return {
            "answer": answer_text,
            "key_findings": key_findings,
            "suggestions": suggestions,
            "evidence": evidence_list[:20],  # Sample evidence identifiers for audit
            "data_quality": data_quality,
            "scope": scope_str,
            "ai_status": ai_status,
            "analytics_data": raw_analytics,
        }

    def _generate_fallback_findings(self, intent: QueryIntent, analytics: dict[str, Any]) -> list[str]:
        findings = []
        if intent == QueryIntent.Q1_PRODUCTION and "summary" in analytics:
            s = analytics["summary"]
            findings.append(f"Total actual production: {s.get('total_actual', 0):,} units (Target: {s.get('total_target', 0):,}).")
            findings.append(f"Average plant efficiency: {s.get('average_efficiency', 0)}%.")
            if s.get("change_vs_previous_day_pct") is not None:
                findings.append(f"Day-over-day production change: {s.get('change_vs_previous_day_pct')}% vs previous day.")
        elif intent == QueryIntent.Q5_BREAKDOWN:
            findings.append(f"Total downtime: {analytics.get('total_downtime_minutes', 0)} minutes across {analytics.get('total_events', 0)} events.")
            if analytics.get("highest_downtime_machine"):
                hm = analytics["highest_downtime_machine"]
                findings.append(f"Highest downtime machine: {hm.get('machine_id')} with {hm.get('downtime_minutes')} minutes.")
        elif intent == QueryIntent.Q21_REVENUE and "summary" in analytics:
            s = analytics["summary"]
            findings.append(f"Today's revenue: Rs {s.get('today_revenue', 0):,}.")
            findings.append(f"Month-to-date (MTD) revenue: Rs {s.get('mtd_revenue', 0):,}.")
        return findings

    def _generate_fallback_suggestions(self, intent: QueryIntent, analytics: dict[str, Any]) -> list[str]:
        suggestions = []
        if intent == QueryIntent.Q1_PRODUCTION:
            underperformers = [
                m["machine_id"]
                for m in analytics.get("machine_performance", [])
                if m.get("performance_status") in ("CRITICAL", "UNDERPERFORMING")
            ]
            if underperformers:
                suggestions.append(f"Review shift logs and schedule mechanical inspection for underperforming machines: {', '.join(underperformers[:3])}.")
            else:
                suggestions.append("Maintain standard preventive maintenance schedule; all machines operating within normal efficiency thresholds.")
        elif intent == QueryIntent.Q5_BREAKDOWN:
            if analytics.get("recurring_reasons"):
                top_reason = analytics["recurring_reasons"][0]["reason"]
                suggestions.append(f"Investigate root causes contributing to recurring '{top_reason}' downtime events.")
        elif intent == QueryIntent.Q21_REVENUE:
            if analytics.get("worst_machine"):
                wm = analytics["worst_machine"]["machine_id"]
                suggestions.append(f"Review production allocation and loom efficiency on {wm} to assess revenue contribution.")
        return suggestions
