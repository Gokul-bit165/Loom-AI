import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ShortfallDecompositionData, ShortfallCategory } from '../../api';

interface ShortfallDecompositionCardProps {
  decomposition: ShortfallDecompositionData;
  onExplainCategory: (category: ShortfallCategory) => void;
}

export const ShortfallDecompositionCard: React.FC<ShortfallDecompositionCardProps> = ({
  decomposition,
  onExplainCategory,
}) => {
  return (
    <div className="shortfall-decomposition-card" style={{
      background: '#FFFFFF',
      border: '1px solid #E2E6EA',
      borderRadius: '8px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Why Are We Off Plan? — Shortfall Decomposition
          </h2>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>
            Total Shortfall: <strong>{Math.abs(decomposition.target_gap_metres).toLocaleString()} m</strong> decomposed into industrial root causes
          </div>
        </div>

        <span style={{ fontSize: '11px', color: '#94A3B8' }}>
          Click [Explain] on any driver for affected looms and evidence
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
      }}>
        {decomposition.categories.map((cat, idx) => (
          <div
            key={idx}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>
                  {cat.name}
                </span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: cat.share_pct >= 30 ? '#DC2626' : (cat.share_pct >= 20 ? '#D97706' : '#2563EB'),
                }}>
                  {cat.share_pct}%
                </span>
              </div>

              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                {cat.description}
              </div>

              <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px' }}>
                Affected: <strong>{cat.affected_looms.slice(0, 3).join(', ')}</strong> ({cat.affected_looms_count} looms)
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => onExplainCategory(cat)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                <span>[Explain {cat.share_pct}%]</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
