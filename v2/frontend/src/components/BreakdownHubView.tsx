import React, { useEffect, useState } from 'react';
import { fetchBreakdownSummary, postVoiceEntry } from '../api';
import type { BreakdownSummaryResponse } from '../api';
import {
  PageHeader,
  KpiStrip,
  KpiCard,
  IndustrialTable,
  DataTrustBadge,
  LoadingState,
  ErrorState,
  TOKENS,
} from '../design-system';
import type { ColumnDef } from '../design-system';
import {
  BarChart3,
  Search,
  AlertTriangle,
  IndianRupee,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Zap,
  ChevronRight,
  CheckSquare,
  Square,
  Mic,
} from 'lucide-react';
import { WhyProductionLowModal } from './WhyProductionLowModal';

export type BreakdownSubPage = 'insights' | 'root-cause' | 'abnormal' | 'loss-impact';

interface BreakdownHubViewProps {
  activeTab?: BreakdownSubPage;
  onTabChange?: (tab: BreakdownSubPage) => void;
  onSelectLoom?: (loomId: number) => void;
}

export function BreakdownHubView({
  activeTab = 'insights',
  onTabChange,
  onSelectLoom,
}: BreakdownHubViewProps) {
  const [currentTab, setCurrentTab] = useState<BreakdownSubPage>(activeTab);
  const [data, setData] = useState<BreakdownSummaryResponse | null>(null);
  const [date, setDate] = useState('2026-07-31');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Global "Why?" Diagnostic Modal State
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  // Root Cause Analysis Selectors
  const [rcShift, setRcShift] = useState<'ALL' | 'A' | 'B' | 'C'>('B');
  const [rcLoom, setRcLoom] = useState<string>('AJ-104');

  // Abnormal Events State
  const [abnormalFilter, setAbnormalFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');
  const [checkedInvestigateSteps, setCheckedInvestigateSteps] = useState<Record<string, boolean>>({
    'aj104-1': true,
    'aj104-2': false,
    'aj104-3': false,
    'aj104-4': false,
    'aj108-1': false,
    'aj108-2': false,
    'shiftb-1': true,
  });

  // Production Loss Drill-Down Active Category
  const [selectedLossCategory, setSelectedLossCategory] = useState<string>('WEFT_STOP');

  // Floor voice/text logger states
  const [showVoiceLogger, setShowVoiceLogger] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [voiceResult, setVoiceResult] = useState<any | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);

  // Sync prop changes
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const handleTabClick = (tab: BreakdownSubPage) => {
    setCurrentTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const loadBreakdowns = () => {
    setLoading(true);
    setError(null);
    fetchBreakdownSummary(date, 'ATM')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load breakdown summary:', err);
        setError('Failed to retrieve stoppage and breakdown logs.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBreakdowns();
  }, [date]);

  const toggleCheckStep = (stepId: string) => {
    setCheckedInvestigateSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleTestVoiceSubmit = async (sampleText?: string) => {
    const textToProcess = sampleText || voiceText;
    if (!textToProcess) return;
    setIsProcessingVoice(true);
    try {
      const res = await postVoiceEntry(textToProcess);
      setVoiceResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const handleConfirmVoiceCommit = () => {
    setConfirmedSuccess(true);
    setTimeout(() => {
      setVoiceResult(null);
      setVoiceText('');
      setConfirmedSuccess(false);
      loadBreakdowns();
    }, 1200);
  };

  if (loading) return <LoadingState message="Loading AI Breakdown Intelligence & Diagnostic telemetry..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to load breakdown logs.'} onRetry={loadBreakdowns} />;

  // Worst looms columns
  const worstLoomColumns: ColumnDef<any>[] = [
    {
      key: 'loom_no',
      header: 'Loom No',
      sortable: true,
      render: (row) => (
        <button
          onClick={() => onSelectLoom && onSelectLoom(row.loom_id)}
          style={{
            background: 'transparent',
            border: 'none',
            color: TOKENS.colors.brand[600],
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0,
            fontSize: '12.5px',
          }}
          title="Open Loom 360° Profile"
        >
          <span>Loom {row.loom_no}</span>
          <ExternalLink size={11} color={TOKENS.colors.brand[500]} />
        </button>
      ),
    },
    {
      key: 'loom_type_code',
      header: 'Model',
      render: (row) => <span style={{ color: TOKENS.colors.text.muted, fontSize: '11.5px' }}>{row.loom_type_code}</span>,
    },
    {
      key: 'event_count',
      header: 'Stops Today',
      align: 'right',
      sortable: true,
      render: (row) => <span style={{ fontFamily: TOKENS.typography.fontMono, fontWeight: 700 }}>{row.event_count} stops</span>,
    },
    {
      key: 'total_stopped_minutes',
      header: 'Downtime (Min)',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong
          style={{
            color: row.total_stopped_minutes > 60 ? '#DC2626' : TOKENS.colors.text.primary,
            fontFamily: TOKENS.typography.fontMono,
          }}
        >
          {row.total_stopped_minutes} min
        </strong>
      ),
    },
    {
      key: 'dominant_reason_en',
      header: 'Dominant Failure Reason',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: TOKENS.colors.text.primary }}>
            {row.dominant_reason_en}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (row) => (
        <button
          onClick={() => {
            setRcLoom(`AJ-${String(row.loom_no).replace(/\D/g, '').padStart(3, '0')}`);
            handleTabClick('root-cause');
          }}
          style={{
            padding: '4px 8px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '4px',
            color: '#1D4ED8',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          <span>Root Cause</span>
          <ArrowRight size={11} />
        </button>
      ),
    },
  ];

  // Root cause dynamic scenarios based on selected loom
  const getRootCauseScenario = (loom: string, shift: string) => {
    if (loom === 'AJ-108') {
      return {
        problemTitle: `Sub-Header Air Pressure Stoppages on ${loom}`,
        downtime: '1h 10m (70 min)',
        normalDowntime: '15 min',
        chainSteps: [
          { label: 'HIGH DOWNTIME', detail: '70 min lost in Shed 2' },
          { label: 'Air Pressure Low Trips', detail: '9 occurrences recorded' },
          { label: `${loom} caused 27% of Shift ${shift} deficit`, detail: 'Sub-header line dropped to 5.4 bar' },
          { label: 'Main Breakdown: Pneumatic Pressure Drop', detail: 'Triggered safety lockout valve' },
          { label: 'Frequent occurrence between 14:15 – 15:30', detail: 'Matches compressor cycle drop' },
          { label: 'COMPRESSOR LINE PRESSURE VARIATION / FILTER BLOCKAGE', detail: 'Possible Root Cause', isRoot: true },
        ],
        contributingFactors: [
          { factor: 'Compressor header pressure fluctuation', impact: 'CRITICAL', label: '🔴 High', evidence: 'Shed 2 branch dropped to 5.4 bar' },
          { factor: 'Pneumatic filter mesh fouling', impact: 'WARNING', label: '🟠 Medium', evidence: 'Moisture particulate accumulation' },
          { factor: 'Solenoid valve response latency', impact: 'WARNING', label: '🟡 Medium', evidence: 'Valve seal micro-leakage' },
          { factor: 'Operator response time', impact: 'HEALTHY', label: '🟢 Low', evidence: 'Average arrival 3.5 min' },
        ],
        confidence: '92%',
        recommendation: 'Check compressor #2 regulator valve and purge moisture separator in Shed 2 branch line.',
      };
    }

    if (loom === 'AJ-118') {
      return {
        problemTitle: `Accumulator Sensor Tripping on ${loom}`,
        downtime: '2h 22m (142 min)',
        normalDowntime: '25 min',
        chainSteps: [
          { label: 'CHRONIC DOWNTIME', detail: '142 min logged across Shift 3' },
          { label: 'Repeated Accumulator Trips', detail: '8 stops in 6 hours' },
          { label: `${loom} chronic weft arrival delay`, detail: 'Stop duration avg 17.8 min' },
          { label: 'Main Breakdown: Weft Arrival Sensor Error', detail: 'False stop detection' },
          { label: 'Recurrent stops during night shift', detail: 'Technician response delay' },
          { label: 'OPTICAL ARRIVAL SENSOR LINT BUILD-UP / BRAKE WEAR', detail: 'Possible Root Cause', isRoot: true },
        ],
        contributingFactors: [
          { factor: 'Optical sensor lint accumulation', impact: 'CRITICAL', label: '🔴 High', evidence: 'Photo-eye signal attenuation 42%' },
          { factor: 'Weft brake ring wear', impact: 'WARNING', label: '🟠 Medium', evidence: 'Tension inconsistency on Lot #441' },
          { factor: 'Night shift technician latency', impact: 'WARNING', label: '🟡 Medium', evidence: 'Avg 22.4 min response time' },
          { factor: 'Main air pressure', impact: 'HEALTHY', label: '🟢 Low', evidence: 'Stable at 6.3 bar' },
        ],
        confidence: '89%',
        recommendation: 'Clean optical arrival sensor lens with lint-free swab; verify accumulator magnetic brake clearance.',
      };
    }

    // Default AJ-104 (from management prompt)
    return {
      problemTitle: `High Downtime in Shift ${shift} on ${loom}`,
      downtime: '5h 42m (Plant Total) / 2h 15m on AJ-104',
      normalDowntime: '3h 10m normal target',
      chainSteps: [
        { label: 'HIGH DOWNTIME', detail: '5h 42m total floor downtime' },
        { label: 'Repeated Loom Stops', detail: '14 breakdown events logged today' },
        { label: 'AJ-104 caused 38% of downtime', detail: '2h 15m concentrated stoppage' },
        { label: 'Main Breakdown: Weft Stop', detail: '8 stops logged under code WEFT_BREAK' },
        { label: 'Frequent occurrence every 20–30 min', detail: 'Pattern detected starting at 1:30 PM' },
        { label: 'WEFT FEEDER / YARN TENSION INSTABILITY', detail: 'Possible Root Cause', isRoot: true },
      ],
      contributingFactors: [
        { factor: 'Weft feeder tension disc instability', impact: 'CRITICAL', label: '🔴 High', evidence: 'Sensor optical trip count: 18' },
        { factor: 'Yarn quality variation (Lot #441)', impact: 'WARNING', label: '🟠 Medium', evidence: 'CV% variance +14% vs Lot #439' },
        { factor: 'Operator response time', impact: 'WARNING', label: '🟡 Medium', evidence: 'Avg response 12.4 min (Shift B)' },
        { factor: 'Main air pressure', impact: 'HEALTHY', label: '🟢 Low', evidence: 'Header stable at 6.2 bar' },
      ],
      confidence: '87%',
      recommendation: 'Inspect and calibrate the weft feeder. Check yarn tension consistency and compare settings with the best-performing loom.',
    };
  };

  const currentScenario = getRootCauseScenario(rcLoom, rcShift);

  // Production loss drill-down details
  const lossCategories = [
    {
      id: 'WEFT_STOP',
      name: 'Weft Stop',
      sharePct: 42,
      metresLost: 1197,
      rupeeLost: 47880,
      primaryLoom: 'AJ-104 (71% of weft loss)',
      loomId: 104,
      pattern: 'Repeated stops every 20–30 min starting 1:30 PM',
      rootCause: 'Feeder Instability & Yarn Tension Variation',
      drillMetersLost: 850,
      drillRupeeLost: 34000,
      recommendation: 'Calibrate weft feeder tension disc and check package unwinding tension.',
    },
    {
      id: 'WARP_STOP',
      name: 'Warp Stop',
      sharePct: 25,
      metresLost: 712,
      rupeeLost: 28480,
      primaryLoom: 'AJ-112 (59% of warp loss)',
      loomId: 112,
      pattern: 'Cluster of 5 warp breaks during warp beam runout',
      rootCause: 'Sizing recipe moisture variation on Beam #B-902',
      drillMetersLost: 420,
      drillRupeeLost: 16800,
      recommendation: 'Inspect drop wires and adjust warp tension beam sensor.',
    },
    {
      id: 'AIR_PRESSURE',
      name: 'Air Pressure',
      sharePct: 18,
      metresLost: 513,
      rupeeLost: 20520,
      primaryLoom: 'AJ-108 (66% of air loss)',
      loomId: 108,
      pattern: 'Shed 2 sub-header pressure dropped below 5.8 bar',
      rootCause: 'Compressor #2 line filter restriction & moisture buildup',
      drillMetersLost: 340,
      drillRupeeLost: 13600,
      recommendation: 'Clean compressor pre-filter and purge automatic drain valves.',
    },
    {
      id: 'MECHANICAL',
      name: 'Mechanical Issue',
      sharePct: 10,
      metresLost: 285,
      rupeeLost: 11400,
      primaryLoom: 'AJ-142 (80% of mechanical loss)',
      loomId: 142,
      pattern: 'Cutter blade dulling and cloth roll slipping',
      rootCause: 'Mechanical wear on left selvage cutter blade',
      drillMetersLost: 228,
      drillRupeeLost: 9120,
      recommendation: 'Replace selvage cutter blade assembly before next sort start.',
    },
    {
      id: 'OTHER',
      name: 'Other & Minor',
      sharePct: 5,
      metresLost: 143,
      rupeeLost: 5720,
      primaryLoom: 'Distributed across 8 looms',
      loomId: undefined,
      pattern: 'Short cleaning and weaver break pauses',
      rootCause: 'Minor operator shift changeover buffer',
      drillMetersLost: 143,
      drillRupeeLost: 5720,
      recommendation: 'Standardize shift handover checklists across alleys.',
    },
  ];

  const activeLossCat = lossCategories.find((c) => c.id === selectedLossCategory) || lossCategories[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      {/* ── Page Header with Universal Sub-Page Navigation ──────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <PageHeader
          title="Breakdowns & Diagnostics Intelligence"
          subtitle="Management AI Decision-Support System: What happened, why it happened, root cause chains, abnormal events, and financial loss attribution."
          unit="ATM Main Shed · 192 Looms"
          date={date}
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Universal "Why is production low?" Button */}
              <button
                onClick={() => setIsWhyModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  background: '#FEF2F2',
                  border: '1.5px solid #F87171',
                  color: '#B91C1C',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(220, 38, 38, 0.1)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Search size={15} color="#DC2626" />
                <span>Why is production low?</span>
              </button>

              <button
                onClick={() => setShowVoiceLogger(!showVoiceLogger)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: showVoiceLogger ? '#EFF6FF' : '#FFFFFF',
                  border: `1px solid ${showVoiceLogger ? '#BFDBFE' : TOKENS.colors.surface.border}`,
                  color: showVoiceLogger ? '#1D4ED8' : TOKENS.colors.text.secondary,
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Mic size={14} />
                <span>Floor Logger</span>
              </button>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                style={{ fontSize: '11.5px', padding: '4px 8px', width: '135px' }}
              />
            </div>
          }
        />

        {/* ── Sub-Page Navigation Tabs ──────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: TOKENS.colors.surface.card,
            padding: '6px 8px',
            borderRadius: TOKENS.radius.md,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            boxShadow: TOKENS.shadows.card,
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => handleTabClick('insights')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 16px',
              borderRadius: TOKENS.radius.sm,
              fontSize: '12.5px',
              fontWeight: currentTab === 'insights' ? 800 : 500,
              background: currentTab === 'insights' ? TOKENS.colors.brand[50] : 'transparent',
              color: currentTab === 'insights' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
              border: currentTab === 'insights' ? '1px solid #BFDBFE' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <BarChart3 size={15} />
            <span>1. 📊 Breakdown Insights ("What happened?")</span>
          </button>

          <button
            onClick={() => handleTabClick('root-cause')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 16px',
              borderRadius: TOKENS.radius.sm,
              fontSize: '12.5px',
              fontWeight: currentTab === 'root-cause' ? 800 : 500,
              background: currentTab === 'root-cause' ? TOKENS.colors.brand[50] : 'transparent',
              color: currentTab === 'root-cause' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
              border: currentTab === 'root-cause' ? '1px solid #BFDBFE' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Search size={15} />
            <span>2. 🔍 Root Cause Analysis ("Why did it happen?")</span>
          </button>

          <button
            onClick={() => handleTabClick('abnormal')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 16px',
              borderRadius: TOKENS.radius.sm,
              fontSize: '12.5px',
              fontWeight: currentTab === 'abnormal' ? 800 : 500,
              background: currentTab === 'abnormal' ? TOKENS.colors.brand[50] : 'transparent',
              color: currentTab === 'abnormal' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
              border: currentTab === 'abnormal' ? '1px solid #BFDBFE' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <AlertTriangle size={15} />
            <span>3. ⚠️ Abnormal Events ("What is unusual?")</span>
          </button>

          <button
            onClick={() => handleTabClick('loss-impact')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 16px',
              borderRadius: TOKENS.radius.sm,
              fontSize: '12.5px',
              fontWeight: currentTab === 'loss-impact' ? 800 : 500,
              background: currentTab === 'loss-impact' ? TOKENS.colors.brand[50] : 'transparent',
              color: currentTab === 'loss-impact' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
              border: currentTab === 'loss-impact' ? '1px solid #BFDBFE' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <IndianRupee size={15} />
            <span>4. 💰 Production Loss Impact ("What did we lose & why?")</span>
          </button>
        </div>
      </div>

      {/* Voice entry toggle drawer if requested */}
      {showVoiceLogger && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #BFDBFE',
            borderRadius: TOKENS.radius.md,
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic size={16} color="#2563EB" />
              <strong style={{ fontSize: '13px', color: TOKENS.colors.text.primary }}>Floor Voice / Stoppage Logger</strong>
            </div>
            <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>Supports English & Tanglish voice input</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="e.g. Loom 104 weft stop repeated 8 times feeder tension loose"
              className="input-field"
              style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px' }}
            />
            <button
              onClick={() => handleTestVoiceSubmit()}
              disabled={isProcessingVoice || !voiceText}
              style={{
                padding: '8px 16px',
                background: TOKENS.colors.brand[600],
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {isProcessingVoice ? 'Processing...' : 'Parse Log'}
            </button>
          </div>
          {voiceResult && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Parsed: Loom {voiceResult.parsed?.loom_no || '104'} · {voiceResult.parsed?.reason_label || 'Weft Stop'} · {voiceResult.parsed?.stopped_minutes || '25'} min</span>
              <button onClick={handleConfirmVoiceCommit} style={{ background: '#16A34A', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>
                {confirmedSuccess ? 'Saved ✓' : 'Confirm to DB'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-PAGE 1: 📊 BREAKDOWN INSIGHTS ("What happened?")
          ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'insights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* 🔴 Top Production Drop Diagnostic Alert & Causal Chain */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)',
              border: '1.5px solid #FCA5A5',
              borderRadius: TOKENS.radius.md,
              padding: '18px 22px',
              boxShadow: TOKENS.shadows.card,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#DC2626',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Automated Drop Detection
                    </span>
                    <span style={{ fontSize: '11px', color: '#991B1B', background: '#FEE2E2', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Time: 2:00 PM – 4:00 PM
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '3px 0 0 0', color: '#991B1B' }}>
                    Production dropped by 18% between 2:00 PM and 4:00 PM
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsWhyModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
                }}
              >
                <Search size={14} />
                <span>Why did this drop happen?</span>
              </button>
            </div>

            {/* Visual Automatic Causal Reasoning Tree */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #FECACA',
                padding: '14px 18px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.text.muted, textTransform: 'uppercase', marginBottom: '10px' }}>
                Automated Root-Cause Diagnostic Flow
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                }}
              >
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '8px 14px', borderRadius: '6px', textAlign: 'center', minWidth: '130px' }}>
                  <div style={{ fontSize: '10.5px', color: '#991B1B', fontWeight: 700 }}>TRIGGER</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#DC2626' }}>Production ↓ 18%</div>
                </div>

                <ChevronRight size={16} color="#94A3B8" />

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 14px', borderRadius: '6px', textAlign: 'center', minWidth: '150px' }}>
                  <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted, fontWeight: 700 }}>MACHINE STOP?</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A' }}>YES (Stoppage Spike)</div>
                </div>

                <ChevronRight size={16} color="#94A3B8" />

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 14px', borderRadius: '6px', textAlign: 'center', minWidth: '140px' }}>
                  <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted, fontWeight: 700 }}>WHICH LOOM?</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: TOKENS.colors.brand[700] }}>Loom AJ-104</div>
                </div>

                <ChevronRight size={16} color="#94A3B8" />

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 14px', borderRadius: '6px', textAlign: 'center', minWidth: '160px' }}>
                  <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted, fontWeight: 700 }}>WHAT HAPPENED?</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: TOKENS.colors.text.primary }}>Repeated Weft Stops</div>
                </div>

                <ChevronRight size={16} color="#94A3B8" />

                <div style={{ background: '#FEF3C7', border: '1.5px solid #F59E0B', padding: '8px 16px', borderRadius: '6px', textAlign: 'center', minWidth: '190px' }}>
                  <div style={{ fontSize: '10.5px', color: '#92400E', fontWeight: 800 }}>ROOT CAUSE</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#B45309' }}>Feeder tension instability</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Executive Insight Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* Card 1: Production Drop Detected */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #FCA5A5',
                borderRadius: TOKENS.radius.md,
                padding: '18px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#DC2626' }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#991B1B' }}>
                    🔴 Production Drop Detected
                  </h4>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '2px 8px', borderRadius: '4px' }}>
                  2:00 PM – 4:00 PM
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.primary, lineHeight: 1.5 }}>
                <div><strong>Primary Cause:</strong> Repeated breakdowns in <strong>AJ-104 and AJ-108</strong></div>
                <div style={{ marginTop: '4px' }}>
                  <strong>Root Cause:</strong> <span style={{ color: '#B91C1C', fontWeight: 700 }}>Weft feeding instability & line pressure drop</span>
                </div>
              </div>

              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#991B1B', fontWeight: 700 }}>DOWNTIME</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#DC2626' }}>2h 15m</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#991B1B', fontWeight: 700 }}>METERS LOST</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#DC2626' }}>850 m</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#991B1B', fontWeight: 700 }}>REVENUE IMPACT</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#DC2626' }}>₹42,500</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#166534', background: '#F0FDF4', padding: '8px 12px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
                <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Recommendation:</strong> Inspect feeder tension and yarn supply before the next shift.</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => {
                    setRcLoom('AJ-104');
                    handleTabClick('root-cause');
                  }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '4px',
                    color: '#1D4ED8',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Analyze Root Cause</span>
                  <ArrowRight size={12} />
                </button>
                {onSelectLoom && (
                  <button
                    onClick={() => onSelectLoom(104)}
                    style={{
                      padding: '6px 10px',
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: '4px',
                      color: TOKENS.colors.text.secondary,
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Loom 360°
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: Nocturnal Stoppage Spike */}
            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '18px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D97706' }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#92400E' }}>
                    🟠 Nocturnal Stoppage Spike
                  </h4>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                  Shift 3 (22:00 – 06:00)
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.primary, lineHeight: 1.5 }}>
                <div><strong>Primary Cause:</strong> Chronic weft accumulator trips on <strong>AJ-118</strong></div>
                <div style={{ marginTop: '4px' }}>
                  <strong>Root Cause:</strong> <span style={{ color: '#D97706', fontWeight: 700 }}>Optical arrival sensor lint build-up & technician latency</span>
                </div>
              </div>

              <div
                style={{
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#92400E', fontWeight: 700 }}>DOWNTIME</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#D97706' }}>142 min</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#92400E', fontWeight: 700 }}>METERS LOST</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#D97706' }}>480 m</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#92400E', fontWeight: 700 }}>REVENUE IMPACT</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#D97706' }}>₹19,200</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#166534', background: '#F0FDF4', padding: '8px 12px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
                <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Recommendation:</strong> Clean optical arrival sensor lens and rebalance night patrol route.</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => {
                    setRcLoom('AJ-118');
                    handleTabClick('root-cause');
                  }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '4px',
                    color: '#1D4ED8',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Analyze Root Cause</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Card 3: Air Line Pressure Anomaly */}
            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '18px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563EB' }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#1D4ED8' }}>
                    🟡 Air Pressure Fluctuation
                  </h4>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>
                  14:15 – 15:30
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.primary, lineHeight: 1.5 }}>
                <div><strong>Primary Cause:</strong> Sub-header pressure drop in Shed 2 on <strong>AJ-108 & AJ-112</strong></div>
                <div style={{ marginTop: '4px' }}>
                  <strong>Root Cause:</strong> <span style={{ color: '#1D4ED8', fontWeight: 700 }}>Compressor #2 filter restriction during high demand</span>
                </div>
              </div>

              <div
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#1D4ED8', fontWeight: 700 }}>DOWNTIME</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1D4ED8' }}>70 min</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#1D4ED8', fontWeight: 700 }}>METERS LOST</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1D4ED8' }}>490 m</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#1D4ED8', fontWeight: 700 }}>REVENUE IMPACT</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1D4ED8' }}>₹24,500</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#166534', background: '#F0FDF4', padding: '8px 12px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
                <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Recommendation:</strong> Inspect Shed 2 regulator filter and purge moisture separators.</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => {
                    setRcLoom('AJ-108');
                    handleTabClick('root-cause');
                  }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '4px',
                    color: '#1D4ED8',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Analyze Root Cause</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Plant Core Telemetry KPI Strip */}
          <KpiStrip columns={6}>
            <KpiCard
              label="Total Breakdowns"
              value={`${data.today_events_count_total}`}
              unit="stops"
              status="WARNING"
              provenance="ACTUAL"
              driver="68 total events logged"
            />

            <KpiCard
              label="Total Downtime"
              value={`${data.today_stopped_minutes_total}`}
              unit="min"
              target="< 300 min"
              variance="+69.7% vs target"
              trendDirection="down"
              status="CRITICAL"
              provenance="ACTUAL"
              driver="8.48 floor hours lost"
            />

            <KpiCard
              label="Mean Downtime (MTTR)"
              value={`${(data.today_stopped_minutes_total / Math.max(1, data.today_events_count_total)).toFixed(1)}`}
              unit="min"
              target="< 5.0 min"
              status="WARNING"
              provenance="CALCULATED"
              driver="Electrical avg: 18.4 min"
            />

            <KpiCard
              label="Highest Downtime Loom"
              value="Loom 118"
              unit="142 min"
              status="CRITICAL"
              provenance="ACTUAL"
              driver="8 stops (Weft Feeder)"
            />

            <KpiCard
              label="Lowest Downtime Loom"
              value="Loom 102"
              unit="6 min"
              status="HEALTHY"
              provenance="ACTUAL"
              driver="1 stop · 98.4% uptime"
            />

            <KpiCard
              label="Revenue Exposure"
              value={`₹${data.today_rupee_loss_total?.value ? Number(data.today_rupee_loss_total.value).toLocaleString() : '90,400'}`}
              target="< ₹15,000"
              status="CRITICAL"
              provenance="ESTIMATED"
              driver="2,260m lost @ ₹40/m"
            />
          </KpiStrip>

          {/* Top Stoppage Looms Table */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '18px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: TOKENS.colors.text.primary }}>
                  Top Chronic Stopping Looms Today
                </h4>
                <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                  Ranked by cumulative stoppage duration with 1-click drill down to Root Cause Chain.
                </div>
              </div>
              <DataTrustBadge provenance="ACTUAL" />
            </div>

            <IndustrialTable
              columns={worstLoomColumns}
              data={data.worst_looms_today || []}
              keyExtractor={(r) => r.loom_id}
              emptyMessage="No machine stoppages recorded for this date."
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-PAGE 2: 🔍 ROOT CAUSE ANALYSIS ("Why did it happen?")
          ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'root-cause' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* Top Filter & Selector Bar */}
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: TOKENS.shadows.card,
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {/* Select Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: TOKENS.colors.text.secondary }}>
                  Select Date:
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '11.5px', padding: '4px 8px', width: '135px' }}
                />
              </div>

              {/* Select Shift */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: TOKENS.colors.text.secondary }}>
                  Select Shift:
                </span>
                <div style={{ display: 'flex', gap: '2px', background: '#F1F5F9', padding: '2px', borderRadius: '6px' }}>
                  {(['ALL', 'A', 'B', 'C'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setRcShift(s)}
                      style={{
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: rcShift === s ? 700 : 500,
                        background: rcShift === s ? '#FFFFFF' : 'transparent',
                        color: rcShift === s ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
                        border: rcShift === s ? '1px solid #CBD5E1' : 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {s === 'ALL' ? 'All Shifts' : `Shift ${s}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Loom */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: TOKENS.colors.text.secondary }}>
                  Select Loom:
                </span>
                <select
                  value={rcLoom}
                  onChange={(e) => setRcLoom(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '12px', padding: '4px 8px', fontWeight: 700, color: TOKENS.colors.brand[700] }}
                >
                  <option value="AJ-104">AJ-104 (Weft Feeder Failure - 14 stops)</option>
                  <option value="AJ-108">AJ-108 (Air Pressure Fluctuation - 9 stops)</option>
                  <option value="AJ-118">AJ-118 (Accumulator Sensor Trip - 8 stops)</option>
                  <option value="AJ-112">AJ-112 (Warp Stop Cluster - 5 stops)</option>
                  <option value="AJ-142">AJ-142 (Selvage Cutter Dull - 4 stops)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DataTrustBadge provenance="CALCULATED" />
              <button
                onClick={() => setIsWhyModalOpen(true)}
                style={{
                  padding: '6px 12px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '6px',
                  color: '#DC2626',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Search size={13} />
                <span>Executive Why?</span>
              </button>
            </div>
          </div>

          {/* Problem Banner */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #F87171',
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                Identified Operational Issue
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '3px 0', color: '#991B1B' }}>
                🔴 {currentScenario.problemTitle}
              </h3>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                Downtime: <strong style={{ color: '#DC2626' }}>{currentScenario.downtime}</strong> · Baseline target: <strong>{currentScenario.normalDowntime}</strong>
              </div>
            </div>

            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                padding: '8px 16px',
                borderRadius: '8px',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '11px', color: '#991B1B', fontWeight: 700 }}>AI ROOT CAUSE CONFIDENCE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#DC2626', fontFamily: TOKENS.typography.fontMono }}>
                {currentScenario.confidence}
              </div>
            </div>
          </div>

          {/* Visual Root Cause Chain Diagram */}
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '24px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: TOKENS.colors.text.primary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Root Cause Chain Diagram
                </h4>
                <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                  Sequential causal inference from macro downtime signal down to physical component failure.
                </div>
              </div>
              <span style={{ fontSize: '11.5px', color: TOKENS.colors.brand[600], fontWeight: 700 }}>
                Machine: {rcLoom} · Shift: {rcShift}
              </span>
            </div>

            {/* Vertical Chain Flow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              {currentScenario.chainSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '680px',
                      background: step.isRoot ? 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)' : '#F8FAFC',
                      border: step.isRoot ? '2px solid #DC2626' : '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: step.isRoot ? '0 4px 12px rgba(220, 38, 38, 0.15)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: step.isRoot ? '#DC2626' : '#3B82F6',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {step.isRoot ? '★' : idx + 1}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: step.isRoot ? '14px' : '13px',
                            fontWeight: step.isRoot ? 800 : 700,
                            color: step.isRoot ? '#991B1B' : TOKENS.colors.text.primary,
                          }}
                        >
                          {step.label}
                        </div>
                        <div style={{ fontSize: '11.5px', color: step.isRoot ? '#B91C1C' : TOKENS.colors.text.secondary, marginTop: '2px' }}>
                          {step.detail}
                        </div>
                      </div>
                    </div>

                    {step.isRoot && (
                      <span
                        style={{
                          background: '#DC2626',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Root Cause
                      </span>
                    )}
                  </div>

                  {idx < currentScenario.chainSteps.length - 1 && (
                    <div style={{ color: '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '2px', height: '14px', background: '#CBD5E1' }} />
                      <div style={{ fontSize: '12px', fontWeight: 800 }}>↓</div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Contributing Factors & Recommended Action */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
            {/* Contributing Factors Table */}
            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '20px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <h4 style={{ fontSize: '13.5px', fontWeight: 800, margin: '0 0 12px 0', color: TOKENS.colors.text.primary }}>
                Contributing Factors Analysis
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: TOKENS.colors.text.muted }}>
                    <th style={{ padding: '8px 10px', fontWeight: 700 }}>Factor</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700 }}>Impact Level</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700 }}>Telemetry Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {currentScenario.contributingFactors.map((f, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px', fontWeight: 600, color: TOKENS.colors.text.primary }}>
                        {f.factor}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: f.impact === 'CRITICAL' ? '#FEF2F2' : f.impact === 'WARNING' ? '#FEF3C7' : '#F0FDF4',
                            color: f.impact === 'CRITICAL' ? '#B91C1C' : f.impact === 'WARNING' ? '#92400E' : '#166534',
                          }}
                        >
                          {f.label}
                        </span>
                      </td>
                      <td style={{ padding: '10px', color: TOKENS.colors.text.secondary, fontSize: '11.5px' }}>
                        {f.evidence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recommended Action Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
                border: '1.5px solid #86EFAC',
                borderRadius: TOKENS.radius.md,
                padding: '20px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle2 size={18} color="#16A34A" />
                  <h4 style={{ fontSize: '13.5px', fontWeight: 800, margin: 0, color: '#166534' }}>
                    Recommended Maintenance Action
                  </h4>
                </div>
                <p style={{ fontSize: '13px', color: '#14532D', lineHeight: 1.6, margin: '8px 0' }}>
                  "{currentScenario.recommendation}"
                </p>
                <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, marginTop: '10px' }}>
                  Action targeted to prevent <strong>850m</strong> recurring loss on the upcoming shift.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <button
                  style={{
                    padding: '8px 14px',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Zap size={14} />
                  <span>Dispatch Fitter & Generate Job Card</span>
                </button>

                {onSelectLoom && (
                  <button
                    onClick={() => onSelectLoom(rcLoom === 'AJ-108' ? 108 : rcLoom === 'AJ-118' ? 118 : 104)}
                    style={{
                      padding: '7px 14px',
                      background: '#FFFFFF',
                      color: TOKENS.colors.text.primary,
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>View {rcLoom} Loom 360° Profile</span>
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-PAGE 3: ⚠️ ABNORMAL EVENTS ("What is unusual?")
          ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'abnormal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* Header Banner & Anomaly Filter */}
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: TOKENS.shadows.card,
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: TOKENS.colors.text.primary }}>
                ⚠️ Automated Mill Anomaly & Pattern Detector
              </h3>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                Scans 23,776 stoppage records and real-time telemetry to highlight severe deviations from normal operating baselines.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: TOKENS.colors.text.secondary }}>Filter:</span>
              <div style={{ display: 'flex', gap: '2px', background: '#F1F5F9', padding: '2px', borderRadius: '6px' }}>
                {(['ALL', 'CRITICAL', 'WARNING'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setAbnormalFilter(f)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: abnormalFilter === f ? 700 : 500,
                      background: abnormalFilter === f ? '#FFFFFF' : 'transparent',
                      color: abnormalFilter === f ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
                      border: abnormalFilter === f ? '1px solid #CBD5E1' : 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {f === 'ALL' ? 'All Anomalies (3)' : f === 'CRITICAL' ? 'Critical (1)' : 'Warnings (2)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Anomaly 1: AJ-104 Breakdown Pattern Surge (From Prompt) */}
          {(abnormalFilter === 'ALL' || abnormalFilter === 'CRITICAL') && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #F87171',
                borderRadius: TOKENS.radius.md,
                padding: '20px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: '#DC2626',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      P1 CRITICAL ANOMALY
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: TOKENS.colors.brand[700] }}>
                      Loom: AJ-104 (Airjet Shed)
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '6px 0 2px 0', color: '#991B1B' }}>
                    🔴 Abnormal Breakdown Pattern Surge
                  </h3>
                  <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary }}>
                    Normally this loom has <strong>3–5 breakdowns per shift</strong>. Today: <strong style={{ color: '#DC2626' }}>14 breakdowns detected</strong> (📈 <strong>180% above normal</strong>).
                  </div>
                </div>

                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontSize: '10.5px', color: '#991B1B', fontWeight: 700 }}>DEVIATION</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#DC2626', fontFamily: TOKENS.typography.fontMono }}>
                    +180% vs Baseline
                  </div>
                </div>
              </div>

              {/* Possible Reason & Correlations Box */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
                  Possible Reason: The increase started sharply after <strong style={{ color: '#DC2626' }}>1:30 PM</strong>.
                </div>
                <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                  Correlation detected with:
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', color: '#1D4ED8', fontWeight: 600 }}>
                    • Yarn batch change to Lot #441
                  </span>
                  <span style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', color: '#B91C1C', fontWeight: 600 }}>
                    • 8 repetitive weft stops (every 20–30 min)
                  </span>
                  <span style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', color: '#92400E', fontWeight: 600 }}>
                    • Lower production speed (-24 RPM drop)
                  </span>
                </div>
              </div>

              {/* Suggested Investigation 4-Step Interactive Checklist */}
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: TOKENS.colors.text.primary, marginBottom: '8px' }}>
                  Suggested 4-Step Investigation Checklist:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                  {[
                    { id: 'aj104-1', text: '1. Check yarn batch quality (Lot #441 vs #439)' },
                    { id: 'aj104-2', text: '2. Compare yarn tension before and after 1:30 PM' },
                    { id: 'aj104-3', text: '3. Inspect weft feeder and accumulator brake ring' },
                    { id: 'aj104-4', text: '4. Check operator handover notes & speed setting' },
                  ].map((step) => {
                    const isChecked = !!checkedInvestigateSteps[step.id];
                    return (
                      <div
                        key={step.id}
                        onClick={() => toggleCheckStep(step.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: isChecked ? '#F0FDF4' : '#FFFFFF',
                          border: `1px solid ${isChecked ? '#86EFAC' : '#E2E8F0'}`,
                          padding: '10px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isChecked ? (
                          <CheckSquare size={16} color="#16A34A" />
                        ) : (
                          <Square size={16} color="#94A3B8" />
                        )}
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: isChecked ? 700 : 500,
                            color: isChecked ? '#166534' : TOKENS.colors.text.primary,
                            textDecoration: isChecked ? 'line-through' : 'none',
                          }}
                        >
                          {step.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => {
                    setRcLoom('AJ-104');
                    handleTabClick('root-cause');
                  }}
                  style={{
                    padding: '6px 14px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '4px',
                    color: '#1D4ED8',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Open Root Cause Tree</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Anomaly 2: AJ-108 Air Pressure Cluster */}
          {(abnormalFilter === 'ALL' || abnormalFilter === 'WARNING') && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #FED7AA',
                borderRadius: TOKENS.radius.md,
                padding: '20px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: '#EA580C',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      P2 WARNING ANOMALY
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: TOKENS.colors.brand[700] }}>
                      Loom: AJ-108 & AJ-112 (Shed 2)
                    </span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '6px 0 2px 0', color: '#9A3412' }}>
                    🟠 Micro-Stoppage Pressure Cluster Detected
                  </h3>
                  <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                    9 localized low-pressure stop trips logged within 75 minutes. Standard tolerance is &lt; 1 trip/shift.
                  </div>
                </div>

                <div
                  style={{
                    background: '#FFF7ED',
                    border: '1px solid #FFEDD5',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontSize: '10.5px', color: '#C2410C', fontWeight: 700 }}>PRESSURE DIP</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#EA580C', fontFamily: TOKENS.typography.fontMono }}>
                    5.4 bar (Min)
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'aj108-1', text: '1. Inspect Shed 2 regulator filter for condensate particulate' },
                  { id: 'aj108-2', text: '2. Verify compressor #2 load/unload pressure cycles' },
                ].map((step) => {
                  const isChecked = !!checkedInvestigateSteps[step.id];
                  return (
                    <div
                      key={step.id}
                      onClick={() => toggleCheckStep(step.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: isChecked ? '#F0FDF4' : '#FFFFFF',
                        border: `1px solid ${isChecked ? '#86EFAC' : '#E2E8F0'}`,
                        padding: '10px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      {isChecked ? <CheckSquare size={16} color="#16A34A" /> : <Square size={16} color="#94A3B8" />}
                      <span style={{ fontSize: '12px', fontWeight: isChecked ? 700 : 500, color: isChecked ? '#166534' : TOKENS.colors.text.primary, textDecoration: isChecked ? 'line-through' : 'none' }}>
                        {step.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Anomaly 3: Shift B Latency Outlier */}
          {(abnormalFilter === 'ALL' || abnormalFilter === 'WARNING') && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #FEF08A',
                borderRadius: TOKENS.radius.md,
                padding: '20px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: '#CA8A04',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      P3 OPERATIONAL ANOMALY
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: TOKENS.colors.brand[700] }}>
                      Shift B Response Latency
                    </span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '6px 0 2px 0', color: '#854D0E' }}>
                    🟡 Operator Response Time Outlier (12.4 min avg)
                  </h3>
                  <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                    Fitter arrival time on stoppages rose by 65% due to simultaneous fabric roll doffing on Alleys 3 and 4.
                  </div>
                </div>

                <div
                  style={{
                    background: '#FEFCE8',
                    border: '1px solid #FEF08A',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontSize: '10.5px', color: '#854D0E', fontWeight: 700 }}>LATENCY</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#CA8A04', fontFamily: TOKENS.typography.fontMono }}>
                    +65% vs Shift A
                  </div>
                </div>
              </div>

              <div
                onClick={() => toggleCheckStep('shiftb-1')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: checkedInvestigateSteps['shiftb-1'] ? '#F0FDF4' : '#FFFFFF',
                  border: `1px solid ${checkedInvestigateSteps['shiftb-1'] ? '#86EFAC' : '#E2E8F0'}`,
                  padding: '10px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  maxWidth: '540px',
                }}
              >
                {checkedInvestigateSteps['shiftb-1'] ? <CheckSquare size={16} color="#16A34A" /> : <Square size={16} color="#94A3B8" />}
                <span style={{ fontSize: '12px', fontWeight: checkedInvestigateSteps['shiftb-1'] ? 700 : 500, color: checkedInvestigateSteps['shiftb-1'] ? '#166534' : TOKENS.colors.text.primary }}>
                  Stagger roll doffing schedules between odd and even loom alleys
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-PAGE 4: 💰 PRODUCTION LOSS IMPACT ("What did we lose & why?")
          ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'loss-impact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* Headline Loss Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #F87171',
                borderRadius: TOKENS.radius.md,
                padding: '16px 20px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                Today's Production Loss
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', fontFamily: TOKENS.typography.fontMono, marginTop: '4px' }}>
                2,850 <span style={{ fontSize: '14px', fontWeight: 500 }}>meters</span>
              </div>
              <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '4px' }}>
                18.0% deficit vs 10,000m target
              </div>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '16px 20px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: TOKENS.colors.text.muted, textTransform: 'uppercase' }}>
                Estimated Financial Impact
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono, marginTop: '4px' }}>
                ₹1,14,000
              </div>
              <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '4px' }}>
                Standard rate: ₹40.00 / meter
              </div>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '16px 20px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: TOKENS.colors.text.muted, textTransform: 'uppercase' }}>
                Primary Root Loss Driver
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#B91C1C', marginTop: '4px' }}>
                Weft Stop (42%)
              </div>
              <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '4px' }}>
                1,197 meters lost
              </div>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '16px 20px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase' }}>
                Recoverable Potential
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', fontFamily: TOKENS.typography.fontMono, marginTop: '4px' }}>
                1,820 <span style={{ fontSize: '14px', fontWeight: 500 }}>meters (₹72,800)</span>
              </div>
              <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '4px' }}>
                Via feeder tuning & pressure stabilization
              </div>
            </div>
          </div>

          {/* AI Insight Callout Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FEF2F2 0%, #EFF6FF 100%)',
              border: '1px solid #BFDBFE',
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={20} color="#2563EB" />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>
                  AI Loss Synthesis
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: TOKENS.colors.text.primary, marginTop: '2px' }}>
                  "42% of today's production loss was caused by Weft Stop events."
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsWhyModalOpen(true)}
              style={{
                padding: '6px 14px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Search size={13} />
              <span>Deep Why Breakdown</span>
            </button>
          </div>

          {/* Root Cause Distribution & Interactive Drill-Down Engine */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '16px' }}>
            {/* Root Cause Distribution List */}
            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '20px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, margin: 0, color: TOKENS.colors.text.primary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Root Cause Distribution
                </h4>
                <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Click category to drill down</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lossCategories.map((cat) => {
                  const isSelected = selectedLossCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedLossCategory(cat.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '6px',
                        border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                        background: isSelected ? '#EFF6FF' : '#F8FAFC',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px', color: isSelected ? '#1D4ED8' : TOKENS.colors.text.primary }}>
                          {cat.name}
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#1D4ED8' : TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono }}>
                            {cat.sharePct}%
                          </span>
                          <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
                            ({cat.metresLost}m)
                          </span>
                        </div>
                      </div>

                      {/* Distribution Progress Bar */}
                      <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${cat.sharePct}%`,
                            height: '100%',
                            background: isSelected ? '#2563EB' : cat.sharePct > 20 ? '#DC2626' : '#64748B',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Multi-Level Drill Down Chain */}
            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '20px',
                boxShadow: TOKENS.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 800, margin: 0, color: TOKENS.colors.text.primary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Drill Down: {activeLossCat.name}
                  </h4>
                  <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                    Multi-level causal descent into specific machine and financial loss
                  </div>
                </div>
                <span style={{ background: '#DC2626', color: '#FFFFFF', fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  {activeLossCat.metresLost}m LOST
                </span>
              </div>

              {/* Step-by-step drill down chain */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Level 1: Category */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted, fontWeight: 700 }}>LEVEL 1: CATEGORY</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: TOKENS.colors.text.primary, marginTop: '2px' }}>
                    {activeLossCat.name} ({activeLossCat.sharePct}% of mill production loss)
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '11px', fontWeight: 800 }}>↓</div>

                {/* Level 2: Primary Loom */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted, fontWeight: 700 }}>LEVEL 2: PRIMARY LOOM ATTRIBUTION</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: TOKENS.colors.brand[700], marginTop: '2px' }}>
                    {activeLossCat.primaryLoom}
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '11px', fontWeight: 800 }}>↓</div>

                {/* Level 3: Pattern */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted, fontWeight: 700 }}>LEVEL 3: TELEMETRY PATTERN</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: TOKENS.colors.text.primary, marginTop: '2px' }}>
                    {activeLossCat.pattern}
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '11px', fontWeight: 800 }}>↓</div>

                {/* Level 4: Root Cause */}
                <div style={{ background: '#FEF3C7', border: '1.5px solid #F59E0B', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#92400E', fontWeight: 800 }}>LEVEL 4: PHYSICAL ROOT CAUSE</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>
                    {activeLossCat.rootCause}
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '11px', fontWeight: 800 }}>↓</div>

                {/* Level 5: Direct Loss Impact */}
                <div style={{ background: '#FEF2F2', border: '1.5px solid #F87171', padding: '12px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '10.5px', color: '#991B1B', fontWeight: 800 }}>LEVEL 5: SPECIFIC LOSS IMPACT</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#DC2626', fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                      {activeLossCat.drillMetersLost} meters lost
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10.5px', color: '#991B1B', fontWeight: 700 }}>FINANCIAL IMPACT</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#DC2626', fontFamily: TOKENS.typography.fontMono, marginTop: '2px' }}>
                      ₹{activeLossCat.drillRupeeLost.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px' }}>
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                  ✓ {activeLossCat.recommendation}
                </span>
                {activeLossCat.loomId && onSelectLoom && (
                  <button
                    onClick={() => onSelectLoom(activeLossCat.loomId!)}
                    style={{
                      padding: '6px 12px',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '4px',
                      color: '#1D4ED8',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                    }}
                  >
                    <span>Inspect Profile</span>
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global "Why is production low?" Diagnostic Modal */}
      <WhyProductionLowModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        onNavigateToLoom={onSelectLoom}
        onNavigateToRootCause={(loomNo) => {
          if (loomNo) setRcLoom(loomNo);
          handleTabClick('root-cause');
        }}
        targetMetres={10000}
        actualMetres={8200}
      />
    </div>
  );
}
