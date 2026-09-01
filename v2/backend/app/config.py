"""
Loom AI v2 — configuration.

Reads from environment variables only (never hardcodes credentials).
v2 uses its own database, separate from v1's `loom_ai` DB, so the two
systems can run side by side during the cutover period (docs/V2_DESIGN.md
§1 correction on not deleting v1).
"""
from __future__ import annotations

import os
from dataclasses import dataclass

DEMO_SEED = 42


@dataclass(frozen=True)
class Settings:
    postgres_host: str = os.environ.get("V2_POSTGRES_HOST", "localhost")
    postgres_port: int = int(os.environ.get("V2_POSTGRES_PORT", "5432"))
    postgres_db: str = os.environ.get("V2_POSTGRES_DB", "loom_ai_v2")
    postgres_user: str = os.environ.get("V2_POSTGRES_USER", "loom_ai_v2")
    postgres_password: str = os.environ.get("V2_POSTGRES_PASSWORD", "")
    postgres_test_db: str = os.environ.get("V2_POSTGRES_TEST_DB", "loom_ai_v2_test")

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    def test_database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_test_db}"
        )


settings = Settings()
