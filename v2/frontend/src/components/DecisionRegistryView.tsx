import { useEffect, useState } from 'react';
import { fetchDecisionRegistry } from '../api';
import type { DecisionRegistryItem } from '../api';
import {
  PageHeader,
  FilterBar,
  IndustrialTable,
  StatusBadge,
  DataTrustBadge,
  LoadingState,
  ErrorState,
  TOKENS,
} from '../design-system';
import type { ColumnDef } from '../design-system';

export function DecisionRegistryView() {
  const [registry, setRegistry] = useState<DecisionRegistryItem[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRegistry = () => {
    setLoading(true);
    setError(null);
    fetchDecisionRegistry()
      .then((res) => {
        setRegistry(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load decision registry:', err);
        setError('Failed to retrieve decision registry items.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  if (loading) return <LoadingState message="Loading decision intelligence registry..." />;
  if (error || !registry.length) return <ErrorState message={error || 'Unable to load registry.'} onRetry={loadRegistry} />;

  const modules = ['ALL', ...Array.from(new Set(registry.map((r) => r.module)))];
  const filtered = selectedModule === 'ALL' ? registry : registry.filter((r) => r.module === selectedModule);

  const columns: ColumnDef<DecisionRegistryItem>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '50px',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>{row.id}</strong>,
    },
    {
      key: 'title',
      header: 'Management Decision Question',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: TOKENS.colors.text.primary, marginBottom: '2px', fontSize: '12.5px' }}>{row.title}</div>
          <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, lineHeight: 1.3 }}>{row.question}</div>
        </div>
      ),
    },
    {
      key: 'module',
      header: 'Target Module',
      render: (row) => (
        <span style={{ fontSize: '11px', background: '#F3F4F6', color: TOKENS.colors.text.secondary, padding: '2px 6px', borderRadius: '3px' }}>
          {row.module}
        </span>
      ),
    },
    {
      key: 'calculation_basis',
      header: 'Calculation Basis',
      render: (row) => (
        <code style={{ fontSize: '11px', color: TOKENS.colors.brand[700], fontFamily: TOKENS.typography.fontMono }}>
          {row.calculation_basis}
        </code>
      ),
    },
    {
      key: 'data_readiness',
      header: 'Readiness',
      render: (row) => <DataTrustBadge provenance={row.data_readiness} compact />,
    },
    {
      key: 'coverage_pct',
      header: 'Coverage %',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: row.coverage_pct >= 95 ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.warning.text }}>
          {row.coverage_pct}%
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
        title="Decision Intelligence Registry (All 23 Management Questions)"
        subtitle="Predefined mathematical decision questions calculated automatically from factory telemetry."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      <FilterBar
        filters={[
          {
            id: 'module',
            label: 'Module',
            value: selectedModule,
            options: modules.map((m) => ({ label: m, value: m })),
            onChange: setSelectedModule,
          },
        ]}
        rightSlot={
          <span style={{ fontSize: '12px', color: TOKENS.colors.status.healthy.text, fontWeight: 700 }}>
            ✓ 23 / 23 Operational
          </span>
        }
      />

      <IndustrialTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        initialLimit={12}
      />
    </div>
  );
}
