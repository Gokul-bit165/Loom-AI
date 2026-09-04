import React, { useEffect, useState } from 'react';
import {
  fetchProductionIntelligence,
  fetchProductionPerformance,
  fetchProductionHistory,
  fetchProductionShifts,
  fetchProductionAiExplain,
} from '../api';
import type {
  ProductionIntelligenceResponse,
  ProductionPerformanceResponse,
  ProductionHistoryResponse,
  ProductionShiftItem,
  ExplainResponse,
  ExplainRequestPayload,
  ActNowItem,
  ShortfallCategory,
} from '../api';

import { ProductionHeader } from './production/ProductionHeader';
import { ProductionDailyWorkspace } from './production/ProductionDailyWorkspace';
import { LoomPerformanceWorkspace } from './production/LoomPerformanceWorkspace';
import { TrendsHistoryWorkspace } from './production/TrendsHistoryWorkspace';
import { ProductionReportsWorkspace } from './production/ProductionReportsWorkspace';
import { ContextualExplainDrawer } from './production/ContextualExplainDrawer';
import { LoomDrilldownDrawer } from './production/LoomDrilldownDrawer';

export type ProductionSubmodule = 'daily' | 'performance' | 'trends' | 'reports';

interface ProductionIntelligenceViewProps {
  submodule?: ProductionSubmodule;
  onSelectSubmodule?: (submodule: ProductionSubmodule) => void;
  onSelectLoom?: (loomId: number) => void;
}

