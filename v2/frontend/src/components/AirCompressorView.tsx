import { useEffect, useState } from 'react';
import { fetchAirAnalytics } from '../api';
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

export function AirCompressorView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchAirAnalytics('2026-07-31', 'ATM')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load air analytics:', err);
        setError('Failed to retrieve compressed air telemetry.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading compressed air & energy telemetry..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to load air data.'} onRetry={loadData} />;

  const p = data.period_comparisons;

  const airColumns: ColumnDef<any>[] = [
    {
      key: 'loom_no',
      header: 'Loom No',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>{row.loom_no}</strong>,
    },
    {
      key: 'loom_type',
      header: 'Model',
      render: (row) => <span style={{ color: TOKENS.colors.text.muted }}>{row.loom_type}</span>,
    },
    {
      key: 'actual_cfm',
      header: 'Actual CFM',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: row.excess_cfm > 5 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.primary }}>
          {row.actual_cfm} CFM
        </strong>
      ),
    },
    {
      key: 'standard_cfm',
      header: 'Standard CFM',
      align: 'right',
      render: (row) => <span style={{ color: TOKENS.colors.text.muted }}>{row.standard_cfm} CFM</span>,
    },
    {
      key: 'excess_cfm',
      header: 'Excess CFM',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: row.excess_cfm > 5 ? TOKENS.colors.status.critical.text : TOKENS.colors.status.healthy.text }}>
          +{row.excess_cfm} CFM
        </strong>
      ),
    },
    {
      key: 'line_pressure_bar',
      header: 'Pressure (Bar)',
      align: 'right',
      render: (row) => <span>{row.line_pressure_bar} Bar</span>,
    },
    {
      key: 'power_loss_kwh',
      header: 'Power Loss',
      align: 'right',
      render: (row) => <span>{row.power_loss_kwh} kWh</span>,
    },
    {
      key: 'air_cost_loss_inr',
      header: 'Rupee Loss',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: row.air_cost_loss_inr > 100 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.primary }}>
          ₹{row.air_cost_loss_inr.toLocaleString()}
        </strong>
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
        title="Compressed Air & Pneumatic Intelligence (Q15–Q17)"
        subtitle="Standard vs actual CFM consumption, pneumatic power wastage, compressor tariff loss, and style pressure calibration."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <KpiStrip columns={4}>
        <KpiCard
          label="Excess Air Leakage"
          value={`${data.total_excess_cfm}`}
          unit="CFM"
          target="32.0 CFM / Loom"
          variance={`${p.dod_air_loss_change_pct}%`}
          trendDirection="down"
          status="CRITICAL"
          provenance="ACTUAL"
          driver="Excess above standard baseline"
        />

        <KpiCard
          label="Pneumatic Power Waste"
          value={`${data.total_power_loss_kwh}`}
          unit="kWh / shift"
          status="WARNING"
          provenance="CALCULATED"
          driver="Rule: ~4.5 CFM per kW compressor load"
        />

        <KpiCard
          label="Energy Financial Loss"
          value={`₹${data.total_financial_loss_inr.toLocaleString()}`}
          status="CRITICAL"
          provenance="ESTIMATED"
          driver="Tariff: ₹8.50/kWh power rate"
        />

        <KpiCard
          label="High-Leakage Machines"
          value={`${data.high_excess_looms_count} Looms`}
          status={data.high_excess_looms_count > 0 ? 'CRITICAL' : 'HEALTHY'}
          provenance="CALCULATED"
          driver="Solenoid valve check advised"
        />
      </KpiStrip>

      {/* ── Q15: Excess CFM Telemetry Table ─────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: TOKENS.spacing[2] }}>
          <div>
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Excess CFM Pneumatic Telemetry by Loom (Q15)
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Comparing actual air consumption against standard style requirements.
            </div>
          </div>
          <DataTrustBadge provenance="ACTUAL" />
        </div>

        <IndustrialTable
          columns={airColumns}
          data={data.loom_air_telemetry}
          keyExtractor={(row) => row.loom_id}
          initialLimit={8}
        />
      </div>

      {/* ── Q17: Quality / Style Pressure Matrix ─────────────────────────── */}
      <div
        style={{
          background: TOKENS.colors.surface.card,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          borderRadius: TOKENS.radius.md,
          padding: '14px 16px',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 10px 0', color: TOKENS.colors.text.primary }}>
          Quality / Style Pneumatic Pressure Calibration (Q17)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {data.style_consumption_matrix.map((st: any, idx: number) => (
            <div key={idx} style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: TOKENS.colors.brand[600] }}>{st.style_code}</div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>{st.fabric_type}</div>
              <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, marginTop: '4px' }}>
                Standard: <strong style={{ color: TOKENS.colors.text.primary }}>{st.std_cfm} CFM</strong>
              </div>
              <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary }}>
                Actual: <strong style={{ color: st.variance_cfm > 3 ? TOKENS.colors.status.critical.text : TOKENS.colors.status.healthy.text }}>{st.actual_cfm} CFM</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
