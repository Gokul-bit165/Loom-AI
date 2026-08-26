"""
Pytest configuration and fixtures for Loom AI database tests.

Test strategy
-------------
- Tests run against a dedicated PostgreSQL test database (loom_ai_test).
- The schema is created fresh at the start of each test session and
  dropped at the end.
- Each test gets an isolated session whose work is rolled back after the
  test completes — no test pollutes another.
- No test ever touches the production loom_ai database.

Environment
-----------
The test database URL is built from the same .env variables as production,
with the database name overridden to loom_ai_test.
Override with: TEST_DATABASE_URL environment variable.
"""
import os
import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

# ── Path setup ────────────────────────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import settings
from app.db_models import Base, Machine, ProductionLog, BreakdownEvent, RevenueLog

# ── Test database URL ─────────────────────────────────────────────────────────

def _build_test_db_url() -> str:
    override = os.environ.get("TEST_DATABASE_URL")
    if override:
        return override
    # Swap only the database name, keep user/password/host/port from .env.
    base = settings.database_url.rsplit("/", 1)[0]
    return f"{base}/loom_ai_test"


TEST_DB_URL = _build_test_db_url()

# The maintenance engine connects to the 'postgres' DB to create/drop loom_ai_test.
_maintenance_url = TEST_DB_URL.rsplit("/", 1)[0] + "/postgres"

_maintenance_engine = create_engine(
    _maintenance_url,
    isolation_level="AUTOCOMMIT",
    echo=False,
)

_test_engine = create_engine(TEST_DB_URL, echo=False)

_TestSessionFactory = sessionmaker(bind=_test_engine, autocommit=False, autoflush=False)


# ── Session-scoped fixture — creates and destroys the test database ───────────

@pytest.fixture(scope="session", autouse=True)
def create_test_database():
    """Create loom_ai_test, create all tables, yield, then drop everything."""
    with _maintenance_engine.connect() as conn:
        conn.execute(text("DROP DATABASE IF EXISTS loom_ai_test"))
        conn.execute(text("CREATE DATABASE loom_ai_test"))

    Base.metadata.create_all(_test_engine)

    yield

    _test_engine.dispose()
    with _maintenance_engine.connect() as conn:
        conn.execute(text("DROP DATABASE IF EXISTS loom_ai_test"))
    _maintenance_engine.dispose()


# ── Function-scoped fixture — isolated session per test ───────────────────────

@pytest.fixture()
def db_session():
    """
    Provide a test database session that is rolled back after each test.

    Uses nested transactions (SAVEPOINT) to ensure rollback even when the
    code under test calls session.commit().
    """
    connection = _test_engine.connect()
    # Begin the outer transaction that we will roll back at the end.
    trans = connection.begin()

    session = _TestSessionFactory(bind=connection)

    yield session

    session.close()
    trans.rollback()
    connection.close()


# ── Machine fixture factories ─────────────────────────────────────────────────

@pytest.fixture()
def sample_machine(db_session: Session) -> Machine:
    """A basic Weaving machine for use in other tests."""
    m = Machine(
        machine_id="TOY-TEST",
        unit="Unit I",
        department="Weaving",
        machine_type="Toyota",
        granularity="synthetic_loom_number",
        source_type="synthetic",
        active=True,
    )
    db_session.add(m)
    db_session.flush()
    return m


@pytest.fixture()
def sample_spinning_machine(db_session: Session) -> Machine:
    """A Spinning machine (real_grounded) for breakdown and revenue exclusion tests."""
    m = Machine(
        machine_id="RF-TEST",
        unit="Unit I",
        department="Spinning",
        machine_type="RingFrame",
        granularity="real_grounded",
        source_type="synthetic",
        active=True,
    )
    db_session.add(m)
    db_session.flush()
    return m
