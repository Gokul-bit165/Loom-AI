"""
Loom AI — database engine and session factory.

This module is the single place that creates the SQLAlchemy engine.
All other modules obtain sessions through get_session().

Connection strategy
-------------------
- Uses psycopg2 (synchronous) for Alembic, ETL, and tests.
- FastAPI routes will use an async engine built from the same DATABASE_URL
  (phase 4).
"""
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings

# ── Engine ────────────────────────────────────────────────────────────────────

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,       # detect stale connections
    pool_size=5,
    max_overflow=10,
    echo=settings.app_env == "development",  # log SQL in dev only
)

# ── Session factory ───────────────────────────────────────────────────────────

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """
    Context-manager session.  Usage::

        with get_session() as session:
            session.add(some_object)
            session.commit()

    The session is always closed on exit; rollback is performed on exception.
    """
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def check_connection() -> bool:
    """Return True if the database is reachable, False otherwise."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
