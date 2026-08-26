import React from 'react';
import { Sparkles, Database } from 'lucide-react';

interface SentinelSkeletonProps {
  customMessage?: string;
}

export function SentinelSkeleton({
  customMessage = 'Executing deterministic SQL aggregations over PostgreSQL fact tables...',
}: SentinelSkeletonProps) {
  return (
    <div className="space-y-6 font-sans animate-pulse">
      {/* Progress Liveness Banner */}
      <div className="bg-brand-50/70 border border-brand-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-brand-800">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-4 h-4 text-brand-600 animate-spin" />
          <span className="font-semibold">{customMessage}</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-surface-500">
          <Database className="w-3.5 h-3.5 text-surface-400" />
          <span>Real-Time Query</span>
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="bg-white border border-surface-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-card">
        <div className="h-4 w-48 bg-surface-200 rounded-full" />
        <div className="h-8 w-3/4 bg-surface-200 rounded-lg" />
        <div className="h-16 w-full bg-surface-100 rounded-lg" />
      </div>

      {/* Two-Column Grid Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 h-64 bg-white border border-surface-200 rounded-xl p-5 shadow-card" />
        <div className="lg:col-span-8 h-64 bg-white border border-surface-200 rounded-xl p-5 shadow-card" />
      </div>
    </div>
  );
}
