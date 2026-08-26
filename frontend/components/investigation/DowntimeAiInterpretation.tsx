'use client';

import React from 'react';
import { Sparkles, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DowntimeAiInterpretationProps {
  totalMinutes: number;
  totalEvents: number;
  dominantReason: string;
  dominantReasonPct: number;
  worstMachineId: string;
  worstMachineMinutes: number;
  breakdownEventIds?: number[];
  onInspectIds?: (title: string, ids: number[]) => void;
}

export function DowntimeAiInterpretation({
  totalMinutes,
  totalEvents,
  dominantReason,
  dominantReasonPct,
  worstMachineId,
  worstMachineMinutes,
  breakdownEventIds = [],
  onInspectIds,
}: DowntimeAiInterpretationProps) {
  const narrative = `The plant recorded ${totalMinutes.toLocaleString()} minutes of mechanical capacity loss across ${totalEvents} stoppage events on this date. Stoppage time is heavily dominated by '${dominantReason}', which accounts for ${dominantReasonPct.toFixed(
    1
  )}% of all recorded downtime. Machine ${worstMachineId} experienced the highest individual loss (${worstMachineMinutes} minutes). Review whether scheduled cleaning cycles can be staggered across spinning shifts to avoid concurrent offline frames during peak tariff windows, and inspect weft feeder nozzles on chronic airjet looms.`;

  return (
    <div className="panel-command border-amber-900/60 bg-amber-950/20 space-y-3 font-mono">
      <div className="flex justify-between items-center pb-2 border-b border-command-700/50 text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            CONTEXTUAL MAINTENANCE INTERPRETATION (DETERMINISTIC CITATION)
          </span>
        </div>
        <Link
          href="/decisions"
          className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 text-[11px]"
        >
          <span>Ask Assistant</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <p className="text-xs text-command-200 leading-relaxed font-mono">
        {narrative}
      </p>

      {/* Primary Key Audit Trail Trigger */}
      {breakdownEventIds.length > 0 && onInspectIds && (
        <div className="pt-2 border-t border-command-700/40 flex items-center justify-between text-[11px]">
          <span className="text-command-500">
            Source: PostgreSQL <code className="text-command-400">breakdown_events</code> table
          </span>
          <button
            onClick={() =>
              onInspectIds('Breakdown Stoppage Events Audit', breakdownEventIds)
            }
            className="text-amber-400 hover:text-amber-300 underline font-bold flex items-center space-x-1"
          >
            <Database className="w-3 h-3" />
            <span>Audit All {breakdownEventIds.length} Event Primary Keys →</span>
          </button>
        </div>
      )}
    </div>
  );
}
