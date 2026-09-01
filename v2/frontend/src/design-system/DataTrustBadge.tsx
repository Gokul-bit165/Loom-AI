import type { ProvenanceType } from './tokens';
import { TOKENS } from './tokens';

interface DataTrustBadgeProps {
  provenance: ProvenanceType | string;
  compact?: boolean;
}

export function DataTrustBadge({ provenance, compact = false }: DataTrustBadgeProps) {
  const norm = (provenance || 'CALCULATED').toUpperCase();
  let conf: { bg: string; border: string; text: string; label: string } = TOKENS.colors.provenance.calculated;

  if (norm === 'ACTUAL' || norm === 'MEASURED' || norm === 'ERP' || norm === 'SENSOR') {
    conf = TOKENS.colors.provenance.actual;
  } else if (norm === 'CALCULATED' || norm === 'DETERMINISTIC') {
    conf = TOKENS.colors.provenance.calculated;
  } else if (norm === 'ESTIMATED' || norm === 'APPROX') {
    conf = TOKENS.colors.provenance.estimated;
  } else if (norm === 'PREDICTED' || norm === 'MODEL' || norm === 'ML') {
    conf = TOKENS.colors.provenance.predicted;
  }

  return (
    <span
      title={`Data Provenance: ${conf.label}`}
      style={{
        display: 'inline-block',
        padding: compact ? '1px 4px' : '2px 6px',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.04em',
        borderRadius: '3px',
        background: conf.bg,
        border: `1px solid ${conf.border}`,
        color: conf.text,
        textTransform: 'uppercase',
      }}
    >
      {compact ? conf.label.substring(0, 4) : conf.label}
    </span>
  );
}
