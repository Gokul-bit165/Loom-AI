import { TOKENS } from './tokens';
import { StatusBadge } from './StatusBadge';
import { DataTrustBadge } from './DataTrustBadge';
import type { StatusType, ProvenanceType } from './tokens';
import { ArrowRight } from 'lucide-react';

interface InsightCardProps {
  title: string;
  category?: string;
  observation: string;
  telemetryEvidence?: string;
  whyRootCause?: string;
  businessImpact?: string;
  recommendedAction?: string;
  status?: StatusType | string;
  provenance?: ProvenanceType | string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export function InsightCard({
  title,
  category = 'Operational Insight',
  observation,
  telemetryEvidence,
  whyRootCause,
  businessImpact,
  recommendedAction,
  status = 'INFO',
  provenance = 'CALCULATED',
  onActionClick,
  actionLabel = 'Investigate',
}: InsightCardProps) {
  return (
    <div
      style={{
        background: TOKENS.colors.surface.card,
        border: `1px solid ${TOKENS.colors.surface.border}`,
        borderRadius: TOKENS.radius.md,
        padding: '14px',
        boxShadow: TOKENS.shadows.card,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: TOKENS.colors.text.muted, textTransform: 'uppercase' }}>
            {category}
          </span>
          <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: TOKENS.colors.text.primary, margin: '2px 0 0 0' }}>
            {title}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StatusBadge status={status} />
          <DataTrustBadge provenance={provenance} compact />
        </div>
      </div>

      {/* Observation */}
      <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary, lineHeight: 1.4 }}>
        <strong>Observation:</strong> {observation}
      </div>

      {/* Evidence */}
      {telemetryEvidence && (
        <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, lineHeight: 1.4 }}>
          <strong>Telemetry:</strong> {telemetryEvidence}
        </div>
      )}

      {/* Why / Root Cause */}
      {whyRootCause && (
        <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, lineHeight: 1.4 }}>
          <strong>Why:</strong> {whyRootCause}
        </div>
      )}

      {/* Business Impact */}
      {businessImpact && (
        <div style={{ fontSize: '12px', color: TOKENS.colors.status.critical.text, fontWeight: 600 }}>
          <strong>Impact:</strong> {businessImpact}
        </div>
      )}

      {/* Action Strip */}
      {recommendedAction && (
        <div
          style={{
            marginTop: '4px',
            padding: '8px 10px',
            background: TOKENS.colors.surface.cardAlt,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.sm,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '12px', color: TOKENS.colors.text.primary }}>
            <strong>Action:</strong> {recommendedAction}
          </div>

          {onActionClick && (
            <button
              onClick={onActionClick}
              className="btn-primary"
              style={{ padding: '3px 8px', fontSize: '11px', flexShrink: 0 }}
            >
              <span>{actionLabel}</span>
              <ArrowRight size={11} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
