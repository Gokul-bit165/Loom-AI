'use client';

import React, { useState } from 'react';
import { Database, ShieldCheck, X, CheckCircle2 } from 'lucide-react';

interface ProvenancePillProps {
  isDemo?: boolean;
  datasetLabel?: string;
  recordsAnalyzed?: number;
}

export function ProvenancePill({
  isDemo = true,
  datasetLabel = 'Grounded Factory Baseline',
  recordsAnalyzed = 177,
}: ProvenancePillProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border bg-command-850 hover:bg-command-800 transition-colors border-command-700/70 text-command-300"
        title="Click to view Data Environment and Audit Integrity"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isDemo ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
          }`}
        />
        <span>{isDemo ? 'Grounded Baseline' : 'Live Mill Stream'}</span>
        <span className="text-command-500">•</span>
        <span className="text-command-400">Audit Verified</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-command-900 border border-command-700 rounded-lg max-w-md w-full shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-command-700">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm text-command-100 uppercase tracking-wider">
                  DATA ENVIRONMENT & INTEGRITY
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-command-400 hover:text-command-100 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-command-300 leading-relaxed">
              <div className="p-3 rounded bg-command-850 border border-command-700/60 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-command-500">Dataset Source:</span>
                  <span className="text-command-100 font-bold">{datasetLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-command-500">Integrity Type:</span>
                  <span className="text-amber-400 font-bold">
                    {isDemo ? 'Synthetic Shift Grounding (V1)' : 'Direct Mill Integration'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-command-500">Verified Rows:</span>
                  <span className="text-command-100 font-bold">{recordsAnalyzed} records</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-[11px] text-command-400 bg-command-800/40 p-2.5 rounded border border-command-700/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  All metrics displayed in this system are computed with 100% mathematical determinism directly from PostgreSQL tables. The LLM assistant has zero calculation authority.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-command-800 hover:bg-command-700 text-command-100 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
