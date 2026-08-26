'use client';

import React from 'react';
import { ReasonRankingItem } from '@/lib/types';
import { Layers, CheckCircle2 } from 'lucide-react';

interface DowntimeReasonParetoProps {
  reasons: ReasonRankingItem[];
  totalDowntime: number;
  selectedReason: string | null;
  onSelectReason: (reason: string | null) => void;
}

export function DowntimeReasonPareto({
  reasons,
  totalDowntime,
  selectedReason,
  onSelectReason,
}: DowntimeReasonParetoProps) {
  if (!reasons || reasons.length === 0) {
    return (
      <div className="panel-command text-xs text-command-500 font-mono text-center p-6 italic">
        No breakdown reasons logged for this date.
      </div>
    );
  }

  return (
    <div className="panel-command space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-command-700/60 text-xs">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            02 DOMINANT CAUSES: STOPPAGE REASON PARETO DISTRIBUTION ({reasons.length} REASONS)
          </span>
        </div>
        {selectedReason && (
          <button
            onClick={() => onSelectReason(null)}
            className="text-blue-400 hover:text-blue-300 text-[11px] underline"
          >
            Clear Filter: {selectedReason} ✕
          </button>
        )}
      </div>

      {/* Ranked Reason Bars */}
      <div className="space-y-2.5">
        {reasons.map((r, idx) => {
          const isSelected = selectedReason === r.reason;
          const pct = r.percentage_of_total_downtime;

          return (
            <div
              key={r.reason}
              onClick={() => onSelectReason(isSelected ? null : r.reason)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-command-800 border-amber-500/80 shadow-md'
                  : 'bg-command-850/60 border-command-700/50 hover:bg-command-850 hover:border-command-600'
              }`}
            >
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-command-500 font-bold text-xs">#{idx + 1}</span>
                  <span
                    className={`font-bold ${
                      isSelected ? 'text-amber-300' : 'text-command-100'
                    }`}
                  >
                    {r.reason}
                  </span>
                  <span className="text-command-500 text-[10px]">
                    ({r.event_count} {r.event_count === 1 ? 'event' : 'events'} • Avg {r.average_event_duration}m)
                  </span>
                </div>
                <div className="space-x-2">
                  <span className="text-rose-400 font-bold">
                    {r.total_downtime_minutes.toLocaleString()} mins
                  </span>
                  <span className="text-command-400 font-medium">({pct.toFixed(1)}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-command-950 rounded-xs overflow-hidden border border-command-700/60">
                <div
                  className={`h-full rounded-xs transition-all duration-300 ${
                    idx === 0
                      ? 'bg-rose-500'
                      : idx === 1
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
