'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  ProductionVarianceData,
  BreakdownRankingData,
  RevenueSummaryData,
  StandardApiResponse,
} from '@/lib/types';
import { HeaderNav } from '@/components/common/HeaderNav';
import { HeroGreeting } from '@/components/executive/HeroGreeting';
import { HealthScoreGauge } from '@/components/executive/HealthScoreGauge';
import { ProductionTrendChart } from '@/components/executive/ProductionTrendChart';
import { AttentionQueue } from '@/components/executive/AttentionQueue';
import { CapacityWaterfall } from '@/components/executive/CapacityWaterfall';
import { DowntimeLossMap } from '@/components/executive/DowntimeLossMap';
import { MachinePerformanceMatrix } from '@/components/executive/MachinePerformanceMatrix';
import { ShiftPerformanceComparison } from '@/components/executive/ShiftPerformanceComparison';
import { CommercialPerformanceView } from '@/components/executive/CommercialPerformanceView';
import { DecisionAssistantPanel } from '@/components/executive/DecisionAssistantPanel';
import { MachineDossier } from '@/components/investigation/MachineDossier';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { SentinelSkeleton } from '@/components/states/SentinelSkeleton';
import { EmptyDayState } from '@/components/states/EmptyDayState';
import { SystemErrorState } from '@/components/states/SystemErrorState';

export default function ExecutiveOverviewPage() {
  const [currentDate, setCurrentDate] = useState<string>('2026-08-29');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [prodRes, setProdRes] = useState<StandardApiResponse<ProductionVarianceData> | null>(null);
  const [bdRes, setBdRes] = useState<StandardApiResponse<BreakdownRankingData> | null>(null);
  const [revRes, setRevRes] = useState<StandardApiResponse<RevenueSummaryData> | null>(null);

  // Selected Machine Dossier
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

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
      setError(err.message || 'Failed to connect to operations intelligence engine');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentDate);
  }, [currentDate]);

  const hasData = prodRes?.data?.has_data && prodRes.data.summary;
  const isDemo = prodRes?.data_quality?.is_demo ?? true;
  const datasetLabel = prodRes?.data_quality?.dataset_label ?? 'Grounded Factory Baseline';
  const recordsAnalyzed =
    (prodRes?.data_quality?.records_analyzed || 0) +
    (bdRes?.data_quality?.records_analyzed || 0) +
    (revRes?.data_quality?.records_analyzed || 0);

  // Extract Top Bottlenecks organically
  const allMachines = prodRes?.data?.machine_performance || [];
  const bottleneckMachines = allMachines
    .filter((m) => m.performance_status === 'CRITICAL' || m.efficiency < 85)
    .sort((a, b) => a.efficiency - b.efficiency);

  // Selected Machine Data for Dossier
  const selectedPerf = allMachines.find((m) => m.machine_id === selectedMachineId);
  const selectedDowntime = bdRes?.data?.machine_ranking?.find(
    (m) => m.machine_id === selectedMachineId
  );
  const selectedRevenue = revRes?.data?.machine_ranking?.find(
    (m) => m.machine_id === selectedMachineId
  );

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
      <HeaderNav
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        isDemo={isDemo}
        datasetLabel={datasetLabel}
        recordsAnalyzed={recordsAnalyzed}
      />

      <main className="max-w-7xl 2xl:max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1">
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
            {/* Hero Greeting & Status Briefing */}
            <HeroGreeting
              summary={prodRes.data.summary}
              criticalMachineCount={bottleneckMachines.length}
              onTriageClick={() => setSelectedMachineId(bottleneckMachines[0]?.machine_id || 'TOY-02')}
            />

            {/* Section 1 & 2: Plant Health Gauge (4 cols on lg, 3 on 2xl) + Production Trend (8 cols on lg, 9 on 2xl) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 2xl:grid-cols-12 gap-6 sm:gap-8">
              <div className="lg:col-span-4 2xl:col-span-4">
                <HealthScoreGauge
                  efficiency={prodRes.data.summary.average_efficiency}
                  downtimeMinutes={bdRes?.data?.total_downtime_minutes || 2698}
                />
              </div>
              <div className="lg:col-span-8 2xl:col-span-8">
                <ProductionTrendChart />
              </div>
            </div>

            {/* Section 3: What Needs Attention (Priority Queue) */}
            <AttentionQueue
              machines={bottleneckMachines}
              totalShortfall={prodRes.data.summary.variance_qty}
              onInvestigateMachine={(id) => setSelectedMachineId(id)}
            />

            {/* Section 4: Capacity Loss Waterfall */}
            <CapacityWaterfall
              totalTarget={prodRes.data.summary.total_target}
              totalActual={prodRes.data.summary.total_actual}
              downtimeMinutes={bdRes?.data?.total_downtime_minutes}
            />

            {/* Section 5 & 6: Downtime Loss Map (6 cols) + Machine Performance Matrix (6 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 2xl:grid-cols-12 gap-6 sm:gap-8">
              <div className="lg:col-span-6 2xl:col-span-6">
                <DowntimeLossMap
                  reasons={bdRes?.data?.reason_ranking || []}
                  machines={bdRes?.data?.machine_ranking || []}
                  totalDowntimeMinutes={bdRes?.data?.total_downtime_minutes}
                />
              </div>
              <div className="lg:col-span-6 2xl:col-span-6">
                <MachinePerformanceMatrix
                  machines={allMachines}
                  onSelectMachine={(id) => setSelectedMachineId(id)}
                />
              </div>
            </div>

            {/* Section 7 & 8: Shift Comparison (6 cols) + Commercial Performance (6 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 2xl:grid-cols-12 gap-6 sm:gap-8">
              <div className="lg:col-span-6 2xl:col-span-6">
                <ShiftPerformanceComparison
                  shifts={prodRes.data.shift_performance}
                />
              </div>
              <div className="lg:col-span-6 2xl:col-span-6">
                <CommercialPerformanceView
                  data={revRes?.data}
                />
              </div>
            </div>

            {/* Section 9: Decision Center & AI Analyst */}
            <DecisionAssistantPanel
              currentDate={currentDate}
              onInspectEvidence={(title, ids) =>
                setEvidenceModal({
                  isOpen: true,
                  title,
                  ids,
                })
              }
            />
          </>
        )}
      </main>

      {/* Slide-Over Machine Intelligence Profile */}
      <MachineDossier
        isOpen={Boolean(selectedMachineId)}
        onClose={() => setSelectedMachineId(null)}
        machineId={selectedMachineId}
        perfData={selectedPerf}
        downtimeData={selectedDowntime}
        revenueData={selectedRevenue}
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
