import React from 'react';
import { AlertTriangle, Info, Clock, Sparkles, Database } from 'lucide-react';

interface OperationalStateBannerProps {
  type: 'PARTIAL_DATA' | 'MISSING_PREV_DAY' | 'LLM_DEGRADED' | 'CACHED_DATA';
  message?: string;
  details?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function OperationalStateBanner({
  type,
  message,
  details,
  onAction,
  actionLabel,
}: OperationalStateBannerProps) {
  if (type === 'PARTIAL_DATA') {
    return (
      <div className="rounded-lg border border-amber-800/80 bg-amber-950/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 uppercase block text-[11px]">
              PARTIAL SHIFT REGISTER DATA DETECTED
            </span>
            <span className="text-amber-200/90 text-[11px]">
              {message ||
                'Only a subset of machine departments have submitted shift logs for this date. Aggregations reflect partial plant coverage.'}
            </span>
          </div>
        </div>

        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="px-3 py-1 bg-amber-900/60 hover:bg-amber-850 border border-amber-700 text-amber-200 rounded text-[11px] font-bold self-start sm:self-auto shrink-0 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  if (type === 'MISSING_PREV_DAY') {
    return (
      <div className="rounded-lg border border-blue-900/60 bg-blue-950/20 p-2.5 flex items-center space-x-2 text-xs font-mono text-blue-300">
        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="text-[11px]">
          {message ||
            'Previous day baseline records are unavailable. Day-over-Day percentage drift is omitted to maintain mathematical honesty.'}
        </span>
      </div>
    );
  }

  if (type === 'LLM_DEGRADED') {
    return (
      <div className="rounded-lg border border-purple-900/60 bg-purple-950/20 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2 text-purple-300">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-[11px]">
            {message ||
              'External LLM service is offline. Narrative is generated using deterministic template synthesis over active PostgreSQL fact tables.'}
          </span>
        </div>
        <span className="badge-mono bg-purple-950 text-purple-300 border border-purple-800 text-[10px] self-start sm:self-auto">
          DETERMINISTIC FALLBACK ACTIVE
        </span>
      </div>
    );
  }

  if (type === 'CACHED_DATA') {
    return (
      <div className="rounded-lg border border-command-700 bg-command-900 p-2.5 flex items-center space-x-2 text-xs font-mono text-command-400">
        <Clock className="w-3.5 h-3.5 text-command-500 shrink-0" />
        <span className="text-[11px]">
          {message || 'Displaying validated snapshot from cache (last refreshed 2 mins ago).'}
        </span>
      </div>
    );
  }

  return null;
}
