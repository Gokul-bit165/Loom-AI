'use client';

import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  isLoading?: boolean;
}

export function DateSelector({ currentDate, onDateChange, isLoading = false }: DateSelectorProps) {
  const stepDate = (days: number) => {
    try {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + days);
      const iso = d.toISOString().split('T')[0];
      onDateChange(iso);
    } catch {
      // ignore invalid date
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
      <div className="flex items-center space-x-2 px-2 text-slate-700">
        <Calendar className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Plant Date:
        </span>
      </div>

      <button
        onClick={() => stepDate(-1)}
        disabled={isLoading}
        className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-50"
        title="Previous day"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <input
        type="date"
        value={currentDate}
        onChange={(e) => onDateChange(e.target.value)}
        disabled={isLoading}
        className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <button
        onClick={() => stepDate(1)}
        disabled={isLoading}
        className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-50"
        title="Next day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
