# Loom AI v2 — Pre-Build Design (§12 deliverables)

**Status: reviewed and corrected.** This revision incorporates the design
review response (six blocking corrections, three additions, four open
items resolved). Original open items are marked `RESOLVED` in place rather
than deleted, so the reasoning stays visible.

Per §12 of the v2 brief: no application code until this document is
reviewed. v1 is **not deleted** — it is tagged `v1-final` and preserved on
branch `archive/v1` (pushed to origin), staying deployable as a fallback.
See `docs/V1_POSTMORTEM.md` for the seven failure modes (F1-F7) this
rebuild exists to fix. v2 is built fresh; nothing is extended from v1's
domain model.

---

## 1. Challenges, ambiguities, things I think are wrong or need a decision

1. **`RESOLVED` — Loom count for ATM only; vendor units carry no looms at
   all.** ATM is seeded at 168 airjet + 24 Sulzer, `register_confirmed:
   false`, banner shown. Vendor units (CVF/SKT/VPN/METRO/TPN) are **not**
   given fabricated loom registers — deriving ~800 imaginary looms across
   five businesses we have zero floor data on was rejected on review.
   Vendor units exist only as **unit-aggregate rows** populated from the
   real July-2026 MRM figures, `source='CSV_IMPORT'`, tagged with the
   period `2026-07`. This also makes the F5 cross-source-ranking failure
   structurally impossible: there is no vendor loom-level data to
   accidentally rank against ATM's live per-loom data. The absence becomes
   a concrete, sellable ask for the next mill visit: get one vendor's loom
   register + daily sheet and the same screens light up for them.
2. **`RESOLVED` — Revenue rate is a flat, visible placeholder, not a
   back-calculated "plausible" number.** Every style gets
   `revenue_per_metre = DEFAULT_REVENUE_PER_METRE` (a single configurable
   seed constant, not fit to reproduce any particular aggregate ₹
   figure — there is no real ATM revenue baseline anywhere in this brief
   to fit against, only kilo-picks/metres/crimp), `revenue_rate_source =
   'ESTIMATED'` on every row. The UI renders a visible `EST` chip on every
   ₹ figure; tapping it shows *"₹X/metre — placeholder rate, not supplied
   by mill. Real rate card required for accurate figures."* The Revenue
   page also ships a **"Confirm your rate card"** panel: the 10 styles
   with an empty real-rate column and an export button, so the ten minutes
   of the owner's time that would make the whole ₹ layer real has an
   obvious place to happen. (Note for later: the Sizing MRM in the source
   files gives a real ₹20.40/kg billing / ₹9.80/kg profit figure — that's
   sizing, not weaving, so it is *not* used to derive a weaving rate, but
   it's evidence the mill has this kind of data and can supply the weaving
   equivalent.)
3. **Crimp is per-style-per-month in §3's table** (aggregate, not
   per-shift). Q18-Q20 (quality/crimp) are marked `BLOCKED` pending a lab
   feed. So `production_log.actual_crimp_pct` will stay NULL in the demo
   generator (not fabricated per-shift) — only `style.std_crimp_pct` and
   the known per-unit monthly aggregate (stored on a
   `style_unit_crimp_monthly` reference table, tagged `REAL — Jul-2026
   Vendor MRM`) are populated. Flagging this now since it means the Quality
   page has real reference numbers but no live per-loom crimp — confirm
   that's the intended v2 scope (matches §4's `BLOCKED` classification).
4. **Reason-code free-text parsing** (`"CARD : 8 T-CON FAULT PBM - 40
   MIN."`) — I'm treating this as a **deterministic rule/regex parser**
   (extract loom no, reason keywords → reason_code, minutes) with a
   mandatory human review step before commit, not an ML/LLM classifier.
   This keeps it inside the "LLM never produces a number" rule. If the
   mill's remark formats are more varied than the one example, the parser
   will have a "no confident match — route to manual review" fallback
   rather than guessing.
5. **TimescaleDB** adds real ops complexity (extension install, hypertable
   migration semantics differ from plain Alembic `create_table`). I'm
   including it as asked, but flagging that for a first deploy on a
   single-mill on-prem/cloud box, a plain indexed Postgres table with the
   indexes in §2 would perform fine at this data volume (tens of thousands
   of rows/month) — Timescale earns its complexity at much higher
   ingestion rates (e.g. `machine_sensor_data`-style telemetry, which isn't
   in v2's scope yet). Keeping it per your instruction, just naming the
   trade-off.
6. **Cohort definition** ("same style AND same loom_type AND same period")
   needs an explicit window — I'm defining "period" as a **rolling 30-day
   window ending on the query date**, falling back to "all available
   history" if fewer than 5 looms qualify (and labeling the fallback
   explicitly, e.g. `cohort_window: "ALL_HISTORY — insufficient recent
   data"`) so a cohort of 1-2 looms never masquerades as a real median.
7. **Shift-3-crosses-midnight**: I'm storing `work_date` = the calendar
   date the shift *started* (per your rule), plus the actual `raised_at`/
   timestamp columns in real UTC-backed `timestamptz`, so lifecycle math
   (MTTR etc.) is never ambiguous even though the reporting date is shift-
   anchored. Confirmed to only need Asia/Kolkata everywhere per config —
   no unit runs a different timezone, right? (Vendor units are all Tamil
   Nadu-based per the brief, so I'm assuming yes.)
8. **Q14 and Q18 ML models are explicitly out of scope for v2** (§9 rule 6)
   — I'm building the *data collection* (`stop_event` with full lifecycle,
   `production_log`) that would make them trainable later, and a "months
   of labeled history collected: X / 6 needed" countdown widget, but no
   model. Confirming this matches your read of §9 rule 6 exactly.
9. **Employee↔loom `assignment`** is a hard requirement (F7) but no
   attendance/biometric feed exists yet — Q8-Q13 are `PARTIAL`. The demo
   generator will still populate `assignment` (shift×loom×date→employee)
   from the seeded 137 employees against the seeded looms respecting
   `std_looms` per grade, so Operations/Loom Detail/Weaver pages have real
   structure to show even though the *live* HR feed doesn't exist — this
   assignment data is tagged `source='DEMO'` same as everything else.
10. **`RESOLVED` — `vendor_coordinator` sees zero ₹ data anywhere,
    including their own unit.** No partial rule, no "own unit only"
    exception — that creates a join away from a leak. Enforced by omitting
    ₹ fields from the serializer for that role (API layer, per the
    brief), with a dedicated API test asserting the response body contains
    no ₹-valued keys for a `vendor_coordinator` token.

Also newly added on review:

11. **`efficiency_pct` as originally specified in §6 of the brief
    (`actual_picks / (std_rpm × running_min) × 100`) was wrong** and is
    **not implemented**. That formula measures speed-while-running, which
    lands near 97-98% and hides all stoppage — it cannot reconcile to the
    real baseline table (ATM 89.6%, etc.), because the real figure is
    measured against *scheduled* time, not running time. See §4.1 for the
    corrected three-function split (`loom_efficiency_pct` /
    `performance_eff_pct` / `utilization_pct`).
12. **TimescaleDB is dropped.** A hypertable requires every UNIQUE/PK
    constraint to include the partition column — `production_log_id SERIAL
    PRIMARY KEY` on a table partitioned by `work_date` fails at migration
    as originally designed. It's also unnecessary at this volume (~192
    looms × 3 shifts × 31 days ≈ 18k rows/month) — plain indexed Postgres
    handles years of this. Revisit Timescale if/when controller telemetry
    (sub-minute sensor data) enters scope.
