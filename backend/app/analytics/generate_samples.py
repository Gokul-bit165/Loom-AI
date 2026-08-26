"""
Script to generate sample JSON outputs for Q1, Q5, and Q21 from the live database.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import get_session
from app.analytics.production import get_production_variance
from app.analytics.breakdown import get_breakdown_ranking
from app.analytics.revenue import get_revenue_summary


def run_samples():
    with get_session() as session:
        # 1. Q1 Production vs Target (latest date in DB)
        q1_res = get_production_variance(session, date="2026-08-29")
        # Trim evidence list for readable sample
        q1_sample = dict(q1_res)
        q1_sample["evidence"] = {"sample_production_log_ids": q1_res["evidence"]["production_log_ids"][:5]}
        for m in q1_sample["machine_performance"]:
            m["evidence"] = {"production_log_ids": m["evidence"]["production_log_ids"][:3]}
        q1_sample["machine_performance"] = q1_sample["machine_performance"][:3]

        # 2. Q5 Breakdown Ranking (today & month)
        q5_today = get_breakdown_ranking(session, period="today", date="2026-08-29")
        q5_sample = dict(q5_today)
        q5_sample["evidence"] = {"sample_breakdown_event_ids": q5_today["evidence"]["breakdown_event_ids"][:5]}
        for m in q5_sample["machine_ranking"]:
            m["evidence"] = {"breakdown_event_ids": m["evidence"]["breakdown_event_ids"][:3]}
        q5_sample["machine_ranking"] = q5_sample["machine_ranking"][:3]

        # 3. Q21 Revenue Summary (latest date)
        q21_res = get_revenue_summary(session, date="2026-08-29")
        q21_sample = dict(q21_res)
        q21_sample["evidence"] = {"sample_revenue_log_ids": q21_res["evidence"]["revenue_log_ids"][:5]}
        for m in q21_sample["machine_ranking"]:
            m["evidence"] = {"revenue_log_ids": m["evidence"]["revenue_log_ids"][:3]}
        q21_sample["machine_ranking"] = q21_sample["machine_ranking"][:3]

        output = {
            "Q1_Production_vs_Target_Sample": q1_sample,
            "Q5_Breakdown_and_Downtime_Sample": q5_sample,
            "Q21_Revenue_and_Loss_Sample": q21_sample,
        }

        output_path = Path(__file__).parent.parent / "sample_analytics_output.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2)

        print(f"Sample JSON generated at: {output_path}")
        print("\n--- SAMPLE Q1 OUTPUT ---")
        print(json.dumps(q1_sample, indent=2))
        print("\n--- SAMPLE Q5 OUTPUT ---")
        print(json.dumps(q5_sample, indent=2))
        print("\n--- SAMPLE Q21 OUTPUT ---")
        print(json.dumps(q21_sample, indent=2))


if __name__ == "__main__":
    run_samples()
