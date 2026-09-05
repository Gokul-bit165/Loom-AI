# Loom AI — Enterprise Modules User Manual & Presentation Slide Guide

**Ashok Textile Mills (ATM) — Weaving & Spinning Complex Pilot Edition**  
*Document Purpose: Complete Module-by-Module Operator User Manual and Executive Presentation Playbook with Embedded Screenshots.*

---

## 📑 Slide Deck & Presentation Assets Overview

- **Interactive Presentation Deck**: Open [`docs/presentation_slides/index.html`](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/index.html) directly in Chrome/Edge.  
  - Press `F` for Full Screen mode.
  - Use `Left` / `Right` Arrow keys to navigate slides.
  - Click on any screenshot to zoom in.
  - Click `[🖨️ Save PDF]` or press `Ctrl+P` to generate a 10-page print/handout deck.
- **High-Resolution Screenshots Directory**: [`docs/presentation_slides/screenshots/`](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/)

---

## Slide 1: Executive Overview (Master Command Center)

![Slide 1 - Executive Overview](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/01_executive_overview.png)

### 👤 Primary Stakeholder Role
**Managing Director, Plant Owner & General Manager Operations**

### 📘 What is the Use (User Manual)
The **Executive Overview** is the primary morning landing page and command center for executive management. It provides immediate operational truth across Ashok Textile Mills (192 looms across Shed 1 and Shed 2).

#### Step-by-Step Operating Instructions:
1. **Check the Live Ambient Bar (Top)**:
   - Confirm all **192 Looms** are online and actively streaming telemetry.
   - Check the current active shift (**Shift 3 Active**) and handover timer countdown (**02h 15m remaining**).
   - Ensure the Data Quality Index (**DQI 98.6%**) is healthy.
2. **Review the Owner Operational Verdict Hero Card**:
   - Read the single, authoritative operational recommendation generated from daily plant ground truth.
   - Example today: *"Electrical and power is the largest revenue loss today (62.3%). Approve transformer and sub-panel inspection before evening shift to protect ₹201,064."*
3. **Approve or Review Decisions**:
   - Click `[Approve Action]` to register the electrical inspection into the audited Decision Registry.
   - Click `[Review P&L]` to navigate directly to the commercial loss waterfall.
4. **Monitor the 4 Core Management Numbers**:
   - **Production Volume**: `49,749 m` produced against `50,019 m` target (89.26% fleet efficiency).
   - **Realized Revenue**: `₹19,89,951` net revenue at a 32.0% contribution profit margin.
   - **Plant Stoppage**: `620.6 hrs` cumulative downtime across 766 stop events.
   - **Immediate Recovery Opportunity**: `₹201,064` protected if top 3 interventions are executed.
5. **Scan the 192-Loom Micro-Matrix**:
   - Shed 1 on the left, Shed 2 on the right.
   - Green (🟢) = Optimal (> 90% efficiency), Amber (🟡) = Attention (80–90%), Red (🔴) = Critical (< 80%).
   - Click any machine cell (e.g. `AJ-118`) to immediately jump into its Root Cause Investigation profile.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"Good morning, everyone. By the time your morning report lands on your desk at 9 AM, the money has already left the mill. Across 192 looms, supervisors spend 60 minutes per shift compiling numbers into spreadsheets. Loom AI replaces that with live operational truth. Today's verdict: Electrical and power is the largest loss (62.3%). Approving the transformer inspection right now protects ₹201,064 before the shift ends."*

- **Visual Callouts**: Point to the live ambient bar, the bold Owner Operational Verdict in the center, and the 192-loom floor matrix.
- **ROI Metric**: **₹2,01,064 immediate value protected today.**

---

## Slide 2: Daily Production Decision Workspace

![Slide 2 - Daily Production](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/02_daily_production.png)

### 👤 Primary Stakeholder Role
**Weaving Superintendent, Shift In-Charges & Production Supervisors**

### 📘 What is the Use (User Manual)
The **Daily Production** workspace tracks shift-by-shift output against targets and introduces the mathematical **Shortfall Decomposition Engine**, which eliminates shift-handover disputes.

