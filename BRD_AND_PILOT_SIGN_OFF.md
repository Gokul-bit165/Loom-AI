# Loom AI — Business Requirements Document (BRD), AI Model Architecture & Enterprise Pilot Sign-Off Agreement

**Project Name**: Loom AI Enterprise Decision Intelligence Platform  
**Target Enterprise**: Ashok Textile Mills (ATM) — Weaving & Spinning Complex  
**Version**: 2.0 Production Baseline  
**Document Status**: Official Release for Executive Sign-Off  
**Date of Submission**: September 4, 2026  
**Document Classification**: Confidential — Enterprise Operational Document  

---

## 1. Executive Summary & Business Case

### 1.1 Business Problem Statement
Textile manufacturing operations at Ashok Textile Mills (ATM) face persistent margin compression caused by four structural reporting challenges:
1. **Spreadsheet Latency & Labor**: Shift supervisors and data entry clerks spend 45–60 minutes per shift compiling manual log sheets and Excel macros. Shift performance retrospectives happen reactively 24 hours later.
2. **Invisible Revenue Shortfall**: Production deficits (meters produced below target) are rarely decomposed into actionable drivers (speed loss due to sub-standard yarn vs. micro-stoppages vs. operator creeling lag vs. compressor pressure drops).
3. **Reactive Breakdowns**: Mechanical loom failures (e.g., rapier drive failure, nozzle wear, warp beam knotter defects) are fixed only *after* catastrophic stoppage, yielding an average of 40–90 minutes of unrecovered downtime per incident.
4. **Energy & Compressed Air Leaks**: Airjet looms consume ~60–70% of total electrical power via compressed air. Unmonitored CFM deviations cause silent energy losses exceeding ₹12–18 Lakhs annually.

### 1.2 Proposed Solution: Loom AI v2
Loom AI is a specialized decision intelligence platform that replaces manual shift compilation with real-time operational truth. Built on the **Zero LLM Calculation Rule**, all financial totals, OEE numbers, Pareto rankings, and shortfall decompositions are calculated deterministically via SQLAlchemy/PostgreSQL, with generative AI functioning exclusively as a natural language synthesis and operational recommendation layer.

### 1.3 Expected Business ROI
| Metric / KPI | Current Mill Baseline | Loom AI Target | Annual Financial Impact (Estimated) |
|---|---|---|---|
| **Fleet Overall Equipment Effectiveness (OEE)** | 78.4% – 82.1% | **85.5% – 88.0%** | +₹38,00,000 to ₹55,00,000 in higher fabric output |
| **Shift Report Generation Time** | 45–60 min / shift | **< 2 minutes (instant)** | 550+ supervisory hours saved annually |
| **Unplanned Loom Downtime** | 6.2% of scheduled time | **$\le 3.8\%$** | ~240 loom-hours saved per month |
| **Pneumatic / Air Leak Loss** | 14.5% excess CFM | **$\le 5.0\%$ excess CFM** | ₹14,00,000+ electrical utility savings |
| **Fabric Grade B / Scrap Rejection** | 3.4% of total meters | **$\le 1.8\%$** | ₹22,00,000 in saved value downgrade |
| **Total Net Enterprise Value** | — | — | **₹74,00,000 – ₹91,00,000 / year** |

---

## 2. Business Requirements Document (BRD)

### 2.1 Project Stakeholder Matrix & Personas

| Role | Key Stakeholder | Core Responsibilities in Loom AI | Primary Business Need |
|---|---|---|---|
| **Executive Sponsor** | Managing Director | Approves enterprise rollout, reviews macro P&L and monthly ROI | Single-screen plant financial health & margin leakage visibility |
| **Operational Owner** | VP / General Manager Operations | Oversees cross-shed OEE, shift targets, and unit-wide compliance | Real-time shortfall decomposition and cross-shift leaderboards |
| **Plant Champion** | Weaving Superintendent | Daily review of shift production, fabric sort allocation, weaver assignments | Instant 08:30 AM morning meeting briefing without spreadsheet delays |
| **Maintenance Owner** | Chief Maintenance Engineer | Review PM schedules, MTBF degradation alerts, and spare parts | Predictive breakdown warnings 12–24 hours before loom seizure |
| **Quality Owner** | Head of Quality Assurance | Tracks 4-point inspection defect density, cut-piece logs, and B-grade sort penalties | Early warning on warp/weft slub formation and reed mark defects |
| **Data & Systems Lead** | IT / Systems Administrator | Manages on-prem server, network ingestion, user access & database backups | Secure, LAN-isolated deployment with zero data leakage |

