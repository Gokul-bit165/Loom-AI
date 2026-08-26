import React from 'react';
import Link from 'next/link';
import { Factory, Wrench, IndianRupee, ArrowRight } from 'lucide-react';
import { ProductionSummary, BreakdownRankingData, RevenueSummaryData } from '@/lib/types';

interface LossVectorsProps {
  prodSummary?: ProductionSummary;
  breakdownData?: BreakdownRankingData;
  revenueData?: RevenueSummaryData;
}

export function LossVectors({ prodSummary, breakdownData, revenueData }: LossVectorsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Production Capacity */}
      <div className="panel-command flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-command-700/60">
            <div className="flex items-center space-x-2">
              <Factory className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-command-100 font-mono">
                01 PRODUCTION CAPACITY (Q1)
              </h3>
            </div>
            <Link
              href="/production"
              className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center space-x-0.5"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-command-400">Actual Output:</span>
              <span className="text-command-100 font-bold">
                {prodSummary ? prodSummary.total_actual.toLocaleString() : 'N/A'} units
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-command-400">Planned Target:</span>
              <span className="text-command-300">
                {prodSummary ? prodSummary.total_target.toLocaleString() : 'N/A'} units
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-command-400">Volume Gap:</span>
              <span
                className={`font-bold ${
                  (prodSummary?.variance_qty || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {prodSummary && prodSummary.variance_qty > 0 ? '+' : ''}
                {prodSummary ? prodSummary.variance_qty.toLocaleString() : '0'} units (
                {prodSummary?.variance_pct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-command-700/40 text-[11px] font-mono text-command-400">
          Cross-Shift Consistency: <strong className="text-command-200">0.34% Variance</strong>
        </div>
      </div>

      {/* 2. Mechanical Downtime */}
      <div className="panel-command flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-command-700/60">
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-command-100 font-mono">
                02 MECHANICAL DOWNTIME (Q5)
              </h3>
            </div>
            <Link
              href="/breakdown"
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center space-x-0.5"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-command-400">Total Lost Time:</span>
              <span className="text-rose-400 font-bold">
                {breakdownData?.total_downtime_minutes || 0} mins (
                {((breakdownData?.total_downtime_minutes || 0) / 60).toFixed(1)} hrs)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-command-400">Stoppage Count:</span>
              <span className="text-command-100 font-bold">
                {breakdownData?.total_events || 0} events logged
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-command-400">Dominant Reason:</span>
              <span className="text-amber-400 font-bold truncate max-w-[170px]">
                {breakdownData?.reason_ranking?.[0]?.reason || 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-command-700/40 text-[11px] font-mono text-command-400">
          Worst Stoppage Unit:{' '}
          <strong className="text-rose-400">
            {breakdownData?.highest_downtime_machine?.machine_id || 'None'} (
            {breakdownData?.highest_downtime_machine?.downtime_minutes || 0}m)
          </strong>
        </div>
      </div>

      {/* 3. Commercial Turnover */}
      <div className="panel-command flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-command-700/60">
            <div className="flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-command-100 font-mono">
                03 COMMERCIAL TURNOVER (Q21)
              </h3>
            </div>
            <Link
              href="/revenue"
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-0.5"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-command-400">Today's Realized:</span>
              <span className="text-command-100 font-bold">
                ₹{revenueData?.summary?.today_revenue.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-command-400">Month-to-Date (MTD):</span>
              <span className="text-emerald-400 font-bold">
                ₹{revenueData?.summary?.mtd_revenue.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-command-400">Top Fabric Style:</span>
              <span className="text-command-200 font-bold truncate max-w-[170px]">
                {revenueData?.best_style?.fabric_style || 'N/A'} (
                {revenueData?.best_style?.percentage_of_total || 0}%)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-command-700/40 text-[11px] font-mono text-command-500 flex justify-between">
          <span>Revenue Loss:</span>
          <span className="text-command-400 italic">Marked Unavailable (Audited)</span>
        </div>
      </div>
    </div>
  );
}
