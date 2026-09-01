# Loom-AI Product Redesign Specification

## 1. Vision & Core Paradigm Shift
Loom-AI is transformed from a passive reporting dashboard into an active **Textile Weaving Decision Intelligence Platform** designed specifically for factory managers, production heads, shed supervisors, and maintenance engineers in modern air-jet and rapier weaving plants (e.g. Ashok Textile Mills).

### The Decision Pipeline
```
                    FACTORY DATA (Machines, ERP, Sensors, Manual Logs)
                                           ↓
                     KPI ENGINE (Deterministic SQL & Analytics)
                                           ↓
                 DIAGNOSTIC & ANOMALY ENGINE (Baselines vs Actuals)
                                           ↓
                BUSINESS IMPACT ENGINE (Kg Lost & Rupee Loss Waterfall)
                                           ↓
               EVIDENCE-BACKED AI RECOMMENDATIONS (P1 - P4 Priorities)
                                           ↓
                   HONEST ML PREDICTIONS (Risk Probabilities & MTBF)
                                           ↓
             MANAGEMENT ACTION WORKFLOW (Open → Ack → Assign → Verify)
```

---

## 2. The 23 Management Questions Matrix

| # | Management Question | Module | Computation Type | Data Readiness | Action Output |
|---|---|---|---|---|---|
| **Q1** | Today's weaving target vs actual production, kilo-pick, efficiency, warp/weft breaks, variance, comparison with yesterday | Production Intelligence | Deterministic SQL | AVAILABLE (Machine/Shift Log) | Target Gap Alert & Production Loss Flag |
| **Q2** | Standard warp/weft time vs actual, extra time, resulting production & revenue loss | Production Intelligence | Deterministic Formula | ESTIMATED / CALCULATED | Stop Time Degradation Warning |
| **Q3** | Looms with highest/lowest production and efficiency, best/worst weaver with normalized ranking | Production Intelligence / Manpower | Multi-factor Ranking | AVAILABLE | Shift Allotment Adjustment |
| **Q4** | Weekly, monthly and yearly production by loom, style, shed with automated observations | Production Intelligence | Historical SQL Aggregation | AVAILABLE | Trend Drift & Beam Planning |
| **Q5** | Looms with highest downtime today vs looms with most breakdown events this month | Breakdown Intelligence | Bimodal Ranking (Downtime vs Frequency) | AVAILABLE | High-Downtime vs High-Frequency Focus |
| **Q6** | MTTR / average downtime per event, Pareto reasons, abnormal breakdown pattern vs 30d baseline | Breakdown Intelligence | Statistical Anomaly (Z-score / IQR) | CALCULATED | Electrical/Mechanical Diagnostic Alert |
| **Q7** | Production & revenue loss from breakdowns, shift breakdown impact | Breakdown Intelligence | Loss Attribution Engine | CALCULATED / ESTIMATED | Financial Loss Impact Card |
| **Q8** | Operators present/absent today and shift attendance distribution | Manpower Intelligence | Attendance Roster Aggregation | AVAILABLE (ERP / Roster) | Absenteeism Red Alert |
| **Q9** | Operator with highest/lowest output and efficiency, shift comparison | Manpower Intelligence | Operator Normalized Efficiency | AVAILABLE | Weaver Skill Re-grading |
| **Q10** | Effect of absenteeism on production & capacity shortage | Manpower Intelligence | Capacity Baseline Shortage Model | ESTIMATED | Understaffing Output Loss Claim |
| **Q11** | Operator grade vs work allotment & standard loom load | Manpower Intelligence | Roster Load vs Grade Matrix | AVAILABLE | Dynamic Re-allotment Suggestion |
| **Q12** | Looms requiring maintenance, overdue preventive maintenance | Maintenance Intelligence | Maintenance Schedule Delta | AVAILABLE (Schedule Master) | Overdue PM Work Order Trigger |
| **Q13** | Scheduled vs actual maintenance duration, overrun %, recurring issues | Maintenance Intelligence | Maintenance Overrun Variance | AVAILABLE / LOG | Fitter Overrun Investigation |
| **Q14** | ML prediction of breakdown risk in next 24h & maintenance cost forecast | Prediction Center | ML Random Forest / Regressor | MODEL (Confidence Gated) | Proactive Preventive Service Alert |
| **Q15** | Standard vs actual CFM air consumption per loom, excess CFM | Air & Compressor | CFM Deviation Calculation | SENSOR / ESTIMATED | Air Leakage Inspection Order |
| **Q16** | Compressor air loss volume and estimated financial cost | Air & Compressor | Pneumatic Loss Cost Model | CALCULATED | Compressor Line Pressure Calibration |
| **Q17** | Air consumption historical comparisons (daily, weekly, quality-wise) | Air & Compressor | Multi-period Air Analytics | SENSOR / CALCULATED | Style-wise Pneumatic Tuning |
| **Q18** | Fabric defect percentage, top defect Pareto, loom/style defect rate | Quality Intelligence | Inspection Log Analytics | AVAILABLE (Fabric Inspection) | Reed/Nozzle Alignment Callout |
| **Q19** | Standard crimp % vs abnormal crimp deviation | Quality Intelligence | Lab Reference vs Lab Measure | LAB LOG / ESTIMATED | Warp Tension Adjustment |
| **Q20** | Yarn waste percentage by shift & material loss | Quality Intelligence | Material Balance Formula | AVAILABLE | Knotter/Weft Waste Control |
| **Q21** | Daily/monthly weaving revenue by loom, style, order | Revenue & Loss | Rate Card × Metres Produced | AVAILABLE (ERP Rate Master) | High-Margin Loom Priority |
| **Q22** | Net revenue, direct cost breakdown & contribution profit | Revenue & Loss | Multi-cost Deduction Model | PARTIAL (Cost-gated) | Operational Profitability Review |
| **Q23** | Revenue Loss Attribution Waterfall (Breakdown, Electrical, Efficiency, Quality) | Revenue & Loss | Mutually-Exclusive Loss Engine | CALCULATED | Loss Elimination Roadmap |

