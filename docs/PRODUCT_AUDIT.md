# LOOM AI — INDUSTRIAL WEAVING INTELLIGENCE PLATFORM
## Product & Codebase Comprehensive Audit (PRODUCT_AUDIT.md)

---

### Executive Summary

LOOM AI is designed to serve as an **Industrial Weaving Operations Intelligence Platform** for real textile mills (e.g. Ashok Textile Mills — 192 Looms). The platform's mission is to eliminate 1–2 hours of daily manual spreadsheet/ERP comparison and replace it with automated **Exception Detection, Root-Cause Analysis, Financial Impact Quantification, Evidence-Backed Recommendations, Predictive Risk Scoring, and Closed-Loop Action Verification**.

---

### 1. Current State Inventory & Technical Audit

| Area / Module | Current Implementation | Status / Issues Identified | Action Required |
|---|---|---|---|
| **Data Layer (DB/SQLite)** | SQLite database (`loom_ai_v2.db`) with 192 active looms, shifts, logs, stop events. | SQLite doesn't support PostgreSQL `func.extract("epoch", ...)` used in several query routers, causing `None` returns or errors. | Standardize all duration math in Python/SQL to guarantee cross-DB robustness. |
| **Command Center** | `CommandCenterView.tsx` + `command_center.py` router | High quality 30s verdict foundation exists, but lacks unified multi-agent views and Owner vs Operations toggle. | Upgrade to full 5-layer Command Center with Owner/Operations modes, 4 core KPIs, dominant issue, top 3 actions, closed-loop before/after verification. |
| **Breakdown Intelligence** | `BreakdownBoardView.tsx` + `breakdown.py` | **Major Bug**: undefined downtime minutes, negative minutes, missing total stoppage fields in schema response. | Fix stoppage duration calculations, enrich schema with proper totals, and provide distinct duration vs frequency views. |
| **Prediction Center (ML)** | `PredictionCenterView.tsx` + `predictions.py` | **Major Bug**: Field key mismatch (`predictions` in frontend vs `loom_predictions` in backend) caused 0 prediction rows to render despite valid model metrics. | Fix API response payload, add honest sufficiency gates (`<15 days` records), and attach strict `PREDICTED` provenance. |
| **AI Layer & Agents** | Fragmented across `ai.py`, `AskEngineView.tsx`, and cards. | No dedicated multi-agent interface for: AI Watchtower, Loss Hunter, Production Optimizer, Predictive Maintenance, Revenue Guardian, and Action Manager. | Implement dedicated AI & Agents section with the 6 specialized operational agents and contextual drawer. |
| **Action Tracking** | `DecisionActionRecord` model + `recommendations.py` | Basic status updates exist, but lacks full before/after measurement loop and verified outcome tracking. | Build full Action Manager with assignee, deadline, floor execution, before-after metrics, and verified recovery. |
| **Workforce Intelligence** | `WorkforceIntelligenceView.tsx` + `workforce.py` | High visual polish, but requires strict guardrails: suggestions must be framed as "Candidate for Review" rather than automated promotion/salary decisions. | Clarify observed vs recommended metrics; ensure AI only flags review recommendations for management. |
| **UI Hierarchy & Boilerplate** | Across all views | Repetitive layout pattern (Title -> KPI cards -> Section -> Table -> Cards -> Table). | Give every module a purpose-built distinct layout (e.g., Pareto for breakdowns, waterfall for revenue, capability matrix for workforce). |
| **Data Trust System** | `DataTrustBadge.tsx` (`ACTUAL`, `CALCULATED`, `ESTIMATED`, `PREDICTED`) | Implemented in some components, but inconsistent across modules. Fallback demo data was not always explicitly marked. | Enforce mandatory data trust classification across 100% of metrics and data points. |

---

### 2. What Works, What Should Be Refactored, What Should Be Added

#### What Works Well & Should Be Preserved:
1. Clean Light Industrial Enterprise SaaS design tokens (`#F6F8FA` background, `#FFFFFF` surfaces, `#E2E6EA` borders, restrained industrial palette).
2. Deterministic weaving mathematics (`formulas.py`, RPM vs PPM conversions, standard efficiency definitions).
3. Rich domain relational model (`Loom`, `ProductionLog`, `StopEvent`, `MaintenanceRecord`, `AirConsumptionLog`, `QualityInspectionLog`, `Employee`).
4. Ingestion preview and schema validation mechanisms.

#### What Must Be Refactored / Fixed:
1. **Fix PostgreSQL-specific functions in SQLite**: Remove `func.extract("epoch", ...)` across `breakdown.py`, `recommendations.py`, and `ml_pipeline.py`. Calculate durations using Python `datetime` subtraction.
2. **Fix API/Frontend Key Mismatches**: Harmonize schemas between backend routers and frontend TypeScript types.
3. **Refactor Information Architecture**: Streamline navigation into Overview, Operations, Business, Support, AI & Agents, Intelligence, and Data.
4. **Break UI Uniformity**: Redesign individual modules to fit their operational purpose rather than generic card/table templates.

#### What Must Be Added:
1. **AI Watchtower & 6 Operational Agents**:
   - Agent 1: **AI Watchtower** (Continuous plant-wide exception detection).
   - Agent 2: **Loss Hunter** (Breakdown downtime, efficiency gaps, quality scrap, energy waste).
   - Agent 3: **Production Optimizer** (Output opportunities, style allocation, shift balancing).
   - Agent 4: **Predictive Maintenance** (24h breakdown risk, sensor/pressure signals, PM overdue).
   - Agent 5: **Revenue Guardian** (Revenue leakage, financial exposure tracking).
   - Agent 6: **Action Manager** (Closed-loop: Finding -> Recommendation -> Assignee -> Completed -> Verified Outcome).
2. **Contextual AI Explanation Drawer**: Slide-out drawer with 1-click answers ("Explain finding", "Why is this costing us?", "What should I do first?", "What changed?", "What could happen tomorrow?").
3. **Owner vs Operations View Switcher**: High-level financial/risk/action summary for MD/Owner vs deep technical telemetry for Weaving/Plant Managers.
4. **Proactive Escalating Notifications System**: Alert grouping by material issue severity to eliminate alert fatigue.

---

### 3. Architecture Alignment

```
SOURCE DATA (Machine / ERP / Sensor / Excel)
            ↓
    CANONICAL DATA MODEL (Postgres / SQLite)
            ↓
    DETERMINISTIC DOMAIN ANALYTICS (Formulas / Cohorts / Loss Waterfall)
            ↓
    DECISION & RECOMMENDATION ENGINE (Priority P1-P4, Evidence, Action Impact)
            ↓
    ML PREDICTION ENGINE (Calibrated Gradient Boosted Trees, Data Sufficiency Gate)
            ↓
    SPECIALIZED AI AGENTS (Watchtower, Loss Hunter, Optimizer, Maintenance, Revenue, Action Manager)
            ↓
    AGGREGATED FASTAPI ROUTERS (/command-center, /breakdown, /agents, /predictions)
            ↓
    LIGHT INDUSTRIAL ENTERPRISE FRONTEND (Owner-First / Action-Oriented / Contextual AI)
```
