import { TOKENS } from './tokens';
import { Factory, Calendar, Clock } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  unit?: string;
  date?: string;
  dataFreshness?: string;
  breadcrumbs?: string[];
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  unit = 'ATM Main Shed',
  date = '31-Jul-2026',
  dataFreshness = 'Updated 4 min ago',
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: TOKENS.spacing[3],
        borderBottom: `1px solid ${TOKENS.colors.surface.border}`,
        marginBottom: TOKENS.spacing[4],
        gap: TOKENS.spacing[4],
      }}
    >
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: TOKENS.typography.sizes.metadata,
              color: TOKENS.colors.text.muted,
              marginBottom: TOKENS.spacing[1],
            }}
          >
            {breadcrumbs.map((b, i) => (
              <span key={i}>
                {b} {i < breadcrumbs.length - 1 && ' / '}
              </span>
            ))}
          </div>
        )}

        <h1
          style={{
            fontSize: TOKENS.typography.sizes.pageTitle,
            fontWeight: 700,
            color: TOKENS.colors.text.primary,
            letterSpacing: '-0.01em',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              fontSize: TOKENS.typography.sizes.bodySmall,
              color: TOKENS.colors.text.secondary,
              marginTop: '4px',
              margin: '4px 0 0 0',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: TOKENS.typography.sizes.metadata }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: TOKENS.colors.text.secondary }}>
            <Factory size={13} color="#2563EB" />
            <strong>{unit}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: TOKENS.colors.text.secondary }}>
            <Calendar size={13} color="#6B7280" />
            <span>{date}</span>
          </span>
        </div>

        {dataFreshness && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: TOKENS.colors.text.muted,
            }}
          >
            <Clock size={11} color="#9CA3AF" />
            <span>{dataFreshness}</span>
          </div>
        )}

        {actions && <div style={{ marginTop: '4px' }}>{actions}</div>}
      </div>
    </div>
  );
}
