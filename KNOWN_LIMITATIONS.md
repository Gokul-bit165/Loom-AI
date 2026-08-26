# Loom AI — Known Limitations & Operational Boundaries (V1)

> **Integrity Principle**: A trustworthy limitation is better than a fabricated feature. This document transparently lists all known V1 boundaries and data constraints.

---

## 1. Business Scope Limitations (V1)

* **Supported Questions**:
  - `Q1`: Production vs Target variance, shift output, machine efficiency.
  - `Q5`: Breakdown event counts, downtime minutes, stoppage reason distribution.
  - `Q21`: Realized commercial revenue and fabric style contribution shares.
* **Deferred to V2 (Questions Q2–Q4, Q6–Q20, Q22–Q23)**:
  - Worker attendance, shift absenteeism, operator-to-loom assignments.
  - Power / specific energy consumption (SEC in kWh/kg).
  - Compressed air consumption ($m^3/min$), compressor leakage profiles.
  - Quality lab testing (Uster count CV%, CSP, imperfections/km, yarn hairiness).
  - Raw material procurement and lint bale inventory.

---

## 2. Revenue Loss Disclaimer

* **`revenue_loss_available = False`**:
  - Factory daily production logs record actual production quantity and realized commercial revenue per style.
  - However, computing an exact monetary *loss* requires committed customer price books, contract cancellation penalties, variable power/yarn cost margins per loom, and unfulfilled order allocation schedules.
  - Loom AI strictly refuses to invent, simulate, or hallucinate a financial revenue loss number without an audited commercial source.

---

## 3. Granularity & Synthetic Loom Numbers

* **Spinning & Preparatory**:
  - Machines such as `RF-01` through `RF-16` and `VTX-01` through `VTX-06` have physical individual serial numbers (`granularity = real_grounded`).
* **Weaving Looms**:
  - Real daily weaving reports in typical mills aggregate totals by loom brand/shed (e.g. "Toyota Airjet Shed").
  - In Loom AI V1, individual loom numbers (`TOY-01` through `TOY-10`, `SUL-01` through `SUL-05`, `TSU-01` through `TSU-10`) are generated with `granularity = synthetic_loom_number`.
  - The UI badges every synthetic loom with a `synth` label.

---

## 4. Ingestion & Historical Corrections

* **Batch ETL**:
  - Ingestion operates on whole CSV/report batches. Real-time streaming OPC-UA / MQTT broker ingestion is not enabled in V1.
* **Duplicate Detection**:
  - The unique constraint `uq_production_machine_date_shift` strictly prevents two production records for the same machine-shift. If a daily report contains an amended number, the operator must re-import with an explicit replacement batch.

---

## 5. AI Assistant Operational Scope

* **No LLM Mathematics**:
  - The Claude LLM assistant is purely an explanation and recommendation synthesis layer. It is prohibited from calculating or modifying numbers.
* **Fallback Behavior**:
  - If the Anthropic API is unreachable or rate-limited, the UI seamlessly displays the underlying deterministic numbers with `ai_status: "unavailable"` and fallback findings without crashing.
