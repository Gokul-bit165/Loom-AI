# Loom AI — System Architecture & Data Dependency Map

> **Core Objective: TRUST & INDUSTRIAL TRACEABILITY**  
> An internal decision-support and reporting system for plant managers, technical directors, and production superintendents in large-scale textile manufacturing.  
> **Key Axiom**: Every business number must be 100% traceable to source factory logs. The AI layer is strictly an explanation and recommendation synthesis layer that NEVER computes or invents metrics.

---

## 1. System Architecture

```text
[CSV / PLC Telemetry / ERP Orders]
             ↓
[app/ingestion/]  (BaseParser, CSVParser, IngestionPipeline)
             ↓
[app/models/]     (Pydantic validated immutable domain records)
             ↓
[app/validation/] (ProductionValidator, BreakdownValidator, RevenueValidator, MachineValidator)
             ↓
[app/repositories/] (PostgreSQL transactions + DB check constraints)
             ↓
[PostgreSQL Database] (Master Data, Operational Logs, Quality, Energy, Sensor Data, Import Batches)
             ↓
[app/analytics/]  (Deterministic Python/pandas engine for Q1, Q5, Q21 & KPI derivation)
             ↓
[app/services/]   (ProductionService, BreakdownService, RevenueService, AskService)
             ↓
[app/routers/]    (FastAPI endpoints with structured error envelopes)
             ↓
┌───────────────────────────────────────┴───────────────────────────────────────┐
│                                                                               │
▼                                                                               ▼
[Next.js Management Frontend]                                       [app/assistant/] (AI Explanation)
  ├── /             (Control Center & Attention Section)              ├── Intent classification (Q1, Q5, Q21)
  ├── /production   (Production vs Target — Q1)                       ├── Claude LLM (Zero temperature)
  ├── /breakdown    (Breakdown & Downtime Pareto — Q5)                └── Conservative recommendations
  ├── /revenue      (Revenue & Style Analysis — Q21)
  └── /ask          (AI Assistant Q&A + Evidence Drawer)
```

---

## 2. Complete Data Dependency Map

```text
                    ┌─────────────────┐
                    │   LOOM MASTER   │
                    │ Loom ID         │
                    │ Machine Model   │
                    │ Loom Type       │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │    PRODUCTION   │
                    │ Target KG       │
                    │ Actual KG       │
                    │ Meters          │
                    │ Efficiency      │
                    │ Kilo Pick       │
                    │ Warp Breaks     │
                    │ Weft Breaks     │
                    └───────┬─────────┘
                            │
               ┌────────────┼─────────────┐
               ↓            ↓             ↓
        ┌────────────┐ ┌───────────┐ ┌─────────────┐
        │ BREAKDOWN  │ │  QUALITY  │ │    ORDER    │
        │ Start      │ │ Defects   │ │ Order ID    │
        │ End        │ │ Warp      │ │ Customer    │
        │ Reason     │ │ Weft      │ │ Rate        │
        └─────┬──────┘ └───────────┘ └──────┬──────┘
              │                             │
              ↓                             ↓
        ┌──────────────┐              ┌──────────────┐
        │ DOWNTIME     │              │   REVENUE    │
        │ Duration     │              │ Production   │
        │ Frequency    │              │ × Rate       │
        │ Loss         │              │              │
        └──────┬───────┘              └──────┬───────┘
               │                             │
               └──────────────┬──────────────┘
                              ↓
                    ┌─────────────────────┐
                    │   ANALYTICS / KPI   │
                    │ Target variance     │
                    │ Yesterday compare   │
                    │ Loom ranking        │
                    │ Fabric ranking      │
                    │ Revenue ranking     │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │       ML / AI       │
                    │ Breakdown prediction│
                    │ Production forecast │
                    │ Efficiency forecast │
                    │ Recommendations     │
                    └─────────────────────┘
```

---

## 3. Data Classification: Source vs Derived vs Predictive

### 1. Independent / Source Data (Plant Floor Truth)
* **Master Entities**: `loom_id`, `shift_id`, `fabric_style_id`, `customer_id`, `order_id`
* **Direct Measurements**: `actual_meters`, `actual_kg`, `machine_speed_rpm`, `kilo_pick`, `warp_break_count`, `weft_break_count`
* **Stoppages**: `start_time`, `end_time`, `reason`, `breakdown_category`
* **Commercial Rates**: `selling_rate_per_kg`, `order_quantity_kg`

### 2. Dependent / Derived Data (Deterministic Math)
* **Production Variance**: $\text{Actual Quantity} - \text{Target Quantity}$
* **Achievement %**: $(\text{Actual Quantity} / \text{Target Quantity}) \times 100$
* **Downtime Duration**: $\text{End Time} - \text{Start Time}$
* **Average Breakdown Duration**: $\text{Total Downtime Minutes} / \text{Event Count}$
* **Production Loss**: $\text{Expected Rate} \times \text{Downtime Duration}$
* **Shift Revenue**: $\text{Actual Production KG} \times \text{Selling Rate per KG}$
* **Day-over-Day Variance**: $\frac{\text{Today Output} - \text{Yesterday Output}}{\text{Yesterday Output}} \times 100$
* **Specific Energy Consumption**: $\text{Electricity kWh} / \text{Production KG}$

### 3. ML-Generated Data (Predictive Layer)
* **Breakdown Risk**: $P(\text{Breakdown within 24h} \mid \text{Speed, Air Pressure, Warp/Weft Breaks, MTBF})$
* **Shift Production Forecast**: $\hat{Y}_{\text{kg}} = f(X_{\text{features}})$
* **Efficiency Trajectory**: $\hat{E}_{\%} = f(X_{\text{features}})$
* **Prescriptive Actions**: AI-synthesized root-cause corrective maintenance plans.

---

## 4. Analytical Progression: 4 Questions

$$\begin{array}{rll}
\text{1. What happened?} & \longrightarrow & \textbf{Descriptive BI} \text{ (Target vs Actual, Downtime Pareto, Revenue by Style)} \\
\text{2. Why did it happen?} & \longrightarrow & \textbf{Diagnostic Analytics} \text{ (Weft break spikes, mechanical root causes, chronic underperformers)} \\
\text{3. What will happen?} & \longrightarrow & \textbf{Predictive ML} \text{ (24h breakdown forecast, efficiency risk models)} \\
\text{4. What should we do?} & \longrightarrow & \textbf{Prescriptive AI} \text{ (Zero-temperature synthesis with verified evidence traces)}
\end{array}$$
