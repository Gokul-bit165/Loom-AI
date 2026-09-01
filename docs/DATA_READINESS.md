# Loom-AI Data Readiness & Quality Engine

## 1. Data Readiness Maturity Tiers

Every KPI and metric exposed in the platform is tagged with one of four explicit data maturity classifications:

| Maturity Status | Definition | Example Field | User Interface Indicator |
|---|---|---|---|
| **`AVAILABLE`** | Live/direct feed from machine controller, ERP, or verified log | `actual_picks`, `running_minutes`, `metres` | Solid Green Indicator |
| **`CALCULATED`** | Deterministic mathematical calculation from verified available fields | `loom_efficiency_pct`, `utilization_pct` | Solid Blue Indicator |
| **`ESTIMATED`** | Derived value based on industry benchmarks, standard rate cards, or proxies | `lost_revenue_rs`, `air_loss_financial_cost` | Amber Tag with Basis Tooltip |
| **`PARTIAL / MISSING`**| Insufficient upstream data to compute safely | `profit_after_direct_costs` (missing itemized yarn batch cost) | Grey Muted Tag with "Data Feed Pending" |

---

## 2. Data Quality Engine & Automated Validation Rules

The ingestion engine executes 12 deterministic validation checks on all incoming machine and manual data batches:

1. **`CK_LOOM_EXISTS`**: Loom ID must match an active registered machine in `loom` master.
2. **`CK_NON_NEGATIVE`**: Picks, metres, running minutes, and break counts must be $\ge 0$.
3. **`CK_RUNNING_LE_SCHEDULED`**: `running_minutes` must be $\le \text{scheduled\_minutes}$ (typically 480 min per shift).
4. **`CK_REASONABLE_RPM`**: Calculated RPM (`picks / running_minutes`) must be within [50%, 120%] of nominal standard RPM.
5. **`CK_TIMESTAMPS_ORDER`**: For stop events: $\text{raised\_at} \le \text{acknowledged\_at} \le \text{attending\_at} \le \text{resolved\_at}$.
6. **`CK_NO_OVERLAPPING_STOPS`**: No two breakdown events on the same loom can have overlapping time intervals.
7. **`CK_REASON_CODE_VALID`**: Breakdown category must match registered reason codes.
8. **`CK_STYLE_RATE_EXISTS`**: Rate card must exist for the style; if missing, falls back to `ESTIMATED` rate with notice.
9. **`CK_ATTENDANCE_FEASIBLE`**: Operator present count cannot exceed total registered employee headcount.
10. **`CK_CFM_REASONABLE`**: Measured CFM must be within physical compressor limits ($0 \le \text{CFM} \le 120$).
11. **`CK_CRIMP_LIMITS`**: Fabric crimp % must be within realistic physical bounds ($1.0\% \le \text{crimp} \le 30.0\%$).
12. **`CK_DUPLICATE_SHIFT_LOG`**: Unique constraint on `(loom_id, work_date, shift_id, is_current=True)`.

### 2.1 Factory Data Quality Index (DQI)
```
DQI = (1 - (Critical_Errors * 1.0 + Warnings * 0.2) / Total_Data_Points) * 100
```
Displayed prominently on the Command Center and Import Wizard (e.g. **97.4% Health Score** with actionable warning logs).
