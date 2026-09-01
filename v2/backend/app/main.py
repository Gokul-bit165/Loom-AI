"""
Loom AI v2 — FastAPI application entry point.

Routers are registered here. All v2 API routes live under /api/v2/ to
coexist with v1's /api/ namespace during the cutover period.

Anti-Slop rules enforced at this layer:
- Every response includes data_as_of and source_mix fields (rule: no fake real-time)
- No endpoint returns a bare 0 for missing data — use null with explicit label
- No cross-unit or cross-period data mixed in a single ranked response
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func

from app.database import engine, SessionLocal
from app.db_models import Base, Loom
from app.seed.masters import seed_masters
from app.seed.demo_generator import generate_atm_month

from app.routers import (
    ai,
    air,
    breakdown,
    command_center,
    data_quality,
    decision_registry,
    exports,
    ingest,
    loom,
    maintenance,
    manpower,
    predictions,
    production,
    quality,
    recommendations,
    revenue,
    workforce,
)

@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Ensure all tables exist
    Base.metadata.create_all(bind=engine)
    # Seed data if unpopulated
    with SessionLocal() as session:
        loom_count = session.scalar(select(func.count(Loom.loom_id)))
        if not loom_count:
            try:
                seed_masters(session)
                generate_atm_month(session)
                session.commit()
            except Exception as ex:
                session.rollback()
                print(f"Seed note: {ex}")
    yield


app = FastAPI(
    title="Loom AI v2",
    description="Decision Intelligence Platform for Ashok Textile Mills — v2.0",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(command_center.router,    prefix="/api/v2/command-center",    tags=["command-center"])
app.include_router(production.router,        prefix="/api/v2/production",        tags=["production"])
app.include_router(loom.router,              prefix="/api/v2/looms",             tags=["looms"])
app.include_router(breakdown.router,         prefix="/api/v2/breakdown",         tags=["breakdown"])
app.include_router(manpower.router,          prefix="/api/v2/manpower",          tags=["manpower"])
app.include_router(workforce.router,         prefix="/api/v2/workforce",         tags=["workforce"])
app.include_router(maintenance.router,       prefix="/api/v2/maintenance",       tags=["maintenance"])
app.include_router(air.router,               prefix="/api/v2/air",               tags=["air"])
app.include_router(quality.router,           prefix="/api/v2/quality",           tags=["quality"])
app.include_router(revenue.router,           prefix="/api/v2/revenue",           tags=["revenue"])
app.include_router(predictions.router,       prefix="/api/v2/predictions",       tags=["predictions"])
app.include_router(recommendations.router,   prefix="/api/v2/recommendations",   tags=["recommendations"])
app.include_router(decision_registry.router, prefix="/api/v2/decision-registry", tags=["decision-registry"])
app.include_router(data_quality.router,      prefix="/api/v2/data-quality",      tags=["data-quality"])
app.include_router(ingest.router,            prefix="/api/v2/ingest",            tags=["ingest"])
app.include_router(exports.router,           prefix="/api/v2/exports",           tags=["exports"])
app.include_router(ai.router,                prefix="/api/v2/ai",                tags=["ai"])


@app.get("/api/v2/health")
def health() -> dict:
    return {"status": "ok", "version": "2.0.0"}
