import React from 'react';
import { CalendarX2, ArrowRight, Database, RefreshCw, AlertCircle } from 'lucide-react';

interface EmptyDayStateProps {
  date: string;
  onJumpToActiveDate?: () => void;
  onRetry?: () => void;
}

export function EmptyDayState({
  date,
  onJumpToActiveDate,
  onRetry,
}: EmptyDayStateProps) {
  return (
    <div className="panel-saas max-w-3xl mx-auto space-y-6 shadow-card font-sans">
      {/* Header Signal */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-surface-100">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <CalendarX2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-surface-900">
            No Production Logs Recorded for {date}
          </h2>
          <span className="text-xs text-surface-500 font-normal">
            Physical shift registers and breakdown fact tables contain zero matching records for this plant day.
          </span>
        </div>
      </div>

      {/* 4-Part Honest State Framework */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* WHAT WE KNOW */}
        <div className="bg-surface-50 p-3.5 rounded-xl border border-surface-200 space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            01 WHAT WE KNOW
          </span>
          <p className="text-surface-700 leading-relaxed font-normal">
            The PostgreSQL database is fully connected and active, but returned 0 rows for query timestamp <code className="font-mono font-semibold text-surface-900">{date}</code>.
          </p>
        </div>

        {/* WHAT WE DON'T KNOW */}
        <div className="bg-surface-50 p-3.5 rounded-xl border border-surface-200 space-y-1">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
            02 WHAT WE DON'T KNOW
          </span>
          <p className="text-surface-700 leading-relaxed font-normal">
            Whether the plant was idle on this day, or if the supervisor's physical logbook has not yet been ingested into the pipeline.
          </p>
        </div>

        {/* WHY (ZERO FABRICATION) */}
        <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 space-y-1 sm:col-span-2">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            03 WHY (ZERO-FABRICATION RULE)
          </span>
          <p className="text-amber-900 leading-relaxed font-normal">
            Loom AI explicitly refuses to display numerical <code className="font-bold">0</code> or simulated baseline metrics when records do not exist. Displaying "0" would imply zero output during active operations rather than missing telemetry.
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="pt-3 border-t border-surface-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-surface-500">
          <Database className="w-4 h-4 text-surface-400" />
          <span>Ingestion pipeline ready for CSV/Excel uploads</span>
        </div>

        <div className="flex items-center space-x-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3.5 py-2 rounded-lg bg-surface-100 hover:bg-surface-200 text-surface-700 text-xs font-semibold transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}

          {onJumpToActiveDate && (
            <button
              onClick={onJumpToActiveDate}
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center space-x-1.5"
            >
              <span>Switch to Active Date (2026-08-29)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
