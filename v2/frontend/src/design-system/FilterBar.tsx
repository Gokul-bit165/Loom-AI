import { TOKENS } from './tokens';
import { Filter, RotateCcw } from 'lucide-react';

export interface FilterItem {
  id: string;
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (val: string) => void;
}

interface FilterBarProps {
  filters: FilterItem[];
  onReset?: () => void;
  activeCount?: number;
  rightSlot?: React.ReactNode;
}

export function FilterBar({ filters, onReset, activeCount, rightSlot }: FilterBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: TOKENS.colors.surface.card,
        border: `1px solid ${TOKENS.colors.surface.border}`,
        borderRadius: TOKENS.radius.md,
        padding: '8px 14px',
        marginBottom: TOKENS.spacing[4],
        gap: TOKENS.spacing[3],
        flexWrap: 'wrap',
        boxShadow: TOKENS.shadows.card,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: TOKENS.typography.sizes.metadata,
            color: TOKENS.colors.text.secondary,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <Filter size={13} color="#2563EB" />
          <span>Filters</span>
          {activeCount !== undefined && activeCount > 0 && (
            <span
              style={{
                background: TOKENS.colors.brand[600],
                color: '#FFF',
                padding: '1px 5px',
                borderRadius: TOKENS.radius.pill,
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              {activeCount}
            </span>
          )}
        </div>

        {filters.map((f) => (
          <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted, fontWeight: 500 }}>
              {f.label}:
            </label>
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              style={{
                background: '#FFFFFF',
                color: TOKENS.colors.text.primary,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.sm,
                padding: '5px 8px',
                fontSize: TOKENS.typography.sizes.bodySmall,
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {onReset && (
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: TOKENS.colors.text.muted,
              fontSize: TOKENS.typography.sizes.metadata,
              cursor: 'pointer',
              padding: '4px 6px',
            }}
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {rightSlot && <div>{rightSlot}</div>}
    </div>
  );
}
