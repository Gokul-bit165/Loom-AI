import React from 'react';
import { BarChart3, Search, AlertTriangle, IndianRupee } from 'lucide-react';

export type BreakdownModuleTab = 'insights' | 'root-cause' | 'abnormal' | 'loss-impact';

interface BreakdownSubNavProps {
  currentTab: BreakdownModuleTab;
  onSelectTab: (tab: BreakdownModuleTab) => void;
}

const TABS: { id: BreakdownModuleTab; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'insights', label: 'Breakdown Insights', icon: <BarChart3 size={14} /> },
  { id: 'root-cause', label: 'Root Cause Investigation', icon: <Search size={14} /> },
  { id: 'abnormal', label: 'Anomalies & Patterns', icon: <AlertTriangle size={14} /> },
  { id: 'loss-impact', label: 'Production Loss Impact', icon: <IndianRupee size={14} /> },
];

export function BreakdownSubNav({ currentTab, onSelectTab }: BreakdownSubNavProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      margin: '0 24px 18px',
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      padding: '6px 8px',
    }}>
      <span style={{
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: '#64748B',
        padding: '0 8px 0 4px',
        borderRight: '1px solid #E2E8F0',
      }}>
        Breakdowns Console
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 600,
                color: isActive ? '#0F172A' : '#475569',
                background: isActive ? '#F1F5F9' : 'transparent',
                border: isActive ? '1px solid #CBD5E1' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ color: isActive ? '#0F172A' : '#64748B' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
