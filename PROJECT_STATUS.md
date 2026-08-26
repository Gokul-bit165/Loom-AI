# PROJECT_STATUS.md — Loom AI Inspection Report
**Date:** 2026-08-26
**Phase:** 0 — Environment & Data Inspection (COMPLETE)
**Next Phase:** 1 — Database Setup & ETL (PENDING APPROVAL)

---

## 1. What Was Inspected

| Item | Result |
|---|---|
| Repository contents | 10 files, no existing app code |
| machines.csv | 59 machines, 0 nulls, clean |
| production_log.csv | 15,930 rows, 0 nulls, clean |
| breakdown_events.csv | 2,176 rows, 0 nulls, clean |
| revenue_log.csv | 8,100 rows, 0 nulls, clean |
| generate_synthetic_data.py | Documented, seed=42, provenance preserved |
| PLAN.md | Existing architecture plan — adopted as V1 base |
| WhatsApp Images (4x) | Real company reports — see section 4 |
| Python | 3.13.14 |
| Node.js / npm | 23.11.0 / 10.9.2 |
| PostgreSQL | 18 — INSTALLED AND RUNNING as Windows service |
| FastAPI | 0.111.0 — installed |
| SQLAlchemy | 2.0.43 — installed |
| pandas | 2.3.3 — installed |
| uvicorn | 0.30.1 — installed |
| alembic | 1.16.5 — installed |
| asyncpg | 0.31.0 — installed |
| pytest | 9.0.2 — installed |
| anthropic SDK | NOT INSTALLED |
| psycopg2 | NOT INSTALLED |
| Next.js | NOT SCAFFOLDED |

---

## 2. Repository State

No application code exists. The repository contains only source data and planning documents.

```
c:\Users\gokul\ashok-v1\
├── PLAN.md                               <- Architecture plan (retained, adopted)
├── generate_synthetic_data.py            <- DO NOT regenerate or delete
├── machines.csv                          <- 59 machines, provenance-tagged
├── production_log.csv                    <- 15,930 rows, 90 days, 3 shifts
├── breakdown_events.csv                  <- 2,176 breakdown events
├── revenue_log.csv                       <- 8,100 rows (Weaving only, derived)
├── inspect_data.py                       <- Read-only profiling script (safe to keep)
├── WhatsApp Image 2026-08-16 at 6.26.22 AM.jpeg
├── WhatsApp Image 2026-08-16 at 6.26.23 AM.jpeg
├── WhatsApp Image 2026-08-16 at 6.26.23 AM (1).jpeg
└── WhatsApp Image 2026-08-16 at 6.26.24 AM.jpeg
```

---

## 3. Source Data Summary

### machines.csv — 59 rows, 0 nulls

| Dept | Type | Count | Granularity Note |
|---|---|---|---|
| Spinning | RingFrame | 12 | real_grounded |
| Spinning | Vortex | 12 | real_grounded |
| Spinning | Airjet | 5 | real_grounded |
| Weaving | Toyota | 15 | synthetic_loom_number |
| Weaving | Tsudakoma | 10 | synthetic_loom_number |
| Weaving | Sulzer | 5 | synthetic_loom_number |

PROVENANCE: All 29 Spinning machine numbers correspond to real numbered machines
in the supplied reports. All 30 Weaving machine IDs (TOY-xx, TSU-xx, SUL-xx) are
synthetic — supplied reports only show brand-level weaving totals, not per-loom.

### production_log.csv — 15,930 rows, 0 nulls
- Date range: 2026-06-01 to 2026-08-29 (90 days)
- Shifts: 1, 2, 3
- Efficiency: 59.99% min, 100% max, mean 93.46%
- 4 chronic underperformers seeded (base efficiency 78% vs 95% for healthy machines)
- Breakdown rate: 35% per shift for underperformers, 12% for healthy

### breakdown_events.csv — 2,176 rows, 0 nulls
- Date range: 2026-06-01 to 2026-08-29
- 8 reason codes (source: actual report remarks columns)
- Duration: 5 to 180 minutes (mean 56.9 min)

