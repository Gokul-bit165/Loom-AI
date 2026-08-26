import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="card-industrial border-rose-300 bg-rose-50/40 p-8 text-center my-6 flex flex-col items-center justify-center">
      <AlertOctagon className="w-8 h-8 text-rose-600 mb-2" />
      <h3 className="text-sm font-bold text-rose-900 mb-1">Failed to Load Plant Data</h3>
      <p className="text-xs text-rose-700 max-w-md mb-4 font-mono bg-white/70 p-2 rounded border border-rose-200">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
}
