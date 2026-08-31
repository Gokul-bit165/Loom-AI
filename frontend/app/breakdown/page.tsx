'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { fmtMinutes, rupee, pct, inr } from '@/lib/utils';
import { DataStamp } from '@/components/DataStamp';
import type { BreakdownRankingData, MachineRankingItem, ReasonRankingItem } from '@/lib/types';

function ParetoBar({ pctOfTotal, cumulative }: { pctOfTotal: number; cumulative?: number }) {
  const past80 = (cumulative ?? 0) > 80;
  return (
    <div className="pareto-bar" style={{ flex: 1, margin: '0 8px' }}>
      <div className="pareto-bar-fill" style={{ width: `${pctOfTotal}%`, background: past80 ? 'var(--warn)' : 'var(--critical)' }} />
    </div>
  );
}

export default function BreakdownPage() {
  const [data, setData]             = useState<BreakdownRankingData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [period, setPeriod]         = useState<'today' | 'month'>('month');
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [isDemo, setIsDemo]         = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getBreakdownRanking({ period });
      setData(res.data);
      setGeneratedAt(res.metadata.generated_at);
      setIsDemo(res.data_quality.is_demo);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--ink-500)', fontSize: '0.875rem' }}>Loading breakdown data…</div>;
  if (error)   return (
    <div style={{ padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>
      <div className="no-data-state">
        <div style={{ fontWeight: 600 }}>Could not load breakdown data</div>
        <div className="reason">{error}</div>
        <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={load}>↻ Retry</button>
      </div>
    </div>
  );

  const machines  = data?.machine_ranking ?? [];
  const reasons   = data?.reason_ranking  ?? [];
  const shifts    = data?.shift_ranking   ?? [];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 0 60px' }}>

      {/* Provenance + period toggle */}
      <div style={{ padding: '8px 16px', background: 'var(--ink-100)', borderBottom: '1px solid var(--atm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <DataStamp asOf={generatedAt} isDemo={isDemo} source="CSV import" />
        <div style={{ display: 'flex', gap: 6 }}>
          {(['today', 'month'] as const).map(p => (
            <button key={p} className={`btn ${period === p ? 'btn-primary' : 'btn-outline'}`} style={{ minHeight: 32, padding: '0 12px', fontSize: '0.8125rem' }} onClick={() => setPeriod(p)}>
              {p === 'today' ? 'Today' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      {data?.has_data && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--atm-border)', overflowX: 'auto' }}>
          {[
            { label: 'Total events', value: inr(data.total_events) },
            { label: 'Total downtime', value: fmtMinutes(data.total_downtime_minutes) },
            { label: 'Avg event', value: fmtMinutes(Math.round(data.average_event_duration ?? 0)) },
            { label: 'Worst loom', value: data.highest_downtime_machine?.machine_id ?? '—' },
          ].map((item, i) => (
            <div key={i} style={{ flex: '1 1 100px', padding: '10px 14px', borderRight: i < 3 ? '1px solid var(--atm-border)' : 'none' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{item.label}</div>
              <div className="num" style={{ fontSize: '1.25rem', fontWeight: 700, color: i === 3 ? 'var(--critical)' : 'var(--ink-900)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {!data?.has_data && (
        <div style={{ padding: '24px 16px' }}>
          <div className="no-data-state">
            <div style={{ fontWeight: 600 }}>No breakdown data for this period</div>
            <div className="reason">Source: breakdown_events table · Period: {period}</div>
          </div>
        </div>
      )}

      {data?.has_data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 0, borderBottom: '1px solid var(--atm-border)' }}>

          {/* Machine downtime ranking */}
          <div style={{ borderRight: '1px solid var(--atm-border)' }}>
            <div className="card-header" style={{ borderRadius: 0 }}>Loom Downtime Ranking</div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Loom</th>
                    <th>Events</th>
                    <th>Downtime</th>
                    <th>% Total</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.slice(0, 15).map((m, i) => (
                    <tr key={m.machine_id} className={i === 0 ? 'row-critical' : i < 3 ? 'row-warn' : ''}>
                      <td style={{ fontWeight: 600, fontVariantNumeric: 'normal' }}>{m.machine_id}</td>
                      <td>{m.event_count}</td>
                      <td>{fmtMinutes(m.downtime_minutes)}</td>
                      <td>{m.percentage_of_total_downtime.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reason Pareto */}
          <div>
            <div className="card-header" style={{ borderRadius: 0 }}>Stoppage Reason Pareto</div>
            <div style={{ padding: '8px 16px' }}>
              {reasons.map((r, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--atm-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500, flex: 1, marginRight: 8 }}>{r.reason}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexShrink: 0 }}>
                      <span className="num" style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{fmtMinutes(r.total_downtime_minutes)}</span>
                      <span className="num" style={{ fontSize: '0.75rem', color: 'var(--ink-500)', minWidth: 36, textAlign: 'right' }}>{r.percentage_of_total_downtime.toFixed(0)}%</span>
                      {r.cumulative_percentage !== undefined && (
                        <span className="num" style={{ fontSize: '0.6875rem', color: (r.cumulative_percentage ?? 0) <= 80 ? 'var(--critical)' : 'var(--nodata)', minWidth: 42, textAlign: 'right' }}>
                          cum {r.cumulative_percentage?.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <ParetoBar pctOfTotal={r.percentage_of_total_downtime} cumulative={r.cumulative_percentage} />
                </div>
              ))}
              <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', paddingTop: 6 }}>
                ⓘ Top reasons by downtime minutes. 80% line marks Pareto threshold.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shift ranking */}
      {shifts.length > 0 && (
        <div style={{ borderBottom: '1px solid var(--atm-border)' }}>
          <div className="card-header" style={{ borderRadius: 0 }}>Downtime by Shift</div>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {shifts.map((s, i) => (
              <div key={s.shift} style={{ flex: 1, padding: '12px 16px', borderRight: i < shifts.length - 1 ? '1px solid var(--atm-border)' : 'none', minWidth: 120 }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Shift {s.shift}</div>
                <div className="num" style={{ fontSize: '1.25rem', fontWeight: 700, color: i === 0 ? 'var(--critical)' : 'var(--ink-900)', marginBottom: 2 }}>
                  {fmtMinutes(s.downtime_minutes)}
                </div>
                <div className="num" style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>
                  {s.event_count} events · {s.percentage_of_total_downtime.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {(data?.recommendations ?? []).length > 0 && (
        <div style={{ borderBottom: '1px solid var(--atm-border)' }}>
          <div className="card-header" style={{ borderRadius: 0 }}>Recommendations</div>
          <div style={{ padding: '12px 16px' }}>
            {(data!.recommendations ?? []).slice(0, 5).map((r, i) => {
              const borderColour = r.priority === 'CRITICAL' ? 'var(--critical)' : r.priority === 'HIGH' ? 'var(--warn)' : 'var(--atm-border)';
              return (
                <div key={i} style={{ border: `1px solid ${borderColour}`, borderLeft: `4px solid ${borderColour}`, borderRadius: 3, padding: '10px 12px', marginBottom: 8, background: r.priority === 'CRITICAL' ? 'var(--critical-bg)' : '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: borderColour, letterSpacing: '0.05em', marginRight: 8 }}>{r.priority}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{r.issue}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)', marginTop: 3 }}>{r.suggested_action}</div>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', flexShrink: 0, textAlign: 'right' }}>
                      {r.confidence}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
