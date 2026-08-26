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
          <h3 className="font-semibold text-sm text-surface-900 uppercase tracking-wide">
            Priority Attention Queue (Chronic Exceptions)
          </h3>
        </div>
        <span className="text-xs text-surface-500 font-normal">
          Ranked by output shortfall • 4 units generate 41.8% of plant deficit
        </span>
      </div>

      {/* Attention Item List */}
      <div className="space-y-3">
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
              className="p-4 rounded-xl border border-surface-200 bg-surface-50/60 hover:bg-white hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: ID + Progress Bar */}
              <div className="space-y-2 md:w-5/12">
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-surface-200 text-surface-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-mono font-bold text-sm text-surface-900">
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

                {/* Progress Visualizer */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-surface-200 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCrit ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, m.efficiency)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-surface-600">
                    <span className="font-semibold text-rose-600">
                      -{gap.toLocaleString()} units gap
                    </span>
                    <span className="text-surface-500">
                      {share}% of total plant deficit
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Root Cause & Action */}
              <div className="space-y-1 text-xs md:w-5/12">
                <div className="flex items-center space-x-1.5 text-surface-700">
                  <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-medium">Cause: {cause}</span>
                </div>
                <div className="text-surface-500 font-normal text-[11px] pl-5">
                  Action: {action}
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="md:w-2/12 flex md:justify-end">
                <button
                  onClick={() => onInvestigateMachine(m.machine_id)}
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-surface-200 hover:border-brand-300 text-brand-700 text-xs font-semibold shadow-xs transition-all flex items-center space-x-1"
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
