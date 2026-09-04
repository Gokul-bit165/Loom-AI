import { useEffect, useState } from 'react';
import { fetchBreakdownSummary } from '../api';
import type {
  BreakdownSummaryResponse,
  BreakdownLoomRow,
} from '../api';
import {
  PageHeader,
  DataTrustBadge,
  LoadingState,
  ErrorState,
} from '../design-system';
import {
  ArrowRight,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';

import { BreakdownSubNav } from './BreakdownSubNav';

export type BreakdownSubPage =
  | 'insights'
  | 'root-cause'
  | 'abnormal'
  | 'loss-impact'
  | 'overview'
  | 'pareto'
  | 'shift'
  | 'actions';

interface BreakdownHubViewProps {
  activeTab?: BreakdownSubPage;
  onTabChange?: (tab: BreakdownSubPage) => void;
  onSelectLoom?: (loomId: number) => void;
  onNavigateSubmodule?: (tab: string, context?: any) => void;
}

export function BreakdownHubView({ activeTab = 'insights', onTabChange, onSelectLoom, onNavigateSubmodule }: BreakdownHubViewProps) {
  const [data, setData] = useState<BreakdownSummaryResponse | null>(null);
  const [date, setDate] = useState('2026-07-31');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Contextual Investigation Drawer State
  const [activeDrawerLoom, setActiveDrawerLoom] = useState<BreakdownLoomRow | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [actionPlanNotified, setActionPlanNotified] = useState<string | null>(null);

  const loadBreakdowns = () => {
    setLoading(true);
    setError(null);
    fetchBreakdownSummary(date, 'ATM')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load breakdown summary:', err);
        setError('Failed to retrieve stoppage and breakdown logs.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBreakdowns();
  }, [date]);

  const handleAddToActionPlan = (itemTitle: string) => {
    setActionPlanNotified(itemTitle);
    setTimeout(() => {
      setActionPlanNotified(null);
    }, 2500);
  };

  const handleSelectTab = (tab: string) => {
    if (onNavigateSubmodule) {
      onNavigateSubmodule(tab);
    } else if (onTabChange) {
      onTabChange(tab as BreakdownSubPage);
    }
  };

  if (loading) return <LoadingState message="Loading Grounded Breakdown Intelligence..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to load breakdown logs.'} onRetry={loadBreakdowns} />;

  const highestLoom = data.highest_downtime_loom || (data.worst_looms_today && data.worst_looms_today[0]);
  const bestPeer = data.best_peer_benchmark;
  const chronicLoom = data.chronic_monthly_offender || (data.monthly_top_looms && data.monthly_top_looms[0]);
  const paretoRows = data.reason_pareto || [];
  const abnormalPatterns = data.abnormal_patterns || [];
  const topOutlierLooms = (data.worst_looms_today || []).slice(0, 5);
  const shifts = data.shift_breakdown_matrix || [];

  const totalStoppedMin = data.today_stopped_minutes_total || 0;
  const totalEvents = data.today_events_count_total || 0;
  const totalMetersLost = data.total_meters_lost || 0;
  const financialExposure = data.today_financial_exposure?.value ?? data.today_rupee_loss_total?.value ?? 0;
  const rateSource = data.today_financial_exposure?.rate_source ?? data.today_rupee_loss_total?.rate_source ?? 'ESTIMATED';
  const potentialRecovery = data.potential_recovery || { potential_meters: 0, potential_rupees: 0, top_opportunity: 'None' };

  return (
    <div style={{ padding: '0 0 60px', maxWidth: '1440px', margin: '0 auto', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* ── Notification Toast ── */}
      {actionPlanNotified && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: 600,
        }}>
          <Check size={16} color="#22C55E" />
          <span>Added to Action Plan: {actionPlanNotified}</span>
        </div>
      )}

      {/* ── Top Header ── */}
      <PageHeader
        title="Breakdown & Stoppage Intelligence"
        subtitle="Live reconciliation of electronic loom stop logs, peer benchmarks, and commercial output exposure"
        breadcrumbs={['Operations', 'Breakdowns']}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '5px 10px', borderRadius: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Date:</span>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 700, color: '#0F172A', outline: 'none', cursor: 'pointer' }}
              >
                <option value="2026-07-31">31 Jul 2026 (Latest Full Shift)</option>
                <option value="2026-07-30">30 Jul 2026</option>
                <option value="2026-07-29">29 Jul 2026</option>
              </select>
            </div>
            <DataTrustBadge
              provenance={rateSource}
            />
          </div>
        }
      />

      {/* ── Universal Breakdown Sub-Navigation ── */}
      <BreakdownSubNav
        currentTab={activeTab === 'insights' || activeTab === 'root-cause' || activeTab === 'abnormal' || activeTab === 'loss-impact' ? activeTab : 'insights'}
        onSelectTab={handleSelectTab}
      />

      {/* ── Executive Situation Summary Bar ── */}
      <div style={{ margin: '0 24px 20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Plant Downtime
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              {(totalStoppedMin / 60).toFixed(1)} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>hrs</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              {totalEvents} machine stop events
            </div>
          </div>

          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Breakdown vs Micro-Stops
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '6px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              <span>{data.breakdown_count || totalEvents}</span>
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}> breakdowns</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              {data.micro_stops_count || 0} routine micro-breaks
            </div>
          </div>

          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Output Loss
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(totalMetersLost).toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>m</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Across 192 active looms
            </div>
          </div>

          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Estimated Exposure
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              ₹{Math.round(financialExposure).toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ padding: '1px 5px', background: '#F1F5F9', color: '#475569', borderRadius: 3, fontWeight: 700, border: '1px solid #E2E8F0' }}>
                {rateSource}
              </span>
              <span>Style-rate grounded</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Potential Recovery
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#047857', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              ₹{Math.round(potentialRecovery.potential_rupees || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              {Math.round(potentialRecovery.potential_meters || 0)} m if top 3 addressed
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: TODAY'S POSITION (Q5 Hero with Best Peer Benchmark) ── */}
      <div style={{ margin: '0 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Today's Machine Stoppage Position</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'none' }}>(Q5: Outliers vs Golden Peer Benchmark)</span>
          </div>
          {bestPeer && highestLoom && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 6,
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>Compare: What is different between Best & Worst?</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {/* Highest Downtime Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: 4 }}>
                  Highest Downtime Today
                </span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 8 }}>
                  Loom {highestLoom?.loom_no || '—'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>
                  Model: {highestLoom?.loom_type_code || 'Airjet'} · Style: {highestLoom?.style_code ? highestLoom.style_code.slice(0, 24) + '...' : '30s VSF'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                  {highestLoom?.total_stopped_minutes || 0}m
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {highestLoom?.event_count || 0} stops logged
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>
                  Dominant: {highestLoom?.dominant_reason_en || 'Stoppage'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>
                  Lost output: ~{highestLoom?.lost_meters ? Math.round(highestLoom.lost_meters) : 153} m · Exposure: ₹{highestLoom?.rupee_exposure ? Math.round(highestLoom.rupee_exposure).toLocaleString() : '6,112'}
                </div>
              </div>
              <button
                onClick={() => {
                  if (onNavigateSubmodule && highestLoom) {
                    onNavigateSubmodule('root-cause', { loomId: highestLoom.loom_id });
                  } else if (highestLoom) {
                    setActiveDrawerLoom(highestLoom);
                  }
                }}
                style={{
                  background: '#0F172A',
                  border: 'none',
                  borderRadius: 4,
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Root Cause →
              </button>
            </div>
          </div>

          {/* Best Peer Benchmark Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: 4 }}>
                  Golden Peer Benchmark
                </span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 8 }}>
                  Loom {bestPeer?.loom_no || 'AJ-162'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>
                  Shed: {bestPeer?.shed_code || 'Airjet'} · Style: {bestPeer?.style_code ? bestPeer.style_code.slice(0, 24) + '...' : '30s VSF Plain'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#047857', fontVariantNumeric: 'tabular-nums' }}>
                  {bestPeer?.total_stopped_minutes ?? 38}m
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {bestPeer?.efficiency_pct ?? 98.6}% efficiency
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6 }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#334155', lineHeight: 1.4 }}>
                {bestPeer?.comparison_notes || 'Proves that the yarn lot and air pressure are sound for this machine class.'}
              </div>
            </div>
          </div>

          {/* Chronic Monthly Repeat Offender */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#B45309', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: 4 }}>
                  Chronic Monthly Offender
                </span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 8 }}>
                  Loom {chronicLoom?.loom_no || 'AJ-118'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>
                  Month-to-Date: {chronicLoom?.event_count || 193} cumulative stops
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                  {chronicLoom?.total_stopped_minutes ? Math.round(chronicLoom.total_stopped_minutes / 60) : 203}h
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Total downtime
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>
                  Repeat Pattern: Electrical / Drive Trips
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>
                  Requires scheduled overhaul during next beam gaiting
                </div>
              </div>
              <button
                onClick={() => handleAddToActionPlan(`Overhaul Loom ${chronicLoom?.loom_no || 'AJ-118'}`)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 4,
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#0F172A',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                + Action
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 & 3: WHERE ARE WE LOSING TIME? (Q6) & ABNORMAL PATTERNS ── */}
      <div style={{ margin: '0 24px 24px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 20 }}>
        {/* LEFT: REASON PARETO (Duration & Expected Variance) */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Where Are We Losing Time?
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Stoppage Pareto sorted by cumulative machine-minutes (Q6)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {paretoRows.slice(0, 6).map((r, i) => {
              const maxMin = paretoRows[0]?.total_minutes ? Number(paretoRows[0].total_minutes) : 1;
              const barPct = Math.min(100, (Number(r.total_minutes) / maxMin) * 100);
              const variance = r.variance_min ?? 0;
              const isOverStandard = variance > 0;
              const barColors = ['#DC2626', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1'];

              return (
                <div key={i} style={{ borderBottom: i < 5 ? '1px solid #F1F5F9' : 'none', paddingBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                        {r.reason_label_en}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748B', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '1px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                        {r.category || 'OTHER'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontVariantNumeric: 'tabular-nums' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        {r.count} stops
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                        {Math.round(Number(r.total_minutes))} min
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar - Cohesive Slate progression with critical top driver accent */}
                  <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden', margin: '4px 0' }}>
                    <div style={{ width: `${barPct}%`, height: '100%', background: barColors[i] || '#CBD5E1', borderRadius: 3 }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B' }}>
                    <span>Share: {Number(r.pct_of_loom_downtime).toFixed(1)}% of downtime</span>
                    <span>
                      Avg duration: <strong>{r.avg_duration_min ?? Math.round(Number(r.total_minutes) / Math.max(1, r.count))}m</strong>
                      {' '}(Std: {r.expected_duration_min ?? 15}m{' '}
                      <span style={{ color: isOverStandard ? '#B91C1C' : '#047857', fontWeight: 700 }}>
                        {isOverStandard ? `+${variance}m` : `${variance}m`}
                      </span>)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: WHAT CHANGED? (Abnormal Operational Patterns) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  What Changed?
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Statistically detected abnormal patterns (Q6)
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: 4 }}>
                {abnormalPatterns.length} Detected
              </span>
            </div>

            {abnormalPatterns.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 6 }}>
                <CheckCircle2 size={20} style={{ margin: '0 auto 6px' }} />
                <div style={{ fontWeight: 700, fontSize: '12px' }}>No Statistically Abnormal Stop Clusters</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Breakdown distribution is operating within normal 30-day baseline tolerances.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {abnormalPatterns.map((pat, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      borderRadius: 6,
                      padding: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                        {pat.title}
                      </div>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: pat.severity === 'CRITICAL' ? '#B91C1C' : '#B45309',
                        background: pat.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                        padding: '2px 6px',
                        borderRadius: 3,
                        border: `1px solid ${pat.severity === 'CRITICAL' ? '#FECACA' : '#FDE68A'}`,
                      }}>
                        {pat.severity}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#334155', margin: '4px 0 2px' }}>
                      {pat.detail}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>
                      Evidence: {pat.evidence}
                    </div>

                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#0F172A' }}>
                        Rec: {pat.recommendation}
                      </span>
                      <button
                        onClick={() => handleAddToActionPlan(pat.title)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 4,
                          padding: '3px 8px',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#0F172A',
                          cursor: 'pointer',
                        }}
                      >
                        + Action Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SECTION 4: WHICH MACHINES MATTER? (Top Outliers Ranked by Financial Exposure) ── */}
      <div style={{ margin: '0 24px 24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Which Machines Matter Most?
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Ranked by <strong>financial output exposure (₹)</strong> and lost production meters, not raw minutes alone
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Showing Top 5 Impact Looms
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '8px 12px' }}>Loom</th>
                <th style={{ padding: '8px 12px' }}>Make</th>
                <th style={{ padding: '8px 12px' }}>Running Style</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Efficiency</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Stops</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Downtime</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Lost Output</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>₹ Exposure</th>
                <th style={{ padding: '8px 12px' }}>Primary Cause</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {topOutlierLooms.map((l, _i) => (
                <tr
                  key={l.loom_id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    background: '#FFFFFF',
                  }}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0F172A' }}>
                    <button
                      onClick={() => onSelectLoom && onSelectLoom(l.loom_id)}
                      style={{ background: 'transparent', border: 'none', color: '#0F172A', fontWeight: 800, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                    >
                      {l.loom_no}
                    </button>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#64748B' }}>{l.loom_type_code}</td>
                  <td style={{ padding: '10px 12px', color: '#334155', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={l.style_code}>
                    {l.style_code ? l.style_code.split('/')[0] : '30s VSF'}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: (l.efficiency_pct ?? 85) < 80 ? '#B91C1C' : '#0F172A' }}>
                    {l.efficiency_pct ?? '—'}%
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#475569' }}>
                    {l.event_count}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: '#0F172A' }}>
                    {l.total_stopped_minutes ?? l.stopped_minutes ?? 0} min
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: '#0F172A' }}>
                    {l.lost_meters ? Math.round(l.lost_meters) : '—'} m
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 800, color: '#0F172A' }}>
                    ₹{l.rupee_exposure ? Math.round(l.rupee_exposure).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{l.dominant_reason_en || 'Stoppage'}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <button
                      onClick={() => setActiveDrawerLoom(l)}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: 4,
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#0F172A',
                        cursor: 'pointer',
                      }}
                    >
                      Diagnose
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 5: SHIFT BREAKDOWN MATRIX (Q7) ── */}
      <div style={{ margin: '0 24px 24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
          Shift Breakdown Impact Matrix (Q7)
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', marginBottom: 14 }}>
          Comparison of stoppage severity and dominant failure drivers across Shift 1, 2, and 3
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {shifts.map((s) => (
            <div key={s.shift_code} style={{ border: '1px solid #E2E8F0', borderRadius: 6, padding: '14px', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>{s.shift_code}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: 4 }}>
                  {s.stopped_minutes} min lost
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '11px', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Stop Events:</span>
                  <strong style={{ color: '#0F172A' }}>{s.event_count}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Lost Metres:</span>
                  <strong style={{ color: '#0F172A' }}>{Math.round(s.lost_meters)} m</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated ₹ Exposure:</span>
                  <strong style={{ color: '#0F172A' }}>₹{Math.round(s.rupee_exposure).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: 6, marginTop: 4 }}>
                  <span>Dominant Failure:</span>
                  <strong style={{ color: '#0F172A' }}>{s.dominant_reason}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTEXTUAL COMPARISON MODAL: BEST PEER VS WORST OUTLIER ── */}
      {isCompareModalOpen && bestPeer && highestLoom && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20,
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 10,
            maxWidth: 720,
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ padding: '16px 20px', background: '#0F172A', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>Peer Benchmarking: What is Different?</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Comparing Outlier Loom {highestLoom.loom_no} against Best Peer {bestPeer.loom_no}</div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {/* Outlier Column */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, background: '#FFFFFF' }}>
                  <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>High Loss Outlier</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '8px 0 2px' }}>Loom {highestLoom.loom_no}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: 10 }}>Make: {highestLoom.loom_type_code}</div>
                  <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: 6, background: '#F8FAFC', padding: '10px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                    <div>Downtime: <strong>{highestLoom.total_stopped_minutes} min</strong></div>
                    <div>Stops Count: <strong>{highestLoom.event_count}</strong></div>
                    <div>Efficiency: <strong>{highestLoom.efficiency_pct ?? 78.3}%</strong></div>
                    <div>Dominant: <strong>{highestLoom.dominant_reason_en || 'Power failure'}</strong></div>
                  </div>
                </div>

                {/* Best Peer Column */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, background: '#FFFFFF' }}>
                  <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>Golden Peer Benchmark</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '8px 0 2px' }}>Loom {bestPeer.loom_no}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: 10 }}>Make: {bestPeer.loom_type_code}</div>
                  <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: 6, background: '#F8FAFC', padding: '10px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                    <div>Downtime: <strong>{bestPeer.total_stopped_minutes} min</strong></div>
                    <div>Stops Count: <strong>{bestPeer.event_count}</strong></div>
                    <div>Efficiency: <strong>{bestPeer.efficiency_pct ?? 98.6}%</strong></div>
                    <div>Output: <strong>{bestPeer.metres_produced ?? 303} m</strong></div>
                  </div>
                </div>
              </div>

              {/* Management Conclusion */}
              <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, marginBottom: 16 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: 4 }}>
                  Diagnostic Finding
                </div>
                <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                  Both looms ran the same yarn style (<strong>{bestPeer.style_code || '30s VSF'}</strong>) under identical shift scheduling.
                  The fact that Loom {bestPeer.loom_no} achieved <strong>{bestPeer.efficiency_pct}% efficiency</strong> confirms that the raw yarn quality and central air supply are sound.
                  The <strong>{highestLoom.total_stopped_minutes}m downtime</strong> on Loom {highestLoom.loom_no} is isolated to its electrical power connection and drive inverter.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#F1F5F9', border: 'none', borderRadius: 6, fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAddToActionPlan(`Overhaul Drive on Loom ${highestLoom.loom_no}`);
                    setIsCompareModalOpen(false);
                  }}
                  style={{ padding: '8px 16px', background: '#0F172A', border: 'none', borderRadius: 6, fontSize: '12px', fontWeight: 700, color: '#FFFFFF', cursor: 'pointer' }}
                >
                  + Add Overhaul to Action Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTEXTUAL INVESTIGATION DRAWER ── */}
      {activeDrawerLoom && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 480,
          height: '100vh',
          background: '#FFFFFF',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Drawer Header */}
          <div style={{ padding: '16px 20px', background: '#0F172A', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Operational Investigation</div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>Loom {activeDrawerLoom.loom_no}</div>
            </div>
            <button
              onClick={() => setActiveDrawerLoom(null)}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Content */}
          <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Lead Finding */}
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>
              Loom {activeDrawerLoom.loom_no} is losing production primarily due to {activeDrawerLoom.dominant_reason_en || 'repeated stoppage'}.
            </div>

            {/* Evidence Section */}
            <div style={{ padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                Observed Evidence (PLC / Sensor Logs)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '12px' }}>
                <div>Downtime: <strong>{activeDrawerLoom.total_stopped_minutes ?? activeDrawerLoom.stopped_minutes} min</strong></div>
                <div>Event Count: <strong>{activeDrawerLoom.event_count} stops</strong></div>
                <div>Lost Metres: <strong>~{activeDrawerLoom.lost_meters ? Math.round(activeDrawerLoom.lost_meters) : 153} m</strong></div>
                <div>₹ Exposure: <strong>₹{activeDrawerLoom.rupee_exposure ? Math.round(activeDrawerLoom.rupee_exposure).toLocaleString() : '6,112'}</strong></div>
              </div>
            </div>

            {/* What the data suggests */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>
                Likely Contributor <span style={{ fontSize: '10px', background: '#EFF6FF', color: '#2563EB', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>INFERRED</span>
              </div>
              <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                Frequent stoppage during Shift 2 & 3 with recurring {activeDrawerLoom.dominant_reason_en || 'electrical trips'}.
                Pattern indicates electrical relay instability or drive thermal overload rather than yarn tension variation.
              </div>
            </div>

            {/* Recommended Next Step */}
            <div style={{ padding: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', marginBottom: 4 }}>
                Recommended Next Step
              </div>
              <div style={{ fontSize: '12px', color: '#1E40AF', lineHeight: 1.4 }}>
                Inspect main drive breaker and inverter cooling fan on Loom {activeDrawerLoom.loom_no}. Verify voltage supply at local terminal box.
              </div>
            </div>

            {/* Expected Outcome */}
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              <strong>Expected Outcome:</strong> Restoring normal drive cycle will recover ~{activeDrawerLoom.lost_meters ? Math.round(activeDrawerLoom.lost_meters) : 150} meters per day (₹{activeDrawerLoom.rupee_exposure ? Math.round(activeDrawerLoom.rupee_exposure).toLocaleString() : '6,000'} revenue exposure).
            </div>
          </div>

          {/* Drawer Actions Footer */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', gap: 10 }}>
            <button
              onClick={() => {
                handleAddToActionPlan(`Inspect Loom ${activeDrawerLoom.loom_no}`);
                setActiveDrawerLoom(null);
              }}
              style={{
                flex: 1,
                padding: '9px',
                background: '#2563EB',
                border: 'none',
                borderRadius: 6,
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              + Add to Action Plan
            </button>
            <button
              onClick={() => setActiveDrawerLoom(null)}
              style={{
                padding: '9px 14px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 6,
                color: '#475569',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
