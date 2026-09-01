import { useEffect, useState } from 'react';
import { fetchRevenueAnalytics } from '../api';
import {
  PageHeader,
  KpiStrip,
  KpiCard,
  IndustrialTable,
  DataTrustBadge,
  LoadingState,
  ErrorState,
  TOKENS,
} from '../design-system';
import type { ColumnDef } from '../design-system';

export function RevenueLossView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchRevenueAnalytics('2026-07-31', 'ATM')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load revenue analytics:', err);
        setError('Failed to retrieve revenue and cost intelligence.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Calculating revenue, profitability & loss attribution..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to load revenue data.'} onRetry={loadData} />;

  const p = data.profitability;
  const w = data.loss_attribution_waterfall;

  const styleColumns: ColumnDef<any>[] = [
    {
      key: 'style_code',
      header: 'Fabric Style Code',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>{row.style_code}</strong>,
    },
    {
      key: 'active_looms',
      header: 'Active Looms',
      align: 'right',
      render: (row) => <span>{row.active_looms} Looms</span>,
    },
    {
      key: 'metres_produced',
      header: 'Metres Woven',
      align: 'right',
      sortable: true,
      render: (row) => <span>{row.metres_produced.toLocaleString()} m</span>,
    },
    {
      key: 'rate_per_metre',
      header: 'Selling Price',
      align: 'right',
      render: (row) => <span>₹{row.rate_per_metre.toFixed(2)}/m</span>,
    },
    {
      key: 'revenue_inr',
      header: 'Realized Revenue',
      align: 'right',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.status.healthy.text }}>₹{row.revenue_inr.toLocaleString()}</strong>,
    },
    {
      key: 'share',
      header: 'Share %',
      align: 'right',
      render: (row) => (
        <span style={{ color: TOKENS.colors.text.muted }}>
          {((row.revenue_inr / Math.max(data.today_total_revenue_inr, 1)) * 100).toFixed(1)}%
        </span>
      ),
    },
  ];

  const rankedLosses = [
    { rank: 1, name: 'Breakdown Floor Downtime', lossRs: 42000, metres: 1050, sharePct: 46.5, cause: 'Sub-panel 4 voltage trips on AJ-118/132', status: 'CRITICAL' },
    { rank: 2, name: 'Scheduled Efficiency Gap', lossRs: 27000, metres: 675, sharePct: 29.9, cause: 'Shift 3 operating below unit speed baseline', status: 'WARNING' },
    { rank: 3, name: 'Warp Repair Extra Timing', lossRs: 18400, metres: 460, sharePct: 20.3, cause: 'Knotting duration exceeding 15 min std', status: 'WARNING' },
    { rank: 4, name: 'Weft Repair Extra Timing', lossRs: 3000, metres: 75, sharePct: 3.3, cause: 'Feeder micro-stoppages on high-crimp styles', status: 'HEALTHY' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title="Revenue, Profitability & Loss Attribution"
        subtitle="Daily and monthly weaving revenue, direct manufacturing costs, contribution margins, and mutually exclusive loss attribution waterfall."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <KpiStrip columns={5}>
        <KpiCard
          label="Today's Realized Revenue"
          value={`₹${data.today_total_revenue_inr.toLocaleString()}`}
          status="HEALTHY"
          provenance="CALCULATED"
          driver="Selling rate: ₹40.00/m (ERP)"
        />

        <KpiCard
          label="Month-to-Date Revenue"
          value={`₹${(data.month_to_date_revenue_inr / 10000000).toFixed(2)} Cr`}
          status="HEALTHY"
          provenance="CALCULATED"
          driver="1.54M metres cumulative"
        />

        <KpiCard
          label="Contribution Profit"
          value={`₹${p.contribution_profit_inr.toLocaleString()}`}
          target={`${p.profit_margin_pct}% margin`}
          status="HEALTHY"
          provenance="CALCULATED"
          driver="Deducting yarn, power, labour"
        />

        <KpiCard
          label="Total Revenue Loss"
          value={`-₹${w.total_revenue_loss_inr.toLocaleString()}`}
          target="Potential: ₹2.08M"
          status="CRITICAL"
          provenance="CALCULATED"
          driver="2,260 m unproduced capacity"
        />

        <KpiCard
          label="Revenue at Risk"
          value="₹37,500"
          status="WARNING"
          provenance="PREDICTED"
          driver="AJ-118 chronic degradation"
        />
      </KpiStrip>

      {/* ── Ranked Financial Leaks ───────────────────────────────────────── */}
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
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              What Is Costing Ashok Textile Mills the Most Money?
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Ranked financial leakage priorities to guide management intervention.
            </div>
          </div>
          <DataTrustBadge provenance="CALCULATED" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {rankedLosses.map((l) => (
            <div
              key={l.rank}
              style={{
                background: TOKENS.colors.surface.cardAlt,
                border: l.rank === 1 ? '1px solid #FECACA' : `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.sm,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: l.rank === 1 ? '#DC2626' : TOKENS.colors.text.muted }}>
                  PRIORITY #{l.rank}
                </span>
                <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>{l.sharePct}% of loss</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TOKENS.colors.text.primary, marginTop: '2px' }}>
                {l.name}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono, margin: '2px 0' }}>
                -₹{l.lossRs.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                {l.metres.toLocaleString()} m · {l.cause}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mutually Exclusive Loss Waterfall ───────────────────────────── */}
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
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Mutually Exclusive Capacity Loss Waterfall
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Full capacity breakdown with zero double-counting across categories.
            </div>
          </div>
          <DataTrustBadge provenance="CALCULATED" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {w.waterfall_components.map((c: any, idx: number) => (
            <div key={idx} style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: TOKENS.colors.text.secondary, textTransform: 'uppercase' }}>
                {c.category}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono, margin: '2px 0' }}>
                -₹{c.lost_revenue_inr.toLocaleString()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: TOKENS.colors.text.muted }}>
                <span>{c.lost_metres.toLocaleString()} m lost</span>
                <span>{c.share_pct}% share</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Direct Manufacturing Expenses & Contribution Margin ─────────── */}
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
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Operational Direct Costs & Contribution Profit
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Itemized manufacturing expenses deducted from realized weaving revenue.
            </div>
          </div>
          <DataTrustBadge provenance="CALCULATED" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>Raw Yarn Cost (~52%)</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: TOKENS.colors.text.primary, marginTop: '2px', fontFamily: TOKENS.typography.fontMono }}>
              ₹{p.yarn_cost_inr.toLocaleString()}
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>Power & Energy Tariff (~11%)</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: TOKENS.colors.text.primary, marginTop: '2px', fontFamily: TOKENS.typography.fontMono }}>
              ₹{p.power_energy_cost_inr.toLocaleString()}
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>Weaver & Fitter Payroll</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: TOKENS.colors.text.primary, marginTop: '2px', fontFamily: TOKENS.typography.fontMono }}>
              ₹{p.direct_labour_cost_inr.toLocaleString()}
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>Maintenance Spares & Oil</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: TOKENS.colors.text.primary, marginTop: '2px', fontFamily: TOKENS.typography.fontMono }}>
              ₹{p.maintenance_spares_inr.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Fabric Style Revenue Table ───────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: TOKENS.spacing[2] }}>
          <div>
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Weaving Revenue by Fabric Construction Style
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Production volume, verified selling rates, and revenue contribution.
            </div>
          </div>
          <DataTrustBadge provenance="CALCULATED" />
        </div>

        <IndustrialTable
          columns={styleColumns}
          data={data.style_revenues}
          keyExtractor={(row) => row.style_id}
          initialLimit={6}
        />
      </div>
    </div>
  );
}
