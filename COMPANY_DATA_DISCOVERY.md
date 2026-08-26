# Loom AI — Company Data Discovery & Real-Data Readiness Plan

> **Objective**: Bridge the gap between the synthetic demonstration baseline and a live factory deployment. This document defines the exact data requirements, source mappings, ownership structures, and discovery questions for mill management.

---

## 1. Field-by-Field Real-Data Readiness Matrix

Every field required by Loom AI V1 is classified below by its current availability status, expected format, validation rule, data owner, and open discovery question.

| Field Name | Target Entity | Source Report / Origin | Current Mill Availability | Expected Format | Validation Rule | Example Value | Mill Data Owner | Open Discovery Question for Pilot |
|---|---|---|---|---|---|---|---|---|
| `machine_id` | Machine / Fact Tables | Machine asset register / ERP master | **Available** | `VARCHAR(20)` | Must match registered ID | `RF-01`, `TOY-01` | Maintenance Head / Industrial Eng. | Are loom numbers standard across all mill sheds, or do sheds use internal prefix codes? |
| `unit` | Machine Master | Organization hierarchy | **Available** | `VARCHAR(50)` | Non-empty | `Unit I`, `Unit II` | General Manager | Are production standards and shift timings identical across all units? |
| `department` | Machine Master | ERP cost center | **Available** | `VARCHAR(50)` | `Weaving`, `Spinning`, `Preparatory` | `Spinning` | Plant Superintendent | Does Preparatory report output by hank/kg or shift delivery count? |
| `machine_type` | Machine Master | Equipment manufacturer specs | **Available** | `VARCHAR(50)` | Non-empty | `RingFrame`, `Toyota Airjet` | Chief Engineer | Are Toyota airjets differentiated by reed space (e.g. 190cm vs 230cm)? |
| `date` | Production / BD / Revenue | Daily production register | **Available** | `DATE (YYYY-MM-DD)` | Valid calendar date | `2026-08-29` | Shift In-Charge / Data Entry | Is the production date recorded as calendar date or production accounting day? |
| `shift` | Production / BD / Revenue | Shift logbook | **Available** | `SMALLINT` | `1`, `2`, or `3` | `1` | Shift Supervisor | What are the exact shift transition hours (e.g., 07:00-15:00, 15:00-23:00, 23:00-07:00)? |
| `target_qty` | Production Log | Production planning / standard speed | **Ambiguous** | `NUMERIC(14,2)` | $\ge 0$ | `21700.00` | Planning / Industrial Eng. | Is shift target fixed per sort speed or dynamically adjusted for hank/pick count? |
| `actual_qty` | Production Log | Counter reading / logbook | **Directly Available** | `NUMERIC(14,2)` | $\ge 0$ | `20500.00` | Shift Officer / Doff Master | Are picks/hanks read from electronic machine counters or manual log sheets? |
| `efficiency_pct` | Production Log | Calculated report | **Derived / Available** | `NUMERIC(6,2)` | $0.00 \le x \le 100.00$ | `94.47` | Shift Supervisor | Does the mill calculate efficiency on running time or total available shift time (480 min)? |
| `duration_minutes`| Breakdown Event | Electrical/mechanical downtime log | **Partially Available** | `INTEGER` | $> 0$ | `45` | Electrical / Mechanical Dept. | Are stoppages under 5 minutes logged, or only major breakdown events? |
| `reason` | Breakdown Event | Maintenance stoppage sheet | **Ambiguous** | `VARCHAR(200)` | Standard reason catalog | `Full cleaning work`, `Weft break PBM` | Maintenance Head | Is there a standardized 20-code downtime taxonomy, or free-text descriptions? |
| `fabric_style` | Revenue Log | Weaving sort allocation sheet | **Available** | `VARCHAR(100)` | Non-empty | `Liveaco Compact`, `Excel Slub` | Commercial / Merchandising | Is fabric sort tracked at individual loom level or by entire loom groups? |
| `revenue` | Revenue Log | Commercial billing / ERP | **Derived (in V1)** | `NUMERIC(14,4)` | $\ge 0$ | `29644.36` | Accounts / Costing Dept. | Does the mill track realized daily revenue per loom, or standard cost per pick/meter? |

---

## 2. Source Report Mapping

### A. Production Reports
* **Spinning (Ring Frames & Vortex)**:
  - *Status*: **Directly Available**. Physical machine serial numbers (`RF-01` to `RF-16`, `VTX-01` to `VTX-06`) are recorded with shift counter readings, spindle speeds, hank production, and conversion to kg/shift.
* **Weaving (Toyota, Tsudakoma, Sulzer)**:
  - *Status*: **Ambiguous / Group-Level**. Most mills record total shed picks and average shed efficiency in daily summary reports. Individual loom counter logs exist on paper shift sheets but are not centralized in daily ERP summaries.
  - *Pilot Action*: In Phase 1 of the pilot, Weaving will ingest physical shed aggregations; individual loom logs will be digitized via weekly batch imports.

