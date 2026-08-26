"""
Loom AI — application configuration.

Reads from .env via pydantic-settings. All values are validated at startup;
the application refuses to start if required variables are missing.
"""
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Single source of truth for all runtime configuration.

    Values are loaded from the .env file in the backend/ directory.
    Environment variables override .env values.
    """

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── PostgreSQL ────────────────────────────────────────────────────────────
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "loom_ai"
    postgres_user: str = "loom_ai"
    postgres_password: str

    # Explicit DATABASE_URL takes precedence if set.
    # Falls back to constructing from individual fields.
    database_url: str = ""

    def model_post_init(self, __context: object) -> None:
        if not self.database_url:
            object.__setattr__(
                self,
                "database_url",
                (
                    f"postgresql://{self.postgres_user}:{self.postgres_password}"
                    f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
                ),
            )

    # ── LLM (Phase 3) ────────────────────────────────────────────────────────
    anthropic_api_key: str = ""

    # ── App behaviour ────────────────────────────────────────────────────────
    app_env: str = "development"

    # ── Data paths ───────────────────────────────────────────────────────────
    data_dir: str = "../"
    csv_machines: str = "machines.csv"
    csv_production: str = "production_log.csv"
    csv_breakdown: str = "breakdown_events.csv"
    csv_revenue: str = "revenue_log.csv"

    @property
    def data_root(self) -> Path:
        """Absolute path to the directory containing the CSV files."""
        base = Path(__file__).parent.parent  # backend/
        return (base / self.data_dir).resolve()

    def csv_path(self, filename: str) -> Path:
        return self.data_root / filename


# Module-level singleton — import this everywhere.
settings = Settings()
