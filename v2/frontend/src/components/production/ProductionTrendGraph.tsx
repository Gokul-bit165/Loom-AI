import React, { useState } from 'react';
import { TrendingDown, TrendingUp, ArrowRight, Flag } from 'lucide-react';

export interface TrendPoint {
  date: string;
  actual: number;
  target: number;
  efficiency?: number;
  breaks?: number;
  downtime?: number;
  event?: string;
}

interface ProductionTrendGraphProps {
  points?: TrendPoint[];
  window: string;
  onSelectWindow: (window: string) => void;
  onExplainTrend: () => void;
  trendHeadline?: string;
  isDeclining?: boolean;
}

export const ProductionTrendGraph: React.FC<ProductionTrendGraphProps> = ({
  points,
  window,
  onSelectWindow,
  onExplainTrend,
  trendHeadline = '4 consecutive days below target',
  isDeclining: _isDeclining = true,
}) => {
  const [metric, setMetric] = useState<'OUTPUT' | 'EFFICIENCY' | 'BREAKS' | 'DOWNTIME'>('OUTPUT');

  // Realistic fallback factory telemetry points
  const defaultPoints: TrendPoint[] = [
    { date: '07-25', actual: 50200, target: 50018, efficiency: 90.3, breaks: 412, downtime: 132 },
    { date: '07-26', actual: 49910, target: 50018, efficiency: 89.8, breaks: 430, downtime: 145 },
    { date: '07-27', actual: 49650, target: 50018, efficiency: 89.2, breaks: 478, downtime: 180 },
    { date: '07-28', actual: 49480, target: 50018, efficiency: 88.9, breaks: 512, downtime: 210, event: 'Loom style change' },
    { date: '07-29', actual: 49320, target: 50018, efficiency: 88.5, breaks: 540, downtime: 245 },
    { date: '07-30', actual: 49510, target: 50018, efficiency: 88.9, breaks: 490, downtime: 195 },
    { date: '07-31', actual: 49748, target: 50018, efficiency: 89.3, breaks: 456, downtime: 168 },
  ];

  const data = points && points.length > 0 ? points : defaultPoints;

  // Selected metric accessor
  const getVal = (p: TrendPoint) => {
    if (metric === 'EFFICIENCY') return p.efficiency ?? 89.3;
    if (metric === 'BREAKS') return p.breaks ?? 450;
    if (metric === 'DOWNTIME') return p.downtime ?? 160;
    return p.actual;
  };

  const getTargetVal = (p: TrendPoint) => {
    if (metric === 'EFFICIENCY') return 90.0;
    if (metric === 'BREAKS') return 400;
    if (metric === 'DOWNTIME') return 120;
    return p.target;
  };

  const getUnit = () => {
    if (metric === 'EFFICIENCY') return '%';
    if (metric === 'BREAKS') return 'breaks';
    if (metric === 'DOWNTIME') return 'min';
    return 'm';
  };

  // Top Operational Summary Values
  const currentPt = data[data.length - 1];
  const currentVal = getVal(currentPt);
  const targetVal = getTargetVal(currentPt);
  const avgVal = data.reduce((acc, p) => acc + getVal(p), 0) / data.length;
  const isBelowTarget = metric === 'BREAKS' || metric === 'DOWNTIME' ? currentVal > targetVal : currentVal < targetVal;

  // SVG dimensions
  const width = 680;
  const height = 150;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 18;
  const padBottom = 28;

  const vals = data.map(getVal);
  const targetVals = data.map(getTargetVal);
  const minVal = Math.min(...vals, ...targetVals) * 0.985;
  const maxVal = Math.max(...vals, ...targetVals) * 1.015;

  const getX = (idx: number) => padLeft + (idx / Math.max(1, data.length - 1)) * (width - padLeft - padRight);
  const getY = (v: number) => height - padBottom - ((v - minVal) / Math.max(1, maxVal - minVal)) * (height - padTop - padBottom);

  // Performance Band (+/- 1% for output/eff, +/- 5% for breaks/dt)
  const bandTolerance = metric === 'OUTPUT' ? 0.008 : (metric === 'EFFICIENCY' ? 0.005 : 0.08);
  const bandTopPoints = data.map((p, i) => `${getX(i)},${getY(getTargetVal(p) * (1 + bandTolerance))}`);
  const bandBottomPoints = [...data].reverse().map((p, i) => `${getX(data.length - 1 - i)},${getY(getTargetVal(p) * (1 - bandTolerance))}`);
  const bandPolygon = `${bandTopPoints.join(' ')} ${bandBottomPoints.join(' ')}`;

  const actualPath = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(getVal(p))}`).join(' ');
  const targetPath = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(getTargetVal(p))}`).join(' ');

  return (
    <div className="production-trend-graph" style={{
      background: '#FFFFFF',
      border: '1px solid #E2E6EA',
      borderRadius: '8px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* ── Top Bar: Title, Metric Selector, Time Window ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '12.5px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Production Performance
          </h3>

          {/* Metric Selector (Only ONE dominant metric active at a time) */}
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '2px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
            <button
              onClick={() => setMetric('OUTPUT')}
              style={{
                background: metric === 'OUTPUT' ? '#FFFFFF' : 'transparent',
                color: metric === 'OUTPUT' ? '#0F172A' : '#64748B',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                boxShadow: metric === 'OUTPUT' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              Output (m)
            </button>
            <button
              onClick={() => setMetric('EFFICIENCY')}
              style={{
                background: metric === 'EFFICIENCY' ? '#FFFFFF' : 'transparent',
                color: metric === 'EFFICIENCY' ? '#0F172A' : '#64748B',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                boxShadow: metric === 'EFFICIENCY' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              Efficiency (%)
            </button>
            <button
              onClick={() => setMetric('BREAKS')}
              style={{
                background: metric === 'BREAKS' ? '#FFFFFF' : 'transparent',
                color: metric === 'BREAKS' ? '#0F172A' : '#64748B',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                boxShadow: metric === 'BREAKS' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              Breaks
            </button>
            <button
              onClick={() => setMetric('DOWNTIME')}
              style={{
                background: metric === 'DOWNTIME' ? '#FFFFFF' : 'transparent',
                color: metric === 'DOWNTIME' ? '#0F172A' : '#64748B',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                boxShadow: metric === 'DOWNTIME' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              Downtime (min)
            </button>
          </div>
        </div>

        {/* Window Selector */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '2px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
          {['7D', '30D', '90D', '12M', 'YTD'].map((w) => (
            <button
              key={w}
              onClick={() => onSelectWindow(w)}
              style={{
                background: window === w ? '#FFFFFF' : 'transparent',
                color: window === w ? '#0F172A' : '#64748B',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                boxShadow: window === w ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* ── Operational Summary Strip: Current | 7D Avg | Target | Direction ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        background: '#F8FAFC',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #F1F5F9',
        fontSize: '11.5px',
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Current</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            {currentVal.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>{getUnit()}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>7D Average</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            {avgVal.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>{getUnit()}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Target Standard</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            {targetVal.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>{getUnit()}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Direction</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: isBelowTarget ? '#DC2626' : '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            {isBelowTarget ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <span>{isBelowTarget ? 'Below target' : 'On/Above target'}</span>
          </div>
        </div>
      </div>

      {/* ── SVG Chart with Target Band & Operational Events ── */}
      <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '150px', display: 'block' }}>
          {/* Subtle grid lines */}
          <line x1={padLeft} y1={padTop} x2={width - padRight} y2={padTop} stroke="#F1F5F9" strokeWidth="1" />
          <line x1={padLeft} y1={(padTop + height - padBottom) / 2} x2={width - padRight} y2={(padTop + height - padBottom) / 2} stroke="#F1F5F9" strokeWidth="1" />
          <line x1={padLeft} y1={height - padBottom} x2={width - padRight} y2={height - padBottom} stroke="#E2E8F0" strokeWidth="1" />

          {/* Y-axis labels */}
          <text x={padLeft - 6} y={padTop + 4} textAnchor="end" fontSize="9" fill="#94A3B8">
            {maxVal >= 1000 ? `${(maxVal / 1000).toFixed(0)}k` : maxVal.toFixed(0)}
          </text>
          <text x={padLeft - 6} y={height - padBottom} textAnchor="end" fontSize="9" fill="#94A3B8">
            {minVal >= 1000 ? `${(minVal / 1000).toFixed(0)}k` : minVal.toFixed(0)}
          </text>

          {/* TARGET BAND (Acceptable Tolerance Zone) */}
          <polygon points={bandPolygon} fill="#F1F5F9" opacity="0.8" />

          {/* Target Reference Line */}
          <path d={targetPath} fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 3" />

          {/* Actual Trajectory Line */}
          <path d={actualPath} fill="none" stroke={isBelowTarget ? '#2563EB' : '#16A34A'} strokeWidth="2.2" strokeLinecap="round" />

          {/* Data Points & Operational Event Markers */}
          {data.map((p, i) => {
            const px = getX(i);
            const py = getY(getVal(p));
            const hasEvent = Boolean(p.event);

            return (
              <g key={i}>
                {/* Event Marker */}
                {hasEvent && (
                  <g>
                    <line x1={px} y1={py} x2={px} y2={padTop + 2} stroke="#D97706" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={px} cy={padTop + 4} r="3" fill="#D97706" />
                    <text x={px} y={padTop - 4} textAnchor="middle" fontSize="8" fontWeight="700" fill="#B45309">
                      {p.event}
                    </text>
                  </g>
                )}

                {/* Point circle */}
                <circle cx={px} cy={py} r={hasEvent ? '4' : '3'} fill={hasEvent ? '#D97706' : (isBelowTarget ? '#2563EB' : '#16A34A')} stroke="#FFFFFF" strokeWidth="1" />

                {/* Date Label */}
                <text x={px} y={height - 8} textAnchor="middle" fontSize="9" fill="#64748B">
                  {p.date.slice(-5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Legend & Contextual Trend Insight Finding Statement ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        borderTop: '1px solid #F1F5F9',
        paddingTop: '8px',
      }}>
        {/* Graph Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '2.5px', background: isBelowTarget ? '#2563EB' : '#16A34A', borderRadius: '1px' }} />
            <span>Actual</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '2px', borderTop: '2px dashed #64748B' }} />
            <span>Target</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '8px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '2px' }} />
            <span>Acceptable Target Band</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#B45309' }}>
            <Flag size={10} />
            <span>Operational Event</span>
          </div>
        </div>

        {/* ONE Automatically Calculated Statement + [Explain trend] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
            {trendHeadline}
          </span>
          <button
            onClick={onExplainTrend}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2563EB',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: 0,
            }}
          >
            <span>[Explain trend]</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};

