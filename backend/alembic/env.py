"""
Alembic environment — wires the migration runner to:

1. The DATABASE_URL from .env (never hardcoded).
2. The SQLAlchemy metadata from our ORM models so Alembic can
   auto-detect schema drift if needed in the future.
"""
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool

# ── Path setup ────────────────────────────────────────────────────────────────
# Add the backend/ directory to sys.path so `from app.x import y` works.
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.config import settings  # noqa: E402
from app.models import Base  # noqa: E402

# ── Alembic config object ─────────────────────────────────────────────────────
config = context.config

# Override the sqlalchemy.url from alembic.ini with the real URL from .env.
config.set_main_option("sqlalchemy.url", settings.database_url)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# The metadata that Alembic autogenerate uses.
target_metadata = Base.metadata


# ── Migration helpers ─────────────────────────────────────────────────────────

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (SQL output, no live connection)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations against a live database connection."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
