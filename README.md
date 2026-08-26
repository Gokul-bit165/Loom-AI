# Loom AI — Textile Manufacturing Management Intelligence System

> **V1 Internal Management Reporting System**
> A trust-first, traceability-first decision-support tool for plant managers.

---

## What This Is

Loom AI answers three management questions using a synthetic dataset shaped by real daily
production reports from a large textile manufacturing company:

- **Q1 — Production vs Target**: Daily efficiency, variance, machine-wise and shift-wise performance
- **Q5 — Breakdown & Downtime**: Highest/lowest downtime machines, reason distribution, monthly trends
- **Q21 — Revenue & Loss**: Today's and month-to-date revenue by machine and fabric style

Every number in the UI is:
1. Derived deterministically from source data (Python/pandas — no LLM computation)
2. Traceable back to its source row
3. Labeled with the period it represents
4. Tagged with a data-provenance badge (synthetic vs real-grounded)

The LLM (Claude) is used only for narrative summaries and plain-language suggestions,
and only receives pre-computed metric dicts — never raw logs.

---

## Data Provenance

This system uses synthetic datasets shaped by real company reports.

### What is real-grounded
- Machine types (Toyota, Tsudakoma, Sulzer looms; RingFrame, Vortex, Airjet spinners)
- Spinning machine count and numbering (RF-01 to RF-12, VTX-01 to VTX-12, AJ-01 to AJ-05)
- Target production magnitudes per machine type
- Breakdown reason text (pulled from actual daily report remarks columns)
- Efficiency distribution patterns

### What is synthetic
- Individual weaving loom numbers (TOY-01 to TOY-15, TSU-01 to TSU-10, SUL-01 to SUL-05)
  — the real reports only show brand-level weaving totals, not per-loom
- Revenue data — no revenue report was supplied; values are derived as:
  `revenue = (actual_qty_kg) * fabric_rate * random_factor(0.9–1.1)`
- Date range (Jun–Aug 2026), individual daily values

Every row in the database carries a `source_type` and `granularity` field so the UI
can surface an honest provenance badge. Weaving per-loom data is never presented as
a real company measurement.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Database | PostgreSQL 18 |
| ORM + Migrations | SQLAlchemy 2 + Alembic |
| Backend API | FastAPI + uvicorn |
| Analytics | pandas (deterministic — LLM never computes numbers) |
| LLM Narration | Claude API (Anthropic) |
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Testing | pytest |

---

## Architecture

```
SOURCE DATA (CSV)
      |
      v
  VALIDATION
      |
      v
  POSTGRESQL DATABASE
      |
      v
  DETERMINISTIC ANALYTICS (pandas)
      |
      v
  COMPUTED METRICS (dicts — unit testable)
      |
      v
  EVIDENCE LAYER (audit trail per number)
      |
      v
  LLM NARRATIVE (Claude — narration + suggestions only)
      |
      v
  MANAGEMENT UI (Next.js)
```

**LLM NEVER touches raw logs. LLM NEVER computes business metrics.**

---

## Planned Directory Structure

```
ashok-v1/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app entry point
│   │   ├── models.py                  # SQLAlchemy ORM models
│   │   ├── database.py                # DB session + engine
│   │   ├── config.py                  # Settings from .env
│   │   ├── etl/
│   │   │   └── load_csv.py            # One-time CSV loader
│   │   ├── analytics/
│   │   │   ├── q1_production.py       # Q1 deterministic functions
│   │   │   ├── q5_breakdown.py        # Q5 deterministic functions
│   │   │   └── q21_revenue.py         # Q21 deterministic functions
│   │   ├── narration/
│   │   │   ├── prompts.py             # Prompt templates (no math)
│   │   │   └── claude_client.py       # Claude API wrapper
│   │   └── routers/
│   │       ├── production.py          # GET /api/production/variance
│   │       ├── breakdown.py           # GET /api/breakdown/ranking
│   │       └── revenue.py             # GET /api/revenue/summary
│   ├── tests/
│   │   ├── test_q1_production.py
│   │   ├── test_q5_breakdown.py
│   │   └── test_q21_revenue.py
│   ├── alembic/                       # Migration files
│   ├── .env                           # DB credentials + API keys (gitignored)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Dashboard (composite)
│   │   │   ├── production/page.tsx    # Q1 detail
│   │   │   ├── breakdown/page.tsx     # Q5 detail
│   │   │   └── revenue/page.tsx       # Q21 detail
│   │   └── components/
│   │       ├── ProvenanceBadge.tsx    # Data provenance label
│   │       └── MetricCard.tsx         # KPI card with source tracing
│   └── package.json
├── data/                              # Source CSVs (do not modify)
│   ├── machines.csv
│   ├── production_log.csv
│   ├── breakdown_events.csv
│   └── revenue_log.csv
├── PROJECT_STATUS.md
├── PLAN.md
├── README.md
└── generate_synthetic_data.py         # DO NOT re-run (data already generated)
```

