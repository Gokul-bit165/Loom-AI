# Loom AI — Data Dictionary (Enterprise Schema)

This document provides the definitive data dictionary for all database entities, field definitions, types, constraints, and operational units in Loom AI.

---

## 1. Master Data Tables

### `machines` (Loom & Machine Master)
Anchor master table representing physical and synthetic production units.

| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `machine_id` | `VARCHAR(20)` | No | Primary Key | e.g. `TOY-01`, `RF-11`, `VTX-06`, `SUL-01` |
| `loom_number` | `VARCHAR(50)` | Yes | — | Plant floor loom identifier (e.g. `L08`, `L12`) |
| `unit` | `VARCHAR(50)` | No | — | Mill section, e.g. `Unit I` |
| `department` | `VARCHAR(50)` | No | — | `Weaving`, `Spinning`, `Preparatory` |
| `machine_type` | `VARCHAR(50)` | No | — | `Toyota`, `RingFrame`, `Vortex`, `Sulzer`, `Tsudakoma` |
| `machine_model` | `VARCHAR(100)` | Yes | — | e.g. `JAT810`, `ZAX001neo` |
| `manufacturer` | `VARCHAR(100)` | Yes | — | e.g. `Toyota Industries`, `Tsudakoma` |
| `installation_date` | `DATE` | Yes | — | Commissioning date |
| `status` | `VARCHAR(30)` | No | Default `'ACTIVE'` | `'ACTIVE'`, `'MAINTENANCE'`, `'DECOMMISSIONED'` |
| `granularity` | `VARCHAR(50)` | No | `ck_machine_granularity_valid` | `real_grounded` \| `synthetic_loom_number` |
| `source_type` | `VARCHAR(20)` | No | `ck_machine_source_type_valid` | `synthetic`, `real`, or `derived` |
| `active` | `BOOLEAN` | No | `TRUE` | Machine active status |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record creation timestamp |

### `shift_master` (Shift Definition)
| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `shift_id` | `VARCHAR(10)` | No | Primary Key | `S1`, `S2`, `S3` |
| `shift_name` | `VARCHAR(50)` | No | — | e.g. `Morning (06:00-14:00)` |
| `start_time` | `TIME` | No | — | Shift start time |
| `end_time` | `TIME` | No | — | Shift end time |

### `fabric_master` (Fabric Catalog)
| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `fabric_style_id` | `VARCHAR(30)` | No | Primary Key | e.g. `STYLE-COTTON-40S`, `EXCEL-SLUB` |
| `fabric_style_name` | `VARCHAR(100)` | No | — | Commercial style name |
| `fabric_type` | `VARCHAR(100)` | Yes | — | e.g. `Plain Weave`, `Twill`, `Satin` |
| `yarn_count` | `VARCHAR(50)` | Yes | — | e.g. `40s Ne`, `60s Compact` |
| `width_cm` | `NUMERIC(10,2)` | Yes | — | Finished reed width in cm |
| `gsm` | `NUMERIC(10,2)` | Yes | — | Grams per square meter |
| `standard_rate_per_kg` | `NUMERIC(12,2)` | Yes | — | Standard rate in INR/kg |
| `standard_rate_per_meter` | `NUMERIC(12,2)` | Yes | — | Standard rate in INR/meter |

### `customer_master` (Customer Directory)
| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `customer_id` | `VARCHAR(30)` | No | Primary Key | e.g. `CUST-001` |
| `customer_name` | `VARCHAR(150)` | No | — | Customer company name |
| `customer_type` | `VARCHAR(50)` | Yes | — | `DOMESTIC`, `EXPORT`, `INTERNAL` |

### `order_master` (Sales & Production Orders)
| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `order_id` | `VARCHAR(30)` | No | Primary Key | Order number |
| `customer_id` | `VARCHAR(30)` | Yes | FK `customer_master.customer_id` | Customer FK |
| `fabric_style_id` | `VARCHAR(30)` | Yes | FK `fabric_master.fabric_style_id` | Style FK |
| `order_date` | `DATE` | No | — | Order placement date |
| `required_date` | `DATE` | Yes | — | Delivery requirement date |
| `order_quantity_kg` | `NUMERIC(14,2)` | Yes | — | Ordered weight in kg |
| `order_quantity_meter` | `NUMERIC(14,2)` | Yes | — | Ordered length in meters |
| `selling_rate_per_kg` | `NUMERIC(12,2)` | No | — | Contracted rate (INR/kg) |
| `selling_rate_per_meter` | `NUMERIC(12,2)` | Yes | — | Contracted rate (INR/meter) |
| `order_status` | `VARCHAR(30)` | No | Default `'IN_PROGRESS'` | `'PENDING'`, `'IN_PROGRESS'`, `'COMPLETED'` |

