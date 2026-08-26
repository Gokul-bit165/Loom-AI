# Loom AI — Architecture Extension Plan

This document specifies the design for future tables (Q2–Q23).
**Do not implement these yet.** This document exists so that when the time
comes, the schema is already designed and the team can add each table without
touching the existing four core tables.

---

## Core Design Contract

Every fact table in this system follows the same grain:

```
machine_id + date + shift
```

This grain matches how production reports are already collected on the shop
floor (one report per shift per machine). Every new table hangs off `Machine`
via a foreign key on `machine_id`.

---

## Future Tables

### 1. `AttendanceLog` — Q8 to Q11 (Manpower)

**Purpose:** Track operator presence per machine per shift.

```sql
CREATE TABLE attendance_logs (
    id               SERIAL PRIMARY KEY,
    date             DATE         NOT NULL,
    shift            SMALLINT     NOT NULL CHECK (shift IN (1, 2, 3)),
    machine_id       VARCHAR(20)  NOT NULL REFERENCES machines(machine_id) ON DELETE RESTRICT,
    operator_id      VARCHAR(20)  NOT NULL REFERENCES operators(operator_id) ON DELETE RESTRICT,
    hours_present    NUMERIC(4,2) NOT NULL CHECK (hours_present >= 0 AND hours_present <= 12),
    hours_absent     NUMERIC(4,2) NOT NULL CHECK (hours_absent >= 0),
    absence_reason   VARCHAR(200),
    source_type      VARCHAR(20)  NOT NULL CHECK (source_type IN ('synthetic', 'real', 'derived')),
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

**Analytics functions needed:**
- `get_manpower_utilisation(date)` → attendance %, absent count, absent reasons
- `get_chronic_absentees(period)` → operators with > N absences in period

**Indexes:** `(date, machine_id)`, `(operator_id)`

---

### 2. `Operator` — supporting entity for AttendanceLog

```sql
CREATE TABLE operators (
    operator_id    VARCHAR(20)  PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    department     VARCHAR(50)  NOT NULL,
    role           VARCHAR(50)  NOT NULL,  -- e.g. Weaver, Spinner, Supervisor
    active         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

**Note:** Operator IDs should be assigned from the real attendance register,
not invented.

---

### 3. `MaintenanceLog` — Q12 to Q14 (Maintenance)

**Purpose:** Track scheduled preventive maintenance (PM) separately from
breakdown events. Breakdowns are unplanned; PM is planned.

```sql
CREATE TABLE maintenance_logs (
    id                SERIAL PRIMARY KEY,
    date              DATE         NOT NULL,
    shift             SMALLINT     NOT NULL CHECK (shift IN (1, 2, 3)),
    machine_id        VARCHAR(20)  NOT NULL REFERENCES machines(machine_id) ON DELETE RESTRICT,
    maintenance_type  VARCHAR(50)  NOT NULL CHECK (
                          maintenance_type IN ('scheduled_pm', 'unscheduled', 'inspection', 'overhaul')
                      ),
    technician_id     VARCHAR(20)  REFERENCES operators(operator_id),
    duration_minutes  INTEGER      NOT NULL CHECK (duration_minutes > 0),
    parts_replaced    TEXT,        -- free text; structured in V3
    cost_rs           NUMERIC(12,2) CHECK (cost_rs >= 0),
    notes             TEXT,
    source_type       VARCHAR(20)  NOT NULL CHECK (source_type IN ('synthetic', 'real', 'derived')),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

**Why separate from BreakdownEvent:** Maintenance is planned downtime;
breakdown is unplanned. Q12 asks about maintenance compliance, Q13 asks about
breakdown-to-maintenance conversion rate — mixing them in one table would
corrupt both questions.

**Indexes:** `(date, machine_id)`, `(maintenance_type)`, `(date)`

---

### 4. `AirConsumptionLog` — Q15 to Q17 (Compressor / Air)

**Purpose:** Track compressed air consumption per machine per shift.

```sql
CREATE TABLE air_consumption_logs (
    id                  SERIAL PRIMARY KEY,
    date                DATE         NOT NULL,
    shift               SMALLINT     NOT NULL CHECK (shift IN (1, 2, 3)),
    machine_id          VARCHAR(20)  NOT NULL REFERENCES machines(machine_id) ON DELETE RESTRICT,
    consumption_m3      NUMERIC(10,3) NOT NULL CHECK (consumption_m3 >= 0),
    pressure_bar        NUMERIC(5,2)  CHECK (pressure_bar > 0),
    leakage_detected    BOOLEAN,
    source_type         VARCHAR(20)  NOT NULL CHECK (source_type IN ('synthetic', 'real', 'derived')),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

**Data gap note:** No air consumption report was supplied in the V1 reference
images. This table can only be populated when a real source is identified
(sensor log, manual meter reading, or DCS export). Do NOT generate synthetic
values for this table — the data shape is too speculative.

**Indexes:** `(date, machine_id)`, `(date)`

---

### 5. `QualityLog` — Q18 to Q20 (Yarn / Fabric Quality)

**Purpose:** Store per-machine quality test results. The columns below are
derived from Image 3 (Yarn Quality Report — 14/08/2026).

```sql
CREATE TABLE quality_logs (
    id                SERIAL PRIMARY KEY,
    date              DATE         NOT NULL,
    shift             SMALLINT     NOT NULL CHECK (shift IN (1, 2, 3)),
    machine_id        VARCHAR(20)  NOT NULL REFERENCES machines(machine_id) ON DELETE RESTRICT,
    yarn_count        NUMERIC(6,2) CHECK (yarn_count > 0),   -- e.g. 30s, 41s
    cone_weight_kg    NUMERIC(5,3) CHECK (cone_weight_kg > 0),
    avg_count         NUMERIC(6,2),
    avg_strength      NUMERIC(8,2),
    csp               NUMERIC(8,2),                          -- Count Strength Product
    count_cv          NUMERIC(6,2),                          -- CV% of count
    strength_cv       NUMERIC(6,2),
    u_pct             NUMERIC(6,2),                          -- Uster U%
    thin_per_km       NUMERIC(8,2),
    thick_per_km      NUMERIC(8,2),
    neps_per_km       NUMERIC(8,2),
    total_ipi         NUMERIC(8,2),                          -- thin + thick + neps
    source_type       VARCHAR(20)  NOT NULL CHECK (source_type IN ('synthetic', 'real', 'derived')),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

**Note:** Quality is tested per machine group, not per individual loom.
The V1 Spinning machines (RF, VTX, AJ) are the primary subjects of quality
reports. The `machine_id` should reference the representative machine for
the test group.

**Indexes:** `(date, machine_id)`, `(date)`, `(yarn_count)`

---

## Migration Strategy for Future Tables

When adding a new table:

1. Create a new Alembic revision:
   ```
   cd backend
   alembic revision -m "add_attendance_log"
   ```

2. Write the `upgrade()` and `downgrade()` functions by hand (do not rely on
   autogenerate for production migrations — it can miss check constraints).

3. Add the SQLAlchemy model class to `models.py`.

4. Add a `validate_*` function to `app/data/import_csv.py`.

5. Add test cases to `tests/test_db_constraints.py`.

**Nothing in the existing four tables needs to change.** The `machine_id`
foreign key is the only coupling point.

---

## Analytics Layer Extension Pattern

For each new question Qn, add one file:

```
backend/app/analytics/qN_<topic>.py
```

Each file must export exactly one public function:

```python
def get_<topic>_summary(date: datetime.date, **kwargs) -> dict:
    ...
```

The function must:
- Accept only typed parameters (no raw SQL strings from callers)
- Return a plain `dict` (not a DataFrame) — this is what the LLM prompt builder receives
- Be fully unit-testable against the test database without mocking

---

## API Extension Pattern

For each new question, add one FastAPI router:

```
backend/app/routers/qN_<topic>.py
```

Each router registers under `/api/<topic>/`:

```python
GET  /api/attendance/summary?date=2026-08-29
GET  /api/maintenance/history?machine_id=RF-11&period=month
GET  /api/quality/trend?machine_type=Vortex&days=30
```

The dashboard at `/` is a composite of all available question endpoints.
Adding a new endpoint does not affect existing ones.
