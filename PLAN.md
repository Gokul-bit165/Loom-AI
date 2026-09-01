# Loom AI Reporting System — V1 Plan

**Scope:** Answer Q1 (Production vs Target), Q5 (Breakdown & Downtime), Q21 (Revenue & Loss)
for a 2000+ crore textile mill, using synthetic data shaped by real daily reports,
architected so Q2–Q23 slot in later without a rewrite.

---

## 1. Tech stack

| Layer | Choice | Why |
|---|---|---|
| DB | PostgreSQL | Relational, time-series-friendly, cheap to host |
| ORM | SQLAlchemy (Python) | Same language as your analytics + LLM layer — no context-switch |
| API | FastAPI | Async, typed, pairs naturally with pandas for the analytics layer |
| Analytics | pandas | Deterministic number-crunching — LLM never computes numbers, only narrates |
| LLM | Claude API | Narration + suggestions layer only |
| Frontend | Next.js + Tailwind | You already do full-stack; fast to iterate |

---

## 2. Data model (ORM)

```python
from sqlalchemy import Column, String, Integer, Float, Date, ForeignKey, Enum
from sqlalchemy.orm import declarative_base, relationship
import enum

Base = declarative_base()

class Department(enum.Enum):
    SPINNING = "Spinning"
    WEAVING = "Weaving"
    PREPARATORY = "Preparatory"

class Machine(Base):
    __tablename__ = "machines"
    machine_id = Column(String, primary_key=True)   # e.g. TOY-01, RF-06
    unit = Column(String)                            # Unit I / Unit II
    department = Column(Enum(Department))
    machine_type = Column(String)                    # Toyota, RingFrame, Vortex...
    granularity = Column(String)                      # 'real_grounded' | 'synthetic_loom_number'
    # ^ carried over from data-prep so V2 knows which fields need real-data confirmation

class ProductionLog(Base):
    __tablename__ = "production_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, index=True)
    shift = Column(Integer)
    machine_id = Column(String, ForeignKey("machines.machine_id"), index=True)
    target_qty = Column(Float)
    actual_qty = Column(Float)
    efficiency_pct = Column(Float)
    machine = relationship("Machine")

class BreakdownEvent(Base):
    __tablename__ = "breakdown_events"
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, index=True)
    shift = Column(Integer)
    machine_id = Column(String, ForeignKey("machines.machine_id"), index=True)
    reason = Column(String)
    duration_minutes = Column(Integer)
    machine = relationship("Machine")

class RevenueLog(Base):
    __tablename__ = "revenue_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, index=True)
    shift = Column(Integer)
    machine_id = Column(String, ForeignKey("machines.machine_id"), index=True)
    fabric_style = Column(String)
    revenue = Column(Float)
    machine = relationship("Machine")
```

**Why this shape:** one row per machine per shift per day for each fact table.
Every later question (Q2–Q23) is either a new fact table hanging off `Machine`
(e.g. `MaintenanceLog`, `QualityLog`, `AttendanceLog`) or a new aggregation over
these three existing ones. Nothing here needs to change to add Q6, Q9, or Q18.

---

## 3. Analytics layer (deterministic — no LLM)

One function per question, pure pandas/SQL, unit-testable against the synthetic data:

- `get_production_variance(date)` → target vs actual vs yesterday, per machine + rollup, for Q1
- `get_breakdown_ranking(period="today"|"month")` → highest/lowest breakdown time per machine, for Q5
- `get_revenue_summary(date)` → today's + MTD revenue, best/worst machine or style, for Q21

Each returns a plain dict/DataFrame of numbers — this is the contract the LLM layer consumes, and it's also directly unit-testable: "does the function correctly flag RF-11 as an underperformer" is a real assertion you can write against this dataset today.

## 4. LLM narration layer

```
compute_metrics(question_id, date) -> dict        # analytics layer, step 3
build_prompt(question_id, metrics) -> str          # template per question, numbers only
call_claude(prompt) -> narrative + suggestions
```

The LLM never sees raw logs — only the already-computed dict. This is what keeps the system trustworthy enough to hand a plant manager: every number in the narrative is traceable back to a deterministic function.

## 5. API design

```
GET  /api/production/variance?date=2026-08-14
GET  /api/breakdown/ranking?period=month
GET  /api/revenue/summary?date=2026-08-14
POST /api/ask         { "question": "how did we do today" }   # routes to the above + LLM
```

## 6. Sitemap (frontend)

```
/                    Dashboard — today's snapshot across Q1 + Q5 + Q21
/production          Q1 detail: variance trend, machine-level drill-down
/breakdown           Q5 detail: today's ranking, monthly worst-offender trend
/revenue             Q21 detail: revenue/loss by machine + fabric style
/ask                 Free-text Q&A box → /api/ask
/admin/data-sources  (V2) upload real daily reports, mapped to this schema
```

## 7. Build order (what to actually do, in order)

1. Load `data/*.csv` into Postgres via the SQLAlchemy models above
2. Write and unit-test the 3 analytics functions against the synthetic data (confirm they surface the planted underperformers: RF-11, TOY-08, TOY-02, VTX-06)
3. Wire the LLM narration layer on top
4. Build `/api/ask` + the three FastAPI routes
5. Build the 4 frontend pages against the API — dashboard last, since it's just a composite of the other three

## 8. Extending to Q2–Q23 later

| New question | New table needed? |
|---|---|
| Q2 (warp/weft time loss) | No — derivable from `BreakdownEvent.reason` |
| Q8-11 (manpower) | Yes — `AttendanceLog`, `Operator` |
| Q12-14 (maintenance) | Yes — `MaintenanceLog` |
| Q15-17 (compressor/air) | Yes — `AirConsumptionLog` (needs real sensor/manual data — no report for this yet) |
| Q18-20 (quality) | Yes — `QualityLog` (Image 4 report already shapes this) |

Each new table follows the same `machine_id + date + shift` grain, so the analytics/LLM/API pattern from Q1/5/21 reuses directly — you're not redesigning the architecture, just adding tables and functions.