---

### 2.2 Scope of Work

#### In-Scope (Phase 1 – Phase 3)
* Real-time automated ingestion of shift counter logs, breakdown logs, and style masters for 60+ Weaving Looms (Toyota Airjets, Tsudakoma, Sulzer/Picanol) and Spinning Frames.
* Single-pane **Command Center** showing live OEE, active stoppages, running RPM, and shift shortfall.
* **Shortfall Decomposition Engine**: Mathematical separation of production deficits into (1) Speed/RPM loss, (2) Stoppage downtime, (3) Quality rejection downgrade, and (4) Unallocated operational loss.
* **Predictive Maintenance Center**: ML-driven machine risk scoring (High/Medium/Low) with Days-to-Failure forecasting.
* **Weaver Allocation & Manpower Intelligence**: Tracking loom-to-weaver ratios, weaver workload balance, and performance variation across Shift 1, Shift 2, and Shift 3.
* **Pneumatic / Compressed Air Monitoring**: Loom-level CFM consumption tracking against fabric pick density standards.
* **Decision & Action Registry**: Human-in-the-loop tracking of supervisor interventions with verified ROI auditing.
* **Role-Based Access Control (RBAC)**: Secure access tailored for Operator, Supervisor, Superintendent, and Managing Director.

#### Out-of-Scope (for Initial Pilot)
* Direct hardware PLC rewiring (data will be ingested via machine electronic data dump or structured digital shift logs).
* Financial ERP ledger journal posting (Loom AI outputs verified CSV/Excel summaries for manual accounting upload).
* Direct automated machine shutdown controls (system operates as advisory and decision intelligence only).

---

