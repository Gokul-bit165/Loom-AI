# Loom AI — Executive Demo Guide (Company Pilot Edition)

This guide walks company executives, plant owners, weaving directors, and operations managers through the **Loom AI Core Modules Demo**.

---

## 1. Quick Start (Single Click)

Double-click `run_demo.bat` in the repository root:
```cmd
run_demo.bat
```
This automatically:
1. Starts the **Backend API**: `http://127.0.0.1:8050` (FastAPI with SQLite Ground Truth)
2. Starts the **Frontend App**: `http://localhost:3001` (Vite + React)
3. Opens `http://localhost:3001` directly in your default browser on the **Executive Overview Landing Page**.

---

## 2. Core Workspaces Structure

```text
CORE DEMO MODULES [DEMO READY]
├── Executive Overview          🌟 MASTER LANDING PAGE (Hero Verdict, 4 KPIs, 192-Loom Floor Matrix)
├── Production Intelligence
│   ├── Daily Production        (Daily position, targets, triage queue)
│   ├── Loom Performance       (Weaver rankings, speeds, efficiency)
│   ├── Trends & History        (30-day chronological shift variance)
│   └── Management Reports      (Shift handover reports)
├── Breakdowns
│   ├── Breakdown Insights      ("What happened?" — Operational Pareto & Golden Benchmark)
│   ├── Root Cause Analysis     ("Why did it happen?" — Selected event deep-dive & causal chain)
│   ├── Abnormal Events         ("What is unusual?" — Time-of-day anomaly timeline)
│   └── Production Loss Impact  ("How much did it cost?" — Financial waterfall & category loss)
└── Revenue & Loss              (Commercial Waterfall, Departmental Loss & P&L Decision Room)
```

---

## 3. Executive Demo Walkthrough

### 🌟 0. Executive Overview (Master Landing Page)
**Purpose**: Executive command center showing the live pulse of Ashok Textile Mills (192 looms).
1. **Live Factory Ambient Bar**:
   - Live telemetry status (`192 Looms Online`), shift progress (`Shift 3 Active · Handover in 02h 15m`), and data quality (`DQI 98.6%`).
2. **Owner Operational Verdict Hero Card**:
   - Authoritative executive verdict: *"Electrical and power is the largest revenue loss today (62.3%). Approve transformer and sub-panel inspection before evening shift to protect ₹201,064."*
   - Immediate high-value decision approval: `[Approve Action]` and `[Review P&L]`.
3. **Four Core Management Numbers**:
   - **Production Volume**: `49,749 m` / `50,019 m` target (89.26% fleet efficiency).
   - **Realized Revenue**: `₹1,989,951` net revenue (32.0% contribution profit margin).
   - **Plant Stoppage**: `620.6 hrs` cumulative downtime across `766 stop events`.
   - **Immediate Recovery Opportunity**: `₹201,064` protected if top 3 actions are approved.
4. **Interactive Gateways to Core Modules**:
   - One-click jump cards into **Production Intelligence**, **Breakdown Intelligence**, and **Revenue & Loss**.
5. **Factory Floor 192-Loom Micro-Matrix**:
   - Real-time color-coded grid representing all 192 looms across Shed 1 and Shed 2 (🟢 Optimal, 🟡 Attention, 🔴 Critical).
   - Click any machine cell to jump directly into its **Root Cause Investigation**.
6. **Top 3 Outlier Machines Today**:
   - Ranked cards for `Loom AJ-118` (509m downtime), `Loom AJ-132` (342m downtime), and `Loom AJ-146` (298m downtime).

---

### 🏭 1. Production Intelligence
- **Daily Production**: Output position against target with shift situation verdict and triage strips (`45 Attention`, `19 Critical`).
- **Loom Performance**: Ranked fleet performance table with RPM and running efficiencies.
- **Trends & History**: 7D, 14D, and 30D historical telemetry comparing shifts.
- **Management Reports**: Shift summary reports ready for production meetings.

---

### 🔧 2. Breakdowns Intelligence (4 Workspaces)
- **Breakdown Insights**: Operational Pareto distribution and Golden Peer Benchmark (`AJ-162` at 98.6%).
- **Root Cause Analysis**: Select any real stop event from the database, view its timestamped sensor timeline, causal evidence chain (`OBSERVED`/`INFERRED`/`PREDICTED`), and 30-day baseline duration.
- **Abnormal Events**: 06:00–22:00 time-of-day timeline detecting time-clustering and rapid stoppage surges.
- **Production Loss Impact**: Executive financial loss position, real loss waterfall (preventing double counting), category loss % and ₹, and 3-tier recovery ledger.

---

### 💰 3. Revenue & Loss
- **Owner Decision Room**: One-sentence owner verdict and P&L attribution.
- **Commercial Waterfall**: Theoretical gross revenue down to realized revenue with style-grounded rates.
- **Departmental Loss Attribution**: Electrical & Power (`62.3%`), Operations, Maintenance, Quality, and Planning.
- **Component Action Prescription**: Specific inspection recommendations with responsible owners and verification gates.
