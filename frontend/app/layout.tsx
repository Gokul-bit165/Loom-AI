import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'ATM Loom AI — Weaving Intelligence',
  description: 'Real-time weaving operations, breakdown, and revenue intelligence for Ashok Textile Mills.',
  keywords: 'textile, weaving, loom, ATM, production, breakdown, revenue',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1a3a5c" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-shell">
          <AppHeader />
          <main className="app-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
