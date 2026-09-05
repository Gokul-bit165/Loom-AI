import React, { useState } from 'react';
import { X, Check, Eye, FileText } from 'lucide-react';
import type { ExplainResponse } from '../../api';

interface ContextualExplainDrawerProps {
  data: ExplainResponse | null;
  loading: boolean;
  onClose: () => void;
  onAssignAction?: (actionText: string) => void;
}

export const ContextualExplainDrawer: React.FC<ContextualExplainDrawerProps> = ({
  data,
  loading,
  onClose,
  onAssignAction,
}) => {
  const [actionAdded, setActionAdded] = useState<boolean>(false);
  const [watchActive, setWatchActive] = useState<boolean>(false);

  if (!data && !loading) return null;

  const impact = data?.decide.business_impact;
  const expectedOutcome = data?.act.expected_outcome || 'Not enough evidence to estimate.';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '460px',
        maxWidth: '92vw',
        background: '#FFFFFF',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #E2E8F0',
        animation: 'slideInRight 0.2s ease-out',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#F8FAFC',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="#2563EB" />
          <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
            {data?.title || 'Production Investigation'}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      {loading && (
        <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
          Retrieving controller records and operational baseline...
        </div>
      )}

      {data && !loading && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Subtitle / Context Statement */}
          <div style={{ fontSize: '12px', color: '#64748B', fontStyle: 'italic' }}>
            Operational investigation: Why is this affecting today's output?
          </div>

          {/* ── 1. WHAT HAPPENED ── */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              What Happened
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', marginTop: '6px', lineHeight: '1.4' }}>
              {data.explain.what_happened}
            </div>
          </div>

          {/* ── 2. EVIDENCE (Observed Facts & Baseline Comparison) ── */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Evidence
              </span>
              <span style={{ fontSize: '9.5px', color: '#64748B' }}>Observed controller logs</span>
            </div>

            <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px', fontSize: '11.5px', color: '#334155', lineHeight: '1.5' }}>
              {data.explain.observed_evidence.map((ev, i) => (
                <li key={i}>{ev}</li>
              ))}
            </ul>

            {/* Baseline Visual Comparison Bar */}
            <div style={{ marginTop: '12px', background: '#F8FAFC', padding: '10px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                Downtime vs 30-Day Normal Baseline
              </div>

              {/* Baseline */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748B', marginBottom: '2px' }}>
                <span>30-Day Fleet Baseline</span>
                <strong>136 min / day</strong>
              </div>
              <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: '42%', height: '100%', background: '#94A3B8', borderRadius: '3px' }} />
              </div>

              {/* Current */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#DC2626', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600 }}>Current Machine Telemetry</span>
                <strong>328 min (2.4× baseline)</strong>
              </div>
              <div style={{ height: '8px', background: '#FEE2E2', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: '#DC2626', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          {/* ── 3. LIKELY CONTRIBUTOR (Inferred) ── */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px', borderLeft: '3px solid #64748B' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Likely Contributor · Inferred
            </div>
            <div style={{ fontSize: '12px', color: '#1E293B', marginTop: '4px', lineHeight: '1.4' }}>
              {data.explain.likely_contributor}
            </div>
          </div>

          {/* ── 4. BUSINESS IMPACT ── */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Business Impact
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
              {impact?.lost_output_metres !== undefined && (
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>Output Exposure</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#DC2626' }}>
                    {impact.lost_output_metres} <span style={{ fontSize: '11px', fontWeight: 500 }}>m</span>
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>Calculated</div>
                </div>
              )}

              {impact?.revenue_exposure_inr !== undefined && (
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>Revenue Exposure</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#DC2626' }}>
                    ₹{impact.revenue_exposure_inr.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>Estimated</div>
                </div>
              )}

              {impact?.potential_recovery_metres !== undefined && (
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>Potential Recovery</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A' }}>
                    {impact.potential_recovery_metres} <span style={{ fontSize: '11px', fontWeight: 500 }}>m</span>
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>Constrained</div>
                </div>
              )}
            </div>

            {/* Inaction Consequence */}
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#7F1D1D', background: '#FEF2F2', padding: '6px 8px', borderRadius: '4px', border: '1px solid #FCA5A5' }}>
              <span style={{ fontWeight: 700 }}>Inaction exposure: </span>
              {data.decide.risk_if_ignored}
            </div>
          </div>

          {/* ── 5. RECOMMENDED NEXT STEP & EXPECTED OUTCOME ── */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '14px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recommended Next Step
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', marginTop: '6px', lineHeight: '1.4' }}>
              {data.act.recommended_action}
            </div>

            {/* Expected Outcome (Evidence-supported only) */}
            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Expected Outcome
              </div>
              <div style={{ fontSize: '11.5px', color: '#334155', marginTop: '3px', lineHeight: '1.4' }}>
                {expectedOutcome}
              </div>
              {data.act.expected_outcome && (
                <div style={{ fontSize: '9.5px', color: '#94A3B8', marginTop: '2px' }}>
                  Based on historical machine intervention benchmarks.
                </div>
              )}
            </div>

            {/* Managerial Actions: Only Add to Action Plan and Watch */}
            <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setActionAdded(true);
                  if (onAssignAction) onAssignAction(data.act.recommended_action);
                }}
                style={{
                  flex: 2,
                  background: actionAdded ? '#F0FDF4' : '#2563EB',
                  color: actionAdded ? '#166534' : '#FFFFFF',
                  border: `1px solid ${actionAdded ? '#86EFAC' : '#2563EB'}`,
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {actionAdded ? <Check size={14} /> : null}
                <span>{actionAdded ? 'Added to Action Plan' : 'Add to Action Plan'}</span>
              </button>

              <button
                onClick={() => setWatchActive(!watchActive)}
                style={{
                  flex: 1,
                  background: watchActive ? '#EFF6FF' : '#FFFFFF',
                  border: `1px solid ${watchActive ? '#93C5FD' : '#CBD5E1'}`,
                  color: watchActive ? '#1E40AF' : '#334155',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <Eye size={13} />
                <span>{watchActive ? 'Watching' : 'Watch'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

