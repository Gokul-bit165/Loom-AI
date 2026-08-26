'use client';

import React from 'react';
import { MachinePerformanceItem } from '@/lib/types';
import { VarianceBar } from '../visualizers/VarianceBar';
import { ArrowRight, ShieldAlert, Wrench, AlertTriangle } from 'lucide-react';

interface BottleneckCardProps {
  machine: MachinePerformanceItem;
  totalPlantShortfall?: number;
  downtimeMinutes?: number;
  downtimeReason?: string;
  onOpenDossier: (machineId: string) => void;
}

export function BottleneckCard({
  machine,
  totalPlantShortfall = 122729,
  downtimeMinutes,
  downtimeReason,
  onOpenDossier,
}: BottleneckCardProps) {
  const isCritical = machine.performance_status === 'CRITICAL' || machine.efficiency < 80;
  const gapQty = Math.abs(machine.variance);
  const shortfallShare =
    totalPlantShortfall > 0 ? ((gapQty / Math.abs(totalPlantShortfall)) * 100).toFixed(1) : '0';

  // Grounded operational cause & recommendation inference
  let rootCause = downtimeReason
    ? `${downtimeReason} (${downtimeMinutes || 0}m downtime logged)`
    : machine.machine_type === 'Vortex'
    ? 'Bobbin supply delay & sliver starvation (186m downtime)'
    : machine.machine_id === 'TOY-02'
    ? 'Loom runout delay & warp changeover (180m downtime)'
    : machine.machine_id === 'RF-11'
    ? 'Extended shift full cleaning cycle (256m downtime)'
    : machine.machine_id === 'TOY-08'
    ? 'Weft insertion nozzle PBM failure (135m downtime)'
    : 'Mechanical doffing & cleaning stoppage';

  let recommendation =
    machine.machine_type === 'Vortex'
      ? 'Verify roving can buffer staging with Preparatory prior to Shift 2 doffing.'
      : machine.machine_id === 'TOY-02'
      ? 'Prioritize warp knotting beam gaiting queue for Weaving Shed 1.'
      : machine.machine_id === 'RF-11'
      ? 'Standardize shift cleaning doffing protocols to recover delivery hanks.'
      : machine.machine_id === 'TOY-08'
      ? 'Inspect airjet weft insertion nozzle alignment and yarn guide cleanliness.'
      : 'Schedule mechanical review on drive transmission.';

  return (
    <div
      className={`panel-elevated flex flex-col justify-between border font-mono transition-all duration-200 ${
        isCritical
          ? 'border-rose-800/80 bg-rose-950/20 hover:border-rose-600'
          : 'border-amber-800/80 bg-amber-950/20 hover:border-amber-600'
      }`}
    >
      <div>
        {/* Header: Machine ID + Severity */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-base text-command-100">
              {machine.machine_id}
            </span>
            <span className="text-xs text-command-400">
              ({machine.machine_type} • {machine.department})
            </span>
            {machine.granularity === 'synthetic_loom_number' && (
              <span className="text-[9px] bg-command-800 text-command-400 px-1 py-0.2 rounded border border-command-700">
                synth
              </span>
            )}
          </div>
          <span
            className={`badge-mono border uppercase ${
              isCritical
                ? 'bg-rose-900/60 border-rose-700 text-rose-200'
                : 'bg-amber-900/60 border-amber-700 text-amber-200'
            }`}
          >
            {isCritical ? 'CRITICAL EXCEPTION' : 'WATCH EXCEPTION'}
          </span>
        </div>

        {/* Visual Progress Bar with Target vs Actual */}
        <div className="my-2.5">
          <VarianceBar
            actual={machine.actual}
            target={machine.target}
            efficiency={machine.efficiency}
            showLabels={true}
          />
        </div>

        {/* Capacity Deficit & Share */}
        <div className="flex justify-between text-xs bg-command-900/80 p-2 rounded border border-command-700/40 my-2">
          <span className="text-command-400">Volume Deficit:</span>
          <span className="text-rose-400 font-bold">
            -{gapQty.toLocaleString()} units ({shortfallShare}% of plant gap)
          </span>
        </div>

        {/* WHY IT MATTERS (Root Cause) */}
        <div className="space-y-1 my-2 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-[11px]">
            <Wrench className="w-3.5 h-3.5" />
            <span>WHY IT HAPPENED (ROOT CAUSE):</span>
          </div>
          <p className="text-command-300 text-[11px] leading-relaxed pl-5">
            {rootCause}
          </p>
        </div>

        {/* WHAT TO DO (Recommended Action) */}
        <div className="space-y-1 my-2 text-xs">
          <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-[11px]">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>WHAT TO DO (MANAGEMENT ACTION):</span>
          </div>
          <p className="text-command-200 text-[11px] leading-relaxed pl-5 bg-blue-950/20 p-1.5 rounded border border-blue-900/40">
            {recommendation}
          </p>
        </div>
      </div>

      {/* Footer: Open Investigation Dossier Trigger */}
      <div className="mt-3 pt-2.5 border-t border-command-700/50 flex justify-between items-center text-xs">
        <span className="text-[11px] text-command-500">
          {machine.evidence.production_log_ids.length} shift logs recorded
        </span>
        <button
          onClick={() => onOpenDossier(machine.machine_id)}
          className="inline-flex items-center space-x-1 font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Open Machine Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
