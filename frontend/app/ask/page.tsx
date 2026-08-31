'use client';
import React, { useState } from 'react';
import { api } from '@/lib/api';
import { DataStamp } from '@/components/DataStamp';
import { StatusBadge } from '@/components/StatusBadge';
import type { AskAssistantResponse } from '@/lib/types';

// The 23 management questions as tappable presets
// Q14, Q15–Q17, Q18–Q19 are marked with their blocking reason
const QUESTIONS = [
  { id: 'Q1',  text: 'Target vs actual production, efficiency, and variance today', available: true },
  { id: 'Q2',  text: 'Standard vs actual warp/weft time, extra time, and revenue loss', available: true },
  { id: 'Q3',  text: 'Highest and lowest production and efficiency; best and worst loom', available: true },
  { id: 'Q4',  text: 'Weekly and monthly production by loom', available: true },
  { id: 'Q5',  text: 'Which loom has highest downtime and most breakdowns?', available: true },
  { id: 'Q6',  text: 'Average downtime, breakdown reasons, abnormal patterns', available: true },
  { id: 'Q7',  text: 'Production and revenue lost to breakdowns; worst shift', available: true },
  { id: 'Q8',  text: 'Operators present and absent today; shift attendance', available: false, blockedBy: 'employee + loom_assignment table — awaiting HR data' },
  { id: 'Q9',  text: 'Operator highest and lowest production and efficiency', available: false, blockedBy: 'employee + loom_assignment table — awaiting HR data' },
  { id: 'Q10', text: 'Effect of absenteeism on production', available: false, blockedBy: 'employee + loom_assignment table — awaiting HR data' },
  { id: 'Q11', text: 'Operator grade vs loom allotment (8-looms + 97.5% standard)', available: false, blockedBy: 'employee table — awaiting grade master' },
  { id: 'Q12', text: 'Looms requiring or overdue for preventive maintenance', available: false, blockedBy: 'maintenance_records table — no PM schedule loaded yet' },
  { id: 'Q13', text: 'Scheduled vs extra maintenance; repeated issues on same loom', available: false, blockedBy: 'maintenance_records table — no PM schedule loaded yet' },
  { id: 'Q14', text: 'AI prediction of potential loom breakdowns', available: false, blockedBy: 'Requires ≥6 months labelled stop history. Not enough data yet.' },
  { id: 'Q15', text: 'Standard vs actual CFM; excessive air consumption', available: false, blockedBy: 'Compressor flow meter not instrumented — utility_reading table empty' },
  { id: 'Q16', text: 'Compressor air loss and estimated cost', available: false, blockedBy: 'Compressor flow meter not instrumented — utility_reading table empty' },
  { id: 'Q17', text: 'Compressor consumption by day/week/month, quality, loom', available: false, blockedBy: 'Compressor flow meter not instrumented — utility_reading table empty' },
  { id: 'Q18', text: 'Fabric defect %, highest-defect loom and style, major defect causes', available: false, blockedBy: 'quality_inspection feed not connected — quality_records table empty' },
  { id: 'Q19', text: 'Standard vs abnormal crimp %', available: false, blockedBy: 'Crimp % not measured per loom — lab feed required' },
  { id: 'Q20', text: 'Yarn waste % today; worst shift', available: false, blockedBy: 'Yarn waste register not ingested — awaiting data source' },
  { id: 'Q21', text: "Today's and monthly revenue; highest and lowest revenue loom and style", available: true },
  { id: 'Q22', text: 'Total profit/loss and the main reasons', available: true },
  { id: 'Q23', text: 'Revenue lost to breakdowns, electrical downtime, low efficiency', available: true },
];

interface Answer {
  question: string;
  response: AskAssistantResponse;
}

