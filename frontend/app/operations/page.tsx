'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { pct, rupee, inr, fmtDate, fmtMinutes } from '@/lib/utils';
import { DataStamp } from '@/components/DataStamp';
import { StatusDot, StatusBadge } from '@/components/StatusBadge';
import type { ProductionVarianceData, MachinePerformanceItem, ShiftPerformanceItem } from '@/lib/types';

type SortKey = 'machine_id' | 'efficiency' | 'variance' | 'actual' | 'warp' | 'weft';
type SortDir = 'asc' | 'desc';

function statusFromEff(eff: number): 'critical' | 'warn' | 'ok' {
  if (eff < 80) return 'critical';
  if (eff < 90) return 'warn';
  return 'ok';
}

function ShiftScorecard({ shifts }: { shifts: ShiftPerformanceItem[] }) {
  if (!shifts.length) return null;
  return (
    <div style={{ borderBottom: '1px solid var(--atm-border)', overflowX: 'auto' }}>
      <div className="card-header" style={{ borderRadius: 0 }}>Shift Scorecard</div>
      <div style={{ display: 'flex', minWidth: 420 }}>
        {shifts.map((s, i) => {
          const status = statusFromEff(s.efficiency);
          return (
            <div key={i} style={{ flex: 1, padding: '12px', borderRight: i < shifts.length - 1 ? '1px solid var(--atm-border)' : 'none' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Shift {s.shift}
              </div>
              <div className="num" style={{ fontSize: '1.5rem', fontWeight: 700, color: status === 'ok' ? 'var(--ok)' : status === 'warn' ? 'var(--warn)' : 'var(--critical)', marginBottom: 4 }}>
                {pct(s.efficiency)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-700)' }}>
                <div className="num">{inr(s.actual)} / {inr(s.target)}</div>
                <div className="num" style={{ color: s.variance < 0 ? 'var(--critical)' : 'var(--ok)', marginTop: 2 }}>
                  {s.variance >= 0 ? '+' : ''}{inr(s.variance)} units
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OperationsPage() {
  const [data, setData]           = useState<ProductionVarianceData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [isDemo, setIsDemo]       = useState(false);
  const [sortKey, setSortKey]     = useState<SortKey>('efficiency');
  const [sortDir, setSortDir]     = useState<SortDir>('asc');
  const [filter, setFilter]       = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProductionVariance();
      setData(res.data);
      setGeneratedAt(res.metadata.generated_at);
      setIsDemo(res.data_quality.is_demo);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const machines: MachinePerformanceItem[] = (data?.machine_performance ?? [])
    .filter(m => !filter || m.machine_id.toLowerCase().includes(filter.toLowerCase()) || m.machine_type.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'machine_id':  return a.machine_id.localeCompare(b.machine_id) * dir;
        case 'efficiency':  return (a.efficiency - b.efficiency) * dir;
        case 'variance':    return (a.variance - b.variance) * dir;
        case 'actual':      return (a.actual - b.actual) * dir;
        default:            return 0;
      }
    });

  function SortBtn({ col }: { col: SortKey }) {
    const active = sortKey === col;
    return (
      <button
        onClick={() => toggleSort(col)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: active ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: active ? 700 : 500, padding: '0 2px' }}
        title={`Sort by ${col}`}
      >
        {active ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
      </button>
    );
  }

  if (loading) return <div style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--ink-500)', fontSize: '0.875rem' }}>Loading operations data…</div>;
  if (error)   return (
    <div style={{ padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>
      <div className="no-data-state">
        <div style={{ fontWeight: 600 }}>Could not load data</div>
        <div className="reason">{error}</div>
        <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={load}>↻ Retry</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 0 60px' }}>

      {/* Provenance */}
      <div style={{ padding: '8px 16px', background: 'var(--ink-100)', borderBottom: '1px solid var(--atm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DataStamp asOf={generatedAt} isDemo={isDemo} rows={data?.evidence?.production_log_ids?.length} source="CSV import" />
          <span style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', fontWeight: 600 }}>
            Loom Operations & Telemetry · ATM
          </span>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: '0.75rem', minHeight: 28, padding: '0 8px' }} onClick={load}>↻ Refresh</button>
      </div>

      {/* Hero Header & Connected Metric Strip */}
      {data?.summary && (
        <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid var(--atm-border)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', color: 'var(--ink-500)', marginBottom: 8, textTransform: 'uppercase' }}>
            Operations · {data.summary.date ? fmtDate(data.summary.date) : 'Today'} · All Looms · ATM
          </div>

          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--atm-border)', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
            {[
              {
                label: 'Avg Efficiency',
                value: pct(data.summary.average_efficiency),
                note: data.summary.average_efficiency >= 90 ? 'Within target range' : 'Below 90% benchmark',
                status: statusFromEff(data.summary.average_efficiency),
              },
              {
                label: 'Total Output',
                value: inr(data.summary.total_actual),
                note: `actual meters produced`,
                status: 'nodata' as const,
              },
              {
                label: 'Production Target',
                value: inr(data.summary.total_target),
                note: `standard mill quota`,
                status: 'nodata' as const,
              },
              {
                label: 'Net Variance',
                value: `${data.summary.variance_qty >= 0 ? '+' : ''}${inr(data.summary.variance_qty)}`,
                note: `${data.summary.variance_pct.toFixed(1)}% vs target`,
                status: data.summary.variance_qty >= 0 ? 'ok' : 'critical' as any,
                isStatus: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRight: i < 3 ? '1px solid var(--atm-border)' : 'none',
                  background: item.isStatus && data.summary.variance_qty < 0 ? 'var(--critical-bg)' : '#fff',
                }}
              >
                <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                  {item.label}
                </div>
                <div
                  className="num"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: item.status === 'ok' ? 'var(--ok)' : item.status === 'critical' ? 'var(--critical)' : 'var(--ink-900)',
                  }}
                >
                  {item.value}
                </div>
                {item.note && <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', marginTop: 2 }}>{item.note}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shift Scorecard */}
      {data?.shift_performance && <ShiftScorecard shifts={data.shift_performance} />}

      {/* Filter & Toolbar */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--atm-border)', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <input
          type="search"
          placeholder="Filter by loom ID, model, or type…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '7px 12px', border: '1px solid var(--atm-border)', borderRadius: 4, fontSize: '0.875rem', width: '100%', maxWidth: 320, outline: 'none', color: 'var(--ink-900)' }}
          id="operations-filter"
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>
          Showing <strong>{machines.length}</strong> of <strong>{data?.machine_performance?.length ?? 0}</strong> looms
        </div>
      </div>

      {/* Loom Performance Table */}
      <div className="table-scroll" style={{ background: '#fff' }}>
        <table className="data-table" id="operations-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>
                Loom <SortBtn col="machine_id" />
              </th>
              <th style={{ textAlign: 'left' }}>Model / Dept</th>
              <th>Actual <SortBtn col="actual" /></th>
              <th>Target</th>
              <th>Efficiency <SortBtn col="efficiency" /></th>
              <th>Variance <SortBtn col="variance" /></th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {machines.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--nodata)' }}>
                  {filter ? `No looms match "${filter}"` : 'No production data for this date'}
                </td>
              </tr>
            ) : machines.map((m) => {
              const status = statusFromEff(m.efficiency);
              return (
                <tr key={m.machine_id} className={`row-${status}`}>
                  <td style={{ fontWeight: 600, fontVariantNumeric: 'normal' }}>{m.machine_id}</td>
                  <td style={{ fontVariantNumeric: 'normal', color: 'var(--ink-700)' }}>{m.machine_type}</td>
                  <td>{inr(m.actual)}</td>
                  <td>{inr(m.target)}</td>
                  <td>
                    <span className="num" style={{ fontWeight: 700, color: status === 'ok' ? 'var(--ok)' : status === 'warn' ? 'var(--warn)' : 'var(--critical)' }}>
                      {pct(m.efficiency)}
                    </span>
                  </td>
                  <td>
                    <span className="num" style={{ color: m.variance >= 0 ? 'var(--ok)' : 'var(--critical)' }}>
                      {m.variance >= 0 ? '+' : ''}{inr(m.variance)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <StatusDot status={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Best / Worst Split Callout matching Revenue page */}
      {(data?.best_machine || data?.worst_machine) && (
        <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--atm-border)', borderBottom: '1px solid var(--atm-border)' }}>
          {data.best_machine && (
            <div style={{ flex: 1, padding: '12px 16px', background: 'var(--ok-bg)', borderRight: '1px solid var(--atm-border)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--ok)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                Best Performing Loom
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{data.best_machine.machine_id}</div>
              <div className="num" style={{ color: 'var(--ok)', fontWeight: 700 }}>{pct(data.best_machine.efficiency)} efficiency</div>
            </div>
          )}
          {data.worst_machine && (
            <div style={{ flex: 1, padding: '12px 16px', background: 'var(--critical-bg)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--critical)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                Lowest Performing Loom (Action Required)
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{data.worst_machine.machine_id}</div>
              <div className="num" style={{ color: 'var(--critical)', fontWeight: 700 }}>{pct(data.worst_machine.efficiency)} efficiency</div>
            </div>
          )}
        </div>
      )}

      {/* Data footer note matching Revenue page */}
      <div style={{ padding: '10px 16px', fontSize: '0.6875rem', color: 'var(--ink-500)', background: 'var(--ink-100)' }}>
        ⓘ Operations telemetry computed from shift machine counters. Target baseline: 93.0% standard weaving efficiency.
      </div>
    </div>
  );
}
