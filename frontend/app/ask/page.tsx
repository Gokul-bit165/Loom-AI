'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { AskAssistantResponse } from '@/lib/types';
import { HeaderNav } from '@/components/common/HeaderNav';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import {
  Sparkles,
  Send,
  Database,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Layers,
  ChevronRight,
  Factory,
  Clock,
  IndianRupee,
} from 'lucide-react';
import Link from 'next/link';

interface ContextualPrompt {
  label: string;
  category: 'Q1' | 'Q5' | 'Q21' | 'EXECUTIVE';
  description: string;
  prompt: string;
}

const CONTEXTUAL_PROMPTS: ContextualPrompt[] = [
  {
    label: 'What needs attention today?',
    category: 'EXECUTIVE',
    description: 'Executive triage of critical plant bottlenecks and volume gaps',
    prompt: 'What needs management attention today?',
  },
  {
    label: 'Why is production below target?',
    category: 'Q1',
    description: 'Target vs actual volume analysis and shortfall origin',
    prompt: 'Why is production below target today?',
  },
  {
    label: 'Which machines are driving the gap?',
    category: 'Q1',
    description: 'Isolate chronic underperformers (VTX-06, TOY-02, RF-11, TOY-08)',
    prompt: 'Which machines are driving the production gap?',
  },
  {
    label: 'Where are we losing operating time?',
    category: 'Q5',
    description: 'Mechanical stoppage Pareto and dominant failure modes',
    prompt: 'Where are we losing the most operating time and what is causing it?',
  },
  {
    label: 'Which fabric styles contribute most revenue?',
    category: 'Q21',
    description: 'Commercial realization breakdown by woven fabric quality',
    prompt: 'Which fabric styles contribute the most revenue today?',
  },
];