### B. Breakdown & Stoppage Reports
* **Status**: **Partially Available / Free-Text**.
* Electrical and mechanical departments record maintenance logbooks with downtime in minutes. However, stoppage reasons often contain colloquial technician shorthands (e.g. *"PBM cut"*, *"motor trip"*, *"sort warp change"*).
* *Pilot Action*: Establish a standardized 15-reason lookup dictionary during the pilot setup phase to map raw log entries into canonical categories.

### C. Commercial Revenue & Style Reports
* **Status**: **Derived**.
* Daily factory reports record production volume (meters/picks/kg) and allocated fabric style. Commercial billing rates (₹ per meter or ₹ per kg) reside in the sales ERP (SAP / Tally / Custom ERP).
* *Pilot Action*: Ingest the active **Fabric Style Rate Master** (₹/meter or ₹/kg) monthly to compute daily realized revenue without requiring access to sensitive customer invoice databases.

---

## 3. Top 12 Discovery Questions for Plant Management

### 1. Loom-Level vs. Shed-Level Granularity
* *Question*: "Are daily counter readings logged per individual loom (e.g. Loom #1 to #60), or are daily management reports compiled as shed brand totals (e.g. Toyota Shed Total)?"
* *Impact*: Determines whether the weaving department operates on `real_grounded` individual machine IDs or shed-level aggregations during Phase 1.

### 2. Authoritative Production Source
* *Question*: "What is the official single source of truth for daily production: physical shift log sheets signed by the shift supervisor, or the ERP daily shift entry?"
* *Impact*: Establishes the authoritative ingestion source and conflict resolution rules when manual logbooks differ from ERP entries.

### 3. Shift Boundaries & Day Transition Timing
* *Question*: "What are the exact hours for Shift 1, Shift 2, and Shift 3? Does the production date roll over at midnight (00:00) or at the start of Shift 1 (e.g., 07:00 AM)?"
* *Impact*: Ensures night shifts spanning midnight (e.g., 23:00 to 07:00) are assigned to the correct production business date.

### 4. Breakdown & Downtime Recording Protocol
* *Question*: "How are machine stoppages captured: automatic loom microprocessor counter exports, or manual logbooks maintained by the jobber/fitter?"
* *Impact*: Defines the parser ingestion mechanism and determines whether micro-stoppages (< 5 mins) are aggregated into overall running efficiency.

### 5. Planned Maintenance vs. Unplanned Breakdown
* *Question*: "Are planned maintenance activities (e.g., sort changes, warp knotting, weekly full cleaning) categorized separately from unplanned mechanical/electrical breakdowns?"
* *Impact*: Enables the analytics engine to isolate preventable downtime from scheduled maintenance cycles.

### 6. Production Target Calculation Methodology
* *Question*: "How is the target quantity calculated for each machine-shift? Is it based on theoretical 100% mechanical speed $\times$ 480 minutes, or a budgeted standard efficiency (e.g., 92%)?"
* *Impact*: Prevents target variance distortions across different yarn counts and fabric constructions.

### 7. Commercial Revenue & Style Rate Definition
* *Question*: "How should daily revenue be determined: actual contracted fabric rate per meter, standard transfer price, or ex-mill selling price per kg?"
* *Impact*: Ensures financial numbers shown to executive management match internal accounting standards.

### 8. Fabric Style Master & Sort Codes
* *Question*: "Which system maintains the fabric sort code catalog, yarn blend specifications (e.g., 100% Cotton, Modal, VSF, Excel), and standard pick densities?"
* *Impact*: Sets up the foreign key relationships between production output and commercial style analytics.

### 9. Report Update Cadence & Availability
* *Question*: "At what time each morning are the previous day's shift reports finalized, verified by plant superintendents, and ready for ingestion?"
* *Impact*: Sets the automated daily ETL schedule (e.g. 08:30 AM daily).

### 10. Data Ownership & Sign-Off Hierarchy
* *Question*: "Who are the designated departmental owners responsible for validating production, maintenance, and commercial rates?"
* *Impact*: Establishes data governance and authorization contacts for data quality discrepancy resolution.

### 11. Historical Baseline Data Availability
* *Question*: "Can the mill provide 30 to 90 days of historical daily Excel reports for baseline model calibration and anomaly threshold tuning?"
* *Impact*: Calibrates standard efficiency distributions and validates seasonal variance prior to live pilot go-live.

### 12. Security & Network Deployment Boundary
* *Question*: "What are the company's deployment policies: on-premise local server within the factory LAN, or secure dedicated virtual private cloud (VPC)?"
* *Impact*: Determines database hosting infrastructure and firewall configurations.
