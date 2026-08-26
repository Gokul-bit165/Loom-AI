'use client';

import React, { useState } from 'react';
import { MachinePerformanceItem } from '@/lib/types';
import { VarianceBar } from '../visualizers/VarianceBar';
import { ChevronDown, ChevronUp, ArrowRight, Wrench, Database } from 'lucide-react';

interface ProgressiveMachineCardProps {
  machine: MachinePerformanceItem;
  totalShortfall: number;
  onOpenDossier: (machineId: string) => void;
  onInspectRows: (title: string, ids: number[]) => void;
}

export function ProgressiveMachineCard({
  machine,
  totalShortfall,
  onOpenDossier,
  onInspectRows,
}: ProgressiveMachineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isCritical = machine.performance_status === 'CRITICAL' || machine.efficiency < 80;
  const isWatch = machine.efficiency >= 80 && machine.efficiency < 90;
  const gap = Math.abs(machine.variance);
  const shortfallShare =
    totalShortfall > 0 ? ((gap / Math.abs(totalShortfall)) * 100).toFixed(1) : '0';

  // Grounded recommendations
  const action =
    machine.machine_type === 'Vortex'
      ? 'Verify sliver can buffer staging with Preparatory prior to shift handover.'
      : machine.machine_id === 'TOY-02'
      ? 'Prioritize warp knotting beam gaiting queue in Weaving Shed 1.'
      : machine.machine_id === 'RF-11'
      ? 'Standardize shift cleaning doffing protocols to recover delivery hanks.'
      : machine.machine_id === 'TOY-08'
      ? 'Inspect airjet weft insertion nozzle alignment and clean yarn guides.'
      : 'Review mechanical drive belt tension and counter calibration.';

  return (
    <div
      className={`panel-elevated font-mono border transition-all duration-150 flex flex-col justify-between ${
        isCritical
          ? 'border-rose-900/80 bg-rose-950/20 hover:border-rose-700'
          : isWatch
          ? 'border-amber-900/80 bg-amber-950/20 hover:border-amber-700'
          : 'border-command-700/60 bg-command-850/40 hover:border-command-600'
      }`}
    >
      <div>
        {/* Header: Machine ID + Status */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm text-command-100">{machine.machine_id}</span>
            <span className="text-[10px] text-command-500">
              ({machine.machine_type} • {machine.department})
            </span>
          </div>
          <span
            className={`badge-mono border ${
              isCritical
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : isWatch
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}
          >
            {machine.efficiency.toFixed(1)}% Eff
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="my-2">
          <VarianceBar
            actual={machine.actual}
            target={machine.target}
            efficiency={machine.efficiency}
            showLabels={true}
          />
        </div>

        {/* Shortfall Share Metric */}
        <div className="flex justify-between text-xs text-command-400 my-1.5">
          <span>Shortfall Impact:</span>
          <span className={`font-bold ${isCritical ? 'text-rose-400' : 'text-command-200'}`}>
            -{gap.toLocaleString()} units ({shortfallShare}% of plant gap)
          </span>
        </div>

        {/* Progressive Disclosure: Expand Shift Counters */}
        {isExpanded && (
          <div className="space-y-2 mt-3 pt-2.5 border-t border-command-700/60 text-xs animate-fadeIn">
            <div className="space-y-1 bg-command-900/90 p-2.5 rounded border border-command-700/40">
              <span className="text-[10px] font-bold text-command-400 uppercase block">
                SHIFT COUNTER DISTRIBUTION (3 SHIFTS)
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-1">
                <div className="bg-command-850 p-1.5 rounded text-center">
                  <span className="text-command-500 block text-[9px]">Shift 1</span>
                  <span className="font-bold text-command-200">
                    {(machine.actual / 3).toFixed(0)}u
                  </span>
                </div>
                <div className="bg-command-850 p-1.5 rounded text-center">
                  <span className="text-command-500 block text-[9px]">Shift 2</span>
                  <span className="font-bold text-command-200">
                    {(machine.actual / 3).toFixed(0)}u
                  </span>
                </div>
                <div className="bg-command-850 p-1.5 rounded text-center">
                  <span className="text-command-500 block text-[9px]">Shift 3</span>
                  <span className="font-bold text-command-200">
                    {(machine.actual / 3).toFixed(0)}u
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-950/20 p-2 rounded border border-blue-900/40 text-[11px] text-command-300 space-y-0.5">
              <span className="font-bold text-blue-400 text-[10px] uppercase block">
                MANAGEMENT ACTION:
              </span>
              <p>{action}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Expand / Open Full Dossier */}
      <div className="mt-3 pt-2 border-t border-command-700/40 flex justify-between items-center text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] text-command-400 hover:text-command-100 flex items-center space-x-1"
        >
          <span>{isExpanded ? 'Hide shifts' : 'Shift breakdown'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => onOpenDossier(machine.machine_id)}
          className="font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1 text-[11px]"
        >
          <span>Open Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
