'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { DataStamp } from '@/components/DataStamp';
import { StatusBadge } from '@/components/StatusBadge';
import type { BreakdownRankingData } from '@/lib/types';

interface StopItem {
  id: string;
  loomId: string;
  minutesAgo: number;
  reason: string;
  reasonTa: string;
  shift: number;
  attendedBy?: string;
  status: 'critical' | 'warn' | 'ok';
}

const REASONS = [
  { en: 'Weft Break', ta: 'நூல் அறுதல்', category: 'MECHANICAL' },
  { en: 'Warp Tension / Break', ta: 'ஓர்ப்பு இழுவை / முறிவு', category: 'MECHANICAL' },
  { en: 'Power Interruption', ta: 'மின் தடை', category: 'ELECTRICAL' },
  { en: 'Loom Tuning & Maintenance', ta: 'இயந்திர பராமரிப்பு', category: 'PLANNED' },
  { en: 'Beam Change / Knotting', ta: 'பாவு மாற்றுதல்', category: 'PLANNED' },
  { en: 'Doffing / Roll Change', ta: 'துணி உருளை மாற்றுதல்', category: 'OPERATOR' },
];

export default function FloorPage() {
  const [data, setData] = useState<BreakdownRankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stops, setStops] = useState<StopItem[]>([
    { id: '1', loomId: 'TOY-08', minutesAgo: 47, reason: 'Weft Break', reasonTa: 'நூல் அறுதல்', shift: 1, status: 'critical' },
    { id: '2', loomId: 'TOY-04', minutesAgo: 18, reason: 'Warp Tension / Break', reasonTa: 'ஓர்ப்பு இழுவை', shift: 1, attendedBy: 'Sudhakar (00:04)', status: 'warn' },
    { id: '3', loomId: 'SUL-02', minutesAgo: 6, reason: 'Beam Change / Knotting', reasonTa: 'பாவு மாற்றுதல்', shift: 1, status: 'ok' },
  ]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getBreakdownRanking({ period: 'today' });
      setData(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function closeStop(id: string) {
    setStops(prev => prev.filter(s => s.id !== id));
  }

  const criticalCount = stops.filter(s => s.status === 'critical').length;
  const warningCount = stops.filter(s => s.status === 'warn').length;

  return (
    <div className="page-container">
      {/* Provenance bar */}
      <div className="provenance-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DataStamp asOf={new Date().toISOString()} source="Floor Controller / IoT Sensor Feed" />
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            Live WebSocket
          </span>
        </div>
        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
          Shift 1 · Response SLA: 15m / 30m escalation
        </div>
      </div>

      {/* Hero Header */}
      <div className="section-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="section-eyebrow">Real-Time Shift Floor Control</div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px', letterSpacing: '-0.02em' }}>
              Live Floor Stoppages
            </h1>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              தற்போதைய நிறுத்தங்கள் · Auto-escalation active for prolonged downtime
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn-outline"
              style={{ minHeight: 32, fontSize: '0.75rem', padding: '0 12px' }}
              onClick={() => load()}
            >
              ↻ Refresh Sensors
            </button>
          </div>
        </div>

        {/* Connected Metric Strip */}
        <div className="metric-strip" style={{ marginTop: 16 }}>
          <div className="metric-cell">
            <div className="metric-label">Active Stops</div>
            <div className="metric-val" style={{ color: stops.length > 0 ? '#b91c1c' : '#16a34a' }}>
              {stops.length}
            </div>
            <div className="metric-note">{criticalCount} critical, {warningCount} attention</div>
          </div>
          <div className="metric-cell">
            <div className="metric-label">Escalated (&gt;30m)</div>
            <div className="metric-val" style={{ color: criticalCount > 0 ? '#b91c1c' : '#0f172a' }}>
              {criticalCount}
            </div>
            <div className="metric-note">Immediate jobber attention</div>
          </div>
          <div className="metric-cell">
            <div className="metric-label">Running Looms</div>
            <div className="metric-val" style={{ color: '#0f172a' }}>
              {Math.max(0, 15 - stops.length)} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#64748b' }}>/ 15</span>
            </div>
            <div className="metric-note">80% active fleet capacity</div>
          </div>
          <div className="metric-cell">
            <div className="metric-label">SLA Benchmark</div>
            <div className="metric-val" style={{ color: '#2563eb' }}>
              15m
            </div>
            <div className="metric-note">Target floor response time</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16, marginTop: 16 }}>
        {/* Active Stoppages Column */}
        <div>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#475569',
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Active Machines Needing Service</span>
            <span>{stops.length} units</span>
          </div>

          {stops.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '36px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#16a34a', marginBottom: 4 }}>
                ✓ All Looms Running Smoothly
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                No active stoppages logged on the floor right now.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stops.map(stop => (
                <div
                  key={stop.id}
                  style={{
                    border: `1px solid ${stop.status === 'critical' ? '#fecaca' : stop.status === 'warn' ? '#fed7aa' : '#e2e8f0'}`,
                    borderLeft: `4px solid ${stop.status === 'critical' ? '#dc2626' : stop.status === 'warn' ? '#ea580c' : '#16a34a'}`,
                    background: stop.status === 'critical' ? '#fef2f2' : stop.status === 'warn' ? '#fff7ed' : '#ffffff',
                    borderRadius: 8,
                    padding: '14px 16px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
                        {stop.loomId}
                      </span>
                      <StatusBadge
                        status={stop.status}
                        label={`${stop.minutesAgo}m stopped`}
                      />
                    </div>
                    <button
                      className="btn btn-outline"
                      style={{
                        minHeight: 30,
                        padding: '0 12px',
                        fontSize: '0.75rem',
                        background: '#ffffff',
                        borderColor: '#cbd5e1'
                      }}
                      onClick={() => closeStop(stop.id)}
                    >
                      ✓ Close Stop
                    </button>
                  </div>

                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                    {stop.reason}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 3 }}>
                    {stop.reasonTa} {stop.attendedBy && `· Assigned: ${stop.attendedBy}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Standard Reason Code Reference Column */}
        <div>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#475569',
            marginBottom: 10
          }}>
            Standard Reason Codes (காரண குறியீடுகள்)
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              padding: '10px 14px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#64748b',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Root Cause (EN / TA)</span>
              <span>Category</span>
            </div>
            {REASONS.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderBottom: i < REASONS.length - 1 ? '1px solid #f1f5f9' : 'none',
                  fontSize: '0.8125rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.en}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{r.ta}</div>
                </div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#475569',
                  background: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: 4
                }}>
                  {r.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data provenance footer */}
      <div className="data-footer-note">
        Telemetry synced from floor terminal dispatch. Response SLA threshold is 15 minutes before floor supervisor notification.
      </div>
    </div>
  );
}

