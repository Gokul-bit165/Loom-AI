import { useEffect, useState } from 'react';
import { fetchBreakdownAnomalies } from '../api';
import type {
  BreakdownAnomaliesResponse,
  AnomalyCardItem,
} from '../api';
import {
  PageHeader,
  DataTrustBadge,
  LoadingState,
  ErrorState,
} from '../design-system';
import {
  Clock,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';

import { BreakdownSubNav } from './BreakdownSubNav';

interface BreakdownAnomaliesViewProps {
  initialLoomId?: number;
  selectedDate?: string;
  onSelectLoom?: (loomId: number) => void;
  onNavigateSubmodule?: (tab: string, context?: any) => void;
}

export function BreakdownAnomaliesView({
  initialLoomId,
  selectedDate = '2026-07-31',
  onSelectLoom,
  onNavigateSubmodule,
}: BreakdownAnomaliesViewProps) {
  const [date, setDate] = useState(selectedDate);
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [data, setData] = useState<BreakdownAnomaliesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active drawer for [Why abnormal?]
  const [activeAnomalyDrawer, setActiveAnomalyDrawer] = useState<AnomalyCardItem | null>(null);
  const [actionPlanToast, setActionPlanToast] = useState<string | null>(null);
  const [watchToast, setWatchToast] = useState<string | null>(null);

  const loadAnomalies = () => {
    setLoading(true);
    setError(null);
    fetchBreakdownAnomalies(date, 'ATM', undefined, initialLoomId, severityFilter || undefined)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load anomalies:', err);
        setError('Failed to scan factory for breakdown anomalies.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAnomalies();
  }, [date, severityFilter, initialLoomId]);

  const handleAddToActionPlan = (title: string) => {
    setActionPlanToast(title);
    setTimeout(() => setActionPlanToast(null), 2500);
  };

  const handleWatch = (loomNo: string) => {
    setWatchToast(`Loom ${loomNo} added to Floor Supervisor Watchlist for next shift`);
    setTimeout(() => setWatchToast(null), 2500);
  };

  if (loading) return <LoadingState message="Scanning Factory Telemetry for Material Anomalies..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to scan anomalies.'} onRetry={loadAnomalies} />;

  const summary = data.summary;
  const timeline = data.timeline || [];
  const anomalies = data.anomalies || [];

  return (
    <div style={{ padding: '0 0 60px', maxWidth: '1440px', margin: '0 auto', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* ── Notification Toasts ── */}
      {actionPlanToast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, background: '#0F172A', color: '#FFFFFF',
          padding: '12px 18px', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 10, zIndex: 9999, fontSize: '13px', fontWeight: 600,
        }}>
          <Check size={16} color="#22C55E" />
          <span>Action Plan Item Created: {actionPlanToast}</span>
        </div>
      )}
      {watchToast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, background: '#1E293B', color: '#FFFFFF',
          padding: '12px 18px', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 10, zIndex: 9999, fontSize: '13px', fontWeight: 600,
        }}>
          <Clock size={16} color="#94A3B8" />
          <span>{watchToast}</span>
        </div>
      )}

      {/* ── Top Header ── */}
      <PageHeader
        title="Anomalies & Patterns"
        subtitle="Material deviations from normal machine, shift, and process behaviour"
        breadcrumbs={['Operations', 'Breakdowns', 'Anomalies']}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '5px 10px', borderRadius: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Date:</span>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 700, color: '#0F172A', outline: 'none', cursor: 'pointer' }}
              >
                <option value="2026-07-31">31 Jul 2026</option>
                <option value="2026-07-30">30 Jul 2026</option>
                <option value="2026-07-29">29 Jul 2026</option>
              </select>
            </div>
            <DataTrustBadge provenance="CALCULATED" />
          </div>
        }
      />

      {/* ── Universal Breakdown Sub-Navigation ── */}
      <BreakdownSubNav
        currentTab="abnormal"
        onSelectTab={(tab) => onNavigateSubmodule?.(tab)}
      />

      {/* ── SECTION 1: DETECTION SUMMARY (Compact Visual Severity Distribution) ── */}
      <div style={{ margin: '0 24px 20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Material Anomalies
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              {summary.total_anomalies} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>detected</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Scanned across {summary.evaluated_looms_count} active looms
            </div>
          </div>

          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Critical Severity
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              {summary.critical}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Immediate intervention required
            </div>
          </div>

          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Warning Severity
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              {summary.warning}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Elevated stop frequency
            </div>
          </div>

          <div style={{ borderRight: '1px solid #F1F5F9', paddingRight: 12 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Production Exposure
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              ~{Math.round(summary.total_meters_exposure)} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>m</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Output loss if unresolved
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Commercial Exposure
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              {summary.total_rupee_exposure ? `₹${Math.round(summary.total_rupee_exposure).toLocaleString()}` : 'RATE MISSING'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Based on active style pricing
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: ANOMALY TIMELINE (Horizontal Time-of-Day Progression) ── */}
      <div style={{ margin: '0 24px 24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Anomaly Time-of-Day Progression
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Identifies <strong>WHEN</strong> abnormal behavior started across the factory floor
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Shift 1 (06:00) → Shift 2 (14:00) → Shift 3 (22:00)
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
          gap: '8px',
          width: '100%',
        }}>
          {timeline.map((slot, idx) => {
            const uniqueLooms = Array.from(new Set(slot.anomalies.map((a) => a.loom)));
            const isCritical = slot.has_critical;
            const hasAnomalies = slot.count > 0;

            let loomSummary = '';
            if (uniqueLooms.length === 1) {
              loomSummary = uniqueLooms[0];
            } else if (uniqueLooms.length === 2) {
              loomSummary = uniqueLooms.join(', ');
            } else if (uniqueLooms.length > 2) {
              loomSummary = `${uniqueLooms.slice(0, 2).join(', ')} +${uniqueLooms.length - 2}`;
            }

            const tooltipText = hasAnomalies
              ? `${slot.time_slot}: ${slot.count} anomal${slot.count === 1 ? 'y' : 'ies'} across ${uniqueLooms.length} loom(s) (${uniqueLooms.join(', ')})`
              : `${slot.time_slot}: Normal operation (0 anomalies)`;

            return (
              <div
                key={idx}
                title={tooltipText}
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  background: isCritical ? '#FEF2F2' : (hasAnomalies ? '#FFFBEB' : '#FFFFFF'),
                  border: isCritical ? '1px solid #FECACA' : (hasAnomalies ? '1px solid #FDE68A' : '1px solid #E2E8F0'),
                  borderRadius: 6,
                  padding: '10px 6px',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isCritical ? '#991B1B' : (hasAnomalies ? '#92400E' : '#64748B'),
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {slot.time_slot}
                </div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: isCritical ? '#DC2626' : (hasAnomalies ? '#D97706' : '#94A3B8'),
                  marginTop: 3,
                  fontVariantNumeric: 'tabular-nums',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {hasAnomalies ? `${slot.count} Anom` : '—'}
                </div>
                {hasAnomalies ? (
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: '10px',
                      color: isCritical ? '#B91C1C' : '#78350F',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    {loomSummary}
                  </div>
                ) : (
                  <div style={{ marginTop: 4, fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>
                    Normal
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: MATERIAL ANOMALY CARDS (With Baseline Comparison Bars) ── */}
      <div style={{ margin: '0 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Detected Material Anomalies ({anomalies.length})
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setSeverityFilter('')}
              style={{
                background: severityFilter === '' ? '#0F172A' : '#FFFFFF',
                color: severityFilter === '' ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1', borderRadius: 4, padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              All Severities
            </button>
            <button
              onClick={() => setSeverityFilter('CRITICAL')}
              style={{
                background: severityFilter === 'CRITICAL' ? '#0F172A' : '#FFFFFF',
                color: severityFilter === 'CRITICAL' ? '#FFFFFF' : '#0F172A',
                border: '1px solid #CBD5E1', borderRadius: 4, padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Critical Only
            </button>
          </div>
        </div>

        {anomalies.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '36px', textAlign: 'center' }}>
            <CheckCircle2 size={28} color="#047857" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>No Material Anomalies Detected</div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: 4 }}>
              Machine stop frequencies and durations are operating within statistical 30-day baseline tolerances.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16 }}>
            {anomalies.map((anom) => {
              const isCrit = anom.severity === 'CRITICAL';
              return (
                <div
                  key={anom.anomaly_id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  <div>
                    {/* Header: Title, Severity & Machine */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: isCrit ? '#B91C1C' : '#B45309',
                            background: isCrit ? '#FEF2F2' : '#FFFBEB',
                            border: `1px solid ${isCrit ? '#FECACA' : '#FDE68A'}`,
                            padding: '1px 6px',
                            borderRadius: 3,
                            textTransform: 'uppercase',
                          }}>
                            {anom.severity}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                            {anom.pattern_type.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                          {anom.title}
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectLoom?.(anom.affected_loom_id)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 4,
                          padding: '3px 8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0F172A',
                          cursor: 'pointer',
                        }}
                      >
                        Loom {anom.affected_loom_no}
                      </button>
                    </div>

                    {/* SECTION 5: BASELINE VISUAL COMPARISON */}
                    <div style={{ marginTop: 12, padding: '10px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 4 }}>
                        <span style={{ color: '#64748B' }}>NORMAL: {anom.normal_baseline}</span>
                        <span style={{ color: '#0F172A', fontWeight: 700 }}>
                          CURRENT: {anom.current_value} ({anom.deviation_label})
                        </span>
                      </div>

                      <div style={{ display: 'flex', height: 7, borderRadius: 4, overflow: 'hidden', background: '#E2E8F0' }}>
                        <div style={{ width: '35%', background: '#64748B' }} title="Normal baseline" />
                        <div style={{
                          width: `${Math.min(65, Math.max(20, Math.round((anom.current_value_val / Math.max(1, anom.normal_baseline_val * 2)) * 50)))}%`,
                          background: '#0F172A',
                        }} title="Deviation" />
                      </div>
                    </div>

                    {/* Evidence & Time Window */}
                    <div style={{ fontSize: '11.5px', color: '#475569', marginTop: 8 }}>
                      <strong>Evidence:</strong> {anom.evidence}
                    </div>

                    {/* SECTION 6: CORRELATED SIGNALS (Explicitly Labeled) */}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>
                        Correlated Signals <span style={{ fontWeight: 400 }}>(Not asserted as root cause)</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {anom.correlated_signals.map((sig, sidx) => (
                          <span
                            key={sidx}
                            style={{
                              fontSize: '10.5px',
                              background: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                              borderRadius: 4,
                              padding: '2px 6px',
                              color: '#334155',
                            }}
                          >
                            <strong>{sig.name}:</strong> {sig.value}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 7: BUSINESS IMPACT */}
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: 8 }}>
                      <div>
                        Loss Impact: <strong>~{anom.impact.lost_meters} m</strong>
                      </div>
                      <div>
                        Revenue Exposure: <strong style={{ color: '#0F172A' }}>
                          {anom.impact.revenue_exposure ? `₹${Math.round(anom.impact.revenue_exposure).toLocaleString()}` : 'RATE MISSING'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 8: ACTIONS */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                    <button
                      onClick={() => setActiveAnomalyDrawer(anom)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#0F172A',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                    >
                      [Why abnormal?]
                    </button>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleWatch(anom.affected_loom_no)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 4,
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        Watch
                      </button>

                      <button
                        onClick={() => onNavigateSubmodule?.('root-cause', { loomId: anom.affected_loom_id })}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 4,
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#0F172A',
                          cursor: 'pointer',
                        }}
                      >
                        Investigate
                      </button>

                      <button
                        onClick={() => handleAddToActionPlan(anom.title)}
                        style={{
                          background: '#0F172A',
                          border: 'none',
                          borderRadius: 4,
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        + Action Plan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Contextual Evidence Slide-Out Drawer ("Why abnormal?") ── */}
      {activeAnomalyDrawer && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '460px',
          background: '#FFFFFF',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #E2E8F0',
        }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                Anomaly Diagnosis
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Statistical rationale for Loom {activeAnomalyDrawer.affected_loom_no}
              </div>
            </div>
            <button
              onClick={() => setActiveAnomalyDrawer(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Statistical Deviation
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                {activeAnomalyDrawer.title}
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                {activeAnomalyDrawer.evidence} Normal tolerance is {activeAnomalyDrawer.normal_baseline}, but currently operating at {activeAnomalyDrawer.current_value}.
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>
                Correlated Signals
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '11.5px', color: '#334155' }}>
                {activeAnomalyDrawer.correlated_signals.map((sig, idx) => (
                  <div key={idx}>• {sig.name}: <strong>{sig.value}</strong></div>
                ))}
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: 4 }}>
                Recommended Action
              </div>
              <div style={{ fontSize: '12px', color: '#475569' }}>
                {activeAnomalyDrawer.recommendation}
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', gap: 10 }}>
            <button
              onClick={() => {
                handleAddToActionPlan(activeAnomalyDrawer.title);
                setActiveAnomalyDrawer(null);
              }}
              style={{
                flex: 1,
                padding: '10px',
                background: '#0F172A',
                border: 'none',
                borderRadius: 6,
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              + Add to Action Plan
            </button>
            <button
              onClick={() => {
                onNavigateSubmodule?.('root-cause', { loomId: activeAnomalyDrawer.affected_loom_id });
                setActiveAnomalyDrawer(null);
              }}
              style={{
                padding: '10px 14px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 6,
                color: '#0F172A',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Investigate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