---

## Setup — Phase 1 (Complete)

### Prerequisites
- PostgreSQL 18 running (Windows service: postgresql-x64-18)
- Python 3.13
- Node.js 23

### Step 1 — Install Python packages

```bash
cd backend
pip install -r requirements.txt
```

### Step 2 — Create .env

```bash
cd backend
copy .env.example .env
# .env is already pre-filled with the loom_ai credentials
```

### Step 3 — Create the PostgreSQL database and user

Run once as the postgres superuser:

```powershell
$env:PGPASSWORD='<your-postgres-superuser-password>'
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -f "backend\create_role.sql"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE loom_ai OWNER loom_ai ENCODING 'UTF8';"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d loom_ai -c "GRANT ALL ON SCHEMA public TO loom_ai; ALTER ROLE loom_ai CREATEDB;"
```

### Step 4 — Run Alembic migrations

```bash
cd backend
python -m alembic upgrade head
```

Expected output:
```
INFO  [alembic.runtime.migration] Running upgrade  -> 0001, Initial schema - Loom AI V1
```

### Step 5 — Ingest Data & Generate Data Quality Report

Run the extensible ingestion pipeline:

```bash
cd backend
python -m app.ingestion.run
```

This runs:
1. `CSVParser` to extract raw string rows without default coercion.
2. `ValidationLayer` applying domain rules:
   - Date format & presence
   - Shift in {1, 2, 3}
   - Machine ID registration & foreign key validation
   - Non-negative target / actual / revenue checks
   - Efficiency range checks [0, 100]
   - Batch & database duplicate detection
   - Required fabric styles for weaving revenue
3. `Repositories` for transactional database persistence.
4. `ImportBatch` provenance recording (`is_demo=True`, timestamp, source file).
5. Comprehensive `DataQualityReport` output detailing:
   - Records received, accepted, rejected
   - Counts of duplicates, missing values, invalid values, unknown machines
   - Specific row-level rejection details

### Step 6 — Run Full Test Suite

```bash
cd backend
python -m pytest tests/ -v
```

Expected: **59 passed** (35 DB constraint tests, 4 parser tests, 18 validator tests, 2 pipeline integration tests).

---

## API Endpoints (Planned)

```
GET  /api/production/variance?date=2026-08-29
GET  /api/breakdown/ranking?period=today|month
GET  /api/revenue/summary?date=2026-08-29
POST /api/ask   { "question": "how did we do today" }
```

---

## Data Coverage

| Table | Rows | Date Range | Machines |
|---|---|---|---|
| machines | 59 | — | 30 weaving + 29 spinning |
| production_log | 15,930 | 2026-06-01 to 2026-08-29 | 59 |
| breakdown_events | 2,176 | 2026-06-01 to 2026-08-29 | 59 |
| revenue_log | 8,100 | 2026-06-01 to 2026-08-29 | 30 (weaving only) |

---

## Synthetic Data Limitations

1. Weaving per-loom performance data is synthetic — the real mill may have different
   loom counts and different efficiency distributions per brand.
2. Revenue figures are derived, not measured. No revenue or sales report was provided.
3. Fabric style assignment per shift is random — in reality, each machine likely runs
   a specific style for extended periods.
4. 4 chronic underperformer machines were deliberately seeded for analytics validation.
   These are not real underperforming machines.
5. Breakdown reason text matches the real report vocabulary but individual events are random.

---

## Status

**Phase 0 — COMPLETE.** See PROJECT_STATUS.md for full inspection results.
**Phase 1 — PENDING APPROVAL.** Two blockers must be resolved first:
  - PostgreSQL credentials (postgres user password or loom_ai user)
  - Claude API key for .env

---

## License

Internal use only. Not for external distribution.