export default function GroundedOperationsAnalystPage() {
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
      setError(err.message || 'Operations Analyst service connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isOutOfScope = response?.scope === 'OUT_OF_SCOPE' || response?.ai_status === 'out_of_scope';

  const deepDiveLink =
    response?.scope === 'Q1_PRODUCTION' || response?.scope === 'Q1'
      ? { href: '/production', label: 'Open Production Workspace' }
      : response?.scope === 'Q5_BREAKDOWN' || response?.scope === 'Q5'
      ? { href: '/breakdown', label: 'Open Downtime Workspace' }
      : response?.scope === 'Q21_REVENUE' || response?.scope === 'Q21'
      ? { href: '/revenue', label: 'Open Commercial Workspace' }
      : { href: '/', label: 'Return to Overview' };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
      <HeaderNav
        currentDate={targetDate}
        onDateChange={setTargetDate}
        isDemo={response?.data_quality?.is_demo ?? true}
        datasetLabel={response?.data_quality?.dataset_label ?? 'Grounded Factory Baseline'}
        recordsAnalyzed={response?.data_quality?.records_analyzed}
      />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
        {/* Workspace Title */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>GROUNDED DECISION INTELLIGENCE ANALYST</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
            Operations Decision Workspace
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 font-normal max-w-lg mx-auto">
            Zero-math AI assistant. All metrics are computed by deterministic SQL aggregations over PostgreSQL fact tables.
          </p>
        </div>

        {/* Input Bar Section */}
        <div className="panel-saas space-y-4 shadow-md">
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
                placeholder="Ask an operational question (e.g. Which machines caused today's production gap?)"
                className="flex-1 bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-2xs font-sans"
              />
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <span>Analyze</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex justify-between items-center text-xs text-surface-500 pt-1 border-t border-surface-100">
              <span>Plant Date: <strong className="text-surface-800 font-medium">{targetDate}</strong></span>
              <span>Supported Scope: Production (Q1), Downtime (Q5), Commercial (Q21)</span>
            </div>
          </form>

          {/* Contextual Scenario Chips */}
          <div className="pt-2 border-t border-surface-100 space-y-2">
            <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider block">
              CONTEXTUAL DECISION ENTRY POINTS (V1 SCOPE):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONTEXTUAL_PROMPTS.map((cp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAsk(cp.prompt)}
                  className="text-left p-3 rounded-xl bg-surface-50 hover:bg-white border border-surface-200 hover:border-brand-300 hover:shadow-card transition-all flex flex-col justify-between group"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-xs text-surface-800 group-hover:text-brand-700">
                      "{cp.label}"
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        cp.category === 'Q1'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : cp.category === 'Q5'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : cp.category === 'Q21'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-surface-200 text-surface-700'
                      }`}
                    >
                      {cp.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-surface-500 mt-1 font-normal">
                    {cp.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="panel-saas flex items-center justify-center p-8 space-x-3 text-xs text-surface-600 animate-pulse">
            <Sparkles className="w-5 h-5 text-brand-600 animate-spin" />
            <span>Executing deterministic SQL analytics & synthesizing grounded briefing...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="panel-saas border-rose-200 bg-rose-50/50 p-4 text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Out of Scope Protection */}
        {response && !isLoading && isOutOfScope && (
          <div className="panel-saas border-amber-200 bg-amber-50/50 space-y-3">
            <div className="flex items-center space-x-2 text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-xs uppercase tracking-wide">
                SCOPE BOUNDARY: QUESTION OUTSIDE V1 ANALYTICAL SCOPE
              </h3>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed bg-white p-3 rounded-lg border border-amber-200/80">
              {response.answer}
            </p>
            <span className="text-[11px] text-surface-500 block">
              Loom AI V1 strictly supports Q1 Production, Q5 Downtime, and Q21 Revenue. Zero unsupported answers are fabricated.
            </span>
          </div>
        )}

        {/* Grounded Decision Architecture Output */}
        {response && !isLoading && !isOutOfScope && (
          <div className="panel-saas space-y-5 shadow-lg border-surface-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-100 text-xs">
              <div className="flex items-center space-x-2">
                <span className="badge-status-optimal">
                  SCOPE: {response.scope}
                </span>
                <span className="text-surface-400">•</span>
                <span className="font-semibold text-surface-700">
                  {response.ai_status === 'success' ? 'Grounded Management Analysis' : 'Deterministic Template Fallback'}
                </span>
              </div>
              <span className="text-xs text-surface-500">
                Audited over {response.data_quality?.records_analyzed || 0} PostgreSQL fact records
              </span>
            </div>

            {/* 01 ANSWER */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block">
                01 EXECUTIVE SITUATION SUMMARY
              </span>
              <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 text-xs text-surface-900 leading-relaxed font-normal">
                {response.answer}
              </div>
            </div>

            {/* 02 WHY IT MATTERS */}
            {response.key_findings && response.key_findings.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block">
                  02 VERIFIED FACT FINDINGS (DETERMINISTIC NUMBERS)
                </span>
                <div className="space-y-1.5">
                  {response.key_findings.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white border border-surface-200 text-xs text-surface-800 flex items-start space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 03 RECOMMENDED ACTIONS */}
            {response.suggestions && response.suggestions.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block">
                  03 RECOMMENDED SHOP-FLOOR ACTIONS
                </span>
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 text-xs text-emerald-900">
                  {response.suggestions.map((s, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 04 DATA SCOPE & NAVIGATION */}
            <div className="pt-3 border-t border-surface-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-surface-500">
                <Database className="w-4 h-4 text-surface-400" />
                <span>
                  Date: <strong className="text-surface-800">{targetDate}</strong> ({response.data_quality?.dataset_label})
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {response.evidence && response.evidence.length > 0 && (
                  <button
                    onClick={() =>
                      setEvidenceModal({
                        isOpen: true,
                        title: `Audit Supporting Evidence (${response.evidence.length} Primary Keys)`,
                        ids: response.evidence,
                      })
                    }
                    className="px-3.5 py-1.5 bg-white hover:bg-surface-50 border border-surface-200 text-surface-700 font-semibold rounded-lg text-xs transition-colors shadow-2xs"
                  >
                    Audit Row IDs ({response.evidence.length}) →
                  </button>
                )}

                <Link
                  href={deepDiveLink.href}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs flex items-center space-x-1"
                >
                  <span>{deepDiveLink.label}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Slide-Over Evidence Drawer */}
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
