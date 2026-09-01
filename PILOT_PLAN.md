# Loom AI — Controlled Real-Data Enterprise Pilot Proposal

**Document Type**: Technical Proposal & Implementation Plan  
**Target Audience**: Managing Director, VP of Operations, General Manager & Plant Superintendents  
**System Version**: Loom AI V1 Production  

---

## 1. Executive Summary

Loom AI is a specialized textile manufacturing intelligence platform designed to replace fragmented, error-prone daily Excel reports with a deterministic, trustworthy management reporting system.

Unlike generic business intelligence tools or probabilistic AI models, Loom AI is built on a non-negotiable principle: **Zero LLM Calculations**. Every number, efficiency variance, downtime Pareto ranking, and commercial revenue total is computed with 100% mathematical determinism directly from PostgreSQL shift logs. The AI assistant functions strictly as an explanation and operational recommendation layer, providing plant managers with instant clarity and auditability.

This proposal outlines a **controlled, 3-phase pilot** designed to validate the system on real mill data with zero operational disruption.

---

## 2. Phased Pilot Rollout Strategy

To guarantee data integrity and build user trust, the pilot avoids premature enterprise-wide deployment in favor of a progressive 3-phase rollout:

```
┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│   PHASE 1: SINGLE DEPT    │ ──> │   PHASE 2: SINGLE UNIT    │ ──> │   PHASE 3: ENTERPRISE     │
│   (Ring Spinning Shed)    │     │   (Unit I: Spin + Weave)  │     │   (Full Plant Complex)    │
│   Duration: Weeks 1 - 2   │     │   Duration: Weeks 3 - 6   │     │   Duration: Weeks 7 - 10  │
└───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘
```

### Phase 1: Single Department Pilot (Ring Spinning Shed)
* **Duration**: 2 Weeks (Weeks 1 – 2)
* **Scope**: 16 Ring Spinning Frames (`RF-01` through `RF-16`).
* **Why Ring Spinning?**:
  - Machine numbers are physical and grounded (`real_grounded`).
  - Production count (hanks/kg), shift counter readings, and maintenance cleaning schedules are already logged daily with high consistency.
* **Key Objectives**:
  1. Validate the automated parser against the mill's daily spinning Excel log.
  2. Verify that shift production targets, actual delivery counts, and efficiency calculations match the mill's standard formulas.
  3. Confirm that downtime categorization correctly isolates mechanical breakdowns from scheduled weekly full cleaning.
* **Go/No-Go Gate 1**: 100% numeric reconciliation between Loom AI outputs and mill official spinning reports for 10 consecutive working days.

---

### Phase 2: Single Production Unit (Unit I Integrated Mill)
* **Duration**: 4 Weeks (Weeks 3 – 6)
* **Scope**: Entire Unit I complex (Preparatory + Ring Spinning + Vortex + Weaving Sheds — ~59 machines).
* **Key Objectives**:
  1. Integrate weaving shed production logs and map fabric sort allocations (`fabric_style`).
  2. Ingest daily commercial style rate tables to enable Q21 revenue tracking.
  3. Deploy the **Management Control Center** to Shift Supervisors, Jobbers, and the Plant Superintendent.
  4. Enable the **AI Management Assistant** for natural-language shift retrospectives.
* **Go/No-Go Gate 2**: Regular daily adoption by shift supervisors, zero unexplained data discrepancies, and verified executive sign-off.

---

### Phase 3: Full Production Reporting & Enterprise Rollout
* **Duration**: 4 Weeks (Weeks 7 – 10)
* **Scope**: Full plant deployment across all production units, historical data backfill (90 days), and executive dashboard access for the Managing Director and Head of Finance.
* **Key Objectives**:
  1. Automated daily ingestion cadence (e.g. 08:30 AM daily scheduled import).
  2. Multi-department executive briefings and cross-shift performance leaderboards.
  3. Transition from pilot governance to permanent standard operating procedure (SOP).

---

## 3. Measurable Pilot Success KPIs

The success of the pilot will be evaluated against strict, quantitative business metrics:

| Pilot Success Metric | Baseline (Current Manual Process) | Loom AI Pilot Target | Measurement Method |
|---|---|---|---|
| **Daily Report Preparation Time** | 45 – 60 minutes / day (Manual Excel compilation) | **< 2 minutes / day** (Automated ingestion) | Time logged by data entry team before morning management meeting |
| **Manager Situational Awareness** | 15 – 20 minutes parsing spreadsheets | **< 10 seconds** (Control Center Dashboard) | Observational assessment during morning production briefings |
| **Mathematical Data Accuracy** | 3 – 5 formula/copy-paste errors per month | **100% Accuracy (0 calculation discrepancies)** | Daily dual-audit against signed physical shift sheets |
| **Chronic Anomaly Identification** | Identified reactively after 2–3 weeks | **Identified in real-time on Day 1** | Time to detect machines operating $< 80\%$ efficiency or $> 120$ min downtime |
| **Manual Excel Reconciliation** | 6 – 8 hours / week compiling MTD summaries | **0 hours (Automated MTD aggregation)** | Weekly administrative labor time tracking |
| **System Calculation Latency** | Several minutes running Excel macros | **< 150 milliseconds** | API server telemetry |
| **Actionable Maintenance Issues** | ~2 proactive inspections / month | **$\ge 8$ actionable mechanical reviews / month** | Work orders logged directly from Loom AI "Attention Required" items |
| **Superintendent Satisfaction** | N/A (Frustrated by spreadsheet delays) | **$\ge 85\%$ Positive Feedback / Usability Score** | Formal end-of-pilot survey |

---

## 4. Operational Governance & Risk Management

### A. Dual-Running Integrity Protocol
During Phase 1 and Phase 2, the mill's existing manual Excel reports will run in parallel with Loom AI. Daily numbers will be cross-checked every morning at 09:00 AM. Any divergence will trigger an immediate root-cause review before updating production parameters.

### B. Security & Data Protection
* **On-Premise / Private Deployment**: The database and backend are deployed within the mill's internal network or dedicated private VPC.
* **No External Data Leakage**: Factory production counters and revenue logs are never used to train public LLM models.
* **Role-Based Access Control**: Shift supervisors have view-only access to operational metrics; master rate tables and system configurations require administrative authorization.

---

## 5. Pilot Timeline & Milestones

```
Week 1: Data Discovery, Taxonomy Alignment, & Phase 1 Ingestion Setup
Week 2: Phase 1 Spinning Shed Live Testing & Dual-Audit Verification
Week 3: Phase 2 Kickoff: Weaving Shed & Commercial Style Rate Master Ingestion
Week 4: Shift Supervisor Training & Morning Meeting Integration
Week 5: AI Management Assistant Calibration & Anomaly Alert Validation
Week 6: Phase 2 Evaluation Review & Gate 2 Sign-off
Week 7 - 10: Phase 3 Enterprise Rollout & Long-term Support Handover
```

---

## 6. Pilot Approval & Next Steps

To initiate **Phase 1 (Ring Spinning Shed)**, the following minimal setup requirements are needed from mill management:
1. Provide sample 30-day Excel shift reports for the Ring Spinning department.
2. Confirm the 12 discovery items defined in [`COMPANY_DATA_DISCOVERY.md`](file:///c:/Users/gokul/ashok-v1/COMPANY_DATA_DISCOVERY.md).
3. Designate a technical single-point-of-contact (SPOC) from the mill's IT/Data team.

**Submitted By**: Loom AI Architecture & Engineering Team  
**Status**: Ready for Pilot Kick-Off
