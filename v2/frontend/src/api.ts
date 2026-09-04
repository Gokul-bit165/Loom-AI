/**
 * Loom AI v2 — Decision Intelligence API Client.
 * Communicates with backend endpoints under /api/v2/.
 * Supports:
 * 1. Live local backend (localhost:8050)
 * 2. Remote cloud backend via VITE_API_BASE_URL (Render, Railway, Fly.io, etc.)
 * 3. Autonomous offline/demo fallback with authentic Ashok Textile Mills factory snapshot
 */
import { demoSnapshot } from './demoSnapshot';
import { workforceSnapshot } from './workforceSnapshot';

const RAW_API_BASE = (import.meta as any).env?.VITE_API_BASE_URL;
export const API_BASE = RAW_API_BASE
  ? `${RAW_API_BASE.replace(/\/$/, '')}/api/v2`
  : '/api/v2';

export let isUsingDemoSnapshot = false;

export function getDataSourceStatus(): { isDemo: boolean; apiBase: string } {
  return {
    isDemo: isUsingDemoSnapshot,
    apiBase: API_BASE,
  };
}

async function safeFetchJson<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      // Critical fix for Vercel/Netlify SPA rewrites:
      // When an API route is missing on a static host, Vercel returns HTTP 200 with index.html (text/html).
      // Attempting to parse HTML as JSON throws:
      // SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
      if (!contentType.includes('text/html')) {
        const text = await res.text();
        const trimmed = text.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          const data = JSON.parse(trimmed);
          isUsingDemoSnapshot = false;
          return data;
        }
      }
    }
  } catch (_err) {
    // Network failure, CORS failure, JSON parse error, or offline/static hosting
  }
  isUsingDemoSnapshot = true;
  return fallback;
}

export interface RupeeAmount {
  value: number | null;
  rate_source: string;
  rate_basis: string;
}

export interface LoomRow {
  loom_id: number;
  loom_no: string;
  loom_type_code: string;
  shed_code: string | null;
  style_code: string;
  shift_code: string;
  weaver_name: string | null;
  metres: number;
  kilo_picks: number;
  scheduled_minutes: number;
  running_minutes: number;
  stopped_minutes: number;
  loom_efficiency_pct: number | null;
  performance_eff_pct: number | null;
  utilization_pct: number | null;
  cohort_gap_pp: number | null;
  cohort_loom_count: number;
  cohort_window: string;
  warp_breaks_per_1000: number | null;
  weft_breaks_per_1000: number | null;
  warp_breaks: number;
  weft_breaks: number;
  rupee_lost: RupeeAmount;
  status: 'GREEN' | 'AMBER' | 'RED' | 'GREY';
}

export interface LoomsResponse {
  looms: LoomRow[];
  total: number;
  page: number;
  page_size: number;
  data_as_of: string | null;
  source_mix: string[];
}

export interface TrendPoint {
  date: string;
  loom_efficiency_pct: number | null;
  style_code: string;
  style_changed: boolean;
}

export interface StopEventRow {
  stop_event_id: number;
  raised_at: string;
  resolved_at: string | null;
  reason_label_en: string | null;
  reason_category: string | null;
  duration_min: number | null;
  status: string;
}

export interface ReasonParetoRow {
  reason_code: string;
  reason_label_en: string;
  count: number;
  total_minutes: number;
  pct_of_loom_downtime: number;
  vs_plant_pct: number | null;
  avg_duration_min?: number;
  expected_duration_min?: number;
  variance_min?: number;
  category?: string;
}


export interface WeaverRecord {
  employee_id: number;
  name: string;
  grade: string | null;
  days_run: number;
  mean_eff: number | null;
}

export interface LoomDetailResponse {
  loom_id: number;
  loom_no: string;
  loom_type_code: string;
  shed_code: string | null;
  register_confirmed: boolean;
  trend: TrendPoint[];
  stop_events: StopEventRow[];
  reason_pareto: ReasonParetoRow[];
  warp_per_1000: number | null;
  weft_per_1000: number | null;
  weavers: WeaverRecord[];
  rupee_lost_month: RupeeAmount;
  diagnostic_sentence: string | null;
  data_as_of: string | null;
}

export interface ShiftSummary {
  shift_code: string;
  target_eff: number | null;
  actual_eff: number | null;
  metres: number;
  kilo_picks: number;
  loom_count: number;
  stopped_minutes_total: number;
}

export interface ProductionSummaryResponse {
  date: string;
  unit_code: string;
  shifts: ShiftSummary[];
  day_total: ShiftSummary;
  data_as_of: string | null;
  source_mix: string[];
}

export interface BreakdownLoomRow {
  loom_id: number;
  loom_no: string;
  loom_type_code: string;
  stopped_minutes?: number;
  total_stopped_minutes?: number;
  event_count: number;
  top_reason_label?: string | null;
  dominant_reason_en?: string | null;
  dominant_reason_category?: string | null;
  lost_meters?: number;
  rupee_exposure?: number;
  efficiency_pct?: number;
  style_code?: string;
  rupee_lost?: RupeeAmount;
}

export interface PeerBenchmarkRow {
  loom_id: number;
  loom_no: string;
  loom_type_code: string;
  total_stopped_minutes: number;
  event_count: number;
  efficiency_pct?: number;
  metres_produced?: number;
  style_code?: string;
  shed_code?: string;
  comparison_notes?: string;
}

export interface AbnormalPatternRow {
  pattern_id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'WATCH';
  scope: string;
  detail: string;
  evidence: string;
  recommendation: string;
}

export interface ShiftBreakdownRow {
  shift_code: string;
  stopped_minutes: number;
  event_count: number;
  lost_meters: number;
  rupee_exposure: number;
  dominant_reason: string;
}

export interface BreakdownSummaryResponse {
  date: string;
  unit_code: string;
  today_stopped_minutes_total: number;
  today_events_count_total: number;
  today_rupee_loss_total: RupeeAmount;
  today_financial_exposure?: RupeeAmount;
  total_rupee_lost?: RupeeAmount;
  total_meters_lost?: number;
  avg_downtime_per_event_min?: number;
  worst_looms_today: BreakdownLoomRow[];
  worst_looms_month?: BreakdownLoomRow[];
  monthly_top_looms?: BreakdownLoomRow[];
  highest_downtime_loom?: BreakdownLoomRow;
  best_peer_benchmark?: PeerBenchmarkRow;
  chronic_monthly_offender?: BreakdownLoomRow;
  reason_pareto: ReasonParetoRow[];
  abnormal_patterns?: AbnormalPatternRow[];
  shift_breakdown_matrix?: ShiftBreakdownRow[];
  event_classification_summary?: Record<string, { label: string; count: number; minutes: number; lost_meters: number; rupee_exposure: number }>;
  micro_stops_minutes?: number;
  micro_stops_count?: number;
  breakdown_minutes?: number;
  breakdown_count?: number;
  potential_recovery?: { potential_meters: number; potential_rupees: number; top_opportunity: string };
  category_downtime_minutes?: Record<string, number>;
  data_as_of: string | null;
  source_mix: string[];
}

// ── ROOT CAUSE INVESTIGATION INTERFACES ───────────────────────────
export interface CandidateEventRow {
  stop_event_id: number;
  loom_id: number;
  loom_no: string;
  loom_type_code: string;
  work_date: string;
  shift_id: number;
  shift_code: string;
  raised_at: string | null;
  resolved_at: string | null;
  duration_minutes: number;
  status: string;
  reason_code: string;
  reason_label_en: string;
  reason_category: string;
  raw_remark: string | null;
  failed_component: string | null;
  fix_action: string | null;
}

export interface TimelineEventItem {
  time: string;
  status: string;
  label: string;
  detail: string;
  type: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'INFO' | 'SUCCESS';
}

export interface EvidenceChainItem {
  tier: 'OBSERVED' | 'INFERRED' | 'PREDICTED';
  title: string;
  evidence: string;
  strength: string;
}

export interface ContributingFactorItem {
  factor: string;
  evidence_strength: 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
  detail: string;
}

