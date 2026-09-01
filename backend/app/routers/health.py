"""
Health Check endpoints for monitoring and container orchestration.
"""
from __future__ import annotations

from typing import Any
from fastapi import APIRouter
from app.database import check_connection

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health Check")
@router.get("/api/health", summary="API Health Check")
def health_check() -> dict[str, Any]:
    db_ok = check_connection()
    return {
        "status": "healthy" if db_ok else "degraded",
        "database": "connected" if db_ok else "disconnected",
    }
