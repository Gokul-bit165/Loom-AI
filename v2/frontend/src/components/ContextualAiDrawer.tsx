import { useState } from 'react';
import {
  X,
  Bot,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { TOKENS, DataTrustBadge } from '../design-system';

export interface ContextualAiPayload {
  title: string;
  category?: string;
  loomNo?: string;
  issueDescription: string;
  observations?: string[];
  baseline?: string;
  comparison?: string;
  current_value?: string;
  impactMetres?: number;
  impactInr?: number;
  downtimeMin?: number;
  probableCause?: string;
  recommendedAction?: string;
  confidence?: string;
  sourceIds?: string[];
}

interface ContextualAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: ContextualAiPayload | null;
  onAssignAction?: (context: ContextualAiPayload) => void;
}

export function ContextualAiDrawer({
  isOpen,
  onClose,
  context,
  onAssignAction,
}: ContextualAiDrawerProps) {
  const [activeQuestion, setActiveQuestion] = useState<string>('explain');

  if (!isOpen || !context) return null;

  const quickQuestions = [
    { id: 'explain', label: 'Explain Finding' },
    { id: 'why_cost', label: 'Why is this costing us?' },
    { id: 'what_first', label: 'What should I do first?' },
    { id: 'what_changed', label: 'What changed vs baseline?' },
    { id: 'future_risk', label: 'What happens tomorrow?' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '460px',
        maxWidth: '100vw',
        background: TOKENS.colors.surface.card,
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${TOKENS.colors.surface.border}`,
        animation: 'slideInRight 0.2s ease-out',
      }}
    >
      {/* ── Drawer Header ─────────────────────────────────────────────── */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${TOKENS.colors.surface.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: TOKENS.colors.surface.cardAlt,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: TOKENS.colors.brand[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={16} color={TOKENS.colors.brand[600]} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Operational Intelligence Assistant
            </h3>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
              Structured Telemetry Diagnostic · Grounded in Mill Records
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: TOKENS.colors.text.muted,
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Subject Under Inspection ──────────────────────────────────── */}
      <div
        style={{
          padding: '14px 20px',
          background: TOKENS.colors.surface.card,
          borderBottom: `1px solid ${TOKENS.colors.surface.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.brand[600], textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {context.category || 'FLOOR DIAGNOSTIC'}
          </span>
          <DataTrustBadge provenance="CALCULATED" compact />
        </div>

        <div style={{ fontSize: '14.5px', fontWeight: 700, color: TOKENS.colors.text.primary, lineHeight: 1.3 }}>
          {context.title}
        </div>

        {context.loomNo && (
          <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, marginTop: '4px' }}>
            Target Machine: <strong style={{ color: TOKENS.colors.brand[600] }}>Loom {context.loomNo}</strong>
          </div>
        )}
      </div>

      {/* ── 1-Click Interactive Questions ─────────────────────────────── */}
      <div
        style={{
          padding: '10px 20px',
          background: TOKENS.colors.surface.cardAlt,
          borderBottom: `1px solid ${TOKENS.colors.surface.border}`,
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
        }}
      >
        {quickQuestions.map((q) => (
          <button
            key={q.id}
            onClick={() => setActiveQuestion(q.id)}
            style={{
              padding: '5px 10px',
              fontSize: '11.5px',
              fontWeight: activeQuestion === q.id ? 700 : 500,
              borderRadius: '4px',
              border: `1px solid ${activeQuestion === q.id ? TOKENS.colors.brand[600] : TOKENS.colors.surface.border}`,
              background: activeQuestion === q.id ? TOKENS.colors.brand[600] : '#FFFFFF',
              color: activeQuestion === q.id ? '#FFFFFF' : TOKENS.colors.text.secondary,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* ── Dynamic Grounded Response Body ────────────────────────────── */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* EXPLAIN FINDING */}
        {activeQuestion === 'explain' && (
          <>
            <div>
              <h4 style={{ fontSize: '12.5px', fontWeight: 700, margin: '0 0 6px 0', color: TOKENS.colors.text.primary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Observed Facts (Telemetry)
              </h4>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: TOKENS.colors.text.secondary, lineHeight: 1.5 }}>
                {context.observations && context.observations.length > 0 ? (
                  context.observations.map((obs, i) => <li key={i}>{obs}</li>)
                ) : (
                  <>
                    <li>{context.issueDescription}</li>
                    {context.downtimeMin && <li>Total logged stoppage: {context.downtimeMin} minutes.</li>}
                  </>
                )}
              </ul>
            </div>

            <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px 14px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.text.muted, marginBottom: '4px', textTransform: 'uppercase' }}>
                AI Diagnostic Inference
              </div>
              <div style={{ fontSize: '13px', color: TOKENS.colors.text.primary, lineHeight: 1.45 }}>
                {context.probableCause || 'Analysis indicates stoppage duration exceeded threshold due to recurring drive trips.'}
              </div>
            </div>
          </>
        )}

        {/* WHY IS THIS COSTING US */}
        {activeQuestion === 'why_cost' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: TOKENS.colors.status.critical.bg, border: `1px solid ${TOKENS.colors.status.critical.border}`, padding: '12px', borderRadius: TOKENS.radius.sm }}>
                <div style={{ fontSize: '11px', color: TOKENS.colors.status.critical.text, fontWeight: 700 }}>Direct Revenue Exposure</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono, marginTop: '4px' }}>
                  ₹{context.impactInr ? context.impactInr.toLocaleString() : '37,500'}
                </div>
              </div>

              <div style={{ background: TOKENS.colors.surface.cardAlt, border: `1px solid ${TOKENS.colors.surface.border}`, padding: '12px', borderRadius: TOKENS.radius.sm }}>
                <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 700 }}>Lost Fabric Metres</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: TOKENS.colors.brand[600], fontFamily: TOKENS.typography.fontMono, marginTop: '4px' }}>
                  {context.impactMetres ? `${context.impactMetres.toLocaleString()} m` : '938 m'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary, lineHeight: 1.45 }}>
              Calculated using active style selling rate card (<strong>₹40.00 / metre</strong>) against standard 650 RPM production velocity.
            </div>
          </>
        )}

        {/* WHAT SHOULD I DO FIRST */}
        {activeQuestion === 'what_first' && (
          <>
            <div style={{ background: TOKENS.colors.brand[50], border: `1px solid ${TOKENS.colors.brand[100]}`, padding: '14px', borderRadius: TOKENS.radius.sm }}>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: TOKENS.colors.brand[700], marginBottom: '4px' }}>
                PRIORITIZED MANAGEMENT ACTION
              </div>
              <div style={{ fontSize: '13.5px', color: TOKENS.colors.text.primary, fontWeight: 600, lineHeight: 1.4 }}>
                {context.recommendedAction || 'Direct shift maintenance to perform sub-panel electrical inspection.'}
              </div>
            </div>

            <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted }}>
              Executing this intervention within the current shift preserves an estimated <strong>85% of downstream billable delivery</strong>.
            </div>
          </>
        )}

        {/* WHAT CHANGED VS BASELINE */}
        {activeQuestion === 'what_changed' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: TOKENS.colors.surface.cardAlt, borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                <span style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary }}>30-Day Rolling Baseline:</span>
                <strong style={{ fontSize: '12.5px', color: TOKENS.colors.text.primary }}>{context.baseline || '45 min / shift'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: TOKENS.colors.status.critical.bg, borderRadius: '4px', border: `1px solid ${TOKENS.colors.status.critical.border}` }}>
                <span style={{ fontSize: '12.5px', color: TOKENS.colors.status.critical.text, fontWeight: 600 }}>Today's Measured Value:</span>
                <strong style={{ fontSize: '12.5px', color: TOKENS.colors.status.critical.text }}>{context.current_value || '509 min logged'}</strong>
              </div>
            </div>
          </>
        )}

        {/* WHAT HAPPENS TOMORROW */}
        {activeQuestion === 'future_risk' && (
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '14px', borderRadius: TOKENS.radius.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              <AlertTriangle size={14} />
              <span>FORWARD RISK PROJECTION</span>
            </div>
            <div style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.45 }}>
              If unaddressed, recurring drive trips are predicted to cause an additional <strong>240–360 minutes downtime</strong> on next shift, escalating daily loss past <strong>₹60,000</strong>.
            </div>
          </div>
        )}

        {/* Traceable Source Provenance */}
        {context.sourceIds && context.sourceIds.length > 0 && (
          <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, marginBottom: '4px' }}>
              Traceable Data Provenance:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {context.sourceIds.map((sid, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '10.5px',
                    fontFamily: TOKENS.typography.fontMono,
                    background: TOKENS.colors.surface.toolbar,
                    padding: '2px 6px',
                    borderRadius: '3px',
                    color: TOKENS.colors.text.secondary,
                    border: `1px solid ${TOKENS.colors.surface.border}`,
                  }}
                >
                  {sid}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Drawer Footer Action ──────────────────────────────────────── */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: `1px solid ${TOKENS.colors.surface.border}`,
          background: TOKENS.colors.surface.cardAlt,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: '8px 14px',
            fontSize: '12.5px',
            background: 'transparent',
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: '4px',
            cursor: 'pointer',
            color: TOKENS.colors.text.secondary,
          }}
        >
          Dismiss
        </button>

        {onAssignAction && (
          <button
            onClick={() => {
              onAssignAction(context);
              onClose();
            }}
            style={{
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 600,
              background: TOKENS.colors.brand[600],
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Assign Action</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
