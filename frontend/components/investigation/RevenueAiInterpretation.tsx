'use client';

import React from 'react';
import { Sparkles, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RevenueAiInterpretationProps {
  todayRevenue: number;
  mtdRevenue: number;
  dodDriftPct: number | null;
  bestStyleName: string;
  bestStyleShare: number;
  bestMachineId: string;
  revenueRowIds?: number[];
  onInspectIds?: (title: string, ids: number[]) => void;
}

export function RevenueAiInterpretation({
  todayRevenue,
  mtdRevenue,
  dodDriftPct,
  bestStyleName,
  bestStyleShare,
  bestMachineId,
  revenueRowIds = [],
  onInspectIds,
}: RevenueAiInterpretationProps) {
  const narrative = `Weaving shed commercial realization delivered ₹${todayRevenue.toLocaleString()} on this date (${
    dodDriftPct !== null && dodDriftPct >= 0 ? `+${dodDriftPct.toFixed(2)}%` : 'stable'
  } DoD), bringing Month-to-Date turnover to ₹${mtdRevenue.toLocaleString()}. Commercial turnover is led by '${bestStyleName}', which generated ${bestStyleShare.toFixed(
    1
  )}% of today's total revenue across active weaving frames. Loom ${bestMachineId} achieved the highest individual commercial realization. Note: True monetary shortfall calculations remain unavailable pending contracted customer price books and variable yarn cost margin profiles.`;

  return (
    <div className="panel-command border-emerald-900/60 bg-emerald-950/20 space-y-3 font-mono">
      <div className="flex justify-between items-center pb-2 border-b border-command-700/50 text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            CONTEXTUAL COMMERCIAL INTERPRETATION (DETERMINISTIC CITATION)
          </span>
        </div>
        <Link
          href="/decisions"
          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 text-[11px]"
        >
          <span>Ask Assistant</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <p className="text-xs text-command-200 leading-relaxed font-mono">
        {narrative}
      </p>

      {/* Primary Key Audit Trail Trigger */}
      {revenueRowIds.length > 0 && onInspectIds && (
        <div className="pt-2 border-t border-command-700/40 flex items-center justify-between text-[11px]">
          <span className="text-command-500">
            Source: PostgreSQL <code className="text-command-400">production_logs</code> sort revenue rates
          </span>
          <button
            onClick={() =>
              onInspectIds('Revenue Logs Audit', revenueRowIds)
            }
            className="text-emerald-400 hover:text-emerald-300 underline font-bold flex items-center space-x-1"
          >
            <Database className="w-3 h-3" />
            <span>Audit All {revenueRowIds.length} Revenue Transaction Primary Keys →</span>
          </button>
        </div>
      )}
    </div>
  );
}