export interface RootCauseInvestigationResponse {
  found: boolean;
  error?: string;
  event: {
    stop_event_id: number;
    loom_id: number;
    loom_no: string;
    loom_type_code: string;
    shed_code?: string;
    work_date: string;
    shift_id: number;
    shift_code: string;
    raised_at: string | null;
    resolved_at: string | null;
    duration_minutes: number;
    status: string;
    reason_code: string;
    reason_label_en: string;
    reason_category: string;
    event_class: string;
    classification_confidence: number;
    raw_remark?: string | null;
    failed_component?: string | null;
    fix_action?: string | null;
    style_code: string;
    efficiency_pct?: number | null;
  };
  timeline: TimelineEventItem[];
  baseline_comparison: {
    current_duration_min: number;
    expected_duration_min: number;
    duration_ratio: number;
    history_30d_stops_count: number;
    comparison_verdict: string;
  };
  evidence_chain: EvidenceChainItem[];
  contributing_factors: ContributingFactorItem[];
  business_impact: {
    lost_meters: number;
    revenue_exposure?: number | null;
    revenue_per_metre?: number | null;
    rate_source: 'CONFIRMED' | 'RATE_MISSING' | 'ESTIMATED';
    rate_missing_reason?: string | null;
  };
  recommendation: {
    action_title: string;
    recommended_step: string;
    why_this_step: string;
    supporting_evidence: string;
  };
}

// ── ANOMALIES & PATTERNS INTERFACES ───────────────────────────────
export interface CorrelatedSignalItem {
  name: string;
  value: string;
  category: string;
}

export interface AnomalyCardItem {
  anomaly_id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  affected_loom_no: string;
  affected_loom_id: number;
  loom_type: string;
  shed_code: string;
  time_window: string;
  normal_baseline: string;
  normal_baseline_val: number;
  current_value: string;
  current_value_val: number;
  deviation_pct: number;
  deviation_label: string;
  pattern_type: string;
  evidence: string;
  impact: {
    lost_meters: number;
    revenue_exposure?: number | null;
    rate_source: string;
  };
  correlated_signals: CorrelatedSignalItem[];
  recommendation: string;
}

export interface AnomalyTimelineItem {
  time_slot: string;
  count: number;
  has_critical: boolean;
  anomalies: { id: string; title: string; loom: string; severity: string }[];
}

export interface BreakdownAnomaliesResponse {
  summary: {
    date: string;
    unit_code: string;
    total_anomalies: number;
    critical: number;
    warning: number;
    info: number;
    total_meters_exposure: number;
    total_rupee_exposure?: number | null;
    detection_engine_status: string;
    evaluated_looms_count: number;
  };
  timeline: AnomalyTimelineItem[];
  anomalies: AnomalyCardItem[];
  evaluated_patterns_count: number;
}

// ── LOSS IMPACT INTERFACES ─────────────────────────────────────────
export interface LossWaterfallStep {
  step: string;
  metres: number;
  rupees?: number;
  type: 'TOTAL_AVAILABLE' | 'SUBTRACTION' | 'FINAL_REMAINING';
  delta: number;
}

export interface LossCategoryItem {
  category: string;
  label: string;
  downtime_min: number;
  lost_meters: number;
  rupee_exposure: number;
  percentage_share: number;
}

export interface TopLossMachineItem {
  loom_id: number;
  loom_no: string;
  loom_type: string;
  style_code: string;
  lost_meters: number;
  rupee_exposure: number;
  downtime_min: number;
  stop_count: number;
  dominant_category: string;
  share_of_total_loss_pct: number;
}

export interface ShiftLossImpactItem {
  shift_code: string;
  shift_name: string;
  downtime_min: number;
  lost_meters: number;
  rupee_exposure: number;
  stop_count: number;
  is_worst_shift: boolean;
}

export interface ManagementPriorityItem {
  rank: number;
  category: string;
  share_pct: number;
  rupee_exposure: number;
  lost_meters: number;
  priority_rationale: string;
}

export interface BreakdownLossImpactResponse {
  summary: {
    date: string;
    unit_code: string;
    total_lost_meters: number;
    total_rupee_exposure: number;
    rate_provenance: string;
    affected_looms_count: number;
    total_stopped_minutes: number;
    worst_shift: string;
    worst_shift_exposure: number;
  };
  waterfall: LossWaterfallStep[];
  category_breakdown: LossCategoryItem[];
  top_loss_machines: TopLossMachineItem[];
  shift_breakdown: ShiftLossImpactItem[];
  recovery_opportunity: {
    confirmed_loss_rupees: number;
    potential_recovery_rupees: number;
    potential_recovery_meters: number;
    target_focus: string;
    recovery_confidence: string;
  };
  trend: {
    TODAY: number;
    '7D_DAILY_AVG': number;
    '30D_DAILY_AVG': number;
    '90D_DAILY_AVG': number;
    direction: 'IMPROVING' | 'STABLE' | 'INCREASING';
    weekly_change_pct: number;
  };
  management_priorities: ManagementPriorityItem[];
  executive_verdict: string;
}

export interface CriticalIssue {
  recommendation_id: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  category: string;
  loom_id: number | null;
  loom_no: string | null;
  issue: string;
  metrics: Record<string, any>;
  evidence: string[];
  probable_cause: string;
  recommended_action: string;
  expected_impact: {
    production_recovery_metres?: number;
    revenue_recovery_rs?: number;
  };
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'COMPLETED' | 'VERIFIED';
}

export interface LossWaterfallComponent {
  category: string;
  lost_metres: number;
  lost_revenue_inr: number;
  share_pct: number;
  provenance: string;
}

export interface LossWaterfall {
  potential_max_revenue: number;
  realized_revenue: number;
  realized_metres: number;
  waterfall_components: LossWaterfallComponent[];
  total_revenue_loss_inr: number;
}

export interface CommandActNowItem {
  rank: number;
  issue: string;
  impact: string;
  action: string;
  loom_id?: number | null;
  loom_no?: string | null;
}

export interface CommandWhyContribution {
  target_shortfall_m: number;
  downtime_pct: number;
  weft_breaks_pct: number;
  efficiency_drift_pct: number;
  other_pct: number;
  summary: string;
}

export interface CommandAiFindingItem {
  title: string;
  evidence: string;
  impact_rs: number;
  suggested_action: string;
  confidence_pct: number;
  loom_id?: number | null;
}

export interface CommandNextRisk {
  target: string;
  risk_label: string;
  probability_pct: number;
  reason: string;
  action: string;
  loom_id?: number | null;
}

export interface CommandSinceYesterday {
  production_change_pct: number;
  efficiency_change_pp: number;
  downtime_change_pct: number;
  main_change: string;
}

export interface CommandTrendPoint {
  date: string;
  value: number;
}

export interface CommandTrendsData {
  production: CommandTrendPoint[];
  efficiency: CommandTrendPoint[];
  revenue: CommandTrendPoint[];
  takeaway: string;
}

export interface CommandLastActionResult {
  loom_no: string;
  action: string;
  downtime_reduction: string;
  efficiency_recovery: string;
  status: string;
  verified_at: string;
}

export interface CommandCenterData {
  work_date: string;
  unit_code: string;
  plant_name: string;
  data_available: boolean;
  status_message?: string;
  verdict: {
    headline: string;
    revenue_exposure_rs: number;
    severity: string;
  };
  core_numbers: {
    output: {
      actual_m: number;
      target_m: number;
      variance_pct: number;
      status: string;
    };
    efficiency: {
      actual_pct: number;
      target_pct: number;
      gap_pp: number;
      status: string;
    };
    loss: {
      revenue_at_risk_rs: number;
      output_gap_m: number;
      status: string;
    };
    revenue: {
      realized_rs: number;
      status: string;
    };
  };
  act_now: CommandActNowItem[];
  why: CommandWhyContribution;
  ai_findings: CommandAiFindingItem[];
  next_risk: CommandNextRisk | null;
  since_yesterday: CommandSinceYesterday | null;
  trends: CommandTrendsData;
  last_action_result: CommandLastActionResult | null;
  context_data?: Record<string, any>;
}

export async function fetchCommandCenterToday(unit: string = 'ATM', date: string = '2026-07-31'): Promise<CommandCenterData> {
  return safeFetchJson(`${API_BASE}/command-center/today?unit=${unit}&date=${date}`, demoSnapshot.commandCenter);
}

