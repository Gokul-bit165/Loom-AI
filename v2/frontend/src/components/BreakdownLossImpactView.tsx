import { useEffect, useState } from 'react';
import { fetchBreakdownLossImpact } from '../api';
import type { BreakdownLossImpactResponse } from '../api';
import {
  PageHeader,
  DataTrustBadge,
  LoadingState,
  ErrorState,
} from '../design-system';
import {
  Info,
  Check,
  X,
} from 'lucide-react';

import { BreakdownSubNav } from './BreakdownSubNav';

interface BreakdownLossImpactViewProps {
  initialLoomId?: number;
  selectedDate?: string;
  onSelectLoom?: (loomId: number) => void;
  onNavigateSubmodule?: (tab: string, context?: any) => void;
}

export function BreakdownLossImpactView({
  initialLoomId: _initialLoomId,
  selectedDate = '2026-07-31',
  onSelectLoom,
  onNavigateSubmodule,
}: BreakdownLossImpactViewProps) {
  const [date, setDate] = useState(selectedDate);
  const [windowFilter, setWindowFilter] = useState<'TODAY' | '7D' | '30D' | '90D'>('TODAY');
  const [data, setData] = useState<BreakdownLossImpactResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Evidence Drawer & Actions
  const [isWhyDrawerOpen, setIsWhyDrawerOpen] = useState(false);
  const [actionPlanToast, setActionPlanToast] = useState<string | null>(null);

  const loadLossImpact = () => {
    setLoading(true);
    setError(null);
    fetchBreakdownLossImpact(date, 'ATM', windowFilter)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load breakdown loss impact:', err);
        setError('Failed to compute breakdown financial loss impact.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLossImpact();
  }, [date, windowFilter]);

  const handleAddToActionPlan = (title: string) => {
    setActionPlanToast(title);
    setTimeout(() => setActionPlanToast(null), 2500);
  };

  if (loading) return <LoadingState message="Computing Reconciled Financial & Production Loss Impact..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to calculate loss impact.'} onRetry={loadLossImpact} />;

  const summary = data.summary;
  const waterfall = data.waterfall || [];
  const categories = data.category_breakdown || [];
  const topLooms = data.top_loss_machines || [];
  const shifts = data.shift_breakdown || [];
  const recovery = data.recovery_opportunity;
  const trend = data.trend;
  const priorities = data.management_priorities || [];

  return (
    <div style={{ padding: '0 0 60px', maxWidth: '1440px', margin: '0 auto', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* ── Notification Toast ── */}
      {actionPlanToast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, background: '#0F172A', color: '#FFFFFF',
          padding: '12px 18px', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 10, zIndex: 9999, fontSize: '13px', fontWeight: 600,
        }}>
          <Check size={16} color="#22C55E" />
          <span>Added to Action Plan: {actionPlanToast}</span>
        </div>
      )}

      {/* ── Top Header ── */}
      <PageHeader
        title="Production Loss Impact"
        subtitle="Authoritative financial exposure, loss waterfall, and recovery priorities"
        breadcrumbs={['Operations', 'Breakdowns', 'Loss Impact']}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '5px 10px', borderRadius: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Date:</span>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 700, color: '#0F172A', outline: 'none', cursor: 'pointer' }}
              >
                <option value="2026-07-31">31 Jul 2026</option>
                <option value="2026-07-30">30 Jul 2026</option>
                <option value="2026-07-29">29 Jul 2026</option>
              </select>
            </div>
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '2px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
              {(['TODAY', '7D', '30D', '90D'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setWindowFilter(period)}
                  style={{
                    border: 'none',
                    background: windowFilter === period ? '#0F172A' : 'transparent',
                    color: windowFilter === period ? '#FFFFFF' : '#475569',
                    fontWeight: 700,
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsWhyDrawerOpen(true)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Info size={14} />
              <span>[Why is this costing us?]</span>
            </button>
            <DataTrustBadge provenance={summary.rate_provenance} />
          </div>
        }
      />

      {/* ── Universal Breakdown Sub-Navigation ── */}
      <BreakdownSubNav
        currentTab="loss-impact"
        onSelectTab={(tab) => onNavigateSubmodule?.(tab)}
      />

      {/* ── SECTION 1: TODAY'S LOSS POSITION (One Strong Executive Summary Bar) ── */}
      <div style={{ margin: '0 24px 20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Financial Exposure
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              ₹{Math.round(summary.total_rupee_exposure).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Style commercial rates ({summary.rate_provenance})
            </div>
          </div>

          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Lost Production Output
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(summary.total_lost_meters).toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>metres</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Across {Math.round(summary.total_stopped_minutes / 60)} plant stoppage hrs
            </div>
          </div>

          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Affected Looms
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              {summary.affected_looms_count} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>machines</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Logged stoppage events today
            </div>
          </div>

          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Worst Shift Impact
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px' }}>
              {summary.worst_shift}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              ₹{Math.round(summary.worst_shift_exposure).toLocaleString()} exposure in 8 hrs
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Potential Recovery
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#047857', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              ₹{Math.round(recovery.potential_recovery_rupees).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              ~{Math.round(recovery.potential_recovery_meters)} m if top 3 addressed
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 & 3: REAL LOSS WATERFALL & CATEGORY CONTRIBUTION (Side-by-side) ── */}
      <div style={{ margin: '0 24px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* REAL LOSS WATERFALL (Prevents Double Counting) */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Production Loss Waterfall
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Scheduled theoretical capacity vs actual delivered output (no double counting)
              </div>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Values in Metres
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {waterfall.map((step, idx) => {
              const isSub = step.type === 'SUBTRACTION';
              const isTotal = step.type === 'TOTAL_AVAILABLE';
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 6,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                      {step.step}
                    </div>
                    {step.rupees && (
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>
                        Commercial impact: ₹{Math.round(step.rupees).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      fontVariantNumeric: 'tabular-nums',
                      color: isTotal ? '#0F172A' : isSub ? '#B91C1C' : '#047857',
                    }}>
                      {isSub ? `–${Math.round(step.metres).toLocaleString()} m` : `${Math.round(step.metres).toLocaleString()} m`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: LOSS BY BREAKDOWN CATEGORY */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Loss by Breakdown Category
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Financial contribution across failure modes
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categories.map((cat, idx) => {
                const catColors = ['#DC2626', '#334155', '#475569', '#64748B', '#94A3B8'];
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{cat.label}</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums', color: '#0F172A' }}>
                        <strong>₹{Math.round(cat.rupee_exposure).toLocaleString()}</strong> ({cat.percentage_share}%)
                      </span>
                    </div>

                    <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: '#F1F5F9' }}>
                      <div style={{
                        width: `${cat.percentage_share}%`,
                        background: catColors[idx] || '#94A3B8',
                        borderRadius: 3,
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748B', marginTop: 3 }}>
                      <span>{cat.lost_meters} metres lost</span>
                      <span>{Math.round(cat.downtime_min / 60)} hrs stoppage</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Summary Note */}
          <div style={{ marginTop: 14, padding: '10px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: '11.5px', color: '#475569' }}>
            <strong>Dominant Factor:</strong> {categories[0]?.label} accounts for <strong>{categories[0]?.percentage_share}%</strong> of daily revenue leakage.
          </div>
        </div>
      </div>

      {/* ── SECTION 4: TOP LOSS MACHINES (Ranked Horizontal Bar Visualization) ── */}
      <div style={{ margin: '0 24px 24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Top Financial Loss Looms
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Ranked strictly by <strong>commercial revenue exposure (₹)</strong>, not raw minutes alone
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Top 10 High-Impact Looms
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topLooms.map((l, i) => {
            const maxExposure = topLooms[0]?.rupee_exposure || 1;
            const barWidth = Math.max(8, Math.round((l.rupee_exposure / maxExposure) * 100));
            const loomBarColors = ['#DC2626', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1'];

            return (
              <div
                key={l.loom_id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 120px 1fr 140px 90px',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <button
                    onClick={() => onSelectLoom?.(l.loom_id)}
                    style={{ background: 'transparent', border: 'none', color: '#0F172A', fontWeight: 800, fontSize: '13px', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    Loom {l.loom_no}
                  </button>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>{l.loom_type}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.style_code}>
                    {l.style_code.split('/')[0]}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>{l.dominant_category}</div>
                </div>

                {/* Horizontal Bar */}
                <div style={{ position: 'relative', height: 16, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    background: loomBarColors[i] || '#CBD5E1',
                    borderRadius: 4,
                  }} />
                  <span style={{ position: 'absolute', right: 8, top: 1, fontSize: '10px', fontWeight: 700, color: '#0F172A' }}>
                    {l.lost_meters} m lost ({l.share_of_total_loss_pct}%)
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                    ₹{Math.round(l.rupee_exposure).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    {l.downtime_min} min ({l.stop_count} stops)
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => onNavigateSubmodule?.('root-cause', { loomId: l.loom_id })}
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
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 5 & 6: SHIFT IMPACT & RECOVERY OPPORTUNITY ── */}
      <div style={{ margin: '0 24px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* SHIFT IMPACT */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Shift-wise Financial Loss
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Comparing Shift 1 (Day), Shift 2 (Evening), and Shift 3 (Night)
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {shifts.map((s) => (
              <div
                key={s.shift_code}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 6,
                  padding: '14px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  {s.shift_name}
                </div>
                {s.is_worst_shift && (
                  <span style={{ fontSize: '9px', fontWeight: 800, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '1px 6px', borderRadius: 3, textTransform: 'uppercase', display: 'inline-block', marginTop: 4 }}>
                    Worst Loss Shift
                  </span>
                )}
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '8px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
                  ₹{Math.round(s.rupee_exposure).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {Math.round(s.lost_meters)} m lost · {s.stop_count} stops
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: RECOVERY OPPORTUNITY LEDGER */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
              Three-Tier Recovery Ledger
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginBottom: 12 }}>
              Distinguishing actual loss from potential recovery
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#F8FAFC', borderRadius: 5, fontSize: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#475569' }}>1. Confirmed Daily Loss</span>
                <strong style={{ color: '#0F172A' }}>₹{Math.round(recovery.confirmed_loss_rupees).toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#F8FAFC', borderRadius: 5, fontSize: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#475569' }}>2. Estimated Financial Exposure</span>
                <strong style={{ color: '#0F172A' }}>₹{Math.round(summary.total_rupee_exposure).toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 5, fontSize: '12px' }}>
                <span style={{ color: '#047857', fontWeight: 700 }}>3. Potential Recovery (Top 3 Looms)</span>
                <strong style={{ color: '#047857', fontSize: '13px' }}>₹{Math.round(recovery.potential_recovery_rupees).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => handleAddToActionPlan(`Mitigate Top 3 Outlier Looms (${recovery.target_focus})`)}
              style={{
                background: '#0F172A',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              + Target Recovery Plan
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 7 & 8: MULTI-PERIOD TREND & MANAGEMENT PRIORITIES ── */}
      <div style={{ margin: '0 24px 24px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* LOSS TREND (Today, 7D, 30D, 90D) */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Loss Trajectory
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Historical average comparison
              </div>
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              color: trend.direction === 'IMPROVING' ? '#047857' : '#B91C1C',
              background: trend.direction === 'IMPROVING' ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${trend.direction === 'IMPROVING' ? '#A7F3D0' : '#FECACA'}`,
            }}>
              {trend.direction}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>Today's Loss</span>
              <strong style={{ fontVariantNumeric: 'tabular-nums', color: '#0F172A' }}>₹{Math.round(trend.TODAY).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>7-Day Daily Avg</span>
              <strong style={{ fontVariantNumeric: 'tabular-nums', color: '#0F172A' }}>₹{Math.round(trend['7D_DAILY_AVG']).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>30-Day Daily Avg</span>
              <strong style={{ fontVariantNumeric: 'tabular-nums', color: '#0F172A' }}>₹{Math.round(trend['30D_DAILY_AVG']).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0' }}>
              <span style={{ color: '#64748B' }}>90-Day Daily Avg</span>
              <strong style={{ fontVariantNumeric: 'tabular-nums', color: '#0F172A' }}>₹{Math.round(trend['90D_DAILY_AVG']).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* SECTION 8: WHAT SHOULD MANAGEMENT FOCUS ON? (Top 3 Financial Priorities) */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              What Should Management Focus On?
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Authoritative priorities determined by financial concentration
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {priorities.map((p) => (
              <div
                key={p.rank}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 6,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#0F172A', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: 3 }}>
                      #{p.rank}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                      {p.category} ({p.share_pct}%)
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#475569', marginTop: 3 }}>
                    {p.priority_rationale}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToActionPlan(`Focus on ${p.category} Downtime Reduction`)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: 4,
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#0F172A',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  + Action Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contextual Evidence Slide-Out Drawer ("Why is this costing us?") ── */}
      {isWhyDrawerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '460px',
          background: '#FFFFFF',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #E2E8F0',
        }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                Financial Exposure Interpretation
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Calculated breakdown cost concentration
              </div>
            </div>
            <button
              onClick={() => setIsWhyDrawerOpen(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Executive Financial Finding
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: 4, lineHeight: 1.5 }}>
                {data.executive_verdict}
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>
                Key Loss Drivers
              </div>
              <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                • Top Loss Category: <strong>{categories[0]?.label} (₹{Math.round(categories[0]?.rupee_exposure || 0).toLocaleString()})</strong><br />
                • Most Affected Shift: <strong>{summary.worst_shift} (₹{Math.round(summary.worst_shift_exposure).toLocaleString()})</strong><br />
                • Lost Physical Output: <strong>{Math.round(summary.total_lost_meters)} meters</strong>
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F0FDF4', borderRadius: 6, border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', marginBottom: 4 }}>
                Available Recovery Potential
              </div>
              <div style={{ fontSize: '12px', color: '#15803D' }}>
                Targeting preventative maintenance on the top 3 outlier looms ({topLooms.slice(0, 3).map((l) => l.loom_no).join(', ')}) recovers an estimated <strong>₹{Math.round(recovery.potential_recovery_rupees).toLocaleString()}</strong> in commercial output.
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <button
              onClick={() => {
                handleAddToActionPlan('Executive Loss Recovery Initiative');
                setIsWhyDrawerOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px',
                background: '#2563EB',
                border: 'none',
                borderRadius: 6,
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              + Create Recovery Action Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
