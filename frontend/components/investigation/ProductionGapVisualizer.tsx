import React from 'react';
import { ProductionSummary } from '@/lib/types';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

interface ProductionGapVisualizerProps {
  summary: ProductionSummary;
}

export function ProductionGapVisualizer({ summary }: ProductionGapVisualizerProps) {
  const actual = summary.total_actual;
  const target = summary.total_target;
  const varianceQty = summary.variance_qty;
  const variancePct = summary.variance_pct;
  const efficiency = summary.average_efficiency;
  const dodChangePct = summary.change_vs_previous_day_pct;
  const prevActual = summary.previous_day_actual;

  const isCritical = efficiency < 80;
  const isWatch = efficiency >= 80 && efficiency < 90;
  const widthPct = Math.min(100, Math.max(0, efficiency));

  return (
    <div className="panel-command space-y-4 font-mono">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-command-700/60 text-xs">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            01 MACRO PRODUCTION GAP & VOLUME DISPATCH
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
                  {dodChangePct.toFixed(2)}% vs Prev Day ({prevActual.toLocaleString()}u)
                </span>
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Giant Target vs Actual Visualizer */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline text-xs">
          <div className="space-x-2">
            <span className="text-command-400">ACTUAL OUTPUT:</span>
            <span className="text-2xl lg:text-3xl font-extrabold text-command-100">
              {actual.toLocaleString()} units
            </span>
          </div>
          <div className="space-x-2 text-right">
            <span className="text-command-400">PLANNED TARGET:</span>
            <span className="text-xl lg:text-2xl font-bold text-command-300">
              {target.toLocaleString()} units
            </span>
          </div>
        </div>

        {/* High-Contrast Target Marker Track */}
        <div className="h-6 w-full bg-command-950 rounded border border-command-700/80 p-1 relative overflow-hidden flex items-center">
          <div
            className={`h-full rounded-xs transition-all duration-300 ${
              isCritical
                ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : isWatch
                ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
            }`}
            style={{ width: `${widthPct}%` }}
          />
          {/* Target 100% Marker */}
          <div className="absolute top-0 bottom-0 right-0 w-1 bg-white shadow-xs" title="100% Target" />
        </div>

        <div className="flex justify-between items-center text-xs text-command-400 pt-1">
          <span>0 units (0%)</span>
          <span className="font-bold text-command-100">
            Plant Efficiency: <strong className="text-blue-400">{efficiency.toFixed(2)}%</strong>
          </span>
          <span>Target (100%)</span>
        </div>
      </div>

      {/* Net Deficit Callout Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-command-700/50 text-xs">
        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Net Volume Shortfall:</span>
          <span
            className={`text-lg font-extrabold ${
              varianceQty >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {varianceQty > 0 ? '+' : ''}
            {varianceQty.toLocaleString()} units ({variancePct.toFixed(2)}%)
          </span>
        </div>

        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Active Fleet:</span>
          <span className="text-lg font-extrabold text-command-100">
            59 Units Tracked
          </span>
          <span className="text-[10px] text-command-500 block">Weaving & Spinning Sheds</span>
        </div>

        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Cross-Shift Balance:</span>
          <span className="text-lg font-extrabold text-emerald-400">
            0.34% Deviation
          </span>
          <span className="text-[10px] text-command-500 block">Proves machine-bound deficit</span>
        </div>
      </div>
    </div>
  );
}
