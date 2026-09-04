import React from 'react';
import { Clock, Factory, AlertTriangle, Zap, Calendar, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { TriageSummary } from '../../api';

interface ProductionHeaderProps {
  unitCode: string;
  workDate: string;
  onSelectDate?: (date: string) => void;
  viewMode: 'OWNER' | 'OPERATIONS';
  onToggleViewMode: (mode: 'OWNER' | 'OPERATIONS') => void;
  activeTriageFilter: 'ALL' | 'ATTENTION' | 'CRITICAL' | 'RECOVERY';
  onSelectTriageFilter: (filter: 'ALL' | 'ATTENTION' | 'CRITICAL' | 'RECOVERY') => void;
  triage: TriageSummary;
  qualityScorePct: number;
}

export const ProductionHeader: React.FC<ProductionHeaderProps> = ({
  unitCode,
  workDate,
  onSelectDate,
  viewMode,
  onToggleViewMode,
  activeTriageFilter,
  onSelectTriageFilter,
  triage,
  qualityScorePct,
}) => {
  const isToday = workDate === '2026-07-31';

  const handlePrevDay = () => {
    if (!onSelectDate) return;
    const curr = new Date(workDate);
    curr.setDate(curr.getDate() - 1);
    const prevStr = curr.toISOString().split('T')[0];
    if (prevStr >= '2026-07-01') onSelectDate(prevStr);
  };

  const handleNextDay = () => {
    if (!onSelectDate) return;
    const curr = new Date(workDate);
    curr.setDate(curr.getDate() + 1);
    const nextStr = curr.toISOString().split('T')[0];
    if (nextStr <= '2026-07-31') onSelectDate(nextStr);
  };

  return (
    <header className="production-header" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E6EA',
      padding: '12px 20px',
    }}>
      {/* Top row: Title, metadata, view toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Factory size={18} color="#2563EB" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
                Production
              </h1>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Daily production decision workspace</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span>{unitCode} — Weaving Division</span>
              <span>•</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>{workDate}</span>
              <span>•</span>
              {isToday ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#16A34A', fontWeight: 600 }}>
                  <Clock size={11} />
                  Live (Updated 2m ago)
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D97706', fontWeight: 600 }}>
                  <Calendar size={11} />
                  Historical Shift Record
                </span>
              )}
              <span>•</span>
              <span style={{ color: '#64748B' }}>Data Quality: {qualityScorePct}%</span>
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          padding: '3px',
          borderRadius: '6px',
          border: '1px solid #E2E6EA',
          fontSize: '12px',
          fontWeight: 600,
        }}>
          <button
            onClick={() => onToggleViewMode('OWNER')}
            style={{
              background: viewMode === 'OWNER' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'OWNER' ? '#0F172A' : '#64748B',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: viewMode === 'OWNER' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Owner View
          </button>
          <button
            onClick={() => onToggleViewMode('OPERATIONS')}
            style={{
              background: viewMode === 'OPERATIONS' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'OPERATIONS' ? '#0F172A' : '#64748B',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: viewMode === 'OPERATIONS' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Operations View
          </button>
        </div>
      </div>

      {/* Historical Date Navigation & Audit Presets */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        background: isToday ? '#F8FAFC' : '#FFFBEB',
        border: `1px solid ${isToday ? '#E2E8F0' : '#FDE68A'}`,
        borderRadius: '6px',
        padding: '6px 12px',
      }}>
        {/* Left: Day Step & Native Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handlePrevDay}
            disabled={workDate <= '2026-07-01'}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              padding: '4px 7px',
              fontSize: '11px',
              fontWeight: 600,
              color: workDate <= '2026-07-01' ? '#94A3B8' : '#334155',
              cursor: workDate <= '2026-07-01' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
            title="Previous Day"
          >
            <ChevronLeft size={13} />
            <span>Prev</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '4px',
            padding: '3px 8px',
          }}>
            <Calendar size={13} color="#2563EB" />
            <input
              type="date"
              value={workDate}
              min="2026-07-01"
              max="2026-07-31"
              onChange={(e) => onSelectDate?.(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                background: 'transparent',
              }}
            />
          </div>

          <button
            onClick={handleNextDay}
            disabled={workDate >= '2026-07-31'}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              padding: '4px 7px',
              fontSize: '11px',
              fontWeight: 600,
              color: workDate >= '2026-07-31' ? '#94A3B8' : '#334155',
              cursor: workDate >= '2026-07-31' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
            title="Next Day"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Center: Quick Past Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginRight: '2px' }}>
            Past Dates:
          </span>
          {[
            { date: '2026-07-31', label: '31 Jul (Today)' },
            { date: '2026-07-30', label: '30 Jul' },
            { date: '2026-07-29', label: '29 Jul' },
            { date: '2026-07-28', label: '28 Jul' },
            { date: '2026-07-25', label: '25 Jul' },
            { date: '2026-07-20', label: '20 Jul' },
            { date: '2026-07-15', label: '15 Jul' },
            { date: '2026-07-01', label: '01 Jul' },
          ].map((preset) => {
            const isSel = workDate === preset.date;
            return (
              <button
                key={preset.date}
                onClick={() => onSelectDate?.(preset.date)}
                style={{
                  background: isSel ? '#2563EB' : '#FFFFFF',
                  color: isSel ? '#FFFFFF' : '#475569',
                  border: `1px solid ${isSel ? '#2563EB' : '#CBD5E1'}`,
                  borderRadius: '4px',
                  padding: '3px 7px',
                  fontSize: '10.5px',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.1s ease',
                }}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Right: Reset to today if looking at past */}
        {!isToday && (
          <button
            onClick={() => onSelectDate?.('2026-07-31')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#F59E0B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 9px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Reset view to latest live date"
          >
            <RotateCcw size={11} />
            <span>Return to Latest (31 Jul)</span>
          </button>
        )}
      </div>

      {/* Triage Bar: Exception-first filtering */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
        <button
          onClick={() => onSelectTriageFilter('ALL')}
          style={{
            background: activeTriageFilter === 'ALL' ? '#1E293B' : '#F8FAFC',
            color: activeTriageFilter === 'ALL' ? '#FFFFFF' : '#334155',
            border: '1px solid',
            borderColor: activeTriageFilter === 'ALL' ? '#1E293B' : '#CBD5E1',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{triage.total_looms} ALL LOOMS</span>
        </button>

        <button
          onClick={() => onSelectTriageFilter('ATTENTION')}
          style={{
            background: activeTriageFilter === 'ATTENTION' ? '#FEF3C7' : '#FFFFFF',
            color: '#92400E',
            border: '1px solid',
            borderColor: activeTriageFilter === 'ATTENTION' ? '#F59E0B' : '#E2E8F0',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <AlertTriangle size={12} color="#D97706" />
          <span>{triage.attention_count} NEED ATTENTION</span>
        </button>

        <button
          onClick={() => onSelectTriageFilter('CRITICAL')}
          style={{
            background: activeTriageFilter === 'CRITICAL' ? '#FEE2E2' : '#FFFFFF',
            color: '#991B1B',
            border: '1px solid',
            borderColor: activeTriageFilter === 'CRITICAL' ? '#EF4444' : '#E2E8F0',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626' }} />
          <span>{triage.critical_count} HIGH IMPACT</span>
        </button>

        <button
          onClick={() => onSelectTriageFilter('RECOVERY')}
          style={{
            background: activeTriageFilter === 'RECOVERY' ? '#EFF6FF' : '#FFFFFF',
            color: '#1E40AF',
            border: '1px solid',
            borderColor: activeTriageFilter === 'RECOVERY' ? '#3B82F6' : '#E2E8F0',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Zap size={12} color="#2563EB" />
          <span>3 POTENTIAL RECOVERY</span>
        </button>
      </div>
    </header>
  );
};
