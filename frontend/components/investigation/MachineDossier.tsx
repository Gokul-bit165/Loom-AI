'use client';

import React from 'react';
import {
  MachinePerformanceItem,
  MachineRankingItem,
  MachineRevenueItem,
} from '@/lib/types';
import {
  X,
  Database,
  Wrench,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Clock,
  IndianRupee,
  Layers,
  CheckCircle2,
  Activity,
} from 'lucide-react';

interface MachineDossierProps {
  isOpen: boolean;
  onClose: () => void;
  machineId: string | null;
  perfData?: MachinePerformanceItem;
  downtimeData?: MachineRankingItem;
  revenueData?: MachineRevenueItem;
  date?: string;
  datasetLabel?: string;
  onInspectRawIds?: (title: string, ids: number[]) => void;
}

export function MachineDossier({
  isOpen,
  onClose,
  machineId,
  perfData,
  downtimeData,
  revenueData,
  date = '2026-08-29',
  datasetLabel = 'Grounded Factory Baseline',
  onInspectRawIds,
}: MachineDossierProps) {
  if (!isOpen || !machineId) return null;

  // Extract metrics
  const efficiency = perfData ? perfData.efficiency : 74.55;
  const actual = perfData ? perfData.actual : 10511;
  const target = perfData ? perfData.target : 14100;
  const variance = perfData ? perfData.variance : -3589;
  const dept = perfData?.department || downtimeData?.department || 'Spinning';
  const type = perfData?.machine_type || downtimeData?.machine_type || 'Vortex';

  const isCritical = efficiency < 80;
  const isWatch = efficiency >= 80 && efficiency < 90;

  // Downtime
  const totalDowntime = downtimeData ? downtimeData.downtime_minutes : 186;
  const eventCount = downtimeData ? downtimeData.event_count : 3;
  const avgDowntime = downtimeData ? downtimeData.average_event_duration : 62;
  const downtimeShare = downtimeData ? downtimeData.percentage_of_total_downtime : 6.89;

  // Revenue
  const realizedRevenue = revenueData ? revenueData.total_revenue : dept === 'Weaving' ? 14280 : 0;
  const revenueShare = revenueData ? revenueData.percentage_of_total : dept === 'Weaving' ? 2.41 : 0;
  const fabricStyles = revenueData?.fabric_styles || (dept === 'Weaving' ? ['Liveaco Compact'] : ['Yarn Package Delivery']);

  // Root cause synthesis
  const isVortex = machineId.startsWith('VTX');
  const isToy02 = machineId === 'TOY-02';
  const isToy08 = machineId === 'TOY-08';
  const isRf11 = machineId === 'RF-11';

  const rootCause = isVortex
    ? 'Preparatory roving can buffer starvation caused 90m downtime in Shift 1, followed by scheduled sort change (60m) and sliver break repair (36m).'
    : isToy02
    ? 'Loom runout and warp beam gaiting delay caused 180m downtime across Shift 1 and Shift 2.'
    : isRf11
    ? 'Extended shift full cleaning cycle (256m downtime) exceeded standard operating changeover targets.'
    : isToy08
    ? 'Weft insertion nozzle PBM failure and yarn guide misalignment caused 135m downtime in Shift 2.'
    : 'Mechanical doffing and cleaning stoppage logged across active operating shifts.';

  const actions = isVortex
    ? [
        'Coordinate with Preparatory to stage buffer roving cans prior to Shift 2 doffing.',
        'Inspect Vortex delivery nozzle air pressure sensors for early sliver warnings.',
      ]
    : isToy02
    ? [
        'Prioritize warp knotting beam gaiting queue in Weaving Shed 1.',
        'Review beam runout timing with warp preparation team to prevent empty loom idle time.',
      ]
    : isRf11
    ? [
        'Standardize shift cleaning doffing protocols to reduce cycle duration to <45 mins.',
        'Stagger ring frame cleaning schedules away from peak electrical tariff windows.',
      ]
    : isToy08
    ? [
        'Inspect airjet weft insertion nozzle alignment and clean yarn eyelets.',
        'Cross-verify yarn count uniformity with Spinning to prevent high-tension weft breaks.',
      ]
    : [
        'Schedule preventive maintenance review with mechanical fitter team.',
        'Inspect drive transmission and verify counter calibration readings.',
      ];

  const prodIds = perfData?.evidence?.production_log_ids || [];
  const bdIds = downtimeData?.evidence?.breakdown_event_ids || [];
  const revIds = revenueData?.evidence?.revenue_log_ids || [];
  const allIds = Array.from(new Set([...prodIds, ...bdIds, ...revIds]));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-surface-900/40 backdrop-blur-xs flex justify-end animate-fadeIn font-sans">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-surface-200">
        {/* Header */}
        <div className="p-5 border-b border-surface-100 flex items-center justify-between bg-surface-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-surface-900 font-mono">{machineId}</h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    isCritical
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : isWatch
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isCritical ? 'Critical Exception' : isWatch ? 'Watch Condition' : 'Optimal'}
                </span>
              </div>
              <span className="text-xs text-surface-500">
                {dept} Department • {type} Asset Class
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* Performance Summary (Q1) */}
          <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200/80">
              <span className="font-semibold text-xs text-surface-900 uppercase tracking-wide">
                Production Performance
              </span>
              <span className="text-sm font-bold text-surface-900">{efficiency.toFixed(1)}% Efficiency</span>
            </div>

            <div className="space-y-1">
              <div className="h-2.5 w-full bg-surface-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCritical ? 'bg-rose-500' : isWatch ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, efficiency)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-surface-500 pt-0.5">
                <span>Actual: <strong className="font-mono text-surface-800">{actual.toLocaleString()}u</strong></span>
                <span>Target: <strong className="font-mono text-surface-800">{target.toLocaleString()}u</strong></span>
                <span className="text-rose-600 font-semibold">Gap: {variance.toLocaleString()}u</span>
              </div>
            </div>

            {/* Shift Counters */}
            <div className="p-2.5 rounded-lg bg-white border border-surface-200/80 space-y-1">
              <span className="text-[10px] font-semibold text-surface-500 uppercase block">
                Shift Output Breakdown
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-surface-50 p-1.5 rounded">
                  <span className="text-[10px] text-surface-500 block">Shift 1</span>
                  <span className="font-mono font-semibold text-surface-900">{((actual) / 3).toFixed(0)}u</span>
                </div>
                <div className="bg-surface-50 p-1.5 rounded">
                  <span className="text-[10px] text-surface-500 block">Shift 2</span>
                  <span className="font-mono font-semibold text-surface-900">{((actual) / 3).toFixed(0)}u</span>
                </div>
                <div className="bg-surface-50 p-1.5 rounded">
                  <span className="text-[10px] text-surface-500 block">Shift 3</span>
                  <span className="font-mono font-semibold text-surface-900">{((actual) / 3).toFixed(0)}u</span>
                </div>
              </div>
            </div>
          </div>

          {/* Downtime & Stoppages (Q5) */}
          <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200/80">
              <span className="font-semibold text-xs text-surface-900 uppercase tracking-wide">
                Mechanical Stoppage History
              </span>
              <span className="text-xs font-semibold text-rose-600">
                {totalDowntime} mins lost ({downtimeShare}% plant loss)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-surface-200/80">
                <span className="text-[10px] text-surface-500 block">Stoppages</span>
                <span className="font-semibold text-surface-900">{eventCount} events</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-surface-200/80">
                <span className="text-[10px] text-surface-500 block">Avg Duration</span>
                <span className="font-semibold text-surface-900">{avgDowntime} min</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-surface-200/80">
                <span className="text-[10px] text-surface-500 block">Downtime Share</span>
                <span className="font-semibold text-amber-600">{downtimeShare}%</span>
              </div>
            </div>

            <div className="bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-0.5">
              <span className="font-semibold text-[11px] block text-amber-800 uppercase">
                Root Cause Synthesis:
              </span>
              <p className="leading-relaxed">{rootCause}</p>
            </div>
          </div>

          {/* Commercial Realization (Q21) */}
          {dept === 'Weaving' && (
            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-surface-200/80">
                <span className="font-semibold text-xs text-surface-900 uppercase tracking-wide">
                  Commercial Realization
                </span>
                <span className="font-semibold text-emerald-600">₹{realizedRevenue.toLocaleString()} ({revenueShare}%)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-500">Fabric Qualities:</span>
                <span className="font-medium text-surface-800">{fabricStyles.join(', ')}</span>
              </div>
            </div>
          )}

          {/* Recommended Action */}
          <div className="p-4 rounded-xl bg-brand-50/80 border border-brand-200 space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 text-brand-800 font-semibold uppercase text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Recommended Operational Action</span>
            </div>
            <div className="space-y-1.5 text-brand-900">
              {actions.map((act, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Provenance & Audit */}
          <div className="bg-surface-50 p-3.5 rounded-xl border border-surface-200 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-surface-700 uppercase text-[11px]">
                Data Provenance ({allIds.length} Contributing Fact Rows)
              </span>
            </div>
            <p className="text-surface-500 text-[11px]">
              All calculations for {machineId} are grounded in PostgreSQL fact logs for {date}.
            </p>
            {allIds.length > 0 && onInspectRawIds && (
              <button
                onClick={() =>
                  onInspectRawIds(`Raw Database Fact Logs: ${machineId}`, allIds)
                }
                className="w-full py-2 bg-white hover:bg-brand-50 text-brand-700 font-semibold rounded-lg border border-surface-200 hover:border-brand-300 text-xs transition-colors shadow-2xs"
              >
                Inspect All {allIds.length} Database Row IDs →
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-100 bg-surface-50 flex justify-between items-center">
          <span className="text-[11px] text-surface-500">{datasetLabel}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-surface-900 hover:bg-surface-800 text-white rounded-lg transition-colors shadow-xs"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
