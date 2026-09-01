"""
Loom AI v2 — exports: WhatsApp plain-text summary.

6-line format (no markdown chars). Anti-Slop rule: no *, _, #, backtick in output.
Rate assumption always shown on line 3 (EST label).
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Optional


def format_inr(amount: Decimal) -> str:
    """Indian digit grouping: 9,65,198 (not 965,198)."""
    s = str(int(amount))
    if len(s) <= 3:
        return s
    # Indian format: last 3, then groups of 2
    result = s[-3:]
    s = s[:-3]
    while s:
        result = s[-2:] + "," + result
        s = s[:-2]
    return result.lstrip(",")


def build_whatsapp_text(
    date: datetime.date,
    unit_code: str,
    actual_eff: Optional[Decimal],
    target_eff: Optional[Decimal],
    rupee_lost: Optional[Decimal],
    top_issue_label: Optional[str],
    top_issue_duration_str: Optional[str],
    top_issue_pct: Optional[Decimal],
    best_loom_no: Optional[str],
    best_loom_eff: Optional[Decimal],
    worst_loom_no: Optional[str],
    worst_loom_eff: Optional[Decimal],
) -> str:
    """
    Returns a 6-line plain-text string with no markdown characters.
    All fields that are None render as 'N/A' — never a bare dash or empty cell.

    Anti-Slop rule 8: ₹ loss labelled with (EST) — rate is a placeholder.
    Anti-Slop rule 7: no metric without source visible — EST is always shown.
    """
    if hasattr(date, "strftime"):
        date_str = f"{date.day} {date.strftime('%b %Y')}"
    else:
        date_str = str(date)

    eff_str = f"{actual_eff:.1f}%" if actual_eff else "N/A"
    tgt_str = f"target {target_eff:.1f}%" if target_eff else "no target set"

    if rupee_lost and rupee_lost > 0:
        rupee_str = f"Rs.{format_inr(rupee_lost)} (EST)"
    else:
        rupee_str = "N/A"

    if top_issue_label and top_issue_duration_str:
        pct_str = f" ({int(top_issue_pct)}%)" if top_issue_pct else ""
        issue_str = f"{top_issue_label} - {top_issue_duration_str}{pct_str}"
    else:
        issue_str = "N/A"

    best_str = f"{best_loom_no} @ {best_loom_eff:.1f}%" if (best_loom_no and best_loom_eff) else "N/A"
    worst_str = f"{worst_loom_no} @ {worst_loom_eff:.1f}%" if (worst_loom_no and worst_loom_eff) else "N/A"

    lines = [
        f"{unit_code} Weaving - {date_str}",
        f"Efficiency: {eff_str} ({tgt_str})",
        f"Loss: {rupee_str}",
        f"Top issue: {issue_str}",
        f"Best loom: {best_str}",
        f"Worst loom: {worst_str}",
    ]

    text = "\n".join(lines)

    # Safety assertion — production code must not emit markdown characters
    for bad_char in ["*", "_", "#", "`"]:
        assert bad_char not in text, (
            f"WhatsApp output contains banned character '{bad_char}'. "
            "This is a bug — fix the format strings above."
        )

    return text
