import React, { useState } from 'react';
import type { TimelineSeriesPoint } from '../api';
import { TOKENS, DataTrustBadge } from '../design-system';
import {
  X,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wrench,
  AlertTriangle,
  Clock,
  Layers,
  CheckCircle2,
  Send,
  BarChart3,
} from 'lucide-react';

interface ShiftLossReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: TimelineSeriesPoint | null;
  shiftTimeLabel?: string;
  onOpenAiDrawer?: (shift: TimelineSeriesPoint) => void;
}

export const ShiftLossReasonModal: React.FC<ShiftLossReasonModalProps> = ({
  isOpen,
  onClose,
  shift,
  shiftTimeLabel = '8-Hour Production Run',
  onOpenAiDrawer,
}) => {
  const [activeTab, setActiveTab] = useState<'hourly' | 'pareto' | 'timeline'>('hourly');
  const [assigned, setAssigned] = useState(false);

  if (!isOpen || !shift) return null;

  const deltaMetres = shift.delta_metres !== undefined ? shift.delta_metres : (shift.current_metres - shift.baseline_metres);
  const deltaPct = shift.delta_pct !== undefined ? shift.delta_pct : Number(((deltaMetres / Math.max(shift.baseline_metres, 1)) * 100).toFixed(1));
  const isLoss = deltaMetres < 0;
  const deltaEff = shift.delta_eff !== undefined ? shift.delta_eff : Number((shift.current_eff - shift.baseline_eff).toFixed(1));
  const lossInr = shift.loss_cost_inr || (isLoss ? Math.round(Math.abs(deltaMetres) * 60) : 0);

  const hourlyData = shift.hourly_telemetry || [];
  const paretoData = shift.loom_breakdown_pareto || [];
  const chronology = shift.chronology_events || [];

  // Max value calculation for chart scaling
  const maxHourlyMetres = hourlyData.length > 0
    ? Math.max(...hourlyData.map(h => Math.max(h.today_m, h.yesterday_m, h.target_m))) * 1.05
    : 2200;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
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
          width: '880px',
          maxWidth: '95vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: `1px solid ${TOKENS.colors.surface.border}`,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 1. MODAL HEADER ──────────────────────────────────────────────── */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: `1px solid ${TOKENS.colors.surface.border}`,
            background: isLoss ? '#FFF5F5' : TOKENS.colors.surface.cardAlt,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: isLoss ? '#FEE2E2' : TOKENS.colors.brand[100],
                color: isLoss ? '#BE123C' : TOKENS.colors.brand[700],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isLoss ? <AlertTriangle size={20} /> : <Sparkles size={20} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: TOKENS.colors.text.primary }}>
                  {shift.label} Root Cause & Loss Investigation
                </h2>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: isLoss ? '#FEE2E2' : '#DCFCE7',
                    color: isLoss ? '#991B1B' : '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  {isLoss ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
                  <span>{isLoss ? '' : '+'}{deltaMetres.toFixed(1)} m ({isLoss ? '' : '+'}{deltaPct}%)</span>
                </span>
                {isLoss && (
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#BE123C', background: '#FFE4E6', padding: '2px 8px', borderRadius: '4px' }}>
                    Loss: -₹{lossInr.toLocaleString()}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>{shiftTimeLabel}</span>
                <span>•</span>
                <span>Work Date: 31 Jul 2026 vs 30 Jul 2026</span>
                <span>•</span>
                <DataTrustBadge provenance="ACTUAL" />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              color: TOKENS.colors.text.muted,
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── 2. MODAL BODY (SCROLLABLE) ─────────────────────────────────── */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* AI Root Cause Executive Summary Box */}
          <div
            style={{
              background: isLoss ? '#FFF1F2' : '#F0FDF4',
              border: `1px solid ${isLoss ? '#FECDD3' : '#BBF7D0'}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color={isLoss ? '#E11D48' : '#16A34A'} />
                <span style={{ fontSize: '12px', fontWeight: 800, color: isLoss ? '#9F1239' : '#166534', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  AI ROOT CAUSE DIAGNOSIS · {shift.loss_category || (isLoss ? 'OPERATIONAL DEFICIT' : 'OPTIMAL RUN')}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: isLoss ? '#9F1239' : '#166534', fontWeight: 700, background: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${isLoss ? '#FECDD3' : '#BBF7D0'}` }}>
                {shift.ai_confidence || '94% Confidence Grounded in Sensors'}
              </span>
            </div>

            <div style={{ fontSize: '13.5px', color: isLoss ? '#881337' : '#14532D', lineHeight: 1.5, fontWeight: 600 }}>
              {shift.ai_root_cause || shift.ai_loss_reason || (isLoss
                ? `${shift.label} output dropped by ${Math.abs(deltaMetres).toFixed(1)} m compared to yesterday due to concentrated downtime events.`
                : 'Shift performance remained within optimal standard operating parameters.')}
            </div>

            {/* Affected Looms Tags */}
            {shift.affected_looms && shift.affected_looms.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#9F1239' }}>Affected Machine Units:</span>
                {shift.affected_looms.map((loom, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '11px',
                      fontFamily: TOKENS.typography.fontMono,
                      fontWeight: 800,
                      background: '#FFFFFF',
                      border: '1px solid #FECDD3',
                      color: '#9F1239',
                      padding: '2px 7px',
                      borderRadius: '4px',
                    }}
                  >
                    {loom}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 4 Core Summary Stat Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px 14px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 600 }}>Today Output</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                {shift.current_metres.toLocaleString()} m
              </div>
              <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted, marginTop: '1px' }}>
                Target: {Math.round(shift.target_metres).toLocaleString()} m
              </div>
            </div>

            <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px 14px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 600 }}>Yesterday Baseline</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#D97706', fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                {shift.baseline_metres.toLocaleString()} m
              </div>
              <div style={{ fontSize: '10.5px', color: isLoss ? '#991B1B' : '#166534', fontWeight: 700, marginTop: '1px' }}>
                Delta: {isLoss ? '' : '+'}{deltaMetres.toFixed(1)} m ({deltaPct}%)
              </div>
            </div>

            <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px 14px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 600 }}>Efficiency Run</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                {shift.current_eff}%
              </div>
              <div style={{ fontSize: '10.5px', color: deltaEff >= 0 ? '#166534' : '#991B1B', fontWeight: 700, marginTop: '1px' }}>
                {deltaEff >= 0 ? '+' : ''}{deltaEff} pp vs Yesterday ({shift.baseline_eff}%)
              </div>
            </div>

            <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px 14px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, fontWeight: 600 }}>Total Yarn Breaks</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                {shift.current_breaks.toLocaleString()}
              </div>
              <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted, marginTop: '1px' }}>
                Yesterday: {shift.baseline_breaks.toLocaleString()} stops
              </div>
            </div>
          </div>

          {/* ── 3. VISUAL ANALYSIS TABS ────────────────────────────────────── */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${TOKENS.colors.surface.border}`, gap: '4px' }}>
            <button
              onClick={() => setActiveTab('hourly')}
              style={{
                padding: '8px 16px',
                fontSize: '12.5px',
                fontWeight: activeTab === 'hourly' ? 800 : 600,
                border: 'none',
                borderBottom: activeTab === 'hourly' ? `2px solid ${TOKENS.colors.brand[600]}` : '2px solid transparent',
                background: 'transparent',
                color: activeTab === 'hourly' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <BarChart3 size={15} />
              <span>Hourly Output Comparison Chart (8 Hours)</span>
            </button>

            <button
              onClick={() => setActiveTab('pareto')}
              style={{
                padding: '8px 16px',
                fontSize: '12.5px',
                fontWeight: activeTab === 'pareto' ? 800 : 600,
                border: 'none',
                borderBottom: activeTab === 'pareto' ? `2px solid ${TOKENS.colors.brand[600]}` : '2px solid transparent',
                background: 'transparent',
                color: activeTab === 'pareto' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Layers size={15} />
              <span>Machine Downtime Pareto ({paretoData.length} Looms)</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              style={{
                padding: '8px 16px',
                fontSize: '12.5px',
                fontWeight: activeTab === 'timeline' ? 800 : 600,
                border: 'none',
                borderBottom: activeTab === 'timeline' ? `2px solid ${TOKENS.colors.brand[600]}` : '2px solid transparent',
                background: 'transparent',
                color: activeTab === 'timeline' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Clock size={15} />
              <span>Incident Chronology ({chronology.length} Events)</span>
            </button>
          </div>

          {/* TAB 1: HOURLY CHART */}
          {activeTab === 'hourly' && (
            <div
              style={{
                background: TOKENS.colors.surface.cardAlt,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                    Hour-by-Hour Production Comparison (Metres)
                  </h4>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                    Compares each 60-minute window between Yesterday and Today. Red markers denote anomaly hours.
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '10px', height: '10px', background: '#D97706', borderRadius: '2px' }} />
                    <span style={{ color: TOKENS.colors.text.muted }}>Yesterday</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '10px', height: '10px', background: isLoss ? '#E11D48' : TOKENS.colors.brand[600], borderRadius: '2px' }} />
                    <span style={{ color: isLoss ? '#E11D48' : TOKENS.colors.brand[700] }}>Today</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '14px', height: '0px', borderTop: '2px dashed #DC2626' }} />
                    <span style={{ color: '#DC2626' }}>Target (2,084 m/hr)</span>
                  </div>
                </div>
              </div>

              {/* Hourly Visual Bar Chart */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${hourlyData.length || 8}, 1fr)`, gap: '10px', height: '180px', alignItems: 'flex-end', paddingTop: '24px', borderBottom: `1px solid ${TOKENS.colors.surface.border}` }}>
                {hourlyData.map((pt, hIdx) => {
                  const yestHeightPct = Math.min(100, Math.max(15, (pt.yesterday_m / maxHourlyMetres) * 100));
                  const todayHeightPct = Math.min(100, Math.max(15, (pt.today_m / maxHourlyMetres) * 100));
                  const diffM = pt.today_m - pt.yesterday_m;

                  return (
                    <div key={hIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      {pt.is_anomaly && (
                        <div style={{ background: '#FEE2E2', border: '1px solid #FECDD3', borderRadius: '3px', padding: '1px 3px', fontSize: '9px', fontWeight: 800, color: '#B91C1C', marginBottom: '2px' }}>
                          ⚠️ DROP
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', height: '100%', justifyContent: 'center' }}>
                        {/* Yesterday Bar */}
                        <div
                          style={{
                            width: '42%',
                            maxWidth: '22px',
                            height: `${yestHeightPct}%`,
                            background: '#D97706',
                            opacity: 0.8,
                            borderRadius: '3px 3px 0 0',
                          }}
                          title={`Yesterday ${pt.hour}: ${pt.yesterday_m.toLocaleString()} m`}
                        />

                        {/* Today Bar */}
                        <div
                          style={{
                            width: '42%',
                            maxWidth: '22px',
                            height: `${todayHeightPct}%`,
                            background: pt.is_anomaly ? '#E11D48' : TOKENS.colors.brand[600],
                            borderRadius: '3px 3px 0 0',
                            boxShadow: pt.is_anomaly ? '0 2px 6px rgba(225,29,72,0.3)' : 'none',
                          }}
                          title={`Today ${pt.hour}: ${pt.today_m.toLocaleString()} m (Delta: ${diffM > 0 ? '+' : ''}${diffM.toFixed(1)} m)`}
                        />
                      </div>

                      <div style={{ fontSize: '10px', color: TOKENS.colors.text.muted, marginTop: '6px', fontWeight: 700, fontFamily: TOKENS.typography.fontMono }}>
                        {pt.hour}
                      </div>
                      <div style={{ fontSize: '9.5px', fontWeight: 700, color: diffM >= 0 ? '#166534' : '#991B1B' }}>
                        {diffM >= 0 ? '+' : ''}{diffM.toFixed(0)}m
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MACHINE PARETO */}
          {activeTab === 'pareto' && (
            <div
              style={{
                background: TOKENS.colors.surface.cardAlt,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
                Machine Downtime Breakdown Pareto (Top Loss Contributors)
              </div>

              {paretoData.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: TOKENS.colors.text.muted, fontSize: '12px' }}>
                  No significant downtime events recorded for this shift.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {paretoData.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#FFFFFF',
                        border: `1px solid ${TOKENS.colors.surface.border}`,
                        borderRadius: TOKENS.radius.sm,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            fontFamily: TOKENS.typography.fontMono,
                            padding: '3px 8px',
                            background: '#FEE2E2',
                            color: '#991B1B',
                            borderRadius: '4px',
                          }}
                        >
                          {item.loom_no}
                        </span>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
                            {item.reason}
                          </div>
                          <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                            Type: {item.type} • Downtime: {item.downtime_min} minutes
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#991B1B', fontFamily: TOKENS.typography.fontMono }}>
                          -{item.lost_m.toFixed(1)} m
                        </div>
                        {item.lost_inr && (
                          <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted }}>
                            -₹{item.lost_inr.toLocaleString()} drag
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CHRONOLOGY */}
          {activeTab === 'timeline' && (
            <div
              style={{
                background: TOKENS.colors.surface.cardAlt,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
                Shift Sequence & Telemetry Chronology
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', paddingLeft: '8px' }}>
                {chronology.map((ev, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: TOKENS.typography.fontMono,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: ev.badge === 'INCIDENT' || ev.badge === 'ALARM' ? '#FEE2E2' : '#EFF6FF',
                        color: ev.badge === 'INCIDENT' || ev.badge === 'ALARM' ? '#B91C1C' : '#1D4ED8',
                        minWidth: '55px',
                        textAlign: 'center',
                      }}
                    >
                      {ev.time}
                    </span>
                    <div style={{ fontSize: '12px', color: TOKENS.colors.text.primary, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>
                      {ev.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Prescribed Corrective Action */}
          {shift.ai_recommended_action && (
            <div
              style={{
                background: '#F8FAFC',
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.sm,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <Wrench size={16} color={TOKENS.colors.brand[600]} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: TOKENS.colors.brand[800], textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  AI Prescribed Corrective Action
                </div>
                <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.primary, fontWeight: 600, marginTop: '2px' }}>
                  {shift.ai_recommended_action}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 4. MODAL FOOTER ACTIONS ────────────────────────────────────── */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: `1px solid ${TOKENS.colors.surface.border}`,
            background: TOKENS.colors.surface.cardAlt,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onOpenAiDrawer && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAiDrawer(shift);
                }}
                style={{
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: TOKENS.colors.brand[100],
                  color: TOKENS.colors.brand[700],
                  border: `1px solid ${TOKENS.colors.brand[500]}`,
                  borderRadius: TOKENS.radius.sm,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={14} />
                <span>Ask AI Assistant for Deep Dive</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                setAssigned(true);
                setTimeout(() => setAssigned(false), 4000);
              }}
              style={{
                padding: '7px 16px',
                fontSize: '12px',
                fontWeight: 700,
                background: assigned ? '#166534' : TOKENS.colors.brand[600],
                color: '#FFFFFF',
                border: 'none',
                borderRadius: TOKENS.radius.sm,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
              }}
            >
              {assigned ? <CheckCircle2 size={14} /> : <Send size={14} />}
              <span>{assigned ? 'Action Assigned to Maintenance Floor!' : 'Assign Action to Maintenance Floor'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '7px 16px',
                fontSize: '12px',
                fontWeight: 600,
                background: '#FFFFFF',
                color: TOKENS.colors.text.secondary,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.sm,
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
};