#### Step-by-Step Operating Instructions:
1. **Track Output Position**:
   - Review total metres produced vs. scheduled budget.
   - Check the running fleet efficiency percentage.
2. **Review the Production Situation Card**:
   - Read the primary operational sentence explaining why output is deviating from target.
   - Review Dominant Drivers tags (e.g., `Electrical Outlier`, `Speed Deficit`).
   - Click `[Explain]` to open the contextual drawer for multi-factor reasoning.
3. **Examine the Shortfall Decomposition Card**:
   - Understand the mathematical breakdown of the 270-metre gap:
     - **Stoppage Loss**: 185 m lost to physical downtime.
     - **Speed Loss**: 55 m lost from looms running below standard RPM.
     - **Quality Downgrades**: 20 m lost to fabric defects and B-grade sort cuts.
     - **Unallocated Operational Delay**: 10 m from operator creeling turnaround.
4. **Action the Production Recovery Queue (Act Now)**:
   - Review the top 3 prioritized interventions ranked by metre gain:
     - **1. Loom AJ-118**: Recalibrate electronic let-off sensor (+110 m recovery).
     - **2. Loom AJ-132**: Adjust weft feeder accumulator tension (+85 m recovery).
     - **3. Loom AJ-146**: Motor bearing thermal check (+75 m recovery).
   - Click `[Assign Fix]` to issue an immediate work ticket to maintenance.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"When daily production falls short by 270 metres, who is at fault? Maintenance blames operators, and operators blame yarn quality. Loom AI ends the debate: exactly 185 metres were lost to stoppage, 55 metres to speed loss, and 20 metres to quality downgrades. Every single metre is accounted for with zero mathematical guessing."*

- **Visual Callouts**: Highlight the Shortfall Decomposition 4-bar breakdown and the Act Now Recovery Queue.
- **Key Concept**: Emphasize **The Zero LLM Calculation Rule**—all numbers are deterministic SQL/Python math, not hallucinated text.

---

## Slide 3: Loom Fleet Performance Leaderboard

![Slide 3 - Loom Performance](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/03_loom_performance.png)

### 👤 Primary Stakeholder Role
**Weaving Superintendent & Line Supervisors**

### 📘 What is the Use (User Manual)
The **Loom Performance** workspace ranks all 192 looms by OEE, speed stability, and pick delivery, allowing supervisors to detect slow and lagging machines.

#### Step-by-Step Operating Instructions:
1. **Filter by Priority Triage Strip**:
   - Click `Attention (45)` or `Critical (19)` to isolate machines requiring supervisory intervention.
2. **Sort Columns**:
   - Click the column headers for **RPM**, **Picks**, or **Efficiency %** to rank top vs. bottom machines.
3. **Inspect Loom Attributes**:
   - Compare Actual RPM against Style Standard RPM to detect speed bottlenecks.
   - Check Warp and Weft stop frequencies per 1,000 picks.
   - Note the current active style code and assigned weaver ID.
4. **Trigger Deep Diagnosis**:
   - Click `[Diagnose]` on any machine row to open its 360° health record and historical telemetry.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"Notice how easily our supervisors identify speed bottlenecks. Loom AJ-118 is weaving at 580 RPM while its sister loom AJ-162 is weaving at 640 RPM on the identical yarn sort. Over a week, that RPM gap costs ₹30,000. In a traditional mill, that loss is completely invisible on paper."*

- **Visual Callouts**: Point to the triage strip badges and compare top-performing Loom AJ-162 (98.6%) with outlier AJ-118 (74.1%).

---

## Slide 4: Breakdown Insights & Golden Benchmark

![Slide 4 - Breakdown Insights](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/04_breakdown_insights.png)

### 👤 Primary Stakeholder Role
**Chief Maintenance Engineer & Weaving Master**

### 📘 What is the Use (User Manual)
Answers *"What happened?"* across the factory floor by categorizing all stop events into a Pareto distribution and comparing machines against peer champions.

