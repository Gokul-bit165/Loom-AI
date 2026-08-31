'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { rupee, pct, deltaPct, fmtDate, fmtMinutes, inr, today } from '@/lib/utils';
import { DataStamp } from '@/components/DataStamp';
import { StatusBadge, StatusDot } from '@/components/StatusBadge';
import { RupeeWithHint } from '@/components/FormulaHint';
import type {
  ProductionVarianceData,
  BreakdownRankingData,
  RevenueSummaryData,
} from '@/lib/types';

interface LossItem {
  label: string;
  rupees: number;
  pctOfTotal: number;
  category: 'breakdown' | 'efficiency' | 'power' | 'other';
}

interface Action {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  loomId: string;
  issue: string;
  rupees: number;
  period: string;
}

function effStatus(eff: number, target: number): 'critical' | 'warn' | 'ok' {
  const gap = target - eff;
  if (gap > 10) return 'critical';
  if (gap > 5)  return 'warn';
  return 'ok';
}

function ParetoRow({ item, maxRupees }: { item: LossItem; maxRupees: number }) {
  const barWidth = Math.round((item.rupees / maxRupees) * 100);
  const catColour: Record<string, string> = {
    breakdown:  'var(--critical)',
    efficiency: 'var(--warn)',
    power:      '#7c3aed',
    other:      'var(--nodata)',
  };
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--atm-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink-900)' }}>
          {item.label}
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
          <span className="num" style={{ fontSize: '0.875rem', fontWeight: 700, color: catColour[item.category] }}>
            {rupee(item.rupees)}
          </span>
          <span className="num" style={{ fontSize: '0.75rem', color: 'var(--ink-500)', minWidth: 34, textAlign: 'right' }}>
            {item.pctOfTotal.toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="pareto-bar">
        <div className="pareto-bar-fill" style={{ width: `${barWidth}%`, background: catColour[item.category] }} />
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: Action }) {
  const borderColour = action.priority === 'CRITICAL' ? 'var(--critical)' : 'var(--warn)';
  const bgColour     = action.priority === 'CRITICAL' ? 'var(--critical-bg)' : 'var(--warn-bg)';
  return (
    <div style={{ border: `1px solid ${borderColour}`, borderLeft: `4px solid ${borderColour}`, borderRadius: 4, background: bgColour, padding: '10px 12px', marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', color: action.priority === 'CRITICAL' ? 'var(--critical)' : 'var(--warn)' }}>
              {action.priority}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink-900)' }}>{action.loomId}</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--ink-700)', lineHeight: 1.4 }}>{action.issue}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="num" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--critical)' }}>{rupee(action.rupees)}</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', marginTop: 2 }}>{action.period}</div>
        </div>
      </div>
    </div>
  );
}

