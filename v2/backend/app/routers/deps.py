"""
Loom AI v2 — shared router dependencies.

get_session: yields a SQLAlchemy session from the production database.
get_db_session_for_test: used by test fixtures — session is passed in directly.
"""
from __future__ import annotations

import datetime
from typing import Generator

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings

_engine = create_engine(settings.database_url, future=True, pool_pre_ping=True)
_SessionLocal = sessionmaker(bind=_engine, future=True)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency: yields a DB session, always closes on exit."""
    session = _SessionLocal()
    try:
        yield session
    finally:
        session.close()


def utc_now() -> datetime.datetime:
    return datetime.datetime.now(datetime.timezone.utc)


def http_error(status: int, code: str, detail: str) -> HTTPException:
    """Raises a structured HTTPException matching ErrorResponse schema."""
    raise HTTPException(
        status_code=status,
        detail={"ok": False, "error": {"code": code, "detail": detail}},
    )
