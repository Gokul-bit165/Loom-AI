'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { rupee, pct, deltaPct, inr, fmtDate } from '@/lib/utils';
import { DataStamp } from '@/components/DataStamp';
import { StatusDot } from '@/components/StatusBadge';
import { RupeeWithHint } from '@/components/FormulaHint';
import type { RevenueSummaryData } from '@/lib/types';

export default function RevenuePage() {
  const [data, setData]             = useState<RevenueSummaryData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [isDemo, setIsDemo]         = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRevenueSummary();
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

  if (loading) return <div style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--ink-500)', fontSize: '0.875rem' }}>Loading revenue data…</div>;
  if (error)   return (
    <div style={{ padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>
      <div className="no-data-state">
        <div style={{ fontWeight: 600 }}>Could not load revenue data</div>
        <div className="reason">{error}</div>
        <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={load}>↻ Retry</button>
      </div>
    </div>
  );

  const summary     = data?.summary;
  const revLoss     = data?.revenue_loss?.estimated_revenue_loss ?? 0;
  const machines    = data?.machine_ranking ?? [];
  const styles      = data?.fabric_style_ranking ?? [];
  const changePct   = summary?.change_vs_previous_day_pct;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 0 60px' }}>

      {/* Provenance */}
      <div style={{ padding: '8px 16px', background: 'var(--ink-100)', borderBottom: '1px solid var(--atm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <DataStamp asOf={generatedAt} isDemo={isDemo} source="CSV import" />
        <span style={{ fontSize: '0.6875rem', color: 'var(--critical)', fontWeight: 600 }}>
          ⚠ Owner / PM access only · Financial data
        </span>
        <button className="btn btn-ghost" style={{ fontSize: '0.75rem', minHeight: 28, padding: '0 8px' }} onClick={load}>↻</button>
      </div>

      {/* Hero revenue numbers */}
      {summary && (
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--atm-border)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', color: 'var(--ink-500)', marginBottom: 8, textTransform: 'uppercase' }}>
            Revenue · {summary.date ? fmtDate(summary.date) : '—'} · ATM
          </div>
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--atm-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
            {[
              { label: 'Today Revenue', value: rupee(summary.today_revenue), note: '' },
              { label: 'MTD Revenue', value: rupee(summary.mtd_revenue), note: `since ${summary.mtd_start_date ? fmtDate(summary.mtd_start_date) : '—'}` },
              { label: 'vs Yesterday', value: changePct != null ? deltaPct(changePct) : '—', note: `prev: ${rupee(summary.previous_day_revenue)}`, isStatus: true },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, padding: '12px 14px', borderRight: i < 2 ? '1px solid var(--atm-border)' : 'none', background: item.isStatus && (changePct ?? 0) < 0 ? 'var(--critical-bg)' : '#fff' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{item.label}</div>
                <div className="num" style={{ fontSize: '1.25rem', fontWeight: 700, color: item.isStatus ? ((changePct ?? 0) < 0 ? 'var(--critical)' : 'var(--ok)') : 'var(--ink-900)' }}>
                  {item.value}
                </div>
                {item.note && <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', marginTop: 2 }}>{item.note}</div>}
              </div>
            ))}
          </div>

          {/* Estimated revenue loss */}
          {revLoss > 0 && (
            <div style={{ padding: '12px 14px', background: 'var(--critical-bg)', border: '1px solid var(--critical-border)', borderRadius: 4 }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 4 }}>
                Estimated revenue opportunity lost (downtime)
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <RupeeWithHint
                  value={revLoss}
                  formula="lost_metres × revenue_per_metre_by_style"
                  assumptions={data?.revenue_loss?.methodology ?? 'Realized revenue run-rate × breakdown downtime hours. Tagged ESTIMATED.'}
                />
                <span className="badge badge-nodata" style={{ fontSize: '0.6875rem' }}>ESTIMATED</span>
              </div>
              {data?.biggest_revenue_loss_contributor && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink-700)', marginTop: 6 }}>
                  Biggest contributor: <strong>{data.biggest_revenue_loss_contributor.machine_id}</strong>
                  {' '}— {rupee(data.biggest_revenue_loss_contributor.estimated_loss)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 0 }}>

        {/* Machine ranking */}
        <div style={{ borderRight: '1px solid var(--atm-border)', borderBottom: '1px solid var(--atm-border)' }}>
          <div className="card-header" style={{ borderRadius: 0 }}>Revenue by Loom</div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Loom</th>
                  <th>Revenue</th>
                  <th>% Total</th>
                  <th>Style(s)</th>
                </tr>
              </thead>
              <tbody>
                {machines.slice(0, 20).map((m, i) => (
                  <tr key={m.machine_id} className={i === machines.length - 1 ? 'row-warn' : ''}>
                    <td style={{ fontWeight: 600, fontVariantNumeric: 'normal' }}>{m.machine_id}</td>
                    <td>{rupee(m.total_revenue)}</td>
                    <td>{m.percentage_of_total.toFixed(1)}%</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--ink-500)', fontVariantNumeric: 'normal' }}>
                      {m.fabric_styles.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Style ranking */}
        <div style={{ borderBottom: '1px solid var(--atm-border)' }}>
          <div className="card-header" style={{ borderRadius: 0 }}>Revenue by Fabric Style</div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Style</th>
                  <th>Revenue</th>
                  <th>% Total</th>
                  <th>Looms</th>
                </tr>
              </thead>
              <tbody>
                {styles.map((s, i) => (
                  <tr key={s.fabric_style}>
                    <td style={{ fontVariantNumeric: 'normal', maxWidth: 160 }} className="truncate">{s.fabric_style}</td>
                    <td>{rupee(s.total_revenue)}</td>
                    <td>{s.percentage_of_total.toFixed(1)}%</td>
                    <td>{s.machine_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Best / worst style */}
          {(data?.best_style || data?.worst_style) && (
            <div style={{ display: 'flex', borderTop: '1px solid var(--atm-border)' }}>
              {data?.best_style && (
                <div style={{ flex: 1, padding: '8px 12px', background: 'var(--ok-bg)', borderRight: '1px solid var(--atm-border)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--ok)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Best style</div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{data.best_style.fabric_style}</div>
                  <div className="num" style={{ color: 'var(--ok)' }}>{rupee(data.best_style.total_revenue)}</div>
                </div>
              )}
              {data?.worst_style && (
                <div style={{ flex: 1, padding: '8px 12px', background: 'var(--warn-bg)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--warn)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Lowest style</div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{data.worst_style.fabric_style}</div>
                  <div className="num" style={{ color: 'var(--warn)' }}>{rupee(data.worst_style.total_revenue)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Data note */}
      <div style={{ padding: '10px 16px', fontSize: '0.6875rem', color: 'var(--ink-500)', borderTop: '1px solid var(--atm-border)', background: 'var(--ink-100)' }}>
        ⓘ Revenue figures are derived: actual_metres × revenue_per_metre from cost_master. Until cost_master is populated with real ATM rate cards, all ₹ values are tagged DEMO/ESTIMATED.
      </div>
    </div>
  );
}
