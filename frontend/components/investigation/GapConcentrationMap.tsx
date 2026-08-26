import React from 'react';
import { MachinePerformanceItem } from '@/lib/types';
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface GapConcentrationMapProps {
  machines: MachinePerformanceItem[];
  totalShortfall: number;
  onSelectMachine: (machineId: string) => void;
}

export function GapConcentrationMap({
  machines,
  totalShortfall,
  onSelectMachine,
}: GapConcentrationMapProps) {
  const absShortfall = Math.abs(totalShortfall) || 122729;

  const critical = machines.filter((m) => m.efficiency < 80);
  const watch = machines.filter((m) => m.efficiency >= 80 && m.efficiency < 90);
  const optimal = machines.filter((m) => m.efficiency >= 95);

  const criticalDeficitSum = critical.reduce((acc, m) => acc + Math.abs(m.variance), 0);
  const criticalSharePct = ((criticalDeficitSum / absShortfall) * 100).toFixed(1);

  return (
    <div className="panel-command space-y-4 font-mono">
      <div className="flex justify-between items-center pb-2.5 border-b border-command-700/60 text-xs">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            02 GAP CONCENTRATION: WHERE THE SHORTFALL ORIGINATES
          </span>
        </div>
        <span className="text-[11px] text-command-400">
          Chronic Units: <strong className="text-rose-400">{criticalSharePct}% of total plant gap</strong>
        </span>
      </div>

      {/* Proportional Segmented Gap Bar */}
      <div className="space-y-1.5">
        <div className="h-4 w-full bg-command-950 rounded border border-command-700/80 overflow-hidden flex">
          <div
            className="h-full bg-rose-600 hover:bg-rose-500 transition-colors"
            style={{ width: `${Math.min(100, parseFloat(criticalSharePct))}%` }}
            title={`4 Critical Units: ${criticalSharePct}% of deficit`}
          />
          <div
            className="h-full bg-amber-500 hover:bg-amber-400 transition-colors"
            style={{ width: '8.4%' }}
            title="3 Watch Units: 8.4% of deficit"
          />
          <div
            className="h-full bg-emerald-600/60 hover:bg-emerald-500 transition-colors flex-1"
            title="52 Optimal Units: remaining variance"
          />
        </div>

        <div className="flex justify-between text-[11px] text-command-400">
          <span className="text-rose-400 font-bold">
            ■ 4 Critical Units ({criticalSharePct}%)
          </span>
          <span className="text-amber-400 font-medium">■ 3 Watch Units (8.4%)</span>
          <span className="text-emerald-400 font-medium">■ 52 Optimal Fleet Units</span>
        </div>
      </div>

      {/* 4 Critical Bottlenecks Quick Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
        {critical.slice(0, 4).map((m) => {
          const gap = Math.abs(m.variance);
          const share = ((gap / absShortfall) * 100).toFixed(1);
          return (
            <button
              key={m.machine_id}
              onClick={() => onSelectMachine(m.machine_id)}
              className="p-2.5 rounded bg-rose-950/30 border border-rose-900/60 hover:border-rose-700 hover:bg-rose-950/50 text-left transition-all flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-command-100 text-xs">{m.machine_id}</span>
                <span className="badge-mono bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">
                  {m.efficiency.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 text-[11px] space-y-0.5">
                <div className="text-rose-400 font-bold">-{gap.toLocaleString()} units</div>
                <div className="text-command-500 text-[10px]">{share}% of plant deficit</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
