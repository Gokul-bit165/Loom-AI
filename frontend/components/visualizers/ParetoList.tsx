import React from 'react';
import { ReasonRankingItem } from '@/lib/types';

interface ParetoListProps {
  reasons: ReasonRankingItem[];
  totalDowntime: number;
  onSelectReason?: (reason: string) => void;
}

export function ParetoList({ reasons, totalDowntime, onSelectReason }: ParetoListProps) {
  if (!reasons || reasons.length === 0) {
    return (
      <div className="text-xs text-command-500 italic p-4 text-center">
        No downtime reasons recorded for this period.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reasons.map((r, idx) => {
        const pct = r.percentage_of_total_downtime;
        return (
          <div
            key={r.reason}
            onClick={() => onSelectReason && onSelectReason(r.reason)}
            className="group cursor-pointer p-2 rounded-md hover:bg-command-850/80 transition-colors"
          >
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-command-500 font-bold w-4">#{idx + 1}</span>
                <span className="text-command-100 font-semibold group-hover:text-blue-400 transition-colors">
                  {r.reason}
                </span>
                <span className="text-command-500 text-[10px]">
                  ({r.event_count} {r.event_count === 1 ? 'event' : 'events'})
                </span>
              </div>
              <div className="text-right space-x-2">
                <span className="text-rose-400 font-bold">{r.total_downtime_minutes} min</span>
                <span className="text-command-400 font-medium">({pct.toFixed(1)}%)</span>
              </div>
            </div>

            <div className="h-2 w-full bg-command-800 rounded-xs overflow-hidden border border-command-700/40">
              <div
                className="h-full bg-amber-500/80 group-hover:bg-amber-400 transition-all rounded-xs"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
