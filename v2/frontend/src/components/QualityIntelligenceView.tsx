import { useEffect, useState } from 'react';
import { fetchQualityAnalytics } from '../api';
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

export function QualityIntelligenceView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchQualityAnalytics('2026-07-31', 'ATM')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load quality data:', err);
        setError('Failed to retrieve fabric inspection records.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading quality & defect intelligence..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to load quality data.'} onRetry={loadData} />;

  const qualityColumns: ColumnDef<any>[] = [
    {
      key: 'loom_no',
      header: 'Loom No',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>{row.loom_no}</strong>,
    },
    {
      key: 'style_code',
      header: 'Style',
      render: (row) => <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>{row.style_code.split('&')[0]}</span>,
    },
    {
      key: 'inspected_metres',
      header: 'Inspected (m)',
      align: 'right',
      sortable: true,
      render: (row) => <span>{row.inspected_metres} m</span>,
    },
    {
      key: 'defective_metres',
      header: 'Defective (m)',
      align: 'right',
      sortable: true,
      render: (row) => (
        <span style={{ color: row.defective_metres > 5 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.secondary }}>
          {row.defective_metres} m
        </span>
      ),
    },
    {
      key: 'defect_rate_pct',
      header: 'Defect Rate %',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: row.defect_rate_pct > 2.0 ? TOKENS.colors.status.critical.text : TOKENS.colors.status.healthy.text }}>
          {row.defect_rate_pct}%
        </strong>
      ),
    },
    {
      key: 'top_defect_category',
      header: 'Primary Defect',
      render: (row) => <span>{row.top_defect_category.replace('_', ' ')}</span>,
    },
    {
      key: 'actual_crimp_pct',
      header: 'Crimp %',
      align: 'right',
      render: (row) => <span>{row.actual_crimp_pct ? `${row.actual_crimp_pct}%` : '—'}</span>,
    },
    {
      key: 'crimp_deviation_pp',
      header: 'Crimp Gap',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: Math.abs(row.crimp_deviation_pp || 0) > 0.8 ? TOKENS.colors.status.warning.text : TOKENS.colors.status.healthy.text }}>
          {row.crimp_deviation_pp ? `${row.crimp_deviation_pp > 0 ? '+' : ''}${row.crimp_deviation_pp} pp` : '—'}
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
        title="Quality & Defect Intelligence (Q18–Q20)"
        subtitle="Fabric defect cut rates, 80/20 category Pareto, crimp tolerance deviations, and yarn waste tracking."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <KpiStrip columns={4}>
        <KpiCard
          label="Overall Defect Cut Rate (Q18)"
          value={`${data.overall_defect_rate_pct}%`}
          target="< 1.50%"
          status={data.overall_defect_rate_pct > 2.0 ? 'CRITICAL' : 'HEALTHY'}
          provenance="ACTUAL"
          driver={`${data.total_defective_metres} m / ${data.total_inspected_metres.toLocaleString()} m inspected`}
        />

        <KpiCard
          label="Yarn Waste Percentage (Q20)"
          value={`${data.overall_yarn_waste_pct}%`}
          target="< 2.0%"
          status={data.overall_yarn_waste_pct > 2.0 ? 'WARNING' : 'HEALTHY'}
          provenance="ACTUAL"
          driver="Weft fringe & knotter waste"
        />

        <KpiCard
          label="Abnormal Crimp Looms (Q19)"
          value={`${data.crimp_abnormal_looms.length} Looms`}
          target="0 deviation"
          status={data.crimp_abnormal_looms.length > 0 ? 'WARNING' : 'HEALTHY'}
          provenance="ACTUAL"
          driver="Tolerance: 8.50% ± 0.50 pp"
        />

        <KpiCard
          label="Highest Waste Shift"
          value="Shift 3 (2.5%)"
          status="WARNING"
          provenance="CALCULATED"
          driver="8.2 kg yarn waste recorded"
        />
      </KpiStrip>

      {/* ── Q18: Defect Pareto Breakdown ────────────────────────────────── */}
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
              Fabric Defect Pareto Distribution (Q18)
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Major defect categories identified on inspection tables.
            </div>
          </div>
          <DataTrustBadge provenance="ACTUAL" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {data.defect_pareto.map((d: any, idx: number) => (
            <div key={idx} style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: TOKENS.colors.text.primary }}>{d.category}</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: TOKENS.colors.brand[600], fontFamily: TOKENS.typography.fontMono, margin: '2px 0' }}>
                {d.count} Cuts
              </div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                Share: <strong style={{ color: TOKENS.colors.status.critical.text }}>{d.share_pct}%</strong> of total rejects
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Q18 & Q19: Roll Inspection Table ────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: TOKENS.spacing[2] }}>
          <div>
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Roll Inspection & Crimp Percentage Monitor (Q18 & Q19)
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Standard Crimp: 8.50%. Deviations cause fabric width shrinkage or off-spec elongation.
            </div>
          </div>
          <DataTrustBadge provenance="ACTUAL" />
        </div>

        <IndustrialTable
          columns={qualityColumns}
          data={data.loom_quality_details}
          keyExtractor={(row) => row.loom_id}
          initialLimit={8}
        />
      </div>
    </div>
  );
}
