'use client';
import React from 'react';
import { rupee, pct, inr } from '@/lib/utils';

interface FormulaHintProps {
  formula: string;
  assumptions?: string;
}

/** ⓘ icon with hover tooltip showing the formula and cost assumptions */
export function FormulaHint({ formula, assumptions }: FormulaHintProps) {
  return (
    <span
      className="formula-hint"
      title={assumptions ? `${formula}\n\n${assumptions}` : formula}
      aria-label={`Formula: ${formula}`}
      role="img"
    >
      ⓘ
    </span>
  );
}

interface RupeeWithHintProps {
  value: number;
  formula: string;
  assumptions?: string;
  decimals?: number;
}

/** ₹ value with formula tooltip */
export function RupeeWithHint({ value, formula, assumptions, decimals = 0 }: RupeeWithHintProps) {
  return (
    <span className="num" style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {rupee(value, decimals)}
      <FormulaHint formula={formula} assumptions={assumptions} />
    </span>
  );
}
