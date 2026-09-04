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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#64748b',
                marginBottom: '2px',
                fontWeight: 500,
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
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '3px 0 0 0',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: '#64748b', borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
          {unit && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Factory size={13} color="#2563eb" />
              <span>Unit: <strong style={{ color: '#0f172a' }}>{unit}</strong></span>
            </span>
          )}
          {date && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} color="#64748b" />
              <span>Date: <strong style={{ color: '#0f172a' }}>{date}</strong></span>
            </span>
          )}
          {dataFreshness && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
              <Clock size={11} color="#94a3b8" />
              <span>{dataFreshness}</span>
            </span>
          )}
        </div>
      </div>

      {actions && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
