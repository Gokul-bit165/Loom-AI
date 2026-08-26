import React from 'react';
import { ShiftPerformanceItem } from '@/lib/types';
import { Layers, CheckCircle2, TrendingDown } from 'lucide-react';

interface ShiftPerformanceComparisonProps {
  shifts?: ShiftPerformanceItem[];
}

export function ShiftPerformanceComparison({
  shifts = [],
}: ShiftPerformanceComparisonProps) {
  const s1 = shifts.find((s) => s.shift === 1) || { actual: 589718, target: 629400, efficiency: 93.7 };
  const s2 = shifts.find((s) => s.shift === 2) || { actual: 587638, target: 629400, efficiency: 93.36 };
  const s3 = shifts.find((s) => s.shift === 3) || { actual: 588115, target: 629400, efficiency: 93.44 };

  const shiftList = [
    { name: 'Shift 1 (Morning)', data: s1, tag: 'Leader' },
    { name: 'Shift 2 (Evening)', data: s2, tag: 'Moderate' },
    { name: 'Shift 3 (Night)', data: s3, tag: 'Weakest' },
  ];

  return (
    <div className="panel-saas space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-surface-100">
        <div>
          <h3 className="font-semibold text-sm text-surface-900 uppercase tracking-wide">
            Shift Performance & Balance Comparison
          </h3>
          <p className="text-xs text-surface-500 font-normal">
            Cross-shift variance is 0.34% — confirms machine-bound, not operator-bound loss
          </p>
        </div>
        <span className="badge-status-optimal">
          Cross-Shift Balance: High (0.34% Var)
        </span>
      </div>

      {/* 3 Shifts Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {shiftList.map((s, idx) => {
          const eff = s.data.efficiency;
          const actual = s.data.actual;
          const target = s.data.target;
          const gap = target - actual;

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-surface-200 bg-surface-50/70 space-y-2.5"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-xs text-surface-900">{s.name}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    idx === 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-surface-200 text-surface-700'
                  }`}
                >
                  {s.tag}
                </span>
              </div>

              {/* Metric Hero */}
              <div>
                <div className="text-2xl font-bold text-surface-900 font-sans">
                  {eff.toFixed(1)}%
                </div>
                <span className="text-xs text-surface-500">
                  {actual.toLocaleString()} / {target.toLocaleString()} units
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-surface-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, eff)}%` }}
                />
              </div>

              <div className="pt-1 text-[11px] text-rose-600 font-medium">
                Shortfall: -{gap.toLocaleString()} units
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
