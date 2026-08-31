'use client';
import React from 'react';

type Status = 'critical' | 'warn' | 'ok' | 'nodata';

interface StatusBadgeProps {
  status: Status;
  label: string;
  icon?: string;
  className?: string;
}

const ICON: Record<Status, string> = {
  critical: '▼',
  warn:     '▾',
  ok:       '▲',
  nodata:   '—',
};

export function StatusBadge({ status, label, icon, className = '' }: StatusBadgeProps) {
  return (
    <span className={`badge badge-${status} num ${className}`}>
      {icon ?? ICON[status]} {label}
    </span>
  );
}

/** Dot indicator — used in tables */
export function StatusDot({ status }: { status: Status }) {
  const bg: Record<Status, string> = {
    critical: 'var(--critical)',
    warn:     'var(--warn)',
    ok:       'var(--ok)',
    nodata:   'var(--nodata)',
  };
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8, height: 8,
        borderRadius: '50%',
        background: bg[status],
        flexShrink: 0,
      }}
      aria-hidden="true"
    />
  );
}
