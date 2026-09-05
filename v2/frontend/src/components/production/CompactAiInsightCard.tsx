import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { AiInsightLead } from '../../api';

interface CompactAiInsightCardProps {
  lead: AiInsightLead;
  onExplain: () => void;
}

export const CompactAiInsightCard: React.FC<CompactAiInsightCardProps> = ({
  lead,
  onExplain,
}) => {
  return (
    <div className="compact-ai-insight-card" style={{
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderLeft: '4px solid #2563EB',
      borderRadius: '6px',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Sparkles size={16} color="#2563EB" />
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            AI Synthesis & Dominant Drag
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A', marginTop: '1px' }}>
            {lead.headline} <span style={{ fontWeight: 400, color: '#475569' }}>{lead.summary}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onExplain}
        style={{
          background: '#FFFFFF',
          border: '1px solid #CBD5E1',
          color: '#1E40AF',
          fontSize: '11.5px',
          fontWeight: 700,
          padding: '5px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <span>[Explain]</span>
        <ArrowRight size={12} />
      </button>
    </div>
  );
};
