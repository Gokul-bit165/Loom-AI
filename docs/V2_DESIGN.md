# Loom AI v2 — Pre-Build Design (§12 deliverables)

Per §12 of the v2 brief: no application code until this document is reviewed.
v1 (everything currently in `backend/`, `frontend/`, and the root CSVs) is
**not deleted yet** — deletion is destructive and irreversible, so it is the
first task of P0 execution, done only after this design is approved, not as
part of writing this doc.

---

## 1. Challenges, ambiguities, things I think are wrong or need a decision

1. **Loom count is a calibration output, not a given.** §3 says "seed 168
   airjet + 24 Sulzer at ATM" but also "put the count in a master table and
   seed config — never hardcoded" and "banner LOOM MASTER UNCONFIRMED." These
   aren't in tension as long as it's clear: the *numbers* 168/24 are a seed
   **config value** (data), not a literal in application logic, and every
   screen that shows loom counts reads it from `loom` table row-counts, not
   from a constant. I'll treat 168+24 as the seed default, flagged
   unconfirmed, and derive vendor-unit loom counts algorithmically from
   their kilo-pick share (see §3 below) rather than guessing them too —
   confirm this derivation is acceptable or if you have real vendor loom
   counts to use instead.
2. **`revenue_per_metre` by style is explicitly unconfirmed data** (see
   Appendix: "confirm... revenue per metre by style... without these every
   ₹ is fiction"). Every ₹ figure that depends on it (lost_revenue,
   efficiency_gap_value, Revenue & Loss page) will be tagged
   `rate_source: ESTIMATED` until real rate cards exist, per Anti-Slop
   rule 8. I'm seeding a plausible rate per style scaled to reproduce the
   aggregate ATM revenue figures the mill already reports in its MRM
   (₹1,92,730/day was flagged in F6 as a *v1 bug*, not a real figure I have
   permission to reuse — I have no real ATM revenue baseline in this brief
   at all, only kilo-picks/metres/crimp). **I need either a real revenue
   figure or explicit sign-off that all revenue/₹ numbers in the v2 demo
   are synthetic/estimated placeholders** — I will not invent a precise
   rupee baseline and present it as derived from real data.
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
10. **Auth/roles**: brief says 4 roles with financial gating "at the API
    layer, not by hiding UI." I'm reading this as: the API returns
    `null`/omits ₹ fields entirely for `supervisor`/`vendor_coordinator`
    tokens rather than the frontend conditionally rendering them — please
    confirm `vendor_coordinator` should see zero ₹ data for any unit
    (including their own vendor unit's revenue), or only zero ₹ data for
    *other* units.

None of the above block starting P0 — flagging them now per §12 rule 1 so a
wrong assumption doesn't get built into 40 files before it's caught.

---

## 2. Final DDL

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- EXTENSIONS
-- ═══════════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS timescaledb;

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
SELECT create_hypertable('production_log', 'work_date', if_not_exists => TRUE);
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
SELECT create_hypertable('stop_event', 'raised_at', if_not_exists => TRUE);
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

CREATE VIEW v_production_derived AS
SELECT
  p.*,
  ROUND(p.actual_picks / NULLIF(p.std_rpm_snapshot * p.running_minutes, 0) * 100, 2) AS efficiency_pct,
  ROUND(p.running_minutes::numeric / NULLIF(p.scheduled_minutes, 0) * 100, 2)        AS utilization_pct,
  ROUND(p.warp_breaks / NULLIF(p.actual_picks / 1000.0, 0), 3)                       AS warp_breaks_per_1000,
  ROUND(p.weft_breaks / NULLIF(p.actual_picks / 1000.0, 0), 3)                       AS weft_breaks_per_1000
FROM production_log p;

CREATE VIEW v_cohort_stats_30d AS
SELECT
  d.style_id,
  l.loom_type_code,
  d.work_date,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY d.efficiency_pct) AS cohort_median_eff,
  PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY d.efficiency_pct) AS cohort_p90_eff,
  COUNT(DISTINCT d.loom_id) AS cohort_loom_count
FROM v_production_derived d
JOIN loom l ON l.loom_id = d.loom_id
GROUP BY d.style_id, l.loom_type_code, d.work_date;

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
- `unit`: ATM (`is_own_unit=true`) + CVF, SKT, VPN, METRO, TPN.
- `loom_type`: 810, 910 (Tsudakoma airjet), 340, 280, TS, SZ (Sulzer).
- `loom` counts: ATM = 168 airjet (mix of 810/910) + 24 Sulzer (mix of
  340/280/TS/SZ), `register_confirmed=false`. Vendor units: derive
  `loom_count ≈ round(unit_kilo_picks_per_day / atm_kilo_picks_per_loom)`
  where `atm_kilo_picks_per_loom = 107,469 / 192 ≈ 559.7`, adjusted by each
  unit's efficiency ratio to ATM's (a lower-efficiency unit needs
  proportionally more looms for the same output). All flagged
  `register_confirmed=false`.
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
  deterministically per style index). `picks_per_metre` derived from
  `reed × pick` where given, otherwise a reasonable construction-based
  default. `revenue_per_metre` seeded as `ESTIMATED` (see design note §1.2)
  scaled so per-unit monthly revenue lands in a plausible range for a mid-
  size composite mill — explicitly not claimed as real.
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

**Step 6 — Calibration pass.** After generating a full month, sum
`kilo_picks`/`metres` per unit and compare to the §3 table. If any unit is
outside ±2%, apply one deterministic multiplicative correction to that
unit's `unit_target_eff` (or loom count, if the count derivation was the
source of drift) and regenerate — bounded to at most 3 correction passes,
still seeded/deterministic, logged so the final calibration factor is
visible (not silently tuned away).

