import React from 'react';
import { RevenueSummaryData } from '@/lib/types';
import { IndianRupee, TrendingUp, TrendingDown, Calendar, Layers } from 'lucide-react';

interface RevenueTrajectorySentinelProps {
  data: RevenueSummaryData;
}

export function RevenueTrajectorySentinel({ data }: RevenueTrajectorySentinelProps) {
  const summary = data.summary;
  const todayRev = summary.today_revenue;
  const mtdRev = summary.mtd_revenue;
  const dodChangePct = summary.change_vs_previous_day_pct;
  const prevRev = summary.previous_day_revenue;
  const bestMachine = data.best_machine;
  const bestStyle = data.best_style;

  return (
    <div className="panel-command space-y-4 font-mono">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-command-700/60 text-xs">
        <div className="flex items-center space-x-2">
          <IndianRupee className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            01 COMMERCIAL REVENUE & REALIZATION TRAJECTORY
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-command-400">
          <span className="flex items-center space-x-1">
            <span>Day-over-Day Trajectory:</span>
            {dodChangePct !== null && (
              <span
                className={`font-bold flex items-center space-x-0.5 ${
                  dodChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {dodChangePct >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {dodChangePct > 0 ? '+' : ''}
                  {dodChangePct.toFixed(2)}% vs Prev Day (₹{prevRev.toLocaleString()})
                </span>
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Hero Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Today's Realized Revenue:</span>
          <span className="text-xl lg:text-2xl font-extrabold text-command-100">
            ₹{todayRev.toLocaleString()}
          </span>
          <span className="text-command-500 block text-[10px] mt-0.5 font-sans">
            Weaving Shed Commercial Output
          </span>
        </div>

        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Month-to-Date (MTD):</span>
          <span className="text-xl lg:text-2xl font-extrabold text-emerald-400">
            ₹{mtdRev.toLocaleString()}
          </span>
          <span className="text-command-500 block text-[10px] mt-0.5 font-sans">
            Accumulated from {summary.mtd_start_date}
          </span>
        </div>

        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Top Commercial Style:</span>
          <span className="text-lg font-extrabold text-emerald-400 truncate block">
            {bestStyle ? bestStyle.fabric_style : 'N/A'}
          </span>
          <span className="text-command-500 block text-[10px] mt-0.5 font-sans">
            {bestStyle ? `₹${bestStyle.total_revenue.toLocaleString()} (${bestStyle.percentage_of_total}%)` : 'None'}
          </span>
        </div>

        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Top Grossing Loom:</span>
          <span className="text-lg font-extrabold text-command-100 truncate block">
            {bestMachine ? bestMachine.machine_id : 'None'}
          </span>
          <span className="text-command-500 block text-[10px] mt-0.5 font-sans">
            {bestMachine ? `₹${bestMachine.total_revenue.toLocaleString()} (${bestMachine.percentage_of_total}%)` : 'None'}
          </span>
        </div>
      </div>
    </div>
  );
}
