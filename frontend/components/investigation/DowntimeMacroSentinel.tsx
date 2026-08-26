import React from 'react';
import { BreakdownRankingData } from '@/lib/types';
import { Wrench, Clock, AlertOctagon, Calendar } from 'lucide-react';

interface DowntimeMacroSentinelProps {
  data: BreakdownRankingData;
  period: 'today' | 'month';
  onPeriodChange: (period: 'today' | 'month') => void;
}

export function DowntimeMacroSentinel({
  data,
  period,
  onPeriodChange,
}: DowntimeMacroSentinelProps) {
  const totalMinutes = data.total_downtime_minutes;
  const totalEvents = data.total_events;
  const avgDuration = totalEvents > 0 ? (totalMinutes / totalEvents).toFixed(1) : '0';
  const totalHours = (totalMinutes / 60).toFixed(1);
  const worstMachine = data.highest_downtime_machine;

  return (
    <div className="panel-command space-y-4 font-mono">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-command-700/60 text-xs">
        <div className="flex items-center space-x-2">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-command-100 uppercase tracking-wider">
            01 MECHANICAL DOWNTIME & CAPACITY LOSS SENTINEL
          </span>
        </div>

        {/* Analytical Mode Switcher */}
        <div className="flex items-center space-x-1.5 bg-command-950 border border-command-700/80 rounded p-1 shadow-xs text-xs font-bold">
          <button
            onClick={() => onPeriodChange('today')}
            className={`px-3 py-1 rounded transition-colors ${
              period === 'today'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-command-400 hover:text-command-100'
            }`}
          >
            Today's Operational Stoppages
          </button>
          <button
            onClick={() => onPeriodChange('month')}
            className={`px-3 py-1 rounded transition-colors ${
              period === 'month'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-command-400 hover:text-command-100'
            }`}
          >
            Month-to-Date (MTD) Chronic Patterns
          </button>
        </div>
      </div>

      {/* Hero Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Total Lost Capacity:</span>
          <span className="text-xl lg:text-2xl font-extrabold text-rose-400">
            {totalMinutes.toLocaleString()} mins
          </span>
          <span className="text-command-500 block text-[10px] mt-0.5 font-sans">
            ({totalHours} lost machine operating hours)
          </span>
        </div>

        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Stoppage Events:</span>
          <span className="text-xl lg:text-2xl font-extrabold text-command-100">
            {totalEvents} events
          </span>
          <span className="text-command-500 block text-[10px] mt-0.5 font-sans">
            Logged electrical/mechanical events
          </span>
        </div>

        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Average Stoppage:</span>
          <span className="text-xl lg:text-2xl font-extrabold text-command-100">
            {avgDuration} min
          </span>
          <span className="text-command-500 block text-[10px] mt-0.5 font-sans">
            Average repair/cleaning duration
          </span>
        </div>

        <div className="bg-command-850 p-3 rounded border border-command-700/60">
          <span className="text-command-500 block text-[11px] uppercase">Worst Stoppage Unit:</span>
          <span className="text-lg font-extrabold text-rose-400 truncate block">
            {worstMachine ? worstMachine.machine_id : 'None'}
          </span>
          <span className="text-command-500 block text-[10px] mt-0.5 font-sans">
            {worstMachine
              ? `${worstMachine.downtime_minutes} mins lost (${worstMachine.event_count} events)`
              : 'Zero downtime recorded'}
          </span>
        </div>
      </div>
    </div>
  );
}
