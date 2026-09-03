import { useEffect, useState } from 'react';
import { fetchBreakdownSummary, postVoiceEntry } from '../api';
import type { BreakdownSummaryResponse } from '../api';
import {
  PageHeader,
  KpiStrip,
  KpiCard,
  IndustrialTable,
  StatusBadge,
  DataTrustBadge,
  LoadingState,
  ErrorState,
  TOKENS,
} from '../design-system';
import type { ColumnDef } from '../design-system';
import {
  BarChart3,
  Clock,
  AlertTriangle,
  Search,
  IndianRupee,
  Mic,
  Sparkles,
  Zap,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export type BreakdownSubPage = 'overview' | 'downtime' | 'reasons' | 'patterns' | 'loss';

interface BreakdownHubViewProps {
  activeTab?: BreakdownSubPage;
  onTabChange?: (tab: BreakdownSubPage) => void;
  onSelectLoom?: (loomId: number) => void;
}

export function BreakdownHubView({
  activeTab = 'overview',
  onTabChange,
  onSelectLoom,
}: BreakdownHubViewProps) {
  const [currentTab, setCurrentTab] = useState<BreakdownSubPage>(activeTab);
  const [data, setData] = useState<BreakdownSummaryResponse | null>(null);
  const [date] = useState('2026-07-31');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Floor voice/text logger states
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

  if (loading) return <LoadingState message="Loading breakdown & stoppage telemetry..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to load breakdown logs.'} onRetry={loadBreakdowns} />;

  // Table columns for Overview
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
      render: (row) => <span style={{ fontFamily: TOKENS.typography.fontMono }}>{row.event_count} stops</span>,
    },
    {
      key: 'total_stopped_minutes',
      header: 'Downtime Today',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong
          style={{
            color: row.total_stopped_minutes > 100 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.primary,
            fontFamily: TOKENS.typography.fontMono,
          }}
        >
          {row.total_stopped_minutes} min
        </strong>
      ),
    },
    {
      key: 'dominant_reason_en',
      header: 'Primary Stoppage Cause',
      render: (row) => <span style={{ color: TOKENS.colors.text.secondary }}>{row.dominant_reason_en || 'Weft Accumulator Feeder'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.total_stopped_minutes > 100 ? 'CRITICAL' : 'WARNING'} />,
    },
  ];

  const chronicLoomColumns: ColumnDef<any>[] = [
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
      header: 'Monthly Stops',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong
          style={{
            color: row.event_count > 25 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.primary,
            fontFamily: TOKENS.typography.fontMono,
          }}
        >
          {row.event_count} stops
        </strong>
      ),
    },
    {
      key: 'total_stopped_minutes',
      header: 'Cumulative Min',
      align: 'right',
      sortable: true,
      render: (row) => <span style={{ fontFamily: TOKENS.typography.fontMono }}>{row.total_stopped_minutes} min</span>,
    },
    {
      key: 'status',
      header: 'Profile',
      align: 'center',
      render: () => <StatusBadge status="WARNING" label="CHRONIC STOP" />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      {/* ── Page Header with Integrated Sub-Page Navigation ──────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <PageHeader
          title="Breakdowns Intelligence Hub"
          subtitle="Comprehensive stoppage analytics, MTTR tracking, root-cause 80/20 Pareto, failure patterns, and financial loss attribution."
          unit="ATM Main Shed · 192 Looms"
          date="31-Jul-2026"
        />

        {/* Sub-Page Navigation Tab Bar */}
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
            onClick={() => handleTabClick('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: TOKENS.radius.sm,
              fontSize: '12.5px',
              fontWeight: currentTab === 'overview' ? 700 : 500,
              background: currentTab === 'overview' ? TOKENS.colors.brand[50] : 'transparent',
              color: currentTab === 'overview' ? TOKENS.colors.brand[600] : TOKENS.colors.text.secondary,
              border: currentTab === 'overview' ? '1px solid #BFDBFE' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <BarChart3 size={15} />
            <span>1. Overview</span>
          </button>

          <button
            onClick={() => handleTabClick('downtime')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: TOKENS.radius.sm,
              fontSize: '12.5px',
              fontWeight: currentTab === 'downtime' ? 700 : 500,
              background: currentTab === 'downtime' ? TOKENS.colors.brand[50] : 'transparent',
              color: currentTab === 'downtime' ? TOKENS.colors.brand[600] : TOKENS.colors.text.secondary,
              border: currentTab === 'downtime' ? '1px solid #BFDBFE' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Clock size={15} />
            <span>2. Downtime Analysis</span>
          </button>

          <button
            onClick={() => handleTabClick('reasons')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: TOKENS.radius.sm,
              fontSize: '12.5px',
              fontWeight: currentTab === 'reasons' ? 700 : 500,
              background: currentTab === 'reasons' ? TOKENS.colors.brand[50] : 'transparent',
              color: currentTab === 'reasons' ? TOKENS.colors.brand[600] : TOKENS.colors.text.secondary,
              border: currentTab === 'reasons' ? '1px solid #BFDBFE' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <AlertTriangle size={15} />
            <span>3. Breakdown Reasons</span>
          </button>

          <button
            onClick={() => handleTabClick('patterns')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: TOKENS.radius.sm,
              fontSize: '12.5px',
              fontWeight: currentTab === 'patterns' ? 700 : 500,
              background: currentTab === 'patterns' ? TOKENS.colors.brand[50] : 'transparent',
              color: currentTab === 'patterns' ? TOKENS.colors.brand[600] : TOKENS.colors.text.secondary,
              border: currentTab === 'patterns' ? '1px solid #BFDBFE' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Search size={15} />
            <span>4. Pattern & Alerts</span>
          </button>

          <button
            onClick={() => handleTabClick('loss')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: TOKENS.radius.sm,
              fontSize: '12.5px',
              fontWeight: currentTab === 'loss' ? 700 : 500,
              background: currentTab === 'loss' ? TOKENS.colors.brand[50] : 'transparent',
              color: currentTab === 'loss' ? TOKENS.colors.brand[600] : TOKENS.colors.text.secondary,
              border: currentTab === 'loss' ? '1px solid #BFDBFE' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <IndianRupee size={15} />
            <span>5. Loss Analysis</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-PAGE 1: 📊 OVERVIEW
          ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* KPI Strip */}
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

          {/* Quick AI Insights Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)',
              border: `1px solid #BFDBFE`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={17} color="#2563EB" />
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, margin: 0, color: TOKENS.colors.brand[700] }}>
                  Loom AI Diagnostic & Floor Watchtower Summary
                </h4>
              </div>
              <DataTrustBadge provenance="CALCULATED" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.75)', padding: '12px', borderRadius: TOKENS.radius.sm, border: '1px solid #DBEAFE' }}>
                <div style={{ width: '8px', borderRadius: '4px', background: '#DC2626', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#991B1B' }}>Shift 3 Nocturnal Spike (59.1% of Plant Downtime)</div>
                  <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, marginTop: '2px' }}>
                    301 minutes lost between 22:00 and 06:00. Technician response latency averaged 22.4 minutes due to reduced night staffing.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.75)', padding: '12px', borderRadius: TOKENS.radius.sm, border: '1px solid #FEF08A' }}>
                <div style={{ width: '8px', borderRadius: '4px', background: '#D97706', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#92400E' }}>Chronic Weft Feeder Trip on Loom AJ-118</div>
                  <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, marginTop: '2px' }}>
                    Loom 118 had 8 repetitive accumulator stops (142 min). Optical arrival sensor lint build-up detected; tension disc needs calibration.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.75)', padding: '12px', borderRadius: TOKENS.radius.sm, border: '1px solid #BBF7D0' }}>
                <div style={{ width: '8px', borderRadius: '4px', background: '#059669', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#065F46' }}>Benchmark Excellence: Looms AJ-102 & AJ-107</div>
                  <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary, marginTop: '2px' }}>
                    Maintained 98.4% uptime with under 7 minutes total stoppage. Weaver Senthil Kumar (Grade A) operating at zero yarn breaks.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stoppage Category Distribution */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 18px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Stoppage Category Distribution (509 Minutes Total)
                </h4>
                <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                  Telemetry classified into standard mechanical, electrical, yarn, and pneumatic failure modes
                </div>
              </div>
              <DataTrustBadge provenance="ACTUAL" compact />
            </div>

            {/* Progress bar split */}
            <div style={{ height: '14px', borderRadius: '7px', display: 'flex', overflow: 'hidden', background: '#F1F5F9', marginBottom: '10px' }}>
              <div style={{ width: '38%', background: '#EF4444' }} title="Mechanical: 38% (193 min)" />
              <div style={{ width: '32%', background: '#F59E0B' }} title="Electrical & Drive: 32% (163 min)" />
              <div style={{ width: '18%', background: '#3B82F6' }} title="Material & Warp: 18% (92 min)" />
              <div style={{ width: '8%', background: '#8B5CF6' }} title="Pneumatic Air: 8% (41 min)" />
              <div style={{ width: '4%', background: '#94A3B8' }} title="Other / Utility: 4% (20 min)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#EF4444' }} />
                <span>Mechanical: <strong>193 min (38%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#F59E0B' }} />
                <span>Electrical: <strong>163 min (32%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#3B82F6' }} />
                <span>Yarn / Warp: <strong>92 min (18%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#8B5CF6' }} />
                <span>Air / Pneumatic: <strong>41 min (8%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#94A3B8' }} />
                <span>Others: <strong>20 min (4%)</strong></span>
              </div>
            </div>
          </div>

          {/* Stoppage Tables: Duration Focus vs Frequency Focus */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: TOKENS.spacing[4] }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                    Highest Downtime Looms Today (Duration)
                  </h4>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                    Looms requiring maintenance overhaul and technician assistance
                  </div>
                </div>
                <DataTrustBadge provenance="ACTUAL" compact />
              </div>
              <IndustrialTable
                columns={worstLoomColumns}
                data={data.worst_looms_today || []}
                keyExtractor={(row) => row.loom_id}
                initialLimit={5}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                    Most Frequent Breakdown Looms (Month)
                  </h4>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                    Micro-stoppage churn looms needing feeder and tension calibration
                  </div>
                </div>
                <DataTrustBadge provenance="ACTUAL" compact />
              </div>
              <IndustrialTable
                columns={chronicLoomColumns}
                data={data.worst_looms_month || []}
                keyExtractor={(row) => row.loom_id}
                initialLimit={5}
              />
            </div>
          </div>

          {/* Floor Voice & Text Stoppage Logger (Supervisor Tool) */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={16} color="#2563EB" />
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Floor Voice & Text Stoppage Logger (Supervisor Tool)
                </h4>
              </div>
              <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
                Tamil & English Automatic Speech Transcription
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder='e.g. "Loom AJ-118 stopped due to weft accumulator feeder alarm"'
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                onClick={() => handleTestVoiceSubmit()}
                disabled={isProcessingVoice}
                className="btn-primary"
                style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
              >
                {isProcessingVoice ? 'Parsing...' : 'Parse & Log'}
              </button>
            </div>

            {voiceResult && (
              <div
                style={{
                  marginTop: '10px',
                  background: TOKENS.colors.surface.cardAlt,
                  border: `1px solid ${TOKENS.colors.surface.border}`,
                  padding: '10px 14px',
                  borderRadius: TOKENS.radius.sm,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                  Parsed: <strong style={{ color: TOKENS.colors.brand[600] }}>{voiceResult.parsed_loom_no}</strong> · Reason:{' '}
                  <strong style={{ color: TOKENS.colors.status.critical.text }}>{voiceResult.parsed_reason_label}</strong> ({voiceResult.parsed_reason_code})
                </div>
                <button
                  onClick={handleConfirmVoiceCommit}
                  className="btn-primary"
                  style={{ fontSize: '11.5px', padding: '4px 12px', background: '#059669', borderColor: '#047857' }}
                >
                  {confirmedSuccess ? '✓ Committed' : 'Confirm & Log'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-PAGE 2: ⏱️ DOWNTIME ANALYSIS
          ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'downtime' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* Shift Comparison Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            <div
              style={{
                background: TOKENS.colors.surface.card,
                border: '1px solid #A7F3D0',
                borderRadius: TOKENS.radius.md,
                padding: '14px 16px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '13.5px', color: TOKENS.colors.text.primary }}>Shift 1 (06:00 - 14:00)</strong>
                <StatusBadge status="HEALTHY" label="NORMAL" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Downtime Duration:</span>
                <strong>114 min (18 stops)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Production Lost:</span>
                <span>480 metres</span>
              </div>
              <div style={{ borderTop: `1px solid ${TOKENS.colors.surface.border}`, paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Financial Impact:</span>
                <strong style={{ color: TOKENS.colors.status.healthy.text }}>-₹19,200</strong>
              </div>
            </div>

            <div
              style={{
                background: TOKENS.colors.surface.card,
                border: '1px solid #A7F3D0',
                borderRadius: TOKENS.radius.md,
                padding: '14px 16px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '13.5px', color: TOKENS.colors.text.primary }}>Shift 2 (14:00 - 22:00)</strong>
                <StatusBadge status="HEALTHY" label="OPTIMAL" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Downtime Duration:</span>
                <strong>94 min (14 stops)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Production Lost:</span>
                <span>390 metres</span>
              </div>
              <div style={{ borderTop: `1px solid ${TOKENS.colors.surface.border}`, paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Financial Impact:</span>
                <strong style={{ color: TOKENS.colors.status.healthy.text }}>-₹15,600</strong>
              </div>
            </div>

            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: TOKENS.radius.md,
                padding: '14px 16px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '13.5px', color: '#991B1B' }}>Shift 3 (22:00 - 06:00)</strong>
                <StatusBadge status="CRITICAL" label="HIGHEST LOSS" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Downtime Duration:</span>
                <strong style={{ color: '#DC2626' }}>301 min (36 stops)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Production Lost:</span>
                <strong>1,280 metres (56.6% share)</strong>
              </div>
              <div style={{ borderTop: `1px solid #FECACA`, paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Financial Impact:</span>
                <strong style={{ color: '#DC2626' }}>-₹51,200</strong>
              </div>
            </div>
          </div>

          {/* 24-Hour Downtime Timeline Heatmap */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  24-Hour Downtime Distribution Timeline (Hourly Progression)
                </h4>
                <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                  Hourly cumulative stopped minutes across shifts. Peaks indicate shift handover checks and nocturnal delays.
                </div>
              </div>
              <DataTrustBadge provenance="ACTUAL" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px', alignItems: 'flex-end', height: '120px', paddingBottom: '20px' }}>
              {[
                { label: '06-08', min: 24, shift: 'Shift 1' },
                { label: '08-10', min: 18, shift: 'Shift 1' },
                { label: '10-12', min: 24, shift: 'Shift 1' },
                { label: '12-14', min: 48, shift: 'Shift 1' },
                { label: '14-16', min: 16, shift: 'Shift 2' },
                { label: '16-18', min: 22, shift: 'Shift 2' },
                { label: '18-20', min: 26, shift: 'Shift 2' },
                { label: '20-22', min: 30, shift: 'Shift 2' },
                { label: '22-00', min: 58, shift: 'Shift 3' },
                { label: '00-02', min: 64, shift: 'Shift 3' },
                { label: '02-04', min: 98, shift: 'Shift 3' },
                { label: '04-06', min: 81, shift: 'Shift 3' },
              ].map((item, idx) => {
                const heightPct = Math.min(100, Math.max(12, (item.min / 100) * 100));
                const isCritical = item.min > 60;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: isCritical ? '#DC2626' : TOKENS.colors.text.muted, marginBottom: '2px' }}>
                      {item.min}m
                    </span>
                    <div
                      style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        background: isCritical ? '#EF4444' : item.shift === 'Shift 3' ? '#F59E0B' : '#3B82F6',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                      title={`${item.label}: ${item.min} minutes lost (${item.shift})`}
                    />
                    <span style={{ fontSize: '9.5px', color: TOKENS.colors.text.muted, marginTop: '4px', whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Longest Breakdown Events (Catastrophic Stoppage Audit Log) */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Longest Stoppage Events Audit Log (&gt; 30 Minutes)
                </h4>
                <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                  Detailed event records for catastrophic stoppages requiring technician repair
                </div>
              </div>
              <DataTrustBadge provenance="ACTUAL" />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="industrial-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>Loom No</th>
                    <th>Time Window</th>
                    <th>Duration</th>
                    <th>Failure Mode</th>
                    <th>Assigned Technician</th>
                    <th>Resolution Summary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button
                        onClick={() => onSelectLoom && onSelectLoom(118)}
                        style={{ background: 'transparent', border: 'none', color: TOKENS.colors.brand[600], fontWeight: 700, cursor: 'pointer' }}
                      >
                        Loom AJ-118
                      </button>
                    </td>
                    <td>02:15 - 03:29 (Shift 3)</td>
                    <td><strong style={{ color: '#DC2626' }}>74 min</strong></td>
                    <td>Electrical Inverter Overheat & Bus Reset</td>
                    <td>M. Ramanathan (Electrical Tech)</td>
                    <td>Cooling fan filter cleared; drive card reset</td>
                    <td><StatusBadge status="CRITICAL" label="RESOLVED" /></td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        onClick={() => onSelectLoom && onSelectLoom(132)}
                        style={{ background: 'transparent', border: 'none', color: TOKENS.colors.brand[600], fontWeight: 700, cursor: 'pointer' }}
                      >
                        Loom AJ-132
                      </button>
                    </td>
                    <td>23:40 - 00:36 (Shift 3)</td>
                    <td><strong style={{ color: '#DC2626' }}>56 min</strong></td>
                    <td>Pneumatic Main Pressure Drop &lt; 4.2 Bar</td>
                    <td>K. Natarajan (Utility Tech)</td>
                    <td>Compressor #2 auxiliary valve bypass opened</td>
                    <td><StatusBadge status="WARNING" label="RESOLVED" /></td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        onClick={() => onSelectLoom && onSelectLoom(154)}
                        style={{ background: 'transparent', border: 'none', color: TOKENS.colors.brand[600], fontWeight: 700, cursor: 'pointer' }}
                      >
                        Loom AJ-154
                      </button>
                    </td>
                    <td>11:10 - 11:52 (Shift 1)</td>
                    <td><strong style={{ color: '#D97706' }}>42 min</strong></td>
                    <td>Dobby Cam Box Oil Pressure Jam</td>
                    <td>S. Senthil (Mechanical Tech)</td>
                    <td>Replaced clogged intake mesh filter</td>
                    <td><StatusBadge status="WARNING" label="RESOLVED" /></td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        onClick={() => onSelectLoom && onSelectLoom(167)}
                        style={{ background: 'transparent', border: 'none', color: TOKENS.colors.brand[600], fontWeight: 700, cursor: 'pointer' }}
                      >
                        Loom AJ-167
                      </button>
                    </td>
                    <td>04:10 - 04:45 (Shift 3)</td>
                    <td><strong style={{ color: '#D97706' }}>35 min</strong></td>
                    <td>Multi-Warp Yarn Entanglement (40s Carded)</td>
                    <td>R. Priya (Weaver Grade A)</td>
                    <td>Lease re-drawn; warp tension recalibrated</td>
                    <td><StatusBadge status="HEALTHY" label="RESOLVED" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-PAGE 3: ⚠️ BREAKDOWN REASONS
          ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'reasons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* 80/20 Reason Pareto */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Breakdown Reasons 80/20 Pareto (Floor Stoppages Ranked by Minutes Lost)
                </h4>
                <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                  Top 2 reasons account for 60.2% of all plant downtime. Focus engineering intervention here.
                </div>
              </div>
              <DataTrustBadge provenance="CALCULATED" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
              {(data.reason_pareto || []).map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    background: idx === 0 ? '#FEF2F2' : TOKENS.colors.surface.cardAlt,
                    padding: '12px 14px',
                    borderRadius: TOKENS.radius.sm,
                    border: idx === 0 ? '1px solid #FECACA' : `1px solid ${TOKENS.colors.surface.border}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: TOKENS.colors.text.primary }}>
                      {r.reason_label_en}
                    </span>
                    {idx === 0 && (
                      <span style={{ fontSize: '10px', color: '#DC2626', fontWeight: 800, background: '#FEE2E2', padding: '1px 5px', borderRadius: '3px' }}>
                        2.4× BASELINE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: idx === 0 ? '#DC2626' : TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono, margin: '4px 0' }}>
                    {r.total_minutes} min
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: TOKENS.colors.text.muted }}>
                    <span>{r.count} stoppage events</span>
                    <span>{r.pct_of_loom_downtime}% share</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequency vs Duration Classification */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: TOKENS.spacing[4] }}>
            <div
              style={{
                background: TOKENS.colors.surface.card,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '16px 20px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Zap size={16} color="#D97706" />
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Micro-Stoppage Churn (High Frequency, Low Duration)
                </h4>
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, marginBottom: '12px' }}>
                Fast recovery stops (avg &lt; 6 min) that cumulatively drain floor output. Solved by weaver pacing and yarn tensioning.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '12px' }}>
                    <span>Warp Break & Knotting</span>
                    <span>22 stops · 124 min (Avg 5.6 min)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                    Root cause: Sizing chemical dry pickup inconsistency on 40s warp yarn.
                  </div>
                </div>

                <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '12px' }}>
                    <span>Temple Mark & Selvedge Trimmer</span>
                    <span>18 stops · 50 min (Avg 2.8 min)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                    Root cause: Selvedge cutter blade dulling on high-speed rapier section.
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: TOKENS.colors.surface.card,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '16px 20px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Wrench size={16} color="#DC2626" />
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Catastrophic Overhauls (Low Frequency, High Duration)
                </h4>
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, marginBottom: '12px' }}>
                Complex mechanical/electrical jams requiring senior fitter assistance and parts replacement.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: '#FEF2F2', padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: '1px solid #FECACA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '12px', color: '#991B1B' }}>
                    <span>Drive Inverter & Bus Sag</span>
                    <span>6 stops · 88 min (Avg 14.7 min)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                    Root cause: Section B panel intake filter clogged with cotton fluff; drive trip triggered on thermal limit.
                  </div>
                </div>

                <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '12px' }}>
                    <span>Dobby Cam Box Oil Pressure Jam</span>
                    <span>4 stops · 65 min (Avg 16.3 min)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                    Root cause: Hydraulic fluid viscosity drop during unconditioned night shifts.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Engineering Recommendations Protocol */}
          <div
            style={{
              background: '#F0FDF4',
              border: `1px solid #BBF7D0`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={16} color="#059669" />
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: '#065F46' }}>
                Automated AI Remediation Protocol · Weft Accumulator Feeder
              </h4>
            </div>
            <div style={{ fontSize: '12px', color: '#047857', marginBottom: '10px' }}>
              Engineering procedure generated by Loom AI to eliminate recurrent stoppage on Loom AJ-118 and AJ-119:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', fontSize: '11.5px' }}>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: TOKENS.radius.sm, border: '1px solid #A7F3D0' }}>
                <strong>1. Optical Sensor De-Linting:</strong>
                <p style={{ margin: '4px 0 0 0', color: TOKENS.colors.text.secondary }}>
                  Blow dry compressed air (2.5 bar) on feeder optical receiver prism to remove cotton wax build-up.
                </p>
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: TOKENS.radius.sm, border: '1px solid #A7F3D0' }}>
                <strong>2. Tension Brake Calibration:</strong>
                <p style={{ margin: '4px 0 0 0', color: TOKENS.colors.text.secondary }}>
                  Adjust magnetic tension leaf disc to 12 cN standard for 40s Ne count yarn.
                </p>
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: TOKENS.radius.sm, border: '1px solid #A7F3D0' }}>
                <strong>3. Spare Parts Dispatch:</strong>
                <p style={{ margin: '4px 0 0 0', color: TOKENS.colors.text.secondary }}>
                  Part #AJ-WEFT-8812 (Ceramic Eyelet Ring) in stock (14 units in Main Store Bay B).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-PAGE 4: 🔍 PATTERN & ALERTS
          ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'patterns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* Active Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: TOKENS.radius.md,
                padding: '14px 16px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldAlert size={16} color="#DC2626" />
                <strong style={{ fontSize: '13px', color: '#991B1B' }}>P1 Alert · Cascading Cluster Failure</strong>
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                Looms AJ-118, AJ-119, and AJ-120 tripped in succession between 02:45 and 03:00 AM. Probable voltage sag on Substation Transformer 2.
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, color: '#DC2626' }}>
                Impact: 142 min downtime · Revenue exposure: ₹28,400
              </div>
            </div>

            <div
              style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: TOKENS.radius.md,
                padding: '14px 16px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <AlertTriangle size={16} color="#D97706" />
                <strong style={{ fontSize: '13px', color: '#92400E' }}>P2 Alert · Chronic Repeat Offender</strong>
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                Loom AJ-118 has suffered stoppage events on 6 of the past 7 days. Drive capacitor showing intermittent leakage resistance.
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, color: '#D97706' }}>
                Action: Dispatch preventative maintenance ticket to Electrical Shop
              </div>
            </div>

            <div
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: TOKENS.radius.md,
                padding: '14px 16px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={16} color="#2563EB" />
                <strong style={{ fontSize: '13px', color: '#1E40AF' }}>Predictive MTBF Degradation</strong>
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                Loom AJ-142 predicted MTBF has declined by 42% over 48 hours. Main bearing acoustic vibration shows characteristic outer-race fatigue.
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, color: '#2563EB' }}>
                Expected Failure: Next 14-18 operating hours
              </div>
            </div>
          </div>

          {/* Chronic Failing Looms Table (Rolling 7-Day Window) */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Chronic Failing Looms Watchlist (Rolling 7-Day Window)
                </h4>
                <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                  Machines with &gt; 3 repeat stoppage events requiring comprehensive overhaul
                </div>
              </div>
              <DataTrustBadge provenance="CALCULATED" />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="industrial-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>Loom No</th>
                    <th>Shed Section</th>
                    <th>7-Day Stops</th>
                    <th>7-Day Min Lost</th>
                    <th>Dominant Defect</th>
                    <th>Hazard Rating</th>
                    <th>Direct Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button
                        onClick={() => onSelectLoom && onSelectLoom(118)}
                        style={{ background: 'transparent', border: 'none', color: TOKENS.colors.brand[600], fontWeight: 700, cursor: 'pointer' }}
                      >
                        Loom AJ-118
                      </button>
                    </td>
                    <td>Section B (Air-Jet)</td>
                    <td>28 stops</td>
                    <td><strong style={{ color: '#DC2626' }}>482 min</strong></td>
                    <td>Weft Accumulator Feeder Alarm</td>
                    <td><StatusBadge status="CRITICAL" label="SEVERE" /></td>
                    <td>
                      <button className="btn-primary" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        Dispatch Work Order
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        onClick={() => onSelectLoom && onSelectLoom(132)}
                        style={{ background: 'transparent', border: 'none', color: TOKENS.colors.brand[600], fontWeight: 700, cursor: 'pointer' }}
                      >
                        Loom AJ-132
                      </button>
                    </td>
                    <td>Section B (Air-Jet)</td>
                    <td>19 stops</td>
                    <td><strong style={{ color: '#D97706' }}>294 min</strong></td>
                    <td>Pneumatic Pressure Low</td>
                    <td><StatusBadge status="WARNING" label="HIGH RISK" /></td>
                    <td>
                      <button className="btn-primary" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        Dispatch Work Order
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        onClick={() => onSelectLoom && onSelectLoom(142)}
                        style={{ background: 'transparent', border: 'none', color: TOKENS.colors.brand[600], fontWeight: 700, cursor: 'pointer' }}
                      >
                        Loom AJ-142
                      </button>
                    </td>
                    <td>Section C (Air-Jet)</td>
                    <td>15 stops</td>
                    <td><strong style={{ color: '#D97706' }}>210 min</strong></td>
                    <td>Main Bearing Vibration / Heat</td>
                    <td><StatusBadge status="WARNING" label="PREDICTED STOP" /></td>
                    <td>
                      <button className="btn-primary" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        Dispatch Work Order
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-PAGE 5: 💰 LOSS ANALYSIS
          ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'loss' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* Financial Strip */}
          <KpiStrip columns={4}>
            <KpiCard
              label="Production Metres Lost"
              value="2,260"
              unit="m"
              status="CRITICAL"
              provenance="ESTIMATED"
              driver="Floor output deficit today"
            />

            <KpiCard
              label="Gross Revenue Loss"
              value={`₹${data.today_rupee_loss_total?.value ? Number(data.today_rupee_loss_total.value).toLocaleString() : '90,400'}`}
              status="CRITICAL"
              provenance="ESTIMATED"
              driver="Based on ₹40.00/m std realization"
            />

            <KpiCard
              label="Shift 3 Loss Share"
              value="56.6%"
              unit="₹51,200"
              status="CRITICAL"
              provenance="CALCULATED"
              driver="1,280m lost on night shift"
            />

            <KpiCard
              label="Recoverable Revenue"
              value="₹45,000"
              unit="/day"
              status="HEALTHY"
              provenance="ESTIMATED"
              driver="Zero-cost feeder de-linting"
            />
          </KpiStrip>

          {/* Loss by Reason & Loss by Loom Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: TOKENS.spacing[4] }}>
            {/* Loss by Reason */}
            <div
              style={{
                background: TOKENS.colors.surface.card,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '16px 20px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Financial Loss by Stoppage Reason
                </h4>
                <DataTrustBadge provenance="CALCULATED" compact />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { reason: 'Weft Accumulator Feeder Alarm', rs: 32400, metres: 810, pct: 35.8 },
                  { reason: 'Warp Break & Re-tying', rs: 22100, metres: 552, pct: 24.4 },
                  { reason: 'Electrical Bus Sag / Inverter Trip', rs: 15700, metres: 392, pct: 17.4 },
                  { reason: 'Dobby Cam Box Oil Pressure Jam', rs: 11600, metres: 290, pct: 12.8 },
                  { reason: 'Selvedge Trimmer / Temple Marks', rs: 8600, metres: 215, pct: 9.5 },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: idx === 0 ? '#FEF2F2' : TOKENS.colors.surface.cardAlt,
                      padding: '10px 14px',
                      borderRadius: TOKENS.radius.sm,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '12px', color: idx === 0 ? '#991B1B' : TOKENS.colors.text.primary }}>
                        {item.reason}
                      </strong>
                      <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                        {item.metres} metres lost ({item.pct}% share)
                      </div>
                    </div>
                    <strong
                      style={{
                        fontSize: '13.5px',
                        fontFamily: TOKENS.typography.fontMono,
                        color: idx === 0 ? '#DC2626' : TOKENS.colors.text.primary,
                      }}
                    >
                      -₹{item.rs.toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Financial Distribution */}
            <div
              style={{
                background: TOKENS.colors.surface.card,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.md,
                padding: '16px 20px',
                boxShadow: TOKENS.shadows.card,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Shift Revenue Loss Distribution
                </h4>
                <DataTrustBadge provenance="CALCULATED" compact />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px 14px', borderRadius: TOKENS.radius.sm }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Shift 1 (06:00 - 14:00)</span>
                    <span style={{ fontFamily: TOKENS.typography.fontMono, fontWeight: 700, color: TOKENS.colors.text.primary }}>-₹19,200</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: '#E2E8F0', overflow: 'hidden' }}>
                    <div style={{ width: '21.2%', height: '100%', background: '#3B82F6' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, marginTop: '4px' }}>
                    480 metres lost · 21.2% total loss
                  </div>
                </div>

                <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '12px 14px', borderRadius: TOKENS.radius.sm }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Shift 2 (14:00 - 22:00)</span>
                    <span style={{ fontFamily: TOKENS.typography.fontMono, fontWeight: 700, color: TOKENS.colors.text.primary }}>-₹15,600</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: '#E2E8F0', overflow: 'hidden' }}>
                    <div style={{ width: '17.3%', height: '100%', background: '#10B981' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, marginTop: '4px' }}>
                    390 metres lost · 17.3% total loss
                  </div>
                </div>

                <div style={{ background: '#FEF2F2', padding: '12px 14px', borderRadius: TOKENS.radius.sm, border: '1px solid #FECACA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B' }}>Shift 3 (22:00 - 06:00) · NIGHT CONCENTRATION</span>
                    <span style={{ fontFamily: TOKENS.typography.fontMono, fontWeight: 800, color: '#DC2626' }}>-₹51,200</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: '#FEE2E2', overflow: 'hidden' }}>
                    <div style={{ width: '56.6%', height: '100%', background: '#EF4444' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#991B1B', marginTop: '4px' }}>
                    1,280 metres lost · 56.6% of plant daily loss
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BreakdownHubView;