13. **`production_target` and `fabric_roll` were missing entities.**
    Targets are real entered data (the mill's own sheet shows `TARGET @
    22.5 HRS` / `@ 22 HRS` / `@ 21 HRS` — targets derive from
    *available hours per department*, not a generic capacity constant),
    and rolls are the real despatch unit (7,760/month across units,
    weight-banded). Both added in §2.

None of the above block starting P0 — flagging them (and their
resolutions) per §12 rule 1 so a wrong assumption doesn't get built into
40 files before it's caught.

---

## 2. Final DDL

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- Plain PostgreSQL 16. No TimescaleDB (see design note §1.12 — dropped on
-- review: incompatible with SERIAL PK + partition-column constraint rules
-- as originally scoped, and unnecessary at this data volume).
-- ═══════════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════════
CREATE TYPE data_source AS ENUM ('DEMO','CSV_IMPORT','MANUAL_ENTRY','CONTROLLER_FEED');
CREATE TYPE rate_source AS ENUM ('CONFIRMED','ESTIMATED');
CREATE TYPE loom_make AS ENUM ('TSUDAKOMA','SULZER');
CREATE TYPE employee_role AS ENUM (
  'WEAVER','TRAINING_WEAVER','FABRIC_CHECKER','LOADMAN','SHIFT_FITTER',
  'HEAD_FITTER','KNOTTER','GAITER','ELECTRICIAN','OILER','QUALITY_CHECKER','SWEEPER'
);
CREATE TYPE employee_grade AS ENUM ('G1','G1_PLUS','G2','G2_PLUS','G3','G3_PLUS','G4','G5','G6','G6_PLUS');
CREATE TYPE stop_status AS ENUM ('RAISED','ACKNOWLEDGED','ATTENDING','RESOLVED');
CREATE TYPE reason_category AS ENUM ('MECHANICAL','ELECTRICAL','MATERIAL','MANPOWER','PLANNED','UTILITY','QUALITY','OTHER');
CREATE TYPE user_role AS ENUM ('owner','pm','supervisor','vendor_coordinator');
CREATE TYPE suggestion_status AS ENUM ('OPEN','ACKED','DISMISSED','DONE');
CREATE TYPE confidence_level AS ENUM ('HIGH','MEDIUM','LOW');
CREATE TYPE question_availability AS ENUM ('READY','PARTIAL','BLOCKED');

-- ═══════════════════════════════════════════════════════════════════════
-- 1. MASTERS
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE unit (
  unit_id       SERIAL PRIMARY KEY,
  code          VARCHAR(20)  NOT NULL UNIQUE,   -- ATM | CVF | SKT | VPN | METRO | TPN
  name          VARCHAR(150) NOT NULL,
  is_own_unit   BOOLEAN      NOT NULL DEFAULT FALSE,
  timezone      VARCHAR(50)  NOT NULL DEFAULT 'Asia/Kolkata',
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE shed (
  shed_id     SERIAL PRIMARY KEY,
  unit_id     INT NOT NULL REFERENCES unit(unit_id) ON DELETE RESTRICT,
  code        VARCHAR(20) NOT NULL,
  name        VARCHAR(100) NOT NULL,
  UNIQUE (unit_id, code)
);

CREATE TABLE loom_type (
  loom_type_code VARCHAR(10) PRIMARY KEY,     -- '810','910','340','280','TS','SZ'
  make           loom_make NOT NULL,
  description    VARCHAR(150)
);

CREATE TABLE loom (
  loom_id          SERIAL PRIMARY KEY,
  unit_id          INT NOT NULL REFERENCES unit(unit_id) ON DELETE RESTRICT,
  shed_id          INT REFERENCES shed(shed_id) ON DELETE SET NULL,
  loom_no          VARCHAR(30) NOT NULL,
  loom_type_code   VARCHAR(10) NOT NULL REFERENCES loom_type(loom_type_code) ON DELETE RESTRICT,
  install_date     DATE,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  register_confirmed BOOLEAN NOT NULL DEFAULT FALSE,  -- false => "UNCONFIRMED" banner
  source           data_source NOT NULL DEFAULT 'DEMO',
  ingested_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (unit_id, loom_no)
);
CREATE INDEX ix_loom_unit_active ON loom(unit_id, active);

CREATE TABLE style (
  style_id             SERIAL PRIMARY KEY,
  style_code           VARCHAR(150) NOT NULL UNIQUE,   -- e.g. '30s VSF X 30s VSF /66X55&43&57-63" Plain'
  loom_type_code       VARCHAR(10) REFERENCES loom_type(loom_type_code),
  warp_ends            INT NOT NULL,
  reed_pick            VARCHAR(30),
  width_inch           NUMERIC(6,2),
  weave_construction   VARCHAR(30),                    -- Plain | Satin 4/1 | ...
  picks_per_metre      NUMERIC(10,3) NOT NULL,
  std_crimp_pct        NUMERIC(5,2) NOT NULL,
  std_rpm              NUMERIC(8,2) NOT NULL,
  std_efficiency_pct   NUMERIC(5,2) NOT NULL,
  revenue_per_metre    NUMERIC(10,2),
  revenue_rate_source  rate_source NOT NULL DEFAULT 'ESTIMATED',
  active               BOOLEAN NOT NULL DEFAULT TRUE
);

-- Real, confirmed monthly crimp aggregates from Jul-2026 Vendor MRM,
-- kept SEPARATE from any per-shift actual_crimp_pct (which stays NULL
-- until a lab feed exists — see design note §1.3).
CREATE TABLE style_unit_crimp_monthly (
  id            SERIAL PRIMARY KEY,
  style_id      INT NOT NULL REFERENCES style(style_id),
  unit_id       INT NOT NULL REFERENCES unit(unit_id),
  month         DATE NOT NULL,          -- first-of-month
  crimp_pct     NUMERIC(5,2) NOT NULL,
  source        rate_source NOT NULL DEFAULT 'CONFIRMED',
  UNIQUE (style_id, unit_id, month)
);

CREATE TABLE shift_master (
  shift_id          SERIAL PRIMARY KEY,
  code              VARCHAR(5) NOT NULL UNIQUE,   -- '1','2','3'
  start_time        TIME NOT NULL,
  end_time          TIME NOT NULL,
  crosses_midnight  BOOLEAN NOT NULL DEFAULT FALSE,
  scheduled_minutes INT NOT NULL DEFAULT 480
);

CREATE TABLE employee (
  employee_id        SERIAL PRIMARY KEY,
  unit_id            INT NOT NULL REFERENCES unit(unit_id) ON DELETE RESTRICT,
  employee_code      VARCHAR(30),
  name               VARCHAR(150) NOT NULL,
  role               employee_role NOT NULL,
  grade              employee_grade,
  std_looms          INT,               -- e.g. 8 for grade standard "8-Looms + 97.5%"
  std_efficiency_pct NUMERIC(5,2),
  active             BOOLEAN NOT NULL DEFAULT TRUE,
  source             data_source NOT NULL DEFAULT 'DEMO',
  ingested_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_employee_unit_role ON employee(unit_id, role);

CREATE TABLE reason_code (
  reason_code_id SERIAL PRIMARY KEY,
  code           VARCHAR(30) NOT NULL UNIQUE,
  label_en       VARCHAR(150) NOT NULL,
  label_ta       VARCHAR(150) NOT NULL,
  category       reason_category NOT NULL
);

CREATE TABLE cost_master (
  cost_master_id     SERIAL PRIMARY KEY,
  unit_id            INT REFERENCES unit(unit_id),   -- NULL = plant-wide default
  effective_from     DATE NOT NULL,
  effective_to       DATE,
  rate_per_kwh       NUMERIC(10,2),
  yarn_rate_per_kg   NUMERIC(10,2),
  other              JSONB,
  source             rate_source NOT NULL DEFAULT 'ESTIMATED'
);

-- ═══════════════════════════════════════════════════════════════════════
-- 2. OPERATIONAL
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE beam_run (
  beam_run_id  SERIAL PRIMARY KEY,
  loom_id      INT NOT NULL REFERENCES loom(loom_id) ON DELETE RESTRICT,
  style_id     INT NOT NULL REFERENCES style(style_id) ON DELETE RESTRICT,
  started_at   TIMESTAMPTZ NOT NULL,
  ended_at     TIMESTAMPTZ,
  source       data_source NOT NULL DEFAULT 'DEMO'
);
CREATE INDEX ix_beam_run_loom_time ON beam_run(loom_id, started_at);

CREATE TABLE assignment (
  assignment_id SERIAL PRIMARY KEY,
  loom_id       INT NOT NULL REFERENCES loom(loom_id) ON DELETE RESTRICT,
  shift_id      INT NOT NULL REFERENCES shift_master(shift_id) ON DELETE RESTRICT,
  work_date     DATE NOT NULL,
  employee_id   INT NOT NULL REFERENCES employee(employee_id) ON DELETE RESTRICT,
  source        data_source NOT NULL DEFAULT 'DEMO',
  ingested_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (loom_id, shift_id, work_date)
);

CREATE TABLE production_target (
  target_id              SERIAL PRIMARY KEY,
  loom_id                INT REFERENCES loom(loom_id),      -- NULL = unit-level target
  unit_id                INT NOT NULL REFERENCES unit(unit_id) ON DELETE RESTRICT,
  work_date              DATE NOT NULL,
  shift_id               INT REFERENCES shift_master(shift_id),  -- NULL = whole day
  style_id               INT REFERENCES style(style_id),
  available_hours        NUMERIC(5,2) NOT NULL,   -- the '@ 22.5 HRS' basis — must be shown in the UI
  target_metres          NUMERIC(12,3),
  target_kilo_picks      NUMERIC(14,4),
  target_efficiency_pct  NUMERIC(5,2),
  basis_note             TEXT,
  source                 data_source NOT NULL DEFAULT 'DEMO',
  ingested_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (loom_id, work_date, shift_id)
);
CREATE INDEX ix_target_unit_date ON production_target(unit_id, work_date);

CREATE TABLE fabric_roll (
  roll_id      SERIAL PRIMARY KEY,
  loom_id      INT NOT NULL REFERENCES loom(loom_id) ON DELETE RESTRICT,
  style_id     INT NOT NULL REFERENCES style(style_id) ON DELETE RESTRICT,
  work_date    DATE NOT NULL,
  shift_id     INT REFERENCES shift_master(shift_id),
  metres       NUMERIC(10,2) NOT NULL,
  weight_kg    NUMERIC(8,2),
  doffed_at    TIMESTAMPTZ,
  source       data_source NOT NULL DEFAULT 'DEMO',
  ingested_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ck_roll_nonneg CHECK (metres >= 0 AND (weight_kg IS NULL OR weight_kg >= 0))
);
CREATE INDEX ix_roll_loom_date ON fabric_roll(loom_id, work_date);

-- Vendor units (is_own_unit=false) are NOT populated with loom/production_log/
-- stop_event rows at all in v2 (design note §1.1) — only this aggregate table,
-- sourced directly from the real July-2026 Vendor MRM.
CREATE TABLE vendor_unit_monthly_summary (
  id                SERIAL PRIMARY KEY,
  unit_id           INT NOT NULL REFERENCES unit(unit_id) ON DELETE RESTRICT,
  month             DATE NOT NULL,             -- first-of-month, e.g. 2026-07-01
  efficiency_pct    NUMERIC(5,2) NOT NULL,
  kilo_picks_day_avg NUMERIC(14,2),
  metres_day_avg     NUMERIC(14,2),
  warp_breaks_per_hr NUMERIC(6,3),
  weft_breaks_per_hr NUMERIC(6,3),
  month_kilo_picks   NUMERIC(16,2) NOT NULL,
  month_metres       NUMERIC(16,2) NOT NULL,
  month_rolls        INT,
  source             VARCHAR(30) NOT NULL DEFAULT 'CSV_IMPORT',
  UNIQUE (unit_id, month)
);

CREATE TABLE import_batch (
  import_batch_id SERIAL PRIMARY KEY,
  unit_id         INT NOT NULL REFERENCES unit(unit_id),
  template_code   VARCHAR(50) NOT NULL,      -- e.g. 'DAILY_PREP_PRODUCTION_REPORT'
  uploaded_by     VARCHAR(100),
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  row_count       INT NOT NULL DEFAULT 0,
  accepted_count  INT NOT NULL DEFAULT 0,
  rejected_count  INT NOT NULL DEFAULT 0,
  status          VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW',
  notes           TEXT
);

CREATE TABLE production_log (
  production_log_id SERIAL PRIMARY KEY,
  loom_id            INT NOT NULL REFERENCES loom(loom_id) ON DELETE RESTRICT,
  work_date          DATE NOT NULL,           -- calendar date the SHIFT STARTED
  shift_id           INT NOT NULL REFERENCES shift_master(shift_id) ON DELETE RESTRICT,
  beam_run_id        INT REFERENCES beam_run(beam_run_id) ON DELETE SET NULL,
  style_id           INT NOT NULL REFERENCES style(style_id) ON DELETE RESTRICT,
  employee_id        INT REFERENCES employee(employee_id) ON DELETE SET NULL,
  scheduled_minutes  INT NOT NULL DEFAULT 480,
  running_minutes    INT NOT NULL,
  std_rpm_snapshot   NUMERIC(8,2) NOT NULL,   -- style.std_rpm at time of run, frozen for audit
  actual_picks       BIGINT NOT NULL,
  metres             NUMERIC(12,3) NOT NULL,
  kilo_picks         NUMERIC(14,4) NOT NULL,
  warp_breaks        INT NOT NULL DEFAULT 0,
  weft_breaks        INT NOT NULL DEFAULT 0,
  actual_crimp_pct   NUMERIC(5,2),            -- NULL until lab feed exists (Q18-Q20 BLOCKED)
  source             data_source NOT NULL DEFAULT 'DEMO',
  ingested_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  import_batch_id    INT REFERENCES import_batch(import_batch_id) ON DELETE SET NULL,
  CONSTRAINT ck_prodlog_running_le_scheduled CHECK (running_minutes <= scheduled_minutes),
  CONSTRAINT ck_prodlog_nonneg CHECK (metres >= 0 AND kilo_picks >= 0 AND actual_picks >= 0),
  CONSTRAINT ck_prodlog_breaks_nonneg CHECK (warp_breaks >= 0 AND weft_breaks >= 0),
  UNIQUE (loom_id, work_date, shift_id)
);
CREATE INDEX ix_prodlog_date_loom ON production_log(work_date, loom_id);
CREATE INDEX ix_prodlog_style ON production_log(style_id);
CREATE INDEX ix_prodlog_employee ON production_log(employee_id);

CREATE TABLE stop_event (
  stop_event_id   SERIAL PRIMARY KEY,
  loom_id         INT NOT NULL REFERENCES loom(loom_id) ON DELETE RESTRICT,
  work_date       DATE NOT NULL,
  shift_id        INT NOT NULL REFERENCES shift_master(shift_id) ON DELETE RESTRICT,
  raised_at       TIMESTAMPTZ NOT NULL,
  acknowledged_at TIMESTAMPTZ,
  attending_at    TIMESTAMPTZ,
  resolved_at     TIMESTAMPTZ,
  reason_code_id  INT REFERENCES reason_code(reason_code_id) ON DELETE SET NULL,
  raw_remark      TEXT,                        -- original free-text, e.g. "CARD : 8 T-CON FAULT PBM - 40 MIN."
  status          stop_status NOT NULL DEFAULT 'RAISED',
  raised_by       VARCHAR(100),
  resolved_by     VARCHAR(100),
  source          data_source NOT NULL DEFAULT 'DEMO',
  ingested_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  import_batch_id INT REFERENCES import_batch(import_batch_id) ON DELETE SET NULL,
  CONSTRAINT ck_stop_lifecycle_order CHECK (
    (acknowledged_at IS NULL OR acknowledged_at >= raised_at) AND
    (attending_at    IS NULL OR acknowledged_at IS NULL OR attending_at >= acknowledged_at) AND
    (resolved_at     IS NULL OR attending_at    IS NULL OR resolved_at  >= attending_at)
  )
);
CREATE INDEX ix_stopevent_loom_date ON stop_event(loom_id, work_date);
CREATE INDEX ix_stopevent_open ON stop_event(status) WHERE status <> 'RESOLVED';
CREATE INDEX ix_stopevent_reason ON stop_event(reason_code_id);

-- ═══════════════════════════════════════════════════════════════════════
-- 3. RECOMMENDATION / AUDIT / AUTH
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE suggestion_log (
  suggestion_id   SERIAL PRIMARY KEY,
  rule_code       VARCHAR(50) NOT NULL,   -- e.g. 'LOOM_CHRONIC_UNDERPERFORMER'
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  work_date       DATE NOT NULL,
  unit_id         INT NOT NULL REFERENCES unit(unit_id),
  loom_id         INT REFERENCES loom(loom_id),
  employee_id     INT REFERENCES employee(employee_id),
  shift_id        INT REFERENCES shift_master(shift_id),
  style_id        INT REFERENCES style(style_id),
  rupee_impact    NUMERIC(14,2),
  confidence      confidence_level NOT NULL,
  basis           TEXT NOT NULL,
  status          suggestion_status NOT NULL DEFAULT 'OPEN',
  acted_by        VARCHAR(100),
  acted_at        TIMESTAMPTZ
);
CREATE INDEX ix_suggestion_unit_date ON suggestion_log(unit_id, work_date);
CREATE INDEX ix_suggestion_rule ON suggestion_log(rule_code);

CREATE TABLE user_account (
  user_id        SERIAL PRIMARY KEY,
  username       VARCHAR(100) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  role           user_role NOT NULL,
  language_pref  VARCHAR(5) NOT NULL DEFAULT 'en',
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_unit_scope (
  user_id INT NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
  unit_id INT NOT NULL REFERENCES unit(unit_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, unit_id)
);

CREATE TABLE audit_log (
  audit_id    SERIAL PRIMARY KEY,
  user_id     INT REFERENCES user_account(user_id),
  action      VARCHAR(100) NOT NULL,   -- e.g. 'SHIFT_SIGN_OFF', 'IMPORT_COMMIT'
  entity      VARCHAR(50) NOT NULL,
  entity_id   INT,
  at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload     JSONB
);

-- ═══════════════════════════════════════════════════════════════════════
-- 4. ANALYTICS VIEWS (SQL, not Python loops — per stack rule)
-- ═══════════════════════════════════════════════════════════════════════

-- loom_efficiency_pct is THE mill's EFF% — denominator is SCHEDULED
-- minutes, not running minutes. This is what reconciles to the real
-- baseline table (ATM 89.6%, etc.) — see design note §1.11/§4.1.
-- performance_eff_pct (running-time only) is kept separate and used only
-- as a diagnostic to distinguish "loom runs slow" from "loom doesn't run".
CREATE VIEW v_production_derived AS
SELECT
  p.*,
  ROUND(p.actual_picks / NULLIF(p.std_rpm_snapshot * p.scheduled_minutes, 0) * 100, 2) AS loom_efficiency_pct,
  ROUND(p.actual_picks / NULLIF(p.std_rpm_snapshot * p.running_minutes, 0) * 100, 2)   AS performance_eff_pct,
  ROUND(p.running_minutes::numeric / NULLIF(p.scheduled_minutes, 0) * 100, 2)          AS utilization_pct,
  ROUND(p.warp_breaks / NULLIF(p.actual_picks / 1000.0, 0), 3)                         AS warp_breaks_per_1000,
  ROUND(p.weft_breaks / NULLIF(p.actual_picks / 1000.0, 0), 3)                         AS weft_breaks_per_1000
FROM production_log p;

-- Rolling 30-day cohort (renamed from v_cohort_stats_30d, which — as
-- originally written — grouped by work_date and produced a same-day
-- cohort, not a 30-day one; that mismatch between name and behavior was
-- exactly the kind of bug that survives review, per correction #6).
-- Computed per query-date via a LATERAL join over the trailing 30-day
-- window ending on that date, evaluated at the API layer (not a plain
-- view, since "as of date X" needs a parameter) — this is the reference
-- query shape the API's cohort function implements:
--   SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY loom_efficiency_pct) AS cohort_median_eff,
--          PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY loom_efficiency_pct) AS cohort_p90_eff,
--          COUNT(DISTINCT loom_id) AS cohort_loom_count
--   FROM v_production_derived d JOIN loom l ON l.loom_id = d.loom_id
--   WHERE d.style_id = :style_id AND l.loom_type_code = :loom_type_code
--     AND d.work_date BETWEEN :as_of_date - INTERVAL '30 days' AND :as_of_date
-- If cohort_loom_count < 5, the API falls back to all-history for that
-- style/loom_type and tags the response cohort_window='ALL_HISTORY —
-- insufficient recent data' (design note §1.6) — and per correction A,
-- a cohort below 5 looms may inform a screen but must NEVER fire a
-- suggestion rule.

CREATE VIEW v_stop_event_metrics AS
SELECT
  loom_id, work_date,
  EXTRACT(EPOCH FROM (acknowledged_at - raised_at))/60.0 AS response_min,
  EXTRACT(EPOCH FROM (resolved_at - attending_at))/60.0  AS mttr_min
FROM stop_event
WHERE resolved_at IS NOT NULL;
```

---

## 3. Demo data generator design

**Determinism.** Single fixed seed (`DEMO_SEED = 42`), all randomness routed
through one `numpy.random.default_rng(DEMO_SEED)` instance passed
explicitly through the generator — no bare `random.random()` calls, so a
re-run reproduces byte-identical output. Every row written with
`source='DEMO'`.

**Step 1 — Masters.**
- `unit`: ATM (`is_own_unit=true`) + CVF, SKT, VPN, METRO, TPN
  (`is_own_unit=false`).
- `loom_type`: 810, 910 (Tsudakoma airjet), 340, 280, TS, SZ (Sulzer).
- `loom` counts: **ATM only** = 168 airjet (mix of 810/910) + 24 Sulzer
  (mix of 340/280/TS/SZ), `register_confirmed=false`. **Vendor units get
  no `loom` rows at all** (design note §1.1, `RESOLVED`) — their real
  July-2026 figures go into `vendor_unit_monthly_summary` directly, one
  row per unit, `source='CSV_IMPORT'`. No loom-count derivation is
  performed or needed.
- `employee`: 137 rows built directly from the grade/role table in §3 of
  the brief — role counts and grade counts are sampled to hit the exact
  totals given (63 WEAVER, 18 FABRIC_CHECKER, etc.; grade distribution
  49×G1+, 24×G2, 23×G1, …), `std_looms`/`std_efficiency_pct` set per the
  4 grade-standard bands given (`8-Looms+97.5%`, `7+97%`, `6+97.5%`,
  `5+97%`, trainee `4+97%`). Names drawn from three fixed Tamil/Hindi/Odia
  name-pools (first+last combinations) sized well above 137 to avoid
  duplicates.
- `style`: the 10 real styles from §3, `loom_type_code` inferred from the
  "Loom type" column (Airjet→810/910, Sulzer→340/280/TS/SZ, picked
  deterministically per style index). `picks_per_metre` is **derived from
  the style code's own pick density**, not a generic construction default
  (correction #3): a style code like `66X55` means 66 ends/inch × 55
  picks/inch, so `picks_per_metre = picks_per_inch × 39.3701`. This is
  independently checkable against the baseline table — dividing each
  unit's month kilo-picks by month metres gives an implied picks/metre
  (ATM≈2,161, CVF≈2,308, SKT≈2,438, VPN≈1,809, METRO≈2,212, TPN≈2,682),
  and ATM's implied ~54.9 picks/inch lines up with the `66×55` plain style
  that dominates its mix — good evidence the baseline table is internally
  consistent real data. `revenue_per_metre` seeded flat as
  `DEFAULT_REVENUE_PER_METRE` (design note §1.2, `RESOLVED`),
  `revenue_rate_source='ESTIMATED'` — not fit to reproduce any particular
  ₹ total, since none exists to fit against.
- `style_unit_crimp_monthly`: the exact crimp % values given per
  style×unit×July-2026, `source='CONFIRMED'`.
- `shift_master`: 3 rows, shift 3 `crosses_midnight=true`.
- `reason_code`: the weaving-appropriate list in §3 (warp break, weft
  break, sort/beam change, knotting, gaiting, weft feeder fault, air
  pressure low, power failure, voltage fluctuation, preventive
  maintenance, mechanical breakdown, electrical breakdown, no weaver,
  fabric roll doffing), bilingual labels, categorized.

**Step 2 — Beam runs & assignment.** Each loom gets a style loaded from a
loom-type-appropriate subset of the 10 styles, changed every 6-12 days
(drawn per loom) across the month — this is the "Beam/Sort" lifecycle.
Employees assigned to loom×shift×date respecting each employee's
`std_looms` (a G1+ weaver on 8 looms is assigned a block of 8 looms for a
shift, not 1) and the plant's real shift-3-is-worse pattern reflected later
in output, not in assignment itself.

**Step 3 — Per-loom persistent effects (this is what F2 was missing).**
Drawn once per loom, held constant across the month:
- `loom_efficiency_offset`: mixture model — 85% of looms
  `~ Normal(0, 1.5pp)`, 15% "chronic underperformer" looms
  `~ Normal(-9pp, 2pp)` (clipped so no loom goes below a floor of
  unit_mean − 20pp). This is what produces a real worst-loom tail instead
  of F2's uniform output.
- `loom_break_offset`: correlated with the efficiency offset (chronic-bad
  looms also break more) via a shared latent factor, plus independent
  noise.
- 1-2 looms per unit per month get a **degrade event**: linear
  −0.5pp/day efficiency decline over 10 days, terminating in a
  `mechanical breakdown` stop event with long downtime (90-240 min), then
  efficiency resets to that loom's normal offset. This is the "predictive
  maintenance would have caught this" story for the eventual Q14 pitch.

**Step 4 — Per-shift generation.**
```
base_eff = unit_target_eff (§3 table)
         × shift_factor[shift]      -- derived from 89.48/91.18/88.03, normalized to shift-1=1.0
         + style_penalty(style)     -- small deterministic penalty scaled by warp_ends/crimp complexity
         + loom_efficiency_offset[loom]
         + Normal(0, 1.0pp)         -- daily noise
         + degrade_delta(loom, day) -- 0 unless loom is in a degrade window
eff = clip(base_eff, 40, 100)

scheduled_minutes = shift_master.scheduled_minutes  -- 480
stopped_minutes = stop_event_generator(loom, shift, date)  -- see Step 5
running_minutes = scheduled_minutes - stopped_minutes

actual_picks = round(style.std_rpm * running_minutes * eff/100)
metres       = actual_picks / style.picks_per_metre
kilo_picks   = actual_picks / 1000

warp_breaks  = Poisson(unit_warp_rate_per_hr[unit] * running_minutes/60 * style_break_multiplier + loom_break_offset)
weft_breaks  = Poisson(unit_weft_rate_per_hr[unit] * running_minutes/60 * style_break_multiplier + loom_break_offset)
```

**Step 5 — Stop-event generator.** `stopped_minutes` for a shift is drawn
first (so running_minutes is internally consistent), then decomposed into
1-4 discrete `stop_event` rows whose durations sum to it. Reason category
weights are unit-specific but anchored to the plant-wide facts given:
POWER/ELECTRICAL category gets the dominant weight (targeting the stated
42.9%/74.9% stoppage shares and ~9.5 EB-failure hours + 24 voltage events
per month in total across the plant), remaining weight split across
MECHANICAL, MATERIAL (warp/weft break handling itself isn't a "stop" if
short — only break-driven stops over a duration threshold become a
`stop_event`, shorter ones are absorbed into the break counts above),
MANPOWER (`no weaver`), and PLANNED (`sort/beam change`, `preventive
maintenance`). Each event gets `raised_at` → `acknowledged_at` (+5-20 min)
→ `attending_at` (+2-15 min) → `resolved_at` (duration drawn per category:
electrical/mechanical longer-tailed than material/manpower), all inside
the shift window (spilling into the next shift's window is allowed and
handled correctly by `work_date`/timestamp separation, not clamped).

**Step 6 — Calibration pass (ATM only — vendor units have no generator to
calibrate).** After generating a full month, sum `kilo_picks`/`metres` and
compare to the ATM row of the §3 table. **`unit_target_eff` (89.6%) is
never the free variable** (correction #2) — it is the one confirmed real
number in the whole baseline and is the calibration *target*. If ATM's
generated totals are outside ±2%, correct in this preference order: (1)
`loom_count` (currently unconfirmed — the legitimate knob), (2) `std_rpm`
per loom type (currently seeded, not confirmed), (3) `scheduled_minutes`
per shift if 480 doesn't reflect the mill's actual available hours (their
own sheet uses `@ 22.5 HRS` / `@ 22 HRS` / `@ 21 HRS` per department,
i.e. *not* a flat 8h/24h assumption). Bounded to 3 correction passes,
still seeded/deterministic, logged so the final calibration factor is
visible. **If drift can't be closed within 3 passes, stop and report the
inconsistency rather than tuning until it fits** — an unclosable gap is
information about a wrong assumption (e.g. `scheduled_minutes`), not a
bug to paper over.

**Step 7 — Fabric rolls.** Each production_log row that completes a
running batch doffs 0-2 rolls, weight drawn from the real bands (50-200 kg)
per unit; totals calibrated the same way as Step 6, targeting ATM 2,474
rolls/month (vendor unit roll counts — CVF 3,354, SKT 1,019, VPN 381,
METRO 277, TPN 255 — go straight into
`vendor_unit_monthly_summary.month_rolls`, not generated per-loom, since
vendor units have no looms in v2).

**Reconciliation test** (`tests/test_demo_reconciliation.py`):
```python
# ATM is the only unit with a generator to reconcile — vendor units are
# loaded straight into vendor_unit_monthly_summary from the real MRM
# figures, so "reconciliation" for them is just "does the loaded row match
# the source table", asserted once at import/seed time, not regenerated.
ATM_EXPECTED = {"eff": 89.6, "kilo_picks": 3_331_544, "metres": 1_541_450, "rolls": 2_474}
VENDOR_EXPECTED = {
    "VPN":   {"eff": 93.9, "kilo_picks": 473_905,   "metres": 261_892,   "rolls": 381},
    "CVF":   {"eff": 90.6, "kilo_picks": 4_742_548, "metres": 2_054_906, "rolls": 3_354},
    "SKT":   {"eff": 87.2, "kilo_picks": 1_218_425, "metres": 499_839,   "rolls": 1_019},
    "METRO": {"eff": 84.3, "kilo_picks": 423_515,   "metres": 191_497,   "rolls": 277},
    "TPN":   {"eff": 83.7, "kilo_picks": 374_280,   "metres": 139_530,   "rolls": 255},
}
IMPLIED_PICKS_PER_METRE = {
    "ATM": 2161, "CVF": 2308, "SKT": 2438, "VPN": 1809, "METRO": 2212, "TPN": 2682,
}

def test_demo_atm_matches_vendor_mrm():
    totals = generate_demo_month(seed=42)["ATM"]
    exp = ATM_EXPECTED
    assert abs(totals["kilo_picks"] - exp["kilo_picks"]) / exp["kilo_picks"] <= 0.02
    assert abs(totals["metres"] - exp["metres"]) / exp["metres"] <= 0.02
    assert abs(totals["rolls"] - exp["rolls"]) / exp["rolls"] <= 0.02
    assert abs(totals["eff"] - exp["eff"]) <= 1.0   # percentage points, tighter absolute band

def test_vendor_summary_rows_match_source_exactly():
    for unit_code, exp in VENDOR_EXPECTED.items():
        row = get_vendor_unit_monthly_summary(unit_code, month="2026-07-01")
        assert row.efficiency_pct == exp["eff"]
        assert row.month_kilo_picks == exp["kilo_picks"]
        assert row.month_metres == exp["metres"]
        assert row.month_rolls == exp["rolls"]

def test_demo_picks_per_metre_ratio():
    # Correction #3 — catches style-mix errors the totals tests can each
    # pass independently while still getting the fabric mix wrong.
    totals = generate_demo_month(seed=42)
    for unit_code, expected_ppm in IMPLIED_PICKS_PER_METRE.items():
        got = totals[unit_code]
        implied = (got["kilo_picks"] * 1000) / got["metres"]
        assert abs(implied - expected_ppm) / expected_ppm <= 0.03

def test_demo_efficiency_has_real_spread():
    # Strengthens the plain "no two looms identical" check (correction C)
    # — a uniform distribution with float noise can pass a distinctness
    # check while still looking dead on screen.
    rows = get_all_loom_month_summaries(unit="ATM")
    effs = [r.loom_efficiency_pct for r in rows]
    signatures = {(r.loom_efficiency_pct, r.metres, r.revenue) for r in rows}
    assert len(signatures) == len(rows)                       # F2 regression guard
    assert statistics.pstdev(effs) >= 2.0                     # real spread, not noise
    p10_cutoff = sorted(effs)[len(effs) // 10]
    median = statistics.median(effs)
    assert median - p10_cutoff >= 5.0                         # a real worst-10% tail

def test_demo_loss_causes_sum_to_headline():
    brief = compute_morning_brief(unit="ATM", date=...)
    assert abs(sum(c.rupees for c in brief.loss_causes) - brief.total_loss_rupees) <= brief.total_loss_rupees * 0.005

def test_loom_efficiency_reconciles_with_performance_and_utilization():
    # Identity check for correction #1's three-function split.
    row = get_one_production_log_row()
    implied = row.performance_eff_pct * row.utilization_pct / 100
    assert abs(implied - row.loom_efficiency_pct) <= 0.5   # rounding tolerance
```

---

## 4. `formulas.py` design + suggestion rule registry

### 4.1 `backend/app/analytics/formulas.py` (pure functions, each unit-tested)

```python
def loom_efficiency_pct(actual_picks: Decimal, std_rpm: Decimal, scheduled_min: Decimal) -> Decimal | None:
    """THE mill's EFF%. Denominator = SCHEDULED minutes, not running minutes
    (correction #1 — the brief's original formula used running_min, which
    measures speed-while-running and lands near 97-98%, hiding all
    stoppage; it cannot reconcile to the real baseline table, e.g. ATM
    89.6%, because that figure is measured against scheduled time).
    This is THE headline number everywhere "efficiency" is shown unqualified.
    None if scheduled_min == 0 (no fabricated 0%)."""

def performance_eff_pct(actual_picks: Decimal, std_rpm: Decimal, running_min: Decimal) -> Decimal | None:
    """Speed efficiency while actually running. Diagnostic only — separates
    'loom runs slow' from 'loom doesn't run'. Never shown as THE efficiency
    number without the 'performance (while running)' qualifier."""

def utilization_pct(running_min: Decimal, scheduled_min: Decimal) -> Decimal | None:
    """running_min / scheduled_min * 100.
    Identity that must hold (tested): loom_efficiency_pct ≈
    performance_eff_pct * utilization_pct / 100, within rounding."""
    ...

def kilo_picks(picks_per_metre: Decimal, metres: Decimal) -> Decimal:
    """(picks_per_metre * metres) / 1000 — derivation, asserted consistent with stored kilo_picks."""

def warp_breaks_per_1000(warp_breaks: int, actual_picks: int) -> Decimal | None: ...
def weft_breaks_per_1000(weft_breaks: int, actual_picks: int) -> Decimal | None: ...

def cohort_gap_pp(loom_efficiency_pct: Decimal, cohort_median_eff: Decimal | None) -> Decimal | None:
    """Both inputs are loom_efficiency_pct (scheduled-time basis), never
    performance_eff_pct — a cohort comparison on the running-time number
    would compare stoppage-hidden figures. None (not 0) when no cohort
    exists — see cohort fallback rule in design note §1.6."""

def mtbf_hours(running_min_total: Decimal, stop_count: int) -> Decimal | None: ...
def mttr_min(resolved_at: datetime, attending_at: datetime) -> Decimal | None: ...
def response_min(acknowledged_at: datetime, raised_at: datetime) -> Decimal | None: ...

def lost_metres(metres: Decimal, running_min: Decimal, stopped_min: Decimal) -> Decimal | None: ...

def lost_revenue(lost_metres: Decimal, revenue_per_metre: Decimal, rate_source: str) -> tuple[Decimal, str]:
    """Returns (value, rate_source) — caller must render rate_source in the UI (Anti-Slop rule 8)."""

def efficiency_gap_value(
    cohort_p90_eff: Decimal, loom_eff: Decimal, potential_metres: Decimal, revenue_per_metre: Decimal
) -> Decimal: ...

def crimp_deviation_pp(actual_crimp_pct: Decimal | None, std_crimp_pct: Decimal) -> Decimal | None:
    """None while actual_crimp_pct is unmeasured (Q18-Q20 BLOCKED) — never silently 0."""

def weaver_index(weaver_eff: Decimal, std_efficiency_pct: Decimal) -> Decimal | None: ...
```

Every function: (a) returns `None` rather than `0`/`NaN` on missing/zero
denominators — callers render "No data" not "0%" (Anti-Slop rule 4), (b)
has a pytest with at least a normal case, a zero-denominator case, and a
None-input case.

### 4.2 Suggestion rule registry (`backend/app/analytics/rules/`)

Each rule is a standalone, versioned, named function:
`rule(session, unit_id, as_of_date) -> list[Suggestion]`.

| Rule code | Threshold (stated) | Justification |
|---|---|---|
| `LOOM_CHRONIC_UNDERPERFORMER` | `cohort_gap_pp < -5` for ≥5 of last 7 days with data | 5pp is roughly 2× the seeded "normal" loom's noise band (§3 Step 3: normal looms `~N(0,1.5pp)`), so a 5pp+ persistent gap is a real signal, not noise; 5-of-7 days filters one-off bad shifts. |
| `WEFT_BREAK_OUTLIER` | weft_breaks_per_1000 > cohort p90 for ≥3 consecutive days | p90 (not p95) chosen because weft feeder issues are common enough in airjet looms that p95 would miss real, actionable problems; 3-day persistence filters a single bad yarn lot bobbin. |
| `SHIFT_SYSTEMATIC_GAP` | one shift's mean efficiency < other two by >2pp for ≥5 of last 7 days, same loom set | 2pp matches the real spread across ATM's own 3 shifts in the Daily Preparatory Report (89.48/91.18/88.03 ≈ 3.1pp shift-1-to-shift-3 spread) — a *sustained* 2pp+ gap beyond the plant's normal shift pattern flags supervision, not just the known shift-3 effect. |
| `WEAVER_BELOW_GRADE_STANDARD` | weaver_index < 0.97 for ≥5 of last 7 working days | Grade standards themselves specify ~97% (e.g. "8-Looms + 97.5%"); index<0.97 means the weaver is missing their own grade's bar, not an arbitrary plant-wide cutoff. Also fires the inverse: a G1+/G2+ weaver running fewer looms than their `std_looms` for ≥5 days → `UNDER_ALLOCATED_HIGH_GRADE` variant. |
| `REPEAT_FAILURE` | same loom + same reason_code ≥2 times within 7 days | Two recurrences of the *same coded reason* within a week is the standard maintenance-engineering signal that a fix didn't hold — this is a count threshold, not a rate, deliberately low to catch it early. |
| `MTTR_OUTLIER` | loom's or shift's mean MTTR > plant-wide p75 over trailing 30 days, min 3 events | p75 (not p90) because response/repair problems are worth surfacing before they become the worst quartile; 3-event minimum avoids one long repair skewing a small sample. |
| `CRIMP_DEVIATION` | \|actual_crimp_pct − std_crimp_pct\| > 0.5pp | **Inactive/BLOCKED in v2** — `actual_crimp_pct` is NULL until the lab feed exists (design note §1.3); rule is registered with `availability=BLOCKED` and a stub that returns `[]`, not deleted, so it activates the moment the feed connects. |
| `POWER_LOSS_CONCENTRATION` | POWER/ELECTRICAL category share of total downtime minutes > 40% over trailing 30 days for a unit | 40% chosen because the plant's own MRM shows 42.9%/74.9% shares in comparable categories — the threshold flags when a unit is *at or above* its own historical baseline, i.e. "this is still your #1 problem," not a made-up global bar. |

Each rule returns `Suggestion` objects per the interface in §4 of the
brief; `confidence` is set by rule-internal logic (e.g.
`LOOM_CHRONIC_UNDERPERFORMER` is `HIGH` at 7-of-7 days, `MEDIUM` at 5-6,
never fires below 5) — not a single global confidence constant.

**Addition A — minimum cohort size gate (mandatory, applies to every
cohort-based rule).** `LOOM_CHRONIC_UNDERPERFORMER` and any other rule
comparing a loom against `cohort_median_eff`/`cohort_p90_eff` **must not
fire from a cohort of fewer than 5 looms.** Below that size the API still
returns the comparison as informational (with `cohort_loom_count` visible
so the UI can show "compared against only 3 looms — informational only"),
but the rule engine suppresses the suggestion entirely. A wrong suggestion
built on a 3-loom median costs more credibility with the owner than a
missing one — this is enforced once, centrally, in the rule-evaluation
wrapper that every cohort-based rule runs through, not re-implemented per
rule.

**Addition B — outcome-tracking loop (P3, using the schema already
present).** `suggestion_log.status`/`acted_by`/`acted_at` exist from P0.
When a suggestion transitions to `DONE`, a P3 job measures that loom's
`loom_efficiency_pct` over the following 7 days against the 7 days before
the suggestion fired, and stores the delta. This produces the single most
persuasive screen in the product — *"suggestions acted on this month
recovered ₹X of an estimated ₹Y opportunity"* — because it demonstrates
the system paying for itself instead of asserting it. Not built in P0;
the schema (§2) already supports it without changes.

---

## 5. Q1–Q23 module registry

Reusing the client's original 23-question numbering/topics (matches the
categories named in this brief's §4 exactly: Production, Breakdown,
Manpower, Maintenance, Compressor, Quality, Revenue).

| ID | Title | Category | Required sources | Availability |
|---|---|---|---|---|
| Q1 | Today's target vs actual, kilo-pick, efficiency, breaks, variance, vs yesterday | Production | production_log, style | READY |
| Q2 | Standard vs extra warp/weft time and revenue loss | Production | production_log, stop_event, cost_master | READY (revenue leg `ESTIMATED`) |
| Q3 | Highest/lowest production & efficiency today; best/worst weaver | Production | production_log, assignment, employee | READY |
| Q4 | Weekly/monthly/yearly production by loom | Production | production_log | READY |
| Q5 | Highest breakdown-time loom today; most breakdowns this month | Breakdown | stop_event | READY |
| Q6 | Average downtime per breakdown; main reasons; abnormal patterns | Breakdown | stop_event, reason_code | READY |
| Q7 | Production/revenue loss due to breakdowns; shift with highest breakdown time | Breakdown | stop_event, production_log, cost_master | READY (revenue leg `ESTIMATED`) |
| Q8 | Operator attendance | Manpower | assignment + **HR/biometric feed** | PARTIAL |
| Q9 | Operator production/efficiency | Manpower | production_log, assignment | PARTIAL (real once assignment is live, not demo) |
| Q10 | Absenteeism impact | Manpower | assignment + **HR feed** | PARTIAL |
| Q11 | Operator grade/work allotment | Manpower | employee, assignment | PARTIAL |
| Q12 | Maintenance due/overdue/preventive | Maintenance | **maintenance schedule register** (not yet modeled) | PARTIAL |
| Q13 | Scheduled vs actual maintenance | Maintenance | maintenance register + stop_event | PARTIAL |
| Q14 | Breakdown prediction | Maintenance/ML | ≥6 months labeled stop_event history | BLOCKED — countdown widget only, no model (§9 rule 6) |
| Q15 | Standard vs actual compressed-air consumption | Compressor | **compressor flow meter feed** | BLOCKED |
| Q16 | Compressor air loss & estimated cost | Compressor | compressor feed + cost_master | BLOCKED |
| Q17 | Compressor trend by day/week/month/loom | Compressor | compressor feed | BLOCKED |
| Q18 | Fabric defect % and major causes | Quality | **quality/lab feed** | BLOCKED |
| Q19 | Standard vs abnormal crimp % | Quality | lab feed for per-shift actual_crimp_pct (monthly aggregate is `style_unit_crimp_monthly`, real) | BLOCKED (per-shift), reference data READY |
| Q20 | Yarn waste % | Quality | lab/waste feed | BLOCKED |
| Q21 | Today's/monthly weaving revenue; highest/lowest revenue loom/style | Revenue | production_log, style.revenue_per_metre | READY (`ESTIMATED` rate) |
| Q22 | Profit/loss and major reasons | Revenue | revenue + cost_master (energy/maintenance/labor/material cost) | PARTIAL — profit only where cost_master populated, else explicit "profitability unavailable" |
| Q23 | Revenue loss due to breakdowns, electrical downtime, low efficiency | Revenue | stop_event, production_log, cost_master | READY (`ESTIMATED`) |

`availability()` is computed live per unit, not hardcoded — a vendor unit
with no `assignment` data at all would show Q9 as `BLOCKED` even though
ATM shows it `PARTIAL`, per §4's own per-source gating logic.

**Vendor-unit scoping (post-review):** since vendor units carry no
`loom`/`production_log`/`stop_event` rows at all (design note §1.1), any
question requiring per-loom, per-shift, or per-event detail — Q3-Q13,
Q19-Q20, Q22-Q23's decomposition — is `BLOCKED` for vendor units
specifically, even where it's `READY`/`PARTIAL` for ATM. Vendor units only
ever answer the aggregate-shaped questions (Q1's headline, Q4's monthly
total, Q21's monthly revenue) from `vendor_unit_monthly_summary`, each
response carrying `period: "2026-07 (monthly MRM, not live)"` so it's
never mistaken for a live figure, and never assembled into a cross-unit
ranking with ATM's per-loom data (this is the structural fix for F5).

---

## 6. P0 task list with definition of done

| # | Task | Definition of done |
|---|---|---|
| 0.1 | **Preserve v1, scaffold v2 fresh** — v1 tagged `v1-final`, branched `archive/v1` (both pushed), `docs/V1_POSTMORTEM.md` written; v2 scaffolded under `v2/backend/` alongside (not replacing) v1's `backend/`/`frontend/` | `v1-final` tag and `archive/v1` branch exist on origin; postmortem covers F1-F7; `v2/` directory exists with no imports from v1's `backend/app/`. **DONE.** |
| 0.2 | New Alembic migration from the corrected DDL in §2 (no TimescaleDB; includes `production_target`, `fabric_roll`, `vendor_unit_monthly_summary`) | `alembic upgrade head` succeeds against a clean DB; `alembic downgrade base` succeeds and is symmetric. |
| 0.3 | Master seed script — **ATM only** for `loom`; units, sheds, loom_type, style, style_unit_crimp_monthly, shift_master, employee, reason_code, cost_master, production_target basis; vendor units get `vendor_unit_monthly_summary` rows only (loaded from the real July-2026 table, `source='CSV_IMPORT'`) | Row counts match §3 exactly (137 employees split per role/grade table, 168+24 ATM looms only, 10 styles, 6 units); `register_confirmed=false` on all seeded looms; `test_vendor_summary_rows_match_source_exactly` passes; idempotent. |
| 0.4 | `formulas.py` with full test coverage — **built before the demo generator**, since the generator depends on the corrected `loom_efficiency_pct` definition (correction #1); building the generator first would bake in the wrong one | Every function in §4.1 has ≥3 tests (normal/zero-denominator/None-input); `test_loom_efficiency_reconciles_with_performance_and_utilization` passes; 100% line coverage on the module. |
| 0.5 | Demo data generator (beam_run, assignment, production_log, stop_event, fabric_roll) for **ATM only** per §3 of this doc, using `formulas.py` from 0.4 | `test_demo_atm_matches_vendor_mrm`, `test_demo_picks_per_metre_ratio`, `test_demo_efficiency_has_real_spread`, `test_demo_loss_causes_sum_to_headline` all pass; generation is deterministic (byte-identical output across 2 runs with the same seed). |
| 0.6 | Reconciliation test suite (5 tests per §3) wired into CI | `pytest tests/test_demo_reconciliation.py` is a required check; failing it fails the build. Includes a printed report of the 20 worst ATM looms by monthly `loom_efficiency_pct` for manual review — the shape (visible tail, chronic offenders, one degrading loom) is checked by eye before P1 starts, not just by the automated assertions. |
| 0.7 | `docs/V2_DDL.sql`, `docs/V2_DEMO_GENERATOR.md`, `docs/V2_RULES.md` extracted from this design doc into their own reference files once implementation starts | Files exist, cross-linked from module docstrings. |

**Nothing in P1+ starts until 0.2–0.6 are green.**

---

## Open items — all resolved in review

1. ~~Loom-count derivation for vendor units~~ → **Resolved: no vendor
   looms; unit-aggregate only.** See §1.1.
2. ~~₹/revenue placeholder confirmation~~ → **Resolved: flat
   `DEFAULT_REVENUE_PER_METRE`, `ESTIMATED` tag, "Confirm your rate card"
   panel.** See §1.2.
3. ~~`vendor_coordinator` ₹ visibility scope~~ → **Resolved: zero ₹
   anywhere, no exceptions.** See §1.10.
4. ~~Go-ahead to delete v1~~ → **Resolved: v1 is not deleted.** Tagged
   `v1-final`, branched `archive/v1`, both pushed to origin. v2 is built
   fresh alongside it in `v2/`.

Six additional blocking corrections from review are folded into the
relevant sections above (marked `correction #1`-`#6` inline): the wrong
efficiency formula (§4.1), the calibration pass tuning the wrong variable
(§3 Step 6), the picks-per-metre derivation and its reconciliation test
(§3), dropping TimescaleDB (§2), the two missing entities
`production_target`/`fabric_roll` (§2), and the cohort view's
name/behavior mismatch (§2). Three additions — the cohort minimum-size
gate, the outcome-tracking loop, and the strengthened uniformity test —
are folded into §4.2 and §3 respectively.

P0 is proceeding per the corrected task list in §6.
