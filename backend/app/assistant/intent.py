"""
Intent Classification for Loom AI Management Assistant.

Routes queries deterministically to:
- Q1_PRODUCTION (Production vs Target, Efficiency, Shift output, Machine variances)
- Q5_BREAKDOWN (Downtime, Stoppages, Breakdown reasons, Machine repair delays)
- Q21_REVENUE (Revenue, Fabric styles, Machine monetary contributions)
- OUT_OF_SCOPE (Any question outside V1 business scope)
"""
from __future__ import annotations

import re
from enum import Enum
from typing import NamedTuple


class QueryIntent(str, Enum):
    Q1_PRODUCTION = "Q1"
    Q5_BREAKDOWN = "Q5"
    Q21_REVENUE = "Q21"
    OUT_OF_SCOPE = "OUT_OF_SCOPE"


class ClassifiedIntent(NamedTuple):
    intent: QueryIntent
    period: str  # 'today' or 'month'
    is_supported: bool


# Keywords mapped to V1 scopes
PRODUCTION_KEYWORDS = {
    "production", "target", "actual", "efficiency", "variance", "output",
    "shift", "produced", "units", "quantity", "qty", "shortfall", "surplus",
    "underperform", "underperforming", "optimal", "performance", "meters", "picks",
}

BREAKDOWN_KEYWORDS = {
    "breakdown", "downtime", "stopped", "stoppage", "stopped", "stoppages",
    "repair", "delay", "idle", "reason", "fault", "failure", "halt",
    "maintenance", "duration", "cleaning", "runout", "fluctuation",
}

REVENUE_KEYWORDS = {
    "revenue", "sales", "fabric", "style", "turnover", "income", "money",
    "rupees", "rs", "rate", "earnings", "gross", "financial", "commercial",
}

# Explicit out-of-scope triggers (V2+ topics: manpower, air, quality tests, payroll, weather)
OUT_OF_SCOPE_KEYWORDS = {
    "attendance", "absent", "absenteeism", "worker", "operator", "salary", "wage",
    "air consumption", "compressor", "pressure", "leakage",
    "quality test", "csp", "count cv", "uster", "neps", "thin per km", "thick per km",
    "weather", "forecast", "stock market", "crypto", "ceo", "lunch", "cafeteria",
}


def classify_query_intent(question: str) -> ClassifiedIntent:
    """
    Classifies a natural-language manager question into Q1, Q5, Q21, or OUT_OF_SCOPE.
    """
    q_clean = question.lower().strip()
    words = set(re.findall(r"\b[a-z0-9_-]+\b", q_clean))

    # 1. Check for explicit out-of-scope keywords first
    if any(kw in q_clean for kw in OUT_OF_SCOPE_KEYWORDS):
        return ClassifiedIntent(QueryIntent.OUT_OF_SCOPE, period="today", is_supported=False)

    period = "month" if any(kw in q_clean for kw in ("month", "monthly", "mtd", "this month")) else "today"

    # Score matches
    q1_score = len(words.intersection(PRODUCTION_KEYWORDS))
    q5_score = len(words.intersection(BREAKDOWN_KEYWORDS))
    q21_score = len(words.intersection(REVENUE_KEYWORDS))

    # Priority weighting for specialized terms
    if any(kw in q_clean for kw in ("breakdown", "downtime", "stoppage", "stopped")):
        q5_score += 3
    if any(kw in q_clean for kw in ("revenue", "sales", "fabric style", "style", "rupees")):
        q21_score += 3
    if any(kw in q_clean for kw in ("production", "target", "efficiency", "variance")):
        q1_score += 3

    scores = [
        (q5_score, QueryIntent.Q5_BREAKDOWN),
        (q21_score, QueryIntent.Q21_REVENUE),
        (q1_score, QueryIntent.Q1_PRODUCTION),
    ]
    scores.sort(key=lambda x: -x[0])

    top_score, top_intent = scores[0]

    # If no relevant operational keywords matched at all
    if top_score == 0:
        # Check generic greeting or totally unrelated query
        return ClassifiedIntent(QueryIntent.OUT_OF_SCOPE, period=period, is_supported=False)

    return ClassifiedIntent(top_intent, period=period, is_supported=True)
