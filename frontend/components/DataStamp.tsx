'use client';
import React from 'react';
import { fmtDatetime } from '@/lib/utils';

interface DataStampProps {
  asOf: string | null;
  source?: string;
  isDemo?: boolean;
  rows?: number;
}

/** Shows "Data as of DD Mon, HH:MM — N rows — [DEMO]" */
export function DataStamp({ asOf, source, isDemo = false, rows }: DataStampProps) {
  return (
    <span className={`data-stamp${isDemo ? ' demo' : ''}`}>
      {isDemo && <span style={{ fontWeight: 700 }}>DEMO</span>}
      {asOf ? (
        <>Data as of {fmtDatetime(asOf)}</>
      ) : (
        <>No data available</>
      )}
      {rows !== undefined && <> · {rows.toLocaleString('en-IN')} rows</>}
      {source && <> · {source}</>}
    </span>
  );
}
