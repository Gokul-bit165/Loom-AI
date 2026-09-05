# LOOM AI — PRODUCTION INTELLIGENCE MODULE SPECIFICATION
## Comprehensive Technical & Industrial Design Document (`PRODUCTION_MODULE_SPEC.md`)

> **Guiding Principle**:  
> *“No feature is considered complete until a Production Manager can validate the calculation, a Weaving Manager can validate the operational interpretation, and an Owner can understand the business implication without opening Excel.”*

> **The Interaction Law**:  
> **DO NOT BUILD EVERY ANALYTIC INTO THE DEFAULT VIEW. THE DEFAULT VIEW IS FOR DECISION-MAKING. ANALYSIS AND AI EXPLANATION APPEAR CONTEXTUALLY WITH ONE CLICK.**

---

## 1. Executive Summary & Factory Context

- **Mill**: Ashok Textile Mills (ATM) — Weaving Division
- **Scale**: 192 Active Looms (Toyoda Airjets & Sulzer Rapiers)
- **Shifts**: 3 Shifts (06:00–14:00, 14:00–22:00, 22:00–06:00) with dynamic `ShiftMaster.scheduled_minutes` from DB
- **Daily Volume**: ~50,000 metres / ~107,000 kilo-picks
- **Objective**: Transform Production into an executive decision workspace where an owner or mill manager moves from **“something is wrong” → “here is why” → “here is the financial exposure” → “do this”** in under 30 seconds.

---

## 2. Minimum-Click Acceptance Criteria

```text
========================================================
MINIMUM-CLICK BUSINESS ACCEPTANCE TEST
========================================================

OWNER:

OPEN PRODUCTION

0 clicks (First Viewport):
Can immediately identify:
- Target (m)
- Actual (m)
- Gap (m & %)
- Efficiency (%)
- Today's Situation (Verdict)
- Act Now (Top 3 actionable interventions)
- Potential Recovery (Metres & ₹)
- AI Insight (One synthesized finding)

1 click:
Can see:
- Evidence & observed records
- Affected looms / shift
- Financial exposure (₹)
- Risk: "What happens if we do nothing?"
- AI interpretation
- Concrete operational recommendation

1 additional click:
Can:
- Assign action
- Acknowledge / Accept
- Dispatch work order
- Record intervention

Maximum:
3 clicks from problem discovery to management intervention.
NO NAVIGATION TO ANOTHER MODULE REQUIRED.
```

---

## 3. First Viewport Design (Owner View)

All values are `<calculated from current validated data>` without hardcoded fallbacks:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ PRODUCTION INTELLIGENCE  •  ATM Weaving  •  <date>  •  Live (updated <min>m ago)            │
│ Views: [● Owner View] [○ Operations View]                                                   │
│ Triage: [ <total_looms> ALL LOOMS ] [ <attention> NEED ATTENTION ] [ <high_impact> HIGH IMPACT ] │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. TODAY'S PRODUCTION POSITION                                                              │
│ Primary KPIs:                                                                               │
│   TARGET: <target_m>    ACTUAL: <actual_m>    GAP: <gap_m> (<gap_pct>%)    EFF: <eff_pct>%    │
│ Supporting inline (low visual weight):                                                      │
│   Kilo-picks: <kilo_picks>   │   Warp breaks: <warp_brk>   │   Weft breaks: <weft_brk>      │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. TODAY'S SITUATION                                                                        │
│ "<verdict_sentence>"                                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. ACT NOW (Production Recovery Queue)                                                      │
│ ┌──────────────────────┬──────────────────────┬──────────────────────┐                      │
│ │ ① <entity_1>         │ ② <entity_2>         │ ③ <entity_3>         │                      │
│ │ <problem_1>          │ <problem_2>          │ <problem_3>          │                      │
│ │ <exposure_inr_1>     │ <exposure_inr_2>     │ <exposure_inr_3>     │                      │
│ │ [<action_verb_1>]    │ [<action_verb_2>]    │ [<action_verb_3>]    │                      │
│ └──────────────────────┴──────────────────────┴──────────────────────┘                      │
├──────────────────────────────────────────────────┬──────────────────────────────────────────┤
│ 4. POTENTIAL RECOVERY (Constrained)              │ 5. AI INSIGHT                            │
│ <recoverable_m> Potential Recovery               │ "<synthesized_lead_finding>"             │
│ <recoverable_inr> Potential Value                │                                          │
│ Top opportunity: <top_opp_loom>                  │                                          │
│ [Explain Recovery]                               │ [Explain]                                │
└──────────────────────────────────────────────────┴──────────────────────────────────────────┘
```

---

## 4. Below First Viewport: Why & Deeper Workspaces

### Section: Why Are We Off Plan? (Decomposition)
- **Downtime**: `<downtime_pct>%` of shortfall `[Explain]`
- **Weft repair time**: `<weft_pct>%` of shortfall `[Explain]`
- **Efficiency gap**: `<eff_pct>%` of shortfall `[Explain]`
- **Other operational factors**: `<other_pct>%` `[Explain]`
*Clicking any `[Explain]` opens the contextual explanation drawer with affected looms and evidence.*

### Navigation Tabs:
1. **Today** (The Executive Viewport above + Why decomposition + Performance Direction)
2. **Performance** (Ranked Looms, Potential Improvement Opportunities, Weaver Ratings, Shift Comparison)
3. **History** (Performance Direction cards, 7D/30D/90D/YTD time-series, Loom Consistency Quadrants)

---

## 5. The Single Explanation Mechanism: Explain -> Decide -> Act

The main screen **summarizes**; the slide-over drawer **explains and triggers action**.

### Request Protocol:
`POST /api/v2/production/ai/explain`
```json
{
  "context_type": "PRODUCTION_GAP" | "LOOM" | "SHIFT" | "RECOVERY" | "REPAIR_TIME" | "HISTORICAL_DECLINE" | "WEAVER",
  "entity_id": "AJ-118",
  "work_date": "2026-07-31",
  "shift_id": null,
  "requested_analysis": "WHY" | "IMPACT" | "RISK" | "ACTION" | "RECOVERY"
}
```

### Drawer Structure (Explain -> Decide -> Act):
```text
┌─────────────────────────────────────────────────────────────┐
│ AI ANALYSIS: <title>                                        │
├─────────────────────────────────────────────────────────────┤
│ 1. EXPLAIN                                                  │
│ WHAT HAPPENED?                                              │
│ <summary_of_observed_occurrence>                            │
│                                                             │
│ OBSERVED EVIDENCE                                           │
│ • <observed_data_point_1>                                   │
│ • <observed_data_point_2>                                   │
│                                                             │
│ LIKELY CONTRIBUTOR (INFERRED)                               │
│ <inferred_causal_mechanism>                                 │
├─────────────────────────────────────────────────────────────┤
│ 2. DECIDE                                                   │
│ IS THIS IMPORTANT?                                          │
│ Classification: ACTION_REQUIRED | WATCH | INFORMATION       │
│                                                             │
│ BUSINESS IMPACT                                             │
│ • Lost Output: <lost_m>                                     │
│ • Revenue Exposure: <lost_inr>                              │
│                                                             │
│ WHAT HAPPENS IF WE DO NOTHING? (RISK)                       │
│ <consequence_if_unaddressed_during_remaining_shifts>         │
├─────────────────────────────────────────────────────────────┤
│ 3. ACT                                                      │
│ RECOMMENDED ACTION                                          │
│ <concrete_operational_directive>                            │
│ Assigned Role: <role>  •  Priority: <priority>              │
│                                                             │
│ Decision Controls:                                          │
│ [Accept & Dispatch Work Order]  [Add to Watchlist]  [Dismiss]│
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Mathematical & Configuration Formulas

