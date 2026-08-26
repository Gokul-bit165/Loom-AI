import React from 'react';
import { ReasonRankingItem, MachineRankingItem } from '@/lib/types';
import { Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DowntimeLossMapProps {
  reasons: ReasonRankingItem[];
  machines: MachineRankingItem[];
  totalDowntimeMinutes?: number;
}

export function DowntimeLossMap({
  reasons = [],
  machines = [],
  totalDowntimeMinutes = 2698,
}: DowntimeLossMapProps) {
  const top4 = machines.slice(0, 4);
  const top4Minutes = top4.reduce((acc, m) => acc + m.downtime_minutes, 0);
  const top4Share = totalDowntimeMinutes > 0 ? ((top4Minutes / totalDowntimeMinutes) * 100).toFixed(1) : '46.8';

  return (
    <div className="panel-saas space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-surface-100">
        <div>
          <h3 className="font-semibold text-sm text-surface-900 uppercase tracking-wide">
            Downtime Loss Map & Root Cause Pareto
          </h3>
          <p className="text-xs text-surface-500 font-normal">
            {totalDowntimeMinutes.toLocaleString()} minutes (45.0 hours) total lost operating time
          </p>
        </div>
        <Link
          href="/breakdown"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
        >
          <span>Downtime Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (7 of 12 cols): Stoppage Pareto Distribution */}
        <div className="lg:col-span-7 space-y-2.5">
          <span className="text-[11px] font-semibold text-surface-600 uppercase tracking-wider block">
            DOMINANT FAILURE REASONS (% OF TOTAL LOST TIME)
          </span>

          <div className="space-y-2">
            {reasons.slice(0, 5).map((r, idx) => (
              <div key={r.reason} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-surface-700">
                  <span>
                    {idx + 1}. {r.reason}{' '}
                    <span className="text-surface-500 font-normal">
                      ({r.event_count} {r.event_count === 1 ? 'event' : 'events'})
                    </span>
                  </span>
                  <span className="font-semibold text-surface-900">
                    {r.total_downtime_minutes}m ({r.percentage_of_total_downtime.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? 'bg-rose-500' : idx === 1 ? 'bg-amber-500' : 'bg-brand-500'
                    }`}
                    style={{ width: `${Math.min(100, r.percentage_of_total_downtime)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (5 of 12 cols): Machine Concentration Box */}
        <div className="lg:col-span-5 bg-surface-50 p-4 rounded-xl border border-surface-200/80 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              DOWNTIME CONCENTRATION INSIGHT
            </span>
            <div className="text-2xl font-bold text-surface-900 font-sans">
              {top4Share}% of Lost Time
            </div>
            <p className="text-xs text-surface-600 leading-relaxed font-normal">
              Nearly half of all mechanical lost time is concentrated in just 4 machines.
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-surface-200 text-xs">
            {top4.map((m, i) => (
              <div key={m.machine_id} className="flex justify-between items-center text-[11px]">
                <span className="font-mono font-semibold text-surface-800">{m.machine_id}</span>
                <span className="text-rose-600 font-semibold">{m.downtime_minutes} mins</span>
                <span className="text-surface-500">{m.percentage_of_total_downtime}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
