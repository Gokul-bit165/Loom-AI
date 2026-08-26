import React from 'react';

interface VarianceBarProps {
  actual: number;
  target: number;
  efficiency: number;
  className?: string;
  showLabels?: boolean;
}

export function VarianceBar({
  actual,
  target,
  efficiency,
  className = '',
  showLabels = true,
}: VarianceBarProps) {
  // Cap visual bar at 100%
  const widthPct = Math.min(100, Math.max(0, efficiency));
  const isCritical = efficiency < 80;
  const isWatch = efficiency >= 80 && efficiency < 90;
  const isOptimal = efficiency >= 95;

  const barColor = isCritical
    ? 'bg-rose-500'
    : isWatch
    ? 'bg-amber-500'
    : isOptimal
    ? 'bg-emerald-500'
    : 'bg-blue-500';

  const trackBg = isCritical
    ? 'bg-rose-950/60 border-rose-900/40'
    : isWatch
    ? 'bg-amber-950/60 border-amber-900/40'
    : 'bg-command-800 border-command-700/50';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabels && (
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-command-400">
            {actual.toLocaleString()} / {target.toLocaleString()} units
          </span>
          <span
            className={`font-bold ${
              isCritical
                ? 'text-rose-400'
                : isWatch
                ? 'text-amber-400'
                : isOptimal
                ? 'text-emerald-400'
                : 'text-blue-400'
            }`}
          >
            {efficiency.toFixed(2)}%
          </span>
        </div>
      )}

      <div className={`h-2.5 w-full rounded-sm border overflow-hidden relative ${trackBg}`}>
        <div
          className={`h-full transition-all duration-300 rounded-xs ${barColor}`}
          style={{ width: `${widthPct}%` }}
        />
        {/* Target 100% Line Marker */}
        <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-slate-500/70" />
      </div>
    </div>
  );
}
