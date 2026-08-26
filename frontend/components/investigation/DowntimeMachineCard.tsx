'use client';

import React, { useState } from 'react';
import { MachineRankingItem } from '@/lib/types';
import { ChevronDown, ChevronUp, ArrowRight, Wrench, Clock, Database } from 'lucide-react';

interface DowntimeMachineCardProps {
  machine: MachineRankingItem;
  rank: number;
  onOpenDossier: (machineId: string) => void;
  onInspectEvents: (title: string, ids: number[]) => void;
}

export function DowntimeMachineCard({
  machine,
  rank,
  onOpenDossier,
  onInspectEvents,
}: DowntimeMachineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isSevere = machine.downtime_minutes >= 120 || rank <= 4;
  const isModerate = machine.downtime_minutes >= 60 && machine.downtime_minutes < 120;

  return (
    <div
      className={`panel-elevated font-mono border transition-all duration-150 flex flex-col justify-between ${
        isSevere
          ? 'border-rose-900/80 bg-rose-950/20 hover:border-rose-700'
          : isModerate
          ? 'border-amber-900/80 bg-amber-950/20 hover:border-amber-700'
          : 'border-command-700/60 bg-command-850/40 hover:border-command-600'
      }`}
    >
      <div>
        {/* Header: Rank + Machine ID + Lost Minutes */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-command-500 font-bold text-xs">#{rank}</span>
            <span className="font-extrabold text-sm text-command-100">{machine.machine_id}</span>
            <span className="text-[10px] text-command-500">
              ({machine.machine_type} • {machine.department})
            </span>
          </div>
          <span
            className={`badge-mono border ${
              isSevere
                ? 'bg-rose-950 text-rose-300 border-rose-800 font-bold'
                : 'bg-amber-950 text-amber-300 border-amber-800'
            }`}
          >
            {machine.downtime_minutes} mins lost
          </span>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-3 gap-2 bg-command-900/90 p-2 rounded border border-command-700/40 text-[11px] my-2 text-center">
          <div>
            <span className="text-command-500 block text-[9px]">Stoppages:</span>
            <span className="text-command-100 font-bold">{machine.event_count} events</span>
          </div>
          <div>
            <span className="text-command-500 block text-[9px]">Avg Duration:</span>
            <span className="text-command-200 font-bold">{machine.average_event_duration} min</span>
          </div>
          <div>
            <span className="text-command-500 block text-[9px]">% Plant Loss:</span>
            <span className="text-amber-400 font-bold">{machine.percentage_of_total_downtime}%</span>
          </div>
        </div>

        {/* Progressive Disclosure: Individual Event IDs */}
        {isExpanded && (
          <div className="space-y-2 mt-3 pt-2.5 border-t border-command-700/60 text-xs animate-fadeIn">
            <div className="bg-command-900/90 p-2.5 rounded border border-command-700/40 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-command-400 uppercase">
                <span>Recorded Stoppage Events</span>
                <span>{machine.evidence.breakdown_event_ids.length} Events</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {machine.evidence.breakdown_event_ids.map((id) => (
                  <span
                    key={id}
                    className="bg-command-850 border border-command-700 px-1.5 py-0.5 rounded text-[10px] text-command-300 font-mono"
                  >
                    Event #{id}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-amber-950/20 p-2 rounded border border-amber-900/40 text-[11px] text-amber-200">
              <span>
                Review shift logs and coordinate with mechanical fitters for preventive inspection.
              </span>
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
          <span>{isExpanded ? 'Hide events' : 'Event breakdown'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => onOpenDossier(machine.machine_id)}
          className="font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 text-[11px]"
        >
          <span>Open Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
