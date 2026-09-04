import React, { useState } from 'react';
import type { ProductionPerformanceResponse } from '../../api';
import { LoomHeatmap } from './LoomHeatmap';

interface LoomPerformanceWorkspaceProps {
  performance: ProductionPerformanceResponse | null;
  loading: boolean;
  onSelectLoom: (loomId: number) => void;
  onExplainLoom: (loomNo: string) => void;
}

export const LoomPerformanceWorkspace: React.FC<LoomPerformanceWorkspaceProps> = ({
  performance,
  loading,
  onSelectLoom,
  onExplainLoom,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'OVERVIEW' | 'WEAVERS'>('OVERVIEW');

  if (loading || !performance) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
        Loading loom performance rankings and shed telemetry...
      </div>
    );
  }

  const { loom_performance, weaver_performance } = performance;

  return (
    <div className="loom-performance-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-navigation controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E6EA', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveSubSection('OVERVIEW')}
            style={{
              background: activeSubSection === 'OVERVIEW' ? '#EFF6FF' : 'transparent',
              color: activeSubSection === 'OVERVIEW' ? '#2563EB' : '#64748B',
              border: '1px solid',
              borderColor: activeSubSection === 'OVERVIEW' ? '#BFDBFE' : 'transparent',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Loom Rankings & Heatmap
          </button>
          <button
            onClick={() => setActiveSubSection('WEAVERS')}
            style={{
              background: activeSubSection === 'WEAVERS' ? '#EFF6FF' : 'transparent',
              color: activeSubSection === 'WEAVERS' ? '#2563EB' : '#64748B',
              border: '1px solid',
              borderColor: activeSubSection === 'WEAVERS' ? '#BFDBFE' : 'transparent',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Weaver Ratings ({weaver_performance.total_qualified} Qualified)
          </button>
        </div>

        <span style={{ fontSize: '11.5px', color: '#64748B' }}>
          Total Looms Evaluated: <strong>{loom_performance.total_looms_evaluated}</strong>
        </span>
      </div>

      {activeSubSection === 'OVERVIEW' && (
        <>
          {/* 1. 192-LOOM INTERACTIVE HEATMAP */}
          <LoomHeatmap
            selectedDate={performance?.work_date}
            onSelectLoom={onSelectLoom}
            onExplainLoom={onExplainLoom}
          />

          {/* 2. RANKED VISUAL HORIZONTAL BARS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {/* Top Performers */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', marginBottom: '8px' }}>
                Top Output & Efficiency Looms
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {loom_performance.top_output_looms.map((l) => (
                  <div key={l.loom_id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                      <div>
                        <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                          Loom {l.loom_no}
                        </button>
                        <span style={{ color: '#64748B', marginLeft: '4px' }}>({l.loom_type})</span>
                      </div>
                      <div>
                        <strong>{l.actual_metres} m</strong> • <span style={{ color: '#16A34A', fontWeight: 700 }}>{l.efficiency_pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(l.efficiency_pct / 100) * 100}%`, height: '100%', background: '#16A34A', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention Looms */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', marginBottom: '8px' }}>
                Needs Attention (Lowest Efficiency)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {loom_performance.bottom_efficiency_looms.map((l) => (
                  <div key={l.loom_id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                      <div>
                        <button onClick={() => onSelectLoom(l.loom_id)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                          Loom {l.loom_no}
                        </button>
                        <span style={{ color: '#64748B', marginLeft: '4px' }}>({l.loom_type})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#DC2626', fontWeight: 700 }}>{l.efficiency_pct}%</span>
                        <button onClick={() => onExplainLoom(l.loom_no)} style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: '10.5px', cursor: 'pointer', fontWeight: 600 }}>
                          [Explain]
                        </button>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(l.efficiency_pct / 100) * 100}%`, height: '100%', background: '#DC2626', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeSubSection === 'WEAVERS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '10px 14px', fontSize: '11.5px', color: '#475569' }}>
            <strong>Fair Qualification Policy:</strong> Weavers with &ge; 6.0 scheduled hours and &ge; 4 assigned looms are evaluated. Unqualified short-shift workers are isolated to prevent skewing benchmarks.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {/* Top Weavers */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', marginBottom: '8px' }}>
                Top Performers
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {weaver_performance.top_weavers.map((w) => (
                  <div key={w.employee_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '11.5px' }}>
                    <div>
                      <strong style={{ color: '#0F172A' }}>{w.name}</strong>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>{w.looms_handled} looms • {w.assigned_hours}h • {w.total_metres} m</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#16A34A' }}>{w.efficiency_pct}%</div>
                      <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#15803D' }}>{w.performance_label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Review Weavers */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', marginBottom: '8px' }}>
                Needs Review & Coaching
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {weaver_performance.attention_required_weavers.map((w) => (
                  <div key={w.employee_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '11.5px' }}>
                    <div>
                      <strong style={{ color: '#0F172A' }}>{w.name}</strong>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>{w.looms_handled} looms • {w.assigned_hours}h • {w.total_metres} m</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#D97706' }}>{w.efficiency_pct}%</div>
                      <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#B45309' }}>{w.performance_label}</span>
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
