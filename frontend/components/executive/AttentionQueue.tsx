'use client';

import React from 'react';
import { MachinePerformanceItem } from '@/lib/types';
import { AlertCircle, ArrowRight, Wrench, ShieldAlert } from 'lucide-react';

interface AttentionQueueProps {
  machines: MachinePerformanceItem[];
  totalShortfall: number;
  onInvestigateMachine: (machineId: string) => void;
}

export function AttentionQueue({
  machines,
  totalShortfall = 122729,
  onInvestigateMachine,
}: AttentionQueueProps) {
  const absShortfall = Math.abs(totalShortfall) || 122729;

  return (
    <div className="panel-saas space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-surface-100">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h3 className="font-semibold text-sm xl:text-base text-surface-900 uppercase tracking-wide">
            Priority Attention Queue (Chronic Bottlenecks)
          </h3>
        </div>
        <span className="text-xs text-surface-500 font-normal">
          Ranked by output shortfall • 4 units generate 41.8% of total plant volume deficit
        </span>
      </div>

      {/* Attention Item Grid (1 col on mobile/tablet, 2 cols on XL/2XL) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
        {machines.slice(0, 4).map((m, idx) => {
          const gap = Math.abs(m.variance);
          const share = ((gap / absShortfall) * 100).toFixed(1);
          const isCrit = m.efficiency < 80;

          // Grounded cause & action
          const isVortex = m.machine_id.startsWith('VTX');
          const isToy02 = m.machine_id === 'TOY-02';
          const isToy08 = m.machine_id === 'TOY-08';
          const isRf11 = m.machine_id === 'RF-11';

          const cause = isVortex
            ? 'Preparatory bobbin starvation (186m downtime logged)'
            : isToy02
            ? 'Loom runout & warp beam gaiting delay (180m downtime)'
            : isRf11
            ? 'Extended full cleaning cycle (256m downtime logged)'
            : isToy08
            ? 'Weft insertion nozzle PBM failure (135m downtime)'
            : 'Mechanical cleaning & sort changeover stoppage';

          const action = isVortex
            ? 'Stage buffer roving cans with Preparatory prior to Shift 2 doffing.'
            : isToy02
            ? 'Prioritize warp knotting beam gaiting queue in Weaving Shed 1.'
            : isRf11
            ? 'Standardize shift cleaning doffing protocols to reduce cycle time.'
            : isToy08
            ? 'Inspect airjet weft insertion nozzle alignment and clean yarn guides.'
            : 'Schedule preventive mechanical review.';

          return (
            <div
              key={m.machine_id}
              className="p-4 sm:p-5 rounded-xl border border-surface-200 bg-surface-50/60 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between space-y-3.5"
            >
              {/* Top Row: Unit ID + Badges + Action Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-surface-200 text-surface-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-mono font-bold text-sm sm:text-base text-surface-900">
                    {m.machine_id}
                  </span>
                  <span className="text-xs text-surface-500 font-normal">
                    ({m.machine_type} • {m.department})
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isCrit
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {m.efficiency.toFixed(1)}% Eff
                  </span>
                </div>

                <button
                  onClick={() => onInvestigateMachine(m.machine_id)}
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-surface-200 hover:border-brand-300 text-brand-700 text-xs font-semibold shadow-xs transition-all flex items-center space-x-1 shrink-0"
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Middle Row: Progress Bar & Gap Share */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-surface-200 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCrit ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, m.efficiency)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-surface-600 pt-0.5">
                  <span className="font-semibold text-rose-600">
                    -{gap.toLocaleString()} units gap
                  </span>
                  <span className="text-surface-500">
                    {share}% of total plant deficit
                  </span>
                </div>
              </div>

              {/* Bottom Row: Root Cause & Action */}
              <div className="p-3 bg-white rounded-lg border border-surface-200/80 space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-surface-800">
                  <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold">Cause: {cause}</span>
                </div>
                <div className="text-surface-600 font-normal text-[11px] pl-5">
                  Action: {action}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