#### Step-by-Step Operating Instructions:
1. **Analyze Operational Pareto Distribution**:
   - Review stoppage hours grouped by root category: Electrical & Power (62.3%), Mechanical (18.4%), Warp/Weft Breaks (11.2%), and Pneumatic (8.1%).
2. **Examine the Golden Peer Benchmark**:
   - Review Loom `AJ-162`—operating at 98.6% efficiency on the exact same fabric style.
   - Compare its low stop rate against problem machine `AJ-118` (74.1% efficiency).
3. **Toggle Metrics**:
   - Switch between **Total Downtime (hours)**, **Stoppage Count (frequency)**, and **Production Loss (metres)**.
4. **Navigate to Detailed Workspaces**:
   - Use the sub-navigation bar to jump to **Root Cause Analysis**, **Abnormal Events**, or **Production Loss Impact**.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"Look at the Pareto chart: Electrical & Power interruptions account for 62.3% of lost downtime today. But notice our Golden Benchmark: Loom AJ-162 achieves 98.6% efficiency on this exact yarn batch. That proves the yarn is fine—the problem is localized electrical harmonic trips on Shed 1 sub-panels."*

- **Visual Callouts**: Point to the Electrical & Power Pareto bar (62.3%) and the Golden Benchmark card for AJ-162.

---

## Slide 5: Root Cause Analysis (3-Tier Causal Chain)

![Slide 5 - Root Cause Analysis](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/05_root_cause_analysis.png)

### 👤 Primary Stakeholder Role
**Chief Maintenance Engineer & Electrical/Mechanical Technicians**

### 📘 What is the Use (User Manual)
Answers *"Why did it happen?"* by correlating high-frequency sensor readings, PLC error codes, and operational baselines into an audited causal chain.

#### Step-by-Step Operating Instructions:
1. **Select an Incident**:
   - Choose any recorded stop event from the incident selector (e.g. `EVT-118-092` on Loom AJ-118).
2. **Inspect the Sensor Chronology**:
   - Review millisecond-by-millisecond motor amperage, RPM deceleration, and pneumatic pressure leading up to the trip.
3. **Read the 3-Tier Causal Evidence Chain**:
   - `[OBSERVED]`: Motor current drew +28% excess amperage while speed dropped over 4 minutes.
   - `[INFERRED]`: Drive belt slip coupled with thermal expansion in the gearbox bearing assembly.
   - `[PREDICTED]`: If unlubricated within 6 hours, catastrophic seizure probability is 92%, resulting in an 8-hour loom overhaul.
4. **Evaluate MTTR vs. Historical Baseline**:
   - Compare this repair duration (85 min) against the 30-day mean baseline (42 min) to identify maintenance delays.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"This is the engineering heart of Loom AI. On Loom AJ-118, we don't just see a 'motor trip'. We observe motor current drawing +28% excess amperage while speed dropped over 4 minutes. We infer belt slip and gearbox bearing thermal expansion. And we predict that without lubrication, catastrophic seizure risk is 92%. We prevent the seizure before it destroys the motor."*

- **Visual Callouts**: Point to the 3 distinct badges: Blue `[OBSERVED]`, Amber `[INFERRED]`, and Red `[PREDICTED]`.

---

## Slide 6: Abnormal Events & Time-of-Day Progression

![Slide 6 - Abnormal Events](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/06_abnormal_events.png)

### 👤 Primary Stakeholder Role
**Operations Head & Floor Shift Supervisors**

### 📘 What is the Use (User Manual)
Answers *"What is unusual across time?"* by detecting abnormal machine stop surges across a horizontal 24-hour clock.

#### Step-by-Step Operating Instructions:
1. **Scan the Anomaly Time-of-Day Progression**:
   - Review the 9 time buckets (06:00 to 22:00) to identify when abnormal behavior surged.
2. **Review Critical Clusters**:
   - Note the prominent red alert card at **14:00** indicating 184 stop events occurred simultaneously across Shed 2.
   - Hover over the time slot to see the full list of affected looms.
3. **Review Material Anomaly Cards**:
   - Examine detected machine anomalies with baseline comparison bars (Normal vs. Current).
   - Check Correlated Signals (e.g. Break frequency, Running style, Compressor pressure).
