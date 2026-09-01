# Loom AI — Plant Management Demo & Pilot Evaluation Guide

This guide walks plant managers, technical directors, and IT auditors through evaluating Loom AI V1 during a company pilot.

---

## 1. Quick Start Demonstration

### Step 1: Start the Backend API
In terminal 1:
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Start the Management Frontend
In terminal 2:
```bash
cd frontend
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 2. 10-Second Plant Health Check Flow

1. **Check Top Provenance Banner**:
   - Notice the amber banner: `DEMO / SYNTHETIC DATASET (Synthetic Grounded Factory V1)`.
   - Confirms that the system never confuses demonstration numbers with live plant data.
2. **Review Target Variance (Q1 KPI)**:
   - On `2026-08-29`, actual production is `1,765,471 units` against a target of `1,888,200 units` (Efficiency: `93.5%`, Variance: `-122,729 units`).
3. **Inspect the "ATTENTION REQUIRED" Section**:
   - Immediately notice seeded chronic underperformers surfaced by the deterministic algorithm:
     - **`TOY-08`** (Critical efficiency: `76.76%`, variance: `-15,129 units`).
     - **`RF-11`** (Critical downtime: `256 mins` across 4 shift stoppages).
4. **Review Downtime Causes (Q5 KPI)**:
   - Total lost time: `2,698 mins` across `42 stoppage events`.
   - Highest downtime loom: `SUL-04` (`416 mins`).
5. **Review Commercial Revenue (Q21 KPI)**:
   - Today's revenue: `₹592,446.20` | Month-to-date: `₹17,259,235.26`.
   - Top grossing style: `Liveaco Compact` (`39.73%` share).

---

## 3. Five Demo Audit Scenarios

### Scenario 1: Auditing Number Traceability (Evidence UX)
1. Click **"Drilldown"** on the Production card or navigate to `/production`.
2. Locate `TOY-08` in the drilldown table.
3. Click **"3 rows"** under the **Audit** column.
4. An evidence drawer opens displaying the exact database primary keys (`#15878, #15908, #15938`).
5. Cross-reference this directly with PostgreSQL:
   ```sql
   SELECT date, shift, machine_id, target_qty, actual_qty, efficiency_pct 
   FROM production_logs WHERE id IN (15878, 15908, 15938);
   ```
   *Result*: Exactly matches the numbers on screen with zero hallucination.

### Scenario 2: Stoppage Reason Pareto & Drilldown
1. Navigate to `/breakdown`.
2. Notice the Pareto distribution:
   - `Full cleaning work` represents `39.44%` of all lost minutes (`1,064 mins`).
   - `Bobbin shortage` accounts for `19.5%` (`526 mins`).
3. Toggle between **"Today's View"** and **"Month-to-Date (MTD)"**.
4. Click **"Audit"** on any machine row to see the exact breakdown event IDs.

### Scenario 3: Checking Revenue Loss Integrity
1. Navigate to `/revenue`.
2. Notice that while realized revenue is shown (`₹592,446.20`), the revenue loss card displays:
   `revenue_loss_available = false` with the exact audited rationale explaining why monetary loss is not fabricated without price books.

### Scenario 4: Natural Language AI Assistant
1. Navigate to `/ask`.
2. Click on the suggested prompt: *"How did production perform today?"*.
3. Review the response:
   - **Answer**: Clear executive summary.
   - **Key Findings**: Exact computed quantities from SQL.
   - **Suggestions**: Conservative, operationally grounded recommendations (e.g. *"Review shift logs and schedule mechanical inspection for underperforming machine TOY-08"*).
   - Click **"View Supporting Data"** to audit the underlying row IDs.

### Scenario 5: Testing Out-of-Scope Protection
1. In `/ask`, enter: *"What is the worker attendance and salary today?"*.
2. Notice the instant deterministic rejection:
   `"This question is outside the current V1 scope. Loom AI V1 currently supports Q1, Q5, and Q21."`
   *Zero fabricated answers or simulated headcount data.*
