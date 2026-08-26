import React from 'react';
import { MachineRankingItem } from '@/lib/types';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface DowntimeConcentrationMapProps {
  machines: MachineRankingItem[];
  totalDowntime: number;
  onSelectMachine: (machineId: string) => void;
}

export function DowntimeConcentrationMap({
  machines,
  totalDowntime,
  onSelectMachine,
}: DowntimeConcentrationMapProps) {
  const top4 = machines.slice(0, 4);
  const top4Downtime = top4.reduce((acc, m) => acc + m.downtime_minutes, 0);
  const top4SharePct = totalDowntime > 0 ? ((top4Downtime / totalDowntime) * 100).toFixed(1) : '0';

  return (
    <div className="panel-command space-y-4 font-mono">
      <div className="flex justify-between items-center pb-2.5 border-b border-command-700/60 text-xs">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            03 DOWNTIME CONCENTRATION: CHRONIC VS SPREAD BOTTLENECKS
          </span>
        </div>
        <span className="text-[11px] text-command-400">
          Top 4 Units: <strong className="text-rose-400">{top4SharePct}% of total lost time</strong>
        </span>
      </div>

      {/* Visual Proportional Segmented Bar */}
      <div className="space-y-1.5">
        <div className="h-4 w-full bg-command-950 rounded border border-command-700/80 overflow-hidden flex">
          <div
            className="h-full bg-rose-600 hover:bg-rose-500 transition-colors"
            style={{ width: `${Math.min(100, parseFloat(top4SharePct))}%` }}
            title={`Top 4 Chronic Units: ${top4SharePct}% of lost time`}
          />
          <div
            className="h-full bg-amber-600/70 hover:bg-amber-500 transition-colors flex-1"
            title="Remaining affected units"
          />
        </div>

        <div className="flex justify-between text-[11px] text-command-400">
          <span className="text-rose-400 font-bold">
            ■ Top 4 Chronic Units ({top4SharePct}% of lost time)
          </span>
          <span className="text-amber-400 font-medium">■ Remaining {machines.length - 4} Affected Fleet Units</span>
        </div>
      </div>

      {/* Top 4 Quick Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
        {top4.map((m, idx) => (
          <button
            key={m.machine_id}
            onClick={() => onSelectMachine(m.machine_id)}
            className="p-2.5 rounded bg-rose-950/30 border border-rose-900/60 hover:border-rose-700 hover:bg-rose-950/50 text-left transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-command-100 text-xs">{m.machine_id}</span>
              <span className="badge-mono bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">
                {m.percentage_of_total_downtime}% Loss
              </span>
            </div>
            <div className="mt-2 text-[11px] space-y-0.5">
              <div className="text-rose-400 font-bold">{m.downtime_minutes} mins lost</div>
              <div className="text-command-500 text-[10px]">
                {m.event_count} events (Avg: {m.average_event_duration}m)
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
