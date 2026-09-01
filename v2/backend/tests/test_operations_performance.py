"""
Performance test for Operations endpoint (/api/v2/looms/).
Asserts:
1. Wall time < 2.0 seconds for 192 looms.
2. Query count is O(1) -- does not issue N correlated queries per loom.
"""
from __future__ import annotations

import time
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import event

from app.main import app
from app.routers.deps import get_session


def test_operations_endpoint_performance(client, db_engine):
    query_count = 0

    def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        nonlocal query_count
        query_count += 1

    event.listen(db_engine, "before_cursor_execute", before_cursor_execute)

    try:
        start_time = time.perf_counter()
        resp = client.get("/api/v2/looms/?unit=ATM&date=2026-07-31&page=1&page_size=200")
        elapsed = time.perf_counter() - start_time
    finally:
        event.remove(db_engine, "before_cursor_execute", before_cursor_execute)

    assert resp.status_code == 200
    data = resp.json()
    assert len(data["looms"]) >= 100

    # 1. Wall time assert < 2.0s (DoD)
    assert elapsed < 2.0, f"Operations endpoint took {elapsed:.3f}s (budget: <2.0s)"

    # 2. Query count assert: O(1) query count (unit lookup + single cohort batch + operations rows)
    assert query_count < 10, f"Issued {query_count} queries for 192 looms (N+1 query regression)"
