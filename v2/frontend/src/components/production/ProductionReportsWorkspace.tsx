import React, { useState } from 'react';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';

export const ProductionReportsWorkspace: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('DAILY');
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const reports = [
    {
      id: 'DAILY',
      title: 'Daily Production Brief',
      period: '31 Jul 2026',
      generated: '06:15 IST',
      summary: 'Daily output reached 49,748.8 m (-0.5% vs 50,018.7 m target standard). Asset efficiency closed at 89.3%. Shift 3 underperformed by 2.6 pp due to Bay 2 weft feeder stoppages. Potential recovery of 110.5 m (₹4,420) identified on AJ-132.',
      highlights: [
        'Total Target: 50,018.7 m | Actual: 49,748.8 m | Gap: -269.9 m',
        'Top Loss Loom: AJ-132 (328 min downtime, ₹1,893 exposure)',
        'Dominant Shortfall Root Cause: Downtime (61.5% share)',
        'Break Rate: 0.13 per 1k picks across 107.5M picks',
      ],
    },
    {
      id: 'SHIFT',
      title: 'Shift Handover Summary',
      period: 'Shifts 1, 2, 3 · 31 Jul 2026',
      generated: '06:00 IST',
      summary: 'Shift 1 delivered 16,920 m (93.1% eff), Shift 2 delivered 16,580 m (90.8% eff), Shift 3 logged 16,248 m (87.2% eff). Shift 3 pneumatic pressure dipped to 5.4 bar at 02:40, resulting in elevated weft stop alerts on 4 Airjets.',
      highlights: [
        'Shift 1: Exceeded benchmark (+3.1 pp)',
        'Shift 2: Met target (+0.8 pp)',
        'Shift 3: Off-target (-2.8 pp, 328 min downtime on AJ-132)',
        'Handover Action: Inspect Bay 2 pressure regulator before Shift 1 startup',
      ],
    },
    {
      id: 'WEEKLY',
      title: 'Weekly Production Review',
      period: 'Week 31 · 25 Jul – 31 Jul 2026',
      generated: '31 Jul 2026',
      summary: 'Weekly average output 49,630 m/day. Efficiency hovered between 88.5% and 90.3%. Chronic electrical trips identified on AJ-118 (9 days with >240 min downtime). Cumulative revenue gap estimated at ₹34,200.',
      highlights: [
        '7-Day Output Average: 49,630 m/day vs 50,018 m standard',
        'Chronic Bottleneck: Loom AJ-118 declared for preventative overhaul',
        'Top Performing Loom of Week: AJ-044 (96.2% mean efficiency)',
        'Total Weft Breaks logged: 72,410 across 192 looms',
      ],
    },
    {
      id: 'MONTHLY',
      title: 'Monthly Production Review',
      period: 'July 2026 Full Month',
      generated: '31 Jul 2026',
      summary: 'Monthly production aggregated to 1.54M metres. Overall plant efficiency 89.2%. Avoidable downtime attributed to ₹142,800 in financial revenue loss, concentrated across 12 volatile looms.',
      highlights: [
        'Month Total Output: 1,541,200 m',
        'Overall Asset Efficiency: 89.2%',
        'Avoidable Financial Loss: ₹142,800',
        'Consistent Performers: 138 of 192 looms maintained >90% eff',
      ],
    },
  ];

  const current = reports.find((r) => r.id === selectedReport) || reports[0];

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="production-reports-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Selector pills */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E6EA', paddingBottom: '8px' }}>
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedReport(r.id)}
            style={{
              background: selectedReport === r.id ? '#EFF6FF' : 'transparent',
              color: selectedReport === r.id ? '#2563EB' : '#64748B',
              border: '1px solid',
              borderColor: selectedReport === r.id ? '#BFDBFE' : 'transparent',
              borderRadius: '4px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={13} />
            <span>{r.title}</span>
          </button>
        ))}
      </div>

      {/* Report preview container */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E6EA',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '900px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
              {current.title}
            </h2>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Period: <strong>{current.period}</strong></span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={11} />
                Generated {current.generated}
              </span>
              <span>•</span>
              <span style={{ color: '#16A34A', fontWeight: 600 }}>Validated Ground-Truth</span>
            </div>
          </div>

          <button
            onClick={handleDownload}
            style={{
              background: downloaded ? '#ECFDF5' : '#2563EB',
              color: downloaded ? '#065F46' : '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {downloaded ? <CheckCircle size={13} /> : <Download size={13} />}
            <span>{downloaded ? 'Downloaded' : 'Download PDF / CSV'}</span>
          </button>
        </div>

        {/* Management Executive Brief */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
            Executive Management Brief
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#1E293B', lineHeight: '1.5' }}>
            {current.summary}
          </p>
        </div>

        {/* Structured Takeaways */}
        <div>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
            Key Verified Findings & Directives
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {current.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }} />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
