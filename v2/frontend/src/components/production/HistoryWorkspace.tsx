import React, { useState } from 'react';
import type { ProductionHistoryResponse } from '../../api';

interface HistoryWorkspaceProps {
  history: ProductionHistoryResponse | null;
  loading: boolean;
  selectedWindow: string;
  onSelectWindow: (window: string) => void;
  onSelectLoom: (loomId: number) => void;
  onExplainLoom: (loomNo: string) => void;
}

export const HistoryWorkspace: React.FC<HistoryWorkspaceProps> = ({
  history,
  loading,
  selectedWindow,
  onSelectWindow,
  onSelectLoom,
  onExplainLoom,
}) => {
  const [activeQuadrant, setActiveQuadrant] = useState<'CONSISTENT' | 'DECLINING' | 'RECOVERING' | 'VOLATILE'>('DECLINING');

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

  return (
    <div className="history-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* PERFORMANCE DIRECTION BANNER (Direction First!) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E6EA',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              30-Day Performance Direction
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

          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginTop: '4px' }}>
            Output {direction.output_change_pct >= 0 ? '+' : ''}{direction.output_change_pct}% • Efficiency {direction.efficiency_change_pp >= 0 ? '+' : ''}{direction.efficiency_change_pp} pp • Downtime {direction.downtime_change_pct >= 0 ? '+' : ''}{direction.downtime_change_pct}%
          </div>
        </div>

        {/* Window Selector */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '6px', border: '1px solid #E2E6EA', fontSize: '11.5px', fontWeight: 600 }}>
          {['7D', '30D', '90D', '12M', 'YTD'].map((w) => (
            <button
              key={w}
              onClick={() => onSelectWindow(w)}
              style={{
                background: selectedWindow === w ? '#FFFFFF' : 'transparent',
                color: selectedWindow === w ? '#0F172A' : '#64748B',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: selectedWindow === w ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Key Changes identified by deterministic trend analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {direction.key_changes.map((kc, i) => (
          <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong style={{ color: '#0F172A', fontSize: '13px' }}>{kc.entity}</strong>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: kc.status === 'DECLINING' ? '#DC2626' : (kc.status === 'VOLATILE' ? '#D97706' : '#2563EB'),
              }}>
                {kc.status}
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '4px' }}>
              {kc.detail}
            </div>
          </div>
        ))}
      </div>

      {/* LOOM CONSISTENCY QUADRANTS */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
              Loom Consistency Quadrants ({consistency_quadrants.counts.consistent + consistency_quadrants.counts.declining + consistency_quadrants.counts.recovering + consistency_quadrants.counts.volatile} Looms Evaluated)
            </h3>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
              Categorized by efficiency stability, slope, and standard deviation (min. 7 observation days).
            </div>
          </div>

          {/* Quadrant toggle buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setActiveQuadrant('DECLINING')}
              style={{
                background: activeQuadrant === 'DECLINING' ? '#FEE2E2' : '#FFFFFF',
                color: '#991B1B',
                border: '1px solid #EF4444',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Declining ({consistency_quadrants.counts.declining})
            </button>
            <button
              onClick={() => setActiveQuadrant('VOLATILE')}
              style={{
                background: activeQuadrant === 'VOLATILE' ? '#FEF3C7' : '#FFFFFF',
                color: '#92400E',
                border: '1px solid #F59E0B',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Volatile ({consistency_quadrants.counts.volatile})
            </button>
            <button
              onClick={() => setActiveQuadrant('RECOVERING')}
              style={{
                background: activeQuadrant === 'RECOVERING' ? '#EFF6FF' : '#FFFFFF',
                color: '#1E40AF',
                border: '1px solid #3B82F6',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Recovering ({consistency_quadrants.counts.recovering})
            </button>
            <button
              onClick={() => setActiveQuadrant('CONSISTENT')}
              style={{
                background: activeQuadrant === 'CONSISTENT' ? '#ECFDF5' : '#FFFFFF',
                color: '#065F46',
                border: '1px solid #10B981',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Consistent ({consistency_quadrants.counts.consistent})
            </button>
          </div>
        </div>

        {/* Selected quadrant machines list */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {activeQuadrant === 'DECLINING' && consistency_quadrants.quadrants.declining.map((l) => (
            <div key={l.loom_id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                  Loom {l.loom_no}
                </button>
                <button onClick={() => onExplainLoom(l.loom_no)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: '10.5px', cursor: 'pointer', fontWeight: 600 }}>
                  [Explain]
                </button>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                Mean Eff: <strong>{l.mean_efficiency_pct}%</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#DC2626', marginTop: '1px' }}>
                Trend: <strong>{l.trend_slope} pp/day</strong>
              </div>
            </div>
          ))}

          {activeQuadrant === 'VOLATILE' && consistency_quadrants.quadrants.volatile.map((l) => (
            <div key={l.loom_id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                  Loom {l.loom_no}
                </button>
                <button onClick={() => onExplainLoom(l.loom_no)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: '10.5px', cursor: 'pointer', fontWeight: 600 }}>
                  [Explain]
                </button>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                Mean Eff: <strong>{l.mean_efficiency_pct}%</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#D97706', marginTop: '1px' }}>
                StdDev: <strong>&sigma; = {l.stddev}%</strong>
              </div>
            </div>
          ))}

          {activeQuadrant === 'RECOVERING' && consistency_quadrants.quadrants.recovering.map((l) => (
            <div key={l.loom_id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                  Loom {l.loom_no}
                </button>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                Mean Eff: <strong>{l.mean_efficiency_pct}%</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '1px' }}>
                Trend: <strong>+{l.trend_slope} pp/day</strong>
              </div>
            </div>
          ))}

          {activeQuadrant === 'CONSISTENT' && consistency_quadrants.quadrants.consistent_performers.map((l) => (
            <div key={l.loom_id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: '6px' }}>
              <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                Loom {l.loom_no}
              </button>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                Mean Eff: <strong>{l.mean_efficiency_pct}%</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '1px' }}>
                Stable (&sigma; = {l.stddev}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Window Summary Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '16px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
          {timeline.window} Production Telemetry (Avg: {timeline.average_metres} m/day • {timeline.average_efficiency_pct}% Eff)
        </h4>
        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '6px 0' }}>Date</th>
              <th style={{ padding: '6px 0' }}>Actual Output</th>
              <th style={{ padding: '6px 0' }}>Target Output</th>
              <th style={{ padding: '6px 0' }}>Efficiency %</th>
              <th style={{ padding: '6px 0' }}>Total Breaks</th>
            </tr>
          </thead>
          <tbody>
            {timeline.data_points.slice(-7).reverse().map((dp, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}>
                <td style={{ padding: '6px 0', color: '#475569' }}>{dp.date}</td>
                <td style={{ padding: '6px 0', fontWeight: 600 }}>{dp.actual_metres.toLocaleString()} m</td>
                <td style={{ padding: '6px 0', color: '#64748B' }}>{dp.target_metres.toLocaleString()} m</td>
                <td style={{ padding: '6px 0', fontWeight: 700, color: dp.efficiency_pct >= 90 ? '#16A34A' : '#DC2626' }}>{dp.efficiency_pct}%</td>
                <td style={{ padding: '6px 0', color: '#475569' }}>{dp.total_breaks.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
