# Loom AI — Known Limitations & Operational Boundaries (V1)

> **Integrity Principle**: A trustworthy limitation is better than a fabricated feature. This document transparently lists all known V1 boundaries and data constraints.

---

## 1. Business Scope & Core Analytics (V1)

* **Actively Supported Business Questions**:
  - `Q1`: Production vs Target variance, shift output, machine efficiency, trailing averages, 14-day production trajectory, and estimated production loss from downtime.
  - `Q5`: Breakdown event counts, downtime minutes, stoppage reason Pareto distribution, shift downtime ranking, and chronic downtime patterns.
  - `Q21`: Realized commercial revenue, fabric style contributions, and downtime-based opportunity loss estimations.
  - `Recommendations`: Deterministic, evidence-grounded remediation recommendations.
* **Schema Ready / Deferred to V2 UI & Workflows**:
  - `quality_records`, `loom_energy`, `maintenance_records`, `machine_sensor_data`, `fabric_master`, `order_master`, `customer_master`, and `shift_master` tables exist in PostgreSQL schema (Alembic migration `0003`).
  - Dedicated dashboard workspaces for maintenance scheduling, compressed-air energy audits, and yarn defect Pareto analysis will be expanded in future phase iterations.

---

## 2. Revenue Loss Estimation Methodology

* **`is_estimated: True` vs Contracted Penalties**:
  - Factory daily production logs record actual production quantity and realized commercial revenue per style.
  - Exact deterministic contracted financial penalties require committed customer price books, delivery delay clauses, and specific loom margin profiles.
  - Loom AI computes an **Estimated Revenue Opportunity Loss** based on realized hourly revenue run-rates (${\text{shift revenue}} / 8\text{h}$) multiplied by breakdown downtime hours.
  - This figure is explicitly tagged with `is_estimated: True` and full methodology disclosure to preserve operational trust.

---

## 3. Granularity & Synthetic Loom Numbers

* **Spinning & Preparatory**:
  - Machines such as `RF-01` through `RF-16` and `VTX-01` through `VTX-06` have physical individual serial numbers (`granularity = real_grounded`).
* **Weaving Looms**:
  - Real daily weaving reports in typical mills aggregate totals by loom brand/shed (e.g. "Toyota Airjet Shed").
  - In Loom AI V1, individual loom numbers (`TOY-01` through `TOY-10`, `SUL-01` through `SUL-05`, `TSU-01` through `TSU-10`) are generated with `granularity = synthetic_loom_number`.
  - The UI badges every synthetic loom with a `synth` label and provenance banner.

---

## 4. Ingestion & Historical Corrections

* **Batch ETL**:
  - Ingestion operates on whole CSV/report batches. Real-time streaming OPC-UA / MQTT broker ingestion is modeled via `machine_sensor_data` but connector is deferred to future hardware integration.
* **Duplicate Detection**:
  - The unique constraint `uq_production_machine_date_shift` strictly prevents two production records for the same machine-shift. If a daily report contains an amended number, the operator re-imports with an explicit replacement batch.

---

## 5. AI Assistant Operational Scope

* **No LLM Mathematics**:
  - The Claude LLM assistant is purely an explanation and recommendation synthesis layer. It is strictly prohibited from calculating or modifying numbers.
* **Fallback Behavior**:
  - If the Anthropic API is unreachable or rate-limited, the UI seamlessly displays the underlying deterministic numbers with `ai_status: "unavailable"` and deterministic fallback findings without crashing.
