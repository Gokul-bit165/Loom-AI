import type { StatusType } from './tokens';
import { TOKENS } from './tokens';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  metric?: string;
}

export function StatusBadge({ status, label, metric }: StatusBadgeProps) {
  const norm = (status || 'HEALTHY').toUpperCase();
  let conf: { bg: string; border: string; text: string; label: string } = TOKENS.colors.status.info;

  if (
    norm === 'CRITICAL' ||
    norm === 'RED' ||
    norm === 'REJECT_RISK' ||
    norm === 'OVERDUE' ||
    norm === 'EXCESS_LEAK' ||
    norm === 'BELOW TARGET'
  ) {
    conf = TOKENS.colors.status.critical;
  } else if (
    norm === 'WARNING' ||
    norm === 'ATTENTION' ||
    norm === 'AMBER' ||
    norm === 'WATCH' ||
    norm === 'MONITOR' ||
    norm === 'BELOW'
  ) {
    conf = TOKENS.colors.status.warning;
  } else if (
    norm === 'HEALTHY' ||
    norm === 'GREEN' ||
    norm === 'NORMAL' ||
    norm === 'COMPLETED' ||
    norm === 'PASSED' ||
    norm === 'EXCEEDS' ||
    norm === 'ON TARGET'
  ) {
    conf = TOKENS.colors.status.healthy;
  } else if (norm === 'DISABLED' || norm === 'GREY' || norm === 'N/A') {
    conf = TOKENS.colors.status.disabled;
  }

  const text = label || conf.label;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 7px',
        fontSize: TOKENS.typography.sizes.metadata,
        fontWeight: 600,
        borderRadius: TOKENS.radius.sm,
        background: conf.bg,
        border: `1px solid ${conf.border}`,
        color: conf.text,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{text}</span>
      {metric && <span style={{ opacity: 0.85, fontWeight: 500 }}>· {metric}</span>}
    </span>
  );
}
