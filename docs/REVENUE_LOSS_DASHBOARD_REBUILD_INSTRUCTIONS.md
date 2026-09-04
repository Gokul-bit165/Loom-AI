# Revenue and Loss Dashboard Rebuild Instructions

## Purpose

Rebuild the V2 Revenue and Loss page into a minimal decision-making dashboard for Ashok Textile Mills management.

The current page shows too much information at once. It forces the owner to read line by line, understand charts manually, and mentally connect revenue, loss, reason, and action. That is a failure for an owner-facing business page.

The rebuilt page must work without a manual guide. The first screen must answer the business question immediately:

**How much money did we make, how much did we lose, why did we lose it, what should we do now, who owns it, and is the problem improving or worsening?**

## Users

### Owner / Managing Director

The owner does not want operational detail first. The owner wants:

- Today's revenue
- Revenue loss
- Main problem department
- Exact reason in one short sentence
- Action to approve
- Expected recovery
- Whether the problem is repeating
- Whether the trend is improving or worsening

The owner view must be minimal, visual, and action-oriented.

### Plant Assistant / Plant Manager

The plant assistant wants the detail behind the decision:

- Source evidence
- Department-wise reasons
- Shift, loom, style, and cost checks
- Rate card trust
- Direct cost breakdown
- Monitoring checklist after action
- Time-period comparison

This detail must be available inside the page, but hidden behind touch/click drill-downs, tabs, drawers, or expandable components. Do not show everything at once.

## Core Product Rule

Every visible component must answer one of these:

1. What happened?
2. Why did it happen?
3. How much money is affected?
4. What action should be taken?
5. Who owns the action?
6. How will we know it improved?

If a component does not answer one of these, remove it.

## Page Structure

### 1. Top Decision Header

This is the first thing the owner sees.

Show:

- One-sentence verdict
- Today revenue
- Revenue loss
- Recoverable revenue
- Main problem department
- Action owner
- Urgency

Do not show long explanations here.

Example:

> Electrical and power is the largest revenue loss today. Approve transformer and sub-panel inspection before evening shift to protect ₹1.30 lakh.

### 2. Owner Decision Cards

Use 4 to 6 cards maximum.

Required cards:

- Actual revenue
- Potential revenue or target revenue
- Revenue loss
- Recoverable revenue
- Contribution profit
- Main problem department

Card rules:

- One number per card
- One short driver line only
- Use full labels, not confusing short forms
- Every money card must show a trust badge such as Calculated, Estimated, Confirmed, or Predicted

Avoid:

- Too many cards
- Long subtitles
- Multiple paragraphs
- Mixed meanings in one card

### 3. Visual Decision Area

Add 2 to 3 charts only. The charts must be decision-linked, not decorative.

#### Chart 1: Revenue Trend

Purpose:
Show whether revenue is increasing, stable, or falling.

Chart type:
Line chart.

X-axis:
Date or period.

Y-axis:
Revenue in rupees.

Entities:

- Actual revenue
- Target or potential revenue

Required labels:

- X-axis label: Date
- Y-axis label: Revenue
- Legend: Actual revenue, Target revenue
- Selected period label: Today, Last 7 days, Month to date, Year to date

Decision panel beside the chart:

- Trend status: Improving, Stable, or Worsening
- Main reason
- Revenue gap
- Action
- Monitor metric

Example:

> Revenue is below target mainly because electrical stoppages reduced scheduled uptime. Monitor revenue per scheduled loom hour after panel inspection.

#### Chart 2: Revenue Loss Trend

Purpose:
Show loss day by day and highlight spike days.

Chart type:
Bar chart or line chart with highlighted spikes.

X-axis:
Date.

Y-axis:
Revenue loss in rupees.

Entities:

- Daily revenue loss
- Spike threshold

Required labels:

- X-axis label: Date
- Y-axis label: Revenue loss
- Legend: Daily loss, Spike threshold

Decision panel beside the chart:

- Peak loss day
- Spike reason
- Affected department
- Recommended action
- Owner

Do not show all bars as red unless every day is critical. Use red only for spike days.

#### Chart 3: Department Problem Histogram

Purpose:
Show where problems are concentrated.

Chart type:
Horizontal bar chart.

X-axis:
Loss amount in rupees or problem count.

Y-axis:
Department.

Entities:

- Electrical and power
- Mechanical maintenance
- Weaving efficiency
- Quality and seconds
- Workforce allocation
- Air and compressor
- Commercial rate card and cost trust

Required labels:

- X-axis label: Loss amount or Problem count
- Y-axis label: Department
- Legend: Loss amount, Problem count if both are shown

Decision panel beside the chart:

- Department with highest rupee loss
- Department with most problem count
- Department with small count but high money impact
- Recommended first action

### 4. Chart Interaction

The owner should not read every detail by default.

