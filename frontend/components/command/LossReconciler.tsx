import React from 'react';
import { ProductionSummary, BreakdownRankingData, RevenueSummaryData } from '@/lib/types';
import { Target, Wrench, IndianRupee, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface LossReconcilerProps {
  prodSummary?: ProductionSummary;
  breakdownData?: BreakdownRankingData;
  revenueData?: RevenueSummaryData;
}

export function LossReconciler({
  prodSummary,
  breakdownData,
  revenueData,
}: LossReconcilerProps) {
  const actual = prodSummary?.total_actual || 1765471;
  const target = prodSummary?.total_target || 1888200;
  const gap = Math.abs(prodSummary?.variance_qty || 122729);
  const gapPct = prodSummary?.variance_pct || -6.5;

  const downtimeMins = breakdownData?.total_downtime_minutes || 2698;
  const downtimeHours = (downtimeMins / 60).toFixed(1);
  const eventCount = breakdownData?.total_events || 42;
  const topReason = breakdownData?.reason_ranking?.[0]?.reason || 'Full cleaning work';
  const topReasonPct = breakdownData?.reason_ranking?.[0]?.percentage_of_total_downtime || 39.4;

  const realizedRev = revenueData?.summary?.today_revenue || 592446.2;
  const mtdRev = revenueData?.summary?.mtd_revenue || 17259235.26;
  const topStyle = revenueData?.best_style?.fabric_style || 'Liveaco Compact';
  const topStyleShare = revenueData?.best_style?.percentage_of_total || 39.7;

  return (
    <div className="bg-command-900 border border-command-700/80 rounded-lg overflow-hidden font-mono shadow-xl">
      {/* Header Strip */}
      <div className="p-3 bg-command-950 border-b border-command-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span className="font-extrabold uppercase tracking-wider text-command-100">
            CROSS-PILLAR LOSS RECONCILIATION & TELEMETRY
          </span>
        </div>
        <span className="text-[11px] text-command-400">
          Reconciles Physical Capacity Gap $\rightarrow$ Mechanical Lost Time $\rightarrow$ Commercial Turnover
        </span>
      </div>

      {/* 3-Column Hairline Industrial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-command-700/60 text-xs">
        {/* Pillar 1: Production Capacity Shortfall */}
        <div className="p-4 space-y-3 bg-command-900/60">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-[11px] uppercase">
              <Target className="w-3.5 h-3.5" />
              <span>01 CAPACITY GAP</span>
            </div>
            <Link
              href="/dispatch"
              className="text-[10px] text-command-400 hover:text-blue-400 underline font-bold"
            >
              Dispatch Workspace →
            </Link>
          </div>

          <div>
            <div className="text-xl font-extrabold text-rose-400">
              -{gap.toLocaleString()} units
            </div>
            <span className="text-[10px] text-command-500 block font-sans">
              Actual: {actual.toLocaleString()} / Target: {target.toLocaleString()} ({gapPct.toFixed(2)}%)
            </span>
          </div>

          <div className="p-2.5 rounded bg-command-950 border border-command-700/60 text-[11px] text-command-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-command-500">Cross-Shift Var:</span>
              <span className="font-bold text-emerald-400">0.34% (Stable)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-command-500">Concentration:</span>
              <span className="font-bold text-rose-400">4 Units (41.8% of Gap)</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Mechanical Downtime Impact */}
        <div className="p-4 space-y-3 bg-command-900/60">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-[11px] uppercase">
              <Wrench className="w-3.5 h-3.5" />
              <span>02 MECHANICAL LOSS</span>
            </div>
            <Link
              href="/stoppages"
              className="text-[10px] text-command-400 hover:text-amber-400 underline font-bold"
            >
              Stoppages Workspace →
            </Link>
          </div>

          <div>
            <div className="text-xl font-extrabold text-amber-400">
              {downtimeMins.toLocaleString()} mins lost
            </div>
            <span className="text-[10px] text-command-500 block font-sans">
              {downtimeHours} machine hours across {eventCount} recorded stoppages
            </span>
          </div>

          <div className="p-2.5 rounded bg-command-950 border border-command-700/60 text-[11px] text-command-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-command-500">Dominant Cause:</span>
              <span className="font-bold text-command-200 truncate max-w-[130px]" title={topReason}>
                {topReason} ({topReasonPct}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-command-500">Worst Loom:</span>
              <span className="font-bold text-rose-400">SUL-04 (416m lost)</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Commercial Style Realization */}
        <div className="p-4 space-y-3 bg-command-900/60">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-[11px] uppercase">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>03 COMMERCIAL YIELD</span>
            </div>
            <Link
              href="/commercial"
              className="text-[10px] text-command-400 hover:text-emerald-400 underline font-bold"
            >
              Commercial Workspace →
            </Link>
          </div>

          <div>
            <div className="text-xl font-extrabold text-command-100">
              ₹{realizedRev.toLocaleString()}
            </div>
            <span className="text-[10px] text-command-500 block font-sans">
              MTD Realized: ₹{mtdRev.toLocaleString()} (Active Sorts: 3)
            </span>
          </div>

          <div className="p-2.5 rounded bg-command-950 border border-command-700/60 text-[11px] text-command-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-command-500">Top Sort Share:</span>
              <span className="font-bold text-emerald-400 truncate max-w-[130px]">
                {topStyle} ({topStyleShare}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-command-500">Financial Loss:</span>
              <span className="font-bold text-command-400">Marked Unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
