'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ProductionVarianceData, StandardApiResponse } from '@/lib/types';
import { HeaderNav } from '@/components/common/HeaderNav';
import { ProductionTrendChart } from '@/components/executive/ProductionTrendChart';
import { MachineDossier } from '@/components/investigation/MachineDossier';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { SentinelSkeleton } from '@/components/states/SentinelSkeleton';
import { EmptyDayState } from '@/components/states/EmptyDayState';
import { SystemErrorState } from '@/components/states/SystemErrorState';
import {
  Factory,
  Filter,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function ProductionInvestigationWorkspace() {
  const [currentDate, setCurrentDate] = useState<string>('2026-08-29');
  const [department, setDepartment] = useState<string>('');
  const [filterBucket, setFilterBucket] = useState<'ALL' | 'CRITICAL' | 'WATCH' | 'OPTIMAL'>('ALL');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<StandardApiResponse<ProductionVarianceData> | null>(null);

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

  const fetchData = async (date: string, dept: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getProductionVariance({
        date,
        department: dept || undefined,
      });
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch production analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentDate, department);
  }, [currentDate, department]);

  const summary = response?.data?.summary;
  const machines = response?.data?.machine_performance || [];
  const shifts = response?.data?.shift_performance || [];
  const hasData = response?.data?.has_data && summary;

  const isDemo = response?.data_quality?.is_demo ?? true;
  const datasetLabel = response?.data_quality?.dataset_label ?? 'Grounded Factory Baseline';

  const selectedPerf = machines.find((m) => m.machine_id === selectedMachineId);

  const criticalList = machines.filter((m) => m.efficiency < 80);
  const watchList = machines.filter((m) => m.efficiency >= 80 && m.efficiency < 90);
  const optimalList = machines.filter((m) => m.efficiency >= 95);

  const displayedMachines =
    filterBucket === 'CRITICAL'
      ? criticalList
      : filterBucket === 'WATCH'
      ? watchList
      : filterBucket === 'OPTIMAL'
      ? optimalList
      : machines;

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
      <HeaderNav
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        isDemo={isDemo}
        datasetLabel={datasetLabel}
        recordsAnalyzed={response?.data_quality?.records_analyzed}
      />

      <main className="max-w-7xl 2xl:max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 space-y-6 flex-1">
        {/* Workspace Title + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Factory className="w-5 h-5 text-brand-600" />
              <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-surface-900 tracking-tight">
                Production Performance & Capacity Analysis
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-surface-500 font-normal mt-0.5">
              Actual output vs target commitment, gap concentration, and shift performance
            </p>
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

        {isLoading ? (
          <SentinelSkeleton />
        ) : error ? (
          <SystemErrorState error={error} onRetry={() => fetchData(currentDate, department)} />
        ) : !hasData ? (
          <EmptyDayState
            date={currentDate}
            onJumpToActiveDate={() => setCurrentDate('2026-08-29')}
          />
        ) : (
          <>
            {/* Macro Production Visualizer */}
            <div className="panel-saas space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-100">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-brand-600" />
                  <h3 className="font-semibold text-sm xl:text-base text-surface-900 uppercase tracking-wide">
                    Plant Capacity Fulfillment
                  </h3>
                </div>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Deficit: -{Math.abs(summary.variance_qty).toLocaleString()} units (-6.50%)
                </span>
              </div>

              {/* Progress visualizer */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="text-surface-500 font-medium">ACTUAL DELIVERED OUTPUT:</span>
                    <div className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-surface-900 font-sans mt-0.5">
                      {summary.total_actual.toLocaleString()} units
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-surface-500 font-medium">PLANNED COMMITMENT:</span>
                    <div className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-surface-700 font-sans mt-0.5">
                      {summary.total_target.toLocaleString()} units
                    </div>
                  </div>
                </div>

                <div className="h-4 w-full bg-surface-100 rounded-full overflow-hidden p-0.5 relative flex items-center">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${Math.min(100, summary.average_efficiency)}%` }}
                  />
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-surface-400" title="100% Target" />
                </div>

                <div className="flex justify-between text-xs text-surface-500 pt-1 font-medium">
                  <span>0 units (0%)</span>
                  <span>Plant Efficiency: <strong className="text-brand-600 font-bold">{summary.average_efficiency.toFixed(1)}%</strong></span>
                  <span>Target (100%)</span>
                </div>
              </div>
            </div>

            {/* 14-Day Trajectory */}
            <ProductionTrendChart />

            {/* Machine Performance Grid */}
            <div className="panel-saas space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-100">
                <div>
                  <h3 className="font-semibold text-sm xl:text-base text-surface-900 uppercase tracking-wide">
                    Machine Fleet Spectrum ({displayedMachines.length} of {machines.length} Units)
                  </h3>
                  <p className="text-xs text-surface-500 font-normal">
                    Filter by performance status or toggle between card dossier and audit table
                  </p>
                </div>

                {/* Filter & View Mode */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-surface-100 rounded-lg p-0.5 text-xs font-medium">
                    <button
                      onClick={() => setFilterBucket('ALL')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        filterBucket === 'ALL' ? 'bg-white text-surface-900 font-semibold shadow-xs' : 'text-surface-600 hover:text-surface-900'
                      }`}
                    >
                      All ({machines.length})
                    </button>
                    <button
                      onClick={() => setFilterBucket('CRITICAL')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        filterBucket === 'CRITICAL' ? 'bg-white text-rose-700 font-semibold shadow-xs' : 'text-rose-600'
                      }`}
                    >
                      Critical ({criticalList.length})
                    </button>
                    <button
                      onClick={() => setFilterBucket('WATCH')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        filterBucket === 'WATCH' ? 'bg-white text-amber-700 font-semibold shadow-xs' : 'text-amber-600'
                      }`}
                    >
                      Watch ({watchList.length})
                    </button>
                    <button
                      onClick={() => setFilterBucket('OPTIMAL')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        filterBucket === 'OPTIMAL' ? 'bg-white text-emerald-700 font-semibold shadow-xs' : 'text-emerald-600'
                      }`}
                    >
                      Optimal ({optimalList.length})
                    </button>
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
              </div>

              {/* Responsive Cards Grid View (up to 5 columns on 2xl) */}
              {viewMode === 'CARDS' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                  {displayedMachines.map((m) => {
                    const isCrit = m.efficiency < 80;
                    const isW = m.efficiency >= 80 && m.efficiency < 90;
                    const gap = Math.abs(m.variance);

                    return (
                      <div
                        key={m.machine_id}
                        className="p-4 rounded-xl border border-surface-200 bg-surface-50/50 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-mono font-bold text-sm text-surface-900">{m.machine_id}</span>
                              <span className="text-xs text-surface-500 block">({m.machine_type} • {m.department})</span>
                            </div>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isCrit
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : isW
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {m.efficiency.toFixed(1)}% Eff
                            </span>
                          </div>

                          <div className="space-y-1 mt-2">
                            <div className="h-1.5 w-full bg-surface-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isCrit ? 'bg-rose-500' : isW ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, m.efficiency)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] text-surface-500 pt-0.5">
                              <span>Output: <strong className="font-mono text-surface-800">{m.actual.toLocaleString()}u</strong></span>
                              <span className={m.variance < 0 ? 'text-rose-600 font-medium' : 'text-emerald-600'}>
                                {m.variance < 0 ? '-' : '+'}{gap.toLocaleString()}u
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-surface-100 flex justify-between items-center text-xs">
                          <span className="text-[11px] text-surface-400">Target: {m.target.toLocaleString()}u</span>
                          <button
                            onClick={() => setSelectedMachineId(m.machine_id)}
                            className="font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-0.5 text-xs"
                          >
                            <span>Dossier</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Secondary Table View */
                <div className="overflow-x-auto rounded-lg border border-surface-200">
                  <table className="w-full text-xs text-left text-surface-700">
                    <thead className="bg-surface-50 text-surface-500 font-semibold uppercase text-[10px] border-b border-surface-200">
                      <tr>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Department & Type</th>
                        <th className="p-3 text-right">Target</th>
                        <th className="p-3 text-right">Actual</th>
                        <th className="p-3 text-right">Deficit</th>
                        <th className="p-3 text-right">Efficiency</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {displayedMachines.map((m) => (
                        <tr key={m.machine_id} className="hover:bg-surface-50">
                          <td className="p-3 font-mono font-bold text-surface-900">{m.machine_id}</td>
                          <td className="p-3 text-surface-500">{m.department} • {m.machine_type}</td>
                          <td className="p-3 text-right font-mono text-surface-500">{m.target.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono font-semibold text-surface-900">{m.actual.toLocaleString()}</td>
                          <td className={`p-3 text-right font-mono font-semibold ${m.variance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {m.variance < 0 ? '' : '+'}{m.variance.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-bold text-surface-900">{m.efficiency.toFixed(1)}%</td>
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
        perfData={selectedPerf}
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
