import React from 'react';
import { AlertOctagon, RefreshCw, Database, WifiOff } from 'lucide-react';

interface SystemErrorStateProps {
  error: string;
  onRetry?: () => void;
  errorCode?: string;
  diagnosticDetails?: string;
}

export function SystemErrorState({
  error,
  onRetry,
  errorCode = 'API_CONNECTION_ERROR',
  diagnosticDetails,
}: SystemErrorStateProps) {
  const isDbDown =
    error.toLowerCase().includes('database') ||
    error.toLowerCase().includes('connection') ||
    error.toLowerCase().includes('postgresql');

  const isTimeout =
    error.toLowerCase().includes('timeout') ||
    error.toLowerCase().includes('aborted') ||
    error.toLowerCase().includes('timed out');

  const errorTitle = isDbDown
    ? 'PostgreSQL Database Unreachable'
    : isTimeout
    ? 'API Request Timeout (>10,000ms)'
    : 'Analytics Service Error';

  return (
    <div className="panel-saas border-rose-200 bg-rose-50/30 max-w-3xl mx-auto space-y-6 shadow-card font-sans">
      {/* Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-rose-100">
        <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600">
          {isDbDown ? <Database className="w-5 h-5" /> : isTimeout ? <WifiOff className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-rose-900">{errorTitle}</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-mono">
              {errorCode}
            </span>
          </div>
          <span className="text-xs text-surface-500 font-normal">
            The system intercepted an unhandled failure and suppressed fallback fabrication.
          </span>
        </div>
      </div>

      {/* 4-Part Framework */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-rose-100 space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            01 WHAT WE KNOW
          </span>
          <p className="text-surface-700 leading-relaxed font-normal">
            The frontend dispatched an analytical request, but received an exception: <code className="text-rose-700 font-semibold font-mono">"{error}"</code>
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-rose-100 space-y-1">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
            02 WHAT WE DON'T KNOW
          </span>
          <p className="text-surface-700 leading-relaxed font-normal">
            {isDbDown
              ? 'Whether PostgreSQL is under scheduled maintenance or blocked by firewall.'
              : isTimeout
              ? 'Whether the query was delayed by unindexed locks or high server load.'
              : 'The root application stack trace, suppressed to prevent leaking internal database schemas.'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1 sm:col-span-2">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            03 ZERO-FABRICATION RULE
          </span>
          <p className="text-amber-900 leading-relaxed font-normal">
            Loom AI will never display simulated or mock data during a service outage. Mathematical integrity requires genuine database query execution.
          </p>
        </div>
      </div>

      {diagnosticDetails && (
        <div className="p-3 bg-white rounded-lg border border-surface-200 text-xs text-surface-600 font-mono">
          {diagnosticDetails}
        </div>
      )}

      {/* Action */}
      <div className="pt-3 border-t border-rose-100 flex items-center justify-between">
        <span className="text-xs text-surface-500">Service Status: Degraded</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Operation</span>
          </button>
        )}
      </div>
    </div>
  );
}