---

## 3. Product Navigation Structure
The left navigation is organized around real management domains:

1. **COMMAND CENTER** (`/command-center`): Single-pane operational cockpit answering "Does management need to intervene today?".
2. **Production** (`/production`): Q1, Q2, Q3, Q4 detailed analysis, warp/weft diagnostics, normalized rankings, multi-period trend.
3. **Breakdowns** (`/breakdowns`): Q5, Q6, Q7 bimodal ranking, MTTR, anomaly detection, reason Pareto, floor logger.
4. **Looms Telemetry** (`/looms`): Operations table & 360° Digital Loom Profile with identity, telemetry, losses, maintenance, and ML risk score.
5. **Manpower** (`/manpower`): Q8, Q9, Q10, Q11 weaver roster, attendance, production per operator, shortage impact.
6. **Maintenance** (`/maintenance`): Q12, Q13, Q14 schedule adherence, overdue list, duration overruns, recurring failure tracker.
7. **Air & Compressor** (`/air`): Q15, Q16, Q17 pneumatic telemetry, CFM deviations, leakage financial impact.
8. **Quality** (`/quality`): Q18, Q19, Q20 defect rate Pareto, crimp variance, yarn waste tracker.
9. **Revenue & Loss** (`/revenue`): Q21, Q22, Q23 revenue by style/loom, contribution profit, loss attribution waterfall.
10. **Predictions (ML)** (`/predictions`): Q14 24h breakdown probability, feature importance, real test set metrics (ROC-AUC, Precision, Recall), cost forecast.
11. **Decision Registry** (`/registry`): Operational status, data coverage %, ML requirement, calculation logic for all 23 questions.
12. **Data & Imports** (`/import`): Ingestion wizard, column mapping, automated quality checks (97.4% health score), validation report.
13. **AI Assistant** (`/assistant`): Structured decision generator (What Happened, Why, Business Impact, Action, Confidence).
