# Loom-AI Data Architecture Specification

## 1. Relational Entities & Relational Schema

The data architecture connects physical floor telemetry, ERP order books, manpower rosters, maintenance logs, and laboratory quality feeds into a unified schema.

```
                    ┌─────────────────────────┐
                    │       Unit / Shed       │
                    └───────────┬─────────────┘
                                │ 1:N
                    ┌───────────▼─────────────┐
                    │          Loom           │
                    └───┬───────┬───────┬─────┘
                        │       │       │
       ┌────────────────┼───────┼───────┼────────────────┐
       │ 1:N            │ 1:N   │ 1:N   │ 1:N            │ 1:N
┌──────▼────────┐ ┌─────▼───────┐ ┌─────▼───────┐ ┌──────▼───────┐ ┌─────▼───────┐
│ProductionLog  │ │ StopEvent   │ │Maintenance  │ │ AirLog       │ │QualityLog   │
│- actual_picks │ │- raised_at  │ │- scheduled  │ │- actual_cfm  │ │- defects    │
│- metres       │ │- resolved_at│ │- overrun_min│ │- excess_cfm  │ │- crimp_pct  │
│- warp/weft brk│ │- reason_id  │ │- recurring  │ │- air_cost    │ │- yarn_waste │
└───────────────┘ └─────────────┘ └─────────────┘ └──────────────┘ └─────────────┘
```

### Core Tables & Models

1. **`unit` & `shed`**: Operational hierarchy for ATM (Ashok Textile Mills) and external partner units.
2. **`loom`**: Loom master tracking loom number, type (Air-Jet Tsudakoma ZAX, Sulzer Rapier), installation date, shed, status.
3. **`style`**: Fabric master with warp ends, picks per metre, standard crimp %, standard RPM, standard efficiency %, and confirmed/estimated selling rate per metre.
4. **`shift_master`**: 3 standard 8-hour factory shifts (Shift 1: 06:00-14:00, Shift 2: 14:00-22:00, Shift 3: 22:00-06:00).
5. **`employee` & `manpower_attendance`**: Operators, Fitters, Knotters, Electricians with grades (G1 to G6+), shift attendance, present/absent flag, assigned loom count.
6. **`production_log`**: Primary shift telemetry record: `running_minutes`, `scheduled_minutes`, `actual_picks`, `metres`, `kilo_picks`, `warp_breaks`, `weft_breaks`, `actual_crimp_pct`.
7. **`stop_event`**: Granular breakdown and downtime events with lifecycle timestamps (`raised_at`, `acknowledged_at`, `attending_at`, `resolved_at`), `reason_code_id`, `failed_component`, `fix_action`.
8. **`maintenance_record`**: PM/BD maintenance tasks, scheduled vs actual duration, overrun minutes, cost of spares, technician notes, recurring flag.
9. **`air_consumption_log`**: Standard CFM, actual CFM, air pressure (bar), compressor power, calculated excess CFM and air leakage cost.
10. **`quality_defect_log`**: Inspection rolls, total inspected metres, defect count by category (warp float, weft miss, oil stain, reed mark), crimp measurement, yarn waste kg.
11. **`cost_master` & `revenue_log`**: Power tariff per kWh, raw yarn cost/kg, direct labour rate/shift, overheads, fabric selling rate.
12. **`recommendation_decision_action`**: Audit trail for AI/expert recommendations (Status: `OPEN`, `ACKNOWLEDGED`, `ASSIGNED`, `COMPLETED`, `VERIFIED`), action taken, before/after impact metrics.

---

## 2. Separation of Measured, Calculated, and Estimated Values

| Data Point | Category | Source / Formula |
|---|---|---|
| Actual Picks, Running Minutes | **MEASURED** | Machine PLC / Loom Controller |
| Scheduled Minutes | **MEASURED** | Shift Master (480 min standard) |
| Loom Efficiency % | **CALCULATED** | `actual_picks / (std_rpm * scheduled_minutes) * 100` |
| Performance Efficiency % | **CALCULATED** | `actual_picks / (std_rpm * running_minutes) * 100` |
| Utilization % | **CALCULATED** | `running_minutes / scheduled_minutes * 100` |
| Lost Production (Kg / Metres) | **ESTIMATED** | `(std_target_picks - actual_picks) * pick_density_factor` |
| Lost Revenue (₹) | **ESTIMATED** | `metres_lost * selling_rate_per_metre` |
| Profit / Contribution (₹) | **CALCULATED / ESTIMATED** | `Revenue - (Yarn_Cost + Power_Cost + Maintenance_Cost + Labour)` |
| 24h Breakdown Risk | **MODEL PREDICTED** | Gradient Boosted Classifier Probability |

---

## 3. Data Integrity & Ingestion Safeguards
- Zero division protection via `_safe_div`.
- No fake 0%: Missing parameters return explicit `None` / `null` with data status.
- Lossless superseding: Historical batches preserved via `is_current` and `import_batch_id`.
- Anomaly filtering: Overlapping breakdown intervals and negative durations are rejected at ingestion.
