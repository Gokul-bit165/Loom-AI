'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { AskAssistantResponse } from '@/lib/types';
import { Sparkles, Send, ArrowRight, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import Link from 'next/link';

interface DecisionAssistantPanelProps {
  currentDate?: string;
  onInspectEvidence?: (title: string, ids: number[]) => void;
}

const DECISION_PROMPTS = [
  'Why are we below target today?',
  'Which machines should we intervene on first?',
  'Where are we losing the most operating time?',
  'Which fabric styles contribute the most revenue?',
];

export function DecisionAssistantPanel({
  currentDate = '2026-08-29',
  onInspectEvidence,
}: DecisionAssistantPanelProps) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AskAssistantResponse | null>(null);

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.askAssistant({
        question: q,
        date: currentDate,
      });
      setResponse(res);
      if (queryText) setQuestion(queryText);
    } catch (err) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="panel-saas space-y-4 border-brand-200/80 bg-gradient-to-b from-white to-brand-50/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-100">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <h3 className="font-semibold text-sm text-surface-900 uppercase tracking-wide">
            Executive Decision Center & AI Analyst
          </h3>
        </div>
        <Link
          href="/ask"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
        >
          <span>Open Full Decision Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Query Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What decision do you need to make? (e.g. Why are we missing today's target?)"
          className="flex-1 bg-surface-50 border border-surface-200 rounded-lg px-4 py-2.5 text-xs text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-2xs font-sans"
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          <span>Analyze</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Fast Prompt Chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {DECISION_PROMPTS.map((dp, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleAsk(dp)}
            className="text-[11px] font-medium bg-white hover:bg-brand-50 text-surface-700 hover:text-brand-700 border border-surface-200 hover:border-brand-300 px-3 py-1.5 rounded-lg transition-all shadow-2xs"
          >
            "{dp}"
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-4 rounded-lg bg-white border border-surface-200 text-xs text-surface-600 flex items-center space-x-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-brand-600 animate-spin" />
          <span>Synthesizing deterministic metrics and generating grounded recommendation...</span>
        </div>
      )}

      {/* Structured Decision Output */}
      {response && !isLoading && (
        <div className="p-4 rounded-xl bg-white border border-brand-200 shadow-sm space-y-3 animate-fadeIn text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-surface-100">
            <span className="badge-status-optimal">
              SCOPE: {response.scope} (Grounded Analysis)
            </span>
            <span className="text-[11px] text-surface-500">
              {response.data_quality?.records_analyzed || 0} facts verified
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block">
              EXECUTIVE SITUATION ANSWER
            </span>
            <p className="text-surface-800 leading-relaxed font-normal">
              {response.answer}
            </p>
          </div>

          {/* Key Findings */}
          {response.key_findings && response.key_findings.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block">
                TOP DRIVERS & EVIDENCE
              </span>
              <div className="space-y-1">
                {response.key_findings.map((f, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-surface-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {response.suggestions && response.suggestions.length > 0 && (
            <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/80 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                RECOMMENDED OPERATIONAL ACTION
              </span>
              <div className="space-y-1 text-emerald-900">
                {response.suggestions.map((s, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit button */}
          {response.evidence && response.evidence.length > 0 && onInspectEvidence && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() =>
                  onInspectEvidence('Grounded Decision Evidence Rows', response.evidence)
                }
                className="text-brand-600 hover:text-brand-700 underline text-[11px] font-semibold"
              >
                Inspect All {response.evidence.length} Contributing Fact Primary Keys →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
