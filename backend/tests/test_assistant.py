"""
Tests for AI Management Assistant (app/assistant/).
"""
import datetime
from decimal import Decimal
from typing import Any
from unittest.mock import MagicMock
import pytest
from sqlalchemy.orm import Session

from app.assistant.client import LLMClient
from app.assistant.engine import AssistantEngine
from app.assistant.intent import QueryIntent, classify_query_intent
from app.db_models import Machine, ProductionLog, BreakdownEvent, RevenueLog


@pytest.fixture()
def seeded_assistant_db(db_session: Session) -> datetime.date:
    """
    Populates test database with standard test records.
    """
    d = datetime.date(2026, 8, 29)

    m1 = Machine(machine_id="TOY-01", unit="Unit I", department="Weaving", machine_type="Toyota", granularity="synthetic_loom_number")
    m2 = Machine(machine_id="RF-11", unit="Unit I", department="Spinning", machine_type="RingFrame", granularity="real_grounded")
    db_session.add_all([m1, m2])
    db_session.flush()

    db_session.add(ProductionLog(date=d, shift=1, machine_id="TOY-01", target_qty=20000, actual_qty=19000, efficiency_pct=95.0))
    db_session.add(ProductionLog(date=d, shift=1, machine_id="RF-11", target_qty=2500, actual_qty=1800, efficiency_pct=72.0))
    db_session.add(BreakdownEvent(date=d, shift=1, machine_id="RF-11", reason="Full cleaning work", duration_minutes=120))
    db_session.add(RevenueLog(date=d, shift=1, machine_id="TOY-01", fabric_style="Excel Slub", revenue=4500.00))
    db_session.flush()

    return d


class MockSuccessfulLLMClient(LLMClient):
    """
    Mock LLM client returning valid grounded JSON.
    """
    def __init__(self):
        super().__init__(api_key=None)

    @property
    def is_available(self) -> bool:
        return True

    def generate_explanation(self, user_prompt: str) -> dict[str, Any] | None:
        return {
            "answer": "Factory production operated at 92.4% average efficiency with a total volume of 20,800 units.",
            "key_findings": [
                "Plant produced 20,800 units against a target of 22,500 units.",
                "RF-11 operated at 72.0% efficiency due to 120 minutes of downtime.",
            ],
            "suggestions": [
                "Review shift 1 cleaning schedules on RF-11 to reduce downtime.",
                "Verify loom tension settings on weaving machines.",
            ],
        }


class MockFailingLLMClient(LLMClient):
    """
    Mock LLM client simulating network/API failure.
    """
    def __init__(self):
        super().__init__(api_key=None)

    @property
    def is_available(self) -> bool:
        return True

    def generate_explanation(self, user_prompt: str) -> dict[str, Any] | None:
        return None  # Simulates API failure


# ─────────────────────────────────────────────────────────────────────────────
# Intent Classification Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_intent_classification_q1_production():
    for q in (
        "How did production perform today?",
        "What was our plant efficiency?",
        "Show me actual versus target output by shift",
        "Which machines underperformed in production?",
    ):
        res = classify_query_intent(q)
        assert res.intent == QueryIntent.Q1_PRODUCTION
        assert res.is_supported is True


def test_intent_classification_q5_breakdown():
    for q in (
        "Which machines have the most downtime?",
        "Show me breakdown reasons for today",
        "What caused machine stoppages this month?",
        "List all idle hours and repairs",
    ):
        res = classify_query_intent(q)
        assert res.intent == QueryIntent.Q5_BREAKDOWN
        assert res.is_supported is True


def test_intent_classification_q21_revenue():
    for q in (
        "How is revenue performing?",
        "What is our revenue by fabric style?",
        "Show monetary turnover for today",
        "Which fabric style made the most sales?",
    ):
        res = classify_query_intent(q)
        assert res.intent == QueryIntent.Q21_REVENUE
        assert res.is_supported is True


def test_intent_classification_out_of_scope():
    for q in (
        "What is the operator attendance today?",
        "How many workers were absent?",
        "What is our air compressor pressure and air consumption?",
        "Show quality test CSP and count CV results",
        "What is the CEO's schedule today?",
        "How is the weather in Coimbatore?",
    ):
        res = classify_query_intent(q)
        assert res.intent == QueryIntent.OUT_OF_SCOPE
        assert res.is_supported is False


