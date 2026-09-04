# Rebuild V2 Revenue and Loss Dashboard: Minimal Owner-First Decision Room

Rebuild the V2 Revenue and Loss page (`RevenueLossView.tsx` and supporting backend endpoints) based strictly on [`docs/REVENUE_LOSS_DASHBOARD_REBUILD_INSTRUCTIONS.md`](file:///c:/SSG%20projects/Loom-AI/docs/REVENUE_LOSS_DASHBOARD_REBUILD_INSTRUCTIONS.md).

The rebuilt page transforms the view from a text-heavy report into a crisp, owner-first visual decision dashboard for Ashok Textile Mills. The first screen immediately answers:
> **How much money did we make, how much did we lose, why did we lose it, what should we do now, who owns it, and is the problem improving or worsening?**

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions:**
> 1. **Interaction Pattern for Drill-downs:** As specified in Section 4 of the instructions, deep technical evidence, calculations, and formulas will be concealed behind a clean slide-out **Interactive Inspector Drawer**. Clicking any Revenue Trend point, Loss Spike bar, Department bar/card, or KPI card will open the inspector drawer with root-cause traces, data provenance, and action directives.
> 2. **Dual-Audience View Toggle:**
>    - **Owner Decision View (Default):** Minimal, visual, high-signal first screen. Top decision header, 6 decision cards, 3 labeled decision charts with side decision panels, Whole Mill Summary stack, and Top 3 critical department problem cards.
>    - **Plant Assistant Evidence View:** Full 7 department cards, direct manufacturing cost breakdown, fabric style revenue table with sorting, rate card governance simulator, 24-hour supervisory inspection milestones, data trust ledger, and time-period comparison matrix.
> 3. **Time Period Reactivity:** Switching between **Today**, **Last 7 days**, **Month to date**, and **Year to date** updates all metrics, reasons, trend points, spike markers, histogram rankings, verdicts, and recommended actions dynamically.

---

## Proposed Changes

### Backend (`v2/backend/app/routers/revenue.py`)

#### [MODIFY] [revenue.py](file:///c:/SSG%20projects/Loom-AI/v2/backend/app/routers/revenue.py)
- **Dynamic Period Reasons & Verdicts:** Update `owner_summary` generation so that `one_sentence_verdict`, `one_biggest_reason`, `one_action_to_approve`, and `primary_action_owner` adapt dynamically to the active period and the computed dominant problem department from the deterministic waterfall:
  - *Today:* Focus on voltage dips on Sub-panel 4 and evening shift tap calibration.
  - *Last 7 days:* Focus on cumulative mechanical knotting stops and electrical inverter trips.
  - *Month to date:* Focus on month-to-date capacity deficit, running efficiency gaps, and scheduled maintenance.
  - *Year to date:* Focus on long-term reliability and capacity protection.
- **Period-Aware Trend & Spike Points:** Ensure `daily_trend` returns proper data range matching the selected period (e.g. 7 points for `SEVEN_DAYS`, full month 31 points for `MONTH_TO_DATE`, trailing 14 days for `TODAY`). Ensure spike threshold and `is_spike` flags accurately highlight anomaly days.
- **Department Sectors Scaling:** Ensure department problem counts and loss figures dynamically scale across periods and align with the deterministic waterfall calculation.

---

### Frontend (`v2/frontend/src/`)

#### [MODIFY] [RevenueLossView.tsx](file:///c:/SSG%20projects/Loom-AI/v2/frontend/src/components/RevenueLossView.tsx)
Complete rebuild of the component according to the 20-section specification:
1. **Top Decision Header:**
   - Single-sentence executive verdict banner with high-contrast alert styling.
   - Core metrics: Today/Period Revenue, Revenue Loss, Recoverable Revenue.
   - Top action approval button with instant interactive state feedback (`Approve Action: [Owner]` → `Action Approved & Dispatched`).
   - Action owner and urgency badge.
2. **Owner Decision Cards (6 Cards Max):**
   - 1. *Actual Revenue* (Realized) with `CALCULATED` trust badge.
   - 2. *Potential Revenue* (100% capacity target) with `CALCULATED` trust badge.
   - 3. *Revenue Loss* with critical red alert badge.
   - 4. *Recoverable Revenue* with opportunity green badge.
   - 5. *Contribution Profit* with profit margin % and `CALCULATED` trust badge.
   - 6. *Main Problem Department* with trend badge (`Improving` / `Stable` / `Worsening`).
   - One number per card, one short driver line, full words (no cryptic abbreviations). Clicking any card opens its calculation basis in the inspector drawer.
3. **Visual Decision Area (3 Core Charts + Side Decision Panels):**
   - **Chart 1: Revenue Trend Line Chart:**
     - Pure SVG line chart: Actual Realized Revenue (solid blue) vs Target Potential Capacity (dashed slate).
     - Full axes: X-axis Date labels + "Date", Y-axis Revenue in ₹ (Lakhs) + "Revenue (₹)".
     - Legend, units, and selected period label.
     - Interactive points: Click point to inspect date's revenue, target, deficit gap, and root driver in the drawer.
     - **Side Decision Panel:** Trend status, main driver, revenue gap, prescribed action, and monitoring metric.
   - **Chart 2: Revenue Loss Trend Bar Chart with Anomaly Spike Highlighting:**
     - Pure SVG bar chart showing daily revenue loss.
     - Spikes highlighted in distinct red with ⚡ marker; normal days in soft neutral/coral (not all red!).
     - Dashed spike threshold benchmark line.
     - Full axes: X-axis Date + "Date", Y-axis "Revenue Loss (₹)".
     - Legend: Daily loss vs Spike threshold.
     - Interactive bars: Click bar to inspect spike cause, affected department, and emergency mitigation in the drawer.
     - **Side Decision Panel:** Peak loss day, spike reason, affected department, recommended action, and responsible owner.
   - **Chart 3: Department Problem Histogram:**
     - Horizontal bar chart representing all 7 departments:
       - *Electrical and power*
       - *Mechanical maintenance*
       - *Weaving efficiency*
       - *Quality and seconds*
       - *Workforce allocation*
       - *Air and compressor*
       - *Commercial rate card and cost trust*
     - Metric switcher: Toggle between Rupee Loss (₹) and Problem Count.
     - Clear axes, units, and labels.
     - Interactive bars: Click department bar to open deep-dive in drawer.
     - **Side Decision Panel:** Highest rupee loss department, highest event count department, low-count high-impact asymmetric risk callout, and recommended first action.
4. **Whole Mill Summary & Top Department Cards:**
   - **Whole Mill Summary:** Compact visual stack summarizing total mill picture (Actual, Potential, Loss, Lost Metres, Contribution Profit, Main Problem Department, Recoverable Opportunity).
   - **Top Department Cards:**
     - In Owner View: Top 3 departments by financial impact displayed by default, with a "Show all 7 departments" toggle.
     - In Plant Assistant View: All 7 departments displayed.
     - Compact design: Department name, loss amount / monitor status, problem count / affected metres, trend status badge, 1-line reason, 1-line solution, owner, urgency.
5. **Interactive Inspector Drawer (Slide-out side panel):**
   - Opens when clicking any chart point, spike bar, department bar, or KPI card.
   - Displays exact values, formula / calculation basis, data provenance trust, affected looms/styles (e.g. AJ-118, Sub-panel 4), immediate corrective action, owner, and verification gate.
6. **Plant Assistant Evidence View:**
   - Accessible via dual mode toggle in the header.
   - Direct Manufacturing Cost Breakdown cards (Yarn ~52%, Power ~11%, Weaver & Fitter payroll, Maintenance spares).
   - Commercial Rate Card Governance Checklist with interactive rate confirmation simulator.
   - Fabric Style Construction Revenue table with sorting and share %.
   - Supervisory 24-Hour Inspection Milestones checklist.
   - Data Trust & Provenance Ledger (Actual, Calculated, Estimated, Predicted).
   - Multi-Period Comparison table (Today vs Last 7 days vs Month to date vs Year to date).

---

## Verification Plan

### Automated Tests & Typecheck
1. **Frontend Build & Lint:**
   ```powershell
   npm run build
   ```
   Ensures TypeScript compilation and Vite bundling pass with 0 errors.

2. **Backend API Verification:**
   Query the revenue analytics endpoint across all 4 periods to verify payload structure, deterministic calculations, dynamic verdicts, and sector arrays:
   ```powershell
   python -c "import urllib.request, json; [print(p, data['owner_summary']['one_sentence_verdict'].replace('\u20b9', 'Rs.')) for p in ['TODAY', 'SEVEN_DAYS', 'MONTH_TO_DATE', 'YEAR_TO_DATE'] for data in [json.loads(urllib.request.urlopen(f'http://localhost:8050/api/v2/revenue/analytics?date=2026-07-31&unit=ATM&period={p}').read().decode('utf-8'))]]"
   ```

### Manual & Interactive Browser Verification
1. **Desktop Dashboard Visual Check:**
   - Navigate to the **Revenue & Loss** page in the browser.
   - Verify that the first screen is clean, owner-first, and not a wall of text.
   - Verify the 3 charts have clear axes, units, legends, and side decision panels.
   - Verify spikes in the loss chart are flagged with ⚡ and red color while regular days remain soft.
2. **Interaction Testing:**
   - Click a point on the Revenue Trend line → Inspector drawer slides out with date revenue, target, gap, and root driver.
   - Click a spike bar on the Loss Trend chart → Inspector drawer opens with spike cause and affected department.
   - Click a department bar on the Histogram → Inspector drawer opens with department solution, owner, and evidence.
   - Click a KPI decision card → Inspector drawer displays calculation basis and trust provenance.
   - Click "Approve Action" → Verify button updates to "Action Approved & Dispatched".
3. **Period Selector Verification:**
   - Click "Today", "Last 7 days", "Month to date", "Year to date".
   - Confirm all 6 cards, verdicts, reasons, charts, and department rankings update accordingly.
4. **Plant Assistant Evidence View Verification:**
   - Toggle to "Plant Assistant Evidence".
   - Verify direct cost breakdown, fabric style table, rate card simulator, and supervisory milestones.
