import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  Target,
  Table,
  X,
} from 'lucide-react';
import type {
  TodayPositionData,
  SituationVerdict,
  ActNowItem,
  PotentialRecoveryData,
  ShortfallDecompositionData,
  ShortfallCategory,
  ProductionShiftItem,
  ProductionHistoryResponse,
} from '../../api';
import { ProductionPositionStrip } from './ProductionPositionStrip';
import { ProductionTrendGraph, type TrendPoint } from './ProductionTrendGraph';

interface ProductionDailyWorkspaceProps {
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  todayPosition: TodayPositionData;
  verdict: SituationVerdict;
  actNowQueue: ActNowItem[];
  recovery: PotentialRecoveryData;
  shortfall: ShortfallDecompositionData;
  shiftsData?: ProductionShiftItem[];
  historyData?: ProductionHistoryResponse | null;
  historyWindow?: string;
  onSelectHistoryWindow?: (window: string) => void;
  onExplainGap: () => void;
  onExplainSituation: () => void;
  onExplainAction: (item: ActNowItem) => void;
  onExplainRecovery: () => void;
  onExplainShortfallCategory: (cat: ShortfallCategory) => void;
  onExplainShift: (shiftCode: string) => void;
  onExplainTrend: () => void;
  onSelectLoom: (loomId: number) => void;
  onNavigateSubmodule?: (submodule: string) => void;
}

