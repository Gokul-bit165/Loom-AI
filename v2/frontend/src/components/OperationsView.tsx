import React, { useEffect, useState } from 'react';
import { fetchLooms, fetchProductionSummary } from '../api';
import type { LoomsResponse, ProductionSummaryResponse } from '../api';
import {
  PageHeader,
  FilterBar,
  KpiStrip,
  KpiCard,
  IndustrialTable,
  StatusBadge,
  LoadingState,
  TOKENS,
} from '../design-system';
import type { ColumnDef } from '../design-system';
import { Download, FileText } from 'lucide-react';

interface OperationsProps {
  onSelectLoom: (loomId: number) => void;
}

export const OperationsView: React.FC<OperationsProps> = ({ onSelectLoom }) => {
  const [date] = useState('2026-07-31');
  const [shift, setShift] = useState<string>('1');
  const [page] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LoomsResponse | null>(null);
  const [summary, setSummary] = useState<ProductionSummaryResponse | null>(null);

  useEffect(() => {
    loadData();
  }, [date, shift, page]);

  async function loadData() {
    setLoading(true);
    try {
      const [loomsRes, summaryRes] = await Promise.all([
        fetchLooms(date, 'ATM', shift || '1', page, 48, 'loom_no', 'asc'),
        fetchProductionSummary(date, 'ATM'),
      ]);
      setData(loomsRes);
      setSummary(summaryRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      key: 'loom_no',
      header: 'Loom',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>{row.loom_no}</strong>,
    },
    {
      key: 'loom_type_code',
      header: 'Model',
      render: (row) => <span style={{ color: TOKENS.colors.text.muted }}>{row.loom_type_code}</span>,
    },
    {
      key: 'shed_code',
      header: 'Shed',
      align: 'center',
      render: (row) => <span>{row.shed_code || 'S1'}</span>,
    },
    {
      key: 'style_code',
      header: 'Fabric Style',
      render: (row) => <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary }}>{row.style_code.split('&')[0]}</span>,
    },
    {
      key: 'weaver_name',
      header: 'Weaver',
      render: (row) => <span>{row.weaver_name || '-'}</span>,
    },
    {
      key: 'loom_efficiency_pct',
      header: 'Loom Eff %',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: (row.loom_efficiency_pct || 0) >= 89.6 ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.critical.text }}>
          {row.loom_efficiency_pct}%
        </strong>
      ),
    },
    {
      key: 'utilization_pct',
      header: 'Util %',
      align: 'right',
      sortable: true,
      render: (row) => <span>{row.utilization_pct}%</span>,
    },
    {
      key: 'metres',
      header: 'Output (m)',
      align: 'right',
      sortable: true,
      render: (row) => <span>{row.metres.toLocaleString()} m</span>,
    },
    {
      key: 'warp_breaks',
      header: 'Warp Stops',
      align: 'right',
      render: (row) => <span>{row.warp_breaks}</span>,
    },
    {
      key: 'weft_breaks',
      header: 'Weft Stops',
      align: 'right',
      render: (row) => <span>{row.weft_breaks}</span>,
    },
    {
      key: 'rupee_loss',
      header: 'Est. Loss',
      align: 'right',
      render: (row) => (
        <span style={{ color: (row.rupee_loss || 0) > 2000 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.secondary }}>
          -₹{(row.rupee_loss || 0).toLocaleString()}
        </span>
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
        title="Daily Floor Operations Table"
        subtitle="Complete high-density telemetry across all active air-jet and projectile looms."
        unit="ATM Main Shed"
        date="31-Jul-2026"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={`/api/v2/exports/operations-xlsx?unit=ATM&date=${date}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ fontSize: '11.5px', textDecoration: 'none' }}
            >
              <Download size={12} />
              <span>Export Excel</span>
            </a>
            <a
              href={`/api/v2/exports/daily-report-html?unit=ATM&date=${date}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ fontSize: '11.5px', textDecoration: 'none' }}
            >
              <FileText size={12} />
              <span>Daily Report</span>
            </a>
          </div>
        }
      />

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <KpiStrip columns={4}>
        <KpiCard
          label="Headline Efficiency"
          value={summary?.day_total.actual_eff ? `${summary.day_total.actual_eff}%` : '89.2%'}
          target="93.0%"
          variance="-3.8 pp"
          trendDirection="down"
          status="WARNING"
          provenance="CALCULATED"
          driver="Unit baseline"
        />

        <KpiCard
          label="Actual Metres"
          value={summary?.day_total.metres ? summary.day_total.metres.toLocaleString() : '49,748'}
          unit="m"
          target="54,600 m"
          variance="-8.9%"
          trendDirection="down"
          status="WARNING"
          provenance="ACTUAL"
          driver="Total woven output"
        />

        <KpiCard
          label="Total Kilo-Picks"
          value={summary?.day_total.kilo_picks ? summary.day_total.kilo_picks.toLocaleString() : '3,331.5'}
          unit="k-picks"
          status="HEALTHY"
          provenance="CALCULATED"
          driver="Base runtime volume"
        />

        <KpiCard
          label="Active Looms"
          value={data?.total || 192}
          unit="looms"
          status="HEALTHY"
          provenance="ACTUAL"
          driver="Tsudakoma & Sulzer"
        />
      </KpiStrip>

      {/* ── Filter Bar ──────────────────────────────────────────────────── */}
      <FilterBar
        filters={[
          {
            id: 'shift',
            label: 'Shift',
            value: shift,
            options: [
              { label: 'Shift 1 (06:00 - 14:00)', value: '1' },
              { label: 'Shift 2 (14:00 - 22:00)', value: '2' },
              { label: 'Shift 3 (22:00 - 06:00)', value: '3' },
            ],
            onChange: setShift,
          },
        ]}
      />

      {/* ── Main Operations Table ───────────────────────────────────────── */}
      {loading ? (
        <LoadingState message="Loading operations table data..." />
      ) : (
        <IndustrialTable
          columns={columns}
          data={data?.looms || []}
          keyExtractor={(row) => `${row.loom_id}-${row.shift_code}`}
          onRowClick={(row) => onSelectLoom(row.loom_id)}
          initialLimit={20}
        />
      )}
    </div>
  );
};
