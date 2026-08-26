# Loom AI — Textile Manufacturing Management Intelligence System (V1)

> **Core Objective: TRUST**  
> An internal decision-support and reporting system for plant managers, technical directors, and production superintendents in large-scale textile manufacturing.  
> **Key Axiom**: Every business number must be 100% traceable to source factory logs. The LLM is strictly an explanation and recommendation synthesis layer that NEVER computes or invents metrics.

---

## 1. System Architecture

```
[CSV / Daily Factory Reports]
             ↓
[app/ingestion/]  (BaseParser, CSVParser, IngestionPipeline)
             ↓
[app/models/]     (Pydantic validated immutable domain records)
             ↓
[app/validation/] (ProductionValidator, BreakdownValidator, RevenueValidator, MachineValidator)
             ↓
[app/repositories/] (PostgreSQL transactions + DB check constraints)
             ↓
[PostgreSQL Database] (machines, production_logs, breakdown_events, revenue_logs, import_batches)
             ↓
[app/analytics/]  (Deterministic Python/pandas engine for Q1, Q5, Q21)
             ↓
[app/services/]   (ProductionService, BreakdownService, RevenueService, AskService)
             ↓
[app/routers/]    (FastAPI endpoints with structured error envelopes)
             ↓
┌───────────────────────────────────────┴───────────────────────────────────────┐
│                                                                               │
▼                                                                               ▼
[Next.js Management Frontend]                                       [app/assistant/] (AI Explanation)
  ├── /             (Control Center & Attention Section)              ├── Intent classification (Q1, Q5, Q21)
  ├── /production   (Production vs Target — Q1)                       ├── Claude LLM (Zero temperature)
  ├── /breakdown    (Breakdown & Downtime Pareto — Q5)                └── Conservative recommendations
  ├── /revenue      (Revenue & Style Analysis — Q21)
  └── /ask          (AI Assistant Q&A + Evidence Drawer)
```

---

## 2. Prerequisites & Environment Setup

* **Python**: 3.11+ (Tested on Python 3.13)
* **Node.js**: v18+ (Tested on Node v23.11.0 / npm 10.9.2)
* **PostgreSQL**: 15+ (Tested on PostgreSQL 18 Local Instance)

### Environment Variables (`backend/.env`)

```ini
# PostgreSQL Connection
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=loom_ai
POSTGRES_USER=loom_ai
POSTGRES_PASSWORD=loom_ai_pass_2026

# Optional: explicit override
DATABASE_URL=postgresql://loom_ai:loom_ai_pass_2026@localhost:5432/loom_ai

# Anthropic Claude API Key (Phase 3 AI Assistant)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Application Settings
APP_ENV=development
DATA_DIR=../
```

---

## 3. Step-by-Step Installation & Operations

### Step 1 — Install Backend Python Dependencies
```bash
cd backend
python -m pip install -r requirements.txt
```

### Step 2 — Initialize Database & Apply Migrations
```bash
cd backend
python -m alembic upgrade head
```
*Applies `0001_initial_schema` and `0002_add_import_batches`.*

### Step 3 — Ingest Data & Generate Data Quality Report
```bash
cd backend
python -m app.ingestion.run
```
*Runs `CSVParser`, enforces validation constraints, records dataset provenance (`is_demo=True`), and outputs the complete Data Quality Report.*

### Step 4 — Run Backend Test Suite (91 Tests)
```bash
cd backend
python -m pytest tests/ -v
```
*Expected: **91 passed** (Database constraints, parsers, validators, pipeline, deterministic analytics, API endpoints, and AI assistant).*

### Step 5 — Start the FastAPI Backend Server
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API Base URL: `http://localhost:8000`
- Swagger OpenAPI Docs: `http://localhost:8000/docs`
- ReDoc Docs: `http://localhost:8000/redoc`

### Step 6 — Start the Next.js Management Frontend
```bash
cd frontend
npm install
npm run dev
```
- Web Application: **`http://localhost:3000`**

---

## 4. Key Documentation Index

* [`ARCHITECTURE.md`](file:///c:/Users/gokul/ashok-v1/ARCHITECTURE.md): System architecture, grain definitions, and future table roadmap (Q2–Q23).
* [`DATA_DICTIONARY.md`](file:///c:/Users/gokul/ashok-v1/DATA_DICTIONARY.md): Complete database schema, column types, check constraints, and operational units.
* [`ANALYTICS.md`](file:///c:/Users/gokul/ashok-v1/ANALYTICS.md): Mathematical formulas, deterministic performance classification thresholds, and period resolution rules.
* [`API.md`](file:///c:/Users/gokul/ashok-v1/API.md): OpenAPI endpoints, query parameters, success envelopes, and structured error responses.
* [`KNOWN_LIMITATIONS.md`](file:///c:/Users/gokul/ashok-v1/KNOWN_LIMITATIONS.md): Transparent documentation of V1 scope boundaries and the revenue loss policy.
* [`DEMO_GUIDE.md`](file:///c:/Users/gokul/ashok-v1/DEMO_GUIDE.md): 10-second health check walkthrough and 5 management audit demonstration scenarios.

---

## 5. Synthetic Data Safety & Anomaly Detection

1. **Synthetic Data Banner**: The UI displays an amber `DEMO / SYNTHETIC DATA` banner across all pages with record count audit metadata to ensure plant managers never confuse test data with live plant measurements.
2. **Grounded Anomaly Discovery**: The deterministic analytics algorithms organically detect the seeded underperforming machines (**`TOY-08`**, **`RF-11`**, **`TOY-02`**, **`VTX-06`**) directly from output and downtime logs without hardcoded identifiers.
