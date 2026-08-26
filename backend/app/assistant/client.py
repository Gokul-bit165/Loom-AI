"""
Anthropic Claude API client wrapper with robust failure handling.
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
    Handles communication with Anthropic Claude API.
    Guarantees safe failure handling without crashing or fabricating numbers.
    """

    def __init__(self, api_key: str | None = None, model: str | None = None):
        self.api_key = api_key or getattr(settings, "anthropic_api_key", "")
        self.model = model or getattr(settings, "anthropic_model", "claude-3-5-sonnet-20241022")
        self._client = None

        if self.api_key and self.api_key.strip():
            try:
                import anthropic
                self._client = anthropic.Anthropic(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize Anthropic client: {e}")
                self._client = None

    @property
    def is_available(self) -> bool:
        return self._client is not None

    def generate_explanation(self, user_prompt: str) -> dict[str, Any] | None:
        """
        Sends prompt to Claude and parses the JSON response.
        Returns None on any network, authentication, or parsing failure.
        """
        if not self._client:
            logger.info("Anthropic client not available; falling back to deterministic response.")
            return None

        try:
            response = self._client.messages.create(
                model=self.model,
                max_tokens=1500,
                temperature=0.0,  # Zero temperature for maximum determinism and consistency
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
        # Remove markdown code block fences if present
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
            # Try regex extraction for {...}
            match = re.search(r"(\{.*\})", text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except json.JSONDecodeError:
                    pass
            logger.error(f"Failed to parse JSON response from LLM. Raw text: {text[:200]}")
            return None
