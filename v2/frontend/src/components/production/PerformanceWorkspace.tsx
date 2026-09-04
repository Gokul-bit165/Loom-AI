import React, { useState } from 'react';
import type { ProductionPerformanceResponse } from '../../api';

interface PerformanceWorkspaceProps {
  performance: ProductionPerformanceResponse | null;
  loading: boolean;
  onSelectLoom: (loomId: number) => void;
  onExplainLoom: (loomNo: string) => void;
}

export const PerformanceWorkspace: React.FC<PerformanceWorkspaceProps> = ({
  performance,
  loading,
  onSelectLoom,
  onExplainLoom,
}) => {
  const [subTab, setSubTab] = useState<'LOOMS' | 'OPPORTUNITIES' | 'WEAVERS'>('LOOMS');

  if (loading || !performance) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
        Loading normalized loom & weaver performance...
      </div>
    );
  }

  const { loom_performance, weaver_performance } = performance;

  return (
    <div className="performance-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E6EA', paddingBottom: '8px' }}>
        <button
          onClick={() => setSubTab('LOOMS')}
          style={{
            background: subTab === 'LOOMS' ? '#EFF6FF' : 'transparent',
            color: subTab === 'LOOMS' ? '#2563EB' : '#64748B',
            border: '1px solid',
            borderColor: subTab === 'LOOMS' ? '#BFDBFE' : 'transparent',
            borderRadius: '4px',
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Top & Bottom Looms
        </button>
        <button
          onClick={() => setSubTab('OPPORTUNITIES')}
          style={{
            background: subTab === 'OPPORTUNITIES' ? '#EFF6FF' : 'transparent',
            color: subTab === 'OPPORTUNITIES' ? '#2563EB' : '#64748B',
            border: '1px solid',
            borderColor: subTab === 'OPPORTUNITIES' ? '#BFDBFE' : 'transparent',
            borderRadius: '4px',
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Potential Improvement Opportunities
        </button>
        <button
          onClick={() => setSubTab('WEAVERS')}
          style={{
            background: subTab === 'WEAVERS' ? '#EFF6FF' : 'transparent',
            color: subTab === 'WEAVERS' ? '#2563EB' : '#64748B',
            border: '1px solid',
            borderColor: subTab === 'WEAVERS' ? '#BFDBFE' : 'transparent',
            borderRadius: '4px',
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Weaver Ratings ({weaver_performance.total_qualified} Qualified)
        </button>
      </div>

      {/* SUBTAB 1: TOP & BOTTOM LOOMS */}
      {subTab === 'LOOMS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Top Output */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', marginBottom: '10px' }}>
              Top Output Looms
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loom_performance.top_output_looms.map((l) => (
                <div key={l.loom_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
                  <div>
                    <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                      Loom {l.loom_no}
                    </button>
                    <span style={{ color: '#64748B', marginLeft: '6px' }}>({l.loom_type})</span>
                  </div>
                  <div>
                    <strong>{l.actual_metres} m</strong> • <span style={{ color: '#16A34A', fontWeight: 600 }}>{l.efficiency_pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Efficiency */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', marginBottom: '10px' }}>
              Lowest Efficiency Looms
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loom_performance.bottom_efficiency_looms.map((l) => (
                <div key={l.loom_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
                  <div>
                    <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                      Loom {l.loom_no}
                    </button>
                    <span style={{ color: '#64748B', marginLeft: '6px' }}>({l.loom_type})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>{l.efficiency_pct}%</span>
                    <button onClick={() => onExplainLoom(l.loom_no)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
                      [Explain]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: POTENTIAL IMPROVEMENT OPPORTUNITIES */}
      {subTab === 'OPPORTUNITIES' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
              Potential Improvement Opportunities
            </h3>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
              Ranked by gap to style benchmark, machine recoverability, and available runtime.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loom_performance.potential_improvement_opportunities.map((l, i) => (
              <div key={l.loom_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                    {i + 1}
                  </span>
                  <div>
                    <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                      Loom {l.loom_no}
                    </button>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Current: <strong>{l.efficiency_pct}%</strong> • Benchmark: <strong>{l.std_efficiency_pct}%</strong> • Gap: <strong style={{ color: '#DC2626' }}>{l.efficiency_gap_pp} pp</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Stopped Duration</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#DC2626' }}>{l.stopped_minutes} min</div>
                  </div>
                  <button
                    onClick={() => onExplainLoom(l.loom_no)}
                    style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '5px 12px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    [Explain]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: WEAVER PERFORMANCE */}
      {subTab === 'WEAVERS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '10px 14px', fontSize: '11.5px', color: '#64748B' }}>
            <strong>Qualification Policy:</strong> Weavers with &ge; 6.0 scheduled hours and &ge; 4 assigned looms are evaluated. Unqualified short-shift workers are isolated to prevent skewing benchmarks.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* Top Weavers */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', marginBottom: '10px' }}>
                Top Performers
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {weaver_performance.top_weavers.map((w) => (
                  <div key={w.employee_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
                    <div>
                      <strong style={{ color: '#0F172A' }}>{w.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{w.looms_handled} looms • {w.assigned_hours}h • {w.total_metres} m</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A' }}>{w.efficiency_pct}%</div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#15803D' }}>{w.performance_label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attention Required Weavers */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', marginBottom: '10px' }}>
                Attention & Coaching Opportunities
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {weaver_performance.attention_required_weavers.map((w) => (
                  <div key={w.employee_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
                    <div>
                      <strong style={{ color: '#0F172A' }}>{w.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{w.looms_handled} looms • {w.assigned_hours}h • {w.total_metres} m</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#D97706' }}>{w.efficiency_pct}%</div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#B45309' }}>{w.performance_label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
