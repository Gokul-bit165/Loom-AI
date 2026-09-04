/**
 * LOOM AI — LIGHT INDUSTRIAL ENTERPRISE SAAS DESIGN SYSTEM TOKENS
 * Ashok Textile Mills | Textile Weaving Decision Intelligence
 */

export const TOKENS = {
  // 1. Color Palette (Light Industrial Enterprise SaaS)
  colors: {
    surface: {
      canvas: '#f8fafc',       // Slate 50 neutral canvas matching RevenueLossView
      card: '#ffffff',         // Crisp white card surface
      cardAlt: '#f1f5f9',      // Slate 100 secondary surface
      toolbar: '#f8fafc',      // Table header / toolbar
      border: '#e2e8f0',       // Crisp slate-200 1px border
      borderStrong: '#cbd5e1', // Emphasized border slate-300
      hover: '#f8fafc',        // Hover slate-50
      active: '#e2e8f0',       // Active slate-200
    },
    brand: {
      900: '#0f172a',
      800: '#1e293b',
      700: '#1e3a5f',          // Primary industrial deep blue
      600: '#2563eb',          // Interactive brand blue
      500: '#3b82f6',
      100: '#eff6ff',          // Selected nav background
      50: '#f8fafc',
    },
    status: {
      critical: {
        bg: '#fef2f2',
        border: '#fecaca',
        text: '#b91c1c',
        label: 'Critical',
      },
      warning: {
        bg: '#fffbeb',
        border: '#fde68a',
        text: '#b45309',
        label: 'Attention',
      },
      healthy: {
        bg: '#ecfdf5',
        border: '#a7f3d0',
        text: '#047857',
        label: 'Healthy',
      },
      info: {
        bg: '#eff6ff',
        border: '#bfdbfe',
        text: '#1d4ed8',
        label: 'Info',
      },
      disabled: {
        bg: '#f8fafc',
        border: '#e2e8f0',
        text: '#64748b',
        label: 'N/A',
      },
    },
    provenance: {
      actual: {
        bg: '#F0FDF4',
        border: '#BBF7D0',
        text: '#166534',
        label: 'ACTUAL',
      },
      calculated: {
        bg: '#EFF6FF',
        border: '#BFDBFE',
        text: '#1E40AF',
        label: 'CALCULATED',
      },
      estimated: {
        bg: '#FFFBEB',
        border: '#FDE68A',
        text: '#B45309',
        label: 'ESTIMATED',
      },
      predicted: {
        bg: '#FAF5FF',
        border: '#E9D5FF',
        text: '#7E22CE',
        label: 'PREDICTED',
      },
    },
    text: {
      primary: '#0f172a',   // Deep slate-900 neutral matching RevenueLossView
      secondary: '#334155', // Slate-700 secondary text
      muted: '#64748b',     // Slate-500 metadata & table headers
      dim: '#94a3b8',       // Slate-400 subdued annotations
    },
  },

  // 2. Typography Hierarchy (Tabular Numerics & Inter)
  typography: {
    fontSans: "'-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Inter', sans-serif",
    fontMono: "'JetBrains Mono', 'SFMono-Regular', Consolas, Menlo, monospace",
    sizes: {
      appTitle: '16px',
      pageTitle: '18px',
      sectionHeading: '15px',
      cardHeading: '14px',
      kpiPrimary: '26px',
      kpiSecondary: '18px',
      body: '13px',
      bodySmall: '12px',
      metadata: '11px',
    },
  },

  // 3. Spacing Scale (Dense Enterprise Rhythm)
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
  },

  // 4. Restrained Radius
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    pill: '9999px',
  },

  // 5. Borders & Shadows (Subtle Enterprise)
  borders: {
    subtle: '1px solid #e2e8f0',
    medium: '1px solid #cbd5e1',
    strong: '1px solid #94a3b8',
    accent: '1px solid #bfdbfe',
  },
  shadows: {
    card: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
    elevated: '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.03)',
    modal: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
  },
} as const;

export type StatusType = 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'INFO' | 'DISABLED';
export type ProvenanceType = 'ACTUAL' | 'CALCULATED' | 'ESTIMATED' | 'PREDICTED';
