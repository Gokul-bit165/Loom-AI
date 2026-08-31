# Loom AI — Redevelopment Plan

Status: living document. Written after a full repository audit on 2026-08-31.
Owner of the next set of edits: this plan is the checklist for finishing the
enterprise schema migration that was left half-done, then extending the
platform per the mission brief (Production + Breakdown + Revenue MVP, with
architecture for Maintenance/Energy/Quality/Manpower/ML/AI recommendations).

## 1. Current state (ground truth, not aspirational)

The repo is **not** a college-project mockup. It is a working V1 system:

- FastAPI backend with a real deterministic analytics layer
  (`backend/app/analytics/{production,breakdown,revenue}.py`), pandas-based,
  with genuine formulas: variance, achievement/efficiency %, downtime
  minutes, average breakdown duration, revenue, day-over-day change.
- A grounded LLM assistant (`backend/app/assistant/`) that computes numbers
  deterministically first and only asks Claude to narrate them — it cannot
  invent production/revenue/breakdown numbers (enforced by
  `test_numeric_integrity_llm_cannot_modify_analytics_data`).
- Real Postgres schema with FK/check constraints enforced at the DB level,
  a working Alembic migration chain (`0001`, `0002`), and a genuine pytest
  suite (`backend/tests/`) that seeds real scenarios and asserts exact
  numeric outputs — not import-only smoke tests.
- A Next.js frontend with 5 real page implementations (`/`, `/production`,
  `/breakdown`, `/revenue`, `/ask`) wired to the 4 real backend endpoints,
  plus 4 alias routes (`/commercial`, `/decisions`, `/dispatch`,
  `/stoppages`) that re-export another page under a different nav label.

### Problem found: an unfinished, uncommitted schema migration

A prior session started rearchitecting the DB toward the normalized model
this brief asks for — new master tables `shift_master`, `fabric_master`,
`customer_master`, `order_master`, and new domain tables `quality_records`,
`loom_energy`, `maintenance_records`, `machine_sensor_data` — but **only
touched three files**: `backend/app/db_models.py`, the new migration
`backend/alembic/versions/0003_enterprise_relational_schema.py`, and two
docs (`ARCHITECTURE.md`, `DATA_DICTIONARY.md`). Nothing else in the stack
(Pydantic schemas, repositories, analytics, services, routers, ingestion,
validation, tests, or any part of the frontend) was updated to use the new
tables/columns. Two docs (`ARCHITECTURE.md`, `DATA_DICTIONARY.md`) now
describe a system that doesn't run yet.

Additional concrete defects found during audit (see git history for the
fixes):

- `db_models.py` declared check constraint `ck_production_target_nonneg`
  (`target_qty >= 0`) but migration `0001` had created
  `ck_production_target_positive` (`target_qty > 0`) and `0003` never
  renamed it — `alembic upgrade head` would leave the DB constraint
  out of sync with the ORM/tests. **Fixed**: `0003` now drops the old
  constraint and creates the new one (upgrade and downgrade both handled).
- `shift_master` was created but nothing has a FK to it — `production_logs`,
  `breakdown_events`, `loom_energy` all still store a raw `SmallInteger`
  shift number. Left as-is for now (tracked in §5) since retrofitting a FK
  onto 15,930 existing production rows needs a data-backfill step, not just
  a schema change.
- `frontend/components/executive/ProductionTrendChart.tsx` renders a fully
  hardcoded 14-day mock series (dates "16 Aug"–"29 Aug", fixed numbers) and
  hardcoded footer badges (`93.5%`, `+0.20%`, `-6.49%`) regardless of the
  selected date or real API response.
- `frontend/app/production/page.tsx` renders a literal hardcoded string
  `(-6.50%)` appended next to the real computed variance value — a fake
  number shown next to a real one.
- Two parallel, duplicate CSV import implementations exist
  (`backend/app/ingestion/` and `backend/app/data/import_csv.py`) with
  independently-written validation/repository logic that should converge
  on one.