export default function AskPage() {
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [answer, setAnswer]     = useState<Answer | null>(null);

  async function ask(question: string) {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await api.askAssistant({ question });
      setAnswer({ question, response: res });
    } catch (e: any) {
      setError(e.message ?? 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(query);
  }

  const aiStatus = answer?.response?.ai_status;
  const statusLabel: Record<string, { status: 'ok' | 'warn' | 'critical' | 'nodata'; label: string }> = {
    success:      { status: 'ok',    label: 'AI answered' },
    unavailable:  { status: 'warn',  label: 'AI offline — deterministic fallback shown' },
    out_of_scope: { status: 'nodata',label: 'Out of scope' },
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 0 60px' }}>

      {/* Search bar */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--atm-border)', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            id="ask-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask about production, breakdowns, or revenue…"
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1px solid var(--atm-border)',
              borderRadius: 4,
              fontSize: '0.9375rem',
              outline: 'none',
              color: 'var(--ink-900)',
              background: '#fff',
            }}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !query.trim()}
            id="ask-submit"
          >
            {loading ? '…' : 'Ask'}
          </button>
        </form>
      </div>

      {/* Answer */}
      {loading && (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--ink-500)', fontSize: '0.875rem' }}>
          Querying analytics…
        </div>
      )}

      {error && (
        <div style={{ padding: '16px' }}>
          <div className="no-data-state">
            <div style={{ fontWeight: 600 }}>Could not get answer</div>
            <div className="reason">{error}</div>
          </div>
        </div>
      )}

      {answer && (
        <div style={{ borderBottom: '1px solid var(--atm-border)' }}>
          <div style={{ padding: '12px 16px', background: 'var(--ink-100)', borderBottom: '1px solid var(--atm-border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink-700)' }}>
              Q: {answer.question}
            </span>
            {aiStatus && statusLabel[aiStatus] && (
              <StatusBadge status={statusLabel[aiStatus].status} label={statusLabel[aiStatus].label} />
            )}
          </div>
          <div style={{ padding: '16px', fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--ink-900)', whiteSpace: 'pre-wrap' }}>
            {answer.response.answer}
          </div>

          {/* Key findings */}
          {answer.response.key_findings?.length > 0 && (
            <div style={{ padding: '0 16px 12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--atm-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Key Findings
              </div>
              <ul style={{ paddingLeft: 16 }}>
                {answer.response.key_findings.map((f, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', color: 'var(--ink-700)', marginBottom: 4, lineHeight: 1.5 }}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence row count */}
          <div style={{ padding: '8px 16px 12px', fontSize: '0.75rem', color: 'var(--ink-500)', borderTop: '1px solid var(--atm-border)' }}>
            ⓘ Based on {answer.response.data_quality?.records_analyzed?.toLocaleString('en-IN') ?? '—'} records
            {' · '}{answer.response.scope}
            {answer.response.evidence?.length > 0 && (
              <span> · Evidence IDs: {answer.response.evidence.slice(0, 5).join(', ')}{answer.response.evidence.length > 5 ? ` +${answer.response.evidence.length - 5} more` : ''}</span>
            )}
          </div>
        </div>
      )}

      {/* Question presets */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--atm-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          The 23 Management Questions
        </div>
        {QUESTIONS.map(q => (
          <div key={q.id} style={{ marginBottom: 4 }}>
            {q.available ? (
              <button
                id={`q-${q.id.toLowerCase()}`}
                onClick={() => { setQuery(q.text); ask(q.text); }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 12px',
                  border: '1px solid var(--atm-border)',
                  borderRadius: 3,
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: 'var(--ink-900)',
                  lineHeight: 1.4,
                  transition: 'background 0.1s',
                  minHeight: 44,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--ink-100)')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <span style={{ fontWeight: 700, color: 'var(--atm-accent)', marginRight: 6 }}>{q.id}</span>
                {q.text}
              </button>
            ) : (
              <div style={{
                padding: '9px 12px',
                border: '1px solid var(--nodata-border)',
                borderRadius: 3,
                background: 'var(--nodata-bg)',
                fontSize: '0.875rem',
                color: 'var(--nodata)',
                lineHeight: 1.4,
                minHeight: 44,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <div>
                  <span style={{ fontWeight: 700, marginRight: 6 }}>{q.id}</span>
                  {q.text}
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: 3, color: '#9ca3af' }}>
                  ⚠ Awaiting data source: {q.blockedBy}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
