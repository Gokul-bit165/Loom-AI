'use client';

import React from 'react';
import { Sparkles, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BriefingBannerProps {
  narrative?: string;
  productionRowIds?: number[];
  breakdownEventIds?: number[];
  revenueRowIds?: number[];
  onInspectIds?: (title: string, ids: number[]) => void;
}

export function BriefingBanner({
  narrative,
  productionRowIds = [],
  breakdownEventIds = [],
  revenueRowIds = [],
  onInspectIds,
}: BriefingBannerProps) {
  const defaultBriefing =
    "Plant production operated at 93.50% efficiency with a total volume of 1,765,471 units. While 52 machines achieved optimal output (>=95%), operational loss is tightly concentrated in 4 chronic bottleneck units (VTX-06, TOY-08, RF-11, TOY-02). Resolving roving can staging on VTX-06 and cleaning changeover cycles on RF-11 will recover an estimated 5,500 units per shift.";

  return (
    <div className="panel-command border-blue-900/60 bg-blue-950/20 space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-command-700/50">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-command-100 font-mono">
            GROUNDED MANAGEMENT BRIEFING & AUDIT CITATIONS
          </h3>
        </div>
        <Link
          href="/ask"
          className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center space-x-1"
        >
          <span>Ask Decision Assistant</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <p className="text-xs text-command-200 leading-relaxed font-mono">
        {narrative || defaultBriefing}
      </p>

      {/* Primary Key Audit Pills */}
      <div className="pt-2 border-t border-command-700/40 flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <span className="text-command-500 font-bold uppercase">Audit Citations:</span>

        {productionRowIds.length > 0 && onInspectIds && (
          <button
            onClick={() =>
              onInspectIds('Production Fact Logs Audit', productionRowIds)
            }
            className="px-2 py-0.5 rounded bg-command-800 hover:bg-command-750 text-blue-300 border border-command-700 transition-colors flex items-center space-x-1"
          >
            <Database className="w-3 h-3 text-blue-400" />
            <span>{productionRowIds.length} Production Rows</span>
          </button>
        )}

        {breakdownEventIds.length > 0 && onInspectIds && (
          <button
            onClick={() =>
              onInspectIds('Breakdown Stoppage Events Audit', breakdownEventIds)
            }
            className="px-2 py-0.5 rounded bg-command-800 hover:bg-command-750 text-amber-300 border border-command-700 transition-colors flex items-center space-x-1"
          >
            <Database className="w-3 h-3 text-amber-400" />
            <span>{breakdownEventIds.length} Stoppage Events</span>
          </button>
        )}

        {revenueRowIds.length > 0 && onInspectIds && (
          <button
            onClick={() =>
              onInspectIds('Revenue Style Records Audit', revenueRowIds)
            }
            className="px-2 py-0.5 rounded bg-command-800 hover:bg-command-750 text-emerald-300 border border-command-700 transition-colors flex items-center space-x-1"
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span>{revenueRowIds.length} Revenue Rows</span>
          </button>
        )}
      </div>
    </div>
  );
}