### Q1: Position & Variance
- **Scheduled Minutes**: Evaluated dynamically from `ShiftMaster.scheduled_minutes` (never hardcoded as 480).
- **Target Metres**:
  $$\sum \frac{\text{ShiftMaster.scheduled\_minutes} \times \text{ProductionLog.std\_rpm\_snapshot} \times \frac{\text{Style.std\_efficiency\_pct}}{100}}{\text{Style.picks\_per\_metre}}$$
- **Actual Metres**: $\sum \text{ProductionLog.metres}$
- **Loom Efficiency %**:
  $$\frac{\sum \text{ProductionLog.actual\_picks}}{\sum (\text{ShiftMaster.scheduled\_minutes} \times \text{ProductionLog.std\_rpm\_snapshot})} \times 100$$
- **Variance**: $\text{Actual Metres} - \text{Target Metres}$

### Q2: Repair Time Loss
- **Standard Repair Time**: From DB standard (`standard_warp_time_min=15.0`, `standard_weft_time_min=10.0`).
- **Actual Repair Time**: Calculated from `StopEvent` durations (`resolved_at - raised_at`).
- **Loss Governance**: Only `ReasonCategory` codes mapped to operational losses are charged as avoidable repair time. Planned stoppages (`GAITING`, `KNOTTING`) are isolated.
- **Extra Time**: $\max(\text{Actual Time} - \text{Standard Time}, 0)$
- **Revenue Exposure**: $\text{Output Loss (m)} \times \text{Style.revenue\_per\_metre}$

### Q3: Performance & Improvable Opportunities
- **Potential Improvement Opportunity**:
  $$\text{Opportunity} = \max(\text{style.std\_eff} - \text{actual\_eff}, 0) \times \text{Recoverability Factor} \times \frac{\text{sched\_min}}{\sum \text{sched\_min}}$$
- **Weaver Qualification Threshold**: Requires $\ge 360$ scheduled minutes and $\ge 4$ looms handled. Otherwise grouped under `INSUFFICIENT_HOURS`.

### Q4: Configurable Consistency Engine
```python
@dataclass(frozen=True)
class ProductionConsistencyConfig:
    consistent_min_eff: float = 90.0
    consistent_max_stddev: float = 2.5
    declining_max_slope: float = -0.3
    recovering_min_slope: float = 0.4
    volatile_min_stddev: float = 4.5
    min_observation_days: int = 7
```

---

## 7. Modular API Contract

| Endpoint | Method | Scope |
|---|---|---|
| `/api/v2/production/intelligence` | `GET` | Single-viewport Today payload (Position, Verdict, Act Now Queue, Recovery, Decomposition, AI lead, Data Quality) |
| `/api/v2/production/performance` | `GET` | Loom rankings, Potential Improvement Opportunities, Weaver ratings |
| `/api/v2/production/shifts` | `GET` | Shift 1, 2, 3 comparison, telemetry, supervisor log |
| `/api/v2/production/history` | `GET` | Historical direction (30D change), 7D/30D/90D/YTD series, consistency grid |
| `/api/v2/production/loom/{id}` | `GET` | Single-loom 360° drilldown |
| `/api/v2/production/ai/explain` | `POST` | Structured Explain -> Decide -> Act drawer payload |
| `/api/v2/production/summary` | `GET` | Backward-compatible day-level summary |

---

## 8. Definition of Done

1. **Owner Zero-Navigation Test**: Full 0/1/1 click workflow satisfied in under 30 seconds.
2. **Zero Fake Data**: All numbers calculated dynamically from database tables.
3. **Golden Dataset Unit Test**: Asserting code against fixed factory test fixtures within $\pm 0.05\%$.
4. **Cross-Screen Metric Parity**: Production View metres match Command Center (`49,748.8 m`).
