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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        minHeight: '108px',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = '#2563eb';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(15, 23, 42, 0.06)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(15, 23, 42, 0.04)';
        }
      }}
    >
      {/* Top Strip: Label + Provenance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
        <DataTrustBadge provenance={provenance} compact />
      </div>

      {/* Main Metric Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '2px 0 6px 0' }}>
        <span
          style={{
            fontSize: '26px',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            color: '#0f172a',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
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