- `PROJECT_STATUS.md` claims "no application code exists" — stale by
  months; not to be trusted as current state.
- `KNOWN_LIMITATIONS.md` explicitly scopes quality/energy/maintenance data
  as out of V1 — now contradicted by the schema already containing those
  tables. Needs updating once those tables are wired up.
- ~60% of `frontend/components/**` (28 of 47 files, entire `command/` and
  `investigation/` folders except `MachineDossier.tsx`) are dead code not
  reachable from any route.

## 2. Target architecture (per mission brief)

Relational core, unchanged in spirit from what's already in `db_models.py`
post-fix — the ORM/migration work already done is architecturally correct
and does **not** need to be redone, only *finished* (wired through every
layer) and *extended* (real repositories/analytics for the new tables).

```
loom_master (machines)
    +-- loom_production (production_logs, extended)
    +-- breakdown_event (breakdown_events, extended)
    +-- loom_energy
    +-- maintenance_record
    +-- machine_sensor_data

loom_production
    +-- fabric_master
    +-- order_master
    +-- quality_record
    +-- shift_master (not yet FK'd — see §5)

order_master
    +-- customer_master
```

Raw vs. derived vs. ML fields, and `data_source` provenance enum
(MACHINE | PLC | IoT | ERP | OPERATOR | MANUAL | CALCULATED | ESTIMATED |
ML), are already present as columns on the new tables. Every service that
returns a derived number (variance, achievement %, revenue loss estimate)
must keep tagging it as such — this is already how `revenue.py` handles
`revenue_loss_available: False` and must be the pattern for every new
"estimated" figure (e.g. `estimated_production_loss_kg` from breakdown
downtime × expected rate).

## 3. What is reused as-is

- `backend/app/analytics/common.py` (performance classification, safe
  math helpers) — schema-agnostic, reused unchanged.
- The assistant's grounding design (`engine.py`, `intent.py`, `prompts.py`,
  `client.py`) — architecture is correct, only needs new intents/tool
  payloads as new question types (breakdown detail, revenue-by-fabric,
  maintenance) come online. Do not rewrite the grounding contract.
- The response-envelope pattern in `services/*.py`
  (`{data, metadata, data_quality}`) — keep for all new services.
- Provenance model (`ImportBatch`, `source_type`, `is_demo`) — reused,
  extended with `data_source` per-row granularity (already added to new
  tables).
- Test structure/conventions in `backend/tests/` (real Postgres, seeded
  scenarios, exact numeric assertions) — this is the bar for all new
  tests, not a lighter-weight one.
- Frontend page shell, `HeaderNav`, `MachineDossier`, `EvidenceDrawer`,
  `states/*` — genuinely used, keep.

## 4. What must be redesigned / finished

1. **Pydantic schemas** (`backend/app/models/production.py`,
   `breakdown.py`, `revenue.py`, `machine.py`) — extend to carry the new
   columns (fabric_style_id, order_id, kg/meter targets, running_hours,
   machine_speed_rpm, kilo_pick, warp/weft break counts, breakdown
   start/end time, category, root cause, production_loss_kg). Add new
   schemas for `FabricStyle`, `Order`, `Customer`, `Shift`.
2. **Repositories** — extend `production_repo.py`/`breakdown_repo.py` to
   read/write the new columns; add `fabric_repo.py`, `order_repo.py`,
   `customer_repo.py` for the new master tables (needed so revenue.py can
   stop hardcoding `revenue_loss_available: False` and instead compute it
   from `order_master.selling_rate_per_kg` vs actual production).
