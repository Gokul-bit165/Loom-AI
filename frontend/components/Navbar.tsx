'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Factory, Wrench, IndianRupee, MessageSquareText, ShieldAlert } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Control Center', href: '/', icon: LayoutDashboard },
  { label: 'Production (Q1)', href: '/production', icon: Factory },
  { label: 'Breakdown (Q5)', href: '/breakdown', icon: Wrench },
  { label: 'Revenue (Q21)', href: '/revenue', icon: IndianRupee },
  { label: 'AI Assistant', href: '/ask', icon: MessageSquareText },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white tracking-wider">
              L
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-100">LOOM AI</span>
                <span className="bg-blue-900/60 text-blue-300 text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-blue-700/50">
                  V1 Production
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">Textile Manufacturing Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border-b-2 border-blue-500 shadow-inner'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
