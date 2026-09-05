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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px 16px',
        marginBottom: '16px',
        gap: '12px',
        flexWrap: 'wrap',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            color: '#334155',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <Filter size={13} color="#2563eb" />
          <span>Filters</span>
          {activeCount !== undefined && activeCount > 0 && (
            <span
              style={{
                background: '#2563eb',
                color: '#ffffff',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: 600,
              }}
            >
              {activeCount}
            </span>
          )}
        </div>

        {filters.map((f) => (
          <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              {f.label}:
            </label>
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              style={{
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
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