When the user clicks or touches:

- A revenue trend point: show that date's revenue, target, gap, and reason
- A loss spike bar: show spike cause, affected department, and action
- A department bar: show department problem card with reason, solution, owner, and evidence
- A decision card: show calculation basis and source trust

Use a drawer, side panel, popover, or expanded row. Keep the main page clean.

### 5. Department-Wise Problem Cards

Show each department separately, but keep cards compact.

Departments:

- Electrical and power
- Mechanical maintenance
- Weaving efficiency
- Quality and seconds
- Workforce allocation
- Air and compressor
- Commercial rate card and cost trust

Each card must show:

- Department name
- Loss amount or monitor status
- Problem count or affected metres
- Trend: Improving, Stable, or Worsening
- Main reason
- Recommended action
- Owner
- Urgency

Default display:

- Show only the top 3 departments by business impact in owner view
- Show all departments in plant assistant view

Do not show long paragraphs inside cards. Use short labels and one-line reasons.

### 6. Whole Mill Summary

The page must show the whole mill picture separately from department detail.

Whole mill summary must include:

- Actual revenue
- Potential revenue
- Revenue loss
- Lost metres
- Contribution profit
- Main problem department
- Recoverable opportunity

Use one visual stack or compact summary, not a long explanation.

### 7. Time Period Controls

Required period controls:

- Today
- Last 7 days
- Month to date
- Year to date

Changing the period must update:

- Top decision sentence
- Owner decision cards
- Revenue trend chart
- Loss trend chart
- Department histogram
- Main reason
- Recommended action
- Department cards

Do not let the period selector change only numbers while leaving reasons unchanged.

### 8. Owner View

Owner view must fit the first screen as much as possible.

Owner view includes:

- Top decision header
- 4 to 6 decision cards
- 2 to 3 charts
- Top 3 department problems
- Top action approval

Owner view does not include:

- Long evidence tables
- Long explanations
- Full source notes
- All calculations
- Full style revenue table
- Dense cost breakdown

### 9. Plant Assistant Evidence View

Plant assistant view includes:

- Full department cards
- Evidence drawer or table
- Cost breakdown
- Style revenue table
- Rate card checklist
- Action monitoring checklist
- Source freshness and trust status
- Time-period comparison

This view can be more detailed, but it must still be structured. Do not dump all text.

### 10. Decision Panels Beside Charts

Every graph must have a decision panel.

Decision panel structure:

- Status
- Main reason
- Business impact
- Recommended solution
- Owner
- Monitor after action

Example:

Status: Worsening  
Main reason: Electrical and power stoppages repeated across the selected period  
Business impact: ₹2.01 lakh loss today  
Recommended solution: Inspect sub-panel terminals and inverter drive capacitors  
Owner: Chief electrical engineer  
Monitor after action: Electrical stoppage minutes and revenue loss per shift

### 11. Visual Layout Rules

Use a dashboard layout, not a report layout.

Recommended desktop layout:

- Row 1: Decision header
- Row 2: Decision cards
- Row 3: Revenue trend chart + decision panel
- Row 4: Loss trend chart + department histogram
- Row 5: Top department cards
- Row 6: Plant assistant details if selected

Recommended mobile layout:

- Decision header
- Cards in two columns or one column
- Charts one below another
- Decision panel below each chart
- Department cards collapsed by default

Spacing:

- Keep panels compact
- Avoid giant empty space
- Avoid nested cards inside cards
- Keep section borders light and clean

### 12. Chart Design Rules

Every chart must have:

- Clear title
- X-axis label
- Y-axis label
- Legend
- Unit of measurement
- Selected period
- Highlighted selected point or bar
- Tooltip or click detail
- Short decision insight

Do not use charts without axis meaning.

Do not use charts that require the user to guess:

- What the x-axis means
- What the y-axis means
- Which line is actual
- Which line is target
- Which department is responsible
- What action follows

### 13. Graph Data Rules

Use backend data where available.

Revenue trend:

- Actual revenue must come from production metres multiplied by confirmed or estimated selling rate.
- Target revenue must come from target or potential production basis.

Loss trend:

- Loss must come from deterministic loss waterfall calculations.
- Do not invent final loss values in the frontend.

Department histogram:

- Department loss must map from known loss categories.
- If a department has no direct rupee loss yet, show Monitor instead of fake money.

### 14. Department Mapping

Use this mapping:

- Electrical and power: electrical downtime, grid fluctuation, voltage dips, power failure, compressor electrical trip
- Mechanical maintenance: mechanical stops, repeated loom fault, knotting delay, cutter wear, maintenance repair
- Weaving efficiency: low speed, running efficiency gap, shift efficiency gap, loom allocation impact
- Quality and seconds: fabric defects, seconds discount, yarn strength, yarn unevenness, imperfections, crimp abnormality
- Workforce allocation: absenteeism, trainee over-allocation, high-grade weaver under-allocation, shift supervision gap
- Air and compressor: air leakage, pressure drop, compressed air cost, airjet insertion stops
- Commercial rate card and cost trust: missing selling rate, estimated cost card, yarn cost, power tariff, labour, spares

