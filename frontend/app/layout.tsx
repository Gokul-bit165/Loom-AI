import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LOOM AI — Executive Decision Intelligence Platform',
  description:
    'AI-powered operations decision intelligence system for enterprise textile manufacturing organizations. Grounded in deterministic factory analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-50 flex flex-col text-surface-900 font-sans antialiased selection:bg-brand-100 selection:text-brand-900">
        <main className="flex-1 w-full">
          {children}
        </main>
        <footer className="bg-white border-t border-surface-200 py-3.5 text-center text-xs text-surface-500 font-sans">
          <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex flex-col sm:flex-row items-center justify-between">
            <span className="font-semibold text-surface-700">LOOM AI • Executive Decision Intelligence Platform</span>
            <span className="text-[11px] text-surface-400 mt-1 sm:mt-0">
              Deterministic Analytics Engine • PostgreSQL Fact Grounding • Zero-Math AI Guarantee
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
