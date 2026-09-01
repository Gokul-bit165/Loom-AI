import { TOKENS } from './tokens';
import { StatusBadge } from './StatusBadge';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface DecisionCardProps {
  id?: string;
  priority: 'P1' | 'P2' | 'P3' | string;
  category: string;
  loomNo?: string;
  issue: string;
  evidence: string;
  probableCause?: string;
  recommendedAction: string;
  impactRevenueRs?: number;
  impactMetres?: number;
  confidence?: number;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'COMPLETED' | 'VERIFIED' | string;
  assignee?: string;
  onAcknowledge?: () => void;
  onAssign?: () => void;
  onComplete?: () => void;
  onVerify?: () => void;
  onOpenLoom?: () => void;
}

export function DecisionCard({
  priority,
  category,
  loomNo,
  issue,
  evidence,
  probableCause,
  recommendedAction,
  impactRevenueRs,
  impactMetres,
  confidence,
  status,
  onAcknowledge,
  onAssign,
  onComplete,
  onVerify,
  onOpenLoom,
}: DecisionCardProps) {
  const isP1 = priority === 'P1';

  return (
    <div
      style={{
        background: TOKENS.colors.surface.card,
        border: isP1 ? '1px solid #FECACA' : `1px solid ${TOKENS.colors.surface.border}`,
        borderLeft: isP1 ? '3px solid #DC2626' : '3px solid #2563EB',
        borderRadius: TOKENS.radius.md,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: TOKENS.shadows.card,
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '3px',
              background: isP1 ? '#FEF2F2' : '#EFF6FF',
              color: isP1 ? '#DC2626' : '#2563EB',
              border: isP1 ? '1px solid #FECACA' : '1px solid #BFDBFE',
            }}
          >
            {priority}
          </span>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
            {category} {loomNo && `· Loom ${loomNo}`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StatusBadge status={status} />
          {confidence && (
            <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 500 }}>
              {Math.round(confidence * 100)}% Conf
            </span>
          )}
        </div>
      </div>

      {/* Issue & Evidence */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: TOKENS.colors.text.primary, lineHeight: 1.3 }}>
          {issue}
        </div>
        <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, marginTop: '2px', lineHeight: 1.4 }}>
          <strong>Evidence:</strong> {evidence}
        </div>
      </div>

      {/* Probable Cause */}
      {probableCause && (
        <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, lineHeight: 1.4 }}>
          <strong>Probable Cause:</strong> {probableCause}
        </div>
      )}

      {/* Recommended Action */}
      <div
        style={{
          background: TOKENS.colors.surface.cardAlt,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          borderRadius: TOKENS.radius.sm,
          padding: '6px 10px',
          fontSize: '12px',
          color: TOKENS.colors.text.primary,
          lineHeight: 1.4,
        }}
      >
        <strong style={{ color: TOKENS.colors.brand[700] }}>Recommended Action:</strong> {recommendedAction}
      </div>

      {/* Financial Exposure & Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${TOKENS.colors.surface.canvas}`,
          paddingTop: '6px',
          marginTop: '2px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, display: 'flex', gap: '10px' }}>
          {impactRevenueRs !== undefined && (
            <span>
              Revenue Recovery: <strong style={{ color: TOKENS.colors.status.healthy.text }}>₹{impactRevenueRs.toLocaleString()}</strong>
            </span>
          )}
          {impactMetres !== undefined && (
            <span>
              Capacity: <strong style={{ color: TOKENS.colors.text.primary }}>{impactMetres.toLocaleString()} m</strong>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {onOpenLoom && (
            <button
              onClick={onOpenLoom}
              className="btn-secondary"
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              <span>Open Loom</span>
              <ArrowRight size={11} />
            </button>
          )}

          {status === 'OPEN' && onAcknowledge && (
            <button
              onClick={onAcknowledge}
              className="btn-secondary"
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              Acknowledge
            </button>
          )}

          {status !== 'COMPLETED' && status !== 'VERIFIED' && onAssign && (
            <button
              onClick={onAssign}
              className="btn-primary"
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              Assign
            </button>
          )}

          {status === 'ASSIGNED' && onComplete && (
            <button
              onClick={onComplete}
              className="btn-primary"
              style={{ padding: '3px 8px', fontSize: '11px', background: '#059669', borderColor: '#047857' }}
            >
              Complete
            </button>
          )}

          {status === 'COMPLETED' && onVerify && (
            <button
              onClick={onVerify}
              className="btn-secondary"
              style={{ padding: '3px 8px', fontSize: '11px', color: '#059669' }}
            >
              <CheckCircle2 size={12} color="#059669" />
              <span>Verify</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
