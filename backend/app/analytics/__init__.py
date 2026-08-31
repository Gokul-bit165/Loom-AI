"""
Deterministic Analytics Engine for Loom AI.

Exposes core business analytics for Q1, Q5, Q21, and Rule-Based Recommendations.
"""
from app.analytics.production import get_production_variance, get_production_trend
from app.analytics.breakdown import get_breakdown_ranking
from app.analytics.revenue import get_revenue_summary
from app.analytics.recommendations import (
    generate_recommendations,
    get_production_recommendations,
    get_breakdown_recommendations,
    get_revenue_recommendations,
)
from app.analytics.common import PerformanceStatus, classify_performance

__all__ = [
    "get_production_variance",
    "get_production_trend",
    "get_breakdown_ranking",
    "get_revenue_summary",
    "generate_recommendations",
    "get_production_recommendations",
    "get_breakdown_recommendations",
    "get_revenue_recommendations",
    "PerformanceStatus",
    "classify_performance",
]
