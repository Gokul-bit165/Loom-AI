import React from 'react';
import { ProductionSummary } from '@/lib/types';
import { AlertCircle, ArrowRight, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface HeroGreetingProps {
  summary: ProductionSummary;
  criticalMachineCount: number;
  onTriageClick: () => void;
}

export function HeroGreeting({
  summary,
  criticalMachineCount,
  onTriageClick,
}: HeroGreetingProps) {
  const efficiency = summary.average_efficiency;
  const shortfall = Math.abs(summary.variance_qty);
  const isBelowTarget = efficiency < 100;
  const dodChange = summary.change_vs_previous_day_pct;

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
      {/* Subtle geometric background pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
        <div className="w-64 h-64 rounded-full border-8 border-white/20" />
      </div>

      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-200 border border-white/15">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>DAILY OPERATIONS INTELLIGENCE BRIEFING</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Good Morning, Operations Team
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Plant output reached <strong className="text-white font-semibold">{summary.total_actual.toLocaleString()} units</strong> (
            <span className="text-amber-300 font-semibold">{efficiency.toFixed(1)}% efficiency</span>), running{' '}
            <strong className="text-rose-300 font-semibold">↓ {Math.abs(summary.variance_pct).toFixed(1)}% below target</strong>.
            The primary capacity shortfall ({shortfall.toLocaleString()} units) is concentrated in{' '}
            <strong className="text-white font-semibold">{criticalMachineCount} chronic underperforming units</strong>.
          </p>
        </div>

        {/* Action Callouts */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onTriageClick}
            className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center space-x-2"
          >
            <span>Triage {criticalMachineCount} Bottleneck Units</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="/ask"
            className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/20 text-xs font-semibold transition-colors flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Consult Decision Analyst</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