### 15. Business Intelligence That Must Exist

The page should provide these insights in visual or compact form:

- Highest revenue department or style
- Highest loss department
- Department with most problem count
- Department with highest rupee impact per problem
- Biggest recurring reason
- Best recovery opportunity
- Revenue protected if top action succeeds
- Month-end target risk
- Whether today is better or worse than the selected comparison period
- Whether the main issue is improving, stable, or worsening

### 16. Text Rules

Use less text, but better text.

Allowed:

- One-sentence verdict
- One-line reason
- One-line solution
- Labels
- Tooltips
- Drill-down detail

Avoid:

- Long paragraphs in owner view
- Repeating the same explanation in multiple cards
- Explaining how to use the dashboard
- Too many badges
- Too many red areas
- Confusing short forms and abbreviations

Use full words:

- Use Revenue loss, not Loss
- Use Electrical and power, not E and P
- Use Running efficiency, not Eff
- Use Month to date, not MTD in owner view
- Use Year to date, not YTD in owner view
- Use Contribution profit, not CP

### 17. Interaction Rules

Default:

- Show the decision.
- Hide the detail.

On click:

- Reveal the reason, calculation basis, source, action, owner, and monitor metric.

Do not make the user open a separate manual to understand the page.

### 18. Data Trust Rules

Every money figure must show trust:

- Actual: directly from source record
- Calculated: deterministic formula from source data
- Estimated: placeholder or unconfirmed commercial rate
- Predicted: model or future risk

If selling rate or cost card is not confirmed, the UI must clearly say Estimated.

Do not hide estimated status.

### 19. What To Remove From The Current Page

Remove or hide by default:

- Long text-heavy verdict blocks
- Repeated explanation cards
- Large grids of sector cards in owner view
- Charts without clear axes
- Red coloring for every chart bar
- All detail shown at once
- Abbreviated labels
- Manual-guide-like text

### 20. Acceptance Criteria

The rebuilt page is acceptable only if:

- The owner can understand the top issue in under 10 seconds
- The first screen does not require line-by-line reading
- Every chart has x-axis, y-axis, legend, unit, and decision insight
- The top action is obvious
- All sectors exist, but only the important sectors are visible first
- Details are available through interaction or plant assistant view
- Today, Last 7 days, Month to date, and Year to date update both numbers and reasons
- Department-wise problem view shows both separate departments and whole mill summary
- Money values carry trust badges
- Frontend build passes
- Revenue API still works
- Page loads in the browser without visual overflow

## Implementation Plan

1. Review the existing V2 Revenue and Loss component and backend revenue response.
2. Keep the current deterministic backend calculations.
3. Extend backend data only where needed for period trend, department counts, and chart series.
4. Replace text-heavy owner view with a minimal decision dashboard.
5. Add chart components with labels, axes, legends, and units.
6. Add chart side decision panels.
7. Add department histogram and top department cards.
8. Move full details into Plant Assistant Evidence view.
9. Add click or touch drill-down for chart points, bars, and department cards.
10. Verify desktop and mobile layout.
11. Run build and API checks.

## Final Build Prompt

Use this prompt with another builder:

Rebuild the V2 Revenue and Loss page using `docs/REVENUE_LOSS_DASHBOARD_REBUILD_INSTRUCTIONS.md` as the source of truth.

The page must become a minimal owner-first decision dashboard, not a text-heavy report. Keep all important information, but hide deeper detail behind chart interactions, department card expansion, and a Plant Assistant Evidence view.

Add 2 to 3 useful charts:

- Revenue trend line with actual revenue and target revenue
- Revenue loss trend with spike detection
- Department problem histogram

Every chart must show:

- Clear title
- X-axis label
- Y-axis label
- Unit
- Legend
- Selected period
- Decision insight
- Reason and solution beside the graph

Add period controls:

- Today
- Last 7 days
- Month to date
- Year to date

Changing period must update numbers, reasons, charts, department view, and recommended action.

Show departments separately and also show whole mill summary:

- Electrical and power
- Mechanical maintenance
- Weaving efficiency
- Quality and seconds
- Workforce allocation
- Air and compressor
- Commercial rate card and cost trust

Owner view should show only the essential decision layer. Plant assistant view should show detailed evidence, source checks, cost breakdown, style revenue, rate card checklist, and monitoring checklist.

Use full words, not confusing abbreviations. Do not make the user read a guide to understand the page. Every visible component must support a decision.

Run build and verify the page loads.
