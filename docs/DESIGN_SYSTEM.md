# LOOM AI — LIGHT INDUSTRIAL ENTERPRISE SAAS DESIGN SYSTEM
**Ashok Textile Mills — Weaving Division**  
**Design Philosophy:** Industrial Manufacturing Operations Software (MES / Industrial Analytics / Decision Support)

---

## 1. Core Principles

1. **Light Theme Default:** Pure light neutral background (`#F6F8FA`) with crisp white primary surfaces (`#FFFFFF`) and subtle `#E2E6EA` structural borders.
2. **Dense & Operational:** Maximizes meaningful operational density at `1366×768` and `1920×1080` without giant empty spaces or marketing banners.
3. **Color is for Meaning, Not Decoration:**
   - 85–90% neutral surfaces (`#FFFFFF`, `#F9FAFB`, `#F6F8FA`)
   - 5–10% brand industrial blue (`#1E3A5F`, `#2563EB`)
   - Small percentage for status (`#DC2626`, `#D97706`, `#059669`)
   - No glowing neon effects, no colored gradients, no oversized cards.
4. **Action over AI Slop:** Structured action tables (Priority, Issue, Loom, Impact, Reason, Recommended Action, Owner, Status) replace generic AI cards.
5. **Data Trust Transparency:** Every metric carries a distinct provenance tag (`ACTUAL`, `CALCULATED`, `ESTIMATED`, `PREDICTED`).

---

## 2. Palette & Design Tokens

```typescript
export const TOKENS = {
  colors: {
    surface: {
      canvas: '#F6F8FA',    // Neutral workstation page background
      card: '#FFFFFF',      // Pure white primary surface
      cardAlt: '#F9FAFB',   // Secondary elevated/subtle surface
      toolbar: '#F3F4F6',   // Table headers / filter toolbars
      border: '#E2E6EA',    // Crisp 1px structural borders
      hover: '#F1F5F9',     // Row / button hover
    },
    brand: {
      700: '#1E3A5F',       // Primary industrial deep blue
      600: '#2563EB',       // Interactive brand blue
      100: '#EFF6FF',       // Selected navigation background
    },
    status: {
      critical: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', label: 'Critical' },
      warning:  { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', label: 'Attention' },
      healthy:  { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669', label: 'Healthy' },
      info:     { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', label: 'Info' },
    },
    provenance: {
      actual:     { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', label: 'ACTUAL' },
      calculated: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', label: 'CALCULATED' },
      estimated:  { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', label: 'ESTIMATED' },
      predicted:  { bg: '#FAF5FF', border: '#E9D5FF', text: '#7E22CE', label: 'PREDICTED' },
    },
    text: {
      primary: '#17212B',
      secondary: '#4B5563',
      muted: '#6B7280',
      dim: '#9CA3AF',
    },
  },
  typography: {
    fontSans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', 'SFMono-Regular', Consolas, Menlo, monospace",
    sizes: {
      pageTitle: '20px',
      sectionHeading: '15px',
      cardHeading: '13px',
      kpiPrimary: '26px',
      body: '13px',
      bodySmall: '12px',
      metadata: '11px',
    },
  },
  spacing: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 8: '32px' },
  radius: { sm: '4px', md: '6px', lg: '8px', pill: '9999px' },
};
```

---

## 3. Application Shell & Navigation

- **Sidebar:** Clean white surface (`#FFFFFF`) with quiet section labels (`OVERVIEW`, `OPERATIONS`, `BUSINESS`, `OPERATIONS SUPPORT`, `INTELLIGENCE`, `DATA`). Selected item highlighted with `#EFF6FF` background and a `3px solid #2563EB` left border.
- **TopBar:** Subtle `#FFFFFF` header displaying:
  - Product branding (`LOOM AI · Ashok Textile Mills`)
  - Current Page Title
  - Unit (`ATM Main Shed`)
  - Timestamp (`31 Jul 2026, 06:00`)
  - Telemetry freshness (`Updated 4 min ago`)
  - User profile badge (`Plant Manager`)

---

## 4. Reusable UI Primitives

1. `PageHeader`: Standardized enterprise title, subtitle, unit, date, data freshness, and action buttons.
2. `FilterBar`: Crisp white select inputs, 6px radius, subtle borders.
3. `KpiCard` & `KpiStrip`: Dense metric card displaying Label, Dominant Value, Target Comparison, Restrained Status Pill, and Driver annotation.
4. `IndustrialTable`: White table surface, `#F9FAFB` sticky header, right-aligned tabular monospace numerics, subtle row hover (`#F1F5F9`), and pagination toggle.
5. `StatusBadge` & `DataTrustBadge`: Subtle, restrained status and data provenance labels.
6. `DecisionCard` & `ActionQueue`: Structured operational action rows with state lifecycle transitions (`OPEN` $\to$ `ACKNOWLEDGED` $\to$ `ASSIGNED` $\to$ `COMPLETED` $\to$ `VERIFIED`).
7. `States` (`EmptyState`, `ErrorState`, `LoadingState`): Clean, quiet enterprise states with retry actions.
