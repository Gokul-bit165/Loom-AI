/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ATM design tokens — light background, high contrast, status-only colour
        // Inspired by their existing daily report visual grammar
        atm: {
          header: '#1a3a5c',      // deep navy — header band (like yellow→navy upgrade)
          'header-text': '#ffffff',
          accent: '#1a5276',      // column heads
          border: '#c8d6e5',      // visible grid lines — always shown
          'border-strong': '#8eaabf',
        },
        // Status — the ONLY use of colour in data cells
        status: {
          critical:     '#b91c1c',  // red — losing money now
          'critical-bg':'#fef2f2',
          'critical-border': '#fca5a5',
          warn:         '#b45309',  // amber — watch
          'warn-bg':    '#fffbeb',
          'warn-border':'#fcd34d',
          ok:           '#166534',  // green — at or above target
          'ok-bg':      '#f0fdf4',
          'ok-border':  '#86efac',
          nodata:       '#6b7280',  // grey — no data
          'nodata-bg':  '#f9fafb',
          'nodata-border': '#e5e7eb',
        },
        // Neutral scale for backgrounds and text
        ink: {
          900: '#111827',   // primary text
          700: '#374151',   // secondary text
          500: '#6b7280',   // tertiary / labels
          300: '#d1d5db',   // dividers
          100: '#f3f4f6',   // subtle background
          50:  '#f9fafb',   // page background
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        // Tabular-lining numerals for all data values
        num:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Scale calibrated for data density at 375px (iPhone SE) and 1280px desktop
        'hero-num':  ['2.75rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'big-num':   ['1.875rem', { lineHeight: '1.1', fontWeight: '700' }],
        'mid-num':   ['1.25rem',  { lineHeight: '1.2', fontWeight: '600' }],
        'table-num': ['0.875rem', { lineHeight: '1', fontWeight: '500' }],
        'label':     ['0.75rem',  { lineHeight: '1', fontWeight: '500', letterSpacing: '0.05em' }],
      },
      spacing: {
        // Touch targets ≥ 44px (Q3.12 WCAG)
        'touch': '44px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'table-header': 'inset 0 -2px 0 #c8d6e5',
      },
    },
  },
  plugins: [],
};
