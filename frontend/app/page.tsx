'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  ProductionVarianceData,
  BreakdownRankingData,
  RevenueSummaryData,
  StandardApiResponse,
} from '@/lib/types';
import { ProvenanceBanner } from '@/components/ProvenanceBanner';
import { DateSelector } from '@/components/DateSelector';
import { KpiCard } from '@/components/KpiCard';
import { AttentionSection, AttentionItem } from '@/components/AttentionSection';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Factory, Wrench, IndianRupee, Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomeDashboard() {
  const [currentDate, setCurrentDate] = useState<string>('2026-08-29');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [prodRes, setProdRes] = useState<StandardApiResponse<ProductionVarianceData> | null>(null);
  const [bdRes, setBdRes] = useState<StandardApiResponse<BreakdownRankingData> | null>(null);
  const [revRes, setRevRes] = useState<StandardApiResponse<RevenueSummaryData> | null>(null);

  // Evidence Drawer state
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
      const [prod, bd, rev] = await Promise.all([
        api.getProductionVariance({ date }),
        api.getBreakdownRanking({ date, period: 'today' }),
        api.getRevenueSummary({ date }),
      ]);
      setProdRes(prod);
      setBdRes(bd);
      setRevRes(rev);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Loom AI backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentDate);
  }, [currentDate]);

  // Aggregate Attention Items
  const attentionItems: AttentionItem[] = [];

  if (prodRes?.data?.machine_performance) {
    prodRes.data.machine_performance
      .filter((m) => m.performance_status === 'CRITICAL' || m.performance_status === 'UNDERPERFORMING')
      .slice(0, 3)
      .forEach((m) => {
        attentionItems.push({
          machine_id: m.machine_id,
          department: m.department,
          machine_type: m.machine_type,
          metric: `Efficiency: ${m.efficiency}% (Variance: ${m.variance.toLocaleString()} units)`,
          severity: m.performance_status === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
          reason: `Below target output. Actual: ${m.actual.toLocaleString()} / Target: ${m.target.toLocaleString()}`,
          action_route: `/production?date=${currentDate}&machine_id=${m.machine_id}`,
          evidence_count: m.evidence.production_log_ids.length,
        });
      });
  }

  if (bdRes?.data?.machine_ranking) {
    bdRes.data.machine_ranking
      .filter((m) => m.downtime_minutes >= 60)
      .slice(0, 3)
      .forEach((m) => {
        attentionItems.push({
          machine_id: m.machine_id,
          department: m.department,
          machine_type: m.machine_type,
          metric: `Downtime: ${m.downtime_minutes} mins (${m.event_count} events)`,
          severity: m.downtime_minutes >= 120 ? 'CRITICAL' : 'WARNING',
          reason: `Significant downtime accounting for ${m.percentage_of_total_downtime}% of plant loss today.`,
          action_route: `/breakdown?date=${currentDate}&machine_id=${m.machine_id}`,
          evidence_count: m.evidence.breakdown_event_ids.length,
        });
      });
  }

  const isDemo = prodRes?.data_quality?.is_demo ?? true;
  const datasetLabel = prodRes?.data_quality?.dataset_label ?? 'Synthetic Grounded Factory V1';
  const recordsAnalyzed =
    (prodRes?.data_quality?.records_analyzed || 0) +
    (bdRes?.data_quality?.records_analyzed || 0) +
    (revRes?.data_quality?.records_analyzed || 0);

  const hasAnyData =
    prodRes?.data?.has_data || bdRes?.data?.has_data || revRes?.data?.has_data;

  return (
    <div className="space-y-6">
      {/* Top Provenance & Synthetic Data Warning */}
      <ProvenanceBanner
        isDemo={isDemo}
        datasetLabel={datasetLabel}
        recordsAnalyzed={recordsAnalyzed}
        lastUpdated={prodRes?.metadata?.generated_at}
      />

      {/* Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            Plant Management Control Center
          </h1>
          <p className="text-xs text-slate-500">
            Operational decision-support overview for shift managers & plant superintendents.
          </p>
        </div>

        <DateSelector
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          isLoading={isLoading}
        />
      </div>

      {/* State Renderers */}
      {isLoading ? (
        <LoadingState message="Aggregating plant production, downtime & revenue metrics..." />
      ) : error ? (
        <ErrorState error={error} onRetry={() => fetchData(currentDate)} />
      ) : !hasAnyData ? (
        <EmptyState
          date={currentDate}
          onResetDate={() => setCurrentDate('2026-08-29')}
        />
      ) : (
        <>
          {/* Attention Section (Issues surfaced first) */}
          <AttentionSection
            items={attentionItems}
            onInspectEvidence={(machineId) => {
              const m = prodRes?.data?.machine_performance?.find((p) => p.machine_id === machineId);
              setEvidenceModal({
                isOpen: true,
                title: `Supporting Record Audit: ${machineId}`,
                ids: m?.evidence?.production_log_ids || [],
              });
            }}
          />

          {/* 3 Core KPI Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Production Card */}
            {prodRes?.data?.summary && (
              <div className="card-industrial flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Factory className="w-5 h-5 text-blue-600" />
                      <h2 className="font-bold text-sm text-slate-800 tracking-tight">
                        PRODUCTION (Q1)
                      </h2>
                    </div>
                    <Link
                      href={`/production?date=${currentDate}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-0.5"
                    >
                      <span>Drilldown</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">
                        Actual Output
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {prodRes.data.summary.total_actual.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">
                        Target Output
                      </span>
                      <span className="text-xl font-bold text-slate-600">
                        {prodRes.data.summary.total_target.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Plant Efficiency:</span>
                      <span
                        className={`font-bold ${
                          prodRes.data.summary.average_efficiency >= 95
                            ? 'text-emerald-600'
                            : prodRes.data.summary.average_efficiency >= 90
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {prodRes.data.summary.average_efficiency}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Variance to Target:</span>
                      <span
                        className={`font-semibold ${
                          prodRes.data.summary.variance_qty >= 0
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {prodRes.data.summary.variance_qty > 0 ? '+' : ''}
                        {prodRes.data.summary.variance_qty.toLocaleString()} units (
                        {prodRes.data.summary.variance_pct}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Day-over-Day Output:</span>
                      <span className="font-semibold text-slate-800">
                        {prodRes.data.summary.change_vs_previous_day_pct !== null
                          ? `${prodRes.data.summary.change_vs_previous_day_pct > 0 ? '+' : ''}${
                              prodRes.data.summary.change_vs_previous_day_pct
                            }%`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">
                    {prodRes.data.machine_performance.length} machines tracked
                  </span>
                  <button
                    onClick={() =>
                      setEvidenceModal({
                        isOpen: true,
                        title: 'Production Summary Evidence',
                        ids: prodRes.data.evidence.production_log_ids,
                      })
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View {prodRes.data.evidence.production_log_ids.length} rows
                  </button>
                </div>
              </div>
            )}

            {/* 2. Downtime Card */}
            {bdRes?.data && (
              <div className="card-industrial flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Wrench className="w-5 h-5 text-amber-600" />
                      <h2 className="font-bold text-sm text-slate-800 tracking-tight">
                        DOWNTIME (Q5)
                      </h2>
                    </div>
                    <Link
                      href={`/breakdown?date=${currentDate}`}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center space-x-0.5"
                    >
                      <span>Ranking</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">
                        Total Downtime
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {bdRes.data.total_downtime_minutes} min
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        ({(bdRes.data.total_downtime_minutes / 60).toFixed(1)} hrs)
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">
                        Breakdown Events
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {bdRes.data.total_events}
                      </span>
                      <span className="text-[11px] text-slate-400 block">stoppages logged</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Highest Downtime Machine:</span>
                      <span className="font-bold text-rose-700">
                        {bdRes.data.highest_downtime_machine
                          ? `${bdRes.data.highest_downtime_machine.machine_id} (${bdRes.data.highest_downtime_machine.downtime_minutes}m)`
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Top Downtime Reason:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                        {bdRes.data.reason_ranking?.[0]?.reason || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg Event Duration:</span>
                      <span className="font-semibold text-slate-800">
                        {bdRes.data.total_events > 0
                          ? `${(
                              bdRes.data.total_downtime_minutes / bdRes.data.total_events
                            ).toFixed(1)} min`
                          : '0 min'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">
                    {bdRes.data.machine_ranking.length} machines affected
                  </span>
                  <button
                    onClick={() =>
                      setEvidenceModal({
                        isOpen: true,
                        title: 'Breakdown Summary Evidence',
                        ids: bdRes.data.evidence.breakdown_event_ids,
                      })
                    }
                    className="text-amber-700 hover:text-amber-900 font-medium"
                  >
                    View {bdRes.data.evidence.breakdown_event_ids.length} events
                  </button>
                </div>
              </div>
            )}

            {/* 3. Revenue Card */}
            {revRes?.data?.summary && (
              <div className="card-industrial flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="w-5 h-5 text-emerald-600" />
                      <h2 className="font-bold text-sm text-slate-800 tracking-tight">
                        REVENUE (Q21)
                      </h2>
                    </div>
                    <Link
                      href={`/revenue?date=${currentDate}`}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center space-x-0.5"
                    >
                      <span>Analysis</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">
                        Today's Revenue
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        ₹{revRes.data.summary.today_revenue.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">
                        Month-to-Date (MTD)
                      </span>
                      <span className="text-xl font-bold text-emerald-800">
                        ₹{revRes.data.summary.mtd_revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Day-over-Day Revenue:</span>
                      <span className="font-semibold text-slate-800">
                        {revRes.data.summary.change_vs_previous_day_pct !== null
                          ? `${revRes.data.summary.change_vs_previous_day_pct > 0 ? '+' : ''}${
                              revRes.data.summary.change_vs_previous_day_pct
                            }%`
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Top Fabric Style:</span>
                      <span className="font-bold text-slate-800">
                        {revRes.data.best_style?.fabric_style || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Top Grossing Loom:</span>
                      <span className="font-semibold text-emerald-700">
                        {revRes.data.best_machine?.machine_id || 'N/A'} (₹
                        {revRes.data.best_machine?.total_revenue.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Weaving Department</span>
                  <button
                    onClick={() =>
                      setEvidenceModal({
                        isOpen: true,
                        title: 'Revenue Summary Evidence',
                        ids: revRes.data.evidence.revenue_log_ids,
                      })
                    }
                    className="text-emerald-700 hover:text-emerald-900 font-medium"
                  >
                    View {revRes.data.evidence.revenue_log_ids.length} rows
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Navigation to AI Management Assistant */}
          <div className="card-industrial bg-blue-900 text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  ASSISTANT
                </span>
                <h3 className="font-bold text-base tracking-tight">
                  Need an Operational Explanation?
                </h3>
              </div>
              <p className="text-xs text-blue-200">
                Ask the Loom AI Assistant to explain production trends, downtime causes, or style contributions grounded in verified SQL metrics.
              </p>
            </div>
            <Link
              href="/ask"
              className="bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-md font-semibold text-xs transition-colors shrink-0 text-center"
            >
              Open AI Assistant →
            </Link>
          </div>
        </>
      )}

      {/* Evidence Drawer */}
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
