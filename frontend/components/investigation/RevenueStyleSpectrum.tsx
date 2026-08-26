'use client';

import React from 'react';
import { FabricStyleRankingItem } from '@/lib/types';
import { Layers } from 'lucide-react';

interface RevenueStyleSpectrumProps {
  styles: FabricStyleRankingItem[];
  selectedStyle: string | null;
  onSelectStyle: (style: string | null) => void;
}

export function RevenueStyleSpectrum({
  styles,
  selectedStyle,
  onSelectStyle,
}: RevenueStyleSpectrumProps) {
  if (!styles || styles.length === 0) {
    return (
      <div className="panel-command text-xs text-command-500 font-mono text-center p-6 italic">
        No fabric styles recorded for this date.
      </div>
    );
  }

  return (
    <div className="panel-command space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-command-700/60 text-xs">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            02 FABRIC STYLE CONTRIBUTION SPECTRUM ({styles.length} ACTIVE COMMERCIAL SORTS)
          </span>
        </div>
        {selectedStyle && (
          <button
            onClick={() => onSelectStyle(null)}
            className="text-blue-400 hover:text-blue-300 text-[11px] underline"
          >
            Clear Filter: {selectedStyle} ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {styles.map((s, idx) => {
          const isSelected = selectedStyle === s.fabric_style;
          const pct = s.percentage_of_total;

          return (
            <div
              key={s.fabric_style}
              onClick={() => onSelectStyle(isSelected ? null : s.fabric_style)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-command-800 border-emerald-500/80 shadow-md'
                  : 'bg-command-850/60 border-command-700/50 hover:bg-command-850 hover:border-command-600'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`font-bold text-sm ${
                      isSelected ? 'text-emerald-300' : 'text-command-100'
                    }`}
                  >
                    {s.fabric_style}
                  </span>
                  <span className="badge-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {pct}% Share
                  </span>
                </div>
                <span className="text-xs text-command-400">
                  Woven across {s.machine_count} active looms
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-command-950 rounded-xs overflow-hidden border border-command-700/60">
                <div
                  className="h-full bg-emerald-500 rounded-xs transition-all duration-300"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>

              <div className="pt-2 border-t border-command-700/40 flex justify-between text-xs">
                <span className="text-command-500">Commercial Realized:</span>
                <span className="text-command-100 font-bold">
                  ₹{s.total_revenue.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
