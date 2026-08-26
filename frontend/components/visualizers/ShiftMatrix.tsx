import React from 'react';
import { ShiftPerformanceItem } from '@/lib/types';
import { VarianceBar } from './VarianceBar';

interface ShiftMatrixProps {
  shifts: ShiftPerformanceItem[];
  onInspectShift?: (shiftNum: number, ids: number[]) => void;
}

export function ShiftMatrix({ shifts, onInspectShift }: ShiftMatrixProps) {
  if (!shifts || shifts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {shifts.map((s) => {
        const isCritical = s.efficiency < 80;
        const isWatch = s.efficiency >= 80 && s.efficiency < 90;
        const isOptimal = s.efficiency >= 95;

        const badgeClass = isCritical
          ? 'bg-rose-950 text-rose-300 border-rose-800'
          : isWatch
          ? 'bg-amber-950 text-amber-300 border-amber-800'
          : isOptimal
          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
          : 'bg-command-800 text-blue-300 border-command-700';

        return (
          <div
            key={s.shift}
            className="panel-elevated flex flex-col justify-between border-command-700/50 hover:border-command-600 transition-colors"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-bold text-sm text-command-100 uppercase tracking-wider">
                    Shift {s.shift}
                  </span>
                </div>
                <span className={`badge-mono border ${badgeClass}`}>
                  {s.efficiency.toFixed(1)}% Eff
                </span>
              </div>

              <div className="my-3">
                <VarianceBar
                  actual={s.actual}
                  target={s.target}
                  efficiency={s.efficiency}
                  showLabels={true}
                />
              </div>

              <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-command-700/40">
                <div className="flex justify-between">
                  <span className="text-command-400">Shift Target:</span>
                  <span className="text-command-300">{s.target.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-command-400">Shift Actual:</span>
                  <span className="text-command-100 font-bold">{s.actual.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-command-400">Shift Variance:</span>
                  <span
                    className={`font-bold ${
                      s.variance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {s.variance > 0 ? '+' : ''}
                    {s.variance.toLocaleString()} units
                  </span>
                </div>
              </div>
            </div>

            {onInspectShift && (
              <div className="mt-3 pt-2 border-t border-command-700/40 flex justify-end">
                <button
                  onClick={() => onInspectShift(s.shift, s.evidence.production_log_ids)}
                  className="text-[11px] font-mono text-blue-400 hover:text-blue-300 underline"
                >
                  Audit {s.evidence.production_log_ids.length} rows →
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
