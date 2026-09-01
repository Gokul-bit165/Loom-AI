# Loom-AI Machine Learning Architecture

## 1. Objectives & ML Pipelines

1. **24-Hour Loom Breakdown Probability Classifier (Q14)**:
   - Predicts whether loom $i$ will suffer a major breakdown (> 30 min stoppage) in the subsequent 24 hours.
2. **Loom Maintenance Cost Forecaster**:
   - Estimates expected maintenance spares & labor cost for the upcoming calendar month.

---

## 2. Feature Engineering Pipeline

All features are calculated dynamically from structured operational logs:

| Feature Name | Description | Calculation Window |
|---|---|---|
| `downtime_7d_avg` | Rolling daily downtime (minutes) | Trailing 7 days |
| `downtime_30d_avg` | Baseline rolling daily downtime | Trailing 30 days |
| `downtime_delta_ratio` | Ratio of 7-day average to 30-day baseline | `downtime_7d_avg / max(downtime_30d_avg, 1)` |
| `warp_break_rate_7d` | Average warp breaks per 1,000 picks | Trailing 7 days |
| `weft_break_rate_7d` | Average weft breaks per 1,000 picks | Trailing 7 days |
| `eff_7d_avg` | Average loom efficiency % | Trailing 7 days |
| `eff_trend_slope` | Linear regression slope of daily efficiency | Trailing 14 days |
| `days_since_pm` | Days elapsed since last scheduled preventive maintenance | Current Date - Last PM Date |
| `electrical_stops_7d` | Count of voltage/drive stops in past 7 days | Trailing 7 days |
| `air_cfm_excess_ratio` | Actual CFM / Standard CFM | Trailing 3 days |
| `machine_age_years` | Operational machine age | Current Date - Install Date |

---

## 3. Model Architecture & Training Strategy

- **Classifier Model**: Random Forest & LightGBM / Gradient Boosting Classifier.
- **Time-Aware Cross Validation**: Rolling 14-day train window with forward-chaining validation (no future data leakage).
- **Target Definition**: Binary $y \in \{0, 1\}$ where $y=1$ if total unplanned downtime on day $t+1 > 30$ minutes.

---

## 4. Safety, Honesty, and Guardrails (Anti-Slop)

1. **Data Sufficiency Gate**:
   - Minimum training requirements: $\ge 30$ historical days of continuous machine logs.
   - If historical records are fewer than 30 days, the API strictly returns:
     `{"prediction_available": false, "status": "INSUFFICIENT_HISTORICAL_DATA", "days_available": N, "min_required": 30}`
2. **Transparent Performance Metrics**:
   - Real test set metrics displayed to the user: ROC-AUC, Precision, Recall, F1 Score, and Confusion Matrix.
   - No fabricated or hardcoded accuracy claims.
3. **Demo / Synthetic Data Flag**:
   - If operating on synthetic or demonstration data, the UI and API explicitly tag `data_mode: "DEMO_DATA"`.