### 2.3 Detailed Functional Requirements

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           LOOM AI v2 CORE ARCHITECTURE                          │
├──────────────────────┬──────────────────────┬───────────────────────────────────┤
│  DATA INGESTION      │  DETERMINISTIC MATH  │      INTELLIGENCE & ACTIONS       │
│  - Counter readings  │  - OEE Engine        │  - Shortfall Decomposition        │
│  - Shift logbooks    │  - Loss Waterfall    │  - LoomGuard ML Risk Predictor    │
│  - Stop event codes  │  - MTBF / MTTR       │  - Action Audit & Decision Ledger │
│  - Style rate master │  - CFM Variance      │  - Shift Briefing Assistant       │
└──────────────────────┴──────────────────────┴───────────────────────────────────┘
```

#### FR-1: Production Truth & Command Center
* **FR-1.1**: The system must compute shift metrics strictly using factory formulas:
  $$\text{Target Picks} = \text{Standard RPM} \times \text{Scheduled Minutes}$$
  $$\text{Target Metres} = \frac{\text{Target Picks}}{\text{PPI} \times 39.37}$$
  $$\text{Efficiency \%} = \left(\frac{\text{Actual Picks}}{\text{Target Picks}}\right) \times 100$$
* **FR-1.2**: No data point shall be rendered as 0 when values are missing; null values must be tagged with explicit missing data indicators (`data_as_of` timestamp and `source_mix` indicator).
* **FR-1.3**: The Command Center must provide shed-level and loom-level views with instant filtering by Shift (1, 2, 3), Shed (Shed 1, Shed 2), and Fabric Sort.

#### FR-2: Mutually Exclusive Shortfall Decomposition
* **FR-2.1**: For any loom producing below target, the deficit must be mathematically decomposed into four non-overlapping loss buckets:
  1. **Speed Loss**: Loss incurred when loom operated at RPM lower than style standard.
  2. **Stoppage Loss**: Loss attributed directly to recorded mechanical/electrical/warp/weft stop events.
  3. **Quality Downgrade Loss**: Loss from rejected cut pieces or grade-B yardage.
  4. **Unallocated Loss**: Residual gap identifying unlogged micro-stoppages or operator turnaround delays.
* **FR-2.2**: The sum of decomposed loss meters plus realized meters must equal 100% of theoretical target meters.

#### FR-3: Breakdown Taxonomy & Maintenance Intelligence
* **FR-3.1**: Raw stoppage descriptions must map to a standardized 15-category mill downtime taxonomy:
  - *Weaving*: Warp Break, Weft Break, Leno/Selvedge, Mechanical Jam, Electrical Trip, Beam Change/Knotting, Sort Change.
  - *Utility*: Compressor Air Pressure Drop, Power Outage, Humidification Deviation.
* **FR-3.2**: Provide Pareto analysis by frequency (count of stops) and cumulative duration (minutes lost).
* **FR-3.3**: Automatically compute Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR) per machine group.

#### FR-4: Air Consumption & Pneumatic Efficiency
* **FR-4.1**: Track actual CFM/loom against standard rated CFM for the active fabric sort.
* **FR-4.2**: Flag looms exceeding +10% CFM threshold as active pneumatic leak or worn valve nozzle candidates.

#### FR-5: Quality & Revenue Loss Attribution
* **FR-5.1**: Integrate inspection cut-piece reports with commercial rate master (₹/meter).
* **FR-5.2**: Calculate realized net revenue vs. potential maximum revenue and quantify exact rupee losses due to machine faults.

#### FR-6: Decision Registry & Human-in-the-Loop Governance
* **FR-6.1**: Every recommendation produced by the AI agents must have a structured lifecycle: `PROPOSED` $\rightarrow$ `ACCEPTED / REJECTED` $\rightarrow$ `ACTIONED` $\rightarrow$ `VERIFIED ROI`.
* **FR-6.2**: Maintain an immutable audit log recording supervisor name, timestamp, action taken, and realized production gain.

---

### 2.4 Non-Functional Requirements (NFR)

* **NFR-1 (Calculation Determinism)**: Zero LLM hallucinations for all numeric outputs. All math must execute in backend Python/SQL logic.
* **NFR-2 (Latency & Performance)**: Command Center dashboard and analytical queries must respond in $< 150\text{ ms}$ under 50 concurrent mill users.
* **NFR-3 (Availability & Resilience)**: System availability must exceed $99.9\%$ during mill operating hours (24x7x365).
* **NFR-4 (Security & Privacy)**: Complete on-premise factory server or customer private VPC deployment. No factory proprietary data or commercial fabric rates are transmitted to public model providers.
* **NFR-5 (Data Governance)**: All database transactions must support audit trails with soft-deletes (`is_current`, `valid_from`, `valid_to`).

---

## 3. Analytical & AI Models Specification

Loom AI v2 deploys a hybrid architecture combining deterministic statistical engines with supervised machine learning:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          LOOM AI v2 MODEL ECOSYSTEM                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 1. DETERMINISTIC ANALYTIC ENGINES                                               │
│    ├── OEE Calculation Engine (Availability × Performance × Quality)            │
│    ├── Mutually Exclusive Shortfall Waterfall (Zero double-counting)            │
│    └── Pneumatic CFM Leak Regression Standard                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 2. MACHINE LEARNING PREDICTIVE ENGINE                                           │
│    └── LoomGuard-GradientBoost-v2.2 (Predictive Loom Seizure / MTBF Failure)    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 3. SPECIALIZED AUTONOMOUS DOMAIN AGENTS                                         │
│    ├── WatchtowerAgent: Real-time anomaly scanner & fleet guard                 │
│    ├── LossHunterAgent: Production shortfall root-cause investigator            │
│    ├── PredictiveMaintenanceAgent: Fleet risk score & component failure         │
│    ├── RevenueGuardianAgent: Style margin erosion & fabric mix optimizer        │
│    └── ActionManager: Human-in-the-loop signoff & ROI verification              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Model 1: Production Truth & Loss Waterfall Decomposition
* **Model Type**: Deterministic Attribution Engine.
* **Inputs**: Loom speed (RPM), scheduled duration, actual picks, stop events, standard pick density (PPI).
* **Formulaic Basis**:
  $$\Delta \text{Metres}_{\text{Speed}} = \frac{(\text{Std RPM} - \text{Actual Running RPM}) \times \text{Running Minutes}}{\text{PPI} \times 39.37}$$
  $$\Delta \text{Metres}_{\text{Stoppage}} = \frac{\text{Std RPM} \times \text{Downtime Minutes}}{\text{PPI} \times 39.37}$$
* **Guarantee**: Mutually exclusive and collectively exhaustive (MECE) decomposition.

### Model 2: LoomGuard Predictive Maintenance (`LoomGuard-GradientBoost-v2.2`)
* **Model Architecture**: Calibrated Gradient Boosted Decision Tree (LightGBM/XGBoost).
* **Target Objective**: Binary classification of high-risk looms likely to suffer critical breakdown ($> 60\text{ min}$ stoppage) within the next 24–48 hours.
* **Training Window**: 30-day forward-chaining historical shift logs.
* **Core Model Evaluation Metrics**:
  - **ROC-AUC**: **0.842**
  - **Precision**: **78.6%** (Minimizes false alarms for maintenance fitters)
  - **Recall**: **81.4%** (Catches 8 out of 10 impending major failures)
  - **F1 Score**: **0.800**
  - **Brier Score**: **0.128** (High probability calibration)
* **Confusion Matrix (Evaluated on 234 Loom-Shift Cycles)**:
  - True Positives: 48 | False Positives: 13
  - True Negatives: 162 | False Negatives: 11
* **Feature Importance Ranking**:
  1. *Downtime Acceleration Ratio (7d vs. 30d)*: **34%**
  2. *7-Day Stoppage Frequency Count*: **22%**
  3. *Warp Break Rate per 1,000 Picks*: **16%**
  4. *Days Since Last Scheduled Overhaul*: **14%**
  5. *Pneumatic Excess CFM Deviation*: **9%**
  6. *Weft Break Rate per 1,000 Picks*: **5%**

### Model 3: Pneumatic CFM Anomaly Detection
* **Model Type**: Baseline Residual Statistical Model.
* **Mechanism**: Compares real-time loom compressor airflow against yarn sort envelope (Weft insertion velocity $\times$ Reed width).
* **Alert Trigger**: $\ge 2$ standard deviations above style baseline sustained over 3 consecutive hours.

---

## 4. Phased Pilot Rollout Plan & Timeline

To ensure zero disruption to ongoing mill operations, Loom AI will be deployed in a progressive **10-Week Phased Rollout**:

```
WEEKS 1-2                 WEEKS 3-6                 WEEKS 7-10
Phase 1: Pilot Shed       Phase 2: Unit Complex     Phase 3: Enterprise Cutover
┌─────────────────────┐   ┌─────────────────────┐   ┌────────────────────────┐
│ Shed 1 (24 Looms)   │──>│ Full Unit I         │──>│ Full Mill Complex      │
│ Ingestion & Audit   │   │ Shift Supervisor SOP│   │ Executive BI & ERP Link│
└─────────────────────┘   └─────────────────────┘   └────────────────────────┘
```

### Detailed Milestone Schedule

| Phase | Timeframe | Scope | Key Activities & Deliverables | Exit Gate Criteria |
|---|---|---|---|---|
| **Phase 1: Ingestion & Calibration** | Weeks 1 – 2 | Shed 1 (24 Looms: Toyota & Tsudakoma) | • Ingest historical 30-day shift logs<br>• Align 15-reason downtime taxonomy<br>• Establish daily 09:00 AM dual-running audit | **Gate 1**: 100% mathematical reconciliation between Loom AI and mill shift records for 10 consecutive days. |
| **Phase 2: Unit 1 Pilot Operation** | Weeks 3 – 6 | Entire Unit I (~60 Looms + Preparatory) | • Deploy Shift Supervisor Command Center<br>• Activate Predictive Maintenance warnings<br>• Implement Decision Registry for daily shift actions | **Gate 2**: $\ge 80\%$ daily supervisor active usage; at least 6 verified breakdown pre-emptions. |
| **Phase 3: Enterprise Cutover** | Weeks 7 – 10 | Entire Mill Complex (All Sheds & Units) | • Backfill 90-day analytics history<br>• Activate MD & GM Executive Control Center<br>• Formal transition to permanent factory SOP | **Gate 3**: Executive sign-off, documented ROI verification, and SLA transition. |

---

## 5. Dual-Audit Governance & Risk Management

### 5.1 Dual-Running Integrity Protocol
To guarantee total data integrity, Loom AI will run in parallel with existing mill reporting during Phases 1 and 2:
1. **Daily Morning Reconciliation (09:00 AM)**: The Shift In-Charge and Loom AI implementation engineer will compare Loom AI reported shift production against signed supervisor physical logbooks.
2. **Tolerance Limit**: Numeric variance between Loom AI and official logbook must be **0.00%** on pick counters and $\le 0.10\%$ on converted meterage (accounting for standard rounding).
3. **Escalation Protocol**: Any variance $> 0.10\%$ halts automated promotion and triggers an instant data reconciliation audit within 2 hours.

### 5.2 Mill Risk Mitigation Matrix
| Identified Risk | Severity | Mitigation Strategy |
|---|---|---|
| **Manual Data Entry Delays** | Moderate | System accepts partial shift uploads with visual indicators until end-of-shift lock. |
| **Inconsistent Stoppage Names** | High | Built-in synonym catalog automatically standardizes technician shorthands (e.g. *"PBM cut"* $\rightarrow$ *Weft Stop*). |
| **Operator Resistance to Logging** | Moderate | Intuitive 1-click mobile/tablet supervisor interface; no double data entry required. |
| **Network Outage in Mill Shed** | Low | Local SQLite/PostgreSQL caching allows offline data capture with auto-sync on reconnect. |

---

## 6. Formal Executive Sign-Off & Acceptance Agreement

### 6.1 Statement of Intent & Mutual Commitment
By signing this document, the executive management of **Ashok Textile Mills (ATM)** and the **Loom AI Engineering & Delivery Team** formally approve:
1. The Business Requirements Document (BRD) and functional specifications outlined herein.
2. The deployment of Loom AI v2 across the 10-Week Phased Rollout Schedule.
3. The operational participation of Shift Supervisors, Maintenance Engineers, and Quality Personnel during the daily dual-audit protocol.
4. The criteria for pilot evaluation, milestone gates, and final enterprise adoption.

---

### 6.2 Pilot Acceptance Checklist

| # | Acceptance Condition | Target Standard | Sign-Off Status |
|---|---|---|---|
| **AC-1** | Shift counter & meterage calculation accuracy | 100% match with physical shift logs over 10 days | [ ] Pending / [ ] Approved |
| **AC-2** | Shortfall decomposition mathematical integrity | Speed + Stoppage + Quality + Unallocated = 100% Target | [ ] Pending / [ ] Approved |
| **AC-3** | Predictive Maintenance Model performance | ROC-AUC $\ge 0.80$, Precision $\ge 75\%$ on mill data | [ ] Pending / [ ] Approved |
| **AC-4** | Daily reporting compilation time | Reduced from 45+ minutes to $< 2$ minutes | [ ] Pending / [ ] Approved |
| **AC-5** | System response latency & availability | $< 150\text{ ms}$ response, $99.9\%$ uptime over 30 days | [ ] Pending / [ ] Approved |
| **AC-6** | Security & zero data leakage compliance | Fully hosted within mill perimeter with no external training | [ ] Pending / [ ] Approved |

---

### 6.3 Executive Sign-Off & Approval Signatures

#### For Ashok Textile Mills (Enterprise Leadership):

| Name & Designation | Department | Signature | Date |
|---|---|---|---|
| **Managing Director** | Executive Board | ___________________________ | _____ / _____ / 2026 |
| **General Manager / VP Operations** | Mill Operations | ___________________________ | _____ / _____ / 2026 |
| **Chief Maintenance Engineer** | Plant Engineering | ___________________________ | _____ / _____ / 2026 |
| **Weaving Superintendent** | Weaving Production | ___________________________ | _____ / _____ / 2026 |
| **Head of Quality Assurance** | QA / QC | ___________________________ | _____ / _____ / 2026 |
| **Chief Financial Officer / Head Finance** | Commercial & Accounts | ___________________________ | _____ / _____ / 2026 |
| **IT & Systems Lead** | IT Infrastructure | ___________________________ | _____ / _____ / 2026 |

<br>

#### For Loom AI Implementation & Technical Delivery:

| Name & Designation | Role | Signature | Date |
|---|---|---|---|
| **Lead Solutions Architect** | System Design & AI Engine | ___________________________ | _____ / _____ / 2026 |
| **Enterprise Delivery Manager** | Pilot Program Lead | ___________________________ | _____ / _____ / 2026 |

---
*End of Agreement — Loom AI Enterprise v2.0*
