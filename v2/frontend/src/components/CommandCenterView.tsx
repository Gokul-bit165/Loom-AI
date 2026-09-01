import { useEffect, useState } from 'react';
import { fetchCommandCenterToday, fetchSourceFreshness, fetchPersistentAlerts } from '../api';
import type { PersistentAlertItem } from '../api';
import {
  PageHeader,
  KpiCard,
  DataTrustBadge,
  StatusBadge,
  LoadingState,
  ErrorState,
  TOKENS,
} from '../design-system';
import {
  Clock,
  Sparkles,
  ChevronRight,
  X,
  AlertTriangle,
  Check,
  Bell,
} from 'lucide-react';
import { ContextualAiDrawer } from './ContextualAiDrawer';
import type { ContextualAiPayload } from './ContextualAiDrawer';

interface CommandCenterViewProps {
  onNavigateToModule: (view: string, loomId?: number) => void;
}

export function CommandCenterView({ onNavigateToModule }: CommandCenterViewProps) {
  const [date, setDate] = useState<string>('2026-07-31');
  const [unit] = useState<string>('ATM');
  const [viewMode, setViewMode] = useState<'OWNER' | 'OPERATIONS'>('OWNER');
  const [data, setData] = useState<any | null>(null);
  const [_freshness, setFreshness] = useState<any | null>(null);
  const [alerts, setAlerts] = useState<PersistentAlertItem[]>([]);
  const [showAlertsDrawer, setShowAlertsDrawer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Contextual AI Drawer
  const [drawerContext, setDrawerContext] = useState<ContextualAiPayload | null>(null);
  const handleOpenDrawer = (payload: ContextualAiPayload) => setDrawerContext(payload);

  // Quick Action Assignment Modal
  const [selectedActionToAssign, setSelectedActionToAssign] = useState<any | null>(null);
  const [assigneeName, setAssigneeName] = useState<string>('M. Murugan (Electrician)');
  const [assignSuccess, setAssignSuccess] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ccData, freshData, alertData] = await Promise.all([
        fetchCommandCenterToday(unit, date),
        fetchSourceFreshness(date, unit),
        fetchPersistentAlerts(date, unit),
      ]);
      setData(ccData);
      setFreshness(freshData);
      setAlerts(alertData);
    } catch (err: any) {
      console.error('Failed to load command center data:', err);
      setError('Unable to load plant telemetry and executive decisions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [date, unit]);

  if (loading) return <LoadingState message="Loading Owner Decision Screen & Truth Layer..." />;
  if (error || !data) return <ErrorState message={error || 'No plant data available.'} onRetry={loadData} />;

  // Honest Empty / Unavailable State (DATA TRUST)
  if (!data.data_available) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
        <PageHeader
          title="Executive Decision Console"
          subtitle="Owner's daily operational decision screen."
          unit="Ashok Textile Mills — Shed 1 & 2 (192 Looms)"
          date={date}
          actions={
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              style={{ fontSize: '12px', padding: '4px 8px' }}
            />
          }
        />
        <div
          style={{
            background: '#FFFFFF',
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.md,
            padding: '40px 24px',
            textAlign: 'center',
          }}
        >
          <Clock size={36} color="#9CA3AF" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: TOKENS.colors.text.primary }}>
            Data Unavailable for {date}
          </h3>
          <p style={{ fontSize: '13px', color: TOKENS.colors.text.muted, margin: '0 0 16px 0' }}>
            No shift production logs or stoppage telemetry have been ingested for this calendar date.
          </p>
          <button onClick={() => setDate('2026-07-31')} className="btn-primary" style={{ margin: '0 auto' }}>
            Switch to 31-Jul-2026 (Live Data)
          </button>
        </div>
      </div>
    );
  }

  const c = data.core_numbers;
  const v = data.verdict;
  const why = data.why;

  const handleAssignSubmit = () => {
    setAssignSuccess(true);
    setTimeout(() => {
      setAssignSuccess(false);
      setSelectedActionToAssign(null);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      {/* ── Top Header with Date Selection, Owner/Ops Toggle, and Freshness ─ */}
      <PageHeader
        title={viewMode === 'OWNER' ? 'Owner Decision Console' : 'Plant Operations Monitor'}
        subtitle={
          viewMode === 'OWNER'
            ? 'Ashok Textile Mills · 30-Second Morning Operations Review & Business Impact.'
            : 'Shed 1 & 2 Technical Telemetry, Shift Handover, and Stoppage Breakdown.'
        }
        unit="ATM Main Shed (192 Looms)"
        date={date}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Owner / Operations Mode Switcher */}
            <div
              style={{
                display: 'flex',
                background: TOKENS.colors.surface.cardAlt,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: '6px',
                padding: '2px',
              }}
            >
              <button
                onClick={() => setViewMode('OWNER')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: viewMode === 'OWNER' ? 700 : 500,
                  background: viewMode === 'OWNER' ? TOKENS.colors.brand[600] : 'transparent',
                  color: viewMode === 'OWNER' ? '#FFFFFF' : TOKENS.colors.text.secondary,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Owner View
              </button>

              <button
                onClick={() => setViewMode('OPERATIONS')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: viewMode === 'OPERATIONS' ? 700 : 500,
                  background: viewMode === 'OPERATIONS' ? TOKENS.colors.brand[600] : 'transparent',
                  color: viewMode === 'OPERATIONS' ? '#FFFFFF' : TOKENS.colors.text.secondary,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Operations View
              </button>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setShowAlertsDrawer(!showAlertsDrawer)}
              style={{
                position: 'relative',
                padding: '6px',
                background: TOKENS.colors.surface.card,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                color: TOKENS.colors.text.secondary,
              }}
              title="Persistent Mill Alerts"
            >
              <Bell size={16} />
              {alerts.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {alerts.length}
                </span>
              )}
            </button>

            {/* Date Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                style={{ fontSize: '11.5px', padding: '3px 8px', width: '135px' }}
              />
            </div>
          </div>
        }
      />

      {/* ── TODAY'S STATUS: 4 Essential Metrics ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: TOKENS.spacing[3] }}>
        <KpiCard
          label="Today's Output"
          value={`${c.production_metres.actual.toLocaleString()} m`}
          target={`Target: ${c.production_metres.target.toLocaleString()} m`}
          variance={`${c.production_metres.variance_pct > 0 ? '+' : ''}${c.production_metres.variance_pct}%`}
          trendDirection={c.production_metres.variance_pct >= 0 ? 'up' : 'down'}
          status={c.production_metres.status}
          provenance={c.production_metres.provenance}
          driver={`${c.production_metres.variance_metres.toLocaleString()} m deficit`}
          onClick={() => onNavigateToModule('production')}
        />

        <KpiCard
          label="Loom Efficiency"
          value={`${c.efficiency_pct.actual}%`}
          target="Target: 90.0%"
          variance={`${c.efficiency_pct.variance_pp > 0 ? '+' : ''}${c.efficiency_pct.variance_pp} pp`}
          trendDirection={c.efficiency_pct.variance_pp >= 0 ? 'up' : 'down'}
          status={c.efficiency_pct.status}
          provenance={c.efficiency_pct.provenance}
          driver="Schedule-time basis EFF%"
          onClick={() => onNavigateToModule('production')}
        />

        <KpiCard
          label="Today's Revenue"
          value={`₹${c.actual_revenue_rs.value.toLocaleString()}`}
          target={`Target: ₹${c.actual_revenue_rs.target_value.toLocaleString()}`}
          status="HEALTHY"
          provenance="ESTIMATED"
          driver="Rate basis: ₹40.00 / metre"
          onClick={() => onNavigateToModule('revenue')}
        />

        <KpiCard
          label="Loss / Exposure"
          value={`₹${c.revenue_exposure_rs.value.toLocaleString()}`}
          target="Threshold: < ₹15,000"
          status={c.revenue_exposure_rs.status}
          provenance={c.revenue_exposure_rs.provenance}
          driver="Breakdown + speed drift loss"
          onClick={() => onNavigateToModule('revenue')}
        />
      </div>

      {/* ── TODAY'S BIGGEST ISSUE: Dominant Business Issue Banner ───────── */}
      <div
        style={{
          background: v.severity === 'CRITICAL' ? '#FEF2F2' : TOKENS.colors.surface.card,
          border: `1px solid ${v.severity === 'CRITICAL' ? '#FECACA' : TOKENS.colors.surface.border}`,
          borderRadius: TOKENS.radius.md,
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: v.severity === 'CRITICAL' ? '#DC2626' : TOKENS.colors.brand[600],
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: v.severity === 'CRITICAL' ? '#DC2626' : TOKENS.colors.brand[700], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                TODAY'S DOMINANT ISSUE
              </span>
              <DataTrustBadge provenance="CALCULATED" compact />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
              {v.headline}
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            handleOpenDrawer({
              title: `Dominant Stoppage Issue: Loom ${v.dominant_problem_loom}`,
              category: 'CRITICAL_BREAKDOWN',
              loomNo: v.dominant_problem_loom,
              issueDescription: v.headline,
              impactInr: v.revenue_exposure_rs,
              probableCause: 'Voltage fluctuations and inverter thermal trip on main drive.',
              recommendedAction: 'Direct shift electrician to inspect sub-panel voltage stability.',
              confidence: 'HIGH',
              sourceIds: ['prod_log_20260731', 'stopevent_20260731'],
            })
          }
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            background: '#FFFFFF',
            border: `1px solid ${v.severity === 'CRITICAL' ? '#F87171' : TOKENS.colors.surface.border}`,
            borderRadius: '4px',
            color: v.severity === 'CRITICAL' ? '#B91C1C' : TOKENS.colors.brand[700],
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Explain & Evidence
        </button>
      </div>

      {/* ── ACT NOW: Top 3 Prioritized Management Actions ──────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Act Now (Top 3 Priority Actions)
            </h3>
            <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
              Prioritized by financial exposure. 1-click assigns directly to shift supervisor.
            </div>
          </div>
          <button
            onClick={() => onNavigateToModule('agents')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: 600,
              color: TOKENS.colors.brand[600],
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All in Action Manager</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: TOKENS.spacing[3] }}>
          {data.act_now.map((act: any) => (
            <div
              key={act.action_id}
              style={{
                background: TOKENS.colors.surface.card,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '14px 16px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusBadge status={act.priority === 'P1' ? 'CRITICAL' : 'WARNING'} label={act.priority} />
                    <strong style={{ fontSize: '13px', color: TOKENS.colors.brand[600] }}>Loom {act.loom_no}</strong>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono }}>
                    ₹{act.impact_inr.toLocaleString()}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 600, color: TOKENS.colors.text.primary, marginBottom: '6px' }}>
                  {act.issue}
                </div>

                <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, marginBottom: '10px' }}>
                  <strong>Action: </strong>
                  {act.action}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: `1px solid ${TOKENS.colors.surface.border}` }}>
                <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                  Assignee: <strong>{act.assignee}</strong>
                </span>

                <button
                  onClick={() => setSelectedActionToAssign(act)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    background: TOKENS.colors.brand[600],
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Assign Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2-COLUMN SECTION: WHY (ROOT CAUSES) & AI FINDINGS + NEXT RISK ─ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: TOKENS.spacing[4] }}>
        {/* WHY: Financial Loss Contribution */}
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
              Why: Revenue Loss Contribution
            </h4>
            <DataTrustBadge provenance="CALCULATED" compact />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {why.causes.map((c: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ color: TOKENS.colors.text.primary, fontWeight: 500 }}>{c.category}</span>
                  <span style={{ fontFamily: TOKENS.typography.fontMono, color: TOKENS.colors.status.critical.text, fontWeight: 700 }}>
                    ₹{c.lost_rs.toLocaleString()} ({c.pct}%)
                  </span>
                </div>
                <div style={{ height: '6px', background: TOKENS.colors.surface.toolbar, borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${c.pct}%`,
                      background: i === 0 ? '#DC2626' : i === 1 ? '#F59E0B' : '#3B82F6',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI FINDINGS & NEXT FORWARD RISK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Top AI Finding */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Sparkles size={14} color={TOKENS.colors.brand[600]} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.brand[700], textTransform: 'uppercase' }}>
                AI WATCHTOWER DISCOVERY
              </span>
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
              {data.ai_findings[0]?.title}
            </div>
            <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary, marginTop: '4px' }}>
              {data.ai_findings[0]?.detail}
            </div>
          </div>

          {/* Next Risk */}
          <div
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                <Clock size={14} />
                <span>NEXT FORWARD RISK (24H)</span>
              </div>
              <DataTrustBadge provenance="PREDICTED" compact />
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#92400E' }}>
              {data.next_risk.title} ({data.next_risk.probability_pct}% Probability)
            </div>
            <div style={{ fontSize: '12px', color: '#78350F', marginTop: '4px' }}>
              {data.next_risk.detail}
            </div>
          </div>
        </div>
      </div>

      {/* ── LAST ACTION RESULT: Closed-Loop Verification (Before vs After) ─ */}
      <div
        style={{
          background: TOKENS.colors.surface.card,
          border: `1px solid ${TOKENS.colors.status.healthy.border}`,
          borderRadius: TOKENS.radius.md,
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: TOKENS.colors.status.healthy.bg,
              color: TOKENS.colors.status.healthy.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={16} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: TOKENS.colors.status.healthy.text, textTransform: 'uppercase' }}>
                LATEST VERIFIED INTERVENTION
              </span>
              <DataTrustBadge provenance="CALCULATED" compact />
            </div>
            <div style={{ fontSize: '13px', color: TOKENS.colors.text.primary }}>
              <strong>Loom {data.last_action_result.loom_no}: </strong>
              {data.last_action_result.action} · Downtime reduced from <strong>{data.last_action_result.before_metric}</strong> to <strong>{data.last_action_result.after_metric}</strong>.
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Recovered Revenue: </span>
          <strong style={{ fontSize: '14px', color: TOKENS.colors.status.healthy.text, fontFamily: TOKENS.typography.fontMono }}>
            +₹{data.last_action_result.recovered_revenue_rs.toLocaleString()}
          </strong>
        </div>
      </div>

      {/* ── OPERATIONS VIEW TAB CONTENT (Technical Shift & Stoppages) ──── */}
      {viewMode === 'OPERATIONS' && (
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.md,
            padding: '16px 20px',
            boxShadow: TOKENS.shadows.card,
          }}
        >
          <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 12px 0', color: TOKENS.colors.text.primary }}>
            Shift Operations & Machine Level Telemetry
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {data.operations_data.shifts.map((s: any) => (
              <div key={s.shift_code} style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: TOKENS.colors.brand[600] }}>Shift {s.shift_code}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: TOKENS.colors.text.primary }}>{s.loom_efficiency_pct}% EFF</span>
                </div>
                <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                  Production: <strong>{s.metres.toLocaleString()} m</strong> · Stoppage: <strong>{s.stopped_minutes} min</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── QUICK ACTION ASSIGNMENT MODAL ──────────────────────────────── */}
      {selectedActionToAssign && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: TOKENS.radius.md,
              width: '440px',
              maxWidth: '90vw',
              padding: '24px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                Assign Floor Action: Loom {selectedActionToAssign.loom_no}
              </h3>
              <button onClick={() => setSelectedActionToAssign(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: TOKENS.colors.text.secondary, marginBottom: '14px' }}>
              {selectedActionToAssign.action}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: TOKENS.colors.text.primary, display: 'block', marginBottom: '6px' }}>
                Assign To Technician / Supervisor:
              </label>
              <select
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}`, fontSize: '13px' }}
              >
                <option value="M. Murugan (Senior Electrician)">M. Murugan (Senior Electrician)</option>
                <option value="K. Selvam (Shift Fitter)">K. Selvam (Shift Fitter)</option>
                <option value="R. Prakash (Maintenance Tech)">R. Prakash (Maintenance Tech)</option>
                <option value="S. Anand (Weaving Master)">S. Anand (Weaving Master)</option>
              </select>
            </div>

            {assignSuccess && (
              <div style={{ padding: '8px', background: TOKENS.colors.status.healthy.bg, color: TOKENS.colors.status.healthy.text, fontSize: '12.5px', borderRadius: '4px', textAlign: 'center', marginBottom: '12px' }}>
                Action assigned successfully to {assigneeName}!
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setSelectedActionToAssign(null)}
                style={{ padding: '6px 12px', fontSize: '12px', background: 'transparent', border: `1px solid ${TOKENS.colors.surface.border}`, borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                style={{ padding: '6px 16px', fontSize: '12px', fontWeight: 600, background: TOKENS.colors.brand[600], color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTEXTUAL AI DRAWER ────────────────────────────────────────── */}
      <ContextualAiDrawer
        isOpen={drawerContext !== null}
        onClose={() => setDrawerContext(null)}
        context={drawerContext}
        onAssignAction={(ctx) => {
          setSelectedActionToAssign({
            loom_no: ctx.loomNo || 'AJ-118',
            action: ctx.recommendedAction || 'Execute electrical overhaul',
          });
        }}
      />
    </div>
  );
}