4. **Trigger Actions**:
   - Click `[Watch]` to add a machine to the next shift's watchlist.
   - Click `[Why abnormal?]` to view statistical deviation models.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"Notice this sudden surge at 14:00: 184 anomalies detected simultaneously across Shed 2. It wasn't 184 separate mechanical failures—it was a 1.2 bar pressure drop from Main Compressor #2! Loom AI correlated pneumatic pressure with machine trip logs instantly, stopping the weaving master from blaming innocent operators."*

- **Visual Callouts**: Point to the clean 9-slot Time-of-Day Progression timeline and the 14:00 surge cluster.

---

## Slide 7: Production Loss Impact & Financial Waterfall

![Slide 7 - Production Loss Impact](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/07_production_loss_impact.png)

### 👤 Primary Stakeholder Role
**General Manager Operations & Finance Head**

### 📘 What is the Use (User Manual)
Answers *"How much did it cost?"* by reconciling physical downtime minutes and metres into financial loss positions without double-counting.

#### Step-by-Step Operating Instructions:
1. **Review Cumulative Production Loss**:
   - Check total rupee exposure (`₹3,12,400`) based on active fabric sort pricing.
2. **Inspect the Production Loss Waterfall**:
   - Follow the step-down reconciliation from Gross Potential Capacity down to Realized Output.
3. **Analyze Category Rupee Losses**:
   - Electrical & Power: ₹1,94,600 | Mechanical: ₹57,400 | Operations: ₹35,000 | Quality: ₹25,400.
4. **Audit the 3-Tier Recovery Ledger**:
   - **Immediate Recovery Tier**: ₹2,01,064 recoverable before the shift ends.
   - **Scheduled Maintenance Tier**: Recoverable during the weekend planned maintenance shutdown.
   - **Permanent Loss Tier**: Unrecoverable downtime.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"Traditional reports double-count: if a machine stops and runs slow on the same shift, standard software inflates the loss. Loom AI's waterfall strictly reconciles every rupee to 100% of capacity. Today's total stoppage loss is ₹3,12,000, with ₹2,01,000 immediately recoverable if our maintenance team acts on our top 3 ledger recommendations."*

- **Visual Callouts**: Highlight the step-by-step waterfall chart and the 3-Tier Recovery Ledger.

---

## Slide 8: Revenue & Loss — The Owner's Decision Room

![Slide 8 - Revenue and Loss](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/08_revenue_and_loss.png)

### 👤 Primary Stakeholder Role
**Managing Director, Plant Owner & CFO**

### 📘 What is the Use (User Manual)
The executive decision room for Mill Owners and CFOs. It provides total commercial visibility, holding each department head accountable for revenue leakage.

#### Step-by-Step Operating Instructions:
1. **Read the Executive Decision Verdict**:
   - Single-sentence summary of today's P&L status and recommended owner action.
2. **Inspect the Commercial Revenue Waterfall**:
   - Theoretical Gross Revenue (`₹24,80,000`)  
     − Speed Deficit (`-₹1,12,000`)  
     − Stoppage Loss (`-₹3,12,000`)  
     − Quality Downgrade (`-₹66,000`)  
     = **Realized Net Revenue (`₹19,89,951`)** at 32.0% contribution margin.
3. **Review Departmental Loss Attribution**:
   - Hold department heads accountable: Electrical (62.3%), Maintenance (18.4%), Operations (11.2%), Quality (8.1%).
4. **Execute Component Action Prescriptions**:
   - Sign off on maintenance recommendations with assigned engineers, deadlines, and audited verification gates.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"This is the Owner's Decision Room. You don't have to wade through 50 technical logs. You see: Gross Revenue ₹24.8 Lakhs, Realized Net Revenue ₹19.9 Lakhs. Who owns the ₹4.9 Lakh gap? Electrical owns 62%, Maintenance owns 18%, Operations owns 11%. And at the bottom, an exact action prescription with an assigned engineer and verified ROI."*

