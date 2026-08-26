'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ProductionVarianceData, StandardApiResponse } from '@/lib/types';
import { ProvenanceBanner } from '@/components/ProvenanceBanner';
import { DateSelector } from '@/components/DateSelector';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Factory, Filter, Layers, Database, AlertTriangle } from 'lucide-react';

export default function ProductionPage() {
  const [currentDate, setCurrentDate] = useState<string>('2026-08-29');
  const [department, setDepartment] = useState<string>('');
  const [machineType, setMachineType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<StandardApiResponse<ProductionVarianceData> | null>(null);

  const [evidenceModal, setEvidenceModal] = useState<{
    isOpen: boolean;
    title: string;
    ids: number[];
  }>({
    isOpen: false,
    title: '',
    ids: [],
  });

  const fetchData = async (date: string, dept: string, mType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getProductionVariance({
        date,
        department: dept || undefined,
        machine_type: mType || undefined,
      });
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch production variance data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentDate, department, machineType);
  }, [currentDate, department, machineType]);

  const summary = response?.data?.summary;
  const machines = response?.data?.machine_performance || [];
  const shifts = response?.data?.shift_performance || [];
  const prevComp = response?.data?.previous_day_comparison;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'ACCEPTABLE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'UNDERPERFORMING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <ProvenanceBanner
        isDemo={response?.data_quality?.is_demo}
        datasetLabel={response?.data_quality?.dataset_label}
        recordsAnalyzed={response?.data_quality?.records_analyzed}
        lastUpdated={response?.metadata?.generated_at}
      />

      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Factory className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Production vs Target Analysis (Q1)
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Deterministic variance tracking, shift distribution & machine efficiency rankings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none"
            >
              <option value="">All Departments</option>
              <option value="Weaving">Weaving</option>
              <option value="Spinning">Spinning</option>
            </select>
          </div>

          <DateSelector
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            isLoading={isLoading}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Calculating deterministic production variance..." />
      ) : error ? (
        <ErrorState error={error} onRetry={() => fetchData(currentDate, department, machineType)} />
      ) : !response?.data?.has_data || !summary ? (
        <EmptyState
          date={currentDate}
          onResetDate={() => setCurrentDate('2026-08-29')}
        />
      ) : (
        <>
          {/* Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Actual Output
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {summary.total_actual.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Target: {summary.total_target.toLocaleString()}
              </span>
            </div>

            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Variance to Target
              </span>
              <span
                className={`text-2xl font-extrabold ${
                  summary.variance_qty >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {summary.variance_qty > 0 ? '+' : ''}
                {summary.variance_qty.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {summary.variance_pct > 0 ? '+' : ''}
                {summary.variance_pct}% deviation
              </span>
            </div>

            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Plant Efficiency
              </span>
              <span
                className={`text-2xl font-extrabold ${
                  summary.average_efficiency >= 95
                    ? 'text-emerald-600'
                    : summary.average_efficiency >= 90
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {summary.average_efficiency}%
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {summary.average_efficiency >= 95
                  ? 'Optimal'
                  : summary.average_efficiency >= 90
                  ? 'Acceptable'
                  : 'Underperforming'}
              </span>
            </div>

            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Previous Day Change
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {summary.change_vs_previous_day_pct !== null
                  ? `${summary.change_vs_previous_day_pct > 0 ? '+' : ''}${
                      summary.change_vs_previous_day_pct
                    }%`
                  : 'N/A'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Prev: {summary.previous_day_actual.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Shift Comparison */}
          {shifts.length > 0 && (
            <div className="card-industrial">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Shift-wise Performance Breakdown
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">3 shifts standard</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {shifts.map((s) => (
                  <div
                    key={s.shift}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-slate-800">
                        Shift {s.shift}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded border ${
                          s.efficiency >= 95
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : s.efficiency >= 90
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {s.efficiency}%
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Actual:</span>
                        <span className="font-semibold text-slate-800">
                          {s.actual.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target:</span>
                        <span>{s.target.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Variance:</span>
                        <span
                          className={`font-semibold ${
                            s.variance >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {s.variance > 0 ? '+' : ''}
                          {s.variance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Machine Performance Table */}
          <div className="card-industrial p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Machine Performance Drilldown ({machines.length} Machines)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Sorted by efficiency ascending (underperformers first).
                </p>
              </div>
              <button
                onClick={() =>
                  setEvidenceModal({
                    isOpen: true,
                    title: `All Production Records for ${currentDate}`,
                    ids: response.data.evidence.production_log_ids,
                  })
                }
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Audit All ({response.data.evidence.production_log_ids.length} rows)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-industrial">
                <thead>
                  <tr>
                    <th>Machine</th>
                    <th>Dept & Type</th>
                    <th>Status</th>
                    <th className="text-right">Target</th>
                    <th className="text-right">Actual</th>
                    <th className="text-right">Variance</th>
                    <th className="text-right">Efficiency</th>
                    <th className="text-center">Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((m) => (
                    <tr key={m.machine_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-bold text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <span>{m.machine_id}</span>
                          {m.granularity === 'synthetic_loom_number' && (
                            <span
                              className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded border border-slate-200"
                              title="Synthetic Loom Number"
                            >
                              synth
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-slate-600 text-xs">
                        {m.department} • {m.machine_type}
                      </td>
                      <td>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                            m.performance_status
                          )}`}
                        >
                          {m.performance_status}
                        </span>
                      </td>
                      <td className="text-right text-slate-600">{m.target.toLocaleString()}</td>
                      <td className="text-right font-semibold text-slate-900">
                        {m.actual.toLocaleString()}
                      </td>
                      <td
                        className={`text-right font-semibold ${
                          m.variance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {m.variance > 0 ? '+' : ''}
                        {m.variance.toLocaleString()}
                      </td>
                      <td className="text-right font-bold text-slate-900">{m.efficiency}%</td>
                      <td className="text-center">
                        <button
                          onClick={() =>
                            setEvidenceModal({
                              isOpen: true,
                              title: `Record Audit: ${m.machine_id}`,
                              ids: m.evidence.production_log_ids,
                            })
                          }
                          className="text-[11px] text-blue-600 hover:text-blue-800 underline"
                        >
                          {m.evidence.production_log_ids.length} rows
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Evidence Drawer */}
      <EvidenceDrawer
        isOpen={evidenceModal.isOpen}
        onClose={() => setEvidenceModal({ isOpen: false, title: '', ids: [] })}
        title={evidenceModal.title}
        evidenceIds={evidenceModal.ids}
        provenanceLabel={response?.data_quality?.dataset_label}
        sourceType="synthetic"
      />
    </div>
  );
}