3. **Analytics** — extend `production.py` to surface kilo-pick, warp/weft
   breaks, downtime, production loss in the Q1 payload (per brief); extend
   `breakdown.py` for Pareto-by-reason, shift comparison, monthly
   breakdown-count ranking (distinct from downtime ranking — brief
   explicitly says don't collapse these); extend `revenue.py` to compute
   real revenue loss once order rates are available, clearly labeled
   ESTIMATED where it's downtime × expected rate rather than a measured
   shortfall.
4. **Recommendation engine** — new module,
   `backend/app/analytics/recommendations.py`, rule-based (per brief: no
   ML for this), evidence-based objects
   `{priority, issue, evidence, suggested_action, expected_impact,
   confidence, source_metrics}`. Consumed by dashboard + assistant.
5. **Frontend** — delete dead components (§1); fix
   `ProductionTrendChart` to plot real trend data from a new
   `/api/production/trend` endpoint instead of a mock array; remove the
   hardcoded `-6.50%` string; resolve the alias-route confusion (either
   give `/commercial`, `/decisions`, `/dispatch`, `/stoppages` real
   distinct content per the requested nav — Maintenance, Energy,
   Manpower, Quality — or remove them until those pages exist, to avoid a
   nav that lies about what's behind each link).
6. **Ingestion** — collapse the two duplicate import pipelines into one;
   add an HTTP upload endpoint (`POST /api/imports`) with the
   upload → schema-detect → column-map → validate → preview → import →
   history flow the brief asks for. CLI pipeline logic can be reused as
   the engine underneath the endpoint.

## 5. Explicitly deferred (architecture only, not implemented this phase)

Per brief's own phasing (Phase 3+), and because implementing all 23
business questions in one pass would produce a huge, unreviewable diff:

- `shift_master` FK backfill onto existing fact tables.
- Maintenance scheduling (due/overdue/preventive), compressed-air cost
  trend, quality defect Pareto UI, manpower/attendance — tables exist
  (`quality_records`, `loom_energy`, `maintenance_records`), repositories
  and dashboard pages do not yet.
- ML services (breakdown prediction, production/efficiency/revenue
  forecasting) — needs real historical volume first; current CSVs
  (~15,930 production rows, 59 machines) may be enough for a baseline
  classifier/regressor but this is a separate workstream with its own
  train/val/test methodology, not bundled into the MVP schema work.
- Real PLC/IoT connector — `machine_sensor_data` table exists for this,
  no connector implemented (by design — brief forbids claiming
  connectivity that isn't real).

## 6. Migration risk notes

- `0003` is additive-only for the DB (no destructive column drops except
  the constraint rename, which is backward-compatible: old constraint was
  *stricter*, new one is a superset). Safe to run against the existing
  15,930-row `production_logs` table — all new columns are nullable or
  have server defaults.
- Existing rows will have `NULL` for `fabric_style_id`, `order_id`,
  kg/meter fields, `machine_speed_rpm`, `kilo_pick` — any new analytics
  code must handle NULL gracefully (e.g. "kilo-pick unavailable for
  legacy import" rather than crashing or silently coercing to 0).
- Tests currently bootstrap schema via `Base.metadata.create_all()`
  (`conftest.py`), not via Alembic — this means schema/migration drift
  (like the constraint bug just fixed) won't be caught by CI as-is. Once
  the migration is exercised in a real deploy, add one test that runs
  `alembic upgrade head` against a scratch DB and diffs against
  `Base.metadata` to catch this class of bug automatically.

## 7. Execution order for this phase

1. Fix migration/schema consistency bug (done).
2. Extend Pydantic schemas + repositories for `production_logs`/
   `breakdown_events` new columns, and add repositories for
   `fabric_master`/`order_master`/`customer_master`.
3. Extend `analytics/production.py` and `analytics/breakdown.py` to
   surface the new fields the Q1/Q5 pages need (kilo-pick, warp/weft
   breaks, downtime, production loss, breakdown-count ranking distinct
   from downtime ranking, reason Pareto).
4. Build the rule-based recommendation engine and wire it into the Q1/Q5
   service responses.
5. Update `revenue.py` to compute real revenue loss from order rates
   where available, otherwise keep the explicit "unavailable" label.
6. Fix the two frontend defects (mock chart, fake badge); remove dead
   components; resolve alias-route nav confusion.
7. Update `KNOWN_LIMITATIONS.md`/`PROJECT_STATUS.md` to reflect actual
   current state.
8. Extend `backend/tests/` for every new code path touched above.
