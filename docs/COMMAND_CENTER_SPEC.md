# LOOM AI — COMMAND CENTER 2.0: OWNER DECISION PRODUCT SPECIFICATION
**Product:** Loom AI · Owner Decision Screen  
**Plant:** Ashok Textile Mills (ATM) — Weaving Division (192 Looms, 3 Shifts)  
**Theme:** Light Industrial Enterprise SaaS (`#F6F8FA` background, `#FFFFFF` surfaces, 1px `#E2E6EA` structural borders)

---

## 1. The Owner Mental Model (30-Second Morning Review)

```
OPEN SCREEN  →  UNDERSTAND SITUATION  →  DECIDE ON PRIORITIES  →  ACT WITH CONFIDENCE
```

### The 5 Core Areas:
1. **A. TODAY**:
   - **1-Sentence Verdict**: `"Output is below plan. The main loss is concentrated in 2 looms."`
   - **4 Core Numbers Only**:
     - `OUTPUT`: 49,748 m (Target 54,600 m, -8.9%)
     - `EFFICIENCY`: 86.2% (Target 89.6%, -3.4 pp)
     - `LOSS & GAP`: ₹90,400 EST. (4,852 m shortfall gap)
     - `REVENUE`: ₹19.90 L Realized Net
2. **B. ACT NOW (The Heart of the Product)**:
   - Maximum **3 items** ranked strictly by business impact:
     - Priority 1: Loom AJ-118 stoppage downtime (509 min) $\to$ ₹37,500 exposure $\to$ *Inspect electrical line & drive relays before next shift*.
     - Priority 2: Loom AJ-132 recurring stops (245 min) $\to$ ₹17,200 exposure $\to$ *Inspect weft feeder and main nozzle alignment*.
     - Priority 3: Total production gap (4,852 m shortfall) $\to$ *Rebalance standby weaver allocation and verify Shift 3 staffing*.
3. **C. WHY ARE WE OFF PLAN? (Simple Percentage Breakdown)**:
   - Target Shortfall: `4,852 m`
   - Contribution Stack: Downtime `48%` · Weft Breaks `26%` · Efficiency Drift `18%` · Other `8%`
   - Managerial Takeaway: *"Downtime is the largest contributor (48% of total shortfall)."*
4. **D. WHAT COULD GO WRONG NEXT & AI FINDINGS**:
   - **AI Findings (Max 2)**:
     - Finding 1: *"Loom AJ-118 downtime is unusually high (2.4× normal baseline)"* (509 min today vs 210 min baseline).
     - Finding 2: *"Production loss is heavily concentrated in 3 looms (78% of total downtime)"*.
   - **Next Risk (1 Forward Risk)**:
     - Loom AJ-132: High breakdown risk (82% probability next 24h) due to rising weft breaks $\to$ *Inspect weft feeder solenoid before next shift*.
5. **E. HOW ARE WE DOING OVER TIME**:
   - **3 Compact Trends**: Production, Efficiency, Revenue (7D / 30D / 90D selector with executive sentence).
   - **SINCE YESTERDAY**: Movement strip (Output -3.8%, Efficiency -2.1 pp, Downtime +24%, Main change driver).
   - **LAST ACTION RESULT**: Compact 1-line verified outcome (*AJ-112: Downtime ↓ 31%, Efficiency 82.0% → 90.5% (VERIFIED)*).
   - **Contextual AI Slide-over Drawer**: Right-side drawer opened on demand via `[Explain]` button.

---

## 2. Data Trust & Backend Guarantees

- **Zero Fabricated Fallbacks:** When querying a date with no telemetry data, the backend returns honest `data_available: false` with `"NO TELEMETRY DATA RECORDED FOR THIS DATE"` rather than substituting fabricated values like 49,748 or 54,600.
- **Dynamic Calculation:** All output, targets, downtime minutes, revenue exposure, and reason codes are queried directly from `ProductionLog`, `ProductionTarget`, `StopEvent`, and `Style` master tables.
