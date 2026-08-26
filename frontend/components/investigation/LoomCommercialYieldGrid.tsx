'use client';

import React, { useState } from 'react';
import { MachineRevenueItem } from '@/lib/types';
import { ChevronDown, ChevronUp, ArrowRight, IndianRupee, Layers } from 'lucide-react';

interface LoomCommercialYieldGridProps {
  machines: MachineRevenueItem[];
  onOpenDossier: (machineId: string) => void;
  onInspectIds: (title: string, ids: number[]) => void;
}

export function LoomCommercialYieldGrid({
  machines,
  onOpenDossier,
  onInspectIds,
}: LoomCommercialYieldGridProps) {
  const [filterMode, setFilterMode] = useState<'TOP' | 'LOWEST' | 'ALL'>('TOP');

  const top10 = machines.slice(0, 8);
  const lowest8 = [...machines].reverse().slice(0, 8);

  const displayed =
    filterMode === 'TOP' ? top10 : filterMode === 'LOWEST' ? lowest8 : machines;

  return (
    <div className="panel-command space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-command-700/60 text-xs">
        <div>
          <h2 className="font-bold text-command-100 uppercase tracking-wider">
            04 LOOM COMMERCIAL YIELD & TURNOVER DISTRIBUTION ({machines.length} WEAVING LOOMS)
          </h2>
          <p className="text-[11px] text-command-400">
            Realized turnover per loom. Surfacing highest vs lowest contributing units.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-command-950 border border-command-700/80 rounded p-0.5 text-[11px] font-bold">
          <button
            onClick={() => setFilterMode('TOP')}
            className={`px-3 py-1 rounded transition-colors ${
              filterMode === 'TOP'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-command-400 hover:text-command-100'
            }`}
          >
            Top Grossing ({top10.length})
          </button>
          <button
            onClick={() => setFilterMode('LOWEST')}
            className={`px-3 py-1 rounded transition-colors ${
              filterMode === 'LOWEST'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'text-command-400 hover:text-command-100'
            }`}
          >
            Lowest Yield ({lowest8.length})
          </button>
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1 rounded transition-colors ${
              filterMode === 'ALL'
                ? 'bg-command-800 text-blue-400'
                : 'text-command-400 hover:text-command-100'
            }`}
          >
            All Looms ({machines.length})
          </button>
        </div>
      </div>

      {/* Loom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayed.map((m, idx) => {
          const isTop = m.percentage_of_total >= 3.0;

          return (
            <div
              key={m.machine_id}
              className={`p-3 rounded-lg border font-mono flex flex-col justify-between space-y-2.5 transition-all ${
                isTop
                  ? 'bg-emerald-950/20 border-emerald-800/60 hover:border-emerald-600'
                  : 'bg-command-850/60 border-command-700/50 hover:border-command-600'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-sm text-command-100">{m.machine_id}</span>
                  <span className="badge-mono bg-command-900 text-emerald-400 border border-emerald-900 text-[10px]">
                    {m.percentage_of_total}%
                  </span>
                </div>
                <div className="text-xs text-command-400 mt-1 flex items-center space-x-1">
                  <span className="truncate">{m.fabric_styles.join(', ')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-command-700/40 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-command-500 block">Realized:</span>
                  <span className="font-bold text-command-100">
                    ₹{m.total_revenue.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => onOpenDossier(m.machine_id)}
                  className="text-blue-400 hover:text-blue-300 font-bold text-[11px] flex items-center space-x-0.5"
                >
                  <span>Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