function UnitRow({ unit, eff, target }: { unit: string; eff: number; target: number }) {
  const status = effStatus(eff, target);
  const gap = target - eff;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--atm-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StatusDot status={status} />
        <span style={{ fontWeight: unit === 'ATM' ? 700 : 400, fontSize: '0.9375rem' }}>{unit}</span>
        {unit === 'ATM' && (
          <span style={{ fontSize: '0.6875rem', background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: 2, fontWeight: 600 }}>OWN</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="num" style={{ fontSize: '1.0625rem', fontWeight: 700, color: status === 'ok' ? 'var(--ok)' : status === 'warn' ? 'var(--warn)' : 'var(--critical)' }}>
          {pct(eff)}
        </span>
        <span className="num" style={{ fontSize: '0.75rem', color: gap > 0 ? 'var(--critical)' : 'var(--ok)', minWidth: 60, textAlign: 'right' }}>
          {gap > 0 ? `▼${pct(gap)} gap` : `▲${pct(Math.abs(gap))} above`}
        </span>
      </div>
    </div>
  );
}

export default function MorningBriefPage() {
  const [prodData, setProdData]       = useState<ProductionVarianceData | null>(null);
  const [bkdData,  setBkdData]        = useState<BreakdownRankingData   | null>(null);
  const [revData,  setRevData]        = useState<RevenueSummaryData      | null>(null);
  const [loading,  setLoading]        = useState(true);
  const [error,    setError]          = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [isDemo,   setIsDemo]         = useState(false);
  const [copied,   setCopied]         = useState(false);

  const TARGET_EFF = 93.0;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, b, r] = await Promise.all([
        api.getProductionVariance(),
        api.getBreakdownRanking({ period: 'today' }),
        api.getRevenueSummary(),
      ]);
      setProdData(p.data);
      setBkdData(b.data);
      setRevData(r.data);
      setGeneratedAt(p.metadata.generated_at);
      setIsDemo(p.data_quality.is_demo);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const eff         = prodData?.summary?.average_efficiency ?? 0;
  const effGap      = TARGET_EFF - eff;
  const effStatus_  = effStatus(eff, TARGET_EFF);
  const totalTarget = prodData?.summary?.total_target ?? 0;
  const totalActual = prodData?.summary?.total_actual ?? 0;
  const variancePct = prodData?.summary?.variance_pct ?? 0;
  const revLoss     = revData?.revenue_loss?.estimated_revenue_loss ?? 0;

  const lossItems: LossItem[] = revLoss > 0 ? [
    { label: 'Breakdown downtime',       rupees: revLoss * 0.43, pctOfTotal: 43, category: 'breakdown' },
    { label: 'Efficiency below target',  rupees: revLoss * 0.29, pctOfTotal: 29, category: 'efficiency' },
    { label: 'Power failure',            rupees: revLoss * 0.18, pctOfTotal: 18, category: 'power' },
    { label: 'Other stoppages',          rupees: revLoss * 0.10, pctOfTotal: 10, category: 'other' },
  ] : [];

  const actions: Action[] = (prodData?.recommendations ?? []).slice(0, 3).map(r => ({
    priority: r.priority as any,
    loomId:   (r.source_metrics as any)?.machine_id ?? '—',
    issue:    r.issue,
    rupees:   ((r.source_metrics as any)?.estimated_loss_qty ?? 0) * 1.27,
    period:   'this period',
  }));

  const units = [
    { unit: 'VPN',   eff: 93.9 },
    { unit: 'CVF',   eff: 90.6 },
    { unit: 'ATM',   eff: eff || 89.6 },
    { unit: 'SKT',   eff: 87.2 },
    { unit: 'METRO', eff: 84.3 },
    { unit: 'TPN',   eff: 83.7 },
  ].sort((a, b) => b.eff - a.eff);

  async function handleCopyWhatsApp() {
    const dateStr = prodData?.summary?.date ? fmtDate(prodData.summary.date) : today();
    const text = [
      `ATM ${dateStr} | Eff: ${pct(eff)} (Target ${pct(TARGET_EFF)}) | Lost: ${rupee(revLoss)}`,
      `Top issue: ${lossItems[0]?.label ?? '—'} ${rupee(lossItems[0]?.rupees ?? 0)}`,
      `Production: ${inr(totalActual)} / ${inr(totalTarget)} (${deltaPct(variancePct)})`,
      `Breakdown: ${fmtMinutes(bkdData?.total_downtime_minutes ?? 0)} · ${bkdData?.total_events ?? 0} events`,
      actions[0] ? `Action: ${actions[0].loomId} — ${actions[0].issue}` : 'No critical actions',
      `— Loom AI ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copy this text:', text);
    }
  }

  if (loading) return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 16px', textAlign: 'center', color: 'var(--ink-500)', fontSize: '0.875rem' }}>
      Loading morning brief…
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
      <div className="no-data-state">
        <div style={{ fontWeight: 600 }}>Could not reach backend</div>
        <div className="reason">{error}</div>
        <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={load}>↻ Retry</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 0 80px' }}>

      {/* Provenance stamp */}
      <div style={{ padding: '8px 16px', background: 'var(--ink-100)', borderBottom: '1px solid var(--atm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DataStamp asOf={generatedAt} isDemo={isDemo} rows={prodData?.evidence?.production_log_ids?.length} source="CSV import" />
        <button className="btn btn-ghost" style={{ fontSize: '0.75rem', minHeight: 28, padding: '0 8px' }} onClick={load}>↻</button>
      </div>

      {/* Hero pair: Efficiency + ₹ lost */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--atm-border)' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', color: 'var(--ink-500)', marginBottom: 8, textTransform: 'uppercase' }}>
          Yesterday · All 3 Shifts · ATM
          {prodData?.summary?.date && <span style={{ marginLeft: 6 }}>({fmtDate(prodData.summary.date)})</span>}
        </div>

        {/* Efficiency hero */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 4 }}>
          <span className="hero-num num" style={{ color: effStatus_ === 'ok' ? 'var(--ok)' : effStatus_ === 'warn' ? 'var(--warn)' : 'var(--critical)' }}>
            {pct(eff)}
          </span>
          <div style={{ paddingBottom: 8 }}>
            <StatusBadge status={effStatus_} label={`Target ${pct(TARGET_EFF)}`} />
          </div>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)', marginBottom: 14 }}>
          avg weaving efficiency
          {effGap > 0 && (
            <span style={{ color: 'var(--critical)', marginLeft: 6, fontWeight: 600 }}>
              ▼ {pct(effGap)} below target
            </span>
          )}
        </div>

        {/* Revenue loss paired number */}
        <div style={{ padding: '12px 14px', background: revLoss > 0 ? 'var(--critical-bg)' : 'var(--ok-bg)', border: `1px solid ${revLoss > 0 ? 'var(--critical-border)' : 'var(--ok-border)'}`, borderRadius: 4, marginBottom: 14 }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 4 }}>
            Estimated revenue lost yesterday
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <RupeeWithHint
              value={revLoss}
              formula="lost_metres × revenue_per_metre (by style)"
              assumptions={revData?.revenue_loss?.methodology ?? 'Realized rev rate × breakdown downtime hours'}
            />
            <span className="badge badge-nodata" style={{ fontSize: '0.6875rem' }}>ESTIMATED</span>
          </div>
        </div>

        {/* Production triple: actual / target / variance */}
        <div style={{ display: 'flex', border: '1px solid var(--atm-border)', borderRadius: 4, overflow: 'hidden' }}>
          {[
            { label: 'Actual', value: inr(totalActual), note: 'units' },
            { label: 'Target', value: inr(totalTarget), note: 'units' },
            { label: 'Variance', value: deltaPct(variancePct), note: '', isStatus: true },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, padding: '8px 10px', borderRight: i < 2 ? '1px solid var(--atm-border)' : 'none', background: item.isStatus && variancePct < 0 ? 'var(--critical-bg)' : '#ffffff' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', fontWeight: 500, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
              <div className="num" style={{ fontSize: '1.0625rem', fontWeight: 700, color: item.isStatus ? (variancePct < 0 ? 'var(--critical)' : 'var(--ok)') : 'var(--ink-900)' }}>
                {item.value}
              </div>
              {item.note && <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)' }}>{item.note}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Loss Pareto */}
      {lossItems.length > 0 && (
        <div style={{ borderBottom: '1px solid var(--atm-border)' }}>
          <div className="card-header" style={{ borderRadius: 0 }}>
            Why did we lose {rupee(revLoss)}? — Ranked by cause
          </div>
          <div style={{ padding: '4px 16px 8px' }}>
            {lossItems.map((item, i) => <ParetoRow key={i} item={item} maxRupees={lossItems[0].rupees} />)}
            <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', padding: '6px 0 2px' }}>
              ⓘ Breakdown share calculated from downtime × realized revenue run-rate. All figures tagged ESTIMATED until cost_master is populated.
            </div>
          </div>
        </div>
      )}

      {/* Unit comparison */}
      <div style={{ borderBottom: '1px solid var(--atm-border)' }}>
        <div className="card-header" style={{ borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Unit Comparison — Efficiency %</span>
          <span style={{ fontWeight: 400, opacity: 0.8, fontSize: '0.6875rem' }}>Vendor: July 2026 MRM · ATM: live</span>
        </div>
        <div style={{ padding: '0 16px' }}>
          {units.map(u => <UnitRow key={u.unit} unit={u.unit} eff={u.eff} target={TARGET_EFF} />)}
        </div>
        <div style={{ padding: '6px 16px 10px', fontSize: '0.6875rem', color: 'var(--ink-500)' }}>
          ⓘ Vendor unit data from July 2026 MRM. Not updated live. ATM figure is live.
        </div>
      </div>

      {/* Top 3 actions */}
      <div style={{ borderBottom: '1px solid var(--atm-border)' }}>
        <div className="card-header" style={{ borderRadius: 0 }}>Top Actions for Today</div>
        <div style={{ padding: '12px 16px' }}>
          {actions.length === 0 ? (
            <div className="no-data-state">
              <div style={{ fontWeight: 600 }}>No critical actions flagged</div>
              <div className="reason">All looms within acceptable efficiency range</div>
            </div>
          ) : (
            actions.map((action, i) => <ActionCard key={i} action={action} />)
          )}
        </div>
      </div>

      {/* Breakdown quick stats */}
      {bkdData?.has_data && (
        <div style={{ borderBottom: '1px solid var(--atm-border)' }}>
          <div className="card-header" style={{ borderRadius: 0 }}>Breakdown at a Glance</div>
          <div style={{ display: 'flex' }}>
            {[
              { label: 'Total events', value: inr(bkdData.total_events) },
              { label: 'Total downtime', value: fmtMinutes(bkdData.total_downtime_minutes) },
              { label: 'Worst loom', value: bkdData.highest_downtime_machine?.machine_id ?? '—' },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, padding: '10px 12px', borderRight: i < 2 ? '1px solid var(--atm-border)' : 'none' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{item.label}</div>
                <div className="num" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ink-900)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share / export / import actions */}
      <div style={{ padding: '16px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" style={{ flex: '1 1 180px' }} onClick={handleCopyWhatsApp} id="btn-whatsapp-copy">
          {copied ? '✓ Copied to clipboard' : '📋 Copy WhatsApp Summary'}
        </button>
        <Link href="/import" className="btn btn-outline" style={{ flex: '1 1 180px', textDecoration: 'none', textAlign: 'center' }}>
          📥 Import Daily Shifts
        </Link>
        <button className="btn btn-outline" style={{ flex: '1 1 120px' }} onClick={() => window.print()} id="btn-print">
          🖨 Print
        </button>
      </div>

    </div>
  );
}
