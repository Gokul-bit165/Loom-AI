"""
Service layer for Natural Language Q&A routing (/api/ask).
"""
from __future__ import annotations

import datetime
from typing import Any
from sqlalchemy.orm import Session

from app.assistant.engine import AssistantEngine
from app.assistant.client import LLMClient


class AskService:
    """
    Coordinates natural-language management questions with the AssistantEngine.
    """

    def __init__(self, session: Session, llm_client: LLMClient | None = None):
        self.session = session
        self.engine = AssistantEngine(session, llm_client=llm_client)

    def route_question(
        self,
        question: str,
        date: datetime.date | None = None,
        department: str | None = None,
        machine_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Processes question through AssistantEngine.
        """
        return self.engine.process_query(
            question=question,
            date=date,
            department=department,
            machine_id=machine_id,
        )
