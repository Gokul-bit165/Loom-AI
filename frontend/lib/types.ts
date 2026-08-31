export interface ResponseMetadata {
  date: string | null;
  generated_at: string;
  dataset: string;
  source_type: string;
  period?: string;
  start_date?: string;
  target_date?: string;
  days?: number;
}

export interface DataQualityInfo {
  records_analyzed: number;
  is_demo: boolean;
  dataset_label: string;
  machines_counted?: number;
  unique_machines_recorded?: number;
  unique_machines_with_breakdown?: number;
}

export interface StandardApiResponse<T> {
  data: T;
  metadata: ResponseMetadata;
  data_quality: DataQualityInfo;
}

export interface RecommendationItem {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  evidence: string;
  suggested_action: string;
  expected_impact: string;
  confidence: 'VERY HIGH' | 'HIGH' | 'MEDIUM';
  source_metrics: Record<string, any>;
}

// ── Q1 Production Types ──────────────────────────────────────────────────────

export interface MachinePerformanceItem {
  machine_id: string;
  machine_type: string;
  department: string;
  granularity: string;
  target: number;
  actual: number;
  variance: number;
  efficiency: number;
  performance_status: 'OPTIMAL' | 'ACCEPTABLE' | 'UNDERPERFORMING' | 'CRITICAL';
  evidence: {
    production_log_ids: number[];
  };
}

export interface ShiftPerformanceItem {
  shift: number;
  target: number;
  actual: number;
  variance: number;
  efficiency: number;
  evidence: {
    production_log_ids: number[];
  };
}

export interface ProductionSummary {
  date: string;
  total_target: number;
  total_actual: number;
  variance_qty: number;
  variance_pct: number;
  average_efficiency: number;
  previous_day_actual: number;
  change_vs_previous_day_pct: number | null;
}

export interface PreviousDayComparison {
  current_date: string;
  previous_date: string;
  current_actual: number;
  previous_actual: number;
  change_qty: number;
  change_pct: number | null;
}

export interface ProductionTrendPoint {
  date: string;
  day: string;
  actual: number;
  target: number;
  efficiency: number;
}

export interface ProductionTrendData {
  start_date: string;
  target_date: string;
  days: number;
  trend_points: ProductionTrendPoint[];
}

export interface ProductionVarianceData {
  has_data: boolean;
  summary: ProductionSummary;
  trailing_averages?: {
    avg_7d?: { average_actual: number | null; days_with_data: number; window_days: number };
    avg_30d?: { average_actual: number | null; days_with_data: number; window_days: number };
  };
  production_loss?: {
    estimated_production_loss_qty: number;
    is_estimated: boolean;
    methodology: string;
    machines_with_loss: Array<{ machine_id: string; estimated_loss_qty: number }>;
  };
  best_machine?: MachinePerformanceItem | null;
  worst_machine?: MachinePerformanceItem | null;
  largest_variance_machine?: MachinePerformanceItem | null;
  biggest_loss_contributor?: { machine_id: string; estimated_loss_qty: number } | null;
  machine_performance: MachinePerformanceItem[];
  shift_performance: ShiftPerformanceItem[];
  previous_day_comparison: PreviousDayComparison;
  recommendations?: RecommendationItem[];
  evidence: {
    production_log_ids: number[];
  };
}

// ── Q5 Breakdown Types ───────────────────────────────────────────────────────

export interface MachineRankingItem {
  machine_id: string;
  machine_type: string;
  department: string;
  granularity: string;
  event_count: number;
  downtime_minutes: number;
  average_event_duration: number;
  percentage_of_total_downtime: number;
  evidence: {
    breakdown_event_ids: number[];
  };
}

export interface ReasonRankingItem {
  reason: string;
  event_count: number;
  total_downtime_minutes: number;
  average_event_duration: number;
  percentage_of_total_downtime: number;
  cumulative_percentage?: number;
}

export interface ShiftDowntimeItem {
  shift: number;
  event_count: number;
  downtime_minutes: number;
  percentage_of_total_downtime: number;
}

export interface BreakdownRankingData {
  has_data: boolean;
  period_info: {
    period: string;
    start_date: string;
    end_date: string;
  };
  total_downtime_minutes: number;
  total_events: number;
  average_event_duration?: number;
  machine_ranking: MachineRankingItem[];
  breakdown_count_ranking?: MachineRankingItem[];
  reason_ranking: ReasonRankingItem[];
  shift_ranking?: ShiftDowntimeItem[];
  highest_downtime_machine: MachineRankingItem | null;
  lowest_downtime_machine: MachineRankingItem | null;
  most_breakdown_events_machine?: MachineRankingItem | null;
  highest_downtime_shift?: ShiftDowntimeItem | null;
  recurring_reasons: ReasonRankingItem[];
  recommendations?: RecommendationItem[];
  evidence: {
    breakdown_event_ids: number[];
  };
}

// ── Q21 Revenue Types ────────────────────────────────────────────────────────

export interface MachineRevenueItem {
  machine_id: string;
  machine_type: string;
  department: string;
  granularity: string;
  fabric_styles: string[];
  total_revenue: number;
  percentage_of_total: number;
  evidence: {
    revenue_log_ids: number[];
  };
}

export interface FabricStyleRankingItem {
  fabric_style: string;
  total_revenue: number;
  percentage_of_total: number;
  machine_count: number;
}

export interface RevenueSummaryData {
  has_data: boolean;
  summary: {
    date: string;
    today_revenue: number;
    mtd_revenue: number;
    previous_day_revenue: number;
    change_vs_previous_day_pct: number | null;
    mtd_start_date: string;
  };
  machine_ranking: MachineRevenueItem[];
  fabric_style_ranking: FabricStyleRankingItem[];
  best_machine: MachineRevenueItem | null;
  worst_machine: MachineRevenueItem | null;
  best_style: FabricStyleRankingItem | null;
  worst_style: FabricStyleRankingItem | null;
  revenue_loss: {
    estimated_revenue_loss?: number;
    is_estimated?: boolean;
    revenue_loss_available: boolean;
    reason: string;
    methodology?: string;
    machines_with_loss?: Array<{ machine_id: string; estimated_loss: number }>;
  };
  biggest_revenue_loss_contributor?: { machine_id: string; estimated_loss: number } | null;
  recommendations?: RecommendationItem[];
  evidence: {
    revenue_log_ids: number[];
  };
}

// ── AI Assistant Types ───────────────────────────────────────────────────────

export interface AskAssistantResponse {
  answer: string;
  key_findings: string[];
  suggestions: string[];
  evidence: number[];
  data_quality: DataQualityInfo;
  scope: string;
  ai_status: 'success' | 'unavailable' | 'out_of_scope';
  analytics_data: any;
}
