import React from 'react';
import { AlertTriangle, Database } from 'lucide-react';

interface ProvenanceBannerProps {
  isDemo?: boolean;
  datasetLabel?: string;
  recordsAnalyzed?: number;
  lastUpdated?: string;
}

export function ProvenanceBanner({
  isDemo = true,
  datasetLabel = 'Synthetic Grounded Factory V1',
  recordsAnalyzed,
  lastUpdated,
}: ProvenanceBannerProps) {
  if (!isDemo) {
    return (
      <div className="bg-emerald-900/10 border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">LIVE FACTORY DATA</span>
          <span className="text-emerald-700">({datasetLabel})</span>
        </div>
        {recordsAnalyzed && <span>{recordsAnalyzed.toLocaleString()} records verified</span>}
      </div>
    );
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <div>
          <span className="font-bold tracking-wide uppercase text-amber-800">
            DEMO / SYNTHETIC DATASET:
          </span>{' '}
          <span className="text-amber-800">
            Values are generated for demonstration & decision-support testing (
            <span className="font-medium">{datasetLabel}</span>). Not live plant measurements.
          </span>
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-4 text-amber-800/80">
        {recordsAnalyzed !== undefined && (
          <span>{recordsAnalyzed.toLocaleString()} records analyzed</span>
        )}
        {lastUpdated && <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>}
      </div>
    </div>
  );
}
