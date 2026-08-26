'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Factory,
  Clock,
  IndianRupee,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  Database,
  Search,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/', matchPaths: ['/'], icon: LayoutDashboard },
  { label: 'Production', href: '/production', matchPaths: ['/production', '/dispatch'], icon: Factory },
  { label: 'Downtime', href: '/breakdown', matchPaths: ['/breakdown', '/stoppages'], icon: Clock },
  { label: 'Commercial', href: '/revenue', matchPaths: ['/revenue', '/commercial'], icon: IndianRupee },
  { label: 'Decisions', href: '/ask', matchPaths: ['/ask', '/decisions'], icon: Sparkles },
];

interface HeaderNavProps {
  currentDate?: string;
  onDateChange?: (date: string) => void;
  isDemo?: boolean;
  datasetLabel?: string;
  recordsAnalyzed?: number;
}

export function HeaderNav({
  currentDate = '2026-08-29',
  onDateChange,
  isDemo = true,
  datasetLabel = 'Grounded Factory Baseline',
  recordsAnalyzed = 309,
}: HeaderNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProvenanceModal, setShowProvenanceModal] = useState(false);

  const stepDate = (days: number) => {
    if (!onDateChange) return;
    try {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + days);
      onDateChange(d.toISOString().split('T')[0]);
    } catch {
      // ignore
    }
  };

  return (
    <header className="bg-white border-b border-surface-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand + Wordmark */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-white shadow-xs group-hover:bg-brand-700 transition-colors">
                L
              </div>
              <div>
                <span className="font-bold text-base text-surface-900 tracking-tight block leading-none">
                  LOOM AI
                </span>
                <span className="text-[11px] font-medium text-surface-500 tracking-wide">
                  OPERATIONS INTELLIGENCE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-surface-200">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.matchPaths.includes(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-surface-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Date Selector + Provenance Pill */}
          <div className="flex items-center space-x-3">
            {onDateChange && (
              <div className="flex items-center bg-surface-50 border border-surface-200 rounded-lg p-1 shadow-xs">
                <button
                  onClick={() => stepDate(-1)}
                  className="p-1 rounded text-surface-500 hover:text-surface-900 hover:bg-surface-200 transition-colors"
                  title="Previous plant day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="bg-transparent text-xs font-medium text-surface-800 px-2 py-0.5 focus:outline-none cursor-pointer"
                />
                <button
                  onClick={() => stepDate(1)}
                  className="p-1 rounded text-surface-500 hover:text-surface-900 hover:bg-surface-200 transition-colors"
                  title="Next plant day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Provenance Badge */}
            <button
              onClick={() => setShowProvenanceModal(true)}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-surface-50 hover:bg-surface-100 border border-surface-200 text-surface-700 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline text-surface-500">Source:</span>
              <span className="font-semibold text-surface-800 truncate max-w-[130px]">{datasetLabel}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-surface-200 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.matchPaths.includes(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-surface-700 hover:bg-surface-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-surface-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Provenance Modal */}
      {showProvenanceModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-surface-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-surface-200 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-surface-100">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-sm text-surface-900">DATA PROVENANCE & TRACEABILITY</h3>
              </div>
              <button
                onClick={() => setShowProvenanceModal(false)}
                className="text-surface-400 hover:text-surface-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-surface-50 p-3 rounded-lg border border-surface-200/80 space-y-1">
                <div className="text-[11px] font-semibold text-surface-500 uppercase">ACTIVE REPOSITORY SOURCE</div>
                <div className="font-semibold text-surface-900 text-sm">{datasetLabel}</div>
                <div className="text-surface-500">{recordsAnalyzed} records deterministically loaded</div>
              </div>

              <div className="text-surface-600 space-y-1 leading-relaxed">
                <p>All metrics on this screen originate from physical shift registers and breakdown logs loaded into PostgreSQL.</p>
                <p className="font-medium text-surface-800">Zero numbers are calculated or approximated by AI models.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowProvenanceModal(false)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
