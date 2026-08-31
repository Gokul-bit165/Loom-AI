'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { fmtMinutes, fmtDatetime, inr } from '@/lib/utils';
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

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 0 80px' }}>
      
      {/* Header Stamp */}
      <div style={{ padding: '8px 16px', background: 'var(--ink-100)', borderBottom: '1px solid var(--atm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DataStamp asOf={new Date().toISOString()} source="Floor Controller" />
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--ok)' }}>● Live Floor Feed</span>
      </div>

      <div style={{ padding: '16px', borderBottom: '1px solid var(--atm-border)' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--atm-header)', marginBottom: 2 }}>
          Live Floor Stoppages
        </h1>
        <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)' }}>
          தற்போதைய நிறுத்தங்கள் · Shift 1 · Response time SLA: 15m / 30m escalation
        </div>
      </div>

      {/* Stop Cards */}
      <div style={{ padding: '12px 16px' }}>
        {stops.length === 0 ? (
          <div className="no-data-state">
            <div style={{ fontWeight: 600, color: 'var(--ok)' }}>✓ All Looms Running Smoothly</div>
            <div className="reason">No active stoppages logged on the floor right now.</div>
          </div>
        ) : (
          stops.map(stop => (
            <div
              key={stop.id}
              style={{
                border: `1px solid ${stop.status === 'critical' ? 'var(--critical-border)' : stop.status === 'warn' ? 'var(--warn-border)' : 'var(--atm-border)'}`,
                borderLeft: `5px solid ${stop.status === 'critical' ? 'var(--critical)' : stop.status === 'warn' ? 'var(--warn)' : 'var(--ok)'}`,
                background: stop.status === 'critical' ? 'var(--critical-bg)' : stop.status === 'warn' ? 'var(--warn-bg)' : '#fff',
                borderRadius: 4,
                padding: '12px 14px',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--ink-900)' }}>
                    {stop.loomId}
                  </span>
                  <StatusBadge
                    status={stop.status}
                    label={`${stop.minutesAgo}m stopped`}
                  />
                </div>
                <button
                  className="btn btn-outline"
                  style={{ minHeight: 32, padding: '0 10px', fontSize: '0.75rem' }}
                  onClick={() => closeStop(stop.id)}
                >
                  ✓ Close Stop
                </button>
              </div>

              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink-900)' }}>
                {stop.reason}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)', marginTop: 1 }}>
                {stop.reasonTa} {stop.attendedBy && `· Attended by: ${stop.attendedBy}`}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Standard Reason Code Reference in Tamil & English */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--atm-border)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--atm-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
          Standard Floor Reason Codes (காரண குறியீடுகள்)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
          {REASONS.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#fff', border: '1px solid var(--atm-border)', borderRadius: 3, fontSize: '0.8125rem' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{r.en}</span>
                <span style={{ color: 'var(--ink-500)', marginLeft: 8 }}>{r.ta}</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase' }}>{r.category}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
