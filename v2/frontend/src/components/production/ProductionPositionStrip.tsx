import React from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';
import type { TodayPrimaryKpis, TodaySupportingMetrics, YesterdayComparison } from '../../api';

interface ProductionPositionStripProps {
  primary: TodayPrimaryKpis;
  supporting: TodaySupportingMetrics;
  yesterday: YesterdayComparison;
  onExplainGap: () => void;
}

export const ProductionPositionStrip: React.FC<ProductionPositionStripProps> = ({
  primary,
  supporting,
  yesterday,
  onExplainGap,
}) => {
  const { target_metres, actual_metres, gap_metres, gap_pct, efficiency_pct, running_efficiency_pct } = primary;

  // Scale calculations for bullet chart
  // Maximum range is comfortably 110% of max(target, actual) to provide visual reference space
  const maxScaleMetres = Math.max(target_metres, actual_metres) * 1.10;
  const targetPct = (target_metres / maxScaleMetres) * 100;
  const actualPct = (actual_metres / maxScaleMetres) * 100;

  // Efficiency gauge scale (0 to 100%)
  const stdEffPct = 90.0;
  const actualEffPct = Math.min(efficiency_pct, 100);

  // Configuration-driven status thresholds
  // gap_pct is negative when below target
  let statusBadge = {
    label: 'ON PLAN',
    icon: <CheckCircle2 size={13} color="#16A34A" />,
    color: '#16A34A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  };

  if (gap_pct < -3.0 || efficiency_pct < 88.0) {
    statusBadge = {
      label: 'ACTION REQUIRED',
      icon: <AlertOctagon size={13} color="#DC2626" />,
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FCA5A5',
    };
  } else if (gap_pct < -0.1 || efficiency_pct < 90.0) {
    statusBadge = {
      label: 'WATCH',
      icon: <AlertTriangle size={13} color="#D97706" />,
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
    };
  }

  const isGapNegative = gap_metres < 0;

  return (
    <div className="production-position-strip" style={{
      background: '#FFFFFF',
      border: '1px solid #E2E6EA',
      borderRadius: '8px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* ── Main Production Position Grid: Bullet Target Marker + Efficiency Gauge ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(420px, 2fr) minmax(220px, 1fr)',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* LEFT: TODAY'S PRODUCTION BULLET CHART */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Today's Production
              </span>
              {/* Configuration-driven status indicator (Icon + Label + Shape) */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: statusBadge.bg,
                color: statusBadge.color,
                border: `1px solid ${statusBadge.border}`,
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}>
                {statusBadge.icon}
                <span>{statusBadge.label}</span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Reference scale: 0 — {(maxScaleMetres / 1000).toFixed(0)}k m
            </div>
          </div>

          {/* Bullet Chart Visual Track */}
          <div style={{ position: 'relative', width: '100%', marginTop: '6px', marginBottom: '4px' }}>
            {/* Target Label & Triangle Marker Above Track */}
            <div style={{
              position: 'relative',
              height: '18px',
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#475569',
            }}>
              <div style={{
                position: 'absolute',
                left: `${targetPct}%`,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}>
                <span>TARGET ({target_metres.toLocaleString(undefined, { maximumFractionDigits: 0 })} m)</span>
                <span style={{ fontSize: '8px', lineHeight: 1, color: '#334155' }}>▼</span>
              </div>
            </div>

            {/* Background Track with Subtle Tolerance Envelope */}
            <div style={{
              height: '22px',
              background: '#F1F5F9',
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
            }}>
              {/* Actual Bar (Solid fill advancing towards target) */}
              <div
                style={{
                  width: `${actualPct}%`,
                  height: '100%',
                  background: isGapNegative ? '#1E40AF' : '#16A34A',
                  borderRadius: '3px 0 0 3px',
                  transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Target Marker (Crisp vertical reference line cutting through track) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${targetPct}%`,
                  width: '3px',
                  background: '#0F172A',
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                }}
                title={`Target Reference: ${target_metres.toLocaleString()} m`}
              />
            </div>

            {/* Actual Indicator Below Track */}
            <div style={{
              position: 'relative',
              height: '18px',
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#1E40AF',
              marginTop: '2px',
            }}>
              <div style={{
                position: 'absolute',
                left: `${actualPct}%`,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: '8px', lineHeight: 1 }}>▲</span>
                <span>ACTUAL ({actual_metres.toLocaleString(undefined, { maximumFractionDigits: 0 })} m)</span>
              </div>
            </div>
          </div>

          {/* Primary Metric Readings Row with Subtle Data Provenance */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            paddingTop: '6px',
            borderTop: '1px solid #F1F5F9',
          }}>
            <div>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Target</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                {target_metres.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>m</span>
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>Standard picks · Calculated</div>
            </div>

            <div>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Actual</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                {actual_metres.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>m</span>
              </div>
              <div style={{ fontSize: '10.5px', color: yesterday.delta_metres >= 0 ? '#16A34A' : '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                {yesterday.delta_metres >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                <span>{yesterday.delta_metres >= 0 ? '+' : ''}{yesterday.delta_metres.toLocaleString()} m vs yest. · Actual</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Variance / Gap</span>
                <button
                  onClick={onExplainGap}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2563EB',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  [Explain]
                </button>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: isGapNegative ? '#DC2626' : '#16A34A' }}>
                {isGapNegative ? '' : '+'}{gap_metres.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span style={{ fontSize: '12px', fontWeight: 500 }}>m</span>
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 600, color: isGapNegative ? '#DC2626' : '#16A34A' }}>
                {isGapNegative ? '' : '+'}{gap_pct.toFixed(1)}% vs target · Calculated
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: EFFICIENCY BULLET GAUGE */}
        <div style={{
          borderLeft: '1px solid #F1F5F9',
          paddingLeft: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Fleet Efficiency
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Target: {stdEffPct.toFixed(1)}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: efficiency_pct >= 90 ? '#16A34A' : (efficiency_pct >= 88 ? '#D97706' : '#DC2626') }}>
              {efficiency_pct.toFixed(1)}%
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Running: <strong style={{ color: '#0F172A' }}>{running_efficiency_pct.toFixed(1)}%</strong>
            </span>
          </div>

          {/* Efficiency mini bullet bar */}
          <div style={{ position: 'relative', width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <div
              style={{
                width: `${actualEffPct}%`,
                height: '100%',
                background: efficiency_pct >= 90 ? '#16A34A' : (efficiency_pct >= 88 ? '#D97706' : '#DC2626'),
                borderRadius: '4px',
              }}
            />
            {/* Target 90% vertical marker */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${stdEffPct}%`,
                width: '2px',
                background: '#0F172A',
              }}
              title="Target 90.0%"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
            <span>0%</span>
            <span>Target: 90%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* ── Compact Secondary Row: Supporting Metrics ── */}
      <div style={{
        background: '#F8FAFC',
        borderTop: '1px solid #F1F5F9',
        padding: '8px 12px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '11.5px',
        color: '#475569',
      }}>
        <div>
          Kilo-picks: <strong style={{ color: '#0F172A' }}>{supporting.kilo_picks.toLocaleString()}</strong>
        </div>
        <span style={{ color: '#CBD5E1' }}>•</span>
        <div>
          Warp Breaks: <strong style={{ color: '#0F172A' }}>{supporting.warp_breaks.toLocaleString()}</strong>
        </div>
        <span style={{ color: '#CBD5E1' }}>•</span>
        <div>
          Weft Breaks: <strong style={{ color: '#0F172A' }}>{supporting.weft_breaks.toLocaleString()}</strong>
        </div>
        <span style={{ color: '#CBD5E1' }}>•</span>
        <div>
          Break Rate: <strong style={{ color: '#0F172A' }}>{supporting.breaks_per_1000_picks.toFixed(2)}</strong> / 1k picks
        </div>
        <span style={{ color: '#CBD5E1' }}>•</span>
        <div>
          Running: <strong style={{ color: '#0F172A' }}>{(supporting.total_running_minutes / 60).toFixed(0)}h</strong>
        </div>
        <span style={{ color: '#CBD5E1' }}>•</span>
        <div>
          Stopped: <strong style={{ color: supporting.total_stopped_minutes > 15000 ? '#DC2626' : '#0F172A' }}>{(supporting.total_stopped_minutes / 60).toFixed(0)}h</strong>
        </div>
      </div>
    </div>
  );
};
