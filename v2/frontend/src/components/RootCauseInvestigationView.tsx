import { useEffect, useState } from 'react';
import {
  fetchRootCauseEvents,
  fetchRootCauseInvestigation,
} from '../api';
import type {
  CandidateEventRow,
  RootCauseInvestigationResponse,
} from '../api';
import {
  PageHeader,
  DataTrustBadge,
  LoadingState,
  ErrorState,
} from '../design-system';
import {
  Clock,
  ExternalLink,
  Info,
  Check,
  X,
} from 'lucide-react';

import { BreakdownSubNav } from './BreakdownSubNav';

interface RootCauseInvestigationViewProps {
  initialLoomId?: number;
  initialEventId?: number;
  selectedDate?: string;
  onSelectLoom?: (loomId: number) => void;
  onNavigateSubmodule?: (tab: string, context?: any) => void;
}

export function RootCauseInvestigationView({
  initialLoomId,
  initialEventId,
  selectedDate = '2026-07-31',
  onSelectLoom: _onSelectLoom,
  onNavigateSubmodule,
}: RootCauseInvestigationViewProps) {
  const [date, setDate] = useState(selectedDate);
  const [eventsList, setEventsList] = useState<CandidateEventRow[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(initialEventId || null);
  const [selectedLoomFilter, setSelectedLoomFilter] = useState<number | undefined>(initialLoomId);
  const [data, setData] = useState<RootCauseInvestigationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Evidence Drawer & Actions
  const [isWhyDrawerOpen, setIsWhyDrawerOpen] = useState(false);
  const [actionPlanToast, setActionPlanToast] = useState<string | null>(null);
  const [watchToast, setWatchToast] = useState<string | null>(null);

  // 1. Load candidate events list for the selector
  useEffect(() => {
    setLoading(true);
    fetchRootCauseEvents(date, 'ATM', selectedLoomFilter)
      .then((events) => {
        setEventsList(events);
        if (events.length > 0) {
          // If initialEventId is among them, keep it; else pick the first
          const exists = selectedEventId && events.some((e) => e.stop_event_id === selectedEventId);
          if (!exists) {
            setSelectedEventId(events[0].stop_event_id);
          }
        } else {
          setSelectedEventId(null);
          setData(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load candidate events:', err);
        setError('Failed to load breakdown events for selection.');
        setLoading(false);
      });
  }, [date, selectedLoomFilter]);

  // 2. Load detailed investigation for the selected event
  useEffect(() => {
    if (!selectedEventId) return;
    setLoading(true);
    fetchRootCauseInvestigation(selectedEventId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch event investigation:', err);
        setError(`Failed to retrieve investigation for Event #${selectedEventId}`);
        setLoading(false);
      });
  }, [selectedEventId]);

  const handleAddToActionPlan = (title: string) => {
    setActionPlanToast(title);
    setTimeout(() => setActionPlanToast(null), 2500);
  };

  const handleWatch = (loomNo: string) => {
    setWatchToast(`Loom ${loomNo} added to Floor Supervisor Watchlist for next shift`);
    setTimeout(() => setWatchToast(null), 2500);
  };

  if (loading && !data) return <LoadingState message="Loading Event Evidence & Telemetry..." />;
  if (error && !data) return <ErrorState message={error} onRetry={() => setSelectedEventId(selectedEventId)} />;

  const ev = data?.event;
  const baseline = data?.baseline_comparison;
  const impact = data?.business_impact;
  const timeline = data?.timeline || [];
  const chain = data?.evidence_chain || [];
  const factors = data?.contributing_factors || [];
  const recommendation = data?.recommendation;

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
        title="Root Cause Investigation"
        subtitle="Investigate the evidence behind a breakdown and identify the most supported contributing factors"
        breadcrumbs={['Operations', 'Breakdowns', 'Root Cause']}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsWhyDrawerOpen(true)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Info size={14} />
              <span>[Why this cause?]</span>
            </button>
            <DataTrustBadge provenance={impact?.rate_source || 'CALCULATED'} />
          </div>
        }
      />

      {/* ── Universal Breakdown Sub-Navigation ── */}
      <BreakdownSubNav
        currentTab="root-cause"
        onSelectTab={(tab) => onNavigateSubmodule?.(tab)}
      />

      {/* ── SECTION 1: SELECT EVENT (Compact Dropdown Selector) ── */}
      <div style={{
        margin: '0 24px 20px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 8,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Work Date
            </span>
            <div style={{ marginTop: 3 }}>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 5, padding: '4px 8px', fontSize: '12px', fontWeight: 700, color: '#0F172A' }}
              >
                <option value="2026-07-31">31 Jul 2026</option>
                <option value="2026-07-30">30 Jul 2026</option>
                <option value="2026-07-29">29 Jul 2026</option>
              </select>
            </div>
          </div>

          <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />

          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Loom Filter
            </span>
            <div style={{ marginTop: 3 }}>
              <select
                value={selectedLoomFilter || ''}
                onChange={(e) => setSelectedLoomFilter(e.target.value ? Number(e.target.value) : undefined)}
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 5, padding: '4px 8px', fontSize: '12px', fontWeight: 700, color: '#0F172A' }}
              >
                <option value="">All Looms ({eventsList.length} events)</option>
                {Array.from(new Set(eventsList.map((e) => e.loom_id))).map((lid) => {
                  const item = eventsList.find((e) => e.loom_id === lid);
                  return (
                    <option key={lid} value={lid}>
                      Loom {item?.loom_no}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />

          <div style={{ minWidth: 280 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Breakdown / Event Candidate
            </span>
            <div style={{ marginTop: 3 }}>
              <select
                value={selectedEventId || ''}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                style={{ width: '100%', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 5, padding: '4px 8px', fontSize: '12px', fontWeight: 700, color: '#0F172A' }}
              >
                {eventsList.map((evItem) => (
                  <option key={evItem.stop_event_id} value={evItem.stop_event_id}>
                    Loom {evItem.loom_no} · Shift {evItem.shift_code} · {evItem.duration_minutes}m · {evItem.reason_label_en} ({evItem.reason_category})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {ev && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Event ID: <strong>#{ev.stop_event_id}</strong>
            </span>
            <button
              onClick={() => onNavigateSubmodule?.('anomalies', { loomId: ev.loom_id })}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 5,
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>View Related Anomalies</span>
              <ExternalLink size={11} />
            </button>
          </div>
        )}
      </div>

      {ev && (
        <>
          {/* ── SECTION 2: WHAT HAPPENED? (Event Summary Card) ── */}
          <div style={{
            margin: '0 24px 20px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: ev.duration_minutes >= 30 ? '#B91C1C' : '#B45309',
                    background: ev.duration_minutes >= 30 ? '#FEF2F2' : '#FFFBEB',
                    border: `1px solid ${ev.duration_minutes >= 30 ? '#FECACA' : '#FDE68A'}`,
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}>
                    {ev.event_class.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                    Shift {ev.shift_code} · Shed: {ev.shed_code || 'Main Shed'}
                  </span>
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 8 }}>
                  Loom {ev.loom_no} stopped for {ev.duration_minutes} minutes at {ev.raised_at ? ev.raised_at.slice(11, 16) : 'Shift Start'}
                </div>

                <div style={{ fontSize: '12px', color: '#475569', marginTop: 4 }}>
                  Reason logged: <strong>{ev.reason_label_en}</strong> (Code: {ev.reason_code}) · Running Style: <strong>{ev.style_code}</strong> · Model: {ev.loom_type_code}
                </div>

                {ev.raw_remark && (
                  <div style={{ fontSize: '11.5px', color: '#64748B', fontStyle: 'italic', marginTop: 4 }}>
                    "{ev.raw_remark}"
                  </div>
                )}
              </div>

              {/* High-level Event Metrics */}
              <div style={{ display: 'flex', gap: 24, textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Stop Duration
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
                    {ev.duration_minutes} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>min</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Lost Production
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
                    {impact?.lost_meters} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>m</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    ₹ Exposure
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
                    {impact?.revenue_exposure ? `₹${Math.round(impact.revenue_exposure).toLocaleString()}` : 'RATE MISSING'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 3 & 4: EVIDENCE TIMELINE & ROOT CAUSE CHAIN (Side-by-side) ── */}
          <div style={{ margin: '0 24px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
            {/* EVIDENCE TIMELINE (PRIMARY VISUALIZATION - Chronological NOT generic table) */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Evidence Timeline
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Chronological progression reconstructed from sensor counters & ticket logs
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
                  {timeline.length} Signals Captured
                </span>
              </div>

              <div style={{ position: 'relative', paddingLeft: 24 }}>
                {/* Vertical connecting line */}
                <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: '#E2E8F0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {timeline.map((item, idx) => {
                    let dotColor = '#64748B';
                    let badgeColor = '#475569';
                    let bgBadge = '#F1F5F9';
                    let borderBadge = '#E2E8F0';

                    if (item.type === 'CRITICAL') {
                      dotColor = '#DC2626';
                      badgeColor = '#B91C1C';
                      bgBadge = '#FEF2F2';
                      borderBadge = '#FECACA';
                    } else if (item.type === 'WARNING') {
                      dotColor = '#D97706';
                      badgeColor = '#B45309';
                      bgBadge = '#FFFBEB';
                      borderBadge = '#FDE68A';
                    } else if (item.type === 'SUCCESS') {
                      dotColor = '#059669';
                      badgeColor = '#047857';
                      bgBadge = '#ECFDF5';
                      borderBadge = '#A7F3D0';
                    }

                    return (
                      <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        {/* Node Dot */}
                        <div style={{
                          position: 'absolute',
                          left: -24,
                          top: 4,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: dotColor,
                          border: '3px solid #FFFFFF',
                          boxShadow: '0 0 0 1px #CBD5E1',
                        }} />

                        <div style={{ minWidth: 46, fontSize: '12px', fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                          {item.time}
                        </div>

                        <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '8px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                              {item.label}
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: badgeColor, background: bgBadge, border: `1px solid ${borderBadge}`, padding: '1px 6px', borderRadius: 3 }}>
                              {item.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#475569', marginTop: 3 }}>
                            {item.detail}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ROOT CAUSE CHAIN (Causal hierarchy: OBSERVED -> INFERRED -> PREDICTED) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Causal Evidence Chain
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Strict validation tier: Grounded facts distinguished from statistical inference
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {chain.map((link, idx) => (
                    <div key={idx} style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 6,
                      padding: '12px 14px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: '#475569',
                          background: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}>
                          Tier: {link.tier}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                          {link.strength}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                        {link.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#475569', marginTop: 3, lineHeight: 1.4 }}>
                        {link.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SECTION 5: COMPARED WITH NORMAL (Baseline Duration Bar) ── */}
              {baseline && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                    Compared with 30-Day Normal Baseline
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginBottom: 3 }}>
                        <span>NORMAL MEDIAN DURATION</span>
                        <span><strong>{baseline.expected_duration_min} min</strong></span>
                      </div>
                      <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: '40%', height: '100%', background: '#64748B' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#0F172A', marginBottom: 3 }}>
                        <span>THIS EVENT DURATION</span>
                        <span><strong>{baseline.current_duration_min} min</strong> ({baseline.duration_ratio}x baseline)</span>
                      </div>
                      <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, Math.round((baseline.current_duration_min / Math.max(1, baseline.expected_duration_min * 2)) * 100))}%`,
                          height: '100%',
                          background: '#0F172A',
                        }} />
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: '#475569', background: '#F8FAFC', padding: '6px 10px', borderRadius: 4, marginTop: 2 }}>
                      Loom {ev.loom_no} has accumulated <strong>{baseline.history_30d_stops_count} stops</strong> in this category over the past 30 days.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── SECTION 6: CONTRIBUTING FACTORS (Ranked by Evidence Strength) ── */}
          <div style={{ margin: '0 24px 24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Contributing Factors Ranked by Evidence Strength
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Evaluated against PLC event logs, style yarn parameters, and shift logs
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {factors.map((f, i) => (
                <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 6, padding: '12px', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Source: {f.source}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 3,
                      color: f.evidence_strength === 'HIGH' ? '#B91C1C' : '#475569',
                      background: f.evidence_strength === 'HIGH' ? '#FEF2F2' : '#F1F5F9',
                      border: `1px solid ${f.evidence_strength === 'HIGH' ? '#FECACA' : '#E2E8F0'}`,
                    }}>
                      {f.evidence_strength}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                    {f.factor}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: 4 }}>
                    {f.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 7 & 8: BUSINESS IMPACT & RECOMMENDED NEXT STEP ── */}
          <div style={{ margin: '0 24px 24px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
            {/* BUSINESS IMPACT */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                Business Impact
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: 14 }}>
                Grounded on Style {ev.style_code} commercial rate
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>LOST PHYSICAL METRES</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                    {impact?.lost_meters} <span style={{ fontSize: '12px', color: '#64748B' }}>m</span>
                  </div>
                </div>

                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>REVENUE EXPOSURE (INR)</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                    {impact?.revenue_exposure ? `₹${Math.round(impact.revenue_exposure).toLocaleString()}` : 'RATE MISSING'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: 2 }}>
                    Provenance: <strong>{impact?.rate_source}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* RECOMMENDED NEXT STEP */}
            {recommendation && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Recommended Managerial Next Step
                    </div>
                    <span style={{ fontSize: '10px', background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                      ACTION RECOMMENDATION
                    </span>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {recommendation.recommended_step}
                  </div>

                  <div style={{ marginTop: 10, padding: '10px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase' }}>
                      Why this step?
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: 2 }}>
                      {recommendation.why_this_step}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleWatch(ev.loom_no)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: 6,
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0F172A',
                      cursor: 'pointer',
                    }}
                  >
                    Watch Loom {ev.loom_no}
                  </button>
                  <button
                    onClick={() => handleAddToActionPlan(recommendation.action_title)}
                    style={{
                      background: '#0F172A',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 18px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    + Add to Action Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Contextual Evidence Slide-Out Drawer ("Why this cause?") ── */}
      {isWhyDrawerOpen && ev && (
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
                Causal Interpretation
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Grounded telemetry rationale for Loom {ev.loom_no}
              </div>
            </div>
            <button
              onClick={() => setIsWhyDrawerOpen(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Primary Root Factor
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: 4 }}>
                {ev.reason_label_en} ({ev.reason_category})
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                The machine stayed stopped for {ev.duration_minutes} minutes, which is {baseline?.duration_ratio}x the typical 18-minute reset cycle.
                Historical records confirm {baseline?.history_30d_stops_count} occurrences in 30 days.
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>
                Reconciled Telemetry
              </div>
              <div style={{ fontSize: '12px', color: '#334155' }}>
                • Style: <strong>{ev.style_code}</strong><br />
                • Lost Output: <strong>{impact?.lost_meters} meters</strong><br />
                • Commercial Exposure: <strong>₹{impact?.revenue_exposure ? Math.round(impact.revenue_exposure).toLocaleString() : 'N/A'}</strong><br />
                • Shift: <strong>Shift {ev.shift_code}</strong>
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: 4 }}>
                Next Recommended Step
              </div>
              <div style={{ fontSize: '12px', color: '#475569' }}>
                {recommendation?.recommended_step}
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <button
              onClick={() => {
                handleAddToActionPlan(recommendation?.action_title || 'Inspect Loom');
                setIsWhyDrawerOpen(false);
              }}
              style={{
                width: '100%',
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
          </div>
        </div>
      )}
    </div>
  );
}
