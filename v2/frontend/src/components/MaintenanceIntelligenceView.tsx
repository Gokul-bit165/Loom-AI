import { useEffect, useState } from 'react';
import { fetchMaintenanceAnalytics } from '../api';
import {
  PageHeader,
  KpiStrip,
  KpiCard,
  IndustrialTable,
  StatusBadge,
  DataTrustBadge,
  LoadingState,
  ErrorState,
  TOKENS,
} from '../design-system';
import type { ColumnDef } from '../design-system';

export function MaintenanceIntelligenceView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchMaintenanceAnalytics('2026-07-31', 'ATM')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load maintenance data:', err);
        setError('Failed to retrieve maintenance schedules.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading maintenance schedule & compliance..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to load maintenance data.'} onRetry={loadData} />;

  const maintColumns: ColumnDef<any>[] = [
    {
      key: 'loom_no',
      header: 'Loom No',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>{row.loom_no}</strong>,
    },
    {
      key: 'maintenance_type',
      header: 'Type',
      render: (row) => <span style={{ color: TOKENS.colors.text.muted }}>{row.maintenance_type}</span>,
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (row) => <span>{row.due_date}</span>,
    },
    {
      key: 'scheduled_duration_min',
      header: 'Sched (min)',
      align: 'right',
      render: (row) => <span>{row.scheduled_duration_min} min</span>,
    },
    {
      key: 'actual_duration_min',
      header: 'Actual (min)',
      align: 'right',
      render: (row) => <span>{row.actual_duration_min} min</span>,
    },
    {
      key: 'overrun_min',
      header: 'Overrun',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: row.overrun_min > 0 ? TOKENS.colors.status.critical.text : TOKENS.colors.status.healthy.text }}>
          +{row.overrun_min} min ({row.overrun_pct}%)
        </strong>
      ),
    },
    {
      key: 'technician',
      header: 'Technician',
      render: (row) => <span>{row.technician}</span>,
    },
    {
      key: 'recurring_flag',
      header: 'Recurring?',
      align: 'center',
      render: (row) => (
        row.recurring_flag ? <StatusBadge status="CRITICAL" label="RECURRING" /> : <span style={{ color: TOKENS.colors.text.dim }}>No</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title="Maintenance Intelligence (Q12–Q14)"
        subtitle="Preventive maintenance schedule compliance, duration overrun tracking, and 24h predictive breakdown risks."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <KpiStrip columns={4}>
        <KpiCard
          label="Scheduled PM Tasks Today"
          value={`${data.scheduled_today_count} Looms`}
          target="All Fitters Assigned"
          status="HEALTHY"
          provenance="ACTUAL"
          driver="Standard 120-min routine service"
        />

        <KpiCard
          label="Overdue PM Tasks"
          value={`${data.overdue_pm_count} Looms`}
          target="0 overdue"
          status={data.overdue_pm_count > 0 ? 'CRITICAL' : 'HEALTHY'}
          provenance="ACTUAL"
          driver="Passed scheduled maintenance window"
        />

        <KpiCard
          label="Recurring Failures (Q13)"
          value={`${data.recurring_issue_count} Looms`}
          status={data.recurring_issue_count > 0 ? 'WARNING' : 'HEALTHY'}
          provenance="CALCULATED"
          driver="3+ repeat interventions on sub-assembly"
        />

        <KpiCard
          label="Monthly Maintenance Cost"
          value={`₹${data.total_maintenance_cost_inr.toLocaleString()}`}
          status="HEALTHY"
          provenance="ACTUAL"
          driver="Spares + Lubricants + Overhaul"
        />
      </KpiStrip>

      {/* ── Q12 & Q13: Maintenance Overrun Table ────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: TOKENS.spacing[2] }}>
          <div>
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Preventive Maintenance Schedule & Overrun Monitor (Q12 & Q13)
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Comparing scheduled duration allowances against actual fitter completion times.
            </div>
          </div>
          <DataTrustBadge provenance="ACTUAL" />
        </div>

        <IndustrialTable
          columns={maintColumns}
          data={data.overdue_preventive_maintenance.concat(data.today_scheduled)}
          keyExtractor={(row, idx) => (row.loom_id ? `${row.loom_id}_${idx}` : idx)}
          initialLimit={6}
        />
      </div>

      {/* ── Q14: Predictive Breakdown Forecaster Cards ──────────────────── */}
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
              Predictive Maintenance 24h Risk Forecaster (Q14)
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Machine learning probability of major stoppage (&gt; 30 min) in next 24 hours.
            </div>
          </div>
          <DataTrustBadge provenance="PREDICTED" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
          {data.predictive_breakdown_risks.map((p: any) => (
            <div
              key={p.loom_id}
              style={{
                background: TOKENS.colors.surface.cardAlt,
                padding: '12px',
                borderRadius: TOKENS.radius.sm,
                border: p.risk_level === 'HIGH' ? '1px solid #FECACA' : `1px solid ${TOKENS.colors.surface.border}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ color: TOKENS.colors.text.primary, fontSize: '13px' }}>Loom {p.loom_no}</strong>
                <StatusBadge status={p.risk_level === 'HIGH' ? 'CRITICAL' : 'WARNING'} label={`${p.breakdown_risk_pct}% RISK`} />
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, marginBottom: '4px' }}>
                Forecast 30-Day Cost: <strong style={{ color: TOKENS.colors.text.primary }}>₹{p.forecast_cost_next_30d_inr.toLocaleString()}</strong>
              </div>
              <div style={{ background: '#FFFFFF', border: `1px solid ${TOKENS.colors.surface.border}`, padding: '6px 8px', borderRadius: TOKENS.radius.sm, fontSize: '11px', color: TOKENS.colors.text.muted }}>
                <strong style={{ color: TOKENS.colors.text.primary }}>Failure Signals:</strong>
                <ul style={{ margin: '2px 0 0 0', paddingLeft: '14px' }}>
                  {p.top_factors.map((f: string, idx: number) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
