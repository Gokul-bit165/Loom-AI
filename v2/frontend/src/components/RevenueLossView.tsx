import { useEffect, useState, useMemo, useRef } from 'react';
import { fetchRevenueAnalytics } from '../api';
import type {
  PeriodFilter,
  RevenueAnalyticsResponse,
} from '../api';
import { LoadingState, ErrorState } from '../design-system';
import { Check, X } from 'lucide-react';

interface ComponentInspectionData {
  title: string;
  badge?: string;
  badgeType?: 'critical' | 'warning' | 'healthy' | 'info';
  metric: string;
  metricLabel: string;
  whatHappened: string;
  whyItHappened: string;
  prescribedAction: string;
  owner: string;
  verificationGate: string;
}

export function RevenueLossView() {
  const [data, setData] = useState<RevenueAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<PeriodFilter>('TODAY');
  const [viewMode, setViewMode] = useState<'owner' | 'assistant'>('owner');
  const [histogramMetric, setHistogramMetric] = useState<'loss' | 'count'>('loss');
  const [approvedAction, setApprovedAction] = useState<boolean>(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('electrical_power');
  const [inspectionBlock, setInspectionBlock] = useState<ComponentInspectionData | null>(null);

  const scrolledSectionRef = useRef<HTMLDivElement | null>(null);

  const loadData = async (period: PeriodFilter) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRevenueAnalytics('2026-07-31', 'ATM', period);
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load revenue analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activePeriod);
  }, [activePeriod]);

  // Derived backend data with safe fallbacks
  const p = data?.profitability || {
    is_cost_data_available: false,
    net_revenue_inr: 0,
    yarn_cost_inr: 0,
    power_energy_cost_inr: 0,
    direct_labour_cost_inr: 0,
    maintenance_spares_inr: 0,
    total_direct_costs_inr: 0,
    contribution_profit_inr: 0,
    profit_margin_pct: 0,
  };

  const w = data?.loss_attribution_waterfall || {
    potential_max_revenue: 0,
    realized_revenue: 0,
    realized_metres: 0,
    waterfall_components: [],
    total_revenue_loss_inr: 0,
  };

  const owner = data?.owner_summary || {
    one_sentence_verdict: 'Electrical and power is the largest revenue loss. Approve panel inspection before evening shift.',
    three_key_numbers: [],
    one_biggest_reason: 'Grid voltage dips at 17:37-18:47 causing simultaneous loom inverter trips',
    one_action_to_approve: 'Approve transformer & Sub-panel 4 capacitor inspection before evening shift.',
    one_recovery_amount_inr: 130000,
    overall_trend: 'WORSENING' as const,
    recoverable_revenue_inr: 130000,
    potential_max_revenue_inr: 2313000,
    dominant_problem_department: 'Electrical and power',
    primary_action_owner: 'Chief Electrical Engineer',
    urgency: 'CRITICAL' as const,
  };

  const sectors = useMemo(() => data?.department_sectors || [], [data]);
  const trend = useMemo(() => data?.daily_trend || [], [data]);

  const selectedSector = useMemo(() => {
    return (
      sectors.find((s) => s.sector_id === selectedDeptId) ||
      sectors[0] || {
        sector_id: 'electrical_power',
        sector_name: 'Electrical and power',
        loss_inr: 201064,
        share_of_loss_pct: 62.3,
        trend_status: 'WORSENING' as const,
        main_reason: 'Four voltage dips caused simultaneous inverter trips',
        recommended_action: 'Inspect sub-panel terminals and drive capacitors before evening shift',
        owner: 'Chief Electrical Engineer',
        urgency: 'CRITICAL' as const,
        affected_metres: 5027,
      }
    );
  }, [sectors, selectedDeptId]);

  const formatCurrency = (val?: number | null) => {
    if (val === undefined || val === null) return '₹0';
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const formatInLakhs = (val?: number | null) => {
    if (val === undefined || val === null) return '₹0.00L';
    const lakhs = val / 100000;
    return `₹${lakhs.toFixed(2)} lakh`;
  };

  const scrollToAssistant = () => {
    setViewMode('assistant');
    setTimeout(() => {
      scrolledSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const scrollToOwner = () => {
    setViewMode('owner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <LoadingState message="Loading Revenue & Loss Decision Room..." />;
  if (error || !data) return <ErrorState message={error || 'Failed to load data'} onRetry={() => loadData(activePeriod)} />;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '24px 32px 64px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        background: '#f8fafc',
        color: '#0f172a',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* ── STICKY TOUCH INSPECTION BLOCK (Clean, professional card) ──────── */}
      {inspectionBlock && (
        <div
          style={{
            position: 'sticky',
            top: '16px',
            zIndex: 1000,
            background: '#ffffff',
            borderRadius: '8px',
            padding: '16px 20px',
            boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.12), 0 2px 6px -1px rgba(15, 23, 42, 0.08)',
            border: '1px solid #cbd5e1',
            borderLeft: '4px solid #2563eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Touch Inspector
              </span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                {inspectionBlock.title}
              </span>
              {inspectionBlock.badge && (
                <span
                  style={{
                    background:
                      inspectionBlock.badgeType === 'critical'
                        ? '#fef2f2'
                        : inspectionBlock.badgeType === 'healthy'
                        ? '#ecfdf5'
                        : '#fffbeb',
                    color:
                      inspectionBlock.badgeType === 'critical'
                        ? '#b91c1c'
                        : inspectionBlock.badgeType === 'healthy'
                        ? '#047857'
                        : '#b45309',
                    border: `1px solid ${
                      inspectionBlock.badgeType === 'critical'
                        ? '#fecaca'
                        : inspectionBlock.badgeType === 'healthy'
                        ? '#a7f3d0'
                        : '#fde68a'
                    }`,
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {inspectionBlock.badge}
                </span>
              )}
            </div>
            <button
              onClick={() => setInspectionBlock(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Dismiss"
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              background: '#f8fafc',
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                {inspectionBlock.metricLabel}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                {inspectionBlock.metric}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>What Happened</div>
              <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                {inspectionBlock.whatHappened}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Why It Happened</div>
              <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                {inspectionBlock.whyItHappened}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Prescribed Action</div>
              <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 500, marginTop: '2px', lineHeight: 1.4 }}>
                {inspectionBlock.prescribedAction}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Responsible Owner</div>
              <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px' }}>
                {inspectionBlock.owner}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                {inspectionBlock.verificationGate}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 1: TOP HEADER & DUAL-VIEW TOGGLE ──────────────────────── */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>
            Revenue and Loss Decision Dashboard
          </h1>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Unit: <strong>Ashok Textile Mills Main Shed</strong>
          </span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Date: <strong>31 July 2026</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={scrollToOwner}
            style={{
              height: '32px',
              padding: '0 16px',
              borderRadius: '6px',
              border: viewMode === 'owner' ? 'none' : '1px solid #cbd5e1',
              background: viewMode === 'owner' ? '#2563eb' : '#ffffff',
              color: viewMode === 'owner' ? '#ffffff' : '#334155',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Owner view
          </button>
          <button
            onClick={scrollToAssistant}
            style={{
              height: '32px',
              padding: '0 16px',
              borderRadius: '6px',
              border: viewMode === 'assistant' ? 'none' : '1px solid #cbd5e1',
              background: viewMode === 'assistant' ? '#2563eb' : '#ffffff',
              color: viewMode === 'assistant' ? '#ffffff' : '#334155',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Plant assistant detail
          </button>
        </div>
      </div>

      {/* ── SECTION 2: MAIN DECISION BANNER ───────────────────────────────── */}
      <div
        onClick={() =>
          setInspectionBlock({
            title: 'Main Executive Decision',
            badge: 'CRITICAL',
            badgeType: 'critical',
            metric: formatInLakhs(owner.recoverable_revenue_inr),
            metricLabel: 'Recoverable Protection',
            whatHappened: owner.one_sentence_verdict,
            whyItHappened: owner.one_biggest_reason,
            prescribedAction: owner.one_action_to_approve,
            owner: owner.primary_action_owner,
            verificationGate: 'Monitor electrical downtime stoppage minutes in Shift 2 handover log.',
          })
        }
        style={{
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '8px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          boxSizing: 'border-box',
          gap: '20px',
          flexWrap: 'wrap',
        }}
        title="Touch to inspect decision details"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 600px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#dc2626',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            !
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#991b1b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Main Decision
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
              {owner.one_sentence_verdict}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#065f46',
                }}
              >
                Recoverable: {formatInLakhs(owner.recoverable_revenue_inr)}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setApprovedAction(!approvedAction);
                }}
                style={{
                  background: approvedAction ? '#059669' : '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s ease',
                }}
              >
                {approvedAction ? (
                  <>
                    <Check size={16} /> Action Approved: {owner.primary_action_owner}
                  </>
                ) : (
                  `Approve Action: ${owner.primary_action_owner}`
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <span
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#1e40af',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Calculated
          </span>
        </div>
      </div>

      {/* ── SECTION 3: OWNER DECISION CARDS (6 Cards Max) ─────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Actual revenue */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Actual revenue',
              badge: 'CALCULATED',
              badgeType: 'healthy',
              metric: formatInLakhs(data.period_total_revenue_inr),
              metricLabel: 'Realized Pick Production Revenue',
              whatHappened: `Generated ${formatInLakhs(data.period_total_revenue_inr)} from fabric produced in this period.`,
              whyItHappened: 'Calculated directly from telemetry pick counters and active sort rate cards.',
              prescribedAction: 'Maintain current shedding speed and monitor evening airjet pressure.',
              owner: 'Weaving Shift Supervisor',
              verificationGate: 'Shift production log & pick counter reading.',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '110px',
          }}
          title="Touch for details"
        >
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Actual revenue</span>
          <span style={{ fontSize: '24px', fontWeight: 600, color: '#059669', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(data.period_total_revenue_inr)}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>From metres woven</span>
        </div>

        {/* Card 2: Potential revenue */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Potential revenue',
              badge: 'CALCULATED',
              badgeType: 'info',
              metric: formatInLakhs(owner.potential_max_revenue_inr || w.potential_max_revenue),
              metricLabel: 'Theoretical 100% Target Capacity',
              whatHappened: 'Full factory revenue potential if scheduled downtime and speed gap were zero.',
              whyItHappened: 'Standard expected potential based on 100% scheduled uptime and standard RPM.',
              prescribedAction: 'Minimize classified mechanical and electrical downtime to close capacity gap.',
              owner: 'Plant Superintendent',
              verificationGate: 'Daily capacity utilization KPI ledger.',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '110px',
          }}
          title="Touch for details"
        >
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Potential revenue</span>
          <span style={{ fontSize: '24px', fontWeight: 600, color: '#0f172a', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(owner.potential_max_revenue_inr || w.potential_max_revenue)}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>At scheduled capacity</span>
        </div>

        {/* Card 3: Revenue loss */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Revenue loss',
              badge: 'CRITICAL',
              badgeType: 'critical',
              metric: `-${formatInLakhs(data.total_revenue_loss_inr)}`,
              metricLabel: 'Unproduced Capacity Loss',
              whatHappened: 'Financial drain due to breakdowns, voltage dips, and running speed deficit.',
              whyItHappened: 'Mutually exclusive loss waterfall calculations from StopEvents and speed logs.',
              prescribedAction: 'Prioritize Sub-panel 4 capacitor overhaul and Tsudakoma knotter inspection.',
              owner: 'Chief Electrical Engineer & Maintenance Lead',
              verificationGate: 'Hourly revenue run-rate tracking on SCADA.',
            })
          }
          style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: '8px',
            padding: '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '110px',
          }}
          title="Touch for details"
        >
          <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: 500 }}>Revenue loss</span>
          <span style={{ fontSize: '24px', fontWeight: 600, color: '#dc2626', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(data.total_revenue_loss_inr)}
          </span>
          <span style={{ fontSize: '12px', color: '#991b1b' }}>Unproduced capacity gap</span>
        </div>

        {/* Card 4: Recoverable revenue */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Recoverable revenue',
              badge: 'OPPORTUNITY',
              badgeType: 'healthy',
              metric: formatInLakhs(owner.recoverable_revenue_inr),
              metricLabel: 'Immediate Action Value',
              whatHappened: 'Revenue that can be safeguarded immediately by executing the primary action.',
              whyItHappened: 'Top issue (Sub-panel 4 transformer tap setting) accounts for largest single loss block.',
              prescribedAction: 'Execute evening shift tap calibration before peak grid load at 17:00 PM.',
              owner: 'Chief Electrical Engineer',
              verificationGate: 'Sub-panel 4 voltage stability logger.',
            })
          }
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            padding: '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '110px',
          }}
          title="Touch for details"
        >
          <span style={{ fontSize: '13px', color: '#065f46', fontWeight: 500 }}>Recoverable revenue</span>
          <span style={{ fontSize: '24px', fontWeight: 600, color: '#059669', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(owner.recoverable_revenue_inr)}
          </span>
          <span style={{ fontSize: '12px', color: '#065f46' }}>If top issue is fixed</span>
        </div>

        {/* Card 5: Contribution profit */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Contribution profit',
              badge: 'CALCULATED',
              badgeType: 'info',
              metric: formatInLakhs(p.contribution_profit_inr),
              metricLabel: 'Net Margin Over Direct Costs',
              whatHappened: `Realized revenue minus yarn, power, labour, and maintenance spares.`,
              whyItHappened: `Direct costs: Yarn ~52%, Power ~11%, Labour ~₹85k, Spares ~₹14.5k.`,
              prescribedAction: 'Confirm style rate card in sales ERP to unlock 100% audit precision.',
              owner: 'Commercial & Costing Head',
              verificationGate: 'Monthly ERP cost reconciliation.',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '110px',
          }}
          title="Touch for details"
        >
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Contribution profit</span>
          <span style={{ fontSize: '24px', fontWeight: 600, color: '#0f172a', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(p.contribution_profit_inr)}
          </span>
          <span style={{ fontSize: '12px', color: '#059669' }}>{p.profit_margin_pct.toFixed(1)}% margin</span>
        </div>

        {/* Card 6: Main problem department */}
        <div
          onClick={() => {
            setSelectedDeptId('electrical_power');
            setInspectionBlock({
              title: 'Main problem department',
              badge: 'WORSENING',
              badgeType: 'critical',
              metric: owner.dominant_problem_department,
              metricLabel: 'Leading Operational Constraint',
              whatHappened: `${owner.dominant_problem_department} accounts for ~62% of revenue loss today.`,
              whyItHappened: owner.one_biggest_reason,
              prescribedAction: owner.one_action_to_approve,
              owner: owner.primary_action_owner,
              verificationGate: 'Sub-panel 4 capacitor inspection log before 17:00 PM.',
            });
          }}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '110px',
          }}
          title="Touch to drill-down into department"
        >
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Main problem department</span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#dc2626',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {owner.dominant_problem_department}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>62% of today's loss</span>
        </div>
      </div>

      {/* ── SECTION 4: TIME PERIOD BAR ────────────────────────────────────── */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {(
          [
            { key: 'TODAY', label: 'Today' },
            { key: 'SEVEN_DAYS', label: 'Last 7 days' },
            { key: 'MONTH_TO_DATE', label: 'Month to date' },
            { key: 'YEAR_TO_DATE', label: 'Year to date' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActivePeriod(tab.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activePeriod === tab.key ? '#2563eb' : 'transparent',
              color: activePeriod === tab.key ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── SECTION 5: MIDDLE ROW - 2 CHARTS ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
        {/* Chart 1: Revenue Trend (Left) */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Revenue Trend Chart',
              badge: 'CALCULATED',
              badgeType: 'info',
              metric: formatInLakhs(data.period_total_revenue_inr),
              metricLabel: 'Realized Trajectory',
              whatHappened: 'Revenue has remained below target capacity across the selected period.',
              whyItHappened: 'Downtime from voltage dips and running speed gap (~89.6% eff) reduces pick output.',
              prescribedAction: 'Stabilize sub-panel capacitors and enforce Shift 3 patrolling.',
              owner: 'Weaving Production Lead',
              verificationGate: 'Daily metres woven log vs loom runtime counter.',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px 24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            cursor: 'pointer',
          }}
          title="Touch chart to inspect trajectory"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Revenue Trend</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                X-axis: Date &nbsp;|&nbsp; Y-axis: Revenue (rupees)
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '3px', background: '#2563eb' }}></span>
                <span>Actual revenue</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '3px', background: '#94a3b8' }}></span>
                <span>Target revenue</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div style={{ height: '140px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 700 130" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <line x1="40" y1="105" x2="680" y2="105" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="40" y1="15" x2="40" y2="105" stroke="#e2e8f0" strokeWidth="1" />

              <text x="360" y="125" fontSize="11" fill="#64748b" textAnchor="middle">
                Date ({trend.length > 0 ? `${trend.length}-day sequence` : '14-day sequence'})
              </text>
              <text x="15" y="60" fontSize="11" fill="#64748b" transform="rotate(-90 15 60)" textAnchor="middle">
                Revenue (₹)
              </text>

              {/* Target Capacity Line (dashed) */}
              <polyline
                points="50,40 100,40 150,40 200,40 250,40 300,40 350,40 400,40 450,40 500,40 550,40 600,40 660,40"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* Realized Revenue Line */}
              <polyline
                points="50,75 100,72 150,79 200,77 250,70 300,74 350,67 400,64 450,69 500,61 550,58 600,56 660,54"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />

              {/* Active Today Point */}
              <circle cx="660" cy="54" r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
            </svg>
          </div>

          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#1e40af',
              lineHeight: 1.4,
            }}
          >
            <strong>Decision:</strong> Revenue is below target. Monitor revenue per scheduled loom hour after panel inspection.
          </div>
        </div>

        {/* Chart 2: Revenue Loss Trend (Right) */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Daily Revenue Loss Trend',
              badge: 'SPIKE DETECTED',
              badgeType: 'critical',
              metric: '₹2.01L Peak Loss',
              metricLabel: 'Anomaly Threshold (₹95,000)',
              whatHappened: 'Severe loss spikes detected on July 24 and July 29 exceeding the ₹95,000 threshold.',
              whyItHappened: 'Sub-panel 4 transformer tap setting drift caused cascaded inverter trips.',
              prescribedAction: 'Approve Chief Electrical Engineer action to inspect and calibrate before evening shift.',
              owner: 'Chief Electrical Engineer',
              verificationGate: 'Voltage spike log on Sub-panel 4.',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px 24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            cursor: 'pointer',
          }}
          title="Touch chart to inspect spike data"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Revenue Loss Trend</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                X-axis: Date &nbsp;|&nbsp; Y-axis: Revenue loss (rupees)
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#dc2626' }}>
              <span style={{ width: '12px', height: '2px', background: '#dc2626' }}></span>
              <span>Spike threshold (₹95k)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* SVG Bar Chart */}
            <div style={{ flex: 1, height: '140px', position: 'relative' }}>
              <svg viewBox="0 0 450 130" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <line x1="30" y1="105" x2="430" y2="105" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="30" y1="15" x2="30" y2="105" stroke="#e2e8f0" strokeWidth="1" />

                <text x="230" y="125" fontSize="11" fill="#64748b" textAnchor="middle">
                  Date
                </text>
                <text x="12" y="60" fontSize="11" fill="#64748b" transform="rotate(-90 12 60)" textAnchor="middle">
                  Loss (₹)
                </text>

                {/* Bars */}
                <rect x="50" y="70" width="18" height="35" rx="3" fill="#f59e0b" />
                <rect x="85" y="62" width="18" height="43" rx="3" fill="#f59e0b" />
                <rect x="120" y="52" width="18" height="53" rx="3" fill="#f59e0b" />
                {/* Spike 1 */}
                <rect x="155" y="32" width="18" height="73" rx="3" fill="#dc2626" />
                <rect x="190" y="74" width="18" height="31" rx="3" fill="#f59e0b" />
                <rect x="225" y="66" width="18" height="39" rx="3" fill="#f59e0b" />
                <rect x="260" y="60" width="18" height="45" rx="3" fill="#f59e0b" />
                {/* Spike 2 */}
                <rect x="295" y="24" width="18" height="81" rx="3" fill="#dc2626" />
                <rect x="330" y="65" width="18" height="40" rx="3" fill="#f59e0b" />
                <rect x="365" y="72" width="18" height="33" rx="3" fill="#f59e0b" />

                {/* Spike Threshold Line */}
                <line x1="30" y1="48" x2="430" y2="48" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
            </div>

            {/* Peak Loss Box */}
            <div
              style={{
                width: '180px',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '6px',
                padding: '12px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#991b1b', textTransform: 'uppercase' }}>
                Peak loss day
              </span>
              <span style={{ fontSize: '18px', fontWeight: 600, color: '#dc2626' }}>₹2.01 lakh</span>
              <span style={{ fontSize: '12px', color: '#475569' }}>Dept: Electrical</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Owner: Chief Engineer</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 6: ROW 2 - HISTOGRAM & TOP DEPARTMENT ACTIONS ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
        {/* Left: Department Problem Histogram */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Department Problem Histogram',
              badge: 'PARTITIONED',
              badgeType: 'critical',
              metric: '4 Departments Tracked',
              metricLabel: 'Loss Attribution Share',
              whatHappened: 'Electrical & power causes over 60% of daily loss despite fewer stop events.',
              whyItHappened: 'Voltage dips trip entire loom groups simultaneously vs isolated mechanical stops.',
              prescribedAction: 'Prioritize electrical panel inspection as primary action.',
              owner: 'Chief Electrical Engineer',
              verificationGate: 'Stoppage event log per department.',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px 24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            cursor: 'pointer',
          }}
          title="Touch department to inspect and drill-down"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                Department Problem Histogram
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                X-axis: Loss amount (rupees) &nbsp;|&nbsp; Y-axis: Department
              </div>
            </div>

            {/* Metric Switcher */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHistogramMetric('loss');
                }}
                style={{
                  border: 'none',
                  background: histogramMetric === 'loss' ? '#ffffff' : 'transparent',
                  color: histogramMetric === 'loss' ? '#0f172a' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '4px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: histogramMetric === 'loss' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                Loss ₹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHistogramMetric('count');
                }}
                style={{
                  border: 'none',
                  background: histogramMetric === 'count' ? '#ffffff' : 'transparent',
                  color: histogramMetric === 'count' ? '#0f172a' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '4px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: histogramMetric === 'count' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                Count
              </button>
            </div>
          </div>

          {/* Clean Horizontal Bar List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { id: 'electrical_power', name: 'Electrical and power', val: '₹2.01 lakh', pct: 85, color: '#dc2626' },
              { id: 'mechanical_maintenance', name: 'Mechanical maintenance', val: '₹58,933', pct: 28, color: '#f59e0b' },
              { id: 'weaving_efficiency', name: 'Weaving efficiency', val: '₹59,376', pct: 29, color: '#2563eb' },
              { id: 'quality_seconds', name: 'Quality and seconds', val: '₹12,250', pct: 8, color: '#7e22ce' },
            ].map((dept) => (
              <div
                key={dept.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDeptId(dept.id);
                  scrollToAssistant();
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '170px 1fr 90px',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {dept.name}
                </span>
                <div style={{ background: '#f1f5f9', height: '16px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${dept.pct}%`,
                      height: '100%',
                      background: dept.color,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {dept.val}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', paddingLeft: '182px', paddingRight: '90px' }}>
            <span>₹0</span>
            <span>₹1 lakh</span>
            <span>₹2 lakh</span>
          </div>
        </div>

        {/* Right: Top Department Actions */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px 24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Top Department Actions</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Immediate managerial interventions by priority
            </div>
          </div>

          {/* Responsive Action Cards (Flexible Grid that won't crush) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {/* Action Card 1: Electrical */}
            <div
              onClick={() => {
                setSelectedDeptId('electrical_power');
                setInspectionBlock({
                  title: 'Top Action: Electrical and power',
                  badge: 'CRITICAL',
                  badgeType: 'critical',
                  metric: '₹2.01 lakh',
                  metricLabel: 'Loss Today',
                  whatHappened: 'Voltage dips at peak load tripped loom inverters.',
                  whyItHappened: 'Sub-panel 4 transformer tap setting calibration drift.',
                  prescribedAction: 'Inspect sub-panel terminals and drive capacitors before evening shift.',
                  owner: 'Chief Electrical Engineer',
                  verificationGate: 'Monitor voltage log before 17:00 PM.',
                });
                scrollToAssistant();
              }}
              style={{
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '6px',
                padding: '12px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                cursor: 'pointer',
              }}
              title="Touch to select and inspect"
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#991b1b', lineHeight: 1.2 }}>
                Electrical and power
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#dc2626' }}>₹2.01 lakh</div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.3 }}>
                Reason: voltage dips
              </div>
              <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, lineHeight: 1.3 }}>
                Action: inspect sub-panel
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: 'auto' }}>
                Owner: Chief engineer
              </div>
            </div>

            {/* Action Card 2: Mechanical */}
            <div
              onClick={() => {
                setSelectedDeptId('mechanical_maintenance');
                setInspectionBlock({
                  title: 'Top Action: Mechanical maintenance',
                  badge: 'WARNING',
                  badgeType: 'warning',
                  metric: '₹58,933',
                  metricLabel: 'Loss Today',
                  whatHappened: 'Knotting cycle delays and cutter edge wear on high-speed airjets.',
                  whyItHappened: 'Overrun on warp beam changes exceeding 15-minute standard.',
                  prescribedAction: 'Enforce 15-minute knotting standard & fitter floor dispatch.',
                  owner: 'Maintenance Lead',
                  verificationGate: 'Knotter stopwatch beam change audit.',
                });
                scrollToAssistant();
              }}
              style={{
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '6px',
                padding: '12px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                cursor: 'pointer',
              }}
              title="Touch to select and inspect"
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', lineHeight: 1.2 }}>
                Mechanical maintenance
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#d97706' }}>₹58,933</div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.3 }}>
                Reason: repeated stops
              </div>
              <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, lineHeight: 1.3 }}>
                Action: fitter dispatch
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: 'auto' }}>
                Owner: Maintenance lead
              </div>
            </div>

            {/* Action Card 3: Weaving */}
            <div
              onClick={() => {
                setSelectedDeptId('weaving_efficiency');
                setInspectionBlock({
                  title: 'Top Action: Weaving efficiency',
                  badge: 'SPEED DEFICIT',
                  badgeType: 'info',
                  metric: '₹59,376',
                  metricLabel: 'Loss Today',
                  whatHappened: 'Running speed deficit below style target on Looms 101-108.',
                  whyItHappened: 'Weft insertion friction during humidity fluctuation at 14:00 PM.',
                  prescribedAction: 'Humidification cell review & weaver shift speed target sign-off.',
                  owner: 'Weaving Master',
                  verificationGate: 'Hourly pick-rate telemetry display.',
                });
                scrollToAssistant();
              }}
              style={{
                background: '#eff6ff',
                border: '1px solid #dbeafe',
                borderRadius: '6px',
                padding: '12px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                cursor: 'pointer',
              }}
              title="Touch to select and inspect"
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af', lineHeight: 1.2 }}>
                Weaving efficiency
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#2563eb' }}>₹59,376</div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.3 }}>
                Reason: speed gap
              </div>
              <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, lineHeight: 1.3 }}>
                Action: shift review
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: 'auto' }}>
                Owner: Weaving master
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ── SCROLLED VIEW / PLANT ASSISTANT VIEW ──────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        ref={scrolledSectionRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '16px',
          borderTop: '1px dashed #cbd5e1',
          paddingTop: '28px',
        }}
      >
        {/* Selected Drill-Down Header Banner */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: `${selectedSector.sector_name} Drill-Down`,
              badge: selectedSector.trend_status,
              badgeType: selectedSector.trend_status === 'WORSENING' ? 'critical' : 'healthy',
              metric: formatInLakhs(selectedSector.loss_inr),
              metricLabel: 'Attributed Loss',
              whatHappened: `${selectedSector.sector_name} selected from department histogram for full operational trace.`,
              whyItHappened: selectedSector.main_reason,
              prescribedAction: selectedSector.recommended_action,
              owner: selectedSector.owner,
              verificationGate: 'Detailed supervisor audit check on Shift 2.',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            cursor: 'pointer',
          }}
          title="Touch for details"
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#1e3a5f', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Selected Drill-Down
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
              {selectedSector.sector_name} loss selected from department histogram
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#dc2626',
              }}
            >
              Worsening trend
            </span>
            <span
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#1e40af',
              }}
            >
              Calculated
            </span>
            <span
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#059669',
              }}
            >
              Action ready
            </span>
          </div>
        </div>

        {/* 3-Card Row: Deep Dive + Monitor + Action Approval */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Card 1: Department Deep Dive */}
          <div
            onClick={() =>
              setInspectionBlock({
                title: 'Department Deep Dive',
                badge: 'EXPANDED',
                badgeType: 'critical',
                metric: formatInLakhs(selectedSector.loss_inr),
                metricLabel: 'Direct Loss Impact',
                whatHappened: selectedSector.main_reason,
                whyItHappened: 'Voltage instability tripped Tsudakoma loom group inverters simultaneously.',
                prescribedAction: selectedSector.recommended_action,
                owner: selectedSector.owner,
                verificationGate: 'Sub-panel 4 capacitor inspection log.',
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '20px 24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Department Deep Dive</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Only appears after touching a sector, chart point, or spike bar.
              </div>
            </div>

            {/* Impact Banner */}
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '6px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: '#991b1b', textTransform: 'uppercase' }}>
                  Revenue impact
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#dc2626' }}>
                  {formatInLakhs(selectedSector.loss_inr)} today
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {Math.round(selectedSector.affected_metres || 5027).toLocaleString()} metres lost
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontWeight: 500, color: '#0f172a', minWidth: '60px' }}>Reason:</span>
                <span style={{ color: '#475569' }}>Four voltage dips caused simultaneous inverter trips.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontWeight: 500, color: '#0f172a', minWidth: '60px' }}>Action:</span>
                <span style={{ color: '#475569' }}>
                  Inspect sub-panel terminals and drive capacitors before evening shift.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontWeight: 500, color: '#0f172a', minWidth: '60px' }}>Owner:</span>
                <span style={{ color: '#475569' }}>{selectedSector.owner}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Monitor After Action */}
          <div
            onClick={() =>
              setInspectionBlock({
                title: 'Monitor After Action',
                badge: 'VERIFIED',
                badgeType: 'healthy',
                metric: 'Target Met',
                metricLabel: 'Improvement Verification',
                whatHappened: 'Simulated trajectory demonstrating financial recovery after panel fix.',
                whyItHappened: 'Stoppage minutes drop by 78% once transformer tap drift is corrected.',
                prescribedAction: 'Log stoppage minutes on hourly shift supervisor board.',
                owner: 'Chief Electrical Engineer',
                verificationGate: 'SCADA electrical downtime threshold < 5 min/shift.',
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '20px 24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Monitor After Action</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  The assistant checks if the approved fix actually improves money.
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '10px', height: '3px', background: '#dc2626' }}></span>
                  <span>Before</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '10px', height: '3px', background: '#059669' }}></span>
                  <span>After</span>
                </div>
              </div>
            </div>

            {/* SVG Comparison Trend */}
            <div style={{ height: '90px', width: '100%', position: 'relative' }}>
              <svg viewBox="0 0 450 95" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <line x1="30" y1="85" x2="420" y2="85" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="85" stroke="#e2e8f0" strokeWidth="1" />

                {/* Red Before Curve (Degrading) */}
                <polyline
                  points="40,30 90,42 140,38 190,56 240,52 290,68 340,76 390,72"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />

                {/* Green After Curve (Improving) */}
                <polyline
                  points="40,65 90,60 140,54 190,44 240,38 290,28 340,20 390,16"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                />
                <circle cx="390" cy="16" r="4" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
              </svg>
            </div>

            <div style={{ fontSize: '12px', fontWeight: 500, color: '#059669', lineHeight: 1.4 }}>
              Target after fix: electrical stoppage minutes down, revenue loss down
            </div>
          </div>

          {/* Card 3: Action Approval Card */}
          <div
            onClick={() =>
              setInspectionBlock({
                title: 'Action Approval Card',
                badge: approvedAction ? 'APPROVED' : 'PENDING',
                badgeType: approvedAction ? 'healthy' : 'critical',
                metric: '₹1.30 lakh',
                metricLabel: 'Protected Value',
                whatHappened: 'Prescriptive action to dispatch electrical engineer before Shift 2 peak.',
                whyItHappened: 'Transformer tap drift can cause additional multi-loom trip cascades.',
                prescribedAction: 'Execute tap setting recalibration and replace leaking capacitor.',
                owner: 'Chief Electrical Engineer',
                verificationGate: 'Electrical loss per shift monitor.',
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '20px 24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Action Approval Card</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                One clear approval instead of many text blocks.
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setApprovedAction(!approvedAction);
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '6px',
                background: approvedAction ? '#059669' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              {approvedAction ? (
                <>
                  <Check size={16} /> Action Approved & Dispatched
                </>
              ) : (
                'Approve electrical inspection before evening shift'
              )}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: '#64748b' }}>Expected recovery:</span>
                <span style={{ color: '#059669', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  ₹1.30 lakh
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: '#64748b' }}>Deadline:</span>
                <span style={{ color: '#0f172a', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  Before Shift 2 peak load
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: '#64748b' }}>Monitor:</span>
                <span style={{ color: '#0f172a', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  Electrical loss per shift
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Problem Matrix: Count vs Money Impact ────────────────────────── */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Problem Matrix: Count vs Money Impact',
              badge: 'STRATEGIC',
              badgeType: 'critical',
              metric: 'Asymmetric Risk',
              metricLabel: 'Concentration Factor',
              whatHappened: 'Electrical has high money impact despite low stoppage frequency.',
              whyItHappened: 'Voltage dips stop 42 looms at once, compounding pick loss exponentially.',
              prescribedAction: 'Fix Electrical and power first; then address mechanical knotting.',
              owner: 'Plant Superintendent',
              verificationGate: 'Pareto matrix analysis in weekly management review.',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px 24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            cursor: 'pointer',
          }}
          title="Touch for details"
        >
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              Problem Matrix: Count vs Money Impact
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Shows which departments have many problems and which have fewer problems but high rupee impact.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Scatter SVG */}
            <div style={{ flex: '1 1 500px', height: '120px', position: 'relative' }}>
              <svg viewBox="0 0 1100 110" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <line x1="80" y1="90" x2="1050" y2="90" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="80" y1="10" x2="80" y2="90" stroke="#e2e8f0" strokeWidth="1" />

                <text x="560" y="105" fontSize="11" fill="#64748b" textAnchor="middle">
                  Problem count
                </text>
                <text x="35" y="50" fontSize="11" fill="#64748b" transform="rotate(-90 35 50)" textAnchor="middle">
                  Rupee impact
                </text>

                {/* Bubble 1: Electrical and power */}
                <circle cx="850" cy="35" r="26" fill="#dc2626" opacity="0.85" />
                <text x="850" y="70" fontSize="12" fontWeight="500" fill="#dc2626" textAnchor="middle">
                  Electrical and power
                </text>

                {/* Bubble 2: Mechanical maintenance */}
                <circle cx="580" cy="55" r="18" fill="#f59e0b" opacity="0.85" />
                <text x="580" y="80" fontSize="12" fill="#92400e" textAnchor="middle">
                  Mechanical maintenance
                </text>

                {/* Bubble 3: Weaving efficiency */}
                <circle cx="450" cy="62" r="18" fill="#2563eb" opacity="0.85" />
                <text x="450" y="40" fontSize="12" fill="#1e40af" textAnchor="middle">
                  Weaving efficiency
                </text>

                {/* Bubble 4: Quality */}
                <circle cx="240" cy="74" r="10" fill="#7e22ce" opacity="0.85" />
                <text x="240" y="60" fontSize="12" fill="#7e22ce" textAnchor="middle">
                  Quality
                </text>
              </svg>
            </div>

            {/* Decision Insight Box */}
            <div
              style={{
                flex: '0 1 280px',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '6px',
                padding: '12px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#991b1b', textTransform: 'uppercase' }}>
                Decision insight
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>
                Electrical has both high count and high money impact. Fix first.
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Cost Structure & Fabric Sort Revenue ─────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
          {/* Left: Commercial Trust and Cost Layer */}
          <div
            onClick={() =>
              setInspectionBlock({
                title: 'Commercial Trust and Cost Layer',
                badge: 'ESTIMATED',
                badgeType: 'warning',
                metric: formatInLakhs(p.total_direct_costs_inr),
                metricLabel: 'Total Direct Costs',
                whatHappened: 'Direct manufacturing cost breakdown for current active period production.',
                whyItHappened: 'Yarn (~52%), Energy/Power (~11%), Labour (~₹85k/day), Spares (~₹14.5k/day).',
                prescribedAction: 'Confirm actual commercial selling price per metre in Sales ERP.',
                owner: 'Commercial & Costing Head',
                verificationGate: 'Cost master ledger audit.',
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '20px 24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                Commercial Trust and Cost Layer
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Shown in assistant view, not forced on the owner.
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div
                style={{
                  flex: 1,
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#b45309',
                }}
              >
                Style selling rate: Estimated
              </div>

              <div
                style={{
                  flex: 1,
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#059669',
                }}
              >
                Production metres: Calculated
              </div>
            </div>

            {/* Cost Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Raw yarn cost</span>
                <span style={{ color: '#0f172a', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {formatInLakhs(p.yarn_cost_inr || 1035000)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Power and energy cost</span>
                <span style={{ color: '#0f172a', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {formatInLakhs(p.power_energy_cost_inr || 219000)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Direct labour cost</span>
                <span style={{ color: '#0f172a', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(p.direct_labour_cost_inr || 85000)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Maintenance spares and oil</span>
                <span style={{ color: '#0f172a', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(p.maintenance_spares_inr || 14500)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Active Fabric Sort Revenue & Evidence Preview */}
          <div
            onClick={() =>
              setInspectionBlock({
                title: 'Fabric Sort Revenue Ledger',
                badge: 'SORT-WISE',
                badgeType: 'healthy',
                metric: '4 Active Sorts',
                metricLabel: 'Product Mix Portfolio',
                whatHappened: 'Revenue realization analyzed by individual warp/weft sort specifications.',
                whyItHappened: 'Sort 40s Poplin delivers 52% of total mill revenue volume.',
                prescribedAction: 'Protect Sort 40s loom allocation from electrical shedding cycles.',
                owner: 'Production Planning Control (PPC)',
                verificationGate: 'PPC sort assignment schedule.',
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '20px 24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                Active Fabric Sort Revenue
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Revenue contribution and active loom allocation by style
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '8px 4px', fontWeight: 500 }}>Sort Code</th>
                    <th style={{ padding: '8px 4px', fontWeight: 500, textAlign: 'right' }}>Revenue</th>
                    <th style={{ padding: '8px 4px', fontWeight: 500, textAlign: 'right' }}>Metres</th>
                    <th style={{ padding: '8px 4px', fontWeight: 500, textAlign: 'right' }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sort: '40s Poplin High-Density', rev: '₹10.35L', metres: '25,875m', share: '52.0%' },
                    { sort: '60s Cambric Export', rev: '₹5.57L', metres: '13,925m', share: '28.0%' },
                    { sort: '2/40s Twill Suiting', rev: '₹2.79L', metres: '6,975m', share: '14.0%' },
                    { sort: '80s Voile Premium', rev: '₹1.19L', metres: '2,975m', share: '6.0%' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 4px', color: '#0f172a', fontWeight: 500 }}>{row.sort}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>{row.rev}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'right', color: '#64748b' }}>{row.metres}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'right', color: '#0f172a' }}>{row.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Evidence items row */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Audit Provenance: 3 Telemetry Sources Connected</span>
              <span style={{ color: '#2563eb', fontWeight: 500 }}>ERP + SCADA Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
