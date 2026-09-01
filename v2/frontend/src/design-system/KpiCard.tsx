import { TOKENS } from './tokens';
import { StatusBadge } from './StatusBadge';
import { DataTrustBadge } from './DataTrustBadge';
import type { StatusType, ProvenanceType } from './tokens';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  variance?: string;
  trendDirection?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  status?: StatusType | string;
  statusLabel?: string;
  driver?: string;
  provenance?: ProvenanceType | string;
  onClick?: () => void;
}

export function KpiCard({
  label,
  value,
  unit,
  target,
  variance,
  trendDirection,
  trendLabel,
  status,
  statusLabel,
  driver,
  provenance = 'CALCULATED',
  onClick,
}: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: TOKENS.colors.surface.card,
        border: `1px solid ${TOKENS.colors.surface.border}`,
        borderRadius: TOKENS.radius.md,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: TOKENS.shadows.card,
        transition: 'border-color 0.12s ease, box-shadow 0.12s ease',
        minHeight: '102px',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = TOKENS.colors.brand[500];
          e.currentTarget.style.boxShadow = TOKENS.shadows.elevated;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = TOKENS.colors.surface.border;
          e.currentTarget.style.boxShadow = TOKENS.shadows.card;
        }
      }}
    >
      {/* Top Strip: Label + Provenance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span
          style={{
            fontSize: TOKENS.typography.sizes.metadata,
            fontWeight: 600,
            color: TOKENS.colors.text.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
        <DataTrustBadge provenance={provenance} compact />
      </div>

      {/* Main Metric Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', margin: '2px 0 4px 0' }}>
        <span
          style={{
            fontSize: TOKENS.typography.sizes.kpiPrimary,
            fontWeight: 800,
            fontFamily: TOKENS.typography.fontMono,
            color: TOKENS.colors.text.primary,
            lineHeight: 1.1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: TOKENS.typography.sizes.bodySmall, color: TOKENS.colors.text.secondary, fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>

      {/* Target & Trend Context Strip */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          fontSize: TOKENS.typography.sizes.metadata,
          color: TOKENS.colors.text.muted,
        }}
      >
        {target !== undefined && (
          <span>
            Target: <strong style={{ color: TOKENS.colors.text.secondary }}>{target}</strong>
          </span>
        )}

        {variance && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontWeight: 600,
              color:
                trendDirection === 'down'
                  ? TOKENS.colors.status.critical.text
                  : trendDirection === 'up'
                  ? TOKENS.colors.status.healthy.text
                  : TOKENS.colors.text.muted,
            }}
          >
            {trendDirection === 'down' && <ArrowDownRight size={12} />}
            {trendDirection === 'up' && <ArrowUpRight size={12} />}
            {trendDirection === 'flat' && <Minus size={12} />}
            {variance}
          </span>
        )}

        {trendLabel && <span>({trendLabel})</span>}

        {status && (
          <div style={{ marginLeft: 'auto' }}>
            <StatusBadge status={status} label={statusLabel} />
          </div>
        )}
      </div>

      {/* Driver Root-Cause Callout */}
      {driver && (
        <div
          style={{
            marginTop: '6px',
            paddingTop: '4px',
            borderTop: `1px solid ${TOKENS.colors.surface.canvas}`,
            fontSize: '11px',
            color: TOKENS.colors.text.secondary,
          }}
        >
          Driver: <span style={{ color: TOKENS.colors.text.primary, fontWeight: 500 }}>{driver}</span>
        </div>
      )}
    </div>
  );
}

interface KpiStripProps {
  children: React.ReactNode;
  columns?: number;
}

export function KpiStrip({ children, columns }: KpiStripProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: TOKENS.spacing[3],
        marginBottom: TOKENS.spacing[4],
      }}
    >
      {children}
    </div>
  );
}
