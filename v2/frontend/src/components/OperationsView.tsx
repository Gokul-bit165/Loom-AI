import React, { useEffect, useState } from 'react';
import { fetchLooms, fetchProductionSummary } from '../api';
import type { LoomsResponse, ProductionSummaryResponse } from '../api';
import {
  PageHeader,
  KpiStrip,
  KpiCard,
  IndustrialTable,
  StatusBadge,
  LoadingState,
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
  const [search, setSearch] = useState<string>('');
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

  const looms = data?.looms || [];
  const filteredLooms = looms.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      String(l.loom_no).toLowerCase().includes(q) ||
      (l.style_code && l.style_code.toLowerCase().includes(q)) ||
      (l.weaver_name && l.weaver_name.toLowerCase().includes(q)) ||
      (l.loom_type_code && l.loom_type_code.toLowerCase().includes(q))
    );
  });

  const bestLoom = looms.length > 0 ? [...looms].sort((a, b) => (b.loom_efficiency_pct || 0) - (a.loom_efficiency_pct || 0))[0] : null;
  const worstLoom = looms.length > 0 ? [...looms].sort((a, b) => (a.loom_efficiency_pct || 0) - (b.loom_efficiency_pct || 0))[0] : null;

  const columns: ColumnDef<any>[] = [
    {
      key: 'loom_no',
      header: 'Loom',
      sortable: true,
      render: (row) => <strong style={{ color: '#2563eb', fontWeight: 600 }}>{row.loom_no}</strong>,
    },
    {
      key: 'loom_type_code',
      header: 'Model',
      render: (row) => <span style={{ color: '#64748b' }}>{row.loom_type_code}</span>,
    },
    {
      key: 'shed_code',
      header: 'Shed',
      align: 'center',
      render: (row) => <span style={{ color: '#334155' }}>{row.shed_code || 'S1'}</span>,
    },
    {
      key: 'style_code',
      header: 'Fabric Style',
      render: (row) => (
        <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
          {row.style_code.split('&')[0]}
        </span>
      ),
    },
    {
      key: 'weaver_name',
      header: 'Weaver',
      render: (row) => <span style={{ color: '#475569' }}>{row.weaver_name || '—'}</span>,
    },
    {
      key: 'loom_efficiency_pct',
      header: 'Loom Eff %',
      align: 'right',
      sortable: true,
      render: (row) => {
        const eff = row.loom_efficiency_pct || 0;
        const color = eff >= 90 ? '#047857' : eff >= 80 ? '#b45309' : '#b91c1c';
        return (
          <strong style={{ color, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
            {eff.toFixed(1)}%
          </strong>
        );
      },
    },
    {
      key: 'utilization_pct',
      header: 'Util %',
      align: 'right',
      sortable: true,
      render: (row) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', color: '#334155' }}>
          {row.utilization_pct}%
        </span>
      ),
    },
    {
      key: 'metres',
      header: 'Output (m)',
      align: 'right',
      sortable: true,
      render: (row) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500, color: '#0f172a' }}>
          {row.metres.toLocaleString()} m
        </span>
      ),
    },
    {
      key: 'warp_breaks',
      header: 'Warp Stops',
      align: 'right',
      sortable: true,
      render: (row) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', color: row.warp_breaks > 5 ? '#b91c1c' : '#475569' }}>
          {row.warp_breaks}
        </span>
      ),
    },
    {
      key: 'weft_breaks',
      header: 'Weft Stops',
      align: 'right',
      sortable: true,
      render: (row) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', color: row.weft_breaks > 8 ? '#b91c1c' : '#475569' }}>
          {row.weft_breaks}
        </span>
      ),
    },
    {
      key: 'rupee_loss',
      header: 'Est. Loss',
      align: 'right',
      sortable: true,
      render: (row) => {
        const loss = (row as any).rupee_lost ?? (row as any).rupee_loss ?? 0;
        return (
          <span
            style={{
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
              color: loss > 1500 ? '#b91c1c' : '#64748b',
            }}
          >
            -₹{loss.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

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
      <PageHeader
        title="Daily Floor Operations Table"
        subtitle="Complete high-density telemetry across all active air-jet and projectile looms."
        unit="ATM Main Shed"
        date="31 July 2026"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={`/api/v2/exports/operations-xlsx?unit=ATM&date=${date}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <Download size={13} />
              <span>Export Excel</span>
            </a>
            <a
              href={`/api/v2/exports/daily-report-html?unit=ATM&date=${date}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '6px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <FileText size={13} />
              <span>Daily Report</span>
            </a>
          </div>
        }
      />

      {/* ── Floor Operational Alert Banner ────────────────────────────────── */}
      <div
        style={{
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '8px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
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
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#991b1b' }}>
              Shift {shift} Telemetry Alert · 8 Looms Operating Below 80% Efficiency Threshold
            </div>
            <div style={{ fontSize: '12.5px', color: '#b91c1c', marginTop: '2px' }}>
              Loom 118 & 124 experiencing recurring weft sensor misfires. Total estimated shift loss: ₹18,450. Inspect tension feeders before Shift 2.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#ffffff',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
            }}
          >
            Shed 1 Priority
          </span>
        </div>
      </div>

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

      {/* ── Filter Bar & Search Toolbar ─────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '10px 16px',
          gap: '12px',
          flexWrap: 'wrap',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              Shift:
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: '1', label: 'Shift 1 (06:00 - 14:00)' },
                { id: '2', label: 'Shift 2 (14:00 - 22:00)' },
                { id: '3', label: 'Shift 3 (22:00 - 06:00)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShift(s.id)}
                  style={{
                    height: '28px',
                    padding: '0 10px',
                    borderRadius: '4px',
                    border: shift === s.id ? 'none' : '1px solid #cbd5e1',
                    background: shift === s.id ? '#2563eb' : '#ffffff',
                    color: shift === s.id ? '#ffffff' : '#334155',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {s.id === '1' ? 'Shift 1' : s.id === '2' ? 'Shift 2' : 'Shift 3'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="search"
            placeholder="Search loom, style, or weaver…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              height: '30px',
              padding: '0 10px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12.5px',
              outline: 'none',
              color: '#0f172a',
              width: '230px',
            }}
          />
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {filteredLooms.length} looms
          </span>
        </div>
      </div>

      {/* ── Main Operations Table ───────────────────────────────────────── */}
      {loading ? (
        <LoadingState message="Loading operations table data..." />
      ) : (
        <IndustrialTable
          columns={columns}
          data={filteredLooms}
          keyExtractor={(row) => `${row.loom_id}-${row.shift_code}`}
          onRowClick={(row) => onSelectLoom(row.loom_id)}
          initialLimit={20}
        />
      )}

      {/* ── Best / Worst Loom Performance Split Card (Revenue Theme) ────── */}
      {(bestLoom || worstLoom) && (
        <div
          style={{
            display: 'flex',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          {bestLoom && (
            <div
              style={{
                flex: 1,
                padding: '14px 20px',
                background: '#ecfdf5',
                borderRight: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: '#047857',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '4px',
                }}
              >
                Top Performing Loom
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                  Loom {bestLoom.loom_no} ({bestLoom.loom_type_code})
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#047857', fontVariantNumeric: 'tabular-nums' }}>
                  {(bestLoom.loom_efficiency_pct || 0).toFixed(1)}% eff
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                Output: {bestLoom.metres.toLocaleString()}m · Weaver: {bestLoom.weaver_name || '—'}
              </div>
            </div>
          )}

          {worstLoom && (
            <div
              style={{
                flex: 1,
                padding: '14px 20px',
                background: '#fef2f2',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: '#b91c1c',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '4px',
                }}
              >
                Lowest Efficiency Attention Loom
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                  Loom {worstLoom.loom_no} ({worstLoom.loom_type_code})
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#b91c1c', fontVariantNumeric: 'tabular-nums' }}>
                  {(worstLoom.loom_efficiency_pct || 0).toFixed(1)}% eff
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                Stoppages: {worstLoom.warp_breaks + worstLoom.weft_breaks} stops · Loss: -₹{(((worstLoom as any).rupee_lost ?? (worstLoom as any).rupee_loss ?? 0)).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Provenance Note Strip ────────────────────────────────────────── */}
      <div
        style={{
          padding: '10px 16px',
          fontSize: '11.5px',
          color: '#64748b',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
        }}
      >
        ⓘ Telemetry figures derived from ATM Production Log & Loom Sensors. Target baseline: 93.0% standard efficiency. Rupee loss values calculated from realized revenue run-rate by fabric style.
      </div>
    </div>
  );
};
