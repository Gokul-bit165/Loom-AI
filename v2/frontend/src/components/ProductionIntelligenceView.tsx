import { useEffect, useState } from 'react';
import { fetchProductionSummary, fetchProductionComparison, fetchLooms } from '../api';
import type {
  ProductionSummaryResponse,
  ProductionComparisonResponse,
  LoomsResponse,
  BreakHotspotLoom,
  TimelineModeData,
} from '../api';
import {
  PageHeader,
  FilterBar,
  IndustrialTable,
  StatusBadge,
  DataTrustBadge,
  LoadingState,
  ErrorState,
  TOKENS,
} from '../design-system';
import type { ColumnDef } from '../design-system';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Columns,
  Layers as LayersIcon,
} from 'lucide-react';
import { ContextualAiDrawer } from './ContextualAiDrawer';
import type { ContextualAiPayload } from './ContextualAiDrawer';

interface ProductionIntelligenceViewProps {
  onSelectLoom: (loomId: number) => void;
}

export function ProductionIntelligenceView({ onSelectLoom }: ProductionIntelligenceViewProps) {
  const [summary, setSummary] = useState<ProductionSummaryResponse | null>(null);
  const [comparison, setComparison] = useState<ProductionComparisonResponse | null>(null);
  const [loomsData, setLoomsData] = useState<LoomsResponse | null>(null);
  const [selectedShift, setSelectedShift] = useState<string>('1');
  const [date, setDate] = useState<string>('2026-07-31');
  const [selectedTimeline, setSelectedTimeline] = useState<'yesterday' | 'week' | 'month' | 'year'>('yesterday');
  const [viewMode, setViewMode] = useState<'OVERLAY' | 'SPLIT'>('OVERLAY');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [rankingMode, setRankingMode] = useState<'lowest-eff' | 'top-output' | 'lowest-output' | 'top-eff'>('lowest-eff');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Contextual AI Drawer
  const [drawerContext, setDrawerContext] = useState<ContextualAiPayload | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchProductionSummary(date, 'ATM'),
      fetchProductionComparison(date, 'ATM'),
      fetchLooms(date, 'ATM', selectedShift, 1, 48, 'loom_no', 'asc'),
    ])
      .then(([sumRes, compRes, loomRes]) => {
        setSummary(sumRes);
        setComparison(compRes);
        setLoomsData(loomRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching production intelligence:', err);
        setError('Failed to retrieve daily production and comparison telemetry.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [date, selectedShift]);

  if (loading) return <LoadingState message="Loading production performance & interactive multi-layout comparisons..." />;
  if (error || !summary || !comparison) return <ErrorState message={error || 'Unable to load production data.'} onRetry={loadData} />;

  const activeMode: TimelineModeData = comparison.timeline_modes[selectedTimeline] || comparison.timeline_modes.yesterday;
  const breaks = comparison.break_analytics;
  const rawLooms = loomsData?.looms || [];

  let rankedLooms = [...rawLooms];
  if (rankingMode === 'top-output') {
    rankedLooms.sort((a, b) => b.metres - a.metres);
  } else if (rankingMode === 'lowest-output') {
    rankedLooms.sort((a, b) => a.metres - b.metres);
  } else if (rankingMode === 'top-eff') {
    rankedLooms.sort((a, b) => (b.loom_efficiency_pct || 0) - (a.loom_efficiency_pct || 0));
  } else if (rankingMode === 'lowest-eff') {
    rankedLooms.sort((a, b) => (a.loom_efficiency_pct || 0) - (b.loom_efficiency_pct || 0));
  }

  const loomColumns: ColumnDef<any>[] = [
    {
      key: 'loom_no',
      header: 'Loom No',
      sortable: true,
      render: (row) => (
        <button
          onClick={() => onSelectLoom(row.loom_id)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 700, color: TOKENS.colors.brand[600] }}
        >
          Loom {row.loom_no}
        </button>
      ),
    },
    {
      key: 'style_code',
      header: 'Fabric Construction',
      render: (row) => <span style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>{row.style_code.split('&')[0]}</span>,
    },
    {
      key: 'weaver_name',
      header: 'Assigned Weaver',
      render: (row) => <span>{row.weaver_name || 'M. Selvam (G1+)'}</span>,
    },
    {
      key: 'metres',
      header: 'Output (m)',
      align: 'right',
      sortable: true,
      render: (row) => <span style={{ fontFamily: TOKENS.typography.fontMono }}>{row.metres.toLocaleString()} m</span>,
    },
    {
      key: 'loom_efficiency_pct',
      header: 'Efficiency %',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: (row.loom_efficiency_pct || 0) >= 89.6 ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono }}>
          {row.loom_efficiency_pct}%
        </strong>
      ),
    },
    {
      key: 'utilization_pct',
      header: 'Utilization %',
      align: 'right',
      sortable: true,
      render: (row) => <span style={{ fontFamily: TOKENS.typography.fontMono }}>{row.utilization_pct}%</span>,
    },
    {
      key: 'breaks',
      header: 'Warp / Weft Stops',
      align: 'center',
      render: (row) => (
        <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, fontFamily: TOKENS.typography.fontMono }}>
          {row.warp_breaks} / {row.weft_breaks}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const breakHotspotColumns: ColumnDef<BreakHotspotLoom>[] = [
    {
      key: 'loom_no',
      header: 'Loom No',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>Loom {row.loom_no}</strong>,
    },
    {
      key: 'loom_type',
      header: 'Model',
      render: (row) => <span style={{ color: TOKENS.colors.text.muted }}>{row.loom_type}</span>,
    },
    {
      key: 'warp_breaks',
      header: 'Warp Stops',
      align: 'right',
      sortable: true,
      render: (row) => <span style={{ fontFamily: TOKENS.typography.fontMono, color: row.warp_breaks > 6 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.primary }}>{row.warp_breaks}</span>,
    },
    {
      key: 'weft_breaks',
      header: 'Weft Stops',
      align: 'right',
      sortable: true,
      render: (row) => <span style={{ fontFamily: TOKENS.typography.fontMono, color: row.weft_breaks > 15 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.primary }}>{row.weft_breaks}</span>,
    },
    {
      key: 'total_breaks',
      header: 'Total Yarn Stops',
      align: 'right',
      sortable: true,
      render: (row) => <strong style={{ fontFamily: TOKENS.typography.fontMono, color: TOKENS.colors.status.critical.text }}>{row.total_breaks}</strong>,
    },
    {
      key: 'breaks_per_1000_picks',
      header: 'Stops / 1000 Picks',
      align: 'right',
      sortable: true,
      render: (row) => <span style={{ fontFamily: TOKENS.typography.fontMono }}>{row.breaks_per_1000_picks.toFixed(2)}</span>,
    },
    {
      key: 'primary_cause',
      header: 'Diagnostic Suspected Cause',
      render: (row) => (
        <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary }}>
          {row.primary_cause}
        </span>
      ),
    },
  ];

  // Graph coordinate calculations for SVG Line Chart (Used in 'yesterday' shift mode)
  const series = activeMode.series || [];
  // Max value for bar scaling in grouped bar charts
  const maxGroupMetres = Math.max(...series.flatMap((s) => [s.current_metres, s.baseline_metres, s.target_metres || 0])) * 1.05;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      {/* ── TOP HEADER WITH CONTROLS ────────────────────────────────────── */}
      <PageHeader
        title="Production Intelligence & Multi-Timeline Studio"
        subtitle="Adaptive graph layouts for Shift-wise, Day-wise, Week-wise, and Month-wise comparative performance."
        unit="ATM Main Shed (192 Looms)"
        date={date}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              style={{ fontSize: '12px', padding: '4px 8px' }}
            />
            <DataTrustBadge provenance="ACTUAL" />
          </div>
        }
      />

      {/* ── 4-OPTION TIMELINE SELECTOR & DISPLAY MODE TOOLBAR ───────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: TOKENS.colors.surface.card,
          padding: '10px 16px',
          borderRadius: TOKENS.radius.md,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          boxShadow: TOKENS.shadows.card,
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* 4 Timeline Horizon Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: TOKENS.colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Timeline:
          </span>

          <div style={{ display: 'flex', background: TOKENS.colors.surface.cardAlt, padding: '2px', borderRadius: '6px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <button
              onClick={() => setSelectedTimeline('yesterday')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: selectedTimeline === 'yesterday' ? 700 : 500,
                background: selectedTimeline === 'yesterday' ? TOKENS.colors.brand[600] : 'transparent',
                color: selectedTimeline === 'yesterday' ? '#FFFFFF' : TOKENS.colors.text.secondary,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Yesterday vs. Today (Shift-wise)
            </button>

            <button
              onClick={() => setSelectedTimeline('week')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: selectedTimeline === 'week' ? 700 : 500,
                background: selectedTimeline === 'week' ? TOKENS.colors.brand[600] : 'transparent',
                color: selectedTimeline === 'week' ? '#FFFFFF' : TOKENS.colors.text.secondary,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Weekly (Day-wise Bars)
            </button>

            <button
              onClick={() => setSelectedTimeline('month')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: selectedTimeline === 'month' ? 700 : 500,
                background: selectedTimeline === 'month' ? TOKENS.colors.brand[600] : 'transparent',
                color: selectedTimeline === 'month' ? '#FFFFFF' : TOKENS.colors.text.secondary,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Monthly (Week-wise)
            </button>

            <button
              onClick={() => setSelectedTimeline('year')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: selectedTimeline === 'year' ? 700 : 500,
                background: selectedTimeline === 'year' ? TOKENS.colors.brand[600] : 'transparent',
                color: selectedTimeline === 'year' ? '#FFFFFF' : TOKENS.colors.text.secondary,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Yearly (Month-wise)
            </button>
          </div>
        </div>

        {/* Overlay vs Split View Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: TOKENS.colors.text.muted, textTransform: 'uppercase' }}>
            Display:
          </span>

          <div style={{ display: 'flex', background: TOKENS.colors.surface.cardAlt, padding: '2px', borderRadius: '6px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <button
              onClick={() => setViewMode('OVERLAY')}
              style={{
                padding: '5px 10px',
                fontSize: '11.5px',
                fontWeight: viewMode === 'OVERLAY' ? 700 : 500,
                background: viewMode === 'OVERLAY' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'OVERLAY' ? TOKENS.colors.brand[600] : TOKENS.colors.text.secondary,
                border: viewMode === 'OVERLAY' ? `1px solid ${TOKENS.colors.surface.border}` : 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <LayersIcon size={13} />
              <span>Adaptive Graph</span>
            </button>

            <button
              onClick={() => setViewMode('SPLIT')}
              style={{
                padding: '5px 10px',
                fontSize: '11.5px',
                fontWeight: viewMode === 'SPLIT' ? 700 : 500,
                background: viewMode === 'SPLIT' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'SPLIT' ? TOKENS.colors.brand[600] : TOKENS.colors.text.secondary,
                border: viewMode === 'SPLIT' ? `1px solid ${TOKENS.colors.surface.border}` : 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Columns size={13} />
              <span>Split Comparison</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 1. DYNAMIC AI TIMELINE OVERVIEW NARRATIVE ────────────────────── */}
      <div
        style={{
          background: TOKENS.colors.surface.card,
          border: `1px solid ${TOKENS.colors.brand[500]}`,
          borderRadius: TOKENS.radius.md,
          padding: '16px 20px',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: TOKENS.colors.brand[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={16} color={TOKENS.colors.brand[600]} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: TOKENS.colors.brand[700], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI TIMELINE INTELLIGENCE · {activeMode.label.toUpperCase()}
              </span>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '2px 0 0 0', color: TOKENS.colors.text.primary }}>
                {activeMode.ai_insight}
              </h3>
            </div>
          </div>

          <button
            onClick={() =>
              setDrawerContext({
                title: `${activeMode.label} Diagnostic`,
                category: 'TIMELINE_COMPARISON',
                issueDescription: activeMode.ai_insight,
                baseline: `${activeMode.baseline_summary.metres.toLocaleString()} m (${activeMode.baseline_name})`,
                current_value: `${activeMode.current_summary.metres.toLocaleString()} m (${activeMode.current_name})`,
                recommendedAction: comparison.ai_overview.recommendation,
                confidence: 'HIGH',
                sourceIds: ['prod_logs_timeline', 'plc_break_summary'],
              })
            }
            style={{
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 600,
              background: TOKENS.colors.brand[100],
              color: TOKENS.colors.brand[700],
              border: `1px solid ${TOKENS.colors.brand[500]}`,
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Explain Delta</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* ── 2. ADAPTIVE GRAPH LAYOUT (BASED ON PICKED TIMELINE) ─────────── */}
      {viewMode === 'OVERLAY' ? (
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.md,
            padding: '18px 20px',
            boxShadow: TOKENS.shadows.card,
          }}
        >
          {/* Legend & Stats Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                {activeMode.period_label}
              </h3>
              <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
                Comparing {activeMode.current_name} against {activeMode.baseline_name}.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '10px', background: TOKENS.colors.brand[600], borderRadius: '2px' }} />
                <strong style={{ color: TOKENS.colors.text.primary }}>{activeMode.current_name}:</strong>
                <span style={{ fontFamily: TOKENS.typography.fontMono }}>{activeMode.current_summary.metres.toLocaleString()} m ({activeMode.current_summary.efficiency_pct}%)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '10px', background: '#D97706', borderRadius: '2px' }} />
                <strong style={{ color: TOKENS.colors.text.secondary }}>{activeMode.baseline_name}:</strong>
                <span style={{ fontFamily: TOKENS.typography.fontMono }}>{activeMode.baseline_summary.metres.toLocaleString()} m ({activeMode.baseline_summary.efficiency_pct}%)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '2px', background: '#DC2626', borderTop: '2px dashed #DC2626' }} />
                <span style={{ color: '#DC2626', fontSize: '11px', fontWeight: 600 }}>Standard Target</span>
              </div>
            </div>
          </div>

          {/* ── LAYOUT 1: SHIFT-WISE GROUPED BARS WITH DIRECT NUMBERS (DEFAULT) ──── */}
          {selectedTimeline === 'yesterday' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Shift 1, Shift 2, Shift 3 Grouped Comparison Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {series.map((shift, idx) => {
                  const shiftTimes = [
                    '06:00 – 14:00 (Morning)',
                    '14:00 – 22:00 (Evening)',
                    '22:00 – 06:00 (Night)',
                  ];
                  const timeLabel = shiftTimes[idx] || '8-Hour Run';
                  const shiftTarget = shift.target_metres || 16672.9;
                  const deltaMetres = shift.current_metres - shift.baseline_metres;
                  const deltaPct = ((deltaMetres / Math.max(shift.baseline_metres, 1)) * 100).toFixed(1);
                  const deltaEff = (shift.current_eff - shift.baseline_eff).toFixed(1);
                  const isPositive = deltaMetres >= 0;

                  const maxShiftMetres = Math.max(shift.current_metres, shift.baseline_metres, shiftTarget) * 1.08;
                  const curHeightPct = Math.min(100, Math.max(15, (shift.current_metres / maxShiftMetres) * 100));
                  const baseHeightPct = Math.min(100, Math.max(15, (shift.baseline_metres / maxShiftMetres) * 100));
                  const targetHeightPct = Math.min(100, (shiftTarget / maxShiftMetres) * 100);

                  return (
                    <div
                      key={idx}
                      style={{
                        background: TOKENS.colors.surface.cardAlt,
                        border: `1px solid ${TOKENS.colors.surface.border}`,
                        borderRadius: TOKENS.radius.md,
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'box-shadow 0.2s ease',
                      }}
                    >
                      {/* Shift Header & Time */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 800, color: TOKENS.colors.text.primary }}>
                            {shift.label}
                          </div>
                          <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                            {timeLabel}
                          </div>
                        </div>

                        {/* Net Variance Badge */}
                        <div
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: isPositive ? '#DCFCE7' : '#FEE2E2',
                            color: isPositive ? '#166534' : '#991B1B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          <span>{isPositive ? '+' : ''}{deltaMetres.toFixed(1)} m ({isPositive ? '+' : ''}{deltaPct}%)</span>
                        </div>
                      </div>

                      {/* Bar Visualization Container with Target Line */}
                      <div style={{ position: 'relative', height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '16px', paddingTop: '16px', borderBottom: `1px solid ${TOKENS.colors.surface.border}` }}>
                        {/* Target Line Overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: `${targetHeightPct}%`,
                            borderTop: '2px dashed #DC2626',
                            zIndex: 1,
                            pointerEvents: 'none',
                          }}
                          title={`Standard Target: ${shiftTarget.toLocaleString()} m`}
                        >
                          <span style={{ position: 'absolute', right: '0px', top: '-14px', fontSize: '9.5px', color: '#DC2626', fontWeight: 700 }}>
                            Target: {Math.round(shiftTarget).toLocaleString()} m
                          </span>
                        </div>

                        {/* Yesterday Bar (Amber) */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '38%', height: '100%', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#D97706', fontFamily: TOKENS.typography.fontMono, marginBottom: '2px' }}>
                            {shift.baseline_metres.toLocaleString()} m
                          </span>
                          <div
                            style={{
                              width: '100%',
                              maxWidth: '42px',
                              height: `${baseHeightPct}%`,
                              background: '#D97706',
                              borderRadius: '4px 4px 0 0',
                              opacity: 0.85,
                            }}
                          />
                          <span style={{ fontSize: '10px', color: TOKENS.colors.text.muted, marginTop: '4px', fontWeight: 600 }}>
                            Yesterday
                          </span>
                        </div>

                        {/* Today Bar (Brand Blue) */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '38%', height: '100%', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '10.5px', fontWeight: 800, color: TOKENS.colors.brand[700], fontFamily: TOKENS.typography.fontMono, marginBottom: '2px' }}>
                            {shift.current_metres.toLocaleString()} m
                          </span>
                          <div
                            style={{
                              width: '100%',
                              maxWidth: '42px',
                              height: `${curHeightPct}%`,
                              background: TOKENS.colors.brand[600],
                              borderRadius: '4px 4px 0 0',
                              boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                            }}
                          />
                          <span style={{ fontSize: '10px', color: TOKENS.colors.brand[700], marginTop: '4px', fontWeight: 700 }}>
                            Today
                          </span>
                        </div>
                      </div>

                      {/* Shift Metric Details Footer */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                        <div style={{ background: '#FFFFFF', padding: '6px 8px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                          <div style={{ fontSize: '10px', color: TOKENS.colors.text.muted }}>Efficiency Shift Run</div>
                          <div style={{ fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono, marginTop: '1px' }}>
                            {shift.current_eff}% <span style={{ fontSize: '10px', fontWeight: 600, color: parseFloat(deltaEff) >= 0 ? '#166534' : '#991B1B' }}>({parseFloat(deltaEff) >= 0 ? '+' : ''}{deltaEff} pp)</span>
                          </div>
                        </div>

                        <div style={{ background: '#FFFFFF', padding: '6px 8px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                          <div style={{ fontSize: '10px', color: TOKENS.colors.text.muted }}>Total Yarn Breaks</div>
                          <div style={{ fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono, marginTop: '1px' }}>
                            {shift.current_breaks.toLocaleString()} stops
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── LAYOUT 2: DAY-WISE GROUPED BAR CHART (FOR WEEKLY COMPARISON) ─ */}
          {selectedTimeline === 'week' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '200px', paddingTop: '20px', borderBottom: `1px solid ${TOKENS.colors.surface.border}` }}>
                {series.map((pt, idx) => {
                  const curHeight = Math.min(100, Math.max(12, (pt.current_metres / maxGroupMetres) * 100));
                  const baseHeight = Math.min(100, Math.max(12, (pt.baseline_metres / maxGroupMetres) * 100));
                  const isHovered = hoveredPointIndex === idx;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                        cursor: 'pointer',
                        padding: '0 4px',
                        background: isHovered ? TOKENS.colors.surface.cardAlt : 'transparent',
                        borderRadius: '4px',
                      }}
                    >
                      {/* Pair of Grouped Bars */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', justifyContent: 'center', height: '100%' }}>
                        {/* Baseline Bar (Amber) */}
                        <div
                          style={{
                            width: '45%',
                            maxWidth: '22px',
                            height: `${baseHeight}%`,
                            background: '#D97706',
                            borderRadius: '3px 3px 0 0',
                            opacity: isHovered ? 1 : 0.85,
                          }}
                          title={`Prior Week: ${pt.baseline_metres.toLocaleString()} m`}
                        />

                        {/* Current Bar (Brand Blue) */}
                        <div
                          style={{
                            width: '45%',
                            maxWidth: '22px',
                            height: `${curHeight}%`,
                            background: TOKENS.colors.brand[600],
                            borderRadius: '3px 3px 0 0',
                            boxShadow: isHovered ? '0 0 8px rgba(37,99,235,0.4)' : 'none',
                          }}
                          title={`Current Week: ${pt.current_metres.toLocaleString()} m`}
                        />
                      </div>

                      <span style={{ fontSize: '10.5px', color: isHovered ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary, marginTop: '6px', fontWeight: isHovered ? 700 : 500, whiteSpace: 'nowrap' }}>
                        {pt.label.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── LAYOUT 3: WEEK-WISE GROUPED BARS (FOR MONTHLY COMPARISON) ──── */}
          {selectedTimeline === 'month' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '200px', paddingTop: '20px', borderBottom: `1px solid ${TOKENS.colors.surface.border}` }}>
                {series.map((pt, idx) => {
                  const curHeight = Math.min(100, Math.max(12, (pt.current_metres / maxGroupMetres) * 100));
                  const baseHeight = Math.min(100, Math.max(12, (pt.baseline_metres / maxGroupMetres) * 100));
                  const isHovered = hoveredPointIndex === idx;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                        cursor: 'pointer',
                        padding: '0 8px',
                        background: isHovered ? TOKENS.colors.surface.cardAlt : 'transparent',
                        borderRadius: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', width: '100%', justifyContent: 'center', height: '100%' }}>
                        <div
                          style={{
                            width: '45%',
                            maxWidth: '36px',
                            height: `${baseHeight}%`,
                            background: '#D97706',
                            borderRadius: '4px 4px 0 0',
                            opacity: 0.85,
                          }}
                        />
                        <div
                          style={{
                            width: '45%',
                            maxWidth: '36px',
                            height: `${curHeight}%`,
                            background: TOKENS.colors.brand[600],
                            borderRadius: '4px 4px 0 0',
                            boxShadow: isHovered ? '0 0 10px rgba(37,99,235,0.4)' : 'none',
                          }}
                        />
                      </div>

                      <span style={{ fontSize: '11px', color: isHovered ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary, marginTop: '6px', fontWeight: isHovered ? 700 : 600 }}>
                        {pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── LAYOUT 4: 12-MONTH PROGRESSION (FOR YEARLY COMPARISON) ────── */}
          {selectedTimeline === 'year' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', paddingTop: '20px', borderBottom: `1px solid ${TOKENS.colors.surface.border}` }}>
                {series.map((pt, idx) => {
                  const curHeight = Math.min(100, Math.max(10, (pt.current_metres / maxGroupMetres) * 100));
                  const baseHeight = Math.min(100, Math.max(10, (pt.baseline_metres / maxGroupMetres) * 100));
                  const isHovered = hoveredPointIndex === idx;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                        cursor: 'pointer',
                        padding: '0 2px',
                        background: isHovered ? TOKENS.colors.surface.cardAlt : 'transparent',
                        borderRadius: '3px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', width: '100%', justifyContent: 'center', height: '100%' }}>
                        <div
                          style={{
                            width: '45%',
                            maxWidth: '18px',
                            height: `${baseHeight}%`,
                            background: '#D97706',
                            borderRadius: '2px 2px 0 0',
                            opacity: 0.8,
                          }}
                        />
                        <div
                          style={{
                            width: '45%',
                            maxWidth: '18px',
                            height: `${curHeight}%`,
                            background: TOKENS.colors.brand[600],
                            borderRadius: '2px 2px 0 0',
                          }}
                        />
                      </div>

                      <span style={{ fontSize: '10.5px', color: isHovered ? TOKENS.colors.brand[700] : TOKENS.colors.text.muted, marginTop: '6px', fontWeight: isHovered ? 700 : 500 }}>
                        {pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hover Tooltip Overlay for All Modes */}
          {hoveredPointIndex !== null && series[hoveredPointIndex] && (
            <div
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                background: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '11.5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
                {series[hoveredPointIndex].label} Detailed Telemetry:
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ color: '#93C5FD' }}>
                  {activeMode.current_name}: <strong>{series[hoveredPointIndex].current_metres.toLocaleString()} m ({series[hoveredPointIndex].current_eff}%)</strong>
                </span>
                <span style={{ color: '#FCD34D' }}>
                  {activeMode.baseline_name}: <strong>{series[hoveredPointIndex].baseline_metres.toLocaleString()} m ({series[hoveredPointIndex].baseline_eff}%)</strong>
                </span>
                <span style={{ color: '#4ADE80' }}>
                  Variance Delta: <strong>{series[hoveredPointIndex].current_metres >= series[hoveredPointIndex].baseline_metres ? '+' : ''}{(series[hoveredPointIndex].current_metres - series[hoveredPointIndex].baseline_metres).toFixed(1)} m</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── SPLIT VIEW: SIDE-BY-SIDE COMPARATIVE CARDS ─────────────────── */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '14px', alignItems: 'stretch' }}>
          {/* LEFT: CURRENT TIMELINE */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.brand[600]}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 18px',
              boxShadow: TOKENS.shadows.card,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: TOKENS.colors.brand[600], textTransform: 'uppercase' }}>
                  CURRENT: {activeMode.current_name}
                </span>
                <DataTrustBadge provenance="ACTUAL" compact />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono }}>
                {activeMode.current_summary.metres.toLocaleString()} m
              </div>
              <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary, marginTop: '4px' }}>
                Efficiency: <strong style={{ color: TOKENS.colors.status.healthy.text }}>{activeMode.current_summary.efficiency_pct}%</strong>
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted, marginTop: '4px' }}>
                Total Yarn Breaks: <strong>{activeMode.current_summary.total_breaks.toLocaleString()}</strong> stops
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: `1px solid ${TOKENS.colors.surface.border}` }}>
              <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Performance Rating:</span>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: TOKENS.colors.status.healthy.text }}>
                NOMINAL RUN ({activeMode.current_summary.efficiency_pct}% EFF)
              </div>
            </div>
          </div>

          {/* CENTER: DELTA VARIANCE BRIDGE */}
          <div
            style={{
              background: TOKENS.colors.surface.cardAlt,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              minWidth: '130px',
            }}
          >
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: TOKENS.colors.text.muted, textTransform: 'uppercase' }}>
              NET DELTA
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '18px', fontWeight: 800, color: activeMode.variance.metres_diff >= 0 ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono }}>
                {activeMode.variance.metres_diff >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{activeMode.variance.metres_diff >= 0 ? '+' : ''}{activeMode.variance.metres_diff.toLocaleString()} m</span>
              </div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                ({activeMode.variance.metres_pct >= 0 ? '+' : ''}{activeMode.variance.metres_pct}%)
              </div>
            </div>

            <div style={{ textAlign: 'center', borderTop: `1px solid ${TOKENS.colors.surface.border}`, paddingTop: '8px', width: '100%' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: activeMode.variance.eff_diff_pp >= 0 ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.critical.text }}>
                {activeMode.variance.eff_diff_pp >= 0 ? '+' : ''}{activeMode.variance.eff_diff_pp} pp Eff
              </div>
            </div>
          </div>

          {/* RIGHT: BASELINE TIMELINE */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 18px',
              boxShadow: TOKENS.shadows.card,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: TOKENS.colors.text.muted, textTransform: 'uppercase' }}>
                  BASELINE: {activeMode.baseline_name}
                </span>
                <DataTrustBadge provenance="CALCULATED" compact />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono }}>
                {activeMode.baseline_summary.metres.toLocaleString()} m
              </div>
              <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary, marginTop: '4px' }}>
                Efficiency: <strong style={{ color: TOKENS.colors.text.primary }}>{activeMode.baseline_summary.efficiency_pct}%</strong>
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted, marginTop: '4px' }}>
                Total Yarn Breaks: <strong>{activeMode.baseline_summary.total_breaks.toLocaleString()}</strong> stops
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: `1px solid ${TOKENS.colors.surface.border}` }}>
              <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Reference Target:</span>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: TOKENS.colors.text.secondary }}>
                Standard Target Baseline
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. YARN BREAK TELEMETRY & HOTSPOT MATRIX ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: TOKENS.spacing[4] }}>
        {/* Break Summary Card */}
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.md,
            padding: '16px 18px',
            boxShadow: TOKENS.shadows.card,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Yarn Break Telemetry Breakdown
            </h4>
            <DataTrustBadge provenance="ACTUAL" compact />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 600 }}>Warp Breaks Total</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                {breaks.warp_breaks_total.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.secondary, marginTop: '2px' }}>
                Rate: <strong>{breaks.warp_breaks_per_1000_picks} / 1k picks</strong>
              </div>
            </div>

            <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 600 }}>Weft Breaks Total</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                {breaks.weft_breaks_total.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.secondary, marginTop: '2px' }}>
                Rate: <strong>{breaks.weft_breaks_per_1000_picks} / 1k picks</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: TOKENS.colors.brand[50], borderRadius: '4px', border: `1px solid ${TOKENS.colors.brand[100]}` }}>
            <span style={{ fontSize: '12px', color: TOKENS.colors.brand[800], fontWeight: 600 }}>Warp to Weft Ratio:</span>
            <strong style={{ fontSize: '12px', color: TOKENS.colors.brand[900], fontFamily: TOKENS.typography.fontMono }}>{breaks.warp_vs_weft_ratio}</strong>
          </div>
        </div>

        {/* Break Hotspots Table */}
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.md,
            padding: '16px 18px',
            boxShadow: TOKENS.shadows.card,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Top Break Hotspot Looms Today
            </h4>
            <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Ranked by total yarn stops</span>
          </div>

          <IndustrialTable
            columns={breakHotspotColumns}
            data={breaks.break_hotspots}
            keyExtractor={(row) => row.loom_no}
            initialLimit={5}
          />
        </div>
      </div>

      {/* ── 4. SHIFT OPERATIONS & MACHINE-LEVEL TELEMETRY ─────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Shift Telemetry & Machine Roster
            </h3>
            <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
              Shift {selectedShift} machine-level production and weaver assignment records.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setRankingMode('lowest-eff')}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: rankingMode === 'lowest-eff' ? 700 : 500,
                background: rankingMode === 'lowest-eff' ? TOKENS.colors.brand[600] : TOKENS.colors.surface.cardAlt,
                color: rankingMode === 'lowest-eff' ? '#FFFFFF' : TOKENS.colors.text.secondary,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Lowest Efficiency First
            </button>
            <button
              onClick={() => setRankingMode('top-output')}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: rankingMode === 'top-output' ? 700 : 500,
                background: rankingMode === 'top-output' ? TOKENS.colors.brand[600] : TOKENS.colors.surface.cardAlt,
                color: rankingMode === 'top-output' ? '#FFFFFF' : TOKENS.colors.text.secondary,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Highest Output First
            </button>
          </div>
        </div>

        <FilterBar
          filters={[
            {
              id: 'shift',
              label: 'Shift Selection',
              value: selectedShift,
              options: [
                { label: 'Shift 1 (06:00 - 14:00)', value: '1' },
                { label: 'Shift 2 (14:00 - 22:00)', value: '2' },
                { label: 'Shift 3 (22:00 - 06:00)', value: '3' },
              ],
              onChange: setSelectedShift,
            },
          ]}
        />

        <IndustrialTable
          columns={loomColumns}
          data={rankedLooms}
          keyExtractor={(row) => row.loom_id}
          initialLimit={12}
        />
      </div>

      {/* ── CONTEXTUAL AI DRAWER ────────────────────────────────────────── */}
      <ContextualAiDrawer
        isOpen={drawerContext !== null}
        onClose={() => setDrawerContext(null)}
        context={drawerContext}
      />
    </div>
  );
}
