"""
Loom AI — FastAPI Application Entry Point.

Architecture:
HTTP -> Router -> Service -> Analytics -> Repository -> PostgreSQL
"""
from __future__ import annotations

import logging
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import (
    ask_router,
    breakdown_router,
    health_router,
    import_router,
    production_router,
    revenue_router,
)

logger = logging.getLogger("loom_ai")

# ── App Definition ────────────────────────────────────────────────────────────

app = FastAPI(
    title="Loom AI — Textile Management Intelligence System",
    version="1.0.0",
    description=(
        "Production V1 management reporting system for large textile operations. "
        "Delivers deterministic decision-support analytics for Production (Q1), "
        "Breakdown/Downtime (Q5), and Revenue/Loss (Q21)."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ── CORS Configuration ────────────────────────────────────────────────────────

# Configure origins for local Next.js frontend
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
]

# In development mode, allow localhost origins; never use wildcard in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ── Structured Error Handlers ─────────────────────────────────────────────────

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail
    if isinstance(detail, dict):
        code = detail.get("code", "HTTP_ERROR")
        message = detail.get("message", str(detail))
        details = detail.get("details", {})
    else:
        code = f"HTTP_{exc.status_code}"
        message = str(detail)
        details = {}

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "details": details,
            }
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        errors.append({"field": loc, "message": err.get("msg", "Invalid value"), "type": err.get("type", "")})

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "REQUEST_VALIDATION_ERROR",
                "message": "Invalid request parameter or payload structure.",
                "details": {"validation_errors": errors},
            }
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception(f"Unhandled server error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An internal server error occurred while processing the request.",
                "details": {},
            }
        },
    )


# ── Include Routers ───────────────────────────────────────────────────────────

app.include_router(health_router)
app.include_router(production_router)
app.include_router(breakdown_router)
app.include_router(revenue_router)
app.include_router(ask_router)
app.include_router(import_router)
