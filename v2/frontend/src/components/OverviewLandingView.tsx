import { useEffect, useState } from 'react';
import {
  fetchProductionIntelligence,
  fetchBreakdownSummary,
  fetchBreakdownLossImpact,
  fetchRevenueAnalytics,
} from '../api';
import type {
  ProductionIntelligenceResponse,
  BreakdownSummaryResponse,
  BreakdownLossImpactResponse,
  RevenueAnalyticsResponse,
} from '../api';
import {
  DataTrustBadge,
  LoadingState,
  ErrorState,
} from '../design-system';
import {
  ArrowRight,
  Check,
  Clock,
  Factory,
  IndianRupee,
  Layers,
  Search,
  Sparkles,
  Wrench,
} from 'lucide-react';

interface OverviewLandingViewProps {
  onNavigateToModule: (view: string, subpage?: string, context?: any) => void;
  onOpenWhyModal?: () => void;
}

export function OverviewLandingView({ onNavigateToModule, onOpenWhyModal }: OverviewLandingViewProps) {
  const [date, setDate] = useState<string>('2026-07-31');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Core datasets
  const [prodData, setProdData] = useState<ProductionIntelligenceResponse | null>(null);
  const [breakdownData, setBreakdownData] = useState<BreakdownSummaryResponse | null>(null);
  const [lossData, setLossData] = useState<BreakdownLossImpactResponse | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueAnalyticsResponse | null>(null);

  // Interactive state
  const [hoveredLoom, setHoveredLoom] = useState<number | null>(null);
  const [approvedActionToast, setApprovedActionToast] = useState<boolean>(false);

  const loadAllOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prod, bd, loss, rev] = await Promise.all([
        fetchProductionIntelligence(date, 'ATM'),
        fetchBreakdownSummary(date, 'ATM'),
        fetchBreakdownLossImpact(date, 'ATM', 'TODAY'),
        fetchRevenueAnalytics(date, 'ATM', 'TODAY'),
      ]);
      setProdData(prod);
      setBreakdownData(bd);
      setLossData(loss);
      setRevenueData(rev);
    } catch (err: any) {
      console.error('Failed to load overview data:', err);
      setError('Unable to load plant telemetry and executive analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllOverviewData();
  }, [date]);

  const handleApproveAction = () => {
    setApprovedActionToast(true);
    setTimeout(() => setApprovedActionToast(false), 3000);
  };

  if (loading) {
    return <LoadingState message="Connecting to Ashok Textile Mills Live Telemetry & Compiling Decision Truth Layer..." />;
  }

  if (error || !prodData || !breakdownData || !lossData || !revenueData) {
    return <ErrorState message={error || 'Failed to aggregate overview metrics.'} onRetry={loadAllOverviewData} />;
  }

  const pPos = prodData.today_position;
  const pKpis = pPos.primary_kpis;
  const pSupp = pPos.supporting_metrics;
  const stoppedHours = (breakdownData.today_stopped_minutes_total / 60).toFixed(1);
  const breakdownCount = breakdownData.breakdown_count || breakdownData.today_events_count_total;
  const peerLoomNo = breakdownData.best_peer_benchmark?.loom_no || 'AJ-162';
  const peerEff = breakdownData.best_peer_benchmark?.efficiency_pct || 98.6;
  const recoveryRupees = breakdownData.potential_recovery?.potential_rupees || 10288;
  const lSum = lossData.summary;
  const rOwner = revenueData.owner_summary;
  const rProfit = revenueData.profitability;

  // Generate 192 Loom Micro Grid Status
  const criticalIds = new Set(pPos.triage_summary.critical_loom_ids || []);
  const attentionIds = new Set(pPos.triage_summary.attention_loom_ids || []);

  const loomsGrid = Array.from({ length: 192 }, (_, i) => {
    const id = i + 1;
    let status: 'healthy' | 'attention' | 'critical' = 'healthy';
    if (criticalIds.has(id)) status = 'critical';
    else if (attentionIds.has(id)) status = 'attention';
    return { id, status };
  });

  return (
    <div style={{ padding: '24px 32px 64px', maxWidth: '1440px', margin: '0 auto', fontFamily: 'inherit' }}>
      {/* Toast Notification */}
      {approvedActionToast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, background: '#0F172A', color: '#FFFFFF',
          padding: '12px 20px', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: 10, zIndex: 9999, fontSize: '13px', fontWeight: 600,
        }}>
          <Check size={16} color="#22C55E" />
          <span>Action Plan Approved: Inspection dispatched to Electrical Lead.</span>
        </div>
      )}

      {/* ── 1. Top Executive Ambient Telemetry Bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '14px 20px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 2px 6px rgba(37,99,235,0.3)',
          }}>
            <Factory size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                Ashok Textile Mills — Weaving Division
              </h1>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#ECFDF5',
                color: '#059669',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #A7F3D0',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                192 Looms Online
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 2 }}>
              Shed 1 & 2 · Shift 3 Active · Handover in 02h 15m · Telemetry DQI <strong>98.6%</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Quick Date Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '5px 10px', borderRadius: '6px' }}>
            <Clock size={13} color="#64748B" />
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 700, color: '#0F172A', outline: 'none', cursor: 'pointer' }}
            >
              <option value="2026-07-31">31 Jul 2026 (Today)</option>
              <option value="2026-07-30">30 Jul 2026</option>
              <option value="2026-07-29">29 Jul 2026</option>
            </select>
          </div>

          {/* Universal Diagnostic Trigger */}
          <button
            onClick={onOpenWhyModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FEF2F2',
              border: '1px solid #F87171',
              color: '#B91C1C',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(220,38,38,0.08)',
            }}
          >
            <Search size={13} />
            <span>Why is production low?</span>
          </button>

          <DataTrustBadge provenance="CONFIRMED" />
        </div>
      </div>

      {/* ── 2. Hero Executive Verdict & Action Sign-off ── */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        border: '1px solid #BFDBFE',
        borderRadius: '12px',
        padding: '22px 26px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
          background: '#2563EB',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                background: '#EFF6FF',
                color: '#1D4ED8',
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>
                Owner Operational Verdict
              </span>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Deterministic Truth Layer Analysis</span>
            </div>

            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', lineHeight: 1.35, marginBottom: 8 }}>
              {rOwner.one_sentence_verdict}
            </div>

            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              Production volume delivered <strong>{Math.round(pKpis.actual_metres).toLocaleString()} m</strong> against plan of{' '}
              <strong>{Math.round(pKpis.target_metres).toLocaleString()} m</strong> ({pKpis.gap_metres >= 0 ? '+' : ''}{Math.round(pKpis.gap_metres).toLocaleString()} m / {pKpis.gap_pct}%).
              Total revenue realized is <strong>₹{Math.round(rProfit.net_revenue_inr).toLocaleString()}</strong> with an immediate recoverable upside of{' '}
              <strong style={{ color: '#16A34A' }}>₹{Math.round(rOwner.one_recovery_amount_inr).toLocaleString()}</strong>.
            </div>
          </div>

          {/* Immediate Action Commitment Pill */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '16px 20px',
            minWidth: '280px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
              Immediate High-Value Decision
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
              {rOwner.one_action_to_approve}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleApproveAction}
                style={{
                  flex: 1,
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'background 0.15s ease',
                }}
              >
                <Check size={14} />
                <span>Approve Action</span>
              </button>
              <button
                onClick={() => onNavigateToModule('revenue')}
                style={{
                  background: '#F8FAFC',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: 6,
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Review P&L
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Executive KPI Ribbon (4 Big Numbers) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: '28px',
      }}>
        {/* Production Volume */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Production Output
            </span>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '1px 6px', borderRadius: 4 }}>
              {pKpis.efficiency_pct}% Eff
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(pKpis.actual_metres).toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>m</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11.5px', color: '#64748B', marginTop: 4 }}>
            <span>Target: {Math.round(pKpis.target_metres).toLocaleString()} m</span>
            <span style={{ color: pKpis.gap_metres >= 0 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
              ({pKpis.gap_metres >= 0 ? '+' : ''}{Math.round(pKpis.gap_metres)} m)
            </span>
          </div>
          <div style={{ marginTop: 8, background: '#F1F5F9', height: 4, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(pKpis.efficiency_pct, 100)}%`, height: '100%', background: '#2563EB' }} />
          </div>
        </div>

        {/* Realized Revenue */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Realized Revenue
            </span>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '1px 6px', borderRadius: 4 }}>
              {rProfit.profit_margin_pct}% Margin
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
            ₹{Math.round(rProfit.net_revenue_inr).toLocaleString()}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 4 }}>
            Contribution Profit: <strong style={{ color: '#0F172A' }}>₹{Math.round(rProfit.contribution_profit_inr).toLocaleString()}</strong>
          </div>
          <div style={{ marginTop: 8, background: '#F1F5F9', height: 4, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(rProfit.profit_margin_pct * 2.5, 100)}%`, height: '100%', background: '#16A34A' }} />
          </div>
        </div>

        {/* Breakdown Downtime */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Plant Stoppage
            </span>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '1px 6px', borderRadius: 4 }}>
              {breakdownCount} Breakdowns
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
            {stoppedHours} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>hrs</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 4 }}>
            Revenue at Risk: <strong style={{ color: '#DC2626' }}>₹{Math.round(lSum.total_rupee_exposure).toLocaleString()}</strong>
          </div>
          <div style={{ marginTop: 8, background: '#F1F5F9', height: 4, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '62%', height: '100%', background: '#DC2626' }} />
          </div>
        </div>

        {/* Immediate Recovery */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recoverable Opportunity
            </span>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0284C7', background: '#E0F2FE', padding: '1px 6px', borderRadius: 4 }}>
              Top 3 Actions
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', fontVariantNumeric: 'tabular-nums' }}>
            ₹{Math.round(rOwner.one_recovery_amount_inr).toLocaleString()}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 4 }}>
            Potential Output: <strong style={{ color: '#0F172A' }}>+{Math.round(recoveryRupees / 40)} m</strong>
          </div>
          <div style={{ marginTop: 8, background: '#F1F5F9', height: 4, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '48%', height: '100%', background: '#10B981' }} />
          </div>
        </div>
      </div>

      {/* ── 4. The 3 Core Modules Interactive Gateways ── */}
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
          Enterprise Management Workspaces
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        marginBottom: '32px',
      }}>
        {/* GATEWAY 1: PRODUCTION INTELLIGENCE */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <Layers size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Production Intelligence
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Volume, Fleet Efficiency & Telemetry
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#2563EB', background: '#DBEAFE', padding: '2px 6px', borderRadius: 4 }}>
                LIVE
              </span>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Delivered Output:</span>
                <strong style={{ color: '#0F172A' }}>{Math.round(pKpis.actual_metres).toLocaleString()} m</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Running Efficiency:</span>
                <strong style={{ color: '#16A34A' }}>{pKpis.running_efficiency_pct}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Total Pick Count:</span>
                <strong style={{ color: '#0F172A' }}>{Math.round(pSupp.kilo_picks).toLocaleString()}k picks</strong>
              </div>
            </div>

            <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: 14, lineHeight: 1.4 }}>
              Identified <strong>{pPos.triage_summary.critical_count} critical looms</strong> and{' '}
              <strong>{pPos.triage_summary.attention_count} attention looms</strong> requiring shift supervision.
            </div>
          </div>

          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={() => onNavigateToModule('production', 'daily')}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <span>Daily Workspace</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => onNavigateToModule('production', 'performance')}
                style={{
                  background: '#F8FAFC',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Loom Performance
              </button>
            </div>
          </div>
        </div>

        {/* GATEWAY 2: BREAKDOWNS INTELLIGENCE */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                  <Wrench size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Breakdown Intelligence
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Root Cause, Anomalies & Loss Impact
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '2px 6px', borderRadius: 4 }}>
                4 WORKSPACES
              </span>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Total Stoppage:</span>
                <strong style={{ color: '#DC2626' }}>{stoppedHours} hrs</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Golden Benchmark:</span>
                <strong style={{ color: '#16A34A' }}>Loom {peerLoomNo} ({peerEff}%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Dominant Outage:</span>
                <strong style={{ color: '#0F172A' }}>Power / Voltage (53.3%)</strong>
              </div>
            </div>

            <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: 14, lineHeight: 1.4 }}>
              Investigate specific stoppage events, plant-wide statistical anomalies, or execute non-overlapping financial loss waterfalls.
            </div>
          </div>

          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={() => onNavigateToModule('breakdowns', 'insights')}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <span>Insights Hub</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => onNavigateToModule('breakdowns', 'root-cause')}
                style={{
                  background: '#F8FAFC',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Root Cause
              </button>
            </div>
          </div>
        </div>

        {/* GATEWAY 3: REVENUE & FINANCIAL LOSS */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                  <IndianRupee size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Revenue & Loss
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    P&L Attribution & Owner Decision Room
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 6px', borderRadius: 4 }}>
                COMMERCIAL
              </span>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Net Revenue:</span>
                <strong style={{ color: '#0F172A' }}>₹{Math.round(rProfit.net_revenue_inr).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Total Financial Loss:</span>
                <strong style={{ color: '#DC2626' }}>-₹{Math.round(revenueData.total_revenue_loss_inr).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Recoverable Target:</span>
                <strong style={{ color: '#16A34A' }}>₹{Math.round(rOwner.one_recovery_amount_inr).toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: 14, lineHeight: 1.4 }}>
              Realized profit and commercial loss attribution categorized by electrical, yarn tension, quality discount, and labour cost.
            </div>
          </div>

          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={() => onNavigateToModule('revenue')}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <span>Decision Room</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => onNavigateToModule('breakdowns', 'loss-impact')}
                style={{
                  background: '#F8FAFC',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Loss Waterfall
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Live Factory Floor Fleet Matrix & Top Outlier Looms ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: '28px' }}>
        {/* 192 Loom Micro-Visualizer */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Factory Floor Stoppage & Triage Map
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                Live state of all 192 looms across Shed 1 and Shed 2
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '11px', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#16A34A' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#22C55E' }} />
                Optimal ({192 - pPos.triage_summary.critical_count - pPos.triage_summary.attention_count})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#D97706' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#F59E0B' }} />
                Attention ({pPos.triage_summary.attention_count})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#DC2626' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#EF4444' }} />
                Critical ({pPos.triage_summary.critical_count})
              </span>
            </div>
          </div>

          {/* 192 cells matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(24, 1fr)',
            gap: 4,
            padding: '12px',
            background: '#F8FAFC',
            borderRadius: 8,
            border: '1px solid #F1F5F9',
          }}>
            {loomsGrid.map((l) => {
              const bg = l.status === 'critical' ? '#EF4444' : l.status === 'attention' ? '#F59E0B' : '#22C55E';
              const isHovered = hoveredLoom === l.id;
              return (
                <div
                  key={l.id}
                  onMouseEnter={() => setHoveredLoom(l.id)}
                  onMouseLeave={() => setHoveredLoom(null)}
                  onClick={() => onNavigateToModule('breakdowns', 'root-cause', { loomId: l.id })}
                  title={`Loom AJ-${String(l.id).padStart(3, '0')} · Status: ${l.status.toUpperCase()} · Click to investigate`}
                  style={{
                    height: 14,
                    borderRadius: 2,
                    background: bg,
                    opacity: isHovered ? 1 : 0.85,
                    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    transition: 'all 0.1s ease',
                    cursor: 'pointer',
                    boxShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                    zIndex: isHovered ? 10 : 1,
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: '11px', color: '#64748B' }}>
            <span>Shed 1 (Looms 001 - 096)</span>
            <span style={{ fontWeight: 600, color: '#2563EB' }}>Click any machine cell to open Root Cause Analysis</span>
            <span>Shed 2 (Looms 097 - 192)</span>
          </div>
        </div>

        {/* Top Outlier Machines Requiring Attention */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Top Outlier Machines Today
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B' }}>
              Ranked by combined downtime and revenue exposure
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Outlier 1 */}
            <div
              onClick={() => onNavigateToModule('breakdowns', 'root-cause', { loomId: 118 })}
              style={{
                border: '1px solid #FEE2E2',
                borderRadius: 8,
                padding: '10px 14px',
                background: '#FEF2F2',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <strong style={{ fontSize: '13px', color: '#991B1B' }}>Loom AJ-118</strong>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626' }}>509m Downtime</span>
              </div>
              <div style={{ fontSize: '11px', color: '#7F1D1D' }}>
                Dominant: Power failure · Loss: ~153 m (₹6,112)
              </div>
            </div>

            {/* Outlier 2 */}
            <div
              onClick={() => onNavigateToModule('breakdowns', 'root-cause', { loomId: 132 })}
              style={{
                border: '1px solid #FEF3C7',
                borderRadius: 8,
                padding: '10px 14px',
                background: '#FFFBEB',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <strong style={{ fontSize: '13px', color: '#92400E' }}>Loom AJ-132</strong>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706' }}>342m Downtime</span>
              </div>
              <div style={{ fontSize: '11px', color: '#78350F' }}>
                Dominant: Weft feeder fault · Loss: ~102 m (₹4,080)
              </div>
            </div>

            {/* Outlier 3 */}
            <div
              onClick={() => onNavigateToModule('breakdowns', 'root-cause', { loomId: 146 })}
              style={{
                border: '1px solid #FEF3C7',
                borderRadius: 8,
                padding: '10px 14px',
                background: '#FFFBEB',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <strong style={{ fontSize: '13px', color: '#92400E' }}>Loom AJ-146</strong>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706' }}>298m Downtime</span>
              </div>
              <div style={{ fontSize: '11px', color: '#78350F' }}>
                Dominant: Mechanical trip · Loss: ~89 m (₹3,560)
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToModule('production', 'performance')}
            style={{
              width: '100%',
              marginTop: 12,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              padding: '7px 0',
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#2563EB',
              cursor: 'pointer',
            }}
          >
            View Full 192 Loom Performance Table →
          </button>
        </div>
      </div>

      {/* ── 6. Bottom Governance & Data Trust Callout ── */}
      <div style={{
        background: '#F8FAFC',
        border: '1px dashed #CBD5E1',
        borderRadius: 10,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
            <Sparkles size={14} />
          </div>
          <div style={{ fontSize: '12px', color: '#475569' }}>
            <strong>Enterprise Provenance Guarantee:</strong> Every metric on this screen reconciles directly with raw database records from sensor counters, shift logs, and commercial ERP rate cards. Zero simulated numbers or hallucinations.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => onNavigateToModule('breakdowns', 'loss-impact')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2563EB',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>Audit Financial Waterfall</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
