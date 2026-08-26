'use client';

import React, { useState } from 'react';
import { MachinePerformanceItem } from '@/lib/types';
import { Grid, HelpCircle } from 'lucide-react';

interface MachinePerformanceMatrixProps {
  machines: MachinePerformanceItem[];
  onSelectMachine: (machineId: string) => void;
}

export function MachinePerformanceMatrix({
  machines = [],
  onSelectMachine,
}: MachinePerformanceMatrixProps) {
  const [hoveredMachine, setHoveredMachine] = useState<MachinePerformanceItem | null>(null);

  const critical = machines.filter((m) => m.efficiency < 80);
  const watch = machines.filter((m) => m.efficiency >= 80 && m.efficiency < 90);
  const optimal = machines.filter((m) => m.efficiency >= 95);

  return (
    <div className="panel-saas space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-surface-100">
        <div>
          <h3 className="font-semibold text-sm text-surface-900 uppercase tracking-wide">
            Fleet Performance Matrix ({machines.length} Active Production Units)
          </h3>
          <p className="text-xs text-surface-500 font-normal">
            Click any machine cell to inspect its unified operational intelligence dossier
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="text-surface-600">Optimal ({optimal.length})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span className="text-surface-600">Watch ({watch.length})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
            <span className="text-surface-600">Critical ({critical.length})</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative">
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-1.5 p-3 bg-surface-50 rounded-xl border border-surface-200/80">
          {machines.map((m) => {
            const isCrit = m.efficiency < 80;
            const isW = m.efficiency >= 80 && m.efficiency < 90;

            return (
              <button
                key={m.machine_id}
                onClick={() => onSelectMachine(m.machine_id)}
                onMouseEnter={() => setHoveredMachine(m)}
                onMouseLeave={() => setHoveredMachine(null)}
                className={`h-8 rounded flex items-center justify-center font-mono text-[10px] font-semibold transition-all cursor-pointer shadow-2xs ${
                  isCrit
                    ? 'bg-rose-500 text-white hover:bg-rose-600 hover:scale-105 ring-2 ring-rose-300'
                    : isW
                    ? 'bg-amber-400 text-amber-950 hover:bg-amber-500 hover:scale-105'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105'
                }`}
                title={`${m.machine_id}: ${m.efficiency.toFixed(1)}% Efficiency`}
              >
                {m.machine_id.replace(/^(TOY|SUL|VTX|RF)-/, '')}
              </button>
            );
          })}
        </div>

        {/* Hover Details Floating Banner */}
        {hoveredMachine && (
          <div className="mt-2 p-2.5 rounded-lg bg-surface-900 text-white text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-amber-300">{hoveredMachine.machine_id}</span>
              <span className="text-slate-300">({hoveredMachine.machine_type} • {hoveredMachine.department})</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Actual: <strong className="text-white font-mono">{hoveredMachine.actual.toLocaleString()}u</strong></span>
              <span>Efficiency: <strong className={hoveredMachine.efficiency < 80 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{hoveredMachine.efficiency.toFixed(1)}%</strong></span>
              <span className="text-[11px] text-brand-300 underline font-medium">Click to inspect →</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
