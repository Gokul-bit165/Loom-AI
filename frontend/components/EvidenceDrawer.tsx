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
  provenanceLabel = 'Synthetic Factory Data V1',
  sourceType = 'synthetic',
  extraDetails,
}: EvidenceDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1.5">
            <div className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              DATA PROVENANCE
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dataset Source:</span>
              <span className="font-medium text-slate-800">{provenanceLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Source Type:</span>
              <span className="font-medium text-slate-800 uppercase text-[11px] bg-slate-200 px-1.5 py-0.2 rounded">
                {sourceType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Supporting Records:</span>
              <span className="font-medium text-slate-800">{evidenceIds.length} records</span>
            </div>
          </div>

          {extraDetails && (
            <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-200 text-xs space-y-1.5">
              <div className="font-semibold text-blue-900 uppercase tracking-wider text-[10px]">
                METRIC CONTEXT
              </div>
              {Object.entries(extraDetails).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-blue-700 capitalize">{k.replace(/_/g, ' ')}:</span>
                  <span className="font-medium text-blue-950">{String(v)}</span>
                </div>
              ))}
            </div>
          )}

          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>Underlying Database Record IDs</span>
              <span className="text-[11px] text-slate-400 font-normal">Primary Keys</span>
            </div>
            {evidenceIds.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No record IDs attached.</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 max-h-60 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-md">
                {evidenceIds.map((id) => (
                  <div
                    key={id}
                    className="bg-white border border-slate-200 rounded px-2 py-1 text-center font-mono text-[11px] text-slate-700 shadow-2xs"
                  >
                    #{id}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-800 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Audit Guarantee:</span> This metric is computed
              directly from the listed row IDs in PostgreSQL with zero LLM calculations.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
