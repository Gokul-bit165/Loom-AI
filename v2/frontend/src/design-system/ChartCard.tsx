import { TOKENS } from './tokens';
import { DataTrustBadge } from './DataTrustBadge';
import type { ProvenanceType } from './tokens';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  period?: string;
  metric?: string;
  units?: string;
  benchmark?: string;
  insightAnnotation?: string;
  provenance?: ProvenanceType | string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  period,
  metric,
  units,
  benchmark,
  insightAnnotation,
  provenance = 'CALCULATED',
  children,
  rightSlot,
}: ChartCardProps) {
  return (
    <div
      style={{
        background: TOKENS.colors.surface.card,
        border: `1px solid ${TOKENS.colors.surface.border}`,
        borderRadius: TOKENS.radius.md,
        padding: '14px 16px',
        boxShadow: TOKENS.shadows.card,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3
              style={{
                fontSize: TOKENS.typography.sizes.sectionHeading,
                fontWeight: 700,
                color: TOKENS.colors.text.primary,
                margin: 0,
              }}
            >
              {title}
            </h3>
            <DataTrustBadge provenance={provenance} compact />
          </div>

          <div style={{ display: 'flex', gap: '8px', fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted, marginTop: '2px' }}>
            {period && <span>Period: {period}</span>}
            {metric && <span>· Metric: {metric}</span>}
            {units && <span>({units})</span>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {benchmark && (
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.secondary }}>
              Benchmark: <strong style={{ color: TOKENS.colors.brand[700] }}>{benchmark}</strong>
            </div>
          )}
          {rightSlot}
        </div>
      </div>

      {subtitle && (
        <div style={{ fontSize: TOKENS.typography.sizes.bodySmall, color: TOKENS.colors.text.secondary }}>
          {subtitle}
        </div>
      )}

      {/* Chart Canvas Area */}
      <div style={{ minHeight: '180px', width: '100%' }}>{children}</div>

      {/* Structured Insight Annotation */}
      {insightAnnotation && (
        <div
          style={{
            borderTop: `1px solid ${TOKENS.colors.surface.canvas}`,
            paddingTop: '6px',
            fontSize: TOKENS.typography.sizes.metadata,
            color: TOKENS.colors.text.secondary,
            lineHeight: 1.4,
          }}
        >
          <strong>Trend Insight:</strong> {insightAnnotation}
        </div>
      )}
    </div>
  );
}
