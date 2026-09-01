import { useEffect, useState } from 'react';
import { fetchCommandCenterToday } from '../api';
import type { CommandCenterData } from '../api';
import {
  PageHeader,
  KpiCard,
  DataTrustBadge,
  LoadingState,
  ErrorState,
  TOKENS,
} from '../design-system';
import {
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  X,
  Bot,
  Zap,
} from 'lucide-react';

interface CommandCenterViewProps {
  onNavigateToModule: (view: string, loomId?: number) => void;
}

export function CommandCenterView({ onNavigateToModule }: CommandCenterViewProps) {
  const [date, setDate] = useState<string>('2026-07-31');
  const [unit] = useState<string>('ATM');
  const [data, setData] = useState<CommandCenterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Trend timeframe selector
  const [trendRange, setTrendRange] = useState<'7D' | '30D' | '90D'>('7D');

  // Contextual Explanation Drawer state
  const [drawerContext, setDrawerContext] = useState<{
    title: string;
    description: string;
    why: string;
    impact: string;
    action: string;
  } | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchCommandCenterToday(unit, date)
      .then((res: CommandCenterData) => {
        setData(res);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('Failed to load command center data:', err);
        setError('Unable to load plant telemetry and executive decisions.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [date, unit]);

  if (loading) return <LoadingState message="Loading Owner Decision Screen..." />;
  if (error || !data) return <ErrorState message={error || 'No plant data available.'} onRetry={loadData} />;

  // Honest Empty / Unavailable State (DATA TRUST)
  if (!data.data_available) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
        <PageHeader
          title="Executive Decision Console"
          subtitle="Owner's daily operational decision screen."
          unit="Ashok Textile Mills — Shed 1 & 2"
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
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <Clock size={32} color="#9CA3AF" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: TOKENS.colors.text.primary }}>
            Data Unavailable for {date}
          </h3>
          <p style={{ fontSize: '13px', color: TOKENS.colors.text.muted, margin: '0 0 16px 0' }}>
            No shift production logs or stoppage telemetry have been ingested for this calendar date.
          </p>
          <button onClick={() => setDate('2026-07-31')} className="btn-primary" style={{ margin: '0 auto' }}>
            Switch to 31-Jul-2026 (Live Seed Data)
          </button>
        </div>
      </div>
    );
  }

  const c = data.core_numbers;
  const v = data.verdict;
  const why = data.why;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      {/* ── Top Header with Date Selection ─────────────────────────────── */}
      <PageHeader
        title="Owner Decision Console"
        subtitle="Ashok Textile Mills · 30-Second Morning Operations Review."
        unit="ATM Main Shed (192 Looms)"
        date={date}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              style={{ fontSize: '11.5px', padding: '3px 8px', width: '135px' }}
            />
          </div>
        }
      />

      {/* ── A. TODAY: 1-Sentence Executive Verdict ──────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #BFDBFE',
          borderLeft: '4px solid #2563EB',
          borderRadius: TOKENS.radius.md,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={18} color="#2563EB" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: TOKENS.colors.brand[700], letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              TODAY'S OPERATING VERDICT
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: TOKENS.colors.text.primary, marginTop: '2px' }}>
              {v.headline}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '5px 12px', borderRadius: '5px', textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#991B1B', fontWeight: 800, display: 'block' }}>REVENUE AT RISK</span>
            <strong style={{ fontSize: '14px', color: '#DC2626', fontFamily: TOKENS.typography.fontMono }}>
              ₹{v.revenue_exposure_rs.toLocaleString()}
            </strong>
          </div>
          <button
            onClick={() =>
              setDrawerContext({
                title: "Today's Operating Verdict",
                description: v.headline,
                why: why.summary,
                impact: `Estimated revenue exposure: ₹${v.revenue_exposure_rs.toLocaleString()}`,
                action: data.act_now.length > 0 ? data.act_now[0].action : 'Review shift allocations.',
              })
            }
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '5px 10px' }}
          >
            <Bot size={13} color="#2563EB" />
            <span>Explain</span>
          </button>
        </div>
      </div>

      {/* ── A. TODAY: Only 4 Core Numbers ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: TOKENS.spacing[3] }}>
        <KpiCard
          label="OUTPUT"
          value={`${c.output.actual_m.toLocaleString()} m`}
          target={`Target: ${c.output.target_m.toLocaleString()} m`}
          variance={`${c.output.variance_pct > 0 ? '+' : ''}${c.output.variance_pct}%`}
          trendDirection={c.output.variance_pct >= 0 ? 'up' : 'down'}
          status={c.output.status === 'HEALTHY' ? 'HEALTHY' : 'WARNING'}
          provenance="ACTUAL"
          driver="192 active looms"
        />

        <KpiCard
          label="EFFICIENCY"
          value={`${c.efficiency.actual_pct}%`}
          target={`Target: ${c.efficiency.target_pct}%`}
          variance={`${c.efficiency.gap_pp > 0 ? '+' : ''}${c.efficiency.gap_pp} pp`}
          trendDirection={c.efficiency.gap_pp >= 0 ? 'up' : 'down'}
          status={c.efficiency.status === 'HEALTHY' ? 'HEALTHY' : 'WARNING'}
          provenance="CALCULATED"
          driver="Speed: 642 RPM"
        />

        <KpiCard
          label="LOSS & GAP"
          value={`₹${c.loss.revenue_at_risk_rs.toLocaleString()}`}
          target={`${c.loss.output_gap_m.toLocaleString()} m gap`}
          status={c.loss.status === 'CRITICAL' ? 'CRITICAL' : 'WARNING'}
          provenance="ESTIMATED"
          driver="Revenue at risk"
        />

        <KpiCard
          label="REVENUE"
          value={`₹${(c.revenue.realized_rs / 100000).toFixed(2)} L`}
          target="Realized Net"
          status="HEALTHY"
          provenance="CALCULATED"
          driver="@ confirmed selling rates"
        />
      </div>

      {/* ── B. ACT NOW: The Most Important Section (Max 3 Items) ─────────── */}
      <div
        style={{
          background: TOKENS.colors.surface.card,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          borderRadius: TOKENS.radius.md,
          padding: '14px 16px',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: TOKENS.colors.text.primary, letterSpacing: '0.02em' }}>
              ACT NOW — TOP PRIORITIES FOR MANAGEMENT
            </h3>
            <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
              Ranked strictly by business impact. Direct technical leads to these 3 issues today.
            </div>
          </div>
          <DataTrustBadge provenance="CALCULATED" compact />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.act_now.map((item, idx) => (
            <div
              key={`act-${item.rank}-${idx}-${item.loom_id || 'gap'}`}
              style={{
                background: TOKENS.colors.surface.cardAlt,
                border: item.rank === 1 ? '1px solid #FECACA' : `1px solid ${TOKENS.colors.surface.border}`,
                borderLeft: item.rank === 1 ? '4px solid #DC2626' : '4px solid #2563EB',
                borderRadius: TOKENS.radius.sm,
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: item.rank === 1 ? '#DC2626' : '#2563EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.rank}
                </span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
                    {item.issue}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: 600, marginTop: '2px' }}>
                    Impact: {item.impact}
                  </div>
                  <div style={{ fontSize: '12px', color: TOKENS.colors.brand[700], fontWeight: 600, marginTop: '2px' }}>
                    → {item.action}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.loom_id && (
                  <button
                    onClick={() => onNavigateToModule('looms', item.loom_id!)}
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    <span>Loom #{item.loom_no || item.loom_id}</span>
                    <ChevronRight size={11} />
                  </button>
                )}
                <button
                  onClick={() =>
                    setDrawerContext({
                      title: `Priority #${item.rank}: ${item.issue}`,
                      description: item.issue,
                      why: `Root cause identified in telemetry records: ${item.impact}.`,
                      impact: item.impact,
                      action: item.action,
                    })
                  }
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Explain
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── C. WHY ARE WE OFF PLAN? (Simple Percentage Breakdown) ────────── */}
      <div
        style={{
          background: TOKENS.colors.surface.card,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          borderRadius: TOKENS.radius.md,
          padding: '14px 16px',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              WHY ARE WE OFF PLAN? (Target Shortfall: {why.target_shortfall_m.toLocaleString()} m)
            </h4>
            <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
              {why.summary}
            </div>
          </div>
        </div>

        {/* Progress Stack Bar */}
        <div style={{ width: '100%', height: '12px', background: '#E2E8F0', borderRadius: '6px', overflow: 'hidden', display: 'flex', marginBottom: '10px' }}>
          <div style={{ width: `${why.downtime_pct}%`, background: '#DC2626' }} title={`Downtime: ${why.downtime_pct}%`} />
          <div style={{ width: `${why.weft_breaks_pct}%`, background: '#D97706' }} title={`Weft breaks: ${why.weft_breaks_pct}%`} />
          <div style={{ width: `${why.efficiency_drift_pct}%`, background: '#2563EB' }} title={`Efficiency gap: ${why.efficiency_drift_pct}%`} />
          <div style={{ width: `${why.other_pct}%`, background: '#94A3B8' }} title={`Other: ${why.other_pct}%`} />
        </div>

        {/* Breakdown Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11.5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} />
            <span>Downtime: <strong>{why.downtime_pct}%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706' }} />
            <span>Weft Breaks: <strong>{why.weft_breaks_pct}%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} />
            <span>Efficiency Drift: <strong>{why.efficiency_drift_pct}%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94A3B8' }} />
            <span>Other: <strong>{why.other_pct}%</strong></span>
          </div>
        </div>
      </div>

      {/* ── D. AI FINDINGS (Max 2) & NEXT RISK (1) ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: TOKENS.spacing[4] }}>
        {/* AI Findings */}
        <div
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={15} color="#2563EB" />
              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                WHAT DID LOOM AI NOTICE?
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.ai_findings.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    background: TOKENS.colors.surface.cardAlt,
                    padding: '10px 12px',
                    borderRadius: TOKENS.radius.sm,
                    border: `1px solid ${TOKENS.colors.surface.border}`,
                  }}
                >
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: TOKENS.colors.brand[700] }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, marginTop: '2px' }}>
                    <strong>Evidence:</strong> {f.evidence}
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                    Suggested Action: {f.suggested_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Forward Risk */}
        {data.next_risk && (
          <div
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={15} color="#DC2626" />
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                    NEXT FORWARD RISK
                  </h4>
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '1px 6px', borderRadius: '3px' }}>
                  {data.next_risk.probability_pct}% RISK
                </span>
              </div>

              <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
                  {data.next_risk.target} — {data.next_risk.risk_label}
                </div>
                <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, marginTop: '2px' }}>
                  <strong>Why:</strong> {data.next_risk.reason}
                </div>
                <div style={{ fontSize: '11.5px', color: '#2563EB', fontWeight: 600, marginTop: '4px' }}>
                  Action: {data.next_risk.action}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '10px', textAlign: 'right' }}>
              <button
                onClick={() => onNavigateToModule('predictions')}
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                <span>View Full Prediction Center</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── E. HOW ARE WE DOING OVER TIME (Trends + Since Yesterday + Last Action) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: TOKENS.spacing[4] }}>
        {/* 1. Trends */}
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.md,
            padding: '14px 16px',
            boxShadow: TOKENS.shadows.card,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              TREND OVER TIME
            </h4>
            <div style={{ display: 'flex', gap: '2px', background: '#F1F5F9', padding: '2px', borderRadius: '4px' }}>
              {(['7D', '30D', '90D'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTrendRange(r)}
                  style={{
                    background: trendRange === r ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '2px 6px',
                    fontSize: '10.5px',
                    fontWeight: trendRange === r ? 700 : 500,
                    color: trendRange === r ? TOKENS.colors.brand[700] : TOKENS.colors.text.muted,
                    cursor: 'pointer',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, marginBottom: '10px' }}>
            {data.trends.takeaway}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', height: '40px', alignItems: 'flex-end', padding: '4px 0', borderBottom: `1px solid ${TOKENS.colors.surface.border}` }}>
            {data.trends.efficiency.map((pt, idx) => (
              <div key={`eff-pt-${idx}-${pt.date}`} style={{ flex: 1, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ width: '80%', height: `${Math.max(10, ((pt.value - 75) / 25) * 100)}%`, background: '#2563EB', borderRadius: '2px 2px 0 0' }} />
                <span style={{ fontSize: '9px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>{pt.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Since Yesterday Movement */}
        {data.since_yesterday && (
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 8px 0', color: TOKENS.colors.text.primary }}>
              SINCE YESTERDAY
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
              <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '6px 8px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: TOKENS.colors.text.muted, display: 'block' }}>Output</span>
                <strong style={{ fontSize: '12.5px', color: data.since_yesterday.production_change_pct >= 0 ? '#059669' : '#DC2626' }}>
                  {data.since_yesterday.production_change_pct > 0 ? '+' : ''}{data.since_yesterday.production_change_pct}%
                </strong>
              </div>
              <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '6px 8px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: TOKENS.colors.text.muted, display: 'block' }}>Efficiency</span>
                <strong style={{ fontSize: '12.5px', color: data.since_yesterday.efficiency_change_pp >= 0 ? '#059669' : '#DC2626' }}>
                  {data.since_yesterday.efficiency_change_pp > 0 ? '+' : ''}{data.since_yesterday.efficiency_change_pp} pp
                </strong>
              </div>
              <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '6px 8px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: TOKENS.colors.text.muted, display: 'block' }}>Downtime</span>
                <strong style={{ fontSize: '12.5px', color: '#DC2626' }}>
                  +{data.since_yesterday.downtime_change_pct}%
                </strong>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: TOKENS.colors.text.secondary }}>
              <strong>Main change: </strong> {data.since_yesterday.main_change}
            </div>
          </div>
        )}

        {/* 3. Last Action Result */}
        {data.last_action_result && (
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#15803D" />
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: '#166534' }}>
                  LAST ACTION RESULT
                </h4>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#15803D', background: '#DCFCE7', padding: '1px 5px', borderRadius: '3px' }}>
                {data.last_action_result.status}
              </span>
            </div>

            <div style={{ fontSize: '12px', fontWeight: 700, color: '#14532D' }}>
              Loom {data.last_action_result.loom_no}: {data.last_action_result.action}
            </div>
            <div style={{ fontSize: '11.5px', color: '#15803D', marginTop: '3px' }}>
              ✓ {data.last_action_result.downtime_reduction} · {data.last_action_result.efficiency_recovery}
            </div>
            <div style={{ fontSize: '10.5px', color: '#166534', marginTop: '4px' }}>
              Verified: {data.last_action_result.verified_at}
            </div>
          </div>
        )}
      </div>

      {/* ── Contextual AI Slide-Over Drawer ─────────────────────────────── */}
      {drawerContext && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setDrawerContext(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${TOKENS.colors.surface.border}`, paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bot size={18} color="#2563EB" />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                    Loom AI Contextual Explanation
                  </h3>
                </div>
                <button
                  onClick={() => setDrawerContext(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: 1.5 }}>
                <div>
                  <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 700, textTransform: 'uppercase' }}>
                    SUBJECT:
                  </span>
                  <div style={{ fontWeight: 700, color: TOKENS.colors.text.primary, marginTop: '2px' }}>
                    {drawerContext.title}
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                  <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 700, textTransform: 'uppercase' }}>
                    WHY IS THIS HAPPENING?
                  </span>
                  <div style={{ color: TOKENS.colors.text.primary, marginTop: '2px' }}>
                    {drawerContext.why}
                  </div>
                </div>

                <div style={{ background: '#FEF2F2', padding: '10px 12px', borderRadius: '4px', border: '1px solid #FECACA' }}>
                  <span style={{ fontSize: '11px', color: '#991B1B', fontWeight: 700, textTransform: 'uppercase' }}>
                    BUSINESS & FINANCIAL IMPACT:
                  </span>
                  <div style={{ color: '#DC2626', fontWeight: 600, marginTop: '2px' }}>
                    {drawerContext.impact}
                  </div>
                </div>

                <div style={{ background: '#EFF6FF', padding: '10px 12px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                  <span style={{ fontSize: '11px', color: '#1E40AF', fontWeight: 700, textTransform: 'uppercase' }}>
                    RECOMMENDED MANAGEMENT DIRECTIVE:
                  </span>
                  <div style={{ color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
                    {drawerContext.action}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: `1px solid ${TOKENS.colors.surface.border}` }}>
              <button
                onClick={() => setDrawerContext(null)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
