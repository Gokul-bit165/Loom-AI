'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RevenueSummaryData, StandardApiResponse } from '@/lib/types';
import { HeaderNav } from '@/components/common/HeaderNav';
import { CommercialPerformanceView } from '@/components/executive/CommercialPerformanceView';
import { MachineDossier } from '@/components/investigation/MachineDossier';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { SentinelSkeleton } from '@/components/states/SentinelSkeleton';
import { EmptyDayState } from '@/components/states/EmptyDayState';
import { SystemErrorState } from '@/components/states/SystemErrorState';
import {
  IndianRupee,
  LayoutGrid,
  Table as TableIcon,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export default function CommercialYieldInvestigationWorkspace() {
  const [currentDate, setCurrentDate] = useState<string>('2026-08-29');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<StandardApiResponse<RevenueSummaryData> | null>(null);

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

  const fetchData = async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getRevenueSummary({ date });
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch commercial revenue data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentDate);
  }, [currentDate]);

  const revData = response?.data;
  const summary = revData?.summary;
  const machines = revData?.machine_ranking || [];
  const styles = revData?.fabric_style_ranking || [];
  const hasData = revData?.has_data && summary;

  const isDemo = response?.data_quality?.is_demo ?? true;
  const datasetLabel = response?.data_quality?.dataset_label ?? 'Grounded Factory Baseline';

  const filteredMachines = selectedStyle
    ? machines.filter((m) => m.fabric_styles.includes(selectedStyle))
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
        {/* Workspace Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
              <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-surface-900 tracking-tight">
                Commercial Realization & Fabric Style Yield
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-surface-500 font-normal mt-0.5">
              Realized turnover run-rate, fabric sort contribution, and loom yield distribution
            </p>
          </div>
        </div>

        {isLoading ? (
          <SentinelSkeleton />
        ) : error ? (
          <SystemErrorState error={error} onRetry={() => fetchData(currentDate)} />
        ) : !hasData ? (
          <EmptyDayState
            date={currentDate}
            onJumpToActiveDate={() => setCurrentDate('2026-08-29')}
          />
        ) : (
          <>
            {/* Commercial Performance View (Turnover + Style Breakdown) */}
            <CommercialPerformanceView data={revData} />

            {/* Fabric Sort Filter Spectrum */}
            <div className="panel-saas space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-surface-100">
                <span className="font-semibold text-xs xl:text-sm text-surface-900 uppercase tracking-wide">
                  Filter Loom Allocation by Fabric Quality
                </span>
                {selectedStyle && (
                  <button
                    onClick={() => setSelectedStyle(null)}
                    className="text-xs text-brand-600 hover:text-brand-700 underline font-medium"
                  >
                    Clear Filter: {selectedStyle} ✕
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {styles.map((s) => {
                  const isSelected = selectedStyle === s.fabric_style;
                  return (
                    <button
                      key={s.fabric_style}
                      onClick={() => setSelectedStyle(isSelected ? null : s.fabric_style)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-brand-50 border-brand-300 shadow-sm ring-1 ring-brand-400'
                          : 'bg-surface-50 border-surface-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs sm:text-sm text-surface-900">{s.fabric_style}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {s.percentage_of_total}% Share
                        </span>
                      </div>
                      <div className="text-xs text-surface-500 mt-1.5 font-normal">
                        ₹{(s.total_revenue / 100000).toFixed(1)}L across {s.machine_count} looms
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loom Yield Grid (up to 5 columns on 2xl) */}
            <div className="panel-saas space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-100">
                <div>
                  <h3 className="font-semibold text-sm xl:text-base text-surface-900 uppercase tracking-wide">
                    Loom Commercial Yield ({filteredMachines.length} Looms)
                  </h3>
                  <p className="text-xs text-surface-500 font-normal">
                    Turnover realized per loom from woven yardage
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                  {filteredMachines.map((m, idx) => (
                    <div
                      key={m.machine_id}
                      className="p-4 rounded-xl border border-surface-200 bg-surface-50/50 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="font-mono font-bold text-sm text-surface-900">{m.machine_id}</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {m.percentage_of_total}%
                          </span>
                        </div>
                        <span className="text-xs text-surface-500 block truncate mt-1">
                          {m.fabric_styles.join(', ')}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-surface-100 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-[10px] text-surface-400 block font-normal">Realized:</span>
                          <span className="font-bold text-surface-900 font-sans text-sm">₹{m.total_revenue.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => setSelectedMachineId(m.machine_id)}
                          className="font-semibold text-brand-600 hover:text-brand-700 text-xs flex items-center space-x-0.5"
                        >
                          <span>Dossier</span>
                          <ArrowRight className="w-3 h-3" />
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
                        <th className="p-3">Loom</th>
                        <th className="p-3">Woven Fabric Qualities</th>
                        <th className="p-3 text-right">Realized Turnover</th>
                        <th className="p-3 text-right">% Contribution</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {filteredMachines.map((m, idx) => (
                        <tr key={m.machine_id} className="hover:bg-surface-50">
                          <td className="p-3 text-surface-400 font-semibold">#{idx + 1}</td>
                          <td className="p-3 font-mono font-bold text-surface-900">{m.machine_id}</td>
                          <td className="p-3 text-surface-500">{m.fabric_styles.join(', ')}</td>
                          <td className="p-3 text-right font-mono font-semibold text-surface-900">₹{m.total_revenue.toLocaleString()}</td>
                          <td className="p-3 text-right font-semibold text-emerald-600">{m.percentage_of_total}%</td>
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
