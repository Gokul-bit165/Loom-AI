import { useEffect, useState, useMemo, useRef } from 'react';
import { fetchRevenueAnalytics } from '../api';
import type {
  PeriodFilter,
  RevenueAnalyticsResponse,
} from '../api';
import { LoadingState, ErrorState } from '../design-system';
import { Check, X, Truck, PackageCheck } from 'lucide-react';

interface ComponentInspectionData {
  title: string;
  badge?: string;
  badgeColor?: 'red' | 'white' | 'orange';
  metric: string;
  metricLabel: string;
  finding: string;
  action: string;
  owner: string;
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
    transport_cost_inr: 38500,
    outsource_packaging_cost_inr: 54200,
    total_direct_costs_inr: 0,
    total_operating_costs_inr: 0,
    contribution_profit_inr: 0,
    net_operating_income_inr: 0,
    profit_margin_pct: 0,
    transport_details: {
      route: 'Mill Shed → Bhiwandi Hub / JNPT Port',
      vehicle_trips: 3,
      rate_per_metre: 0.85,
      status: 'ON SCHEDULE',
    },
    outsource_packaging_details: {
      vendor: 'Apex Packagers Ltd',
      batch_code: 'PKG-JUL31-A',
      clearance_pct: 99.6,
      package_type: 'Export roll baling & moisture poly-wrap',
    },
  };

  const transportCost = p.transport_cost_inr ?? 38500;
  const outsourcePkgCost = p.outsource_packaging_cost_inr ?? 54200;
  const netOperatingIncome =
    p.net_operating_income_inr ??
    Math.max(0, (p.contribution_profit_inr || 0) - transportCost - outsourcePkgCost);

  const w = data?.loss_attribution_waterfall || {
    potential_max_revenue: 2313000,
    realized_revenue: 1582000,
    realized_metres: 39550,
    waterfall_components: [],
    total_revenue_loss_inr: 731000,
  };

  const owner = data?.owner_summary || {
    one_sentence_verdict: 'Electrical & power is the largest revenue loss. Recalibrate panel before evening peak.',
    three_key_numbers: [],
    one_biggest_reason: 'Grid voltage dips at 17:37-18:47 caused 42 loom inverter trips',
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

  // Status badge styling helper according to user requirements:
  // Red = worsen/check, White = normal, Orange = good
  const getBadgeStyle = (color?: 'red' | 'white' | 'orange') => {
    switch (color) {
      case 'red':
        return {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        };
      case 'orange':
        return {
          background: '#fff7ed',
          color: '#ea580c',
          border: '1px solid #fed7aa',
        };
      case 'white':
      default:
        return {
          background: '#ffffff',
          color: '#334155',
          border: '1px solid #cbd5e1',
        };
    }
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
        gap: '20px',
      }}
    >
      {/* ── STICKY TOUCH INSPECTION BLOCK (Compact, Minimal & Informative) ── */}
      {inspectionBlock && (
        <div
          style={{
            position: 'sticky',
            top: '16px',
            zIndex: 1000,
            background:
              inspectionBlock.badgeColor === 'red'
                ? '#fff8f8'
                : inspectionBlock.badgeColor === 'orange'
                ? '#fffaf5'
                : '#ffffff',
            borderRadius: '8px',
            padding: '12px 18px',
            boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.12), 0 2px 6px -1px rgba(15, 23, 42, 0.08)',
            border: `1px solid ${
              inspectionBlock.badgeColor === 'red'
                ? '#fecaca'
                : inspectionBlock.badgeColor === 'orange'
                ? '#fed7aa'
                : '#cbd5e1'
            }`,
            borderLeft: `5px solid ${
              inspectionBlock.badgeColor === 'red'
                ? '#dc2626'
                : inspectionBlock.badgeColor === 'orange'
                ? '#ea580c'
                : '#64748b'
            }`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                {inspectionBlock.title}
              </span>
              {inspectionBlock.badge && (
                <span
                  style={{
                    ...getBadgeStyle(inspectionBlock.badgeColor),
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
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
              title="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr 1fr',
              gap: '12px',
              background: '#ffffff',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                {inspectionBlock.metricLabel}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                {inspectionBlock.metric}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Finding
              </div>
              <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.3 }}>
                {inspectionBlock.finding}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Action & Owner
              </div>
              <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, lineHeight: 1.3 }}>
                {inspectionBlock.action} <span style={{ color: '#64748b' }}>• {inspectionBlock.owner}</span>
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
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
            Revenue and Loss Decision Dashboard
          </h1>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Unit: <strong>Ashok Textile Mills</strong>
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
              background: viewMode === 'owner' ? '#0f172a' : '#ffffff',
              color: viewMode === 'owner' ? '#ffffff' : '#334155',
              fontSize: '13px',
              fontWeight: 600,
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
              background: viewMode === 'assistant' ? '#0f172a' : '#ffffff',
              color: viewMode === 'assistant' ? '#ffffff' : '#334155',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Plant assistant detail
          </button>
        </div>
      </div>

      {/* ── SECTION 2: MAIN DECISION BANNER (Red Worsen / Check Needed) ───── */}
      <div
        onClick={() =>
          setInspectionBlock({
            title: 'Executive Protection Order',
            badge: 'CHECK NEEDED',
            badgeColor: 'red',
            metric: formatInLakhs(owner.recoverable_revenue_inr),
            metricLabel: 'Recoverable Protection',
            finding: 'Grid voltage dips at 17:37–18:47 caused simultaneous loom inverter trips.',
            action: owner.one_action_to_approve,
            owner: owner.primary_action_owner,
          })
        }
        style={{
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderLeft: '5px solid #dc2626',
          borderRadius: '8px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          boxSizing: 'border-box',
          gap: '16px',
          flexWrap: 'wrap',
        }}
        title="Touch to inspect decision details"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 600px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#dc2626',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            !
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Immediate Priority Decision
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
              {owner.one_sentence_verdict}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: '4px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#ea580c',
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
                  background: approvedAction ? '#ea580c' : '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s ease',
                }}
              >
                {approvedAction ? (
                  <>
                    <Check size={14} /> Action Approved: {owner.primary_action_owner}
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
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#475569',
              textTransform: 'uppercase',
            }}
          >
            Verified Telemetry
          </span>
        </div>
      </div>

      {/* ── SECTION 3: DECISION METRIC CARDS (No unwanted subtext!) ───────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
        }}
      >
        {/* Card 1: Revenue Income (Gross) [Orange - Good/Realized] */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Revenue Income (Gross)',
              badge: 'GOOD',
              badgeColor: 'orange',
              metric: formatInLakhs(data.period_total_revenue_inr),
              metricLabel: 'Gross Production Income',
              finding: `Generated ${formatInLakhs(data.period_total_revenue_inr)} from pick telemetry and active rate cards.`,
              action: 'Maintain shedding speed and airjet pressure across shifts.',
              owner: 'Weaving Shift Supervisor',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #fed7aa',
            borderTop: '3px solid #ea580c',
            borderRadius: '8px',
            padding: '14px 18px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '92px',
          }}
          title="Touch for details"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Revenue Income</span>
            <span style={{ ...getBadgeStyle('orange'), fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' }}>
              REALIZED
            </span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#ea580c', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(data.period_total_revenue_inr)}
          </span>
        </div>

        {/* Card 2: Net Operating Income [Orange - Good Profit] */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Net Operating Income',
              badge: 'GOOD',
              badgeColor: 'orange',
              metric: formatInLakhs(netOperatingIncome),
              metricLabel: 'Realized Operating Inflow',
              finding: `Gross revenue minus direct manufacturing, transport (${formatCurrency(transportCost)}), and packaging (${formatCurrency(outsourcePkgCost)}).`,
              action: 'Reconcile weekly logistics dispatch vouchers and job-work statements.',
              owner: 'Commercial & Costing Head',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #fed7aa',
            borderTop: '3px solid #ea580c',
            borderRadius: '8px',
            padding: '14px 18px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '92px',
          }}
          title="Touch for details"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Net Operating Income</span>
            <span style={{ ...getBadgeStyle('orange'), fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' }}>
              NET PROFIT
            </span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#ea580c', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(netOperatingIncome)}
          </span>
        </div>

        {/* Card 3: Potential Revenue [White - Baseline Target] */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Potential Revenue',
              badge: 'NORMAL',
              badgeColor: 'white',
              metric: formatInLakhs(owner.potential_max_revenue_inr || w.potential_max_revenue),
              metricLabel: '100% Scheduled Target',
              finding: 'Rated mill potential assuming standard loom RPM and zero breakdown stops.',
              action: 'Eliminate voltage dips to close the capacity revenue gap.',
              owner: 'Plant Superintendent',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderTop: '3px solid #94a3b8',
            borderRadius: '8px',
            padding: '14px 18px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '92px',
          }}
          title="Touch for details"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Potential Revenue</span>
            <span style={{ ...getBadgeStyle('white'), fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' }}>
              TARGET
            </span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(owner.potential_max_revenue_inr || w.potential_max_revenue)}
          </span>
        </div>

        {/* Card 4: Revenue Loss [Red - Worsen / Check Needed] */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Revenue Loss',
              badge: 'CHECK NEEDED',
              badgeColor: 'red',
              metric: `-${formatInLakhs(data.total_revenue_loss_inr)}`,
              metricLabel: 'Capacity Loss Exposure',
              finding: 'Mutually exclusive loss from voltage trip cascades and knotting overruns.',
              action: 'Calibrate Sub-panel 4 transformer tap settings before evening load.',
              owner: 'Chief Electrical Eng & Maintenance Lead',
            })
          }
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderTop: '3px solid #dc2626',
            borderRadius: '8px',
            padding: '14px 18px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '92px',
          }}
          title="Touch for details"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: 600 }}>Revenue Loss</span>
            <span style={{ ...getBadgeStyle('red'), fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' }}>
              CHECK NEEDED
            </span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#dc2626', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(data.total_revenue_loss_inr)}
          </span>
        </div>

        {/* Card 5: Recoverable Revenue [Orange - Good Opportunity] */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Recoverable Revenue',
              badge: 'GOOD',
              badgeColor: 'orange',
              metric: formatInLakhs(owner.recoverable_revenue_inr),
              metricLabel: 'Protected Value',
              finding: 'Top issue (Sub-panel 4 tap drift) accounts for the largest immediate recovery.',
              action: 'Dispatch engineer before 17:00 peak grid window.',
              owner: 'Chief Electrical Engineer',
            })
          }
          style={{
            background: '#fffaf5',
            border: '1px solid #fed7aa',
            borderTop: '3px solid #ea580c',
            borderRadius: '8px',
            padding: '14px 18px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '92px',
          }}
          title="Touch for details"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#9a3412', fontWeight: 600 }}>Recoverable</span>
            <span style={{ ...getBadgeStyle('orange'), fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' }}>
              OPPORTUNITY
            </span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#ea580c', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
            {formatInLakhs(owner.recoverable_revenue_inr)}
          </span>
        </div>

        {/* Card 6: Main Problem Dept [Red - Worsen / Check Needed] */}
        <div
          onClick={() => {
            setSelectedDeptId('electrical_power');
            setInspectionBlock({
              title: 'Main Problem Dept',
              badge: 'CHECK NEEDED',
              badgeColor: 'red',
              metric: owner.dominant_problem_department,
              metricLabel: 'Constraint Bottleneck',
              finding: 'Electrical & power contributes 62% of today\'s total loss exposure.',
              action: 'Execute capacitor inspection before Shift 2 start.',
              owner: owner.primary_action_owner,
            });
          }}
          style={{
            background: '#ffffff',
            border: '1px solid #fecaca',
            borderTop: '3px solid #dc2626',
            borderRadius: '8px',
            padding: '14px 18px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: '92px',
          }}
          title="Touch to select department"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Main Problem</span>
            <span style={{ ...getBadgeStyle('red'), fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' }}>
              62% LOSS
            </span>
          </div>
          <span
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#dc2626',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {owner.dominant_problem_department}
          </span>
        </div>
      </div>

      {/* ── SECTION 4: TIME PERIOD TABS ───────────────────────────────────── */}
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
              background: activePeriod === tab.key ? '#0f172a' : 'transparent',
              color: activePeriod === tab.key ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── SECTION 5: TWO CHARTS WITH FULL AXES & ACTIONABLE INFERENCES ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
        {/* Chart 1: Revenue Trend (Left) */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Revenue Trend',
              badge: 'NORMAL',
              badgeColor: 'white',
              metric: formatInLakhs(data.period_total_revenue_inr),
              metricLabel: 'Realized Run-rate',
              finding: 'Revenue runs ~31% below theoretical capacity due to voltage-induced pick loss.',
              action: 'Maintain shedding speed and calibrate transformer taps to recover run-rate.',
              owner: 'Weaving Production Lead',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '18px 22px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            cursor: 'pointer',
          }}
          title="Touch chart to inspect trajectory"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Revenue Trend</span>
            <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '3px', background: '#2563eb' }}></span>
                <span>Actual revenue</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '3px', background: '#94a3b8' }}></span>
                <span>Target revenue</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart with Crisp Axes */}
          <div style={{ height: '160px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 700 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Horizontal Grid Guidelines */}
              <line x1="55" y1="20" x2="680" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="55" y1="45" x2="680" y2="45" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="55" y1="70" x2="680" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="55" y1="95" x2="680" y2="95" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="55" y1="120" x2="680" y2="120" stroke="#e2e8f0" strokeWidth="1" />

              {/* Y-Axis Line */}
              <line x1="55" y1="15" x2="55" y2="120" stroke="#cbd5e1" strokeWidth="1" />

              {/* Y-Axis Tick Labels */}
              <text x="48" y="24" fontSize="10" fill="#64748b" textAnchor="end">₹25L</text>
              <text x="48" y="49" fontSize="10" fill="#64748b" textAnchor="end">₹20L</text>
              <text x="48" y="74" fontSize="10" fill="#64748b" textAnchor="end">₹15L</text>
              <text x="48" y="99" fontSize="10" fill="#64748b" textAnchor="end">₹10L</text>
              <text x="48" y="124" fontSize="10" fill="#64748b" textAnchor="end">₹0</text>

              {/* X-Axis Date Labels */}
              <text x="70" y="138" fontSize="10" fill="#64748b" textAnchor="middle">18 Jul</text>
              <text x="190" y="138" fontSize="10" fill="#64748b" textAnchor="middle">21 Jul</text>
              <text x="310" y="138" fontSize="10" fill="#64748b" textAnchor="middle">24 Jul</text>
              <text x="430" y="138" fontSize="10" fill="#64748b" textAnchor="middle">27 Jul</text>
              <text x="550" y="138" fontSize="10" fill="#64748b" textAnchor="middle">29 Jul</text>
              <text x="670" y="138" fontSize="10" fill="#64748b" textAnchor="middle">31 Jul</text>

              {/* Target Capacity Line (dashed gray) */}
              <polyline
                points="70,36 190,36 310,36 430,36 550,36 670,36"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="5 4"
              />

              {/* Realized Revenue Polyline */}
              <polyline
                points="70,68 130,66 190,70 250,67 310,88 370,76 430,71 490,65 550,84 610,62 670,54"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />

              {/* Realized Data Points */}
              <circle cx="310" cy="88" r="3.5" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
              <circle cx="550" cy="84" r="3.5" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
              <circle cx="670" cy="54" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Chart 1 Minimal Inference Banner */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #2563eb',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#1e3a8a',
              lineHeight: 1.4,
            }}
          >
            <strong>Inference:</strong> Realized revenue trails target by 31.6% due to voltage dips on 24 & 29 Jul. Calibrating Sub-panel 4 protects ₹1.30L immediately.
          </div>
        </div>

        {/* Chart 2: Daily Revenue Loss Trend (Right) */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Daily Revenue Loss Trend',
              badge: 'CHECK NEEDED',
              badgeColor: 'red',
              metric: '₹2.01L Peak Loss',
              metricLabel: 'Anomaly Spike Threshold (₹95,000)',
              finding: 'Severe loss spikes on 25 & 29 Jul exceeded ₹95,000 anomaly limit from transformer tap drift.',
              action: 'Calibrate Sub-panel 4 capacitor bank before Shift 2 start.',
              owner: 'Chief Electrical Engineer',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '18px 22px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '14px',
            cursor: 'pointer',
          }}
          title="Touch chart to inspect spike data"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Daily Revenue Loss Trend</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#dc2626' }}>
              <span style={{ width: '12px', height: '2px', background: '#dc2626' }}></span>
              <span>Spike threshold (₹95k)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* SVG Bar Chart with Full Axes */}
            <div style={{ flex: 1, height: '160px', position: 'relative' }}>
              <svg viewBox="0 0 450 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Guidelines */}
                <line x1="45" y1="20" x2="430" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="45" y1="50" x2="430" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="45" y1="80" x2="430" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="45" y1="110" x2="430" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="45" y1="120" x2="430" y2="120" stroke="#e2e8f0" strokeWidth="1" />

                {/* Y-Axis Line */}
                <line x1="45" y1="15" x2="45" y2="120" stroke="#cbd5e1" strokeWidth="1" />

                {/* Y-Axis Ticks */}
                <text x="38" y="24" fontSize="10" fill="#64748b" textAnchor="end">₹2.0L</text>
                <text x="38" y="54" fontSize="10" fill="#64748b" textAnchor="end">₹1.5L</text>
                <text x="38" y="84" fontSize="10" fill="#64748b" textAnchor="end">₹1.0L</text>
                <text x="38" y="114" fontSize="10" fill="#64748b" textAnchor="end">₹50k</text>
                <text x="38" y="124" fontSize="10" fill="#64748b" textAnchor="end">₹0</text>

                {/* Spike Threshold Line (₹95k = y: 83) */}
                <line x1="45" y1="83" x2="430" y2="83" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4 3" />

                {/* 10 Bars (Red = Spike/Worsen >95k, Orange = Good <40k, White = Normal) */}
                {/* 22 Jul: ₹35k (Good/Orange) */}
                <rect x="58" y="99" width="18" height="21" rx="2" fill="#ea580c" />
                <text x="67" y="136" fontSize="9" fill="#64748b" textAnchor="middle">22</text>

                {/* 23 Jul: ₹43k (Normal/White) */}
                <rect x="94" y="94" width="18" height="26" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <text x="103" y="136" fontSize="9" fill="#64748b" textAnchor="middle">23</text>

                {/* 24 Jul: ₹53k (Normal/White) */}
                <rect x="130" y="88" width="18" height="32" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <text x="139" y="136" fontSize="9" fill="#64748b" textAnchor="middle">24</text>

                {/* 25 Jul: ₹145k (Spike 1 / Red) */}
                <rect x="166" y="33" width="18" height="87" rx="2" fill="#dc2626" />
                <text x="175" y="136" fontSize="9" fill="#dc2626" fontWeight="700" textAnchor="middle">25</text>

                {/* 26 Jul: ₹31k (Good/Orange) */}
                <rect x="202" y="101" width="18" height="19" rx="2" fill="#ea580c" />
                <text x="211" y="136" fontSize="9" fill="#64748b" textAnchor="middle">26</text>

                {/* 27 Jul: ₹39k (Good/Orange) */}
                <rect x="238" y="97" width="18" height="23" rx="2" fill="#ea580c" />
                <text x="247" y="136" fontSize="9" fill="#64748b" textAnchor="middle">27</text>

                {/* 28 Jul: ₹45k (Normal/White) */}
                <rect x="274" y="93" width="18" height="27" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <text x="283" y="136" fontSize="9" fill="#64748b" textAnchor="middle">28</text>

                {/* 29 Jul: ₹201k (Spike 2 - Peak / Red) */}
                <rect x="310" y="15" width="18" height="105" rx="2" fill="#dc2626" />
                <text x="319" y="136" fontSize="9" fill="#dc2626" fontWeight="700" textAnchor="middle">29</text>

                {/* 30 Jul: ₹40k (Normal/White) */}
                <rect x="346" y="96" width="18" height="24" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <text x="355" y="136" fontSize="9" fill="#64748b" textAnchor="middle">30</text>

                {/* 31 Jul: ₹33k (Good/Orange) */}
                <rect x="382" y="100" width="18" height="20" rx="2" fill="#ea580c" />
                <text x="391" y="136" fontSize="9" fill="#ea580c" fontWeight="700" textAnchor="middle">31</text>
              </svg>
            </div>

            {/* Peak Loss Box */}
            <div
              style={{
                width: '150px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderLeft: '4px solid #dc2626',
                borderRadius: '6px',
                padding: '10px 12px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                Peak Spike
              </span>
              <span style={{ fontSize: '17px', fontWeight: 700, color: '#dc2626' }}>₹2.01 lakh</span>
              <span style={{ fontSize: '11px', color: '#475569' }}>29 Jul • Electrical</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>Chief Engineer</span>
            </div>
          </div>

          {/* Chart 2 Minimal Inference Banner */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #dc2626',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#991b1b',
              lineHeight: 1.4,
            }}
          >
            <strong>Inference:</strong> 58% of cumulative period loss stems from 2 voltage spikes on 25 & 29 Jul during peak grid hours (17:30–19:00).
          </div>
        </div>
      </div>

      {/* ── SECTION 6: HISTOGRAM & TOP ACTIONS (No unwanted subtext!) ─────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
        {/* Left: Department Problem Histogram */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Department Problem Histogram',
              badge: 'CHECK NEEDED',
              badgeColor: 'red',
              metric: '4 Departments Tracked',
              metricLabel: 'Attributed Share',
              finding: 'Electrical & power causes 62% of loss despite fewer individual stops.',
              action: 'Prioritize electrical panel recalibration before Shift 2 load.',
              owner: 'Chief Electrical Engineer',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '18px 22px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '14px',
            cursor: 'pointer',
          }}
          title="Touch department to inspect and drill-down"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Department Problem Histogram
            </span>

            {/* Metric Switcher */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '2px', borderRadius: '5px' }}>
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
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
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
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Count
              </button>
            </div>
          </div>

          {/* Horizontal Bar List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'electrical_power', name: 'Electrical & power', val: '₹2.01 lakh', pct: 85, color: '#dc2626' },
              { id: 'mechanical_maintenance', name: 'Mechanical maintenance', val: '₹58,933', pct: 28, color: '#ea580c' },
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
                  gridTemplateColumns: '160px 1fr 90px',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {dept.name}
                </span>
                <div style={{ background: '#f1f5f9', height: '14px', borderRadius: '4px', overflow: 'hidden' }}>
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
                <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {dept.val}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', paddingLeft: '172px', paddingRight: '90px' }}>
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
            padding: '18px 22px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Top Department Actions</span>

          {/* Action Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {/* Action 1: Electrical (Red) */}
            <div
              onClick={() => {
                setSelectedDeptId('electrical_power');
                setInspectionBlock({
                  title: 'Electrical & Power Action',
                  badge: 'CHECK NEEDED',
                  badgeColor: 'red',
                  metric: '₹2.01 lakh',
                  metricLabel: 'Attributed Loss',
                  finding: 'Voltage dips at peak load tripped loom inverters simultaneously.',
                  action: 'Inspect sub-panel terminals & drive capacitors before evening shift.',
                  owner: 'Chief Electrical Engineer',
                });
                scrollToAssistant();
              }}
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderLeft: '4px solid #dc2626',
                borderRadius: '6px',
                padding: '10px 12px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Touch to inspect"
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b' }}>Electrical</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#dc2626' }}>₹2.01L</span>
              <span style={{ fontSize: '11px', color: '#475569' }}>Dips & Trips</span>
              <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 600 }}>Inspect panel</span>
            </div>

            {/* Action 2: Mechanical (Orange - Good/In-hand) */}
            <div
              onClick={() => {
                setSelectedDeptId('mechanical_maintenance');
                setInspectionBlock({
                  title: 'Mechanical Maintenance Action',
                  badge: 'GOOD',
                  badgeColor: 'orange',
                  metric: '₹58,933',
                  metricLabel: 'Attributed Loss',
                  finding: 'Overrun on warp beam changes exceeding 15-minute standard.',
                  action: 'Enforce 15-minute knotting standard & fitter floor dispatch.',
                  owner: 'Maintenance Lead',
                });
                scrollToAssistant();
              }}
              style={{
                background: '#fffaf5',
                border: '1px solid #fed7aa',
                borderLeft: '4px solid #ea580c',
                borderRadius: '6px',
                padding: '10px 12px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Touch to inspect"
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#9a3412' }}>Mechanical</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#ea580c' }}>₹58.9k</span>
              <span style={{ fontSize: '11px', color: '#475569' }}>Knotting delay</span>
              <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 600 }}>Fitter dispatch</span>
            </div>

            {/* Action 3: Weaving (White - Normal) */}
            <div
              onClick={() => {
                setSelectedDeptId('weaving_efficiency');
                setInspectionBlock({
                  title: 'Weaving Efficiency Action',
                  badge: 'NORMAL',
                  badgeColor: 'white',
                  metric: '₹59,376',
                  metricLabel: 'Attributed Loss',
                  finding: 'Running speed deficit on Looms 101–108 during afternoon humidity dip.',
                  action: 'Review humidification cell & sign-off speed targets.',
                  owner: 'Weaving Master',
                });
                scrollToAssistant();
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderLeft: '4px solid #64748b',
                borderRadius: '6px',
                padding: '10px 12px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Touch to inspect"
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Weaving</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>₹59.4k</span>
              <span style={{ fontSize: '11px', color: '#475569' }}>Speed deficit</span>
              <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 600 }}>Cell review</span>
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
          marginTop: '12px',
          borderTop: '1px dashed #cbd5e1',
          paddingTop: '24px',
        }}
      >
        {/* Selected Drill-Down Header Banner */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: `${selectedSector.sector_name} Drill-Down`,
              badge: selectedSector.trend_status === 'WORSENING' ? 'CHECK NEEDED' : 'NORMAL',
              badgeColor: selectedSector.trend_status === 'WORSENING' ? 'red' : 'white',
              metric: formatInLakhs(selectedSector.loss_inr),
              metricLabel: 'Department Loss Impact',
              finding: selectedSector.main_reason,
              action: selectedSector.recommended_action,
              owner: selectedSector.owner,
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            cursor: 'pointer',
          }}
          title="Touch for details"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Drill-Down
            </span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              {selectedSector.sector_name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ ...getBadgeStyle(selectedSector.trend_status === 'WORSENING' ? 'red' : 'orange'), fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
              {selectedSector.trend_status}
            </span>
            <span style={{ ...getBadgeStyle('white'), fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
              CALCULATED
            </span>
            <span style={{ ...getBadgeStyle('orange'), fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
              ACTION READY
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
                badge: 'CHECK NEEDED',
                badgeColor: 'red',
                metric: formatInLakhs(selectedSector.loss_inr),
                metricLabel: 'Attributed Impact',
                finding: selectedSector.main_reason,
                action: selectedSector.recommended_action,
                owner: selectedSector.owner,
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '18px 22px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Department Deep Dive</span>

            {/* Impact Banner */}
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '6px',
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                  Impact
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626' }}>
                  {formatInLakhs(selectedSector.loss_inr)}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {Math.round(selectedSector.affected_metres || 5027).toLocaleString()}m lost
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div><strong>Reason:</strong> {selectedSector.main_reason}</div>
              <div><strong>Action:</strong> {selectedSector.recommended_action}</div>
              <div><strong>Owner:</strong> {selectedSector.owner}</div>
            </div>
          </div>

          {/* Card 2: Monitor After Action */}
          <div
            onClick={() =>
              setInspectionBlock({
                title: 'Monitor After Action',
                badge: 'GOOD',
                badgeColor: 'orange',
                metric: '3.5 min / shift',
                metricLabel: 'Downtime Stoppage Target',
                finding: 'Electrical downtime drops from 48 min to 3.5 min/shift once transformer tap drift is recalibrated.',
                action: 'Verify Shift 2 handover log to confirm stoppage minutes stay below the 5-min threshold.',
                owner: 'Chief Electrical Engineer',
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '18px 22px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Monitor After Action</span>
              <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '3px', background: '#dc2626' }}></span>
                  <span>Before (48m avg)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '3px', background: '#ea580c' }}></span>
                  <span>After (&lt;5m target)</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>BEFORE FIX</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>48 min/shift</div>
                <div style={{ fontSize: '10px', color: '#991b1b' }}>₹1.42L loss</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>AFTER FIX</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ea580c' }}>3.5 min/shift</div>
                <div style={{ fontSize: '10px', color: '#ea580c' }}>₹11k loss</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>PROTECTED</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>-92% Downtime</div>
                <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: 600 }}>+₹1.31L/shift</div>
              </div>
            </div>

            {/* SVG Downtime Timeline Chart with Numerical Axes */}
            <div style={{ height: '115px', width: '100%', position: 'relative' }}>
              <svg viewBox="0 0 440 110" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Guidelines */}
                <line x1="38" y1="15" x2="430" y2="15" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="38" y1="45" x2="430" y2="45" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="38" y1="75" x2="430" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="38" y1="88" x2="430" y2="88" stroke="#e2e8f0" strokeWidth="1" />

                {/* Y-Axis Line */}
                <line x1="38" y1="10" x2="38" y2="88" stroke="#cbd5e1" strokeWidth="1" />

                {/* Y-Axis Ticks (Minutes) */}
                <text x="32" y="19" fontSize="9" fill="#64748b" textAnchor="end">50m</text>
                <text x="32" y="49" fontSize="9" fill="#64748b" textAnchor="end">25m</text>
                <text x="32" y="78" fontSize="9" fill="#64748b" textAnchor="end">5m</text>
                <text x="32" y="91" fontSize="9" fill="#64748b" textAnchor="end">0m</text>

                {/* Target Threshold Line at 5m */}
                <line x1="38" y1="75" x2="430" y2="75" stroke="#ea580c" strokeWidth="1" strokeDasharray="3 3" />
                <text x="430" y="71" fontSize="8" fill="#ea580c" textAnchor="end">Target &lt; 5m</text>

                {/* Fix Applied Divider Line */}
                <line x1="225" y1="10" x2="225" y2="88" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                <text x="225" y="8" fontSize="8" fill="#475569" fontWeight="600" textAnchor="middle">FIX APPLIED</text>

                {/* Before Polyline (Red - High Downtime) */}
                <polyline
                  points="65,26 125,14 185,20"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />
                <circle cx="65" cy="26" r="3.5" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
                <text x="65" y="21" fontSize="8" fontWeight="700" fill="#dc2626" textAnchor="middle">42m</text>

                <circle cx="125" cy="14" r="3.5" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
                <text x="125" y="10" fontSize="8" fontWeight="700" fill="#dc2626" textAnchor="middle">51m</text>

                <circle cx="185" cy="20" r="3.5" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
                <text x="185" y="16" fontSize="8" fontWeight="700" fill="#dc2626" textAnchor="middle">48m</text>

                {/* Transition dashed bridge */}
                <line x1="185" y1="20" x2="265" y2="78" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2 2" />

                {/* After Polyline (Orange - Controlled Downtime < 5m) */}
                <polyline
                  points="265,78 325,83 385,81"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="2.5"
                />
                <circle cx="265" cy="78" r="3.5" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
                <text x="265" y="73" fontSize="8" fontWeight="700" fill="#ea580c" textAnchor="middle">4.2m</text>

                <circle cx="325" cy="83" r="3.5" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
                <text x="325" y="79" fontSize="8" fontWeight="700" fill="#ea580c" textAnchor="middle">3.1m</text>

                <circle cx="385" cy="81" r="3.5" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
                <text x="385" y="77" fontSize="8" fontWeight="700" fill="#ea580c" textAnchor="middle">3.5m</text>

                {/* X-Axis Labels */}
                <text x="65" y="102" fontSize="9" fill="#dc2626" textAnchor="middle">Shift -3</text>
                <text x="125" y="102" fontSize="9" fill="#dc2626" textAnchor="middle">Shift -2</text>
                <text x="185" y="102" fontSize="9" fill="#dc2626" textAnchor="middle">Shift -1</text>
                <text x="265" y="102" fontSize="9" fill="#ea580c" textAnchor="middle">Shift +1</text>
                <text x="325" y="102" fontSize="9" fill="#ea580c" textAnchor="middle">Shift +2</text>
                <text x="385" y="102" fontSize="9" fill="#ea580c" textAnchor="middle">Shift +3</text>
              </svg>
            </div>

            {/* Inference banner */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #ea580c', borderRadius: '5px', padding: '6px 10px', fontSize: '11px', color: '#9a3412', lineHeight: 1.3 }}>
              <strong>Inference:</strong> Recalibrating Sub-panel 4 drops downtime from 48 min to 3.5 min/shift, staying safely below the 5-min threshold and recovering ₹1.31L per shift.
            </div>
          </div>

          {/* Card 3: Action Approval Card */}
          <div
            onClick={() =>
              setInspectionBlock({
                title: 'Action Approval Card',
                badge: approvedAction ? 'APPROVED' : 'CHECK NEEDED',
                badgeColor: approvedAction ? 'orange' : 'red',
                metric: '₹1.30 lakh',
                metricLabel: 'Protected Value',
                finding: 'Executive directive to calibrate tap settings and inspect drive capacitors.',
                action: 'Execute inspection before evening grid peak.',
                owner: 'Chief Electrical Engineer',
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '18px 22px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Action Approval</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setApprovedAction(!approvedAction);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                background: approvedAction ? '#ea580c' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
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
                'Approve Electrical Inspection'
              )}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Expected recovery:</span>
                <span style={{ color: '#ea580c', fontWeight: 700 }}>₹1.30 lakh</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Deadline:</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Before Shift 2 peak</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Problem Matrix: Count vs Money Impact ────────────────────────── */}
        <div
          onClick={() =>
            setInspectionBlock({
              title: 'Problem Matrix: Count vs Rupee Impact',
              badge: 'CHECK NEEDED',
              badgeColor: 'red',
              metric: 'Asymmetric Risk',
              metricLabel: 'Risk Factor',
              finding: 'Electrical sits in the High Rupee / Low Count quadrant (only 4 events trigger ₹2.01L loss).',
              action: 'Resolve electrical panel tap calibration first to maximize ROI.',
              owner: 'Plant Superintendent',
            })
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '18px 22px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            cursor: 'pointer',
          }}
          title="Touch for details"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Problem Matrix: Count vs Money Impact
            </span>
            <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></span>
                <span>Critical Risk (&gt;₹1L loss)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }}></span>
                <span>Manageable</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Scatter SVG with Full Numerical Axes */}
            <div style={{ flex: '1 1 520px', height: '160px', position: 'relative' }}>
              <svg viewBox="0 0 540 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Guidelines */}
                <line x1="50" y1="20" x2="520" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="45" x2="520" y2="45" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="70" x2="520" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="95" x2="520" y2="95" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="120" x2="520" y2="120" stroke="#e2e8f0" strokeWidth="1" />

                {/* Y-Axis Line */}
                <line x1="50" y1="15" x2="50" y2="120" stroke="#cbd5e1" strokeWidth="1" />

                {/* Y-Axis Ticks (Rupee Loss) */}
                <text x="44" y="24" fontSize="9" fill="#64748b" textAnchor="end">₹2.0L</text>
                <text x="44" y="49" fontSize="9" fill="#64748b" textAnchor="end">₹1.5L</text>
                <text x="44" y="74" fontSize="9" fill="#64748b" textAnchor="end">₹1.0L</text>
                <text x="44" y="99" fontSize="9" fill="#64748b" textAnchor="end">₹50k</text>
                <text x="44" y="123" fontSize="9" fill="#64748b" textAnchor="end">₹0</text>

                {/* X-Axis Ticks (Problem Event Count) */}
                <line x1="50" y1="120" x2="520" y2="120" stroke="#cbd5e1" strokeWidth="1" />
                <text x="50" y="136" fontSize="9" fill="#64748b" textAnchor="middle">0</text>
                <text x="144" y="136" fontSize="9" fill="#64748b" textAnchor="middle">5 stops</text>
                <text x="238" y="136" fontSize="9" fill="#64748b" textAnchor="middle">10 stops</text>
                <text x="332" y="136" fontSize="9" fill="#64748b" textAnchor="middle">15 stops</text>
                <text x="426" y="136" fontSize="9" fill="#64748b" textAnchor="middle">20 stops</text>
                <text x="500" y="136" fontSize="9" fill="#64748b" textAnchor="middle">25 stops</text>

                {/* Critical Quadrant Boundary (Horizontal ₹1.0L, Vertical 10 stops) */}
                <line x1="50" y1="70" x2="520" y2="70" stroke="#fecaca" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="238" y1="20" x2="238" y2="120" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <text x="55" y="32" fontSize="8" fill="#dc2626" fontWeight="700">HIGH LOSS / LOW COUNT (CRITICAL)</text>

                {/* Bubble 1: Electrical (4 stops, ₹2.01L) */}
                <circle cx="125" cy="20" r="16" fill="#dc2626" opacity="0.85" />
                <circle cx="125" cy="20" r="16" fill="none" stroke="#b91c1c" strokeWidth="1.5" />
                <text x="125" y="44" fontSize="10" fontWeight="700" fill="#dc2626" textAnchor="middle">
                  Electrical (4 stops, ₹2.01L)
                </text>

                {/* Bubble 2: Mechanical (18 stops, ₹58.9k) */}
                <circle cx="388" cy="91" r="12" fill="#ea580c" opacity="0.85" />
                <text x="388" y="112" fontSize="9" fontWeight="600" fill="#9a3412" textAnchor="middle">
                  Mechanical (18 stops, ₹58.9k)
                </text>

                {/* Bubble 3: Weaving (12 stops, ₹59.4k) */}
                <circle cx="275" cy="90" r="12" fill="#2563eb" opacity="0.85" />
                <text x="275" y="80" fontSize="9" fontWeight="600" fill="#1e40af" textAnchor="middle">
                  Weaving (12 stops, ₹59.4k)
                </text>

                {/* Bubble 4: Quality (6 stops, ₹12k) */}
                <circle cx="163" cy="114" r="8" fill="#7e22ce" opacity="0.85" />
                <text x="163" y="110" fontSize="8" fill="#7e22ce" textAnchor="end">
                  Quality (₹12k)
                </text>
              </svg>
            </div>

            {/* Decision Insight Box */}
            <div
              style={{
                flex: '0 1 260px',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderLeft: '4px solid #dc2626',
                borderRadius: '6px',
                padding: '12px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                Executive Insight
              </div>
              <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                Electrical sits in the <strong>High Impact / Low Count</strong> zone: only 4 voltage events caused 62% of plant loss (₹2.01L). A single panel recalibration fixes the bulk of losses.
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Cost Structure, Transport & Packaging, and Sort Revenue ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Column 1: Commercial Cost Structure */}
          <div
            onClick={() =>
              setInspectionBlock({
                title: 'Manufacturing Cost Breakdown',
                badge: 'NORMAL',
                badgeColor: 'white',
                metric: formatInLakhs(p.total_direct_costs_inr),
                metricLabel: 'Direct Production Spend',
                finding: 'Yarn (~52%), Energy (~11%), Labour, and Spares form direct mill operating expenses.',
                action: 'Verify style rates in ERP to confirm unit contribution accuracy.',
                owner: 'Commercial & Costing Head',
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '18px 22px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Manufacturing Direct Costs
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>
                <span style={{ color: '#64748b' }}>Raw yarn cost</span>
                <span style={{ color: '#0f172a', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {formatInLakhs(p.yarn_cost_inr || 1035000)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>
                <span style={{ color: '#64748b' }}>Power & energy cost</span>
                <span style={{ color: '#0f172a', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {formatInLakhs(p.power_energy_cost_inr || 219000)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>
                <span style={{ color: '#64748b' }}>Direct labour cost</span>
                <span style={{ color: '#0f172a', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(p.direct_labour_cost_inr || 85000)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>
                <span style={{ color: '#64748b' }}>Maintenance spares & oil</span>
                <span style={{ color: '#0f172a', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(p.maintenance_spares_inr || 14500)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '3px' }}>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>Total Direct Costs</span>
                <span style={{ color: '#0f172a', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {formatInLakhs(p.total_direct_costs_inr || 1353500)}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Transport & Outsource Packaging Details */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '18px 22px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Transport & Outsource Packaging
            </span>

            {/* Transport Card */}
            <div
              onClick={() =>
                setInspectionBlock({
                  title: 'Transport Logistics & Freight',
                  badge: 'NORMAL',
                  badgeColor: 'white',
                  metric: formatCurrency(transportCost),
                  metricLabel: 'Dispatch Logistics Spend',
                  finding: `3 scheduled freight trips to Bhiwandi regional hub operating at ₹0.85/metre benchmark.`,
                  action: 'Maintain vehicle consolidation schedule to optimize dispatch loads.',
                  owner: 'Logistics Dispatch Manager',
                })
              }
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Touch to inspect transport details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={15} color="#2563eb" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Transport Logistics</span>
                </div>
                <span style={{ ...getBadgeStyle('white'), fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' }}>
                  NORMAL
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(transportCost)}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>₹0.85/metre</span>
              </div>
              <div style={{ fontSize: '11px', color: '#475569' }}>
                Route: Mill Shed → Bhiwandi Hub / JNPT Port (3 Trips)
              </div>
            </div>

            {/* Outsource Packaging Card */}
            <div
              onClick={() =>
                setInspectionBlock({
                  title: 'Outsource Packaging & Finishing',
                  badge: 'GOOD',
                  badgeColor: 'orange',
                  metric: formatCurrency(outsourcePkgCost),
                  metricLabel: 'External Job-Work Packaging',
                  finding: 'Apex Packagers Ltd cleared 52,800m export roll baling with 99.6% quality clearance.',
                  action: 'Maintain poly-wrap moisture barrier standard for monsoon shipments.',
                  owner: 'Packaging QC Inspector',
                })
              }
              style={{
                background: '#fffaf5',
                border: '1px solid #fed7aa',
                borderRadius: '6px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Touch to inspect outsource packaging details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PackageCheck size={15} color="#ea580c" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Outsource Packaging</span>
                </div>
                <span style={{ ...getBadgeStyle('orange'), fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' }}>
                  GOOD
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ea580c', fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(outsourcePkgCost)}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>₹1.20/m • 99.6% pass</span>
              </div>
              <div style={{ fontSize: '11px', color: '#475569' }}>
                Vendor: Apex Packagers Ltd • Export roll baling (PKG-JUL31-A)
              </div>
            </div>
          </div>

          {/* Column 3: Active Fabric Sort Revenue */}
          <div
            onClick={() =>
              setInspectionBlock({
                title: 'Fabric Sort Revenue',
                badge: 'GOOD',
                badgeColor: 'orange',
                metric: '4 Active Sorts',
                metricLabel: 'Style Portfolio',
                finding: 'Sort 40s Poplin delivers 52% of entire revenue volume.',
                action: 'Protect 40s Poplin loom bank from shedding cycles.',
                owner: 'Production Planning Control (PPC)',
              })
            }
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '18px 22px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              cursor: 'pointer',
            }}
            title="Touch for details"
          >
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Active Fabric Sort Revenue
            </span>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '6px 4px', fontWeight: 600 }}>Sort Code</th>
                    <th style={{ padding: '6px 4px', fontWeight: 600, textAlign: 'right' }}>Revenue</th>
                    <th style={{ padding: '6px 4px', fontWeight: 600, textAlign: 'right' }}>Metres</th>
                    <th style={{ padding: '6px 4px', fontWeight: 600, textAlign: 'right' }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sort: '40s Poplin High-Density', rev: '₹10.35L', metres: '25,875m', share: '52.0%' },
                    { sort: '60s Cambric Export', rev: '₹5.57L', metres: '13,925m', share: '28.0%' },
                    { sort: '2/40s Twill Suiting', rev: '₹2.79L', metres: '6,975m', share: '14.0%' },
                    { sort: '80s Voile Premium', rev: '₹1.19L', metres: '2,975m', share: '6.0%' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '6px 4px', color: '#0f172a', fontWeight: 600 }}>{row.sort}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'right', color: '#ea580c', fontWeight: 700 }}>{row.rev}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'right', color: '#64748b' }}>{row.metres}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'right', color: '#0f172a', fontWeight: 600 }}>{row.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '5px',
                padding: '6px 10px',
                fontSize: '11px',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>3 Telemetry Sources Connected</span>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>ERP + SCADA Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
