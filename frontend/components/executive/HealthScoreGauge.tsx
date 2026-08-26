import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

interface HealthScoreGaugeProps {
  efficiency: number;
  downtimeMinutes: number;
  revenueRealizedPct?: number;
}

export function HealthScoreGauge({
  efficiency = 93.5,
  downtimeMinutes = 2698,
  revenueRealizedPct = 96.4,
}: HealthScoreGaugeProps) {
  // Mechanical reliability score (100 - (downtime / total plant available time %))
  const mechanicalScore = Math.max(70, Math.min(100, 100 - (downtimeMinutes / (59 * 24 * 60)) * 100 * 5)).toFixed(1);
  const overallStatus = efficiency >= 95 ? 'OPTIMAL' : efficiency >= 90 ? 'ATTENTION' : 'CRITICAL';

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, efficiency)) / 100) * circumference;

  return (
    <div className="panel-saas flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-surface-100">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-brand-600" />
          <h3 className="font-semibold text-sm text-surface-900 uppercase tracking-wide">
            Plant Health Score
          </h3>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            overallStatus === 'OPTIMAL'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {overallStatus === 'OPTIMAL' ? 'Healthy Operation' : 'Attention Required'}
        </span>
      </div>

      {/* Center Radial Visualizer */}
      <div className="flex items-center justify-center py-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-surface-100"
              fill="transparent"
            />
            {/* Progress Fill */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-amber-500 transition-all duration-700 ease-out"
              fill="transparent"
            />
          </svg>

          {/* Value Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-surface-900 tracking-tight">
              {efficiency.toFixed(1)}%
            </span>
            <span className="text-[11px] font-medium text-surface-500">Overall Yield</span>
          </div>
        </div>
      </div>

      {/* Sub-Pillar Breakdown */}
      <div className="space-y-2 pt-2 border-t border-surface-100 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-surface-600">Production Capacity:</span>
          <span className="font-semibold text-surface-900">{efficiency.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-surface-600">Mechanical Reliability:</span>
          <span className="font-semibold text-surface-900">{mechanicalScore}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-surface-600">Commercial Realization:</span>
          <span className="font-semibold text-surface-900">{revenueRealizedPct}%</span>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-2.5 text-[11px] text-amber-800 flex items-start space-x-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <span>Output is 6.5% below planned commitment. 4 underperforming machines driving the gap.</span>
      </div>
    </div>
  );
}
