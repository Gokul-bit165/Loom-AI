# LOOM AI — Industrial UI/UX Product Redesign
**System:** Loom AI v2  
**Target:** Ashok Textile Mills (Weaving Division)  
**Architecture:** Real-Time Manufacturing Decision Intelligence (Production · Breakdown · Revenue)

---

## 1. Executive Summary & The 10-Second Management Test

When the Plant Head or Weaving Manager opens Loom AI, within **10 seconds** they must know:

1. **Target Status:** Are we meeting today's weaving production target? (*Actual 49,748 m vs Target 54,600 m → Below Target by -4,852 m / 91.1%*).
2. **Problem Machines:** Which looms are causing the biggest production loss? (*Loom AJ-118 down 89 min, Loom AJ-132 weft feeder faults*).
3. **Root Cause (Why):** Why is production below target? (*Downtime 48%, Weft Breaks 26%, Speed Gap 18%, Other 8%*).
4. **Time Loss:** Where are we losing minutes? (*509 min total floor downtime across 68 stoppages*).
5. **Output Loss:** How many metres of fabric were lost? (*2,260 m lost capacity today*).
6. **Revenue Loss:** What is the financial exposure? (*₹90,400 revenue loss today at ₹40.00/m standard selling price*).
7. **Immediate Action:** What should management do first? (*Priority 1: Inspect Loom AJ-118 inverter connection & Sub-panel 4 voltage fluctuations before next shift*).

---

## 2. Core Navigation & Streamlined 3-Pillar Workspace

To prevent visual clutter, the primary workspace is strictly structured around the 3 core industrial pillars:

```
[ COMMAND CENTER ]  ← Executive 10-Second Cockpit & Priority Action Queue
       │
       ├─── 1. PRODUCTION & LOOM PERFORMANCE (Q1–Q4)
       │       • Today vs Target & Yesterday Comparison (Q1)
       │       • Warp & Weft Extra Timing Loss (Q2)
       │       • Output vs Efficiency Rankings & Weaver Fair Index (Q3)
       │       • Historical 4-Week Trends & AI Decline Insights (Q4)
       │
       ├─── 2. BREAKDOWN & DOWNTIME INTELLIGENCE (Q5–Q7)
       │       • Duration vs Frequency Bimodal Distinction (Q5)
       │       • 80/20 Reason Pareto & Abnormal 2.4× Baseline Detection (Q6)
       │       • Shift-wise Financial Impact & Floor Voice Logger (Q7)
       │
       └─── 3. REVENUE, PROFITABILITY & LOSS ATTRIBUTION (Q21–Q23)
               • Revenue by Loom & Style Construction (Q21)
               • Direct Cost & Contribution Profit Margin (Q22)
               • Mutually Exclusive Loss Waterfall & Ranked Financial Leaks (Q23)
```

Secondary extended modules (Loom 360°, Operations Table, Manpower, Maintenance, Air, Quality, ML Predictions, Decision Registry, Ingestion) remain accessible via organized sub-sections without cluttering the primary operational flow.

---

## 3. Pillar 1: Production Intelligence (Q1–Q4)

- **Q1 (Today vs Yesterday):** Deterministic comparison of Output ($m$), Scheduled Efficiency (%), Kilo-Picks, Warp Breaks, Weft Breaks, and Downtime ($min$) with directional up/down delta pills.
- **Q2 (Warp/Weft Extra Timing):** Standard allowances (Warp: 15.0 min, Weft: 10.0 min) vs actual repair duration, computing excess repair minutes and lost output/revenue tagged as `ESTIMATED`.
- **Q3 (Transparent Rankings):** Independent tabs for *Top Output Looms*, *Lowest Output Looms*, *Top Efficiency Looms*, *Lowest Efficiency Looms*, and *Weaver Performance Index* ($\frac{\text{Actual Eff}}{\text{Grade Std Eff}}$).
- **Q4 (Historical Trends & Anomaly):** 4-week efficiency trend per machine highlighting chronic decline signals (e.g. *Loom AJ-118 efficiency has declined for 4 consecutive weeks*).

---

## 4. Pillar 2: Breakdown & Downtime Intelligence (Q5–Q7)

- **Q5 (Bimodal Distinction):** Visually and mathematically distinguishes **Highest Downtime Duration Today** (e.g. Loom AJ-118: 509 min, 10 stops) from **Most Frequent Breakdowns This Month** (e.g. Loom AJ-042: 32 stops, 410 min).
- **Q6 (Pareto & Abnormal Baselines):** Reason decomposition ranked by business impact; compares today's stoppage against 30-day trailing baseline with `2.4× baseline` abnormal alert flags.
- **Q7 (Shift Financial Impact):** Itemizes Shift 1, Shift 2, and Shift 3 by downtime, output loss, and revenue deficit.
- **Floor Voice Logger:** Audio/text input widget with Tamil/English regex parsing and mandatory visual confirmation flag before persistence.

---

## 5. Pillar 3: Revenue & Loss Attribution (Q21–Q23)

- **Q21 (Revenue Matrix):** Realized daily & monthly revenue by Loom and Fabric Style. Emphasizes that $\text{High Revenue} \neq \text{High Profit}$.
- **Q22 (Direct Costs & Contribution):** Deducts itemized direct manufacturing expenses (Raw Yarn, Power/Energy, Direct Labour, Spares) from revenue; marks state as `PARTIAL` if specific cost feeds are unconfirmed.
- **Q23 (Mutually Exclusive Loss Waterfall):**
  $$\text{Potential Revenue} \to \text{Breakdown Loss} \to \text{Electrical Downtime Loss} \to \text{Low-Efficiency Loss} \to \text{Realized Revenue}$$
  Ranks largest financial leaks to guide management where to intervene first.

---

## 6. AI & Decision Intelligence Rules

1. **Deterministic Foundation:** All metrics, KPIs, rankings, and financial sums are computed strictly in SQL/Python analytics.
2. **AI Decision Analyst:** Used strictly after calculation to format evidence-backed narratives, probable causes, and actionable recommendations.
3. **Data Trust System:** Every number carries a visible trust badge (`ACTUAL`, `CALCULATED`, `ESTIMATED`, `PREDICTED`).
