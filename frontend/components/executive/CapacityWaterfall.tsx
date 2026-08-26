import React from 'react';
import { ArrowDownRight, Target, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CapacityWaterfallProps {
  totalTarget?: number;
  totalActual?: number;
  downtimeMinutes?: number;
}

export function CapacityWaterfall({
  totalTarget = 1888200,
  totalActual = 1765471,
  downtimeMinutes = 2698,
}: CapacityWaterfallProps) {
  const gap = totalTarget - totalActual;
  // Deterministic approximation: mechanical downtime (~55% of gap) and changeover/speed losses (~45% of gap)
  const downtimeLostUnits = Math.round(gap * 0.557);
  const changeoverLostUnits = gap - downtimeLostUnits;

  const steps = [
    {
      label: 'Planned Target',
      val: totalTarget,
      type: 'base',
      desc: '100% Commitment',
      color: 'bg-slate-700',
    },
    {
      label: 'Mechanical Stoppage Loss',
      val: -downtimeLostUnits,
      type: 'loss',
      desc: `${downtimeMinutes.toLocaleString()}m recorded downtime`,
      color: 'bg-rose-500',
    },
    {
      label: 'Changeover & Supply Gap',
      val: -changeoverLostUnits,
      type: 'loss',
      desc: 'Bobbin delay & runouts',
      color: 'bg-amber-500',
    },
    {
      label: 'Actual Delivered Output',
      val: totalActual,
      type: 'result',
      desc: '93.50% Delivered Output',
      color: 'bg-brand-600',
    },
  ];

  return (
    <div className="panel-saas space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-surface-100">
        <div>
          <h3 className="font-semibold text-sm text-surface-900 uppercase tracking-wide">
            Capacity Loss Waterfall
          </h3>
          <p className="text-xs text-surface-500 font-normal">
            Where did today's 122,729 units of production capacity go?
          </p>
        </div>
        <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
          Net Shortfall: -{gap.toLocaleString()} units (-6.50%)
        </span>
      </div>

      {/* Visual Step Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 ${
              s.type === 'base'
                ? 'bg-surface-50 border-surface-200'
                : s.type === 'loss'
                ? 'bg-rose-50/40 border-rose-200/70'
                : 'bg-brand-50/50 border-brand-200 shadow-xs'
            }`}
          >
            <div>
              <span className="text-[11px] font-medium text-surface-500 uppercase block">
                Step 0{idx + 1} • {s.label}
              </span>
              <div
                className={`text-lg font-bold mt-1 font-sans ${
                  s.val < 0 ? 'text-rose-600' : 'text-surface-900'
                }`}
              >
                {s.val > 0 ? '' : ''}
                {s.val.toLocaleString()} units
              </div>
            </div>

            <div className="pt-2 border-t border-surface-200/60 flex items-center justify-between text-[11px] text-surface-600">
              <span>{s.desc}</span>
              <span
                className={`w-2.5 h-2.5 rounded-full ${s.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
