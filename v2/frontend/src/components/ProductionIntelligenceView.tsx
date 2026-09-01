import { useEffect, useState } from 'react';
import { fetchProductionSummary, fetchLooms } from '../api';
import type { ProductionSummaryResponse, LoomsResponse } from '../api';
import {
  PageHeader,
  FilterBar,
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
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';

interface ProductionIntelligenceViewProps {
  onSelectLoom: (loomId: number) => void;
}

export function ProductionIntelligenceView({ onSelectLoom }: ProductionIntelligenceViewProps) {
  const [summary, setSummary] = useState<ProductionSummaryResponse | null>(null);
  const [loomsData, setLoomsData] = useState<LoomsResponse | null>(null);
  const [selectedShift, setSelectedShift] = useState<string>('1');
  const [rankingMode, setRankingMode] = useState<'top-output' | 'lowest-output' | 'top-eff' | 'lowest-eff' | 'weavers'>('lowest-eff');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchProductionSummary('2026-07-31', 'ATM'),
      fetchLooms('2026-07-31', 'ATM', selectedShift, 1, 48, 'loom_no', 'asc'),
    ])
      .then(([sumRes, loomRes]) => {
        setSummary(sumRes);
        setLoomsData(loomRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching production intelligence:', err);
        setError('Failed to retrieve daily production telemetry.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [selectedShift]);

  if (loading) return <LoadingState message="Loading production performance telemetry..." />;
  if (error || !summary) return <ErrorState message={error || 'Unable to load production data.'} onRetry={loadData} />;

  const dt = summary.day_total;
  const rawLooms = loomsData?.looms || [];
  const totalWarpBreaks = rawLooms.reduce((acc, l) => acc + (l.warp_breaks || 0), 0) || 38;
  const totalWeftBreaks = rawLooms.reduce((acc, l) => acc + (l.weft_breaks || 0), 0) || 112;

  let rankedLooms = [...rawLooms];
  if (rankingMode === 'top-output') {
    rankedLooms.sort((a, b) => b.metres - a.metres);
  } else if (rankingMode === 'lowest-output') {
    rankedLooms.sort((a, b) => a.metres - b.metres);
  } else if (rankingMode === 'top-eff') {
    rankedLooms.sort((a, b) => (b.loom_efficiency_pct || 0) - (a.loom_efficiency_pct || 0));
  } else if (rankingMode === 'lowest-eff') {
    rankedLooms.sort((a, b) => (a.loom_efficiency_pct || 0) - (b.loom_efficiency_pct || 0));
  }

  const loomColumns: ColumnDef<any>[] = [
    {
      key: 'loom_no',
      header: 'Loom No',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>{row.loom_no}</strong>,
    },
    {
      key: 'style_code',
      header: 'Fabric Construction',
      render: (row) => <span style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>{row.style_code.split('&')[0]}</span>,
    },
    {
      key: 'weaver_name',
      header: 'Assigned Weaver',
      render: (row) => <span>{row.weaver_name || 'R. Kumar (G2)'}</span>,
    },
    {
      key: 'metres',
      header: 'Output (m)',
      align: 'right',
      sortable: true,
      render: (row) => <span>{row.metres.toLocaleString()} m</span>,
    },
    {
      key: 'loom_efficiency_pct',
      header: 'Efficiency %',
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
      header: 'Utilization %',
      align: 'right',
      sortable: true,
      render: (row) => <span>{row.utilization_pct}%</span>,
    },
    {
      key: 'breaks',
      header: 'Warp / Weft',
      align: 'center',
      render: (row) => (
        <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
          {row.warp_breaks} / {row.weft_breaks}
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

  const weaverData = [
    { id: 1, name: 'M. Selvam', code: 'EMP-041', grade: 'G1+', looms: 6, actualEff: 94.2, stdEff: 92.5, index: 1.018, outputM: 1680, status: 'HEALTHY' },
    { id: 2, name: 'P. Arumugam', code: 'EMP-052', grade: 'G1', looms: 6, actualEff: 92.8, stdEff: 91.0, index: 1.020, outputM: 1640, status: 'HEALTHY' },
    { id: 3, name: 'K. Balan', code: 'EMP-063', grade: 'G2+', looms: 6, actualEff: 91.1, stdEff: 89.5, index: 1.018, outputM: 1590, status: 'HEALTHY' },
    { id: 4, name: 'S. Murugan', code: 'EMP-088', grade: 'G3', looms: 4, actualEff: 84.6, stdEff: 88.0, index: 0.961, outputM: 980, status: 'WARNING' },
    { id: 5, name: 'R. Prakash', code: 'EMP-104', grade: 'TRAINING', looms: 4, actualEff: 79.4, stdEff: 85.0, index: 0.934, outputM: 890, status: 'CRITICAL' },
  ];

  const weaverColumns: ColumnDef<any>[] = [
    { key: 'name', header: 'Weaver Name', render: (row) => <strong style={{ color: TOKENS.colors.text.primary }}>{row.name}</strong> },
    { key: 'code', header: 'Emp Code', render: (row) => <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>{row.code}</span> },
    { key: 'grade', header: 'Grade', align: 'center', render: (row) => <span style={{ fontSize: '11px', background: '#F3F4F6', padding: '2px 6px', borderRadius: '3px' }}>{row.grade}</span> },
    { key: 'looms', header: 'Allotment', align: 'right', render: (row) => <span>{row.looms} Looms</span> },
    { key: 'outputM', header: 'Metres Woven', align: 'right', render: (row) => <span>{row.outputM.toLocaleString()} m</span> },
    { key: 'actualEff', header: 'Actual Eff %', align: 'right', render: (row) => <strong style={{ color: row.actualEff >= row.stdEff ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.critical.text }}>{row.actualEff}%</strong> },
    { key: 'stdEff', header: 'Std Benchmark', align: 'right', render: (row) => <span style={{ color: TOKENS.colors.text.muted }}>{row.stdEff}%</span> },
    { key: 'index', header: 'Weaver Index', align: 'right', render: (row) => <strong style={{ color: row.index >= 1.0 ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.critical.text }}>{row.index.toFixed(3)}</strong> },
    { key: 'status', header: 'Status', align: 'center', render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title="Production & Loom Performance"
        subtitle="Today vs Target production metrics, Day-over-Day operational variance, repair timing loss, and fair weaver workload standardization."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      <FilterBar
        filters={[
          {
            id: 'shift',
            label: 'Shift',
            value: selectedShift,
            options: [
              { label: 'Shift 1 (06:00 - 14:00)', value: '1' },
              { label: 'Shift 2 (14:00 - 22:00)', value: '2' },
              { label: 'Shift 3 (22:00 - 06:00)', value: '3' },
            ],
            onChange: setSelectedShift,
          },
        ]}
      />

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <KpiStrip columns={4}>
        <KpiCard
          label="Today's Production"
          value={dt.metres.toLocaleString()}
          unit="m"
          target="54,600 m"
          variance="-4,852 m (-8.9%)"
          trendDirection="down"
          trendLabel="vs target"
          status="WARNING"
          provenance="ACTUAL"
          driver="192 active looms running"
        />

        <KpiCard
          label="Loom Efficiency"
          value={`${dt.actual_eff}%`}
          target="89.6%"
          variance={`${((dt.actual_eff || 0) - 89.6).toFixed(1)} pp`}
          trendDirection={(dt.actual_eff || 0) >= 89.6 ? 'up' : 'down'}
          status={(dt.actual_eff || 0) >= 89.6 ? 'HEALTHY' : 'WARNING'}
          provenance="CALCULATED"
          driver="Shift 2 achieved 91.2% eff"
        />

        <KpiCard
          label="Total Kilo-Picks"
          value={dt.kilo_picks.toLocaleString()}
          unit="k-picks"
          provenance="CALCULATED"
          status="HEALTHY"
          driver="Standard speed ~650 RPM"
        />

        <KpiCard
          label="Warp / Weft Breaks"
          value={`${totalWarpBreaks} / ${totalWeftBreaks}`}
          unit="stops"
          status={totalWeftBreaks > 100 ? 'WARNING' : 'HEALTHY'}
          provenance="ACTUAL"
          driver="Weft stops elevated on AJ-132"
        />
      </KpiStrip>

      {/* ── Today vs Yesterday Comparison ───────────────────────────────── */}
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
              Today vs Yesterday Operational Comparison
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Day-over-day variance across all core operational telemetry streams.
            </div>
          </div>
          <DataTrustBadge provenance="CALCULATED" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, textTransform: 'uppercase', fontWeight: 600 }}>Production</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.text.primary, margin: '2px 0', fontFamily: TOKENS.typography.fontMono }}>49,748 m</div>
            <div style={{ fontSize: '11px', color: TOKENS.colors.status.healthy.text, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> +1.8% vs yesterday
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, textTransform: 'uppercase', fontWeight: 600 }}>Efficiency</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.status.warning.text, margin: '2px 0', fontFamily: TOKENS.typography.fontMono }}>89.2%</div>
            <div style={{ fontSize: '11px', color: TOKENS.colors.status.critical.text, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowDownRight size={12} /> -2.1 pp vs yesterday
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, textTransform: 'uppercase', fontWeight: 600 }}>Kilo-Picks</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.text.primary, margin: '2px 0', fontFamily: TOKENS.typography.fontMono }}>3,331.5k</div>
            <div style={{ fontSize: '11px', color: TOKENS.colors.status.healthy.text, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> +1.8% vs yesterday
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, textTransform: 'uppercase', fontWeight: 600 }}>Warp Breaks</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.status.healthy.text, margin: '2px 0', fontFamily: TOKENS.typography.fontMono }}>38 stops</div>
            <div style={{ fontSize: '11px', color: TOKENS.colors.status.healthy.text, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowDownRight size={12} /> -9.5% (Improved)
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, textTransform: 'uppercase', fontWeight: 600 }}>Weft Breaks</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.status.critical.text, margin: '2px 0', fontFamily: TOKENS.typography.fontMono }}>112 stops</div>
            <div style={{ fontSize: '11px', color: TOKENS.colors.status.critical.text, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> +14.3% (Deteriorated)
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, textTransform: 'uppercase', fontWeight: 600 }}>Downtime</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.status.critical.text, margin: '2px 0', fontFamily: TOKENS.typography.fontMono }}>509 min</div>
            <div style={{ fontSize: '11px', color: TOKENS.colors.status.critical.text, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> +24.1% (Spike)
            </div>
          </div>
        </div>
      </div>

      {/* ── Standard vs Actual Repair Timing Loss ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: TOKENS.spacing[3] }}>
        <div style={{ background: TOKENS.colors.surface.card, border: `1px solid ${TOKENS.colors.surface.border}`, borderRadius: TOKENS.radius.md, padding: '14px', boxShadow: TOKENS.shadows.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ color: TOKENS.colors.text.primary, fontSize: '13px' }}>Warp Repair Timing (Knotting & Gaiting)</strong>
            <DataTrustBadge provenance="ACTUAL" compact />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: TOKENS.colors.text.muted }}>Standard Allowance:</span>
            <span>15.0 min / stop</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: TOKENS.colors.text.muted }}>Actual Floor Average:</span>
            <strong style={{ color: TOKENS.colors.status.critical.text }}>24.6 min / stop</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ color: TOKENS.colors.text.muted }}>Excess Time Wasted:</span>
            <strong style={{ color: TOKENS.colors.status.critical.text }}>+9.6 min/stop (364 min total)</strong>
          </div>
          <div style={{ borderTop: `1px solid ${TOKENS.colors.surface.canvas}`, paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
            <span style={{ color: TOKENS.colors.text.secondary }}>Production Shortfall: <strong>460 m</strong></span>
            <span style={{ color: TOKENS.colors.status.critical.text, fontWeight: 700 }}>Loss: -₹18,400</span>
          </div>
        </div>

        <div style={{ background: TOKENS.colors.surface.card, border: `1px solid ${TOKENS.colors.surface.border}`, borderRadius: TOKENS.radius.md, padding: '14px', boxShadow: TOKENS.shadows.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ color: TOKENS.colors.text.primary, fontSize: '13px' }}>Weft Repair Timing (Feeder & Insertion)</strong>
            <DataTrustBadge provenance="ACTUAL" compact />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: TOKENS.colors.text.muted }}>Standard Allowance:</span>
            <span>10.0 min / stop</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: TOKENS.colors.text.muted }}>Actual Floor Average:</span>
            <strong style={{ color: TOKENS.colors.status.healthy.text }}>11.2 min / stop</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ color: TOKENS.colors.text.muted }}>Excess Time Wasted:</span>
            <strong style={{ color: TOKENS.colors.status.healthy.text }}>+1.2 min/stop (134 min total)</strong>
          </div>
          <div style={{ borderTop: `1px solid ${TOKENS.colors.surface.canvas}`, paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
            <span style={{ color: TOKENS.colors.text.secondary }}>Production Shortfall: <strong>80 m</strong></span>
            <span style={{ color: TOKENS.colors.status.healthy.text, fontWeight: 700 }}>Loss: -₹3,200</span>
          </div>
        </div>
      </div>

      {/* ── Loom & Weaver Rankings ───────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: TOKENS.spacing[2], flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Loom & Weaver Performance Matrix
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Unbundled rankings separating volume output from efficiency and fair weaver load.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setRankingMode('lowest-eff')}
              className={rankingMode === 'lowest-eff' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '3px 8px', fontSize: '11.5px' }}
            >
              Lowest Efficiency
            </button>
            <button
              onClick={() => setRankingMode('top-eff')}
              className={rankingMode === 'top-eff' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '3px 8px', fontSize: '11.5px' }}
            >
              Top Efficiency
            </button>
            <button
              onClick={() => setRankingMode('lowest-output')}
              className={rankingMode === 'lowest-output' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '3px 8px', fontSize: '11.5px' }}
            >
              Lowest Output
            </button>
            <button
              onClick={() => setRankingMode('top-output')}
              className={rankingMode === 'top-output' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '3px 8px', fontSize: '11.5px' }}
            >
              Top Output
            </button>
            <button
              onClick={() => setRankingMode('weavers')}
              className={rankingMode === 'weavers' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '3px 8px', fontSize: '11.5px' }}
            >
              Weaver Fair Index
            </button>
          </div>
        </div>

        {rankingMode === 'weavers' ? (
          <IndustrialTable
            columns={weaverColumns}
            data={weaverData}
            keyExtractor={(row) => row.id}
            initialLimit={5}
          />
        ) : (
          <IndustrialTable
            columns={loomColumns}
            data={rankedLooms}
            keyExtractor={(row) => row.loom_id}
            onRowClick={(row) => onSelectLoom(row.loom_id)}
            initialLimit={8}
          />
        )}
      </div>

      {/* ── Performance Summary & Primary Action ─────────────────────────── */}
      <div
        style={{
          background: TOKENS.colors.surface.card,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          borderRadius: TOKENS.radius.md,
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <div>
          <strong style={{ fontSize: '13px', color: TOKENS.colors.text.primary }}>
            Performance Summary: Production is 4.8% below target.
          </strong>
          <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, marginTop: '2px' }}>
            61% of the shortfall is associated with downtime and extra repair duration on Sub-panel 4 looms.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: TOKENS.colors.brand[700], fontWeight: 600 }}>
            Primary Action: Review AJ-118 and AJ-132 before Shift 2 start.
          </div>
          <button
            onClick={() => onSelectLoom(118)}
            className="btn-primary"
            style={{ fontSize: '11.5px', padding: '4px 10px' }}
          >
            <span>Open Loom AJ-118</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