**Reconciliation test** (`tests/test_demo_reconciliation.py`):
```python
def test_demo_month_matches_vendor_mrm():
    totals = generate_demo_month(seed=42)
    expected = {
        "VPN": {"eff": 93.9, "kilo_picks": 473_905, "metres": 261_892},
        "CVF": {"eff": 90.6, "kilo_picks": 4_742_548, "metres": 2_054_906},
        "ATM": {"eff": 89.6, "kilo_picks": 3_331_544, "metres": 1_541_450},
        "SKT": {"eff": 87.2, "kilo_picks": 1_218_425, "metres": 499_839},
        "METRO": {"eff": 84.3, "kilo_picks": 423_515, "metres": 191_497},
        "TPN": {"eff": 83.7, "kilo_picks": 374_280, "metres": 139_530},
    }
    for unit_code, exp in expected.items():
        got = totals[unit_code]
        assert abs(got["kilo_picks"] - exp["kilo_picks"]) / exp["kilo_picks"] <= 0.02
        assert abs(got["metres"] - exp["metres"]) / exp["metres"] <= 0.02
        assert abs(got["eff"] - exp["eff"]) <= 1.0   # percentage points, tighter absolute band

def test_demo_no_two_looms_identical():
    rows = get_all_loom_month_summaries(unit="ATM")
    signatures = {(r.efficiency_pct, r.metres, r.revenue) for r in rows}
    assert len(signatures) == len(rows)   # F2 regression guard

def test_demo_loss_causes_sum_to_headline():
    brief = compute_morning_brief(unit="ATM", date=...)
    assert abs(sum(c.rupees for c in brief.loss_causes) - brief.total_loss_rupees) <= brief.total_loss_rupees * 0.005
```

---

## 4. `formulas.py` design + suggestion rule registry

### 4.1 `backend/app/analytics/formulas.py` (pure functions, each unit-tested)

```python
def efficiency_pct(actual_picks: Decimal, std_rpm: Decimal, running_min: Decimal) -> Decimal | None:
    """actual_picks / (std_rpm * running_min) * 100. None if running_min == 0 (no fabricated 0%)."""

def utilization_pct(running_min: Decimal, scheduled_min: Decimal) -> Decimal | None: ...

def kilo_picks(picks_per_metre: Decimal, metres: Decimal) -> Decimal:
    """(picks_per_metre * metres) / 1000 — derivation, asserted consistent with stored kilo_picks."""

def warp_breaks_per_1000(warp_breaks: int, actual_picks: int) -> Decimal | None: ...
def weft_breaks_per_1000(weft_breaks: int, actual_picks: int) -> Decimal | None: ...

def cohort_gap_pp(loom_eff: Decimal, cohort_median_eff: Decimal | None) -> Decimal | None:
    """None (not 0) when no cohort exists — see cohort fallback rule in design note §1.6."""

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

---

## 6. P0 task list with definition of done

| # | Task | Definition of done |
|---|---|---|
| 0.1 | **Delete v1** (`backend/app/{db_models.py,analytics,repositories,services,routers,ingestion,data,assistant,models,validation}`, `frontend/app`, `frontend/components`, root CSVs, old alembic versions) — after this design is approved | `git rm` in one dedicated commit, nothing from v1 imported by any v2 file; v1's `docs/REDEVELOPMENT_PLAN.md` superseded by this doc (kept for history, not deleted — it documents real prior audit work). |
| 0.2 | New Alembic migration from the DDL in §2 | `alembic upgrade head` succeeds against a clean DB; `alembic downgrade base` succeeds and is symmetric. |
| 0.3 | Master seed script (units, sheds, loom_type, loom, style, style_unit_crimp_monthly, shift_master, employee, reason_code, cost_master) | Row counts match §3 of the brief exactly (137 employees split per role/grade table, 168+24 ATM looms, 10 styles, 6 units); `register_confirmed=false` on all seeded looms; idempotent (re-running doesn't duplicate). |
| 0.4 | Demo data generator (beam_run, assignment, production_log, stop_event) per §3 of this doc | `test_demo_month_matches_vendor_mrm`, `test_demo_no_two_looms_identical`, `test_demo_loss_causes_sum_to_headline` all pass; generation is deterministic (byte-identical output across 2 runs with the same seed). |
| 0.5 | `formulas.py` with full test coverage | Every function in §4.1 has ≥3 tests (normal/zero-denominator/None-input); 100% line coverage on the module. |
| 0.6 | Reconciliation test suite wired into CI | `pytest tests/test_demo_reconciliation.py` is a required check; failing it fails the build (§6 of the brief: "Fail the build if they don't"). |
| 0.7 | `docs/V2_DDL.sql`, `docs/V2_DEMO_GENERATOR.md`, `docs/V2_RULES.md` extracted from this design doc into their own reference files once implementation starts (so each is independently linkable from the code that implements it) | Files exist, cross-linked from module docstrings. |

**Nothing in P1+ starts until 0.1–0.6 are green.**

---

## Open items requiring your answer before P0 starts

1. Confirm loom-count derivation for vendor units (§1.1) or supply real counts.
2. Confirm all ₹/revenue figures in the demo are synthetic/`ESTIMATED` placeholders — I have no real ATM revenue baseline to calibrate against (§1.2).
3. Confirm `vendor_coordinator` role's ₹ visibility scope (§1.10).
4. Confirm go-ahead to delete v1 (task 0.1) — this is irreversible once pushed; I'll do it in its own commit so it's cleanly revertible via git history if needed, but want explicit sign-off before running it given how much genuinely-working v1 code exists.
