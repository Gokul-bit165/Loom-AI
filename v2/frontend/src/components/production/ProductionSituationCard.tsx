import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { SituationVerdict } from '../../api';

interface ProductionSituationCardProps {
  verdict: SituationVerdict;
  onExplainSituation: () => void;
}

export const ProductionSituationCard: React.FC<ProductionSituationCardProps> = ({
  verdict,
  onExplainSituation,
}) => {
  const isCritical = verdict.status === 'CRITICAL';
  const isAttention = verdict.status === 'ATTENTION';

  const borderColor = isCritical ? '#FCA5A5' : (isAttention ? '#FDE68A' : '#BBF7D0');
  const bgColor = isCritical ? '#FEF2F2' : (isAttention ? '#FFFBEB' : '#F0FDF4');
  const iconColor = isCritical ? '#DC2626' : (isAttention ? '#D97706' : '#16A34A');

  return (
    <div className="production-situation-card" style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isCritical && <AlertCircle size={20} color={iconColor} />}
        {isAttention && <AlertTriangle size={20} color={iconColor} />}
        {!isCritical && !isAttention && <CheckCircle2 size={20} color={iconColor} />}

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: iconColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Today's Situation & Primary Verdict
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', marginTop: '1px' }}>
            {verdict.verdict_sentence}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#475569' }}>
          <span style={{ fontWeight: 600 }}>Dominant Drivers:</span>
          {verdict.dominant_drivers.map((d, i) => (
            <span
              key={i}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              {d}
            </span>
          ))}
        </div>

        <button
          onClick={onExplainSituation}
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            color: '#1E40AF',
            fontSize: '11.5px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          [Explain]
        </button>
      </div>
    </div>
  );
};
