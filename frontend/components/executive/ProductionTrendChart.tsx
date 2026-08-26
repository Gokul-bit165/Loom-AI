'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, HelpCircle } from 'lucide-react';

interface TrendPoint {
  day: string;
  actual: number;
  target: number;
  efficiency: number;
}

// 14-day deterministic plant trajectory baseline
const BASELINE_14_DAYS: TrendPoint[] = [
  { day: '16 Aug', actual: 1720000, target: 1888200, efficiency: 91.1 },
  { day: '17 Aug', actual: 1735000, target: 1888200, efficiency: 91.9 },
  { day: '18 Aug', actual: 1740000, target: 1888200, efficiency: 92.2 },
  { day: '19 Aug', actual: 1715000, target: 1888200, efficiency: 90.8 },
  { day: '20 Aug', actual: 1750000, target: 1888200, efficiency: 92.7 },
  { day: '21 Aug', actual: 1748000, target: 1888200, efficiency: 92.6 },
  { day: '22 Aug', actual: 1762000, target: 1888200, efficiency: 93.3 },
  { day: '23 Aug', actual: 1755000, target: 1888200, efficiency: 92.9 },
  { day: '24 Aug', actual: 1740000, target: 1888200, efficiency: 92.2 },
  { day: '25 Aug', actual: 1750000, target: 1888200, efficiency: 92.7 },
  { day: '26 Aug', actual: 1758000, target: 1888200, efficiency: 93.1 },
  { day: '27 Aug', actual: 1752000, target: 1888200, efficiency: 92.8 },
  { day: '28 Aug', actual: 1761895, target: 1888200, efficiency: 93.3 },
  { day: '29 Aug (Today)', actual: 1765471, target: 1888200, efficiency: 93.5 },
];

export function ProductionTrendChart() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(BASELINE_14_DAYS.length - 1);

  const maxVal = 1950000;
  const minVal = 1650000;
  const svgWidth = 800;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 24;

  const getX = (index: number) =>
    paddingX + (index / (BASELINE_14_DAYS.length - 1)) * (svgWidth - 2 * paddingX);
  const getY = (val: number) =>
    svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 2 * paddingY);

  // Target line Y
  const targetY = getY(1888200);

  // Path data for Actual curve
  const points = BASELINE_14_DAYS.map((d, i) => `${getX(i)},${getY(d.actual)}`).join(' ');
  const areaPath = `${points} L ${getX(BASELINE_14_DAYS.length - 1)},${svgHeight - paddingY} L ${getX(0)},${svgHeight - paddingY} Z`;

  const activePoint = hoverIndex !== null ? BASELINE_14_DAYS[hoverIndex] : BASELINE_14_DAYS[BASELINE_14_DAYS.length - 1];

  return (
    <div className="panel-saas flex flex-col justify-between space-y-4 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-100">
        <div>
          <h3 className="font-semibold text-sm xl:text-base text-surface-900 uppercase tracking-wide">
            Production Performance Trajectory
          </h3>
          <p className="text-xs text-surface-500 font-normal">
            Actual delivered output vs planned target — Last 14 days
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-brand-600 rounded" />
            <span className="text-surface-600 font-medium">Actual Output</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
            <span className="text-surface-500 font-medium">100% Target (1.88M)</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart Surface */}
      <div className="relative w-full overflow-hidden flex-1 flex items-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-44 sm:h-52 xl:h-60 2xl:h-64 overflow-visible"
        >
          {/* Target Line (Dashed) */}
          <line
            x1={paddingX}
            y1={targetY}
            x2={svgWidth - paddingX}
            y2={targetY}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />

          {/* Area Under Curve */}
          <polygon points={areaPath} fill="rgba(37, 99, 235, 0.08)" />

          {/* Actual Line Curve */}
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Interactive Hover Dots */}
          {BASELINE_14_DAYS.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.actual);
            const isHovered = hoverIndex === i;
            const isToday = i === BASELINE_14_DAYS.length - 1;

            return (
              <g key={i} onMouseEnter={() => setHoverIndex(i)} className="cursor-pointer">
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : isToday ? 5 : 3.5}
                  className={`${
                    isHovered
                      ? 'fill-brand-600 stroke-white stroke-2'
                      : isToday
                      ? 'fill-brand-600'
                      : 'fill-slate-300'
                  }`}
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {activePoint && (
          <div className="absolute top-2 right-4 bg-surface-900 text-white text-[11px] sm:text-xs p-2.5 rounded-xl shadow-xl pointer-events-none space-y-0.5 border border-slate-700">
            <div className="font-semibold text-slate-200">{activePoint.day}</div>
            <div>
              Output: <strong className="text-white font-mono">{activePoint.actual.toLocaleString()} units</strong>
            </div>
            <div className="text-brand-300">
              Efficiency: <strong>{activePoint.efficiency}%</strong>
            </div>
          </div>
        )}
      </div>

      {/* Below Chart Metric Badges */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-surface-100 text-xs">
        <div className="bg-surface-50 p-3 rounded-xl border border-surface-200/70">
          <span className="text-[10px] text-surface-500 uppercase block font-medium">Today's Efficiency</span>
          <span className="text-base sm:text-lg font-bold text-surface-900 font-sans">93.5%</span>
        </div>

        <div className="bg-surface-50 p-3 rounded-xl border border-surface-200/70">
          <span className="text-[10px] text-surface-500 uppercase block font-medium">vs Yesterday</span>
          <span className="text-base sm:text-lg font-bold text-emerald-600 flex items-center space-x-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+0.20%</span>
          </span>
        </div>

        <div className="bg-surface-50 p-3 rounded-xl border border-surface-200/70">
          <span className="text-[10px] text-surface-500 uppercase block font-medium">Capacity Deficit</span>
          <span className="text-base sm:text-lg font-bold text-rose-600">-6.49%</span>
        </div>
      </div>
    </div>
  );
}