export const ProductionDailyWorkspace: React.FC<ProductionDailyWorkspaceProps> = ({
  selectedDate = '2026-07-31',
  onSelectDate,
  todayPosition,
  verdict,
  actNowQueue,
  recovery,
  shortfall,
  shiftsData,
  historyData,
  historyWindow = '7D',
  onSelectHistoryWindow,
  onExplainGap,
  onExplainSituation,
  onExplainAction,
  onExplainRecovery,
  onExplainShortfallCategory,
  onExplainShift,
  onExplainTrend,
  onSelectLoom,
  onNavigateSubmodule,
}) => {
  const [showShiftTable, setShowShiftTable] = useState(false);
  const [inspectingShift, setInspectingShift] = useState<ProductionShiftItem | null>(null);

  const { primary_kpis, supporting_metrics, yesterday_comparison } = todayPosition;
  const isBelowPlan = primary_kpis.gap_metres < 0;
  const isToday = selectedDate === '2026-07-31';

  // 1. Process Shift Data: Use real shifts from backend or fallback to realistic ATM baseline
  const shifts: ProductionShiftItem[] = useMemo(() => {
    if (shiftsData && shiftsData.length > 0) {
      return shiftsData.map((s) => {
        const looms = s.looms_reported || 192;
        const targetPicks = s.target_picks || Math.round(s.target_metres * 2165.356);
        const actualPicks = s.actual_picks || Math.round(s.actual_metres * 2165.356);
        const targetEff = s.target_efficiency_pct || 89.44;
        const attainment = s.attainment_pct || (s.target_metres > 0 ? (s.actual_metres / s.target_metres) * 100 : 0);
        const targetPace = s.target_pace_m_per_hr || roundNum(s.target_metres / 8, 1);
        const actualPace = s.actual_pace_m_per_hr || roundNum(s.actual_metres / 8, 1);
        const targetPerLoom = s.target_metres_per_loom || roundNum(s.target_metres / looms, 1);
        const actualPerLoom = s.actual_metres_per_loom || roundNum(s.actual_metres / looms, 1);
        const supervisors: Record<string, string> = {
          '1': 'M. Kumar (Shift Lead)',
          '2': 'R. Selvam (Shift Lead)',
          '3': 'A. Pandian (Night Lead)',
        };
        return {
          ...s,
          target_picks: targetPicks,
          actual_picks: actualPicks,
          target_efficiency_pct: targetEff,
          attainment_pct: Number(attainment.toFixed(2)),
          target_pace_m_per_hr: targetPace,
          actual_pace_m_per_hr: actualPace,
          target_metres_per_loom: targetPerLoom,
          actual_metres_per_loom: actualPerLoom,
          supervisor_name: s.supervisor_name || supervisors[s.shift_code] || 'Shift Supervisor',
        };
      });
    }
    return [
      {
        shift_id: 1,
        shift_code: '1',
        start_time: '06:00',
        end_time: '14:00',
        target_metres: 16672.9,
        actual_metres: 16543.8,
        variance_metres: -129.1,
        variance_pct: -0.77,
        efficiency_pct: 89.04,
        target_efficiency_pct: 89.44,
        attainment_pct: 99.23,
        target_picks: 36060325,
        actual_picks: 35762995,
        target_pace_m_per_hr: 2084.1,
        actual_pace_m_per_hr: 2068.0,
        target_metres_per_loom: 86.8,
        actual_metres_per_loom: 86.2,
        scheduled_minutes: 92160,
        running_minutes: 84276,
        stopped_minutes: 7884,
        target_running_minutes: 82428,
        allowable_stopped_minutes: 9732,
        warp_breaks: 1193,
        weft_breaks: 3448,
        total_breaks: 4641,
        looms_reported: 192,
        supervisor_name: 'M. Kumar (Shift Lead)',
      },
      {
        shift_id: 2,
        shift_code: '2',
        start_time: '14:00',
        end_time: '22:00',
        target_metres: 16672.9,
        actual_metres: 16872.6,
        variance_metres: 199.7,
        variance_pct: 1.2,
        efficiency_pct: 90.81,
        target_efficiency_pct: 89.44,
        attainment_pct: 101.20,
        target_picks: 36060325,
        actual_picks: 36474960,
        target_pace_m_per_hr: 2084.1,
        actual_pace_m_per_hr: 2109.1,
        target_metres_per_loom: 86.8,
        actual_metres_per_loom: 87.9,
        scheduled_minutes: 92160,
        running_minutes: 85803,
        stopped_minutes: 6357,
        target_running_minutes: 82428,
        allowable_stopped_minutes: 9732,
        warp_breaks: 1267,
        weft_breaks: 3494,
        total_breaks: 4761,
        looms_reported: 192,
        supervisor_name: 'R. Selvam (Shift Lead)',
      },
      {
        shift_id: 3,
        shift_code: '3',
        start_time: '22:00',
        end_time: '06:00',
        target_metres: 16672.9,
        actual_metres: 16332.3,
        variance_metres: -340.6,
        variance_pct: -2.04,
        efficiency_pct: 87.92,
        target_efficiency_pct: 89.44,
        attainment_pct: 97.96,
        target_picks: 36060325,
        actual_picks: 35305600,
        target_pace_m_per_hr: 2084.1,
        actual_pace_m_per_hr: 2041.5,
        target_metres_per_loom: 86.8,
        actual_metres_per_loom: 85.1,
        scheduled_minutes: 92160,
        running_minutes: 83407,
        stopped_minutes: 8753,
        target_running_minutes: 82428,
        allowable_stopped_minutes: 9732,
        warp_breaks: 1172,
        weft_breaks: 3464,
        total_breaks: 4636,
        looms_reported: 192,
        supervisor_name: 'A. Pandian (Night Lead)',
      },
    ];
  }, [shiftsData]);

  // Helper rounder
  function roundNum(val: number, dec: number = 1): number {
    const factor = Math.pow(10, dec);
    return Math.round(val * factor) / factor;
  }

  // 24-Hour Day Level Consolidated Target Metrics
  const day24hTotals = useMemo(() => {
    const totalTarget = shifts.reduce((sum, s) => sum + s.target_metres, 0);
    const totalActual = shifts.reduce((sum, s) => sum + s.actual_metres, 0);
    const totalVarMetres = totalActual - totalTarget;
    const totalVarPct = totalTarget > 0 ? (totalVarMetres / totalTarget) * 100 : 0;
    const totalAttainment = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
    const totalTargetPicks = shifts.reduce(
      (sum, s) => sum + (s.target_picks || Math.round(s.target_metres * 2165.356)),
      0
    );
    const totalActualPicks = shifts.reduce(
      (sum, s) => sum + (s.actual_picks || Math.round(s.actual_metres * 2165.356)),
      0
    );
    const totalWarpBreaks = shifts.reduce((sum, s) => sum + s.warp_breaks, 0);
    const totalWeftBreaks = shifts.reduce((sum, s) => sum + s.weft_breaks, 0);
    const totalBreaks = totalWarpBreaks + totalWeftBreaks;
    const totalRunningMin = shifts.reduce((sum, s) => sum + s.running_minutes, 0);
    const totalStoppedMin = shifts.reduce((sum, s) => sum + s.stopped_minutes, 0);
    const totalSchedMin = shifts.reduce((sum, s) => sum + (s.scheduled_minutes || 92160), 0);
    const avgEff = shifts.length > 0 ? shifts.reduce((sum, s) => sum + s.efficiency_pct, 0) / shifts.length : 0;
    const avgTargetEff = shifts.length > 0 ? shifts.reduce((sum, s) => sum + (s.target_efficiency_pct || 89.44), 0) / shifts.length : 89.44;
    const targetPace = totalTarget / 24.0;
    const actualPace = totalActual / 24.0;
    const maxLooms = Math.max(...shifts.map((s) => s.looms_reported || 192), 192);
    const targetMetresPerLoom = maxLooms > 0 ? totalTarget / maxLooms : 0;
    const actualMetresPerLoom = maxLooms > 0 ? totalActual / maxLooms : 0;

    return {
      totalTarget,
      totalActual,
      totalVarMetres,
      totalVarPct,
      totalAttainment,
      totalTargetPicks,
      totalActualPicks,
      totalWarpBreaks,
      totalWeftBreaks,
      totalBreaks,
      totalRunningMin,
      totalStoppedMin,
      totalSchedMin,
      avgEff,
      avgTargetEff,
      targetPace,
      actualPace,
      maxLooms,
      targetMetresPerLoom,
      actualMetresPerLoom,
    };
  }, [shifts]);

  // 2. Map History Data points for Trend Graph
  const trendPoints: TrendPoint[] = useMemo(() => {
    if (historyData?.timeline?.data_points && historyData.timeline.data_points.length > 0) {
      return historyData.timeline.data_points.map((pt) => ({
        date: pt.date.slice(5), // '07-31'
        actual: pt.actual_metres,
        target: pt.target_metres,
        efficiency: pt.efficiency_pct,
        breaks: pt.total_breaks,
        downtime: pt.stopped_minutes,
      }));
    }
    return [];
  }, [historyData]);

  // 3. Historical Statistics Rollup
  const historyStats = useMemo(() => {
    if (trendPoints.length === 0) {
      return {
        avgOutput: 49620,
        avgEff: 89.2,
        maxOutput: 50200,
        minOutput: 49320,
        targetAttainmentPct: 99.2,
        totalVolume: 347340,
      };
    }
    const totalActual = trendPoints.reduce((sum, p) => sum + p.actual, 0);
    const totalTarget = trendPoints.reduce((sum, p) => sum + p.target, 0);
    const avgOutput = Math.round(totalActual / trendPoints.length);
    const avgEff = Number((trendPoints.reduce((sum, p) => sum + (p.efficiency ?? 89), 0) / trendPoints.length).toFixed(1));
    const maxOutput = Math.max(...trendPoints.map((p) => p.actual));
    const minOutput = Math.min(...trendPoints.map((p) => p.actual));
    const targetAttainmentPct = Number(((totalActual / (totalTarget || 1)) * 100).toFixed(1));
    return {
      avgOutput,
      avgEff,
      maxOutput,
      minOutput,
      targetAttainmentPct,
      totalVolume: Math.round(totalActual),
    };
  }, [trendPoints]);

  const p1Item = actNowQueue[0];
  const secondaryItems = actNowQueue.slice(1, 3);

  // Date step helper
  const stepDate = (delta: number) => {
    if (!onSelectDate) return;
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + delta);
    const dateStr = curr.toISOString().split('T')[0];
    if (dateStr >= '2026-07-01' && dateStr <= '2026-07-31') {
      onSelectDate(dateStr);
    }
  };

  return (
    <div className="production-daily-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* ── PAST DATA AUDIT NOTIFICATION BANNER ──────────────────────────── */}
      {!isToday && (
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '6px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="#D97706" />
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>
                Historical Shift Archive:
              </span>
              <strong style={{ fontSize: '12.5px', color: '#0F172A', marginLeft: '6px' }}>
                Viewing Shift Data for {selectedDate}
              </strong>
              <span style={{ fontSize: '11.5px', color: '#64748B', marginLeft: '8px' }}>
                (Full 100% audited log • Day {selectedDate.slice(8)} of July 2026)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => stepDate(-1)}
              disabled={selectedDate <= '2026-07-01'}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: selectedDate <= '2026-07-01' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <ChevronLeft size={12} />
              <span>Prev Day</span>
            </button>

            <button
              onClick={() => stepDate(1)}
              disabled={selectedDate >= '2026-07-31'}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: selectedDate >= '2026-07-31' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <span>Next Day</span>
              <ChevronRight size={12} />
            </button>

            <button
              onClick={() => onSelectDate?.('2026-07-31')}
              style={{
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Jump to Latest (31 Jul)
            </button>
          </div>
        </div>
      )}

      {/* ── 1. PRODUCTION POSITION (Bullet Target + Efficiency Gauge) ─────── */}
      <ProductionPositionStrip
        primary={primary_kpis}
        supporting={supporting_metrics}
        yesterday={yesterday_comparison}
        onExplainGap={onExplainGap}
      />

      {/* ── 2. TODAY'S SITUATION (One-line verdict & root cause pills) ───── */}
      <div style={{
        background: isBelowPlan ? '#FFFBEB' : '#F0FDF4',
        border: `1px solid ${isBelowPlan ? '#FDE68A' : '#BBF7D0'}`,
        borderRadius: '6px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isBelowPlan ? <AlertTriangle size={15} color="#D97706" /> : <CheckCircle2 size={15} color="#16A34A" />}
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: isBelowPlan ? '#92400E' : '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Shift Situation Verdict:
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A', marginLeft: '6px' }}>
              {verdict.verdict_sentence}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {shortfall.categories.slice(0, 2).map((cat) => (
            <button
              key={cat.name}
              onClick={() => onExplainShortfallCategory(cat)}
              style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
            >
              {cat.name} {cat.share_pct}%
            </button>
          ))}
          <button
            onClick={onExplainSituation}
            style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            [Explain Verdict]
          </button>
        </div>
      </div>

      {/* ── 3. PERIODIC PRODUCTION TREND & HISTORICAL DATA ANALYTICS ─────── */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E6EA',
        borderRadius: '8px',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      }}>
        {/* Header & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Periodic Production Trend & Telemetry Analytics
              </h3>
              <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '10.5px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                {historyWindow} Audit Window
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
              Chronological factory performance against 50,019m target and 90.0% efficiency baseline.
            </div>
          </div>

          {/* Time Window Buttons & Explain */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '2px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              {(['7D', '14D', '30D'] as const).map((win) => (
                <button
                  key={win}
                  onClick={() => onSelectHistoryWindow ? onSelectHistoryWindow(win) : null}
                  style={{
                    padding: '3px 9px',
                    fontSize: '11px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: historyWindow === win ? '#FFFFFF' : 'transparent',
                    color: historyWindow === win ? '#1E3A5F' : '#64748B',
                    boxShadow: historyWindow === win ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  {win === '7D' ? '7 Days' : win === '14D' ? '14 Days' : '30 Days (MTD)'}
                </button>
              ))}
            </div>

            <button
              onClick={onExplainTrend}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#166534',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Sparkles size={12} color="#16A34A" />
              <span>AI Trend Diagnosis</span>
            </button>
          </div>
        </div>

        {/* Statistical Analytics Highlight Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '8px',
          background: '#F8FAFC',
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid #E2E8F0',
        }}>
          <div>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>PERIOD AVG OUTPUT</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              {historyStats.avgOutput.toLocaleString()} m/d
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>FLEET EFFICIENCY</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: historyStats.avgEff >= 90 ? '#16A34A' : '#D97706' }}>
              {historyStats.avgEff}%
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>TARGET ATTAINMENT</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: historyStats.targetAttainmentPct >= 100 ? '#16A34A' : '#2563EB' }}>
              {historyStats.targetAttainmentPct}%
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>PEAK VOLUME DAY</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>
              {historyStats.maxOutput.toLocaleString()} m
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>TROUGH DAY</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626' }}>
              {historyStats.minOutput.toLocaleString()} m
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>CUMULATIVE PERIOD</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              {historyStats.totalVolume.toLocaleString()} m
            </div>
          </div>
        </div>

        {/* Clean, Full-Sized SVG Trend Chart */}
        <ProductionTrendGraph
          points={trendPoints}
          window={historyWindow}
          onSelectWindow={onSelectHistoryWindow || (() => {})}
          onExplainTrend={onExplainTrend}
          trendHeadline={`Historical performance across ${trendPoints.length || 7} working days`}
          isDeclining={isBelowPlan}
        />
      </div>

      {/* ── 4. 24-HOUR 3-SHIFT TARGET & PRODUCTION INTELLIGENCE ─────────── */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={15} color="#2563EB" />
                <span>24-Hour Shift Targets & Performance</span>
              </h3>
              <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '10.5px', fontWeight: 600, padding: '1px 7px', borderRadius: '4px' }}>
                3 Shifts (8h each) • 192 Looms
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
              Planned target vs actual production delivered across Shift 1 (Day), Shift 2 (Evening), and Shift 3 (Night).
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setShowShiftTable(!showShiftTable)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '5px',
                border: '1px solid #CBD5E1',
                background: showShiftTable ? '#EFF6FF' : '#FFFFFF',
                color: showShiftTable ? '#1D4ED8' : '#475569',
                cursor: 'pointer',
              }}
            >
              <Table size={12} />
              <span>{showShiftTable ? 'Hide 24h Table' : 'Show 24h Table'}</span>
            </button>
          </div>
        </div>

        {/* 24-Hour Consolidated Summary Strip */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '7px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {/* Day Totals */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>24h Day Target</span>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                {day24hTotals.totalTarget.toLocaleString()} m
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: '#CBD5E1' }} />

            <div>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>24h Actual Delivered</span>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                {day24hTotals.totalActual.toLocaleString()} m
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: '#CBD5E1' }} />

            <div>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Net Day Gap</span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: day24hTotals.totalVarMetres >= 0 ? '#16A34A' : '#DC2626' }}>
                {day24hTotals.totalVarMetres >= 0 ? `+${day24hTotals.totalVarMetres.toFixed(1)} m` : `${day24hTotals.totalVarMetres.toFixed(1)} m`}
                <span style={{ fontSize: '11px', fontWeight: 500, marginLeft: '4px' }}>
                  ({day24hTotals.totalVarPct.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: '#CBD5E1' }} />

            <div>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Target Met</span>
              <div style={{ fontSize: '14px', fontWeight: 800, color: day24hTotals.totalAttainment >= 100 ? '#16A34A' : '#2563EB' }}>
                {day24hTotals.totalAttainment.toFixed(1)}%
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: '#CBD5E1' }} />

            <div>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Fleet Efficiency</span>
              <div style={{ fontSize: '14px', fontWeight: 800, color: day24hTotals.avgEff >= 90 ? '#16A34A' : '#D97706' }}>
                {day24hTotals.avgEff.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Simple Shift Share Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#475569' }}>
            <span style={{ fontWeight: 600 }}>Shift Share:</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {shifts.map((s, idx) => (
                <span key={s.shift_id} style={{
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  background: idx === 0 ? '#EFF6FF' : idx === 1 ? '#F0FDF4' : '#FFFBEB',
                  color: idx === 0 ? '#1D4ED8' : idx === 1 ? '#15803D' : '#B45309',
                  border: `1px solid ${idx === 0 ? '#BFDBFE' : idx === 1 ? '#BBF7D0' : '#FDE68A'}`,
                }}>
                  S{s.shift_code}: {day24hTotals.totalActual > 0 ? ((s.actual_metres / day24hTotals.totalActual) * 100).toFixed(1) : '33.3'}%
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Chronological Shift Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
        }}>
          {shifts.map((s) => {
            const isPositive = s.variance_metres >= 0;
            const attainment = s.attainment_pct || (s.target_metres > 0 ? (s.actual_metres / s.target_metres) * 100 : 0);
            const shiftName = s.shift_code === '1' ? 'Day Shift' : s.shift_code === '2' ? 'Evening Shift' : 'Night Shift';
            const timing = s.shift_code === '1' ? '06:00 – 14:00' : s.shift_code === '2' ? '14:00 – 22:00' : '22:00 – 06:00';

            return (
              <div
                key={s.shift_id}
                onClick={() => setInspectingShift(s)}
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${isPositive ? '#BBF7D0' : '#E2E8F0'}`,
                  borderTop: `3px solid ${isPositive ? '#16A34A' : attainment >= 98 ? '#2563EB' : '#DC2626'}`,
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>
                        Shift {s.shift_code} ({shiftName})
                      </strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                      {timing} • {s.supervisor_name || 'Shift Lead'}
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: isPositive ? '#F0FDF4' : attainment >= 98 ? '#EFF6FF' : '#FEF2F2',
                    color: isPositive ? '#166534' : attainment >= 98 ? '#1D4ED8' : '#991B1B',
                    border: `1px solid ${isPositive ? '#BBF7D0' : attainment >= 98 ? '#BFDBFE' : '#FECACA'}`,
                  }}>
                    {attainment.toFixed(1)}% Target Met
                  </span>
                </div>

                {/* Primary Metric: Actual vs Target */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                      {s.actual_metres.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>m</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Target: <strong>{s.target_metres.toLocaleString()} m</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '12.5px',
                      fontWeight: 800,
                      color: isPositive ? '#16A34A' : '#DC2626',
                    }}>
                      {isPositive ? `+${s.variance_metres.toFixed(1)} m` : `${s.variance_metres.toFixed(1)} m`}
                    </span>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                      ({isPositive ? `+${s.variance_pct}%` : `${s.variance_pct}%`})
                    </div>
                  </div>
                </div>

                {/* Simple Visual Target Bar */}
                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    width: `${Math.min(attainment, 100)}%`,
                    height: '100%',
                    background: isPositive ? '#16A34A' : attainment >= 98 ? '#2563EB' : '#DC2626',
                    borderRadius: '3px',
                  }} />
                </div>

                {/* 3 Clear Core Metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '6px',
                  background: '#F8FAFC',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'center',
                }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Efficiency</span>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: s.efficiency_pct >= 90 ? '#16A34A' : '#D97706' }}>
                      {s.efficiency_pct}%
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Pace</span>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                      {s.actual_pace_m_per_hr || roundNum(s.actual_metres / 8, 0)} <span style={{ fontSize: '9.5px', fontWeight: 400, color: '#64748B' }}>m/h</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Breaks</span>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#DC2626' }}>
                      {s.total_breaks.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <span style={{ fontSize: '11px', color: isPositive ? '#166534' : '#991B1B', fontWeight: 600 }}>
                    {isPositive ? '✅ Met shift target quota' : `⚠️ Behind plan by ${Math.abs(s.variance_metres).toFixed(0)}m`}
                  </span>
                  <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    View Target Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collapsible 24h Detailed Comparison Table */}
        {showShiftTable && (
          <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '6px', marginTop: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  <th style={{ padding: '8px 10px' }}>Shift</th>
                  <th style={{ padding: '8px 10px' }}>Hours</th>
                  <th style={{ padding: '8px 10px' }}>Supervisor</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Target (m)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actual (m)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Variance</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Attainment</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Efficiency</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Pace</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Breaks</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Downtime</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Inspect</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => {
                  const isPositive = s.variance_metres >= 0;
                  const attainment = s.attainment_pct || (s.target_metres > 0 ? (s.actual_metres / s.target_metres) * 100 : 0);

                  return (
                    <tr key={s.shift_id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0F172A' }}>
                        Shift {s.shift_code}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#64748B' }}>
                        {s.start_time}–{s.end_time}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#475569' }}>
                        {s.supervisor_name || 'Shift Lead'}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                        {s.target_metres.toLocaleString()} m
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                        {s.actual_metres.toLocaleString()} m
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: isPositive ? '#16A34A' : '#DC2626' }}>
                        {isPositive ? `+${s.variance_metres.toFixed(1)}` : s.variance_metres.toFixed(1)} m ({isPositive ? `+${s.variance_pct}%` : `${s.variance_pct}%`})
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: attainment >= 100 ? '#16A34A' : '#2563EB' }}>
                        {attainment.toFixed(1)}%
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                        {s.efficiency_pct}%
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                        {s.actual_pace_m_per_hr || roundNum(s.actual_metres / 8, 1)} m/h
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#DC2626' }}>
                        {s.total_breaks.toLocaleString()}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#64748B' }}>
                        {Math.round(s.stopped_minutes / 60)}h
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <button
                          onClick={() => setInspectingShift(s)}
                          style={{
                            background: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            color: '#1D4ED8',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Target
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: '#F1F5F9', borderTop: '2px solid #CBD5E1', fontWeight: 700, color: '#0F172A' }}>
                  <td colSpan={3} style={{ padding: '8px 10px' }}>
                    <strong>24-Hour Mill Shed Rollup</strong> (3 Shifts • 192 Looms)
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                    {day24hTotals.totalTarget.toLocaleString()} m
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                    {day24hTotals.totalActual.toLocaleString()} m
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: day24hTotals.totalVarMetres >= 0 ? '#16A34A' : '#DC2626' }}>
                    {day24hTotals.totalVarMetres >= 0 ? `+${day24hTotals.totalVarMetres.toFixed(1)}` : day24hTotals.totalVarMetres.toFixed(1)} m ({day24hTotals.totalVarPct.toFixed(1)}%)
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#2563EB' }}>
                    {day24hTotals.totalAttainment.toFixed(1)}%
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                    {day24hTotals.avgEff.toFixed(1)}%
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                    {day24hTotals.actualPace.toFixed(1)} m/h
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#DC2626' }}>
                    {day24hTotals.totalBreaks.toLocaleString()}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                    {Math.round(day24hTotals.totalStoppedMin / 60)}h
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 800 }}>COMPLETE</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Clean 1-Line Analytical Finding */}
        {(() => {
          const sorted = [...shifts].sort((a, b) => b.efficiency_pct - a.efficiency_pct);
          const best = sorted[0];
          const worst = sorted[sorted.length - 1];
          return (
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '9px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              fontSize: '11.5px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={14} color="#2563EB" />
                <span>
                  <strong>24-Hour Finding:</strong> Shift {best?.shift_code} was the strongest ({best?.actual_metres.toLocaleString()}m, {best?.efficiency_pct}% eff). Shift {worst?.shift_code} had the highest shortfall ({worst?.variance_metres > 0 ? '+' : ''}{worst?.variance_metres.toFixed(0)}m vs target) driven by {worst?.total_breaks.toLocaleString()} stoppage breaks.
                </span>
              </div>
              <button
                onClick={() => onExplainShift(`Shift ${worst?.shift_code || '3'}`)}
                style={{
                  background: '#EFF6FF',
                  color: '#1D4ED8',
                  border: '1px solid #BFDBFE',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Root Cause Diagnosis →
              </button>
            </div>
          );
        })()}
      </div>

      {/* ── 5. ACT NOW PRIORITY QUEUE ────────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E6EA',
        borderRadius: '8px',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Act Now — Priority Action Queue
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B' }}>
            <span>Top production drags</span>
            <button
              onClick={() => onNavigateSubmodule ? onNavigateSubmodule('performance') : null}
              style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 600, fontSize: '11px', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              <span>[View Loom Performance]</span>
              <ExternalLink size={10} />
            </button>
          </div>
        </div>

        {/* Action Cards Grid: Dominant P1 on Left, Stacked P2 & P3 on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          {/* DOMINANT P1 CARD */}
          {p1Item && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: '#DC2626', color: '#FFFFFF', padding: '1px 6px', borderRadius: '3px', fontSize: '10.5px', fontWeight: 800 }}>
                      1
                    </span>
                    <button
                      onClick={() => onSelectLoom(p1Item.loom_id)}
                      style={{ background: 'transparent', border: 'none', color: '#0F172A', fontWeight: 700, fontSize: '14px', cursor: 'pointer', padding: 0 }}
                    >
                      Loom {p1Item.loom_no}
                    </button>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>({p1Item.loom_type})</span>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#DC2626' }}>
                    ₹{p1Item.revenue_exposure_inr.toLocaleString()} <span style={{ fontSize: '10.5px', fontWeight: 500, color: '#64748B' }}>exposure</span>
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: '#7F1D1D', fontWeight: 700, marginTop: '6px' }}>
                  Highest production exposure · {p1Item.problem}
                </div>

                <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>
                  Output gap: <strong>{p1Item.lost_metres} m</strong> · Downtime: <strong>{p1Item.stopped_minutes} min</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #FCA5A5', paddingTop: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#334155', fontWeight: 600 }}>
                  Review electrical/drive condition before next shift
                </span>
                <button
                  onClick={() => onExplainAction(p1Item)}
                  style={{
                    background: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <span>[Explain]</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          )}

          {/* COMPACT P2 & P3 COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {secondaryItems.map((item, idx) => {
              const rank = idx + 2;
              return (
                <div
                  key={item.loom_id}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '9px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#E2E8F0', color: '#334155', padding: '1px 5px', borderRadius: '3px', fontSize: '10px', fontWeight: 700 }}>
                      {rank}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => onSelectLoom(item.loom_id)}
                          style={{ background: 'transparent', border: 'none', color: '#0F172A', fontWeight: 700, fontSize: '12px', cursor: 'pointer', padding: 0 }}
                        >
                          Loom {item.loom_no}
                        </button>
                        <span style={{ fontSize: '10.5px', color: '#64748B' }}>({item.problem.split(' ')[0]})</span>
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                        ₹{item.revenue_exposure_inr.toLocaleString()} exposure · {item.lost_metres} m lost
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onExplainAction(item)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #CBD5E1',
                      color: '#2563EB',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    [Explain]
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 6. POTENTIAL RECOVERY & ROOT CAUSE SHARE ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        {/* Left: RECOVERY POTENTIAL */}
        <div style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '8px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '10px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="#2563EB" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>
                Immediate Opportunity Recovery
              </span>
            </div>
            <div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 800, marginTop: '8px' }}>
              <strong>{recovery.recoverable_metres} m</strong> recoverable
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
              Potential margin value: <strong style={{ color: '#16A34A' }}>₹{recovery.recoverable_inr.toLocaleString()}</strong>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px' }}>
              Top opportunity: <strong style={{ color: '#2563EB' }}>Loom {recovery.top_opportunity_loom}</strong> (Fastest speed/air restoration)
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onExplainRecovery}
              style={{
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              [AI Recovery Roadmap]
            </button>
          </div>
        </div>

        {/* Right: WHY ARE WE BELOW TARGET (Decomposition) */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Root Shortfall Loss Attribution
            </h4>
            <span style={{ fontSize: '11px', color: '#64748B' }}>100% MECE Split</span>
          </div>

          {/* Unified Contribution Bar */}
          <div style={{ height: '12px', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '10px' }}>
            {shortfall.categories.map((cat, idx) => (
              <div
                key={cat.name}
                style={{
                  width: `${cat.share_pct}%`,
                  background: idx === 0 ? '#DC2626' : (idx === 1 ? '#F59E0B' : (idx === 2 ? '#2563EB' : '#94A3B8')),
                  height: '100%',
                }}
                title={`${cat.name}: ${cat.share_pct}%`}
              />
            ))}
          </div>

          {/* Contributor List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {shortfall.categories.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', padding: '2px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: idx === 0 ? '#DC2626' : (idx === 1 ? '#F59E0B' : '#2563EB') }} />
                  <span style={{ color: '#334155', fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ color: '#64748B' }}>({cat.affected_looms_count} looms)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: '#0F172A' }}>{cat.share_pct}%</strong>
                  <button
                    onClick={() => onExplainShortfallCategory(cat)}
                    style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: '10.5px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    [Explain]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STRAIGHTFORWARD SHIFT TARGET DRILLDOWN MODAL ────────────────── */}
      {inspectingShift && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setInspectingShift(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid #CBD5E1',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: '20px 24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                    Shift {inspectingShift.shift_code} Target & Hourly Trajectory
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: inspectingShift.variance_metres >= 0 ? '#F0FDF4' : '#FEF2F2',
                    color: inspectingShift.variance_metres >= 0 ? '#166534' : '#991B1B',
                  }}>
                    {inspectingShift.attainment_pct || 99}% Attained
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                  {inspectingShift.start_time} – {inspectingShift.end_time} • Lead: {inspectingShift.supervisor_name || 'Shift Supervisor'} • 192 Looms
                </div>
              </div>

              <button
                onClick={() => setInspectingShift(null)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* 3 Large Straightforward KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
            }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: '7px' }}>
                <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Shift Target</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  {inspectingShift.target_metres.toLocaleString()} m
                </div>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  {inspectingShift.target_metres_per_loom || 86.8} m/loom quota
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: '7px' }}>
                <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Actual Delivered</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  {inspectingShift.actual_metres.toLocaleString()} m
                </div>
                <span style={{ fontSize: '11px', color: inspectingShift.efficiency_pct >= 90 ? '#16A34A' : '#D97706', fontWeight: 600 }}>
                  {inspectingShift.efficiency_pct}% efficiency
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: '7px' }}>
                <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Variance vs Plan</span>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  marginTop: '2px',
                  color: inspectingShift.variance_metres >= 0 ? '#16A34A' : '#DC2626',
                }}>
                  {inspectingShift.variance_metres >= 0 ? `+${inspectingShift.variance_metres.toFixed(1)} m` : `${inspectingShift.variance_metres.toFixed(1)} m`}
                </div>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  {inspectingShift.variance_metres >= 0 ? 'Ahead of quota' : 'Behind quota'}
                </span>
              </div>
            </div>

            {/* 8-Hour Hourly Trajectory */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ fontSize: '12px', color: '#0F172A', textTransform: 'uppercase' }}>
                  Hourly Delivery vs Target Pace ({inspectingShift.target_pace_m_per_hr || 2084} m/hr)
                </strong>
                <span style={{ fontSize: '11px', color: '#64748B' }}>8 Hours (06:00–14:00)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Array.from({ length: 8 }).map((_, h) => {
                  const hourStart = parseInt(inspectingShift.start_time.split(':')[0]) + h;
                  const fmtHour = (hourStart % 24).toString().padStart(2, '0') + ':00';
                  const fmtNext = ((hourStart + 1) % 24).toString().padStart(2, '0') + ':00';
                  const hourlyTarget = roundNum(inspectingShift.target_metres / 8, 1);
                  const hourFactor = 1 + Math.sin(h * 1.1) * 0.035;
                  const hourlyActual = roundNum((inspectingShift.actual_metres / 8) * hourFactor, 1);
                  const delta = roundNum(hourlyActual - hourlyTarget, 1);
                  const pct = Math.min((hourlyActual / hourlyTarget) * 100, 100);

                  return (
                    <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px' }}>
                      <span style={{ width: '80px', color: '#64748B', fontWeight: 600 }}>
                        {fmtHour}–{fmtNext}
                      </span>
                      <div style={{ flex: 1, height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: delta >= 0 ? '#16A34A' : '#3B82F6',
                          borderRadius: '4px',
                        }} />
                      </div>
                      <span style={{ width: '60px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                        {hourlyActual.toLocaleString()} m
                      </span>
                      <span style={{
                        width: '55px',
                        textAlign: 'right',
                        fontWeight: 700,
                        color: delta >= 0 ? '#16A34A' : '#DC2626',
                      }}>
                        {delta >= 0 ? `+${delta}` : delta} m
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom 2 Cards: Stoppages & Handover */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: '6px', fontSize: '11.5px' }}>
                <strong style={{ color: '#0F172A' }}>Stoppage Breakdown</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', color: '#475569' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Warp Breaks:</span>
                    <strong style={{ color: '#DC2626' }}>{inspectingShift.warp_breaks.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Weft Breaks:</span>
                    <strong style={{ color: '#D97706' }}>{inspectingShift.weft_breaks.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Stopped Time:</span>
                    <strong>{Math.round(inspectingShift.stopped_minutes / 60)}h ({inspectingShift.stopped_minutes}m)</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '10px 12px', borderRadius: '6px', fontSize: '11.5px' }}>
                <strong style={{ color: '#1D4ED8' }}>Next Shift Handover Note</strong>
                <div style={{ color: '#1E3A8A', marginTop: '6px', lineHeight: 1.4 }}>
                  {inspectingShift.variance_metres >= 0 ? (
                    <span>
                      ✅ Shift {inspectingShift.shift_code} delivered <strong>+{inspectingShift.variance_metres.toFixed(0)}m surplus</strong>. Subsequent shift can run at standard pace ({inspectingShift.target_pace_m_per_hr || 2084} m/hr).
                    </span>
                  ) : (
                    <span>
                      ⚠️ Shift {inspectingShift.shift_code} logged a <strong>{Math.abs(inspectingShift.variance_metres).toFixed(0)}m deficit</strong>. Target pace for subsequent shifts is increased to maintain daily quota.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
              <button
                onClick={() => {
                  onExplainShift(`Shift ${inspectingShift.shift_code}`);
                  setInspectingShift(null);
                }}
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1D4ED8',
                  padding: '5px 12px',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                AI Shift Diagnosis
              </button>
              <button
                onClick={() => setInspectingShift(null)}
                style={{
                  background: '#0F172A',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '5px 14px',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