### revenue_log.csv — 8,100 rows, 0 nulls
- Only Weaving machines (30 machines x 3 shifts x 90 days)
- 3 fabric styles: Excel Slub (Rs215/kg), Liveaco Compact (Rs198/kg), VSF Export (Rs240/kg)
- Revenue is FULLY DERIVED: actual_qty / 1000 * rate_per_kg * uniform(0.9, 1.1)
- No revenue report exists in supplied company documents

---

## 4. Real Company Report Analysis

### Image 1 — Daily Spinning Production Report (14/08/2026)
- Shows Ring Frame (10 yarn varieties), Vortex (12 machines), Airjet (5 machines)
- Per-machine remarks column confirms numbered machine structure
- SPG total target = 7165, VTX total = 14021, Airjet total = 11121
- On-date/upto-date efficiencies: SPG 98.93%/94.28%, VTX 97.83%/96.45%

### Image 2 — Daily Preparatory Production Report (14/08/2026)
- Carding 24hr target, FR Draw Frame, Simplex sections
- Shift I / II / III shown with target and actual per section
- Confirms "target @ X hours" approach to setting daily targets
- Efficiency shown: FR Draw Frame shift I = 82.68%, total = 80.61%

### Image 3 — Yarn Quality Report (14/08/2026)
- Vortex machine groups, Airjet 1-5, Link machines
- Dimensions: Count, Strength, CSP, COUNT_CV, U%, Thin/Thick/Neps (IPI)
- Foundation for Q18-Q20 (Quality questions) in a future phase

### Image 4 — Multi-day Energy + Production Summary (08-14/08/2026)
- Shows SPG, Airjet, Vortex, Weaving production by day (in KGs)
- Power: EB + Roof Solar + Genset totals
- Weaving is shown as a SINGLE daily total — confirms per-loom data in CSVs is synthetic
- Production is measured in KGs, converted production also shown

---

## 5. Blockers

| # | Blocker | Severity | Resolution |
|---|---|---|---|
| B1 | psycopg2-binary not installed | HIGH | pip install psycopg2-binary |
| B2 | anthropic SDK not installed | Medium | pip install anthropic |
| B3 | PostgreSQL postgres user password unknown | HIGH | Provide credentials |
| B4 | Claude API key not configured | Medium | Add ANTHROPIC_API_KEY to .env |
| B5 | Next.js not scaffolded | Low (Phase 5) | npx create-next-app |

---

## 6. Risks

| Risk | Mitigation |
|---|---|
| Weaving per-loom data presented as real | granularity field preserved in DB; UI must show provenance badge |
| Revenue attributed to real measurement | Revenue cards must show "(Derived: actual_qty x fabric_rate)" |
| LLM computing numbers | Architecture enforces: LLM receives only pre-computed dicts, never raw data |
| "Today" ambiguity | Use max(date) from DB, not datetime.now() |
| Chronic underperformers not detected | Write explicit pytest assertions for this |

---

## 7. Assumptions

1. Mill operates a single Unit I for V1 scope.
2. All revenue values are in Indian Rupees (Rs).
3. "Today" = most recent date in database (currently 2026-08-29), not wall clock.
4. Management users have read-only access.
5. Claude API key will be provided before Phase 3.
6. PostgreSQL credentials will be configured before Phase 1.
7. Revenue data is derived, not measured — disclosed in UI.

---

## 8. Phases Remaining

| Phase | Tasks | Gate |
|---|---|---|
| 1 | pip installs, .env, PostgreSQL DB+user, SQLAlchemy models, Alembic, ETL loader, row-count verification | Postgres password needed |
| 2 | Analytics functions (Q1 Q5 Q21), pytest suite | Phase 1 complete |
| 3 | LLM narration layer (Claude), prompt templates | Claude key + Phase 2 |
| 4 | FastAPI routes (3 endpoints + /ask) | Phase 2 complete |
| 5 | Next.js scaffold, Q1/Q5/Q21 pages, dashboard | Phase 4 complete |

**STOP. Awaiting explicit approval before proceeding to Phase 1.**
