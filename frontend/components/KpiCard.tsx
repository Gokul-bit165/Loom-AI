import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'positive' | 'negative' | 'neutral' | 'warning';
  };
  icon?: LucideIcon;
  details?: Array<{ label: string; value: string | number }>;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  details,
  className = '',
}: KpiCardProps) {
  const getBadgeClass = (variant: string) => {
    switch (variant) {
      case 'positive':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'negative':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className={`card-industrial ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      </div>

      <div className="flex items-baseline space-x-2 my-1">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium border ${getBadgeClass(
              badge.variant
            )}`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500 mb-3">{subtitle}</p>}

      {details && details.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          {details.map((d, i) => (
            <div key={i}>
              <span className="text-slate-400 block text-[11px]">{d.label}</span>
              <span className="font-semibold text-slate-700">{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
