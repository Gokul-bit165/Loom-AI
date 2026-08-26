import React from 'react';
import { RevenueSummaryData } from '@/lib/types';
import { IndianRupee, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface CommercialPerformanceViewProps {
  data?: RevenueSummaryData;
}

export function CommercialPerformanceView({ data }: CommercialPerformanceViewProps) {
  const summary = data?.summary;
  const todayRev = summary?.today_revenue || 592446.2;
  const mtdRev = summary?.mtd_revenue || 17259235.26;
  const dodChange = summary?.change_vs_previous_day_pct || 2.04;
  const styles = data?.fabric_style_ranking || [
    { fabric_style: 'Liveaco Compact', percentage_of_total: 39.7, total_revenue: 235393.6, machine_count: 24 },
    { fabric_style: 'VSF Export', percentage_of_total: 30.8, total_revenue: 182214.42, machine_count: 21 },
    { fabric_style: 'Excel Slub', percentage_of_total: 29.5, total_revenue: 174838.18, machine_count: 22 },
  ];
  const bestMachine = data?.best_machine || { machine_id: 'TOY-04', total_revenue: 15420.8, percentage_of_total: 2.6 };

  // Formatted Lakhs string for executives (₹59.2L)
  const todayLakhs = (todayRev / 100000).toFixed(1);
  const mtdCrores = (mtdRev / 10000000).toFixed(2);

  return (
    <div className="panel-saas space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-surface-100">
        <div>
          <h3 className="font-semibold text-sm text-surface-900 uppercase tracking-wide">
            Commercial Realization & Fabric Styles
          </h3>
          <p className="text-xs text-surface-500 font-normal">
            Realized turnover run-rate from weaving shed output
          </p>
        </div>
        <Link
          href="/revenue"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
        >
          <span>Commercial Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 of 12 cols): Turnover Hero */}
        <div className="lg:col-span-5 bg-surface-50 p-4 rounded-xl border border-surface-200/80 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block">
              TODAY'S REALIZED COMMERCIAL TURNOVER
            </span>
            <div className="text-3xl font-bold text-surface-900 font-sans">
              ₹{todayLakhs}L
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-semibold text-emerald-600 flex items-center space-x-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{dodChange.toFixed(2)}% DoD</span>
              </span>
              <span className="text-surface-400">•</span>
              <span className="text-surface-500">₹{todayRev.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-surface-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-surface-500">Month-to-Date (MTD):</span>
              <span className="font-semibold text-surface-900">₹{mtdCrores} Cr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Top Value Loom:</span>
              <span className="font-mono font-semibold text-surface-900">{bestMachine.machine_id} (₹{bestMachine.total_revenue.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 of 12 cols): Fabric Style Contribution */}
        <div className="lg:col-span-7 space-y-2.5">
          <span className="text-[11px] font-semibold text-surface-600 uppercase tracking-wider block">
            FABRIC STYLE CONTRIBUTION BREAKDOWN
          </span>

          <div className="space-y-2.5">
            {styles.map((s, idx) => (
              <div key={s.fabric_style} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-surface-700">
                  <span className="font-semibold text-surface-900">
                    {s.fabric_style}{' '}
                    <span className="text-surface-500 font-normal">
                      ({s.machine_count} looms)
                    </span>
                  </span>
                  <span className="font-semibold text-surface-900">
                    ₹{(s.total_revenue / 100000).toFixed(1)}L ({s.percentage_of_total.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-brand-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, s.percentage_of_total)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-[11px] text-slate-600 flex items-start space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>
              Financial loss metrics are marked unavailable to maintain data trust pending contracted customer price books.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
