# Loom AI — Deterministic Analytics Engine Specifications

> **Core Axiom**: No business KPI or metric may ever be calculated by an LLM.
> All numbers, variances, rankings, percentages, and performance classifications
> originate from deterministic SQL / Python / pandas functions in `app/analytics/`.

---

## 1. Overview & Architectural Role

```
PostgreSQL Database
       ↓
Deterministic Analytics Layer (app/analytics/)
  ├── production.py (Q1)
  ├── breakdown.py (Q5)
  ├── revenue.py (Q21)
  └── common.py (Status classification, safe math, date ranges)
       ↓
Computed Metric Payloads + Evidence Identifiers
       ↓
[Phase 4: API Layer] / [Phase 3: LLM Narration (Prompt Template Context)]
```

Every analytics function:
1. Is standalone and executable without FastAPI, Next.js, or external APIs.
2. Attaches **Evidence IDs** (`production_log_ids`, `breakdown_event_ids`, `revenue_log_ids`) to enable audit trails back to individual source rows.
3. Attaches **Dataset Provenance** (`is_demo: true/false`, `dataset_label`) to prevent misrepresenting synthetic data.

---

## 2. Q1 — Production vs Target (`get_production_variance`)

### Mathematical Formulas

* **Total Target Production ($T$)**:
  $$T = \sum \text{target\_qty}$$

* **Total Actual Production ($A$)**:
  $$A = \sum \text{actual\_qty}$$

* **Variance Quantity ($\Delta Q$)**:
  $$\Delta Q = A - T$$
  *(Negative indicates shortfall; positive indicates surplus)*

* **Variance Percentage ($\Delta \%$)**:
  $$\Delta \% = \begin{cases} \frac{A - T}{T} \times 100 & \text{if } T > 0 \\ 0.0 & \text{if } T = 0 \end{cases}$$

* **Average Efficiency ($E$)**:
  $$E = \begin{cases} \frac{A}{T} \times 100 & \text{if } T > 0 \\ 0.0 & \text{if } T = 0 \end{cases}$$

* **Day-over-Day Production Change ($\Delta_{\text{DoD}} \%$)**:
  $$\Delta_{\text{DoD}} \% = \begin{cases} \frac{A_{\text{today}} - A_{\text{yesterday}}}{A_{\text{yesterday}}} \times 100 & \text{if } A_{\text{yesterday}} > 0 \\ \text{null} & \text{if } A_{\text{yesterday}} = 0 \end{cases}$$

### Deterministic Performance Classification Rules

Performance status for machines and shifts is classified strictly by efficiency percentage ($E$):

| Status | Rule | Operational Meaning |
|---|---|---|
| `OPTIMAL` | $E \ge 95.0\%$ | Meeting or exceeding high-performance standard |
| `ACCEPTABLE` | $90.0\% \le E < 95.0\%$ | Operating within standard variance tolerance |
| `UNDERPERFORMING` | $80.0\% \le E < 90.0\%$ | Shortfall requiring supervisor attention |
| `CRITICAL` | $E < 80.0\%$ | Significant deviation / chronic underperformance |

---

## 3. Q5 — Breakdown & Downtime (`get_breakdown_ranking`)

### Period Resolution

* **`period = 'today'`**: Single target date ($D_{\text{target}}$).
* **`period = 'month'`**: From the 1st of the month ($D_{\text{start}} = \text{year}-\text{month}-01$) to $D_{\text{target}}$.

### Mathematical Formulas

* **Total Downtime Minutes ($D_{\text{total}}$)**:
  $$D_{\text{total}} = \sum \text{duration\_minutes}$$

* **Total Breakdown Events ($N_{\text{total}}$)**:
  $$N_{\text{total}} = \text{Count of breakdown event records in period}$$

* **Machine Downtime Share ($\% D_m$)**:
  $$\% D_m = \frac{\sum_{i \in m} \text{duration\_minutes}_i}{D_{\text{total}}} \times 100$$

* **Average Event Duration ($\overline{d}_m$)**:
  $$\overline{d}_m = \frac{\sum_{i \in m} \text{duration\_minutes}_i}{N_m}$$

* **Highest / Lowest Downtime Machine**:
  - `highest_downtime_machine`: Machine with $\max(D_m)$
  - `lowest_downtime_machine`: Machine with $\min(D_m)$ among active breakdown logs.

* **Recurring Reasons**:
  Top 3 reasons sorted by frequency of occurrences ($N_{\text{reason}}$) across all machines in period.

---

## 4. Q21 — Revenue & Loss (`get_revenue_summary`)

### Mathematical Formulas

* **Today's Revenue ($R_{\text{today}}$)**:
  $$R_{\text{today}} = \sum_{\text{date} = D_{\text{target}}} \text{revenue}$$

* **Month-to-Date Revenue ($R_{\text{MTD}}$)**:
  $$R_{\text{MTD}} = \sum_{\text{date} \ge D_{\text{start}}}^{\text{date} \le D_{\text{target}}} \text{revenue}$$

* **Previous Day Revenue ($R_{\text{yesterday}}$)**:
  $$R_{\text{yesterday}} = \sum_{\text{date} = D_{\text{target}} - 1} \text{revenue}$$

* **Day-over-Day Revenue Change ($\Delta R_{\text{DoD}} \%$)**:
  $$\Delta R_{\text{DoD}} \% = \begin{cases} \frac{R_{\text{today}} - R_{\text{yesterday}}}{R_{\text{yesterday}}} \times 100 & \text{if } R_{\text{yesterday}} > 0 \\ \text{null} & \text{if } R_{\text{yesterday}} = 0 \end{cases}$$

* **Machine Revenue Share ($\% R_m$)**:
  $$\% R_m = \frac{R_m}{R_{\text{today}}} \times 100$$

* **Style Revenue Share ($\% R_{\text{style}}$)**:
  $$\% R_{\text{style}} = \frac{R_{\text{style}}}{R_{\text{today}}} \times 100$$

### Revenue Loss Policy

* `revenue_loss_available = False`
* **Deterministic Rationale**:
  Calculating a real financial revenue loss requires standard contracted price books, committed customer order schedules, fixed-versus-variable cost margins per loom, and cancellation penalty clauses. The raw factory daily production logs contain actual production quantity and realized style revenue, but do not capture unfulfilled order allocations or profit margins.
  
  **Rule**: Loom AI will never invent, simulate, or hallucinate a monetary loss number without an audited commercial source.

---

## 5. Evidence & Provenance Contract

Every JSON response returned by the analytics engine contains:
1. `evidence`: Dictionary with list of underlying database Primary Keys (`production_log_ids`, `breakdown_event_ids`, `revenue_log_ids`).
2. `data_quality`:
   ```json
   {
     "records_analyzed": 180,
     "is_demo": true,
     "dataset_label": "Synthetic Grounded Factory V1"
   }
   ```
3. Per-machine `granularity` badge (`real_grounded` vs `synthetic_loom_number`).
