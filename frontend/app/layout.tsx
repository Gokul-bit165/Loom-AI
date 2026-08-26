import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Loom AI — Textile Manufacturing Management Intelligence',
  description:
    'V1 Management reporting system for plant managers. Deterministic decision-support for Production, Downtime, and Revenue.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
            <span>Loom AI V1 • Plant Management Decision Support</span>
            <span className="text-[11px] text-slate-400 mt-1 sm:mt-0">
              Deterministic Analytics Engine • PostgreSQL Grounded
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
