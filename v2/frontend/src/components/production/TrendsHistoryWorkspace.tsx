import React from 'react';
import type { ProductionHistoryResponse } from '../../api';
import { ProductionTrendGraph } from './ProductionTrendGraph';

interface TrendsHistoryWorkspaceProps {
  history: ProductionHistoryResponse | null;
  loading: boolean;
  selectedWindow: string;
  onSelectWindow: (window: string) => void;
  onSelectLoom: (loomId: number) => void;
  onExplainLoom: (loomNo: string) => void;
  onExplainTrend: () => void;
}

export const TrendsHistoryWorkspace: React.FC<TrendsHistoryWorkspaceProps> = ({
  history,
  loading,
  selectedWindow,
  onSelectWindow,
  onSelectLoom,
  onExplainLoom,
  onExplainTrend,
}) => {
  if (loading || !history) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
        Loading historical trends and consistency profiles...
      </div>
    );
  }

  const { direction, timeline, consistency_quadrants } = history;
  const isDeclining = direction.direction_status === 'DECLINING';
  const isImproving = direction.direction_status === 'IMPROVING';

  // Map timeline data points for graph
  const trendPoints = timeline.data_points.map((p) => ({
    date: p.date,
    actual: p.actual_metres,
    target: p.target_metres,
    efficiency: p.efficiency_pct,
    breaks: p.total_breaks,
    downtime: p.stopped_minutes,
  }));

  return (
    <div className="trends-history-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. 30-DAY DIRECTION BANNER (Visual & Direct) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E6EA',
        borderRadius: '8px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Macro 30-Day Performance Direction
            </span>
            <span style={{
              background: isDeclining ? '#FEE2E2' : (isImproving ? '#ECFDF5' : '#F1F5F9'),
              color: isDeclining ? '#991B1B' : (isImproving ? '#065F46' : '#334155'),
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              {direction.direction_status}
            </span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', marginTop: '3px' }}>
            Output {direction.output_change_pct >= 0 ? '+' : ''}{direction.output_change_pct}% • Efficiency {direction.efficiency_change_pp >= 0 ? '+' : ''}{direction.efficiency_change_pp} pp • Downtime {direction.downtime_change_pct >= 0 ? '+' : ''}{direction.downtime_change_pct}%
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ fontSize: '11.5px', color: '#475569' }}>
            Average: <strong>{timeline.average_metres.toLocaleString()} m/day</strong> • <strong>{timeline.average_efficiency_pct}% Eff</strong>
          </div>
        </div>
      </div>

      {/* 2. PRODUCTION TREND GRAPH */}
      <ProductionTrendGraph
        points={trendPoints}
        window={selectedWindow}
        onSelectWindow={onSelectWindow}
        onExplainTrend={onExplainTrend}
        isDeclining={isDeclining}
      />

      {/* 3. LOOMS DECLINING & LOOMS IMPROVING */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        {/* Declining Looms */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', marginBottom: '8px' }}>
            Looms Declining ({consistency_quadrants.counts.declining})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {consistency_quadrants.quadrants.declining.map((l) => (
              <div key={l.loom_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '11.5px' }}>
                <div>
                  <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                    Loom {l.loom_no}
                  </button>
                  <span style={{ color: '#64748B', marginLeft: '4px' }}>({l.loom_type})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#DC2626', fontWeight: 700 }}>{l.trend_slope} pp/day</span>
                  <button onClick={() => onExplainLoom(l.loom_no)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: '10.5px', cursor: 'pointer', fontWeight: 600 }}>
                    [Explain]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improving Looms */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', marginBottom: '8px' }}>
            Looms Recovering / Improving ({consistency_quadrants.counts.recovering})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {consistency_quadrants.quadrants.recovering.map((l) => (
              <div key={l.loom_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '11.5px' }}>
                <div>
                  <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                    Loom {l.loom_no}
                  </button>
                  <span style={{ color: '#64748B', marginLeft: '4px' }}>({l.loom_type})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>+{l.trend_slope} pp/day</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{l.mean_efficiency_pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
