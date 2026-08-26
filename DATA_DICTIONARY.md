# Loom AI — Data Dictionary (V1 Production Schema)

This document provides the definitive data dictionary for all database entities, field definitions, types, constraints, and operational units in Loom AI.

---

## 1. `import_batches` (Dataset Provenance Anchor)

Tracks every ingestion run to ensure 100% traceability and visible synthetic data labelling.

| Column | Type | Nullable | Default | Description & Validation Rule |
|---|---|---|---|---|
| `id` | `INTEGER` | No | Auto-increment PK | Primary Key |
| `import_timestamp` | `TIMESTAMPTZ` | No | `NOW()` | Timestamp when batch was ingested |
| `source_file` | `VARCHAR(500)` | No | — | Name of source CSV/report |
| `source_type` | `VARCHAR(20)` | No | — | `synthetic`, `real`, or `derived` (`ck_import_batch_source_type_valid`) |
| `is_demo` | `BOOLEAN` | No | `TRUE` | Flag driving UI "DEMO / SYNTHETIC DATA" banner |
| `dataset_label` | `VARCHAR(100)` | Yes | — | Human-readable dataset identifier shown in UI |
| `notes` | `TEXT` | Yes | — | Ingestion notes / batch comments |
| `imported_by` | `VARCHAR(100)` | Yes | — | User or pipeline runner ID |
| `production_accepted` | `INTEGER` | No | 0 | Accepted production row count |
| `production_rejected` | `INTEGER` | No | 0 | Rejected production row count |
| `breakdown_accepted` | `INTEGER` | No | 0 | Accepted breakdown event count |
| `breakdown_rejected` | `INTEGER` | No | 0 | Rejected breakdown event count |
| `revenue_accepted` | `INTEGER` | No | 0 | Accepted revenue row count |
| `revenue_rejected` | `INTEGER` | No | 0 | Rejected revenue row count |

---

## 2. `machines` (Machine Master)

Anchor master table representing physical and synthetic production units.

| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `machine_id` | `VARCHAR(20)` | No | Primary Key | e.g. `TOY-01`, `RF-11`, `VTX-06`, `SUL-01` |
| `unit` | `VARCHAR(50)` | No | — | Mill section, e.g. `Unit I` |
| `department` | `VARCHAR(50)` | No | — | `Weaving`, `Spinning`, `Preparatory` |
| `machine_type` | `VARCHAR(50)` | No | — | `Toyota`, `RingFrame`, `Vortex`, `Sulzer`, `Tsudakoma` |
| `granularity` | `VARCHAR(50)` | No | `ck_machine_granularity_valid` | `real_grounded` (physical ID exists) or `synthetic_loom_number` (brand-level rollup in real mill) |
| `source_type` | `VARCHAR(20)` | No | `ck_machine_source_type_valid` | `synthetic`, `real`, or `derived` |
| `active` | `BOOLEAN` | No | `TRUE` | Machine active status |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record creation timestamp |

---

## 3. `production_logs` (Q1 Fact Table)

Grain: **One machine $\times$ One date $\times$ One shift**.

| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | PK | Primary Key |
| `date` | `DATE` | No | Indexed (`ix_production_date`) | Production shift date (`YYYY-MM-DD`) |
| `shift` | `SMALLINT` | No | `ck_production_shift_valid` | Shift number: `1`, `2`, or `3` |
| `machine_id` | `VARCHAR(20)` | No | FK `machines.machine_id` ON DELETE RESTRICT | Machine identifier |
| `target_qty` | `NUMERIC(14,2)` | No | `ck_production_target_nonneg` | Planned target output ($\ge 0$) |
| `actual_qty` | `NUMERIC(14,2)` | No | `ck_production_actual_nonneg` | Realized actual output ($\ge 0$) |
| `efficiency_pct` | `NUMERIC(6,2)` | No | `ck_production_efficiency_range` | $(Actual / Target) \times 100 \in [0, 110]$ |
| `import_batch_id` | `INTEGER` | Yes | FK `import_batches.id` ON DELETE SET NULL | Provenance batch ID |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record timestamp |

* **Unique Constraint**: `uq_production_machine_date_shift` on `(machine_id, date, shift)`.

---

## 4. `breakdown_events` (Q5 Fact Table)

Grain: **One breakdown event on one machine in one shift**. Multiple events per shift are permitted.

| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | PK | Primary Key |
| `date` | `DATE` | No | Indexed (`ix_breakdown_date`) | Event date |
| `shift` | `SMALLINT` | No | `ck_breakdown_shift_valid` | Shift number: `1`, `2`, or `3` |
| `machine_id` | `VARCHAR(20)` | No | FK `machines.machine_id` ON DELETE RESTRICT | Machine identifier |
| `reason` | `VARCHAR(200)` | No | Indexed (`ix_breakdown_reason`) | Root stoppage reason (e.g. `Full cleaning work`, `Weft break PBM`, `Sort change work`) |
| `duration_minutes`| `INTEGER` | No | `ck_breakdown_duration_positive` | Downtime in minutes ($> 0$) |
| `source_type` | `VARCHAR(20)` | No | `ck_breakdown_source_type_valid` | `synthetic` \| `real` \| `derived` |
| `import_batch_id` | `INTEGER` | Yes | FK `import_batches.id` ON DELETE SET NULL | Provenance batch ID |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record timestamp |

---

## 5. `revenue_logs` (Q21 Fact Table)

Grain: **One fabric-style commercial contribution from one weaving loom on one shift**.

| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | PK | Primary Key |
| `date` | `DATE` | No | Indexed (`ix_revenue_date`) | Production date |
| `shift` | `SMALLINT` | No | `ck_revenue_shift_valid` | Shift number: `1`, `2`, or `3` |
| `machine_id` | `VARCHAR(20)` | No | FK `machines.machine_id` ON DELETE RESTRICT | Weaving loom ID |
| `fabric_style` | `VARCHAR(100)` | No | Indexed (`ix_revenue_fabric_style`) | Commercial style (e.g. `Excel Slub`, `Liveaco Compact`, `VSF Export`) |
| `revenue` | `NUMERIC(14,4)`| No | `ck_revenue_nonneg` | Realized revenue in Indian Rupees ($\ge 0$) |
| `source_type` | `VARCHAR(20)` | No | `ck_revenue_source_type_valid` | Defaults to `derived` |
| `import_batch_id` | `INTEGER` | Yes | FK `import_batches.id` ON DELETE SET NULL | Provenance batch ID |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record timestamp |