---

## 2. Ingestion & Audit Tables

### `import_batches` (Dataset Provenance Anchor)
| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | Auto-increment PK | Primary Key |
| `import_timestamp` | `TIMESTAMPTZ` | No | `NOW()` | Timestamp when batch was ingested |
| `source_file` | `VARCHAR(500)` | No | — | Name of source CSV/report |
| `source_type` | `VARCHAR(20)` | No | — | `synthetic`, `real`, or `derived` |
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

## 3. Operational Fact Tables

### `production_logs` (Production & Efficiency Fact Table)
Grain: **One machine $\times$ One date $\times$ One shift**.

| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | PK | Primary Key |
| `date` | `DATE` | No | Indexed (`ix_production_date`) | Production shift date |
| `shift` | `SMALLINT` | No | `ck_production_shift_valid` | Shift number: `1`, `2`, or `3` |
| `machine_id` | `VARCHAR(20)` | No | FK `machines.machine_id` | Machine identifier |
| `fabric_style_id` | `VARCHAR(30)` | Yes | FK `fabric_master.fabric_style_id` | Style running on loom |
| `order_id` | `VARCHAR(30)` | Yes | FK `order_master.order_id` | Order being fulfilled |
| `target_qty` | `NUMERIC(14,2)` | No | `ck_production_target_nonneg` | Target output ($\ge 0$) |
| `actual_qty` | `NUMERIC(14,2)` | No | `ck_production_actual_nonneg` | Realized output ($\ge 0$) |
| `efficiency_pct` | `NUMERIC(6,2)` | No | `ck_production_efficiency_range` | $(Actual / Target) \times 100 \in [0, 110]$ |
| `target_production_kg` | `NUMERIC(14,2)` | Yes | — | Target weight in kg |
| `actual_production_kg` | `NUMERIC(14,2)` | Yes | — | Actual weight in kg |
| `running_hours` | `NUMERIC(8,2)` | No | Default `8.0` | Net operational hours |
| `available_hours` | `NUMERIC(8,2)` | No | Default `8.0` | Total shift duration |
| `machine_speed_rpm` | `NUMERIC(10,2)` | Yes | — | Average machine RPM |
| `total_picks` | `BIGINT` | Yes | — | Total pick count |
| `kilo_pick` | `NUMERIC(12,4)` | Yes | — | Total picks / 1000 |
| `warp_break_count` | `INTEGER` | No | Default `0` | Warp stoppage incidents |
| `weft_break_count` | `INTEGER` | No | Default `0` | Weft stoppage incidents |
| `data_source` | `VARCHAR(30)` | No | Default `'MACHINE'` | `'MACHINE'`, `'OPERATOR'`, `'ERP'`, `'CALCULATED'` |
| `import_batch_id` | `INTEGER` | Yes | FK `import_batches.id` | Provenance batch ID |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record timestamp |

### `breakdown_events` (Downtime & Stoppage Fact Table)
Grain: **One breakdown event on one machine in one shift**.

| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | PK | Primary Key |
| `date` | `DATE` | No | Indexed (`ix_breakdown_date`) | Event date |
| `shift` | `SMALLINT` | No | `ck_breakdown_shift_valid` | Shift number: `1`, `2`, or `3` |
| `machine_id` | `VARCHAR(20)` | No | FK `machines.machine_id` | Machine identifier |
| `production_id` | `INTEGER` | Yes | FK `production_logs.id` | Associated shift production log |
| `start_time` | `TIMESTAMPTZ` | Yes | — | Stoppage start timestamp |
| `end_time` | `TIMESTAMPTZ` | Yes | — | Stoppage resolution timestamp |
| `reason` | `VARCHAR(200)` | No | Indexed (`ix_breakdown_reason`) | Root stoppage reason |
| `breakdown_reason_code`| `VARCHAR(30)`| Yes | — | Categorical reason code |
| `breakdown_category` | `VARCHAR(50)` | Yes | — | `MECHANICAL`, `ELECTRICAL`, `WARP_STOP`, `WEFT_STOP` |
| `duration_minutes`| `INTEGER` | No | `ck_breakdown_duration_positive` | Downtime in minutes ($> 0$) |
| `production_loss_kg` | `NUMERIC(14,2)`| Yes | — | Estimated or measured production loss |
| `maintenance_action` | `VARCHAR(255)` | Yes | — | Corrective action taken |
| `root_cause` | `VARCHAR(255)` | Yes | — | Technical root cause |
| `data_source` | `VARCHAR(30)` | No | Default `'OPERATOR'` | `'OPERATOR'`, `'MACHINE'`, `'CALCULATED'` |
| `import_batch_id` | `INTEGER` | Yes | FK `import_batches.id` | Provenance batch ID |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record timestamp |

