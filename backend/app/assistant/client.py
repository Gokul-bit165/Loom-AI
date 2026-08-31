"""
Loom AI — LLM Client wrapper with Groq & Anthropic support.
Guarantees robust failure handling without crashing or fabricating numbers.
"""
from __future__ import annotations

import json
import logging
import re
from typing import Any

from app.config import settings
from app.assistant.prompts import SYSTEM_PROMPT

logger = logging.getLogger("loom_ai.assistant")


class LLMClient:
    """
    Handles communication with Groq or Anthropic Claude API.
    Guarantees safe failure handling without crashing or fabricating numbers.
    """

    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        provider: str | None = None,
    ):
        self.groq_api_key = getattr(settings, "groq_api_key", "").strip()
        self.groq_model = getattr(settings, "groq_model", "llama-3.3-70b-versatile").strip()
        self.anthropic_api_key = getattr(settings, "anthropic_api_key", "").strip()
        self.anthropic_model = getattr(settings, "anthropic_model", "claude-3-5-sonnet-20241022").strip()

        self._groq_client = None
        self._anthropic_client = None

        # 1. Try initializing Groq client
        if self.groq_api_key:
            try:
                from groq import Groq
                self._groq_client = Groq(api_key=self.groq_api_key)
                logger.info(f"Initialized Groq LLM client with model {self.groq_model}")
            except Exception as e:
                logger.warning(f"Could not initialize Groq client: {e}")

        # 2. Try initializing Anthropic client as fallback/alternative
        if self.anthropic_api_key:
            try:
                import anthropic
                self._anthropic_client = anthropic.Anthropic(api_key=self.anthropic_api_key)
                logger.info(f"Initialized Anthropic LLM client with model {self.anthropic_model}")
            except Exception as e:
                logger.warning(f"Could not initialize Anthropic client: {e}")

    @property
    def is_available(self) -> bool:
        return (self._groq_client is not None) or (self._anthropic_client is not None)

    def generate_explanation(self, user_prompt: str) -> dict[str, Any] | None:
        """
        Sends prompt to available LLM provider (Groq or Anthropic) and parses JSON.
        Returns None on any network, authentication, or parsing failure.
        """
        if not self.is_available:
            logger.info("No LLM client available; falling back to deterministic response.")
            return None

        # Prefer Groq if configured, else Anthropic
        if self._groq_client:
            result = self._call_groq(user_prompt)
            if result is not None:
                return result

        if self._anthropic_client:
            result = self._call_anthropic(user_prompt)
            if result is not None:
                return result

        return None

    def _call_groq(self, user_prompt: str) -> dict[str, Any] | None:
        """Call Groq API using JSON mode."""
        try:
            chat_completion = self._groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                model=self.groq_model,
                temperature=0.0,
                response_format={"type": "json_object"},
                max_tokens=1500,
            )
            content_text = chat_completion.choices[0].message.content or ""
            return self._parse_json_response(content_text)
        except Exception as exc:
            logger.error(f"Groq API call failed: {exc}")
            return None

    def _call_anthropic(self, user_prompt: str) -> dict[str, Any] | None:
        """Call Anthropic API."""
        try:
            response = self._anthropic_client.messages.create(
                model=self.anthropic_model,
                max_tokens=1500,
                temperature=0.0,
                system=SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": user_prompt},
                ],
            )
            content_text = ""
            for block in response.content:
                if block.type == "text":
                    content_text += block.text
            return self._parse_json_response(content_text)
        except Exception as exc:
            logger.error(f"Anthropic API call failed: {exc}")
            return None

    def _parse_json_response(self, text: str) -> dict[str, Any] | None:
        """
        Extracts and parses JSON object from model output.
        """
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            match = re.search(r"(\{.*\})", text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except json.JSONDecodeError:
                    pass
            logger.error(f"Failed to parse JSON response from LLM. Raw text: {text[:200]}")
            return None
