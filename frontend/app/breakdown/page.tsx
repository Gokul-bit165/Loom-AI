'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BreakdownRankingData, StandardApiResponse } from '@/lib/types';
import { HeaderNav } from '@/components/common/HeaderNav';
import { DowntimeLossMap } from '@/components/executive/DowntimeLossMap';
import { MachineDossier } from '@/components/investigation/MachineDossier';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { SentinelSkeleton } from '@/components/states/SentinelSkeleton';
import { EmptyDayState } from '@/components/states/EmptyDayState';
import { SystemErrorState } from '@/components/states/SystemErrorState';
import {
  Clock,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  ArrowRight,
  Wrench,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

export default function DowntimeInvestigationWorkspace() {
  const [currentDate, setCurrentDate] = useState<string>('2026-08-29');
  const [period, setPeriod] = useState<'today' | 'month'>('today');
  const [department, setDepartment] = useState<string>('');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<StandardApiResponse<BreakdownRankingData> | null>(null);

  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [evidenceModal, setEvidenceModal] = useState<{
    isOpen: boolean;
    title: string;
    ids: number[];
  }>({
    isOpen: false,
    title: '',
    ids: [],
  });

  const fetchData = async (date: string, per: 'today' | 'month', dept: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getBreakdownRanking({
        date,
        period: per,
        department: dept || undefined,
      });
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch breakdown analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentDate, period, department);
  }, [currentDate, period, department]);

  const bdData = response?.data;
  const machines = bdData?.machine_ranking || [];
  const reasons = bdData?.reason_ranking || [];
  const hasData = bdData?.has_data;

  const isDemo = response?.data_quality?.is_demo ?? true;
  const datasetLabel = response?.data_quality?.dataset_label ?? 'Grounded Factory Baseline';

  const selectedDowntime = machines.find((m) => m.machine_id === selectedMachineId);

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
      <HeaderNav
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        isDemo={isDemo}
        datasetLabel={datasetLabel}
        recordsAnalyzed={response?.data_quality?.records_analyzed}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
        {/* Workspace Title + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-surface-900 tracking-tight">
                Mechanical Downtime & Stoppage Analysis
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-surface-500 font-normal mt-0.5">
              Root failure modes, stoppage duration Pareto, and chronic machine downtime dossiers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Period Toggle */}
            <div className="flex bg-surface-100 rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => setPeriod('today')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  period === 'today' ? 'bg-white text-surface-900 font-semibold shadow-xs' : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                Today's Stoppages
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  period === 'month' ? 'bg-white text-surface-900 font-semibold shadow-xs' : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                Month-to-Date (MTD)
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-white border border-surface-200 rounded-lg px-3 py-1.5 shadow-xs text-xs">
              <Filter className="w-4 h-4 text-surface-400" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-transparent text-surface-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="">All Departments</option>
                <option value="Weaving">Weaving Department</option>
                <option value="Spinning">Spinning Department</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <SentinelSkeleton />
        ) : error ? (
          <SystemErrorState error={error} onRetry={() => fetchData(currentDate, period, department)} />
        ) : !hasData ? (
          <EmptyDayState
            date={currentDate}
            onJumpToActiveDate={() => setCurrentDate('2026-08-29')}
          />
        ) : (
          <>
            {/* Downtime Hero Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="panel-saas space-y-1">
                <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide block">
                  Total Lost Operating Time
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-rose-600 font-sans">
                  {bdData.total_downtime_minutes.toLocaleString()}m
                </div>
                <span className="text-xs text-surface-500 font-normal block">
                  {(bdData.total_downtime_minutes / 60).toFixed(1)} machine hours lost
                </span>
              </div>

              <div className="panel-saas space-y-1">
                <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide block">
                  Recorded Stoppage Events
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-surface-900 font-sans">
                  {bdData.total_events} events
                </div>
                <span className="text-xs text-surface-500 font-normal block">
                  Avg Duration: {bdData.total_events > 0 ? (bdData.total_downtime_minutes / bdData.total_events).toFixed(1) : 0} min
                </span>
              </div>

              <div className="panel-saas space-y-1">
                <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide block">
                  Dominant Stoppage Cause
                </span>
                <div className="text-lg font-bold text-surface-900 font-sans truncate">
                  {reasons[0]?.reason || 'N/A'}
                </div>
                <span className="text-xs text-amber-600 font-semibold block">
                  {reasons[0]?.percentage_of_total_downtime.toFixed(1)}% of all lost time
                </span>
              </div>

              <div className="panel-saas space-y-1">
                <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide block">
                  Worst Machine Stoppage
                </span>
                <div className="text-lg font-bold text-rose-600 font-mono truncate">
                  {bdData.highest_downtime_machine?.machine_id || 'None'}
                </div>
                <span className="text-xs text-surface-500 font-normal block">
                  {bdData.highest_downtime_machine?.downtime_minutes} mins ({bdData.highest_downtime_machine?.event_count} events)
                </span>
              </div>
            </div>

            {/* Downtime Loss Map (Pareto + Concentration) */}
            <DowntimeLossMap
              reasons={reasons}
              machines={machines}
              totalDowntimeMinutes={bdData.total_downtime_minutes}
            />

            {/* Machine Dossier Grid */}
            <div className="panel-saas space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-100">
                <div>
                  <h3 className="font-semibold text-sm text-surface-900 uppercase tracking-wide">
                    Chronic Machine Stoppage Dossiers ({machines.length} Units Affected)
                  </h3>
                  <p className="text-xs text-surface-500 font-normal">
                    Ranked by total lost minutes. Select any unit to open full root-cause investigation
                  </p>
                </div>

                <div className="flex bg-surface-100 rounded-lg p-0.5 text-surface-600">
                  <button
                    onClick={() => setViewMode('CARDS')}
                    className={`p-1.5 rounded-md ${viewMode === 'CARDS' ? 'bg-white text-surface-900 shadow-xs' : ''}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('TABLE')}
                    className={`p-1.5 rounded-md ${viewMode === 'TABLE' ? 'bg-white text-surface-900 shadow-xs' : ''}`}
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {viewMode === 'CARDS' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {machines.map((m, idx) => (
                    <div
                      key={m.machine_id}
                      className="p-4 rounded-xl border border-surface-200 bg-surface-50/50 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-surface-200 text-surface-700 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="font-mono font-bold text-sm text-surface-900">{m.machine_id}</span>
                              <span className="text-xs text-surface-500 block">({m.machine_type} • {m.department})</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-mono">
                            {m.downtime_minutes}m lost
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border border-surface-200/80 text-center text-xs mt-3">
                          <div>
                            <span className="text-[10px] text-surface-500 block">Events</span>
                            <span className="font-semibold text-surface-900">{m.event_count}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-surface-500 block">Avg Min</span>
                            <span className="font-semibold text-surface-900">{m.average_event_duration}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-surface-500 block">Share</span>
                            <span className="font-semibold text-amber-600">{m.percentage_of_total_downtime}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-surface-100 flex justify-between items-center text-xs">
                        <span className="text-[11px] text-surface-400">{m.evidence.breakdown_event_ids.length} logged events</span>
                        <button
                          onClick={() => setSelectedMachineId(m.machine_id)}
                          className="font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-0.5 text-xs"
                        >
                          <span>Dossier</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-surface-200">
                  <table className="w-full text-xs text-left text-surface-700">
                    <thead className="bg-surface-50 text-surface-500 font-semibold uppercase text-[10px] border-b border-surface-200">
                      <tr>
                        <th className="p-3">Rank</th>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Department & Type</th>
                        <th className="p-3 text-right">Events</th>
                        <th className="p-3 text-right">Lost Time</th>
                        <th className="p-3 text-right">Avg Duration</th>
                        <th className="p-3 text-right">% Plant Loss</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {machines.map((m, idx) => (
                        <tr key={m.machine_id} className="hover:bg-surface-50">
                          <td className="p-3 text-surface-400 font-semibold">#{idx + 1}</td>
                          <td className="p-3 font-mono font-bold text-surface-900">{m.machine_id}</td>
                          <td className="p-3 text-surface-500">{m.department} • {m.machine_type}</td>
                          <td className="p-3 text-right text-surface-800">{m.event_count}</td>
                          <td className="p-3 text-right font-mono font-bold text-rose-600">{m.downtime_minutes}m</td>
                          <td className="p-3 text-right text-surface-500">{m.average_event_duration}m</td>
                          <td className="p-3 text-right font-semibold text-amber-600">{m.percentage_of_total_downtime}%</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setSelectedMachineId(m.machine_id)}
                              className="text-brand-600 hover:text-brand-700 font-semibold text-xs"
                            >
                              Inspect →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Slide-Over Machine Intelligence Profile */}
      <MachineDossier
        isOpen={Boolean(selectedMachineId)}
        onClose={() => setSelectedMachineId(null)}
        machineId={selectedMachineId}
        downtimeData={selectedDowntime}
        date={currentDate}
        datasetLabel={datasetLabel}
        onInspectRawIds={(title, ids) =>
          setEvidenceModal({
            isOpen: true,
            title,
            ids,
          })
        }
      />

      {/* Slide-Over Evidence Drawer */}
      <EvidenceDrawer
        isOpen={evidenceModal.isOpen}
        onClose={() => setEvidenceModal({ isOpen: false, title: '', ids: [] })}
        title={evidenceModal.title}
        evidenceIds={evidenceModal.ids}
        provenanceLabel={datasetLabel}
        sourceType="synthetic"
      />
    </div>
  );
}