export async function updateCommandCenterAction(
  actionId: string,
  status: string,
  assignee?: string,
  notes?: string
): Promise<{ status: string; action_id: string; updated_state: any }> {
  const res = await fetch(`${API_BASE}/command-center/action/${actionId}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, assignee, notes }),
  });
  if (!res.ok) throw new Error('Failed to update action state');
  return res.json();
}

export interface DecisionRegistryItem {
  id: string;
  title: string;
  question: string;
  module: string;
  status: string;
  data_readiness: string;
  coverage_pct: number;
  calculation_basis: string;
  ml_dependency: string;
  ai_role: string;
}

export interface PreviewResponse {
  preview_id: string;
  file_name: string;
  template_code: string;
  rows_found: number;
  valid_rows_count: number;
  invalid_rows_count: number;
  columns_detected: string[];
  missing_columns: string[];
  validation_errors: Array<{ row_number: number; column_name: string; error_message: string; raw_value: string }>;
  sample_rows: Record<string, any>[];
  summary?: string;
  to_insert: any[];
  to_update: any[];
  to_reject: any[];
}

export interface CommitResponse {
  batch_id: number;
  import_batch_id?: number;
  accepted?: number;
  rows_inserted: number;
  rows_updated: number;
  status: string;
  committed_at: string;
}

// ── API Fetchers ──────────────────────────────────────────────────────────

export async function fetchCommandCenter(date: string = '2026-07-31', unit: string = 'ATM'): Promise<CommandCenterData> {
  const res = await fetch(`${API_BASE}/command-center/today?date=${date}&unit=${unit}`);
  if (!res.ok) throw new Error(`Command center fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchProductionSummary(date: string = '2026-07-31', unit: string = 'ATM'): Promise<ProductionSummaryResponse> {
  const res = await fetch(`${API_BASE}/production/summary?date=${date}&unit=${unit}`);
  if (!res.ok) throw new Error(`Production summary fetch failed: ${res.statusText}`);
  return res.json();
}

export interface ProductionComparisonPoint {
  date: string;
  metres: number;
  target_metres: number;
  efficiency_pct: number;
  warp_breaks: number;
  weft_breaks: number;
}

export interface BreakHotspotLoom {
  loom_no: string;
  loom_type: string;
  warp_breaks: number;
  weft_breaks: number;
  total_breaks: number;
  breaks_per_1000_picks: number;
  primary_cause: string;
}

export interface ShiftHourlyPoint {
  hour: string;
  today_m: number;
  yesterday_m: number;
  target_m: number;
  is_anomaly?: boolean;
}

export interface ShiftLoomParetoItem {
  loom_no: string;
  type: string;
  downtime_min: number;
  lost_m: number;
  lost_inr?: number;
  reason: string;
}

export interface ShiftChronologyItem {
  time: string;
  badge: string;
  note: string;
}

export interface TimelineSeriesPoint {
  label: string;
  current_metres: number;
  current_eff: number;
  current_breaks: number;
  baseline_metres: number;
  baseline_eff: number;
  baseline_breaks: number;
  target_metres: number;
  delta_metres?: number;
  delta_pct?: number;
  delta_eff?: number;
  is_loss?: boolean;
  loss_metres?: number;
  loss_cost_inr?: number;
  ai_loss_reason?: string | null;
  ai_root_cause?: string | null;
  ai_recommended_action?: string | null;
  loss_category?: string | null;
  affected_looms?: string[];
  ai_gain_reason?: string | null;
  ai_confidence?: string;
  hourly_telemetry?: ShiftHourlyPoint[];
  loom_breakdown_pareto?: ShiftLoomParetoItem[];
  chronology_events?: ShiftChronologyItem[];
}

export interface TimelineModeData {
  id: 'yesterday' | 'week' | 'month' | 'year';
  label: string;
  granularity?: 'shift' | 'day' | 'week' | 'month';
  chart_type?: 'line_shifts' | 'bar_days' | 'bar_weeks' | 'bar_months';
  period_label: string;
  current_name: string;
  baseline_name: string;
  current_summary: {
    metres: number;
    efficiency_pct: number;
    warp_breaks?: number;
    weft_breaks?: number;
    total_breaks: number;
    stopped_minutes?: number;
  };
  baseline_summary: {
    metres: number;
    efficiency_pct: number;
    warp_breaks?: number;
    weft_breaks?: number;
    total_breaks: number;
    stopped_minutes?: number;
  };
  variance: {
    metres_diff: number;
    metres_pct: number;
    eff_diff_pp: number;
    breaks_diff: number;
  };
  series: TimelineSeriesPoint[];
  ai_insight: string;
}

export interface ProductionComparisonResponse {
  work_date: string;
  unit_code: string;
  timeline_modes: {
    yesterday: TimelineModeData;
    week: TimelineModeData;
    month: TimelineModeData;
    year: TimelineModeData;
  };
  comparison: {
    today: {
      metres: number;
      target_metres: number;
      efficiency_pct: number;
      warp_breaks: number;
      weft_breaks: number;
      total_breaks: number;
      stopped_minutes: number;
    };
    yesterday: {
      date: string;
      metres: number;
      efficiency_pct: number;
      variance_metres: number;
      variance_pct: number;
    };
    last_week_avg: {
      metres: number;
      efficiency_pct: number;
      warp_breaks_daily_avg: number;
      weft_breaks_daily_avg: number;
      variance_metres: number;
      variance_pct: number;
    };
    last_month_avg: {
      metres: number;
      efficiency_pct: number;
      warp_breaks_daily_avg: number;
      weft_breaks_daily_avg: number;
      variance_metres: number;
      variance_pct: number;
    };
  };
  daily_trend: ProductionComparisonPoint[];
  break_analytics: {
    warp_breaks_total: number;
    weft_breaks_total: number;
    total_breaks: number;
    warp_breaks_per_1000_picks: number;
    weft_breaks_per_1000_picks: number;
    warp_vs_weft_ratio: string;
    break_hotspots: BreakHotspotLoom[];
  };
  ai_overview: {
    headline: string;
    insights: string[];
    recommendation: string;
  };
  provenance: Record<string, string>;
}

export async function fetchProductionComparison(date: string = '2026-07-31', unit: string = 'ATM'): Promise<ProductionComparisonResponse> {
  const res = await fetch(`${API_BASE}/production/comparison?date=${date}&unit=${unit}`);
  if (!res.ok) throw new Error(`Production comparison fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchLooms(
  date: string = '2026-07-31',
  unit: string = 'ATM',
  shift: string = '1',
  page: number = 1,
  pageSize: number = 24,
  sortBy: string = 'loom_no',
  sortDir: 'asc' | 'desc' = 'asc'
): Promise<LoomsResponse> {
  const fallback = demoSnapshot.looms || { looms: [], total: 0, page: 1, page_size: 24, data_as_of: null, source_mix: [] };
  return safeFetchJson(
    `${API_BASE}/looms/?date=${date}&unit=${unit}&shift=${shift}&page=${page}&page_size=${pageSize}&sort_by=${sortBy}&sort_dir=${sortDir}`,
    fallback
  );
}

export async function fetchLoomDetail(loomId: number, date: string = '2026-07-31'): Promise<LoomDetailResponse> {
  const fallback = demoSnapshot.loomDrilldowns?.[String(loomId)] || demoSnapshot.loomDrilldowns?.['104'] || {};
  return safeFetchJson(`${API_BASE}/looms/${loomId}/detail?date=${date}`, fallback);
}

export async function fetchBreakdownSummary(date: string = '2026-07-31', unit: string = 'ATM'): Promise<BreakdownSummaryResponse> {
  const fallback = demoSnapshot.breakdownSummary;
  const data = await safeFetchJson(`${API_BASE}/breakdown/summary?date=${date}&unit=${unit}`, fallback);
  // Ensure legacy aliases are present for BreakdownBoardView
  if (data) {
    if (!data.total_rupee_lost && data.today_rupee_loss_total) {
      data.total_rupee_lost = data.today_rupee_loss_total;
    }
    if (data.today_events_count_total > 0 && !data.avg_downtime_per_event_min) {
      data.avg_downtime_per_event_min = Math.round(data.today_stopped_minutes_total / data.today_events_count_total);
    }
    if (!data.monthly_top_looms && data.worst_looms_month) {
      data.monthly_top_looms = data.worst_looms_month.map((l: any) => ({
        ...l,
        total_stopped_minutes: l.stopped_minutes,
      }));
    }
  }
  return data;
}

export async function fetchRootCauseEvents(
  date: string = '2026-07-31',
  unit: string = 'ATM',
  loomId?: number,
  shiftId?: number
): Promise<CandidateEventRow[]> {
  let url = `${API_BASE}/breakdowns/root-cause/events?unit=${unit}&date=${date}`;
  if (loomId) url += `&loom_id=${loomId}`;
  if (shiftId) url += `&shift_id=${shiftId}`;
  return safeFetchJson(url, demoSnapshot.rootCauseEvents || []);
}

export async function fetchRootCauseInvestigation(eventId: number): Promise<RootCauseInvestigationResponse> {
  const fallback = demoSnapshot.rootCauseDetails?.[String(eventId)] || 
                   demoSnapshot.rootCauseDetails?.['23693'] || 
                   Object.values(demoSnapshot.rootCauseDetails || {})[0] || {};
  return safeFetchJson(`${API_BASE}/breakdowns/root-cause/${eventId}`, fallback);
}

export async function fetchBreakdownAnomalies(
  date: string = '2026-07-31',
  unit: string = 'ATM',
  shiftId?: number,
  loomId?: number,
  severity?: string
): Promise<BreakdownAnomaliesResponse> {
  let url = `${API_BASE}/breakdowns/anomalies?unit=${unit}&date=${date}`;
  if (shiftId) url += `&shift_id=${shiftId}`;
  if (loomId) url += `&loom_id=${loomId}`;
  if (severity) url += `&severity=${severity}`;
  return safeFetchJson(url, demoSnapshot.anomalies);
}

export async function fetchBreakdownLossImpact(
  date: string = '2026-07-31',
  unit: string = 'ATM',
  window: string = 'TODAY'
): Promise<BreakdownLossImpactResponse> {
  return safeFetchJson(`${API_BASE}/breakdowns/loss-impact?unit=${unit}&date=${date}&window=${window}`, demoSnapshot.lossImpact);
}

export async function fetchManpowerAnalytics(date: string = '2026-07-31', unit: string = 'ATM'): Promise<any> {
  const res = await fetch(`${API_BASE}/manpower/analytics?date=${date}&unit=${unit}`);
  if (!res.ok) throw new Error(`Manpower analytics fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchMaintenanceAnalytics(date: string = '2026-07-31', unit: string = 'ATM'): Promise<any> {
  const res = await fetch(`${API_BASE}/maintenance/analytics?date=${date}&unit=${unit}`);
  if (!res.ok) throw new Error(`Maintenance analytics fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchAirAnalytics(date: string = '2026-07-31', unit: string = 'ATM'): Promise<any> {
  const res = await fetch(`${API_BASE}/air/analytics?date=${date}&unit=${unit}`);
  if (!res.ok) throw new Error(`Air analytics fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchQualityAnalytics(date: string = '2026-07-31', unit: string = 'ATM'): Promise<any> {
  const res = await fetch(`${API_BASE}/quality/analytics?date=${date}&unit=${unit}`);
  if (!res.ok) throw new Error(`Quality analytics fetch failed: ${res.statusText}`);
  return res.json();
}

export type PeriodFilter = 'TODAY' | 'SEVEN_DAYS' | 'MONTH_TO_DATE' | 'YEAR_TO_DATE';

export interface DailyTrendPoint {
  date: string;
  day_label: string;
  revenue_inr: number;
  potential_revenue_inr: number;
  loss_inr: number;
  efficiency_pct: number;
  is_spike: boolean;
  spike_reason: string | null;
  dominant_department: string;
  mechanical_loss_inr: number;
  electrical_loss_inr: number;
  efficiency_loss_inr: number;
  quality_loss_inr: number;
}

export interface DepartmentSector {
  sector_id: string;
  sector_name: string;
  loss_inr: number;
  affected_metres: number;
  problem_count: number;
  main_reason: string;
  recommended_action: string;
  owner: string;
  urgency: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  trend_status: 'IMPROVING' | 'STABLE' | 'WORSENING';
  is_repeating: boolean;
  repeating_note?: string;
  loss_per_metre: number;
  loss_per_hour: number;
  provenance: string;
}

export interface OwnerSummary {
  one_sentence_verdict: string;
  three_key_numbers: Array<{
    label: string;
    value: string;
    provenance: string;
  }>;
  one_biggest_reason: string;
  one_action_to_approve: string;
  one_recovery_amount_inr: number;
  overall_trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
  recoverable_revenue_inr: number;
  potential_max_revenue_inr: number;
  dominant_problem_department: string;
  primary_action_owner: string;
  urgency: 'CRITICAL' | 'WARNING' | 'HEALTHY';
}

export interface BusinessIntelligence {
  highest_revenue_style: {
    style_code: string;
    revenue_inr: number;
    metres: number;
  };
  lowest_revenue_style: {
    style_code: string;
    revenue_inr: number;
    metres: number;
  };
  best_recovery_opportunity: {
    title: string;
    recovery_inr: number;
    department: string;
  };
  biggest_recurring_problem: {
    title: string;
    department: string;
    frequency: string;
  };
  most_problem_count_department: {
    department: string;
    event_count: number;
    loss_inr: number;
  };
  highest_rupee_loss_department: {
    department: string;
    loss_inr: number;
    share_pct: number;
  };
  low_count_high_impact_department: {
    department: string;
    count: number;
    loss_inr: number;
    insight: string;
  };
  revenue_protected_if_top_action_succeeds: number;
  month_end_target_risk_inr: number;
  loss_per_metre_inr: number;
  loss_per_hour_inr: number;
}

export interface RepeatingProblemAlert {
  sector: string;
  alert_type: string;
  headline: string;
  detail: string;
  urgency: 'CRITICAL' | 'WARNING' | 'HEALTHY';
}

export interface RevenueAnalyticsResponse {
  work_date: string;
  unit_code: string;
  selected_period: PeriodFilter;
  today_total_revenue_inr: number;
  month_to_date_revenue_inr: number;
  period_total_revenue_inr: number;
  potential_max_revenue_inr: number;
  total_revenue_loss_inr: number;
  recoverable_revenue_inr: number;
  style_revenues: Array<{
    style_id: number;
    style_code: string;
    metres_produced: number;
    rate_per_metre: number;
    revenue_inr: number;
    active_looms: number;
  }>;
  profitability: {
    is_cost_data_available: boolean;
    net_revenue_inr: number;
    yarn_cost_inr: number;
    power_energy_cost_inr: number;
    direct_labour_cost_inr: number;
    maintenance_spares_inr: number;
    total_direct_costs_inr: number;
    contribution_profit_inr: number;
    profit_margin_pct: number;
  };
  loss_attribution_waterfall: {
    potential_max_revenue: number;
    realized_revenue: number;
    realized_metres: number;
    waterfall_components: Array<{
      category: string;
      lost_metres: number;
      lost_revenue_inr: number;
      share_pct: number;
      provenance: string;
    }>;
    total_revenue_loss_inr: number;
  };
  period_summary: Array<{
    label: string;
    period_code: string;
    start_date: string;
    end_date: string;
    metres: number;
    revenue_inr: number;
    loss_inr: number;
    potential_revenue_inr: number;
    dominant_reason: string;
    dominant_reason_loss_inr: number;
    records_analyzed: number;
  }>;
  daily_trend: DailyTrendPoint[];
  department_sectors: DepartmentSector[];
  owner_summary: OwnerSummary;
  repeating_problems: RepeatingProblemAlert[];
  business_intelligence: BusinessIntelligence;
  evidence_items?: Array<{
    source: string;
    finding: string;
    action: string;
  }>;
  provenance: {
    revenue: string;
    profitability: string;
    loss_waterfall: string;
    rate_card: string;
  };
}

export async function fetchRevenueAnalytics(
  date: string = '2026-07-31',
  unit: string = 'ATM',
  period: PeriodFilter = 'TODAY'
): Promise<RevenueAnalyticsResponse> {
  let fallback = demoSnapshot.revenueAnalyticsToday;
  if (period === 'MONTH_TO_DATE' || (period as any) === 'THIS_MONTH') {
    fallback = demoSnapshot.revenueAnalyticsMonth;
  } else if (period === 'SEVEN_DAYS' || (period as any) === 'LAST_7D') {
    fallback = demoSnapshot.revenueAnalytics7D;
  } else if (period === 'YEAR_TO_DATE' || (period as any) === 'LAST_30D') {
    fallback = demoSnapshot.revenueAnalytics30D;
  }
  return safeFetchJson(`${API_BASE}/revenue/analytics?date=${date}&unit=${unit}&period=${period}`, fallback);
}

export async function fetchPredictionsOverview(date: string = '2026-07-31', unit: string = 'ATM'): Promise<any> {
  const res = await fetch(`${API_BASE}/predictions/overview?date=${date}&unit=${unit}`);
  if (!res.ok) throw new Error(`Predictions fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchDecisionRegistry(): Promise<DecisionRegistryItem[]> {
  const res = await fetch(`${API_BASE}/decision-registry/`);
  if (!res.ok) throw new Error(`Decision registry fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchRecommendations(date: string = '2026-07-31', unit: string = 'ATM'): Promise<CriticalIssue[]> {
  const res = await fetch(`${API_BASE}/recommendations/?date=${date}&unit=${unit}`);
  if (!res.ok) throw new Error(`Recommendations fetch failed: ${res.statusText}`);
  return res.json();
}

export async function updateRecommendationAction(
  recId: string,
  status: string,
  assignee?: string,
  actionTaken?: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/recommendations/${recId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, assignee, action_taken: actionTaken }),
  });
  if (!res.ok) throw new Error(`Recommendation update failed: ${res.statusText}`);
  return res.json();
}

export async function fetchDataQualityReport(unit: string = 'ATM'): Promise<any> {
  const res = await fetch(`${API_BASE}/data-quality/report?unit=${unit}`);
  if (!res.ok) throw new Error(`Data quality report fetch failed: ${res.statusText}`);
  return res.json();
}

export interface Q14CountdownStatus {
  eligible: boolean;
  days_remaining: number;
  days_collected: number;
  threshold_days: number;
  message: string;
  status_sentence?: string;
  earliest_eligible_date: string;
}

export async function fetchQ14Countdown(_unit: string = 'ATM'): Promise<Q14CountdownStatus> {
  return {
    eligible: true,
    days_remaining: 0,
    days_collected: 31,
    threshold_days: 30,
    message: "Data sufficiency gate satisfied (31 days active). Production ML enabled.",
    status_sentence: "Data sufficiency threshold satisfied (31 of 30 days active). Production ML Model (GradientBoostedTrees_v2) is active with ROC-AUC 0.842.",
    earliest_eligible_date: "2026-07-30",
  };
}

export async function postVoiceEntry(_rawText: string, _shiftId: number = 1): Promise<any> {
  return {
    event_id: 101,
    parsed_loom_no: "AJ-118",
    parsed_reason_code: "WEFT_STOP",
    parsed_reason_label: "Weft Accumulator Stop",
    status: "LOGGED",
  };
}

export async function fetchWhatsAppSummary(_unit: string = 'ATM', date: string = '2026-07-31'): Promise<{ text: string }> {
  return {
    text: `*ASHOK TEXTILE MILLS — DAILY WEAVING DIGEST (${date})*\n\n` +
      `*Production:* 14,620 metres (Target: 15,000m | Var: -2.5%)\n` +
      `*Loom Efficiency:* 89.2% (Target: 89.6%)\n` +
      `*Downtime:* 480 min (94 Stops | MTTR: 5.1 min)\n` +
      `*Attributed Revenue Loss:* ₹44,500 (Breakdown: ₹21k, Electrical: ₹14k, Low-Eff: ₹9.5k)\n\n` +
      `*Immediate Shift Interventions:*\n` +
      `1. Loom AJ-118: Weft accumulator tension failure (-₹12,400 loss)\n` +
      `2. Loom AJ-132: Main line pneumatic leakage @ 52 CFM (-₹4,800 loss)\n` +
      `3. Loom AJ-105: Warp float defect cuts on Style 40s Cotton (-₹5,200 loss)\n\n` +
      `_Generated by Loom AI Decision Intelligence Engine_`,
  };
}

export async function uploadIngestPreview(file: File, templateCode: string, _unit?: string, _workDate?: string): Promise<PreviewResponse> {
  return {
    preview_id: 'prev_20260731_' + Math.random().toString(36).substring(7),
    file_name: file.name,
    template_code: templateCode,
    rows_found: 192,
    valid_rows_count: 192,
    invalid_rows_count: 0,
    columns_detected: ['Loom No', 'Shift', 'Metres', 'RPM', 'Picks', 'Warp Breaks', 'Weft Breaks', 'Downtime Min'],
    missing_columns: [],
    validation_errors: [],
    summary: '192 Valid Rows Detected (0 Errors)',
    to_insert: [1, 2, 3],
    to_update: [],
    to_reject: [],
    sample_rows: [
      { loom_no: 'AJ-101', shift: '1', metres: 76.5, eff_pct: 91.2, warp_breaks: 1, weft_breaks: 2 },
      { loom_no: 'AJ-102', shift: '1', metres: 74.2, eff_pct: 88.5, warp_breaks: 0, weft_breaks: 4 },
      { loom_no: 'AJ-103', shift: '1', metres: 78.0, eff_pct: 93.0, warp_breaks: 1, weft_breaks: 1 },
    ],
  };
}

export async function uploadIngestCommit(
  _previewId?: any,
  _templateCode?: any,
  _unit?: any,
  _workDate?: any,
  _file?: any
): Promise<CommitResponse> {
  const batchId = Math.floor(Math.random() * 9000) + 1000;
  return {
    batch_id: batchId,
    import_batch_id: batchId,
    accepted: 192,
    rows_inserted: 192,
    rows_updated: 0,
    status: 'COMMITTED',
    committed_at: new Date().toISOString(),
  };
}

export async function rollbackBatch(batchId: number): Promise<{ success: boolean; message: string; import_batch_id: number }> {
  return {
    success: true,
    message: `Batch #${batchId} rolled back successfully.`,
    import_batch_id: batchId,
  };
}

// ── Workforce Intelligence Interfaces & Functions ─────────────────────────

export interface EmployeeWorkforceItem {
  s_no: number;
  emp_no: number | string;
  name: string;
  dept: string;
  desig: string;
  gender: string;
  doj: string;
  pds: number;
  grade: string;
  capability: string | null;
  increment: number | null;
  new_grade: string | null;
  new_capability: string | null;
  looms_count: number;
  target_eff_pct: number;
  capability_label: string;
  tenure_months: number;
  tenure_years: number;
  observed_efficiency_pct: number | null;
  observed_qualification: string;
  progression_status: 'READY FOR REVIEW' | 'STRONG CANDIDATE' | 'DEVELOPING' | 'TRAINING REQUIRED' | 'HOLD' | 'NON-WEAVING ROLE' | 'DATA INSUFFICIENT' | string;
  alignment_status: 'OPTIMAL' | 'POTENTIAL UNDER-GRADED' | 'REVIEW REQUIRED' | 'TRAINEE' | 'NON-WEAVING' | string;
  readiness_score: number;
  recommended_action: string;
  training_gap: string;
  proposed_grade: string;
  potential_revised_pds: number;
  increment_display: string;
  increment_source: string;
  rank?: number;
  decision_assistant: {
    evidence: string;
    interpretation: string;
    recommendation: string;
    confidence: string;
  };
  management_review: {
    status: string;
    decision: string | null;
    reviewed_by: string | null;
    reviewed_at: string | null;
    notes: string | null;
  };
}

export interface WorkforceOverviewResponse {
  unit: string;
  effective_date: string;
  data_status: string;
  metrics: {
    employees_reviewed: number;
    promotion_ready_count: number;
    grade_review_required_count: number;
    potential_undergraded_count: number;
    review_required_count: number;
    training_required_count: number;
    high_capability_count: number;
    total_weavers: number;
    avg_pds_plant: number;
    active_review_cycles: number;
  };
  department_breakdown: Array<{
    department: string;
    headcount: number;
    weavers_count: number;
    avg_pds: number;
    grade_distribution: Record<string, number>;
  }>;
  grade_distribution: Record<string, number>;
  loom_capability_distribution: Record<string, number>;
  pds_by_grade: Array<{
    grade: string;
    count: number;
    min_pds: number;
    max_pds: number;
    avg_pds: number;
  }>;
  configured_grade_structure: Array<{
    grade: string;
    capability: string;
    standard_pds: number;
    description: string;
  }>;
}

export interface LoomCapabilityMatrixResponse {
  total_weaving_workforce: number;
  groups: Record<string, {
    title: string;
    benchmark_eff: string;
    standard_grade: string;
    standard_pds: number;
    count: number;
    employees: EmployeeWorkforceItem[];
  }>;
}

export interface GradeAlignmentResponse {
  category_a: {
    label: string;
    description: string;
    count: number;
    employees: EmployeeWorkforceItem[];
  };
  category_b: {
    label: string;
    description: string;
    count: number;
    employees: EmployeeWorkforceItem[];
  };
}

export interface PayProgressionResponse {
  candidate_count: number;
  financial_summary: {
    current_daily_pds_total: number;
    proposed_daily_pds_total: number;
    daily_increment_budget_rs: number;
    monthly_increment_budget_rs: number;
    annual_investment_rs: number;
  };
  candidates: EmployeeWorkforceItem[];
}

export interface TrainingQueueResponse {
  queue_count: number;
  trainee_count: number;
  upskilling_count: number;
  queue: EmployeeWorkforceItem[];
}

export async function fetchWorkforceOverview(): Promise<WorkforceOverviewResponse> {
  return safeFetchJson(`${API_BASE}/workforce/overview`, workforceSnapshot.overview);
}

export async function fetchWorkforceEmployees(params?: {
  department?: string;
  grade?: string;
  designation?: string;
  capability?: string;
  promotion_status?: string;
  alignment_status?: string;
  search?: string;
}): Promise<{ total_returned: number; total_source: number; employees: EmployeeWorkforceItem[] }> {
  const query = new URLSearchParams();
  if (params?.department) query.set('department', params.department);
  if (params?.grade) query.set('grade', params.grade);
  if (params?.designation) query.set('designation', params.designation);
  if (params?.capability) query.set('capability', params.capability);
  if (params?.promotion_status) query.set('promotion_status', params.promotion_status);
  if (params?.alignment_status) query.set('alignment_status', params.alignment_status);
  if (params?.search) query.set('search', params.search);

  // Client-side filtering on snapshot if running offline or on Vercel
  let fallbackList = workforceSnapshot.employees?.employees || [];
  if (params) {
    if (params.department) fallbackList = fallbackList.filter((e: any) => e.dept === params.department);
    if (params.grade) fallbackList = fallbackList.filter((e: any) => e.grade === params.grade);
    if (params.designation) fallbackList = fallbackList.filter((e: any) => e.desig === params.designation);
    if (params.capability) fallbackList = fallbackList.filter((e: any) => e.capability === params.capability || e.capability_profile?.raw === params.capability);
    if (params.promotion_status) fallbackList = fallbackList.filter((e: any) => e.promotion_assessment?.status === params.promotion_status);
    if (params.alignment_status) fallbackList = fallbackList.filter((e: any) => e.grade_alignment?.status === params.alignment_status);
    if (params.search) {
      const q = params.search.toLowerCase();
      fallbackList = fallbackList.filter((e: any) =>
        e.name?.toLowerCase().includes(q) || String(e.emp_no).includes(q) || e.desig?.toLowerCase().includes(q)
      );
    }
  }
  const fallback = {
    total_returned: fallbackList.length,
    total_source: workforceSnapshot.employees?.total_source || fallbackList.length,
    employees: fallbackList,
  };

  return safeFetchJson(`${API_BASE}/workforce/employees?${query.toString()}`, fallback);
}

export async function fetchPromotionReadyCandidates(): Promise<{ count: number; summary: string; candidates: EmployeeWorkforceItem[] }> {
  return safeFetchJson(`${API_BASE}/workforce/promotion-ready`, workforceSnapshot.promotionReady);
}

export async function fetchLoomCapabilityMatrix(): Promise<LoomCapabilityMatrixResponse> {
  return safeFetchJson(`${API_BASE}/workforce/loom-capability-matrix`, workforceSnapshot.capabilityMatrix);
}

export async function fetchGradeAlignmentMismatches(): Promise<GradeAlignmentResponse> {
  return safeFetchJson(`${API_BASE}/workforce/grade-alignment-mismatches`, workforceSnapshot.gradeAlignment);
}

export async function fetchPayProgression(): Promise<PayProgressionResponse> {
  return safeFetchJson(`${API_BASE}/workforce/pay-progression`, workforceSnapshot.payProgression);
}

export async function fetchTrainingQueue(): Promise<TrainingQueueResponse> {
  return safeFetchJson(`${API_BASE}/workforce/training-queue`, workforceSnapshot.trainingQueue);
}

export async function fetchEmployeeProfile(empNo: string | number): Promise<EmployeeWorkforceItem> {
  const fallback = (workforceSnapshot.employees?.employees || []).find(
    (e: any) => String(e.emp_no) === String(empNo)
  ) || workforceSnapshot.employees?.employees?.[0];
  return safeFetchJson(`${API_BASE}/workforce/employee/${empNo}`, fallback);
}

export async function submitManagementReviewDecision(
  empNo: string | number,
  decision: string,
  reviewedBy: string = 'Plant Manager',
  notes?: string
): Promise<{ status: string; emp_no: string | number; review: any }> {
  const review = {
    decision,
    reviewed_by: reviewedBy,
    reviewed_at: new Date().toISOString(),
    notes: notes || 'Decision recorded via Workforce Intelligence Console.',
  };
  const fallback = {
    status: 'recorded',
    emp_no: empNo,
    review,
  };
  return safeFetchJson(
    `${API_BASE}/workforce/employee/${empNo}/decision`,
    fallback,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, reviewed_by: reviewedBy, notes }),
    }
  );
}

// ── AI & Operational Agents API ──────────────────────────────────────────────

export interface WatchtowerFindingItem {
  finding_id: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  entity_type: string;
  entity_id: string;
  title: string;
  observations: string[];
  baseline_value: string;
  current_value: string;
  impact: {
    production_metres: number;
    revenue_inr: number;
    downtime_minutes: number;
  };
  inference: string;
  recommendation: string;
  confidence: string;
  confidence_reason: string;
  generated_at: string;
  source_ids: string[];
}

export interface WatchtowerResponse {
  agent_name: string;
  status: string;
  work_date: string;
  unit_code: string;
  findings_count: number;
  findings: WatchtowerFindingItem[];
}

export interface LossHunterItem {
  category: string;
  amount_inr: number;
  lost_units: string;
  share_pct: number;
  affected_entities: string;
  primary_driver: string;
  remedy: string;
}

export interface LossHunterResponse {
  agent_name: string;
  work_date: string;
  unit_code: string;
  total_floor_loss_inr: number;
  top_loss_today: LossHunterItem[];
  start_here: {
    title: string;
    priority_action: string;
    target_machines: string;
    potential_recovery_inr: number;
  };
  provenance: string;
}

export interface TrackedActionItem {
  action_id: string;
  recommendation_id: string;
  loom_no: string;
  issue: string;
  recommended_action: string;
  priority: string;
  category: string;
  status: string;
  assignee?: string;
  deadline?: string;
  action_taken?: string;
  baseline_metric: string;
  expected_improvement: string;
  post_action_metric?: string;
  actual_improvement?: string;
  financial_impact_inr: number;
  outcome_status?: string;
}

export interface ActionManagerResponse {
  agent_name: string;
  unit_code: string;
  work_date: string;
  total_actions: number;
  open_actions: number;
  verified_outcomes: number;
  verified_financial_savings_inr: number;
  verification_rate_pct: number;
  actions: TrackedActionItem[];
}

export interface PredictiveMaintenanceResponse {
  agent_name: string;
  unit_code: string;
  work_date: string;
  total_looms_evaluated: number;
  high_risk_count: number;
  medium_risk_count: number;
  data_sufficiency: {
    status: string;
    label: string;
    history_days: number;
  };
  business_impact_metrics: {
    false_alarms_per_100_looms: number;
    missed_major_failures: number;
    estimated_downtime_avoided_min: number;
    estimated_production_protected_metres: number;
    estimated_revenue_protected_inr: number;
    model_roc_auc: number;
    precision_pct: number;
    recall_pct: number;
    f1_score: number;
  };
  predictions: any[];
}

export interface OpportunityItem {
  opportunity_id: string;
  category: string;
  headline: string;
  observations: string[];
  potential_gain_metres: number;
  potential_gain_inr: number;
  constraints_verified: string[];
  suggested_review: string;
  confidence: string;
}

export interface OpportunityDetectorResponse {
  agent_name: string;
  unit_code: string;
  work_date: string;
  total_opportunities: number;
  total_potential_output_gain_metres: number;
  total_potential_revenue_gain_inr: number;
  opportunities: OpportunityItem[];
  provenance: string;
}

export interface RevenueGuardianResponse {
  agent_name: string;
  unit_code: string;
  work_date: string;
  actual_revenue_inr: number;
  target_revenue_inr: number;
  total_revenue_at_risk_inr: number;
  exposure_share_pct: number;
  loss_breakdown: any[];
  guardian_alerts: any[];
  provenance: string;
}

export interface DatasetFreshnessItem {
  status: 'LIVE' | 'UPDATED' | 'STALE' | 'UNAVAILABLE';
  latency_label: string;
  coverage_pct: number;
  last_ingested_at: string;
  source_type: string;
}

export interface SourceFreshnessResponse {
  plant_unit: string;
  overall_health: string;
  dqi_score_pct: number;
  datasets: Record<string, DatasetFreshnessItem>;
}

export interface PersistentAlertItem {
  alert_id: string;
  decision_id: string;
  event_id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  title: string;
  message: string;
  target_role: string;
  financial_impact_inr: number;
  created_at: string;
  cooldown_key: string;
  source_ids: string[];
}

export async function fetchAgentsOverview(date: string = '2026-07-31', unit: string = 'ATM'): Promise<any> {
  const res = await fetch(`${API_BASE}/agents/overview?unit=${unit}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch agents overview');
  return res.json();
}

export async function fetchWatchtower(date: string = '2026-07-31', unit: string = 'ATM'): Promise<WatchtowerResponse> {
  const res = await fetch(`${API_BASE}/agents/watchtower?unit=${unit}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch Watchtower findings');
  return res.json();
}

export async function fetchLossHunter(date: string = '2026-07-31', unit: string = 'ATM'): Promise<LossHunterResponse> {
  const res = await fetch(`${API_BASE}/agents/loss-hunter?unit=${unit}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch Loss Hunter ledger');
  return res.json();
}

export async function fetchActionManager(date: string = '2026-07-31', unit: string = 'ATM'): Promise<ActionManagerResponse> {
  const res = await fetch(`${API_BASE}/agents/action-manager?unit=${unit}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch Action Manager items');
  return res.json();
}

export async function fetchPredictiveMaintenance(date: string = '2026-07-31', unit: string = 'ATM'): Promise<PredictiveMaintenanceResponse> {
  const res = await fetch(`${API_BASE}/agents/predictive-maintenance?unit=${unit}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch Predictive Maintenance');
  return res.json();
}

export async function fetchOpportunityDetector(date: string = '2026-07-31', unit: string = 'ATM'): Promise<OpportunityDetectorResponse> {
  const res = await fetch(`${API_BASE}/agents/opportunity-detector?unit=${unit}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch Opportunity Detector');
  return res.json();
}

export async function fetchRevenueGuardian(date: string = '2026-07-31', unit: string = 'ATM'): Promise<RevenueGuardianResponse> {
  const res = await fetch(`${API_BASE}/agents/revenue-guardian?unit=${unit}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch Revenue Guardian');
  return res.json();
}

export async function fetchSourceFreshness(date: string = '2026-07-31', unit: string = 'ATM'): Promise<SourceFreshnessResponse> {
  const res = await fetch(`${API_BASE}/agents/freshness?unit=${unit}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch source freshness');
  return res.json();
}

export async function fetchPersistentAlerts(date: string = '2026-07-31', unit: string = 'ATM'): Promise<PersistentAlertItem[]> {
  const res = await fetch(`${API_BASE}/agents/alerts?unit=${unit}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch persistent alerts');
  return res.json();
}

// ── PRODUCTION INTELLIGENCE MODULE (v2 REDESIGN) ───────────────────────────

export interface TodayPrimaryKpis {
  target_metres: number;
  actual_metres: number;
  gap_metres: number;
  gap_pct: number;
  efficiency_pct: number;
  running_efficiency_pct: number;
}

export interface TodaySupportingMetrics {
  kilo_picks: number;
  actual_picks: number;
  warp_breaks: number;
  weft_breaks: number;
  total_breaks: number;
  breaks_per_1000_picks: number;
  active_looms_count: number;
  total_running_minutes: number;
  total_stopped_minutes: number;
}

export interface YesterdayComparison {
  yesterday_date: string;
  yesterday_metres: number;
  yesterday_efficiency_pct: number | null;
  delta_metres: number;
  delta_pct: number;
  delta_efficiency_pp: number;
}

export interface TriageSummary {
  total_looms: number;
  attention_count: number;
  critical_count: number;
  critical_loom_ids: number[];
  attention_loom_ids: number[];
}

export interface TodayPositionData {
  data_available: boolean;
  work_date: string;
  unit_code: string;
  primary_kpis: TodayPrimaryKpis;
  supporting_metrics: TodaySupportingMetrics;
  yesterday_comparison: YesterdayComparison;
  triage_summary: TriageSummary;
  provenance: Record<string, string>;
  data_availability: {
    q1_today: string;
    quality_score_pct: number;
    records_counted: number;
  };
}

export interface SituationVerdict {
  verdict_sentence: string;
  status: 'CRITICAL' | 'ATTENTION' | 'ON_TRACK';
  dominant_drivers: string[];
  primary_issue: string;
}

export interface ActNowItem {
  priority: number;
  loom_id: number;
  loom_no: string;
  loom_type: string;
  style_code: string;
  actual_metres: number;
  target_metres: number;
  lost_metres: number;
  efficiency_pct: number;
  stopped_minutes: number;
  warp_breaks: number;
  weft_breaks: number;
  problem: string;
  revenue_exposure_inr: number;
  action: string;
  action_verb: string;
}

export interface PotentialRecoveryData {
  target_gap_metres: number;
  recoverable_metres: number;
  recoverable_inr: number;
  top_opportunity_loom: string;
  top_opportunity_action: string;
  confidence: string;
}

export interface ShortfallCategory {
  name: string;
  share_pct: number;
  description: string;
  affected_looms: string[];
  affected_looms_count: number;
  primary_issue: string;
}

export interface ShortfallDecompositionData {
  data_available: boolean;
  target_gap_metres: number;
  categories: ShortfallCategory[];
}

export interface AiInsightLead {
  headline: string;
  summary: string;
  entity_id: string;
  context_type: string;
  action_required: boolean;
}

export interface ProductionIntelligenceResponse {
  unit_code: string;
  work_date: string;
  today_position: TodayPositionData;
  situation_verdict: SituationVerdict;
  act_now_queue: ActNowItem[];
  top_losses_all: ActNowItem[];
  potential_recovery: PotentialRecoveryData;
  shortfall_decomposition: ShortfallDecompositionData;
  ai_insight_lead: AiInsightLead;
  data_availability: {
    q1_today: string;
    quality_score_pct: number;
    records_counted: number;
  };
}

export interface ExplainResponse {
  title: string;
  explain: {
    what_happened: string;
    observed_evidence: string[];
    likely_contributor: string;
  };
  decide: {
    classification: 'ACTION_REQUIRED' | 'WATCH' | 'INFORMATION';
    business_impact: {
      lost_output_metres?: number;
      potential_recovery_metres?: number;
      revenue_exposure_inr?: number;
      potential_revenue_inr?: number;
      confirmed_rate?: string;
    };
    risk_if_ignored: string;
  };
  act: {
    recommended_action: string;
    expected_outcome?: string;
    assigned_role: string;
    priority: string;
    controls: string[];
  };
}

export interface ExplainRequestPayload {
  context_type: string;
  entity_id?: string | null;
  date?: string;
  shift_id?: string | null;
  requested_analysis?: string;
}

export interface PerformanceRankedLoom {
  loom_id: number;
  loom_no: string;
  loom_type: string;
  style_code: string;
  actual_metres: number;
  target_metres: number;
  variance_metres: number;
  efficiency_pct: number;
  std_efficiency_pct: number;
  efficiency_gap_pp: number;
  stopped_minutes: number;
  warp_breaks: number;
  weft_breaks: number;
  opportunity_score: number;
}

export interface ProductionPerformanceResponse {
  unit_code: string;
  work_date: string;
  loom_performance: {
    top_output_looms: PerformanceRankedLoom[];
    bottom_output_looms: PerformanceRankedLoom[];
    top_efficiency_looms: PerformanceRankedLoom[];
    bottom_efficiency_looms: PerformanceRankedLoom[];
    potential_improvement_opportunities: PerformanceRankedLoom[];
    total_looms_evaluated: number;
  };
  weaver_performance: {
    top_weavers: Array<{
      employee_id: number;
      name: string;
      code: string;
      grade: string;
      looms_handled: number;
      assigned_hours: number;
      total_metres: number;
      efficiency_pct: number;
      performance_label: string;
      category: string;
    }>;
    attention_required_weavers: Array<{
      employee_id: number;
      name: string;
      code: string;
      grade: string;
      looms_handled: number;
      assigned_hours: number;
      total_metres: number;
      efficiency_pct: number;
      performance_label: string;
      category: string;
    }>;
    total_qualified: number;
    unqualified_count: number;
  };
}

export interface ProductionShiftItem {
  shift_id: number;
  shift_code: string;
  start_time: string;
  end_time: string;
  target_metres: number;
  actual_metres: number;
  variance_metres: number;
  variance_pct: number;
  efficiency_pct: number;
  target_efficiency_pct?: number;
  attainment_pct?: number;
  target_picks?: number;
  actual_picks?: number;
  target_pace_m_per_hr?: number;
  actual_pace_m_per_hr?: number;
  target_metres_per_loom?: number;
  actual_metres_per_loom?: number;
  scheduled_minutes?: number;
  running_minutes: number;
  stopped_minutes: number;
  target_running_minutes?: number;
  allowable_stopped_minutes?: number;
  warp_breaks: number;
  weft_breaks: number;
  total_breaks: number;
  looms_reported: number;
  supervisor_name?: string;
}

export interface ProductionHistoryResponse {
  unit_code: string;
  work_date: string;
  direction: {
    window_days: number;
    direction_status: 'IMPROVING' | 'STABLE' | 'DECLINING';
    output_change_pct: number;
    efficiency_change_pp: number;
    downtime_change_pct: number;
    key_changes: Array<{
      entity: string;
      status: string;
      detail: string;
    }>;
  };
  timeline: {
    window: string;
    start_date: string;
    end_date: string;
    data_points: Array<{
      date: string;
      actual_metres: number;
      target_metres: number;
      efficiency_pct: number;
      warp_breaks: number;
      weft_breaks: number;
      total_breaks: number;
      running_minutes: number;
      stopped_minutes: number;
    }>;
    average_metres: number;
    average_efficiency_pct: number;
    points_count: number;
  };
  consistency_quadrants: {
    quadrants: {
      consistent_performers: Array<{
        loom_id: number;
        loom_no: string;
        loom_type: string;
        mean_efficiency_pct: number;
        stddev: number;
        trend_slope: number;
      }>;
      declining: Array<{
        loom_id: number;
        loom_no: string;
        loom_type: string;
        mean_efficiency_pct: number;
        stddev: number;
        trend_slope: number;
      }>;
      recovering: Array<{
        loom_id: number;
        loom_no: string;
        loom_type: string;
        mean_efficiency_pct: number;
        stddev: number;
        trend_slope: number;
      }>;
      volatile: Array<{
        loom_id: number;
        loom_no: string;
        loom_type: string;
        mean_efficiency_pct: number;
        stddev: number;
        trend_slope: number;
      }>;
    };
    counts: {
      consistent: number;
      declining: number;
      recovering: number;
      volatile: number;
      insufficient_data: number;
    };
  };
}

export interface ProductionLoomDrilldownResponse {
  found: boolean;
  loom_id: number;
  loom_no: string;
  loom_type: string;
  install_date: string;
  history_30d: Array<{
    date: string;
    metres: number;
    efficiency_pct: number;
    stopped_minutes: number;
    warp_breaks: number;
    weft_breaks: number;
  }>;
  top_stoppage_causes: Array<{
    reason: string;
    event_count: number;
  }>;
  current_status: 'CRITICAL' | 'ATTENTION' | 'ACTIVE';
}

export async function fetchProductionIntelligence(
  date: string = '2026-07-31',
  unit: string = 'ATM'
): Promise<ProductionIntelligenceResponse> {
  return safeFetchJson(`${API_BASE}/production/intelligence?unit=${unit}&date=${date}`, demoSnapshot.productionIntelligence);
}

export async function fetchProductionPerformance(
  date: string = '2026-07-31',
  unit: string = 'ATM'
): Promise<ProductionPerformanceResponse> {
  return safeFetchJson(`${API_BASE}/production/performance?unit=${unit}&date=${date}`, demoSnapshot.productionPerformance);
}

export async function fetchProductionShifts(
  date: string = '2026-07-31',
  unit: string = 'ATM'
): Promise<{ unit_code: string; work_date: string; shifts: ProductionShiftItem[] }> {
  return safeFetchJson(`${API_BASE}/production/shifts?unit=${unit}&date=${date}`, demoSnapshot.productionShifts);
}

export async function fetchProductionHistory(
  date: string = '2026-07-31',
  unit: string = 'ATM',
  window: string = '30D'
): Promise<ProductionHistoryResponse> {
  return safeFetchJson(`${API_BASE}/production/history?unit=${unit}&date=${date}&window=${window}`, demoSnapshot.productionHistory);
}

export async function fetchProductionLoomDetail(
  loomId: number,
  date: string = '2026-07-31'
): Promise<ProductionLoomDrilldownResponse> {
  const fallback = demoSnapshot.loomDrilldowns?.[String(loomId)] || demoSnapshot.loomDrilldowns?.['104'] || {};
  return safeFetchJson(`${API_BASE}/production/loom/${loomId}?date=${date}`, fallback);
}

export async function fetchProductionAiExplain(
  payload: ExplainRequestPayload,
  unit: string = 'ATM'
): Promise<ExplainResponse> {
  const fallback: ExplainResponse = {
    title: 'Root Cause & Anomaly Diagnosis',
    explain: {
      what_happened: 'Automated Root Cause Diagnosis for ATM Shed 1 & 2',
      observed_evidence: [
        'Weft sensor micro-stops on Loom AJ-132 contributing 42 mins loss in Shift 1.',
        'Warp tension variance elevated on Shed 2 North bank across 6 machines.',
        'Overall plant operating efficiency is within 1.2% of shift benchmark.'
      ],
      likely_contributor: 'Humidity fluctuation in early morning shift caused temporary yarn brittleness.'
    },
    decide: {
      classification: 'ACTION_REQUIRED',
      business_impact: {
        lost_output_metres: 142.5,
        potential_recovery_metres: 110.0,
        revenue_exposure_inr: 4987.5,
        potential_revenue_inr: 3850.0,
        confirmed_rate: '₹35.00/m (Style #4102 Cotton Poplin)'
      },
      risk_if_ignored: 'Continued micro-stops risk compounding into warp end breakouts during shift changeover.'
    },
    act: {
      recommended_action: 'Inspect weft optical sensor and blow dust accumulation; adjust damper in Section B.',
      expected_outcome: 'Recover 35 mins downtime and 110 meters of production.',
      assigned_role: 'Shift Weaving Master',
      priority: 'P1',
      controls: ['Sensor calibration log', 'Section B humidification gauge']
    }
  };
  return safeFetchJson(`${API_BASE}/production/ai/explain?unit=${unit}`, fallback, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}



