import React from 'react';
import { Zap, ArrowUpRight } from 'lucide-react';
import type { PotentialRecoveryData } from '../../api';

interface PotentialRecoveryStripProps {
  recovery: PotentialRecoveryData;
  onExplainRecovery: () => void;
}

export const PotentialRecoveryStrip: React.FC<PotentialRecoveryStripProps> = ({
  recovery,
  onExplainRecovery,
}) => {
  return (
    <div className="potential-recovery-strip" style={{
      background: '#EFF6FF',
      border: '1px solid #BFDBFE',
      borderRadius: '8px',
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: '#DBEAFE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Zap size={16} color="#2563EB" />
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Potential Recovery Opportunity (Constrained)
          </div>
          <div style={{ fontSize: '13px', color: '#1E293B', marginTop: '1px' }}>
            <strong>{recovery.recoverable_metres.toLocaleString()} m</strong> potentially recoverable today • Estimated Value: <strong style={{ color: '#16A34A' }}>₹{recovery.recoverable_inr.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ fontSize: '11.5px', color: '#475569' }}>
          Top target: <strong style={{ color: '#2563EB' }}>Loom {recovery.top_opportunity_loom}</strong> ({recovery.top_opportunity_action})
        </div>

        <button
          onClick={onExplainRecovery}
          style={{
            background: '#FFFFFF',
            border: '1px solid #93C5FD',
            color: '#1E40AF',
            fontSize: '11.5px',
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <span>[Explain Recovery]</span>
          <ArrowUpRight size={12} />
        </button>
      </div>
    </div>
  );
};
