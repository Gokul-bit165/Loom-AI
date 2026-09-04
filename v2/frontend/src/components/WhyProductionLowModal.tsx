import {
  X,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { TOKENS, DataTrustBadge } from '../design-system';

interface WhyProductionLowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLoom?: (loomId: number) => void;
  onNavigateToRootCause?: (loomNo?: string) => void;
  targetMetres?: number;
  actualMetres?: number;
}

export function WhyProductionLowModal({
  isOpen,
  onClose,
  onNavigateToLoom,
  onNavigateToRootCause,
  targetMetres = 10000,
  actualMetres = 8200,
}: WhyProductionLowModalProps) {
  if (!isOpen) return null;

  const deficitMetres = actualMetres - targetMetres;
  const deficitPct = Math.round((deficitMetres / targetMetres) * 100 * 10) / 10;

  const primaryContributors = [
    {
      loomNo: 'AJ-104',
      loomId: 104,
      downtime: '2h 15m (135 min)',
      downtimeMinutes: 135,
      shareOfDeficit: '47.2%',
      metresLost: 850,
      rupeeLoss: 42500,
      breakdownPattern: 'Repeated Weft Stops (8 occurrences, every 20–30 min)',
      rootCause: 'Weft Feeder / Yarn Tension Instability',
      evidence: 'Sensor optical trip count: 18; Accumulator brake ring wear detected.',
      recommendation: 'Inspect and calibrate weft feeder tension disc. Check Lot #441 yarn supply before next shift.',
      actionStatus: 'P1 CRITICAL',
    },
    {
      loomNo: 'AJ-108',
      loomId: 108,
      downtime: '1h 10m (70 min)',
      downtimeMinutes: 70,
      shareOfDeficit: '27.2%',
      metresLost: 490,
      rupeeLoss: 24500,
      breakdownPattern: 'Air Pressure Failure (Sub-header dropped to 5.4 bar)',
      rootCause: 'Compressor Line Pressure Variation / Filter Blockage',
      evidence: 'Shed 2 branch line pressure dipped below 5.8 bar threshold between 14:15 - 15:30.',
      recommendation: 'Check compressor regulator filter and purge moisture separator in Shed 2 line.',
      actionStatus: 'P2 HIGH',
    },
    {
      loomNo: 'Other Looms & Micro-Stops',
      loomId: undefined,
      downtime: '1h 05m distributed',
      downtimeMinutes: 65,
      shareOfDeficit: '25.6%',
      metresLost: 460,
      rupeeLoss: 23000,
      breakdownPattern: 'Distributed warp knotting delays & speed drift',
      rootCause: 'Shift B operator response latency during concurrent roll doffing',
      evidence: 'Average technician arrival latency was 12.4 min (Shift B).',
      recommendation: 'Rebalance patrol routes to cover northern airjet alley during peak 14:00 - 16:00 window.',
      actionStatus: 'P3 MEDIUM',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: TOKENS.radius.lg,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
          width: '840px',
          maxWidth: '96vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #334155',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#F87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                  WHY IS PRODUCTION LOW?
                </h3>
                <span
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {deficitPct}% DEFICIT
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                Instant AI Root-Cause Diagnostic & Machine Attribution Chain
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '6px',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            title="Close Diagnostic"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Target vs Actual Comparison Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto 1fr',
              alignItems: 'center',
              background: '#F8FAFC',
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.text.muted, textTransform: 'uppercase' }}>
                Production Target
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                {targetMetres.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500 }}>meters</span>
              </div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                Std requirement for 192 looms
              </div>
            </div>

            <div style={{ color: '#94A3B8', fontSize: '18px', fontWeight: 700 }}>—</div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.text.muted, textTransform: 'uppercase' }}>
                Actual Production
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#DC2626', fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                {actualMetres.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500 }}>meters</span>
              </div>
              <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600, marginTop: '2px' }}>
                Shift A & B aggregated
              </div>
            </div>

            <div style={{ color: '#94A3B8', fontSize: '18px', fontWeight: 700 }}>=</div>

            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '8px 14px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase' }}>
                Production Difference
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#DC2626', fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                {deficitMetres.toLocaleString()} m ({deficitPct}%)
              </div>
              <div style={{ fontSize: '11px', color: '#B91C1C', fontWeight: 600, marginTop: '2px' }}>
                Revenue Loss: ₹{Math.abs(deficitMetres * 40).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Primary Contributors Flow */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={16} color="#2563EB" />
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, margin: 0, color: TOKENS.colors.text.primary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Primary Root Contributors (80/20 Attribution)
                </h4>
              </div>
              <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
                2 machines accounted for <strong>74.4%</strong> of today's deficit
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {primaryContributors.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: idx === 0 ? '1.5px solid #F87171' : `1px solid ${TOKENS.colors.surface.border}`,
                    borderRadius: TOKENS.radius.md,
                    padding: '16px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                  }}
                >
                  {/* Top line with Loom, Downtime and Loss */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: idx === 0 ? '#DC2626' : '#E2E8F0',
                          color: idx === 0 ? '#FFFFFF' : TOKENS.colors.text.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <strong style={{ fontSize: '15px', color: TOKENS.colors.text.primary }}>
                        {c.loomNo}
                      </strong>
                      <span
                        style={{
                          background: idx === 0 ? '#FEE2E2' : '#F1F5F9',
                          color: idx === 0 ? '#B91C1C' : TOKENS.colors.text.secondary,
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {c.downtime}
                      </span>
                      <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
                        ({c.shareOfDeficit} of total deficit)
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#DC2626', fontFamily: TOKENS.typography.fontMono }}>
                        -{c.metresLost} meters
                      </span>
                      <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginLeft: '8px' }}>
                        (₹{c.rupeeLoss.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {/* Root Cause Chain Box */}
                  <div
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                      <span style={{ color: TOKENS.colors.text.muted, fontWeight: 600, minWidth: '130px' }}>
                        Breakdown Pattern:
                      </span>
                      <span style={{ fontWeight: 700, color: TOKENS.colors.text.primary }}>
                        {c.breakdownPattern}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
                      <span style={{ color: '#DC2626', fontWeight: 700, minWidth: '130px' }}>
                        Possible Root Cause:
                      </span>
                      <span
                        style={{
                          fontWeight: 800,
                          color: '#991B1B',
                          background: '#FEF2F2',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #FECACA',
                        }}
                      >
                        {c.rootCause}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: TOKENS.colors.text.secondary }}>
                      <span style={{ color: TOKENS.colors.text.muted, fontWeight: 600, minWidth: '130px' }}>
                        Evidence / Sensor:
                      </span>
                      <span>{c.evidence}</span>
                    </div>
                  </div>

                  {/* Recommendation & Navigation Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#166534' }}>
                      <CheckCircle2 size={15} color="#16A34A" />
                      <span><strong>Recommendation:</strong> {c.recommendation}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {c.loomId && onNavigateToLoom && (
                        <button
                          onClick={() => {
                            onNavigateToLoom(c.loomId!);
                            onClose();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            color: '#1D4ED8',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <span>Inspect {c.loomNo} Profile</span>
                          <ExternalLink size={12} />
                        </button>
                      )}

                      {onNavigateToRootCause && (
                        <button
                          onClick={() => {
                            onNavigateToRootCause(c.loomNo);
                            onClose();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            color: TOKENS.colors.text.primary,
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <span>Root Cause Chain</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: '#F8FAFC',
            borderTop: `1px solid ${TOKENS.colors.surface.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DataTrustBadge provenance="CALCULATED" />
            <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
              Diagnostic computed across 23,776 telemetry events & machine sensor thresholds.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onNavigateToRootCause && (
              <button
                onClick={() => {
                  onNavigateToRootCause();
                  onClose();
                }}
                style={{
                  padding: '7px 16px',
                  background: TOKENS.colors.brand[600],
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Open Deep Root Cause Analysis</span>
                <ArrowRight size={14} />
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                padding: '7px 16px',
                background: '#FFFFFF',
                color: TOKENS.colors.text.secondary,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