export const ProductionIntelligenceView: React.FC<ProductionIntelligenceViewProps> = ({
  submodule = 'daily',
  onSelectSubmodule,
  onSelectLoom,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-31');
  const unitCode = 'ATM';
  const [viewMode, setViewMode] = useState<'OWNER' | 'OPERATIONS'>('OWNER');
  const [triageFilter, setTriageFilter] = useState<'ALL' | 'ATTENTION' | 'CRITICAL' | 'RECOVERY'>('ALL');

  // Main intelligence data
  const [intelligence, setIntelligence] = useState<ProductionIntelligenceResponse | null>(null);
  const [shiftsData, setShiftsData] = useState<ProductionShiftItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lazy-loaded performance & history
  const [performance, setPerformance] = useState<ProductionPerformanceResponse | null>(null);
  const [perfLoading, setPerfLoading] = useState<boolean>(false);

  const [history, setHistory] = useState<ProductionHistoryResponse | null>(null);
  const [histLoading, setHistLoading] = useState<boolean>(false);
  const [historyWindow, setHistoryWindow] = useState<string>('7D');

  // Drawers
  const [explainData, setExplainData] = useState<ExplainResponse | null>(null);
  const [explainLoading, setExplainLoading] = useState<boolean>(false);
  const [drilldownLoomId, setDrilldownLoomId] = useState<number | null>(null);

  // Load: Daily intelligence payload & shifts whenever date changes
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchProductionIntelligence(selectedDate, unitCode),
      fetchProductionShifts(selectedDate, unitCode),
    ])
      .then(([intelRes, shiftsRes]) => {
        setIntelligence(intelRes);
        setShiftsData(shiftsRes.shifts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to retrieve daily production decision telemetry.');
        setLoading(false);
      });
  }, [selectedDate, unitCode]);

  // Lazy load Performance when submodule is performance or date changes
  useEffect(() => {
    if (submodule === 'performance') {
      setPerfLoading(true);
      fetchProductionPerformance(selectedDate, unitCode)
        .then((res) => {
          setPerformance(res);
          setPerfLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setPerfLoading(false);
        });
    }
  }, [submodule, selectedDate, unitCode]);

  // Load History for trends or daily periodic trend
  useEffect(() => {
    setHistLoading(true);
    fetchProductionHistory(selectedDate, unitCode, historyWindow)
      .then((res) => {
        setHistory(res);
        setHistLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setHistLoading(false);
      });
  }, [selectedDate, unitCode, historyWindow]);

  // Trigger Contextual AI Explanation
  const triggerExplain = (payload: ExplainRequestPayload) => {
    setExplainLoading(true);
    fetchProductionAiExplain(payload, unitCode)
      .then((res) => {
        setExplainData(res);
        setExplainLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setExplainLoading(false);
      });
  };

  const handleSelectLoomInternal = (loomId: number) => {
    setDrilldownLoomId(loomId);
    if (onSelectLoom) {
      onSelectLoom(loomId);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
        Loading Ashok Textile Mills Production Intelligence...
      </div>
    );
  }

  if (error || !intelligence) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#DC2626', fontSize: '13px' }}>
        {error || 'Unable to load production data.'}
      </div>
    );
  }

  const { today_position, situation_verdict, act_now_queue, top_losses_all, potential_recovery, shortfall_decomposition, data_availability } = intelligence;

  // Filter act now queue based on triage filter
  let displayQueue = act_now_queue;
  if (triageFilter === 'CRITICAL') {
    displayQueue = top_losses_all.filter((item) => today_position.triage_summary.critical_loom_ids.includes(item.loom_id));
  } else if (triageFilter === 'ATTENTION') {
    displayQueue = top_losses_all.filter((item) => today_position.triage_summary.attention_loom_ids.includes(item.loom_id));
  } else if (triageFilter === 'RECOVERY') {
    displayQueue = top_losses_all.slice(0, 3);
  }

  return (
    <div className="production-intelligence-workspace" style={{
      background: '#F6F8FA',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 1. TOP HEADER & TRIAGE BAR */}
      <ProductionHeader
        unitCode={unitCode}
        workDate={selectedDate}
        onSelectDate={setSelectedDate}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        activeTriageFilter={triageFilter}
        onSelectTriageFilter={setTriageFilter}
        triage={today_position.triage_summary}
        qualityScorePct={data_availability.quality_score_pct}
      />

      {/* 2. SUBMODULE WORKSPACE (Driven directly by sidebar selection — zero redundant tabs) */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '1600px', width: '100%', boxSizing: 'border-box' }}>
        {submodule === 'daily' && (
          <ProductionDailyWorkspace
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            todayPosition={today_position}
            verdict={situation_verdict}
            actNowQueue={displayQueue}
            recovery={potential_recovery}
            shortfall={shortfall_decomposition}
            shiftsData={shiftsData}
            historyData={history}
            historyWindow={historyWindow}
            onSelectHistoryWindow={setHistoryWindow}
            onExplainGap={() => triggerExplain({ context_type: 'PRODUCTION_GAP', date: selectedDate, requested_analysis: 'WHY' })}
            onExplainSituation={() => triggerExplain({ context_type: 'PRODUCTION_GAP', date: selectedDate, requested_analysis: 'WHY' })}
            onExplainAction={(item: ActNowItem) => triggerExplain({ context_type: 'LOOM', entity_id: item.loom_no, date: selectedDate, requested_analysis: 'ACTION' })}
            onExplainRecovery={() => triggerExplain({ context_type: 'RECOVERY', date: selectedDate, requested_analysis: 'RECOVERY' })}
            onExplainShortfallCategory={(cat: ShortfallCategory) => triggerExplain({ context_type: 'PRODUCTION_GAP', entity_id: cat.name, date: selectedDate, requested_analysis: 'WHY' })}
            onExplainShift={(shiftCode: string) => triggerExplain({ context_type: 'SHIFT', entity_id: shiftCode, date: selectedDate, requested_analysis: 'WHY' })}
            onExplainTrend={() => triggerExplain({ context_type: 'PRODUCTION_GAP', date: selectedDate, requested_analysis: 'TREND' })}
            onSelectLoom={handleSelectLoomInternal}
            onNavigateSubmodule={(sub) => onSelectSubmodule && onSelectSubmodule(sub as ProductionSubmodule)}
          />
        )}

        {submodule === 'performance' && (
          <LoomPerformanceWorkspace
            performance={performance}
            loading={perfLoading}
            onSelectLoom={handleSelectLoomInternal}
            onExplainLoom={(loomNo: string) => triggerExplain({ context_type: 'LOOM', entity_id: loomNo, date: selectedDate, requested_analysis: 'WHY' })}
          />
        )}

        {submodule === 'trends' && (
          <TrendsHistoryWorkspace
            history={history}
            loading={histLoading}
            selectedWindow={historyWindow}
            onSelectWindow={setHistoryWindow}
            onSelectLoom={handleSelectLoomInternal}
            onExplainLoom={(loomNo: string) => triggerExplain({ context_type: 'LOOM', entity_id: loomNo, date: selectedDate, requested_analysis: 'WHY' })}
            onExplainTrend={() => triggerExplain({ context_type: 'PRODUCTION_GAP', date: selectedDate, requested_analysis: 'TREND' })}
          />
        )}

        {submodule === 'reports' && (
          <ProductionReportsWorkspace />
        )}
      </div>

      {/* 3. CONTEXTUAL DRAWERS */}
      <ContextualExplainDrawer
        data={explainData}
        loading={explainLoading}
        onClose={() => setExplainData(null)}
        onAssignAction={(actionText) => {
          console.log('Action assigned:', actionText);
        }}
      />

      <LoomDrilldownDrawer
        loomId={drilldownLoomId}
        onClose={() => setDrilldownLoomId(null)}
        onExplainLoom={(loomNo) => triggerExplain({ context_type: 'LOOM', entity_id: loomNo, date: selectedDate, requested_analysis: 'WHY' })}
      />
    </div>
  );
};