- **Visual Callouts**: Point to the Owner Verdict hero card, the commercial waterfall, and the departmental attribution breakdown.

---

## Slide 9: Workforce Intelligence & Manpower Optimization

![Slide 9 - Workforce Intelligence](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/09_workforce_intelligence.png)

### 👤 Primary Stakeholder Role
**Weaving Superintendent & HR Operations**

### 📘 What is the Use (User Manual)
Normalizes weaver efficiency against fabric sort complexity, ensuring objective evaluations and optimal machine assignments.

#### Step-by-Step Operating Instructions:
1. **Review Promotion Readiness & Grade Alignment**:
   - Identify operators consistently outperforming their current pay grade (14 mismatches identified).
2. **Inspect Operator Candidate Leaderboard**:
   - Review running picks, warp/weft repair turnaround times, and style-adjusted efficiency.
3. **Check Shift Loss Attribution**:
   - Objectively determine whether a deficit was caused by weaver knotting delay or mechanical machine faults.
4. **Optimize Loom Allocation**:
   - Pair senior weavers with high-density, tricky styles and apprentice weavers with stable cotton sorts.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"A machine is only as good as the weaver running it. But comparing weavers on total metres is unfair if one is weaving a high-density satin and another is running plain cotton. Loom AI normalizes weaver efficiency for style complexity, identifying top talent objectively and optimizing loom-to-weaver pairing for a 3.5% shed boost."*

- **Visual Callouts**: Point to the Grade Alignment Mismatch alert and the ranked operator performance table.

---

## Slide 10: Autonomous AI Agents Hub

![Slide 10 - AI Agents Hub](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/screenshots/10_ai_agents_hub.png)

### 👤 Primary Stakeholder Role
**IT Lead, Plant Head & Executive Leadership**

### 📘 What is the Use (User Manual)
Manages Loom AI's 5 autonomous agents running continuous deterministic loops for 24/7 surveillance, predictive maintenance, and opportunity discovery.

#### Step-by-Step Operating Instructions:
1. **Monitor Proactive Mill Surveillance Stream**:
   - Real-time event feed alerting managers to emerging micro-trips and shift handover anomalies.
2. **Review Opportunity Detector Findings**:
   - Evaluate detected output upside (e.g. Style ST-4100 speed step-up headroom).
3. **Inspect Predictive Maintenance Scores**:
   - Review days-to-failure forecasts for bearings, rapier drives, and motors.
4. **Query the Decision Assistant (Ask Engine)**:
   - Type plain-language questions like *"Why did Shed 2 drop 4% in Shift 2?"* to receive verified, cited answers.

### 🎙️ Use in Presentation (Slide Pitch & Script)
> *"This is the autonomous brain of Loom AI. Five specialized agents monitor the plant 24/7. Look at what our Opportunity Detector found today: Style ST-4100 is running at 605 RPM with a weft break rate of only 0.6 per 1,000 picks. By stepping up inverter speed by +25 RPM, you unlock +640 metres and +₹25,600 profit per shift safely without risk of yarn breakage!"*

- **Visual Callouts**: Point to the 5 Agent status cards and the Style ST-4100 Opportunity card (+640m, +₹25,600).

---

## 🚀 How to Deliver This Presentation

1. **Open the Slide Deck**: Open [`docs/presentation_slides/index.html`](file:///c:/Users/gokul/Loom-AI/docs/presentation_slides/index.html) in Google Chrome or Microsoft Edge.
2. **Enter Full Screen**: Press `F11` or click the `[⛶ Fullscreen]` button in the top right header.
3. **Navigate Through Slides**: Use your keyboard `Right Arrow` to advance and `Left Arrow` to go back.
4. **Toggle Details**: On each slide, click between **📘 User Manual**, **🎙️ Presentation Pitch**, and **🎯 Screen Highlights** tabs.
5. **Zoom In**: Click on any screenshot image to open an expanded high-resolution lightbox view.
6. **Handout Printing**: Click `[🖨️ Save PDF]` or press `Ctrl+P` to generate an executive-ready multi-page PDF presentation.
