import { useState, useMemo } from 'react';
import { TOKENS } from './tokens';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  width?: string;
  sortBy?: (row: T) => any;
}

interface IndustrialTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  initialLimit?: number;
  stickyHeader?: boolean;
  emptyMessage?: string;
}

export function IndustrialTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  initialLimit = 10,
  stickyHeader = false,
  emptyMessage = 'No records available.',
}: IndustrialTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSort = (col: ColumnDef<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortKey(null);
        setSortDir('asc');
      }
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const safeData = data || [];

  const sortedData = useMemo(() => {
    if (!sortKey) return safeData;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return safeData;

    return [...safeData].sort((a, b) => {
      let valA = col.sortBy ? col.sortBy(a) : (a as any)[sortKey];
      let valB = col.sortBy ? col.sortBy(b) : (b as any)[sortKey];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [safeData, sortKey, sortDir, columns]);

  const displayedData = isExpanded ? sortedData : (sortedData || []).slice(0, initialLimit);
  const hasMore = (sortedData || []).length > initialLimit;

  return (
    <div
      style={{
        background: TOKENS.colors.surface.card,
        border: `1px solid ${TOKENS.colors.surface.border}`,
        borderRadius: TOKENS.radius.md,
        overflow: 'hidden',
        boxShadow: TOKENS.shadows.card,
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: TOKENS.typography.sizes.bodySmall,
            textAlign: 'left',
          }}
        >
          <thead>
            <tr
              style={{
                background: TOKENS.colors.surface.cardAlt,
                borderBottom: `1px solid ${TOKENS.colors.surface.border}`,
                position: stickyHeader ? 'sticky' : 'static',
                top: 0,
                zIndex: 2,
              }}
            >
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: isSorted ? TOKENS.colors.brand[600] : TOKENS.colors.text.muted,
                      textAlign: col.align || 'left',
                      width: col.width,
                      cursor: col.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent:
                          col.align === 'right'
                            ? 'flex-end'
                            : col.align === 'center'
                            ? 'center'
                            : 'flex-start',
                      }}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span style={{ opacity: isSorted ? 1 : 0.4 }}>
                          {isSorted ? (
                            sortDir === 'asc' ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
                            )
                          ) : (
                            <ChevronsUpDown size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: TOKENS.colors.text.muted,
                    fontSize: TOKENS.typography.sizes.bodySmall,
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayedData.map((row, idx) => (
                <tr
                  key={keyExtractor(row, idx)}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    borderBottom: `1px solid ${TOKENS.colors.surface.border}`,
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = TOKENS.colors.surface.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: '7px 12px',
                        textAlign: col.align || 'left',
                        color: TOKENS.colors.text.primary,
                        verticalAlign: 'middle',
                        fontFamily: col.align === 'right' ? TOKENS.typography.fontMono : 'inherit',
                      }}
                    >
                      {col.render ? col.render(row, idx) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 14px',
            background: TOKENS.colors.surface.cardAlt,
            borderTop: `1px solid ${TOKENS.colors.surface.border}`,
            fontSize: TOKENS.typography.sizes.metadata,
            color: TOKENS.colors.text.muted,
          }}
        >
          <span>
            Showing {displayedData.length} of {sortedData.length} rows
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.sm,
              padding: '3px 8px',
              fontSize: TOKENS.typography.sizes.metadata,
              color: TOKENS.colors.brand[600],
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isExpanded ? `Show Top ${initialLimit}` : `View All (${sortedData.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
