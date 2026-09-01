"""
Loom AI v2 — P6 §7: Drift tracking & Auto-Demote Switch.

Rules:
1. Every model/projection has a ModelCard with a named owner and baseline comparison.
2. Auto-demote: If a model underperforms its baseline for 2 consecutive periods,
   it automatically demotes to the pure deterministic baseline.
3. System functions 100% deterministically if all AI flags are disabled.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass
class ModelCard:
    model_id: str
    name: str
    owner: str                     # e.g. "Weaving Master / S. Murugan"
    training_window: str
    baseline: str                  # "Trailing 7-day mean" | "Fixed regex enum"
    is_active: bool
    consecutive_underperformance_periods: int
    auto_demoted: bool
    status_note: str


# System model cards
MODEL_REGISTRY: dict[str, ModelCard] = {
    "FORECAST_Q1_Q4": ModelCard(
        model_id="FORECAST_Q1_Q4",
        name="Loom Shift Output Projection",
        owner="Weaving Master",
        training_window="Trailing 7-day temporal window",
        baseline="Trailing 7-day mean per loom/style",
        is_active=True,
        consecutive_underperformance_periods=0,
        auto_demoted=False,
        status_note="Active - Evaluated on temporal split",
    ),
    "REMARK_CLASSIFIER": ModelCard(
        model_id="REMARK_CLASSIFIER",
        name="Free Text Remark Classifier",
        owner="Shift Supervisor",
        training_window="Fixed master dictionary",
        baseline="Deterministic regex rules",
        is_active=True,
        consecutive_underperformance_periods=0,
        auto_demoted=False,
        status_note="Active - Regex first with fixed enum fallback",
    ),
    "ANOMALY_DETECTOR": ModelCard(
        model_id="ANOMALY_DETECTOR",
        name="Multivariate Loom Anomaly Detector",
        owner="Maintenance Fitter Lead",
        training_window="Rolling 30-day loom baseline",
        baseline="Loom trailing 30d mean residual",
        is_active=True,
        consecutive_underperformance_periods=0,
        auto_demoted=False,
        status_note="Active - Shadow mode verified with suppression rules",
    ),
}


def check_and_apply_auto_demote(model_id: str, underperformed: bool) -> ModelCard:
    """
    Auto-demote switch: If underperformed for >= 2 consecutive periods, demote model.
    """
    card = MODEL_REGISTRY.get(model_id)
    if card is None:
        raise KeyError(f"Unknown model: {model_id}")

    if underperformed:
        card.consecutive_underperformance_periods += 1
        if card.consecutive_underperformance_periods >= 2:
            card.is_active = False
            card.auto_demoted = True
            card.status_note = "Auto-demoted: Underperformed baseline for 2 consecutive periods. Reverted to pure deterministic baseline."
    else:
        card.consecutive_underperformance_periods = 0
        card.auto_demoted = False

    return card
