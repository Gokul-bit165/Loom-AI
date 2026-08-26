'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export interface AttentionItem {
  machine_id: string;
  department: string;
  machine_type: string;
  metric: string;
  severity: 'CRITICAL' | 'WARNING' | 'ATTENTION';
  reason: string;
  action_route: string;
  evidence_count?: number;
}

interface AttentionSectionProps {
  items: AttentionItem[];
  onInspectEvidence?: (machineId: string) => void;
}

export function AttentionSection({ items, onInspectEvidence }: AttentionSectionProps) {
  if (!items || items.length === 0) {
    return (
      <div className="card-industrial bg-emerald-50/50 border-emerald-200">
        <div className="flex items-center space-x-2 text-emerald-800 text-sm font-semibold">
          <span>✓</span>
          <span>All machines operating within normal efficiency and downtime thresholds.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card-industrial border-rose-200 bg-rose-50/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-rose-950">
            ATTENTION REQUIRED ({items.length} ISSUES DETECTED)
          </h2>
        </div>
        <span className="text-xs text-rose-700 font-medium">Prioritized by severity</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, idx) => {
          const isCritical = item.severity === 'CRITICAL';
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-md border bg-white shadow-xs flex flex-col justify-between transition-all ${
                isCritical
                  ? 'border-rose-300 hover:border-rose-400'
                  : 'border-amber-300 hover:border-amber-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-sm text-slate-900">{item.machine_id}</span>
                    <span className="text-[11px] text-slate-500">
                      ({item.machine_type} • {item.department})
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-800 my-1">{item.metric}</div>
                <p className="text-xs text-slate-600 mb-3">{item.reason}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={item.action_route}
                  className="font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>View analysis</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                {onInspectEvidence && (
                  <button
                    onClick={() => onInspectEvidence(item.machine_id)}
                    className="text-slate-500 hover:text-slate-800 underline text-[11px]"
                  >
                    Evidence
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
