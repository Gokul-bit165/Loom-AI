import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Loom AI — Textile Manufacturing Operations Command Center',
  description:
    'Operations intelligence and decision support system for plant superintendents and manufacturing leadership. Grounded in deterministic factory analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-command-950 flex flex-col text-command-100 font-sans selection:bg-blue-600 selection:text-white">
        <main className="flex-1 w-full">
          {children}
        </main>
        <footer className="bg-command-950 border-t border-command-700/60 py-3 text-center text-xs font-mono text-command-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
            <span>LOOM AI • Operations Command Center V1</span>
            <span className="text-[11px] text-command-600 mt-1 sm:mt-0">
              Deterministic Analytics Engine • PostgreSQL Grounded • Zero LLM Calculations
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
