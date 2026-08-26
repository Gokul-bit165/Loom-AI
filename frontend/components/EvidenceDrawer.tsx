'use client';

import React from 'react';
import { X, Database, CheckCircle2 } from 'lucide-react';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  evidenceIds: number[];
  provenanceLabel?: string;
  sourceType?: string;
  extraDetails?: Record<string, any>;
}

export function EvidenceDrawer({
  isOpen,
  onClose,
  title,
  evidenceIds,
  provenanceLabel = 'Grounded Factory Baseline',
  sourceType = 'synthetic',
  extraDetails,
}: EvidenceDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-surface-900/40 backdrop-blur-xs flex justify-end font-sans">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-surface-200">
        {/* Header */}
        <div className="p-4 border-b border-surface-100 flex items-center justify-between bg-surface-50">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-brand-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-surface-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="bg-surface-50 rounded-xl p-3.5 border border-surface-200 space-y-1.5">
            <div className="font-semibold text-surface-500 uppercase tracking-wider text-[10px]">
              DATA PROVENANCE & AUDIT TRAIL
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Dataset Source:</span>
              <span className="font-semibold text-surface-900">{provenanceLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Storage Anchor:</span>
              <span className="font-semibold text-surface-800">PostgreSQL Fact Table</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Contributing Records:</span>
              <span className="font-bold text-brand-600 font-mono">{evidenceIds.length} rows</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-surface-700 uppercase mb-2 flex items-center justify-between">
              <span>Primary Key Record IDs</span>
              <span className="text-surface-500 font-normal">Exact DB Row IDs</span>
            </div>
            {evidenceIds.length === 0 ? (
              <p className="text-surface-500 italic">No record IDs attached.</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 max-h-64 overflow-y-auto p-2.5 bg-surface-50 border border-surface-200 rounded-lg">
                {evidenceIds.map((id) => (
                  <div
                    key={id}
                    className="bg-white border border-surface-200 rounded px-1.5 py-1 text-center font-mono text-[11px] text-surface-700 shadow-2xs font-semibold"
                  >
                    #{id}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-[11px] text-emerald-900 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Zero-Math Guarantee:</span> This metric was computed by deterministic SQL aggregation over the primary keys listed above.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-100 bg-surface-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-surface-900 hover:bg-surface-800 text-white rounded-lg transition-colors shadow-xs"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
