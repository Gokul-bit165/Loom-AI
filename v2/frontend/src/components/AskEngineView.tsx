import React, { useEffect, useState } from 'react';
import { fetchQ14Countdown } from '../api';
import type { Q14CountdownStatus } from '../api';
import { PageHeader, StatusBadge, TOKENS } from '../design-system';
import { Search, Clock } from 'lucide-react';

interface QuestionModule {
  qid: string;
  question: string;
  domain: 'Production' | 'Breakdowns' | 'Maintenance' | 'Quality' | 'Utilities' | 'Executive';
  status: 'READY' | 'ACTIVE' | 'BLOCKED_DATA';
  answerSummary: string;
  sourceFunction: string;
}

const QUESTION_REGISTRY: QuestionModule[] = [
  {
    qid: 'Q1',
    question: 'How did the mill perform today vs yesterday / last week / plan?',
    domain: 'Production',
    status: 'ACTIVE',
    answerSummary: 'ATM actual efficiency is 89.5% vs 93.0% plan. Shift 2 was highest at 91.2%.',
    sourceFunction: 'production_summary / formulas.loom_efficiency_pct',
  },
  {
    qid: 'Q2',
    question: 'Which shift underperformed and by how much?',
    domain: 'Production',
    status: 'ACTIVE',
    answerSummary: 'Shift 3 underperformed plan by 4.97pp (88.03% vs 93.0%).',
    sourceFunction: 'production_summary / shift_breakdown',
  },
  {
    qid: 'Q3',
    question: 'Which looms are dragging the average down today?',
    domain: 'Production',
    status: 'ACTIVE',
    answerSummary: 'Looms AJ-112 (72.4%), AJ-084 (74.1%), SZ-004 (74.8%) are lowest.',
    sourceFunction: 'list_looms / sort=eff_asc',
  },
  {
    qid: 'Q4',
    question: "Is this loom's drop due to stopped time or running speed?",
    domain: 'Maintenance',
    status: 'ACTIVE',
    answerSummary: 'Deterministic diagnostic split: Performance efficiency vs Utilization %.',
    sourceFunction: 'loom_detail / _diagnostic_sentence',
  },
  {
    qid: 'Q5',
    question: 'Which looms had the highest breakdown time today / this month?',
    domain: 'Breakdowns',
    status: 'ACTIVE',
    answerSummary: 'Ranked list of top downtime looms with total stopped minutes and event counts.',
    sourceFunction: 'breakdown_summary / worst_looms_today',
  },
  {
    qid: 'Q6',
    question: 'What is the dominant reason for breakdown stops across the plant?',
    domain: 'Breakdowns',
    status: 'ACTIVE',
    answerSummary: 'Electrical stops account for 41.2% of plant downtime (avg 45 min/stop).',
    sourceFunction: 'breakdown_summary / reason_pareto',
  },
  {
    qid: 'Q7',
    question: 'How much money did breakdowns cost us this month?',
    domain: 'Breakdowns',
    status: 'ACTIVE',
    answerSummary: 'Total estimated revenue loss: ₹4,86,000 (EST) computed from capacity loss @ ₹40.00/m.',
    sourceFunction: 'breakdown_summary / total_rupee_lost',
  },
  {
    qid: 'Q8',
    question: 'Which weavers have the highest efficiency and lowest break rate?',
    domain: 'Production',
    status: 'ACTIVE',
    answerSummary: 'Weaver ranking on 30-day shift logs across assigned loom sorts.',
    sourceFunction: 'weaver_records / formulas.weaver_index',
  },
  {
    qid: 'Q14',
    question: 'Can we predict which loom is likely to break next?',
    domain: 'Maintenance',
    status: 'BLOCKED_DATA',
    answerSummary: 'BLOCKED — Requires >= 6 months of labelled component close-outs. Countdown active.',
    sourceFunction: 'app.ai.labels_counter / get_q14_countdown_status',
  },
  {
    qid: 'Q18',
    question: 'Can we predict fabric defect rate before inspection?',
    domain: 'Quality',
    status: 'BLOCKED_DATA',
    answerSummary: 'BLOCKED — Lab crimp & defect feed does not exist in mill yet.',
    sourceFunction: 'blocked_lab_feed',
  },
  {
    qid: 'Q21',
    question: 'What is the total loss across all looms this month, and who is responsible?',
    domain: 'Executive',
    status: 'ACTIVE',
    answerSummary: 'Ranked list of named, priced actions attributing downtime to maintenance vs sort vs speed.',
    sourceFunction: 'executive_loss_attribution',
  },
];

export const AskEngineView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [countdown, setCountdown] = useState<Q14CountdownStatus | null>(null);

  useEffect(() => {
    fetchQ14Countdown('ATM').then(setCountdown).catch(console.error);
  }, []);

  const filteredQuestions = QUESTION_REGISTRY.filter((q) => {
    const matchesDomain = selectedDomain === 'ALL' || q.domain === selectedDomain;
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.qid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answerSummary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title="AI Decision Assistant & Query Engine"
        subtitle="Deterministic decision answers with grounded operational sources and provenance transparency."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      {/* Honest Q14 Countdown Box */}
      {countdown && (
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: '1px solid #FDE68A',
            borderLeft: '3px solid #D97706',
            borderRadius: TOKENS.radius.md,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: TOKENS.shadows.card,
          }}
        >
          <Clock size={18} color="#D97706" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: '13px', color: TOKENS.colors.text.primary }}>
              Machine Breakdown Prediction (Q14) Training Status:
            </strong>
            <div style={{ marginTop: '2px', fontSize: '12px', color: TOKENS.colors.text.secondary }}>
              {countdown.status_sentence}
            </div>
            <div style={{ fontSize: '11px', color: '#B45309', marginTop: '2px' }}>
              *Supervised failure prediction requires ≥6 months of structured close-outs. Floor fitters are currently recording ground truth.
            </div>
          </div>
        </div>
      )}

      {/* Search & Domain Filter */}
      <div
        style={{
          background: TOKENS.colors.surface.card,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          borderRadius: TOKENS.radius.md,
          padding: '12px 16px',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: 10 }} />
            <input
              type="text"
              className="input-field"
              style={{ width: '100%', paddingLeft: 32 }}
              placeholder="Search by question, Q-ID (e.g. Q3, Q14), or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['ALL', 'Production', 'Breakdowns', 'Maintenance', 'Quality', 'Executive'].map((dom) => (
              <button
                key={dom}
                className={selectedDomain === dom ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
                onClick={() => setSelectedDomain(dom)}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '12px' }}>
        {filteredQuestions.map((q) => (
          <div
            key={q.qid}
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontFamily: TOKENS.typography.fontMono, fontWeight: 800, fontSize: '12.5px', color: TOKENS.colors.brand[600] }}>
                  {q.qid}
                </span>
                <StatusBadge status={q.status === 'BLOCKED_DATA' ? 'CRITICAL' : 'HEALTHY'} label={q.status === 'BLOCKED_DATA' ? 'Blocked' : 'Active'} />
              </div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: TOKENS.colors.text.primary, marginBottom: '6px' }}>
                {q.question}
              </h4>
              <p style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, lineHeight: 1.4, margin: 0 }}>
                {q.answerSummary}
              </p>
            </div>

            <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: `1px solid ${TOKENS.colors.surface.canvas}`, fontSize: '11px', color: TOKENS.colors.text.muted, fontFamily: TOKENS.typography.fontMono }}>
              Source: {q.sourceFunction}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
