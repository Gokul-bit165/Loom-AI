'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BreakdownRankingData, StandardApiResponse } from '@/lib/types';
import { ProvenanceBanner } from '@/components/ProvenanceBanner';
import { DateSelector } from '@/components/DateSelector';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Wrench, Calendar, Database, AlertOctagon, Clock, Activity } from 'lucide-react';

export default function BreakdownPage() {
  const [currentDate, setCurrentDate] = useState<string>('2026-08-29');
  const [period, setPeriod] = useState<'today' | 'month'>('today');
  const [department, setDepartment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<StandardApiResponse<BreakdownRankingData> | null>(null);

  const [evidenceModal, setEvidenceModal] = useState<{
    isOpen: boolean;
    title: string;
    ids: number[];
    extraDetails?: Record<string, any>;
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
      setError(err.message || 'Failed to fetch breakdown rankings');
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
            <Wrench className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Breakdown & Downtime Ranking (Q5)
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Downtime Pareto, stoppage reason distribution, and machine repair duration rankings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Toggle */}
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm text-xs font-semibold">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1 rounded-md transition-colors ${
                period === 'today'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today's View
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1 rounded-md transition-colors ${
                period === 'month'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month-to-Date (MTD)
            </button>
          </div>

          <DateSelector
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            isLoading={isLoading}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Ranking machine downtime & failure reasons..." />
      ) : error ? (
        <ErrorState error={error} onRetry={() => fetchData(currentDate, period, department)} />
      ) : !bdData?.has_data ? (
        <EmptyState
          date={currentDate}
          message="No breakdown events logged for this date/period."
          onResetDate={() => setCurrentDate('2026-08-29')}
        />
      ) : (
        <>
          {/* Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Downtime
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {bdData.total_downtime_minutes.toLocaleString()} min
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {(bdData.total_downtime_minutes / 60).toFixed(1)} total lost machine hours
              </span>
            </div>

            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Breakdown Events
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {bdData.total_events}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Avg duration:{' '}
                {bdData.total_events > 0
                  ? `${(bdData.total_downtime_minutes / bdData.total_events).toFixed(1)} min`
                  : '0 min'}
              </span>
            </div>

            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Highest Downtime Loom
              </span>
              <span className="text-xl font-extrabold text-rose-700 truncate block">
                {bdData.highest_downtime_machine
                  ? bdData.highest_downtime_machine.machine_id
                  : 'None'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {bdData.highest_downtime_machine
                  ? `${bdData.highest_downtime_machine.downtime_minutes} min (${bdData.highest_downtime_machine.event_count} events)`
                  : 'N/A'}
              </span>
            </div>

            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Analysis Period
              </span>
              <span className="text-sm font-bold text-slate-900 uppercase block">
                {bdData.period_info.period}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                {bdData.period_info.start_date} → {bdData.period_info.end_date}
              </span>
            </div>
          </div>

          {/* Downtime Reason Pareto */}
          <div className="card-industrial">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Downtime Distribution by Stoppage Reason ({reasons.length} Identified Reasons)
            </h2>
            <div className="space-y-2.5">
              {reasons.map((r) => (
                <div key={r.reason} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 font-semibold">{r.reason}</span>
                    <span className="text-slate-600">
                      {r.total_downtime_minutes} min ({r.event_count} events •{' '}
                      {r.percentage_of_total_downtime}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, r.percentage_of_total_downtime)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Machine Downtime Ranking Table with Drilldown */}
          <div className="card-industrial p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Machine Downtime Ranking ({machines.length} Machines Affected)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Sorted by total downtime minutes descending.
                </p>
              </div>
              <button
                onClick={() =>
                  setEvidenceModal({
                    isOpen: true,
                    title: `All Breakdown Events for ${currentDate}`,
                    ids: bdData.evidence.breakdown_event_ids,
                  })
                }
                className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center space-x-1"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Audit All ({bdData.evidence.breakdown_event_ids.length} events)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-industrial">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Machine</th>
                    <th>Dept & Type</th>
                    <th className="text-right">Events</th>
                    <th className="text-right">Total Downtime</th>
                    <th className="text-right">Avg Duration</th>
                    <th className="text-right">% of Plant Loss</th>
                    <th className="text-center">Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((m, idx) => (
                    <tr key={m.machine_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-mono text-slate-500 text-xs font-bold">#{idx + 1}</td>
                      <td className="font-bold text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <span>{m.machine_id}</span>
                          {m.granularity === 'synthetic_loom_number' && (
                            <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded border border-slate-200">
                              synth
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-slate-600 text-xs">
                        {m.department} • {m.machine_type}
                      </td>
                      <td className="text-right font-medium text-slate-800">{m.event_count}</td>
                      <td className="text-right font-bold text-rose-700">
                        {m.downtime_minutes} min
                      </td>
                      <td className="text-right text-slate-600">{m.average_event_duration} min</td>
                      <td className="text-right font-semibold text-slate-900">
                        {m.percentage_of_total_downtime}%
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() =>
                            setEvidenceModal({
                              isOpen: true,
                              title: `Breakdown Event Audit: ${m.machine_id}`,
                              ids: m.evidence.breakdown_event_ids,
                              extraDetails: {
                                total_downtime: `${m.downtime_minutes} min`,
                                event_count: m.event_count,
                                average_duration: `${m.average_event_duration} min`,
                              },
                            })
                          }
                          className="text-[11px] text-amber-700 hover:text-amber-900 underline font-medium"
                        >
                          {m.evidence.breakdown_event_ids.length} events
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
