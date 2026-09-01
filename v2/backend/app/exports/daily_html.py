"""
Loom AI v2 — Exports: HTML Daily Preparatory & Weaving Report with Print CSS.

Designed for exact paper layout matching the mill's traditional report.
Operates offline in the browser / PWA via Ctrl+P / browser print button.
"""
from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Any, Optional

from app.exports.whatsapp import format_inr


def render_daily_report_html(
    date: datetime.date,
    unit_code: str,
    shifts_summary: list[dict[str, Any]],
    day_total: dict[str, Any],
    top_issues: list[dict[str, Any]],
    data_as_of: Optional[datetime.datetime] = None,
) -> str:
    """
    Renders standalone HTML with embedded print CSS matching ATM mill layout.
    """
    date_str = date.strftime("%d-%b-%Y")
    as_of_str = data_as_of.strftime("%d-%b-%Y %H:%M UTC") if data_as_of else "DEMO"

    shift_rows_html = ""
    for s in shifts_summary:
        eff_str = f"{s.get('actual_eff', 0):.2f}%" if s.get('actual_eff') is not None else "No data"
        tgt_str = f"{s.get('target_eff', 0):.2f}%" if s.get('target_eff') is not None else "-"
        shift_rows_html += f"""
        <tr>
            <td>Shift {s.get('shift_code')}</td>
            <td class="num">{tgt_str}</td>
            <td class="num font-bold">{eff_str}</td>
            <td class="num">{format_inr(Decimal(str(int(s.get('metres', 0)))))}</td>
            <td class="num">{format_inr(Decimal(str(int(s.get('kilo_picks', 0)))))}</td>
            <td class="num">{s.get('stopped_minutes_total', 0)} min</td>
        </tr>
        """

    day_eff_str = f"{day_total.get('actual_eff', 0):.2f}%" if day_total.get('actual_eff') is not None else "No data"
    day_total_row = f"""
    <tr class="total-row">
        <td>TOTAL / AVG</td>
        <td class="num">-</td>
        <td class="num font-bold">{day_eff_str}</td>
        <td class="num">{format_inr(Decimal(str(int(day_total.get('metres', 0)))))}</td>
        <td class="num">{format_inr(Decimal(str(int(day_total.get('kilo_picks', 0)))))}</td>
        <td class="num">{day_total.get('stopped_minutes_total', 0)} min</td>
    </tr>
    """

    issues_html = ""
    for idx, iss in enumerate(top_issues, 1):
        issues_html += f"""
        <li>
            <strong>{iss.get('reason_label_en', 'Issue')}</strong>: 
            {iss.get('total_minutes', 0)} min ({iss.get('pct_of_loom_downtime', 0)}% downtime) - {iss.get('count', 0)} events
        </li>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Daily Production Report - {unit_code} - {date_str}</title>
    <style>
        @page {{
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
        }}
        body {{
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #fff;
            margin: 0;
            padding: 20px;
        }}
        .header {{
            border-bottom: 2px solid #1E3A5F;
            padding-bottom: 10px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }}
        .title {{
            font-size: 20px;
            font-weight: bold;
            color: #1E3A5F;
            text-transform: uppercase;
        }}
        .meta {{
            font-size: 12px;
            color: #4B5563;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 13px;
        }}
        th, td {{
            border: 1px solid #D1D5DB;
            padding: 8px 10px;
            text-align: left;
        }}
        th {{
            background-color: #1E3A5F;
            color: #ffffff;
            font-weight: 600;
        }}
        .num {{
            text-align: right;
            font-family: "Courier New", Courier, monospace;
        }}
        .font-bold {{
            font-weight: bold;
        }}
        .total-row {{
            background-color: #F3F4F6;
            font-weight: bold;
        }}
        .section-title {{
            font-size: 14px;
            font-weight: bold;
            color: #1E3A5F;
            margin-top: 20px;
            margin-bottom: 8px;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 4px;
        }}
        .no-print-bar {{
            background: #F3F4F6;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #D1D5DB;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        @media print {{
            .no-print-bar {{
                display: none;
            }}
            body {{
                padding: 0;
            }}
        }}
    </style>
</head>
<body>
    <div class="no-print-bar">
        <span>Loom AI v2 Print Preview</span>
        <button onclick="window.print()" style="padding: 6px 16px; background: #1E3A5F; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
            Print / Save as PDF
        </button>
    </div>

    <div class="header">
        <div>
            <div class="title">Ashok Textile Mills (P) Ltd</div>
            <div style="font-size: 14px; font-weight: 600; margin-top: 4px;">Daily Weaving Production Report</div>
        </div>
        <div class="meta" style="text-align: right;">
            <div><strong>Date:</strong> {date_str}</div>
            <div><strong>Unit:</strong> {unit_code}</div>
            <div><strong>Data as of:</strong> {as_of_str}</div>
        </div>
    </div>

    <div class="section-title">Shift Performance Summary</div>
    <table>
        <thead>
            <tr>
                <th>Shift</th>
                <th class="num">Target Eff %</th>
                <th class="num">Actual Eff %</th>
                <th class="num">Metres</th>
                <th class="num">Kilo-Picks</th>
                <th class="num">Stopped Time</th>
            </tr>
        </thead>
        <tbody>
            {shift_rows_html}
            {day_total_row}
        </tbody>
    </table>

    <div class="section-title">Key Stoppages & Pareto</div>
    <ul style="font-size: 13px; line-height: 1.6; color: #374151;">
        {issues_html if issues_html else "<li>No major stoppages recorded for this date.</li>"}
    </ul>

    <div style="margin-top: 40px; border-top: 1px solid #D1D5DB; padding-top: 10px; font-size: 11px; color: #9CA3AF; display: flex; justify-content: space-between;">
        <span>Generated by Loom AI v2</span>
        <span>Rate Assumption: ₹40.00/metre (EST)</span>
    </div>
</body>
</html>
"""
    return html
