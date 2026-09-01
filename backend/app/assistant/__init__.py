"""
AI Management Assistant module for Loom AI.
"""
from app.assistant.client import LLMClient
from app.assistant.engine import AssistantEngine
from app.assistant.intent import QueryIntent, classify_query_intent
from app.assistant.prompts import SYSTEM_PROMPT, build_user_prompt

__all__ = [
    "AssistantEngine",
    "LLMClient",
    "QueryIntent",
    "classify_query_intent",
    "SYSTEM_PROMPT",
    "build_user_prompt",
]
