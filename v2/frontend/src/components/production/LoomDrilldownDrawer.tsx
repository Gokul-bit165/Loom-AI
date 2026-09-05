import React, { useEffect, useState } from 'react';
import { X, Cpu } from 'lucide-react';
import { fetchProductionLoomDetail } from '../../api';
import type { ProductionLoomDrilldownResponse } from '../../api';

interface LoomDrilldownDrawerProps {
  loomId: number | null;
  onClose: () => void;
  onExplainLoom: (loomNo: string) => void;
}

export const LoomDrilldownDrawer: React.FC<LoomDrilldownDrawerProps> = ({
  loomId,
  onClose,
  onExplainLoom,
}) => {
  const [data, setData] = useState<ProductionLoomDrilldownResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (loomId) {
      setLoading(true);
      fetchProductionLoomDetail(loomId)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [loomId]);

  if (!loomId) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '460px',
        maxWidth: '90vw',
        background: '#FFFFFF',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #E2E8F0',
        animation: 'slideInRight 0.2s ease-out',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#F8FAFC',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={16} color="#2563EB" />
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            Loom {data?.loom_no || loomId} 360° Profile
          </h3>
          <span style={{ fontSize: '11px', color: '#64748B' }}>({data?.loom_type})</span>
        </div>

        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      {loading && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
          Loading 30-day telemetry and stoppage Pareto...
        </div>
      )}

      {data && !loading && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick AI Trigger */}
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '6px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>
              Need deeper root-cause investigation?
            </div>
            <button
              onClick={() => onExplainLoom(data.loom_no)}
              style={{
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              [AI Explain]
            </button>
          </div>

          {/* Stoppage Causes Pareto */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '6px', padding: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
              Primary Stop Causes (Last 30 Days)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {data.top_stoppage_causes.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#334155' }}>{c.reason}</span>
                  <strong style={{ color: '#0F172A' }}>{c.event_count} events</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Recent 10 Days Output & Efficiency Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '6px', padding: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
              Recent 10 Days Daily Performance
            </div>
            <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#64748B', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '4px 0' }}>Date</th>
                  <th style={{ padding: '4px 0' }}>Output</th>
                  <th style={{ padding: '4px 0' }}>Eff %</th>
                  <th style={{ padding: '4px 0' }}>Downtime</th>
                </tr>
              </thead>
              <tbody>
                {data.history_30d.slice(-10).reverse().map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '4px 0', color: '#475569' }}>{h.date.slice(5)}</td>
                    <td style={{ padding: '4px 0', fontWeight: 600 }}>{h.metres} m</td>
                    <td style={{ padding: '4px 0', color: h.efficiency_pct >= 90 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>{h.efficiency_pct}%</td>
                    <td style={{ padding: '4px 0', color: h.stopped_minutes > 150 ? '#DC2626' : '#64748B' }}>{h.stopped_minutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
