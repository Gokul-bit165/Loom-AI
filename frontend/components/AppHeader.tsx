'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/',             label: 'Morning Brief',   short: 'Brief' },
  { href: '/operations',   label: 'Operations',      short: 'Ops' },
  { href: '/breakdown',    label: 'Breakdown',       short: 'BD' },
  { href: '/revenue',      label: 'Revenue & Loss',  short: '₹' },
  { href: '/floor',        label: 'Floor Stoppages', short: 'Floor' },
  { href: '/import',       label: 'Import Data',     short: 'Import' },
  { href: '/ask',          label: 'Ask AI',          short: 'Ask' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="app-header">
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Logo / wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: '#ffffff22',
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
          }}>
            ATM
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1 }}>
              Loom AI
            </div>
            <div style={{ fontSize: '0.6875rem', opacity: 0.7, lineHeight: 1, marginTop: 2 }}>
              Ashok Textile Mills · Weaving
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 2 }} aria-label="Main navigation">
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'none', // shown via CSS below
                  padding: '6px 12px',
                  borderRadius: 3,
                  fontSize: '0.8125rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.75)',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background 0.15s, color 0.15s',
                }}
                className="desktop-nav-item"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="btn btn-ghost mobile-menu-btn"
          style={{ color: '#fff', minHeight: 36, padding: '0 8px' }}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav
          style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            padding: '8px 0',
            background: '#15304e',
          }}
          aria-label="Mobile navigation"
        >
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.8)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  borderLeft: active ? '3px solid #fff' : '3px solid transparent',
                  background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Inline styles for desktop nav visibility */}
      <style>{`
        @media (min-width: 640px) {
          .desktop-nav-item { display: inline-block !important; }
          .mobile-menu-btn  { display: none !important; }
        }
      `}</style>
    </header>
  );
}
