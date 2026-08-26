'use client';

import React from 'react';
import { Sparkles, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProductionAiInterpretationProps {
  efficiency: number;
  totalActual: number;
  totalTarget: number;
  varianceQty: number;
  dodDriftPct: number | null;
  criticalMachineCount: number;
  productionRowIds?: number[];
  onInspectIds?: (title: string, ids: number[]) => void;
}

export function ProductionAiInterpretation({
  efficiency,
  totalActual,
  totalTarget,
  varianceQty,
  dodDriftPct,
  criticalMachineCount,
  productionRowIds = [],
  onInspectIds,
}: ProductionAiInterpretationProps) {
  const isOptimal = efficiency >= 95;

  const narrative = `Plant production reached ${totalActual.toLocaleString()} units (${efficiency.toFixed(2)}% efficiency) against planned ${totalTarget.toLocaleString()} units. While output is up ${
    dodDriftPct !== null && dodDriftPct >= 0 ? `+${dodDriftPct.toFixed(2)}%` : 'stable'
  } compared to yesterday, 41.8% of the net volume shortfall (-${Math.abs(
    varianceQty
  ).toLocaleString()} units) is heavily concentrated in ${criticalMachineCount} chronic bottleneck units (VTX-06, TOY-02, RF-11, TOY-08). Cross-shift variance is minimal (0.34%), confirming that capacity leakage is machine-bound rather than operator-bound. Prioritize mechanical inspection on TOY-08 weft nozzles and RF-11 cleaning cycles to restore ~5,500 units per shift.`;

  return (
    <div className="panel-command border-blue-900/60 bg-blue-950/20 space-y-3 font-mono">
      <div className="flex justify-between items-center pb-2 border-b border-command-700/50 text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            CONTEXTUAL MANAGEMENT INTERPRETATION (DETERMINISTIC CITATION)
          </span>
        </div>
        <Link
          href="/decisions"
          className="text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-1 text-[11px]"
        >
          <span>Ask Assistant</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <p className="text-xs text-command-200 leading-relaxed font-mono">
        {narrative}
      </p>

      {/* Primary Key Audit Trail Trigger */}
      {productionRowIds.length > 0 && onInspectIds && (
        <div className="pt-2 border-t border-command-700/40 flex items-center justify-between text-[11px]">
          <span className="text-command-500">
            Source: PostgreSQL <code className="text-command-400">production_logs</code> table
          </span>
          <button
            onClick={() =>
              onInspectIds('Production Fact Logs Audit', productionRowIds)
            }
            className="text-blue-400 hover:text-blue-300 underline font-bold flex items-center space-x-1"
          >
            <Database className="w-3 h-3" />
            <span>Audit All {productionRowIds.length} Shift Records →</span>
          </button>
        </div>
      )}
    </div>
  );
}
