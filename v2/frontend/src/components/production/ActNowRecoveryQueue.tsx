import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ActNowItem } from '../../api';

interface ActNowRecoveryQueueProps {
  queue: ActNowItem[];
  onSelectAction: (item: ActNowItem) => void;
  onSelectLoom: (loomId: number) => void;
}

export const ActNowRecoveryQueue: React.FC<ActNowRecoveryQueueProps> = ({
  queue,
  onSelectAction,
  onSelectLoom,
}) => {
  return (
    <div className="act-now-recovery-queue" style={{
      background: '#FFFFFF',
      border: '1px solid #E2E6EA',
      borderRadius: '8px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            background: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 800,
          }}>
            !
          </div>
          <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Act Now — Production Recovery Queue
          </h2>
        </div>
        <span style={{ fontSize: '11.5px', color: '#64748B' }}>
          Top 3 interventions to recover today's gap
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '14px',
      }}>
        {queue.map((item, index) => (
          <div
            key={item.loom_id}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px',
              transition: 'border-color 0.15s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#1E293B',
                    color: '#FFFFFF',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {index + 1}
                  </span>
                  <button
                    onClick={() => onSelectLoom(item.loom_id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#2563EB',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Loom {item.loom_no}
                  </button>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>({item.loom_type})</span>
                </div>

                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#DC2626' }}>
                  ₹{item.revenue_exposure_inr.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: 500 }}>exp</span>
                </div>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginTop: '6px' }}>
                {item.problem}
              </div>

              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                Output gap: <strong>{item.lost_metres} m</strong> • Stopped: <strong>{item.stopped_minutes} min</strong> • Eff: <strong>{item.efficiency_pct}%</strong>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #E2E8F0',
              paddingTop: '8px',
            }}>
              <span style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>
                {item.action}
              </span>

              <button
                onClick={() => onSelectAction(item)}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 1px 2px rgba(37,99,235,0.2)',
                  transition: 'background 0.15s ease',
                }}
              >
                <span>[{item.action_verb}]</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
