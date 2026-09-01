"""
Loom AI v2 — pytest fixtures.

Spins up schema on the dedicated `loom_ai_v2_test` database (separate
from v1's `loom_ai_test` and from v2's dev DB `loom_ai_v2`) via
Base.metadata.create_all — same pattern v1's tests/conftest.py used.
Each test module that needs a populated DB (masters + demo data) seeds
it once per session and reuses it, since generating a full month is not
cheap; tests that mutate state should do so via savepoint rollback.
"""
from __future__ import annotations

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings
from app.db_models import Base
from app.seed.masters import seed_masters


@pytest.fixture(scope="session")
def db_engine():
    db_url = settings.test_database_url()
    connect_args = {"check_same_thread": False, "timeout": 30} if db_url.startswith("sqlite") else {}
    engine = create_engine(db_url, connect_args=connect_args, future=True)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    yield engine
    engine.dispose()


@pytest.fixture(scope="session")
def db_session_factory(db_engine):
    return sessionmaker(bind=db_engine, future=True)


@pytest.fixture()
def db_session(db_engine, db_session_factory) -> Session:
    connection = db_engine.connect()
    transaction = connection.begin()
    session = db_session_factory(bind=connection)
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture(scope="session")
def masters_session_factory(db_engine):
    """A session whose master-data seed persists for the whole test
    session (not rolled back) -- the demo generator and reconciliation
    tests need real, committed master rows to build against."""
    factory = sessionmaker(bind=db_engine, future=True)
    session = factory()
    seed_masters(session)
    session.commit()
    yield factory
    session.close()


@pytest.fixture(scope="session")
def generated_atm_month(masters_session_factory):
    """Generates the full ATM demo month once for the entire test session."""
    from app.config import DEMO_SEED
    from app.seed.demo_generator import generate_atm_month
    session = masters_session_factory()
    totals = generate_atm_month(session, seed=DEMO_SEED)
    session.commit()
    yield session, totals
    session.close()


@pytest.fixture()
def client(db_session_factory, generated_atm_month):
    from fastapi.testclient import TestClient
    from app.main import app
    from app.routers.deps import get_session

    def override_get_session():
        session = db_session_factory()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