# ─────────────────────────────────────────────────────────────────────────────
# End-to-End Assistant Tests (with Mock LLM)
# ─────────────────────────────────────────────────────────────────────────────

def test_assistant_q1_production_query(db_session: Session, seeded_assistant_db: datetime.date):
    engine = AssistantEngine(session=db_session, llm_client=MockSuccessfulLLMClient())
    res = engine.process_query("How did production perform today?", date=seeded_assistant_db)

    assert res["scope"] == "Q1"
    assert res["ai_status"] == "success"
    assert "efficiency" in res["answer"]
    assert len(res["key_findings"]) >= 2
    assert len(res["suggestions"]) >= 2
    assert len(res["evidence"]) > 0

    # Verify underlying deterministic analytics are intact
    assert res["analytics_data"]["summary"]["total_actual"] == 20800.0
    assert res["analytics_data"]["summary"]["total_target"] == 22500.0


def test_assistant_q5_breakdown_query(db_session: Session, seeded_assistant_db: datetime.date):
    engine = AssistantEngine(session=db_session, llm_client=MockSuccessfulLLMClient())
    res = engine.process_query("Which machines had the highest downtime today?", date=seeded_assistant_db)

    assert res["scope"] == "Q5"
    assert res["ai_status"] == "success"
    assert res["analytics_data"]["total_downtime_minutes"] == 120
    assert res["analytics_data"]["highest_downtime_machine"]["machine_id"] == "RF-11"


def test_assistant_q21_revenue_query(db_session: Session, seeded_assistant_db: datetime.date):
    engine = AssistantEngine(session=db_session, llm_client=MockSuccessfulLLMClient())
    res = engine.process_query("How is revenue performing?", date=seeded_assistant_db)

    assert res["scope"] == "Q21"
    assert res["ai_status"] == "success"
    assert res["analytics_data"]["summary"]["today_revenue"] == 4500.0
    assert res["analytics_data"]["revenue_loss"]["revenue_loss_available"] is False


def test_assistant_rejects_out_of_scope_query(db_session: Session):
    engine = AssistantEngine(session=db_session, llm_client=MockSuccessfulLLMClient())
    res = engine.process_query("What is the worker salary and attendance today?")

    assert res["scope"] == "OUT_OF_SCOPE"
    assert res["ai_status"] == "out_of_scope"
    assert "outside the current V1 scope" in res["answer"]
    assert len(res["key_findings"]) == 0
    assert len(res["suggestions"]) == 0
    assert res["analytics_data"] == {}


def test_assistant_graceful_failure_when_llm_unavailable(db_session: Session, seeded_assistant_db: datetime.date):
    """
    When the LLM API fails, the assistant MUST NOT fabricate text,
    MUST return ai_status='unavailable', and MUST provide verified fallback
    findings and deterministic analytics data.
    """
    engine = AssistantEngine(session=db_session, llm_client=MockFailingLLMClient())
    res = engine.process_query("How did production perform today?", date=seeded_assistant_db)

    assert res["scope"] == "Q1"
    assert res["ai_status"] == "unavailable"
    assert "temporarily unavailable" in res["answer"]

    # Fallback deterministic findings must be populated
    assert len(res["key_findings"]) > 0
    assert any("20,800" in f for f in res["key_findings"])

    # Fallback conservative suggestions must be present
    assert len(res["suggestions"]) > 0
    assert any("RF-11" in s for s in res["suggestions"])

    # Underlying deterministic analytics must be 100% accessible
    assert res["analytics_data"]["summary"]["total_actual"] == 20800.0


def test_numeric_integrity_llm_cannot_modify_analytics_data(db_session: Session, seeded_assistant_db: datetime.date):
    """
    Tests that regardless of what the LLM returns in its answer text,
    the analytics_data object contains exact database-computed numbers.
    """
    engine = AssistantEngine(session=db_session, llm_client=MockSuccessfulLLMClient())
    res = engine.process_query("What was production output today?", date=seeded_assistant_db)

    # Database has 19,000 (TOY-01) + 1,800 (RF-11) = 20,800
    assert res["analytics_data"]["summary"]["total_actual"] == 20800.0
    assert res["analytics_data"]["summary"]["total_target"] == 22500.0
    assert res["analytics_data"]["summary"]["variance_qty"] == -1700.0
