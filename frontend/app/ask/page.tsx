'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { AskAssistantResponse } from '@/lib/types';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { LoadingState } from '@/components/LoadingState';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'How did production perform today?',
  'Which machine needs attention?',
  'What caused the most downtime?',
  'How is revenue performing across fabric styles?',
  'What is the production variance on shift 1?',
];

export default function AskAssistantPage() {
  const [question, setQuestion] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>('2026-08-29');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AskAssistantResponse | null>(null);

  const [evidenceModal, setEvidenceModal] = useState<{
    isOpen: boolean;
    title: string;
    ids: number[];
  }>({
    isOpen: false,
    title: '',
    ids: [],
  });

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.askAssistant({
        question: q,
        date: targetDate,
      });
      setResponse(res);
      if (queryText) setQuestion(queryText);
    } catch (err: any) {
      setError(err.message || 'Failed to communicate with AI Assistant service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1.5 mb-6">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Grounded Operational Intelligence</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          AI Management Assistant
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Ask questions regarding plant production, downtime reasons, or fabric style revenue.
          All answers are strictly synthesized from PostgreSQL analytics with zero AI math.
        </p>
      </div>

      {/* Query Input Card */}
      <div className="card-industrial shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="space-y-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How did production perform today? Which machine had the highest downtime?"
              className="flex-1 text-sm bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-xs"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Target Plant Date:</span>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-slate-800 font-mono text-[11px]"
              />
            </div>
            <span className="text-slate-400 text-[11px]">
              Loom AI V1 Scope: Production (Q1), Breakdown (Q5), Revenue (Q21)
            </span>
          </div>
        </form>

        {/* Suggested Quick Questions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Suggested Management Questions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAsk(sq)}
                className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition-colors text-left"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <LoadingState message="Extracting deterministic SQL analytics & generating grounded explanation..." />
      )}

      {/* Error state */}
      {error && (
        <div className="card-industrial border-rose-300 bg-rose-50/40 p-4 text-xs text-rose-800">
          <div className="flex items-center space-x-2 font-bold mb-1">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Assistant Error</span>
          </div>
          <p>{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && !isLoading && (
        <div className="card-industrial shadow-md space-y-5 border-slate-300 bg-white">
          {/* Status & Scope Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  response.scope === 'OUT_OF_SCOPE'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-blue-100 text-blue-800 border-blue-300'
                }`}
              >
                Scope: {response.scope}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {response.ai_status === 'success'
                  ? 'Grounded Claude Narrative'
                  : response.ai_status === 'out_of_scope'
                  ? 'Out of Scope'
                  : 'Deterministic Fallback Explanation'}
              </span>
            </div>

            {response.data_quality?.is_demo && (
              <span className="text-[10px] uppercase font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                DEMO DATA
              </span>
            )}
          </div>

          {/* 1. Main Answer */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              OPERATIONAL EXPLANATION
            </h2>
            <div className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line bg-slate-50/60 p-4 rounded-lg border border-slate-200">
              {response.answer}
            </div>
          </div>

          {/* 2. Key Findings */}
          {response.key_findings && response.key_findings.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                KEY FACTORY FINDINGS
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {response.key_findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2 text-xs bg-slate-50 p-2.5 rounded-md border border-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 font-medium">{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Conservative Suggestions */}
          {response.suggestions && response.suggestions.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                CONSERVATIVE OPERATIONAL SUGGESTIONS
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {response.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2 text-xs bg-emerald-50/50 p-2.5 rounded-md border border-emerald-200"
                  >
                    <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="text-slate-800">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Evidence & Data Provenance */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-500">
              <Database className="w-4 h-4 text-slate-400" />
              <span>
                Source:{' '}
                <span className="font-semibold text-slate-700">
                  {response.data_quality?.dataset_label || 'PostgreSQL Fact Tables'}
                </span>{' '}
                ({response.data_quality?.records_analyzed || 0} records analyzed)
              </span>
            </div>

            {response.evidence && response.evidence.length > 0 && (
              <button
                onClick={() =>
                  setEvidenceModal({
                    isOpen: true,
                    title: `Audit Supporting Evidence (${response.evidence.length} Records)`,
                    ids: response.evidence,
                  })
                }
                className="font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md border border-blue-200 transition-colors text-center"
              >
                View Supporting Data ({response.evidence.length} Records) →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Evidence Drawer */}
      <EvidenceDrawer
        isOpen={evidenceModal.isOpen}
        onClose={() => setEvidenceModal({ isOpen: false, title: '', ids: [] })}
        title={evidenceModal.title}
        evidenceIds={evidenceModal.ids}
        provenanceLabel={response?.data_quality?.dataset_label}
        sourceType="synthetic"
      />
    </div>
  );
}
