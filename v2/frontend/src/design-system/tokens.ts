/**
 * LOOM AI — LIGHT INDUSTRIAL ENTERPRISE SAAS DESIGN SYSTEM TOKENS
 * Ashok Textile Mills | Textile Weaving Decision Intelligence
 */

export const TOKENS = {
  // 1. Color Palette (Light Industrial Enterprise SaaS)
  colors: {
    surface: {
      canvas: '#F6F8FA',    // Light neutral app background
      card: '#FFFFFF',      // Pure white primary surface
      cardAlt: '#F9FAFB',   // Secondary elevated/subtle surface
      toolbar: '#F3F4F6',   // Table headers / filter toolbars
      border: '#E2E6EA',    // Crisp 1px structural borders
      borderStrong: '#D1D5DB', // Emphasized borders / dividers
      hover: '#F1F5F9',     // Row / button hover
      active: '#E2E8F0',    // Active / pressed state
    },
    brand: {
      900: '#0F172A',
      800: '#1E293B',
      700: '#1E3A5F',       // Primary industrial deep blue
      600: '#2563EB',       // Interactive brand blue
      500: '#3B82F6',
      100: '#EFF6FF',       // Selected nav background
      50: '#F8FAFC',
    },
    status: {
      critical: {
        bg: '#FEF2F2',
        border: '#FECACA',
        text: '#DC2626',
        label: 'Critical',
      },
      warning: {
        bg: '#FFFBEB',
        border: '#FDE68A',
        text: '#D97706',
        label: 'Attention',
      },
      healthy: {
        bg: '#ECFDF5',
        border: '#A7F3D0',
        text: '#059669',
        label: 'Healthy',
      },
      info: {
        bg: '#EFF6FF',
        border: '#BFDBFE',
        text: '#2563EB',
        label: 'Info',
      },
      disabled: {
        bg: '#F3F4F6',
        border: '#E5E7EB',
        text: '#6B7280',
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
      primary: '#17212B',   // Deep readable neutral
      secondary: '#4B5563', // Secondary body text
      muted: '#6B7280',     // Metadata & table headers
      dim: '#9CA3AF',       // Subdued annotations
    },
  },

  // 2. Typography Hierarchy (Inter & Tabular Numerics)
  typography: {
    fontSans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', 'SFMono-Regular', Consolas, Menlo, monospace",
    sizes: {
      appTitle: '16px',
      pageTitle: '20px',
      sectionHeading: '15px',
      cardHeading: '13px',
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
    subtle: '1px solid #E2E6EA',
    medium: '1px solid #D1D5DB',
    strong: '1px solid #9CA3AF',
    accent: '1px solid #BFDBFE',
  },
  shadows: {
    card: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;

export type StatusType = 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'INFO' | 'DISABLED';
export type ProvenanceType = 'ACTUAL' | 'CALCULATED' | 'ESTIMATED' | 'PREDICTED';