### `revenue_logs` (Commercial Fact Table)
Grain: **One fabric-style commercial contribution from one weaving loom on one shift**.

| Column | Type | Nullable | Constraints | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | PK | Primary Key |
| `date` | `DATE` | No | Indexed (`ix_revenue_date`) | Production date |
| `shift` | `SMALLINT` | No | `ck_revenue_shift_valid` | Shift number: `1`, `2`, or `3` |
| `machine_id` | `VARCHAR(20)` | No | FK `machines.machine_id` | Weaving loom ID |
| `fabric_style` | `VARCHAR(100)` | No | Indexed (`ix_revenue_fabric_style`) | Commercial style |
| `revenue` | `NUMERIC(14,4)`| No | `ck_revenue_nonneg` | Realized revenue in INR ($\ge 0$) |
| `source_type` | `VARCHAR(20)` | No | `ck_revenue_source_type_valid` | Defaults to `derived` |
| `import_batch_id` | `INTEGER` | Yes | FK `import_batches.id` | Provenance batch ID |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record timestamp |

---

## 4. Extended Quality, Energy & IoT Tables

### `quality_records`
| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `BIGINT PK` | No | Auto-increment PK |
| `production_id` | `INTEGER FK` | Yes | Links to `production_logs.id` |
| `machine_id` | `VARCHAR(20) FK`| No | Machine ID |
| `production_date` | `DATE` | No | Quality audit date |
| `fabric_style_id` | `VARCHAR(30) FK`| Yes | Fabric style ID |
| `defect_count` | `INTEGER` | No | Total defects observed |
| `warp_defect_count`| `INTEGER` | No | Warp yarn defects |
| `weft_defect_count` | `INTEGER` | No | Weft yarn defects |
| `rejected_quantity_kg`| `NUMERIC(14,2)`| No | Rejected fabric weight in kg |
| `quality_grade` | `VARCHAR(30)` | No | `A_GRADE`, `B_GRADE`, `REJECT` |
| `data_source` | `VARCHAR(30)` | No | `'OPERATOR'` |

### `loom_energy`
| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `BIGINT PK` | No | Auto-increment PK |
| `machine_id` | `VARCHAR(20) FK`| No | Machine ID |
| `energy_date` | `DATE` | No | Reading date |
| `shift` | `SMALLINT` | No | Shift (1, 2, 3) |
| `electricity_kwh` | `NUMERIC(14,3)` | No | Active energy consumed (kWh) |
| `compressed_air_consumption`| `NUMERIC(14,3)`| Yes | Air volume ($Nm^3$) |
| `air_pressure_bar` | `NUMERIC(10,3)` | Yes | Operating pneumatic pressure |
| `data_source` | `VARCHAR(30)` | No | `'MACHINE'` |

### `maintenance_records`
| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `BIGINT PK` | No | Auto-increment PK |
| `machine_id` | `VARCHAR(20) FK`| No | Machine ID |
| `maintenance_date` | `DATE` | No | Intervention date |
| `maintenance_type` | `VARCHAR(50)` | No | `PREVENTATIVE`, `BREAKDOWN`, `OVERHAUL` |
| `downtime_minutes` | `NUMERIC(10,2)` | Yes | Maintenance stoppage duration |
| `maintenance_cost` | `NUMERIC(14,2)` | Yes | Spare parts and labor cost (INR) |
| `technician` | `VARCHAR(100)` | Yes | Lead technician name |

### `machine_sensor_data` (IoT High-Frequency Telemetry)
| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `BIGINT PK` | No | Auto-increment PK |
| `machine_id` | `VARCHAR(20) FK`| No | Machine ID |
| `recorded_at` | `TIMESTAMPTZ` | No | Timestamp of telemetry tick |
| `machine_speed_rpm` | `NUMERIC(10,2)`| Yes | Real-time RPM |
| `air_pressure_bar` | `NUMERIC(10,3)`| Yes | Air pressure reading |
| `temperature_celsius` | `NUMERIC(10,2)`| Yes | Bearing / motor temperature |
| `vibration_level` | `NUMERIC(10,3)`| Yes | Peak vibration amplitude |
| `running_status` | `VARCHAR(30)` | No | `RUNNING`, `STOPPED`, `WARP_BREAK`, `WEFT_BREAK` |
| `alarm_code` | `VARCHAR(50)` | Yes | PLC alarm / diagnostic code |
| `data_source` | `VARCHAR(30)` | No | `'MACHINE'` |
