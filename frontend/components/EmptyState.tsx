import React from 'react';
import { CalendarX2 } from 'lucide-react';

interface EmptyStateProps {
  date?: string;
  message?: string;
  onResetDate?: () => void;
}

export function EmptyState({
  date,
  message = 'No data available for this date.',
  onResetDate,
}: EmptyStateProps) {
  return (
    <div className="card-industrial flex flex-col items-center justify-center p-12 text-center my-6 border-dashed border-slate-300 bg-slate-50/50">
      <CalendarX2 className="w-10 h-10 text-slate-400 mb-3" />
      <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1">
        {date ? `No data recorded for ${date}` : 'No records found'}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4">{message}</p>
      {onResetDate && (
        <button
          onClick={onResetDate}
          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Latest Available Date (2026-08-29)
        </button>
      )}
    </div>
  );
}
