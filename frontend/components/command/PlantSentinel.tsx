import React from 'react';
import { ProductionSummary } from '@/lib/types';
import { AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface PlantSentinelProps {
  summary: ProductionSummary;
  totalDowntimeMinutes?: number;
  totalBreakdownEvents?: number;
  criticalMachineCount?: number;
}

export function PlantSentinel({
  summary,
  totalDowntimeMinutes = 0,
  totalBreakdownEvents = 0,
  criticalMachineCount = 0,
}: PlantSentinelProps) {
  const efficiency = summary.average_efficiency;
  const isCritical = efficiency < 80 || criticalMachineCount >= 3;
  const isWatch = (efficiency >= 80 && efficiency < 90) || criticalMachineCount > 0;
  const isOptimal = efficiency >= 95;

  const statusLabel = isCritical
    ? 'CRITICAL EXCEPTION STATE'
    : isWatch
    ? 'WATCH STATE — DISPATCH DEVIATION'
    : 'ON TRACK — OPTIMAL DISPATCH';

  const statusColor = isCritical
    ? 'border-rose-700/80 bg-rose-950/40 text-rose-300'
    : isWatch
    ? 'border-amber-700/80 bg-amber-950/40 text-amber-300'
    : 'border-emerald-700/80 bg-emerald-950/40 text-emerald-300';

  const badgeColor = isCritical
    ? 'bg-rose-900/60 border-rose-700 text-rose-200'
    : isWatch
    ? 'bg-amber-900/60 border-amber-700 text-amber-200'
    : 'bg-emerald-900/60 border-emerald-700 text-emerald-200';

  return (
    <div className={`panel-command border ${statusColor} relative overflow-hidden`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Macro Status & Production Gap */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className={`badge-mono border uppercase ${badgeColor} flex items-center space-x-1.5`}>
              {isCritical ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : isWatch ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{statusLabel}</span>
            </span>
            <span className="text-xs font-mono text-command-400">
              Plant Shift Date: <strong className="text-command-100">{summary.date}</strong>
            </span>
          </div>

          <div className="flex items-baseline space-x-3 font-mono">
            <span className="text-3xl lg:text-4xl font-extrabold text-command-100 tracking-tight">
              {efficiency.toFixed(2)}%
            </span>
            <span className="text-sm font-semibold text-command-400">Average Plant Efficiency</span>
            <span
              className={`text-sm font-bold ${
                summary.variance_qty >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              ({summary.variance_qty > 0 ? '+' : ''}
              {summary.variance_pct.toFixed(2)}% vs Target)
            </span>
          </div>

          <p className="text-xs text-command-300 leading-relaxed max-w-2xl font-mono">
            Plant produced <strong className="text-command-100">{summary.total_actual.toLocaleString()}</strong> units against a target of <strong className="text-command-100">{summary.total_target.toLocaleString()}</strong> units. Net volume shortfall:{' '}
            <strong className="text-rose-400">{summary.variance_qty.toLocaleString()} units</strong>.
          </p>
        </div>

        {/* Right: Key Secondary Loss Telemetry */}
        <div className="grid grid-cols-2 gap-3 lg:border-l lg:border-command-700/60 lg:pl-6 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-command-400 block text-[11px]">Total Lost Time:</span>
            <span className="text-base font-bold text-command-100">
              {totalDowntimeMinutes} min
            </span>
            <span className="text-command-500 block text-[10px]">
              ({(totalDowntimeMinutes / 60).toFixed(1)} machine hrs • {totalBreakdownEvents} events)
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-command-400 block text-[11px]">Day-over-Day Drift:</span>
            <span
              className={`text-base font-bold ${
                (summary.change_vs_previous_day_pct || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {summary.change_vs_previous_day_pct !== null
                ? `${summary.change_vs_previous_day_pct > 0 ? '+' : ''}${
                    summary.change_vs_previous_day_pct
                  }%`
                : 'N/A'}
            </span>
            <span className="text-command-500 block text-[10px]">
              Prev: {summary.previous_day_actual.toLocaleString()} units
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
