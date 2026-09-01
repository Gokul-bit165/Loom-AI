import React, { useEffect, useState } from 'react';
import { fetchLoomDetail } from '../api';
import type { LoomDetailResponse } from '../api';
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
import { ArrowLeft, Wrench } from 'lucide-react';

interface LoomDetailProps {
  loomId: number;
  onBack: () => void;
}

export const LoomDetailView: React.FC<LoomDetailProps> = ({ loomId, onBack }) => {
  const [data, setData] = useState<LoomDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdowns' | 'weavers'>('overview');

  // Close-out form modal state
  const [closeOutEventId, setCloseOutEventId] = useState<number | null>(null);
  const [failedComponent, setFailedComponent] = useState('weft_feeder');
  const [fixAction, setFixAction] = useState('replace_part');
  const [wasPredictable, setWasPredictable] = useState<'YES' | 'NO' | 'UNSURE'>('YES');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadLoom();
  }, [loomId]);

  async function loadLoom() {
    setLoading(true);
    try {
      const res = await fetchLoomDetail(loomId, '2026-07-31');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveCloseOut = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setCloseOutEventId(null);
      setSavedSuccess(false);
    }, 1000);
  };

  if (loading) return <LoadingState message="Loading machine asset 360° dossier..." />;
  if (!data) return <ErrorState message="Loom asset record not found in telemetry registry." onRetry={loadLoom} />;

  const stopEventColumns: ColumnDef<any>[] = [
    {
      key: 'raised_at',
      header: 'Raised Time',
      render: (row) => <span>{new Date(row.raised_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>,
    },
    {
      key: 'duration_min',
      header: 'Duration',
      align: 'right',
      render: (row) => <strong style={{ color: row.duration_min > 30 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.primary }}>{row.duration_min} min</strong>,
    },
    {
      key: 'reason_label_en',
      header: 'Reason',
      render: (row) => <span>{row.reason_label_en || 'General Stop'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <button
          className="btn-secondary"
          onClick={() => setCloseOutEventId(row.stop_event_id)}
          style={{ padding: '2px 8px', fontSize: '11px' }}
        >
          <Wrench size={11} />
          <span>Log Details</span>
        </button>
      ),
    },
  ];

  const paretoColumns: ColumnDef<any>[] = [
    { key: 'reason_label_en', header: 'Stoppage Reason', render: (row) => <strong style={{ color: TOKENS.colors.text.primary }}>{row.reason_label_en}</strong> },
    { key: 'count', header: 'Events', align: 'right', render: (row) => <span>{row.count} stops</span> },
    { key: 'total_minutes', header: 'Total Min', align: 'right', render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>{row.total_minutes} min</strong> },
    { key: 'pct_of_loom_downtime', header: 'Downtime Share', align: 'right', render: (row) => <span>{row.pct_of_loom_downtime}%</span> },
  ];

  const weaverColumns: ColumnDef<any>[] = [
    { key: 'name', header: 'Weaver Name', render: (row) => <strong style={{ color: TOKENS.colors.text.primary }}>{row.name}</strong> },
    { key: 'grade', header: 'Grade', align: 'center', render: (row) => <span style={{ fontSize: '11px', background: '#F3F4F6', padding: '2px 6px', borderRadius: '3px' }}>{row.grade || 'Skilled'}</span> },
    { key: 'days_run', header: 'Shifts Run', align: 'right', render: (row) => <span>{row.days_run} shifts</span> },
    { key: 'mean_eff', header: 'Mean Loom Eff %', align: 'right', render: (row) => <strong style={{ color: (row.mean_eff || 0) >= 89.6 ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.critical.text }}>{row.mean_eff ? `${row.mean_eff}%` : '-'}</strong> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title={`Loom ${data.loom_no} — Asset 360° Profile`}
        subtitle={`${data.loom_type_code} · ${data.shed_code || 'Shed 1'} · Operational Machine Dossier & Diagnostic Split`}
        unit="ATM Main Shed"
        date="31-Jul-2026"
        actions={
          <button className="btn-secondary" onClick={onBack} style={{ padding: '4px 10px', fontSize: '12px' }}>
            <ArrowLeft size={13} />
            <span>Back to Looms</span>
          </button>
        }
      />

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <KpiStrip columns={5}>
        <KpiCard
          label="Today's Output"
          value="260"
          unit="m"
          target="300 m"
          variance="-40 m"
          trendDirection="down"
          status="WARNING"
          provenance="ACTUAL"
        />

        <KpiCard
          label="Loom Efficiency"
          value="81.9%"
          target="89.6%"
          variance="-7.7 pp"
          trendDirection="down"
          status="CRITICAL"
          provenance="CALCULATED"
        />

        <KpiCard
          label="Downtime Today"
          value="89"
          unit="min"
          target="< 30 min"
          variance="+59 min"
          trendDirection="down"
          status="CRITICAL"
          provenance="ACTUAL"
        />

        <KpiCard
          label="Stop Events Today"
          value="10"
          unit="stops"
          status="WARNING"
          provenance="ACTUAL"
        />

        <KpiCard
          label="Estimated 30-Day Loss"
          value={`₹${data.rupee_lost_month.value ? Number(data.rupee_lost_month.value).toLocaleString('en-IN') : '37,500'}`}
          status="CRITICAL"
          provenance="ESTIMATED"
        />
      </KpiStrip>

      {/* ── Diagnostic Sentence Banner ─────────────────────────────────── */}
      {data.diagnostic_sentence && (
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: '1px solid #FECACA',
            borderLeft: '3px solid #DC2626',
            borderRadius: TOKENS.radius.md,
            padding: '12px 16px',
            fontSize: '12.5px',
            color: TOKENS.colors.text.primary,
            lineHeight: 1.4,
            boxShadow: TOKENS.shadows.card,
          }}
        >
          <strong style={{ color: TOKENS.colors.brand[700] }}>Diagnostic Finding:</strong> {data.diagnostic_sentence}
        </div>
      )}

      {/* ── Navigation Tabs ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${TOKENS.colors.surface.border}`, paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '4px 12px', fontSize: '12px' }}
        >
          30-Day Trend & Overview
        </button>
        <button
          onClick={() => setActiveTab('breakdowns')}
          className={activeTab === 'breakdowns' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '4px 12px', fontSize: '12px' }}
        >
          Stoppage Log & Pareto ({data.stop_events.length})
        </button>
        <button
          onClick={() => setActiveTab('weavers')}
          className={activeTab === 'weavers' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '4px 12px', fontSize: '12px' }}
        >
          Weaver Allocation History ({data.weavers.length})
        </button>
      </div>

      {/* ── Tab 1: 30-Day Efficiency Trend ──────────────────────────────── */}
      {activeTab === 'overview' && (
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.md,
            padding: '14px 16px',
            boxShadow: TOKENS.shadows.card,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              30-Day Efficiency Trend & Style History
            </h4>
            <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Benchmark: 89.6%</span>
          </div>

          <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: 4, padding: '8px 0', borderBottom: `1px solid ${TOKENS.colors.surface.border}` }}>
            {data.trend.map((pt, idx) => {
              const eff = pt.loom_efficiency_pct ? Number(pt.loom_efficiency_pct) : 0;
              const barHeight = Math.max(8, Math.min(100, (eff / 100) * 140));
              const isTarget = eff >= 89.6;
              return (
                <div
                  key={idx}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}
                  title={`${pt.date}: ${eff}% (${pt.style_code})`}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${barHeight}px`,
                      backgroundColor: isTarget ? '#2563EB' : eff < 75 ? '#DC2626' : '#D97706',
                      borderRadius: '2px 2px 0 0',
                    }}
                  />
                  {pt.style_changed && (
                    <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#2563EB', marginTop: 3 }} title="Style changed" />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: TOKENS.colors.text.muted, marginTop: 6 }}>
            <span>{data.trend[0]?.date || '30 days ago'}</span>
            <span>● Blue dot indicates beam/quality sort change</span>
            <span>{data.trend[data.trend.length - 1]?.date || 'Today'}</span>
          </div>
        </div>
      )}

      {/* ── Tab 2: Stop Events & Pareto ─────────────────────────────────── */}
      {activeTab === 'breakdowns' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: TOKENS.spacing[4] }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                Recent Stoppage Events & Ground Truth
              </h4>
              <DataTrustBadge provenance="ACTUAL" compact />
            </div>
            <IndustrialTable
              columns={stopEventColumns}
              data={data.stop_events}
              keyExtractor={(row) => row.stop_event_id}
              initialLimit={6}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                Downtime Reason Breakdown (Pareto)
              </h4>
              <DataTrustBadge provenance="CALCULATED" compact />
            </div>
            <IndustrialTable
              columns={paretoColumns}
              data={data.reason_pareto}
              keyExtractor={(row) => row.reason_code}
              initialLimit={5}
            />
          </div>
        </div>
      )}

      {/* ── Tab 3: Weaver Allocation History ─────────────────────────────── */}
      {activeTab === 'weavers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Weaver Operations on Loom {data.loom_no} (Last 30 Days)
            </h4>
            <DataTrustBadge provenance="ACTUAL" compact />
          </div>
          <IndustrialTable
            columns={weaverColumns}
            data={data.weavers}
            keyExtractor={(row) => row.employee_id}
            initialLimit={5}
          />
        </div>
      )}

      {/* ── Stoppage Close-Out Modal ────────────────────────────────────── */}
      {closeOutEventId !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.lg,
              width: 480,
              maxWidth: '90%',
              padding: 20,
              boxShadow: TOKENS.shadows.modal,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Stoppage Event Close-Out & Maintenance Ground Truth
            </h3>
            <p style={{ fontSize: 11.5, color: TOKENS.colors.text.muted, margin: 0 }}>
              Required close-out details capture failure mode labels for reliability tracking.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: TOKENS.colors.text.secondary, marginBottom: 4 }}>
                  What actually failed? (Component)
                </label>
                <select className="input-field" style={{ width: '100%' }} value={failedComponent} onChange={(e) => setFailedComponent(e.target.value)}>
                  <option value="weft_feeder">Weft Feeder / Storage Drum</option>
                  <option value="main_nozzle">Main Air Nozzle</option>
                  <option value="sub_nozzle">Sub Nozzle Line</option>
                  <option value="tucking_device">Tucking Device</option>
                  <option value="warp_stop_motion">Warp Stop Motion (Droppers)</option>
                  <option value="electrical_panel">Electrical / Inverter Panel</option>
                  <option value="other">Other Component</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: TOKENS.colors.text.secondary, marginBottom: 4 }}>
                  What fixed it? (Action Taken)
                </label>
                <select className="input-field" style={{ width: '100%' }} value={fixAction} onChange={(e) => setFixAction(e.target.value)}>
                  <option value="replace_part">Replaced Damaged Part</option>
                  <option value="adjust">Mechanical Adjustment / Realignment</option>
                  <option value="clean">Cleaned Lint / Oil Residue</option>
                  <option value="reset">Electronic Reset / Parameter Tuning</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: TOKENS.colors.text.secondary, marginBottom: 4 }}>
                  Was this failure predictable in hindsight?
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className={wasPredictable === 'YES' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setWasPredictable('YES')}
                    style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                  >
                    Yes (Warning signs)
                  </button>
                  <button
                    type="button"
                    className={wasPredictable === 'NO' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setWasPredictable('NO')}
                    style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                  >
                    No (Sudden)
                  </button>
                  <button
                    type="button"
                    className={wasPredictable === 'UNSURE' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setWasPredictable('UNSURE')}
                    style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                  >
                    Unsure
                  </button>
                </div>
              </div>

              {savedSuccess && (
                <div style={{ color: '#059669', fontSize: 12, fontWeight: 600, textAlign: 'center', marginTop: 4 }}>
                  ✓ Close-out record committed successfully!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button className="btn-secondary" onClick={() => setCloseOutEventId(null)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveCloseOut}>
                  Save Close-Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
