'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RevenueSummaryData, StandardApiResponse } from '@/lib/types';
import { ProvenanceBanner } from '@/components/ProvenanceBanner';
import { DateSelector } from '@/components/DateSelector';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { IndianRupee, ShieldCheck, Database, Info, TrendingUp, Scissors } from 'lucide-react';

export default function RevenuePage() {
  const [currentDate, setCurrentDate] = useState<string>('2026-08-29');
  const [fabricStyle, setFabricStyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<StandardApiResponse<RevenueSummaryData> | null>(null);

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

  const fetchData = async (date: string, style: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getRevenueSummary({
        date,
        fabric_style: style || undefined,
      });
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch revenue analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentDate, fabricStyle);
  }, [currentDate, fabricStyle]);

  const revData = response?.data;
  const summary = revData?.summary;
  const machines = revData?.machine_ranking || [];
  const styles = revData?.fabric_style_ranking || [];

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
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Revenue & Fabric Style Analysis (Q21)
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Realized commercial turnover, style contribution shares, and loom revenue rankings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DateSelector
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            isLoading={isLoading}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Calculating deterministic commercial revenue..." />
      ) : error ? (
        <ErrorState error={error} onRetry={() => fetchData(currentDate, fabricStyle)} />
      ) : !revData?.has_data || !summary ? (
        <EmptyState
          date={currentDate}
          message="No revenue records found for this date."
          onResetDate={() => setCurrentDate('2026-08-29')}
        />
      ) : (
        <>
          {/* Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Today's Realized Revenue
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{summary.today_revenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Weaving Department Output
              </span>
            </div>

            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Month-to-Date (MTD)
              </span>
              <span className="text-2xl font-extrabold text-emerald-800">
                ₹{summary.mtd_revenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                From {summary.mtd_start_date}
              </span>
            </div>

            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Day-over-Day Change
              </span>
              <span
                className={`text-2xl font-extrabold ${
                  (summary.change_vs_previous_day_pct || 0) >= 0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {summary.change_vs_previous_day_pct !== null
                  ? `${summary.change_vs_previous_day_pct > 0 ? '+' : ''}${
                      summary.change_vs_previous_day_pct
                    }%`
                  : 'N/A'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Prev: ₹{summary.previous_day_revenue.toLocaleString()}
              </span>
            </div>

            <div className="card-industrial">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Top Revenue Style
              </span>
              <span className="text-lg font-extrabold text-slate-900 truncate block">
                {revData.best_style?.fabric_style || 'N/A'}
              </span>
              <span className="text-[11px] text-emerald-700 block mt-0.5 font-semibold">
                ₹{revData.best_style?.total_revenue.toLocaleString()} ({revData.best_style?.percentage_of_total}%)
              </span>
            </div>
          </div>

          {/* Strict Revenue Loss Integrity Card */}
          <div className="card-industrial bg-slate-50 border-slate-300">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">
                    REVENUE LOSS POLICY & AUDIT DISCLAIMER:
                  </span>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                    revenue_loss_available = false
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {revData.revenue_loss.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Fabric Style Ranking */}
          <div className="card-industrial">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Fabric Style Contribution Breakdown ({styles.length} Active Styles)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {styles.map((s) => (
                <div
                  key={s.fabric_style}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-slate-900">{s.fabric_style}</span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        {s.percentage_of_total}%
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Woven on {s.machine_count} active looms
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Contribution:</span>
                    <span className="font-extrabold text-slate-900">
                      ₹{s.total_revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Machine Revenue Contribution Table */}
          <div className="card-industrial p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Loom Revenue Contribution Ranking ({machines.length} Weaving Looms)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Sorted by realized daily revenue descending.
                </p>
              </div>
              <button
                onClick={() =>
                  setEvidenceModal({
                    isOpen: true,
                    title: `All Revenue Records for ${currentDate}`,
                    ids: revData.evidence.revenue_log_ids,
                  })
                }
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center space-x-1"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Audit All ({revData.evidence.revenue_log_ids.length} rows)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-industrial">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Machine</th>
                    <th>Machine Type</th>
                    <th>Fabric Styles Woven</th>
                    <th className="text-right">Realized Revenue</th>
                    <th className="text-right">% of Plant Revenue</th>
                    <th className="text-center">Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((m, idx) => (
                    <tr key={m.machine_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-mono text-slate-500 text-xs font-bold">#{idx + 1}</td>
                      <td className="font-bold text-slate-900">{m.machine_id}</td>
                      <td className="text-slate-600 text-xs">{m.machine_type}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {m.fabric_styles.map((st) => (
                            <span
                              key={st}
                              className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded"
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-right font-extrabold text-slate-900">
                        ₹{m.total_revenue.toLocaleString()}
                      </td>
                      <td className="text-right font-semibold text-emerald-800">
                        {m.percentage_of_total}%
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() =>
                            setEvidenceModal({
                              isOpen: true,
                              title: `Revenue Record Audit: ${m.machine_id}`,
                              ids: m.evidence.revenue_log_ids,
                              extraDetails: {
                                total_revenue: `₹${m.total_revenue.toLocaleString()}`,
                                styles: m.fabric_styles.join(', '),
                              },
                            })
                          }
                          className="text-[11px] text-emerald-700 hover:text-emerald-900 underline font-medium"
                        >
                          {m.evidence.revenue_log_ids.length} rows
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
        sourceType="derived"
      />
    </div>
  );
}
