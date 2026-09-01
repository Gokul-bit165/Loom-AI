import { useEffect, useState } from 'react';
import {
  fetchWatchtower,
  fetchLossHunter,
  fetchActionManager,
  fetchPredictiveMaintenance,
  fetchOpportunityDetector,
  fetchRevenueGuardian,
  fetchSourceFreshness,
} from '../api';
import type {
  WatchtowerResponse,
  LossHunterResponse,
  ActionManagerResponse,
  PredictiveMaintenanceResponse,
  OpportunityDetectorResponse,
  RevenueGuardianResponse,
} from '../api';
import {
  PageHeader,
  KpiStrip,
  KpiCard,
  StatusBadge,
  DataTrustBadge,
  LoadingState,
  ErrorState,
  TOKENS,
} from '../design-system';
import {
  ShieldAlert,
  Target,
  TrendingUp,
  BrainCircuit,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ContextualAiDrawer } from './ContextualAiDrawer';
import type { ContextualAiPayload } from './ContextualAiDrawer';

export type AgentTab =
  | 'watchtower'
  | 'loss_hunter'
  | 'opportunity'
  | 'predictive'
  | 'revenue'
  | 'action_manager';

interface AiAgentsHubViewProps {
  initialTab?: AgentTab;
  onNavigateToModule?: (view: string, loomId?: number) => void;
}

export function AiAgentsHubView({ initialTab = 'watchtower', onNavigateToModule: _onNav }: AiAgentsHubViewProps) {
  const [activeTab, setActiveTab] = useState<AgentTab>(initialTab);
  const [date] = useState('2026-07-31');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Agent data states
  const [watchtower, setWatchtower] = useState<WatchtowerResponse | null>(null);
  const [lossHunter, setLossHunter] = useState<LossHunterResponse | null>(null);
  const [actions, setActions] = useState<ActionManagerResponse | null>(null);
  const [predictions, setPredictions] = useState<PredictiveMaintenanceResponse | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityDetectorResponse | null>(null);
  const [revenueGuardian, setRevenueGuardian] = useState<RevenueGuardianResponse | null>(null);
  const [_freshness, setFreshness] = useState<any | null>(null);

  // Contextual AI Drawer
  const [drawerContext, setDrawerContext] = useState<ContextualAiPayload | null>(null);

  const loadAllAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const [wt, lh, am, pm, opp, rg, fresh] = await Promise.all([
        fetchWatchtower(date, 'ATM'),
        fetchLossHunter(date, 'ATM'),
        fetchActionManager(date, 'ATM'),
        fetchPredictiveMaintenance(date, 'ATM'),
        fetchOpportunityDetector(date, 'ATM'),
        fetchRevenueGuardian(date, 'ATM'),
        fetchSourceFreshness(date, 'ATM'),
      ]);
      setWatchtower(wt);
      setLossHunter(lh);
      setActions(am);
      setPredictions(pm);
      setOpportunities(opp);
      setRevenueGuardian(rg);
      setFreshness(fresh);
    } catch (e: any) {
      console.error('Failed to load AI agents data:', e);
      setError('Unable to load AI & Operational Agents telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAgents();
  }, [date]);

  if (loading) return <LoadingState message="Connecting to Operational AI Agents & Evidence Layer..." />;
  if (error) return <ErrorState message={error} onRetry={loadAllAgents} />;

  const handleOpenDrawer = (payload: ContextualAiPayload) => {
    setDrawerContext(payload);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title="Industrial AI & Operational Agents Hub"
        subtitle="Specialized operational intelligence agents watching floor telemetry, finding revenue waste, and verifying closed-loop actions."
        unit="ATM Main Shed (192 Looms)"
        date="31-Jul-2026"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Surveillance:</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 600, color: TOKENS.colors.status.healthy.text }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: TOKENS.colors.status.healthy.text }} />
              <span>All 6 Agents Active</span>
            </span>
          </div>
        }
      />

      {/* ── Top Agent Navigation Ribbon ─────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: TOKENS.colors.surface.card,
          padding: '8px 12px',
          borderRadius: TOKENS.radius.md,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          boxShadow: TOKENS.shadows.card,
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveTab('watchtower')}
          className={`btn-subtab ${activeTab === 'watchtower' ? 'active' : ''}`}
          style={{
            padding: '8px 14px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'watchtower' ? 700 : 500,
            borderRadius: '4px',
            border: activeTab === 'watchtower' ? `1px solid ${TOKENS.colors.brand[600]}` : '1px solid transparent',
            background: activeTab === 'watchtower' ? TOKENS.colors.brand[100] : 'transparent',
            color: activeTab === 'watchtower' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <ShieldAlert size={14} />
          <span>1. AI Watchtower</span>
          {watchtower && (
            <span style={{ fontSize: '10.5px', background: '#DC2626', color: '#FFFFFF', padding: '1px 5px', borderRadius: '10px' }}>
              {watchtower.findings_count}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('loss_hunter')}
          className={`btn-subtab ${activeTab === 'loss_hunter' ? 'active' : ''}`}
          style={{
            padding: '8px 14px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'loss_hunter' ? 700 : 500,
            borderRadius: '4px',
            border: activeTab === 'loss_hunter' ? `1px solid ${TOKENS.colors.brand[600]}` : '1px solid transparent',
            background: activeTab === 'loss_hunter' ? TOKENS.colors.brand[100] : 'transparent',
            color: activeTab === 'loss_hunter' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <Target size={14} />
          <span>2. Loss Hunter</span>
        </button>

        <button
          onClick={() => setActiveTab('opportunity')}
          className={`btn-subtab ${activeTab === 'opportunity' ? 'active' : ''}`}
          style={{
            padding: '8px 14px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'opportunity' ? 700 : 500,
            borderRadius: '4px',
            border: activeTab === 'opportunity' ? `1px solid ${TOKENS.colors.brand[600]}` : '1px solid transparent',
            background: activeTab === 'opportunity' ? TOKENS.colors.brand[100] : 'transparent',
            color: activeTab === 'opportunity' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <TrendingUp size={14} />
          <span>3. Opportunity Detector</span>
        </button>

        <button
          onClick={() => setActiveTab('predictive')}
          className={`btn-subtab ${activeTab === 'predictive' ? 'active' : ''}`}
          style={{
            padding: '8px 14px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'predictive' ? 700 : 500,
            borderRadius: '4px',
            border: activeTab === 'predictive' ? `1px solid ${TOKENS.colors.brand[600]}` : '1px solid transparent',
            background: activeTab === 'predictive' ? TOKENS.colors.brand[100] : 'transparent',
            color: activeTab === 'predictive' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <BrainCircuit size={14} />
          <span>4. Predictive Maintenance</span>
          <DataTrustBadge provenance="PREDICTED" compact />
        </button>

        <button
          onClick={() => setActiveTab('revenue')}
          className={`btn-subtab ${activeTab === 'revenue' ? 'active' : ''}`}
          style={{
            padding: '8px 14px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'revenue' ? 700 : 500,
            borderRadius: '4px',
            border: activeTab === 'revenue' ? `1px solid ${TOKENS.colors.brand[600]}` : '1px solid transparent',
            background: activeTab === 'revenue' ? TOKENS.colors.brand[100] : 'transparent',
            color: activeTab === 'revenue' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <IndianRupee size={14} />
          <span>5. Revenue Guardian</span>
        </button>

        <button
          onClick={() => setActiveTab('action_manager')}
          className={`btn-subtab ${activeTab === 'action_manager' ? 'active' : ''}`}
          style={{
            padding: '8px 14px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'action_manager' ? 700 : 500,
            borderRadius: '4px',
            border: activeTab === 'action_manager' ? `1px solid ${TOKENS.colors.brand[600]}` : '1px solid transparent',
            background: activeTab === 'action_manager' ? TOKENS.colors.brand[100] : 'transparent',
            color: activeTab === 'action_manager' ? TOKENS.colors.brand[700] : TOKENS.colors.text.secondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <CheckCircle2 size={14} />
          <span>6. Action Manager (Closed-Loop)</span>
        </button>
      </div>

      {/* ── AGENT 1: AI WATCHTOWER ──────────────────────────────────────── */}
      {activeTab === 'watchtower' && watchtower && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0', color: TOKENS.colors.text.primary }}>
                  Proactive Mill Surveillance Stream
                </h3>
                <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary }}>
                  The AI Watchtower continuously analyzes 192 looms across 5 operational vectors to synthesize material findings without human querying.
                </div>
              </div>
              <DataTrustBadge provenance="CALCULATED" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {watchtower.findings.map((f) => (
              <div
                key={f.finding_id}
                style={{
                  background: TOKENS.colors.surface.card,
                  border: `1px solid ${f.severity === 'CRITICAL' ? TOKENS.colors.status.critical.border : TOKENS.colors.surface.border}`,
                  borderRadius: TOKENS.radius.md,
                  padding: '16px 20px',
                  boxShadow: TOKENS.shadows.card,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge status={f.severity} label={f.type} />
                    <strong style={{ fontSize: '14.5px', color: TOKENS.colors.text.primary }}>{f.title}</strong>
                  </div>

                  <button
                    onClick={() =>
                      handleOpenDrawer({
                        title: f.title,
                        category: f.type,
                        loomNo: f.entity_id,
                        issueDescription: f.inference,
                        observations: f.observations,
                        baseline: f.baseline_value,
                        current_value: f.current_value,
                        impactMetres: f.impact.production_metres,
                        impactInr: f.impact.revenue_inr,
                        downtimeMin: f.impact.downtime_minutes,
                        probableCause: f.inference,
                        recommendedAction: f.recommendation,
                        confidence: f.confidence,
                        sourceIds: f.source_ids,
                      })
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      background: TOKENS.colors.brand[100],
                      color: TOKENS.colors.brand[700],
                      border: `1px solid ${TOKENS.colors.brand[500]}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Explain & Evidence</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '10px' }}>
                  {/* Observations */}
                  <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.text.muted, marginBottom: '4px', textTransform: 'uppercase' }}>
                      Evidence Observations
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                      {f.observations.map((obs, i) => (
                        <li key={i}>{obs}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact */}
                  <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.text.muted, marginBottom: '4px', textTransform: 'uppercase' }}>
                      Estimated Business Impact
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                      <div>
                        <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted }}>Revenue Exposure</div>
                        <strong style={{ fontSize: '15px', color: TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono }}>
                          ₹{f.impact.revenue_inr.toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted }}>Output Gap</div>
                        <strong style={{ fontSize: '15px', color: TOKENS.colors.brand[600], fontFamily: TOKENS.typography.fontMono }}>
                          {f.impact.production_metres.toLocaleString()} m
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Action */}
                <div style={{ marginTop: '10px', padding: '8px 12px', background: TOKENS.colors.brand[50], borderRadius: '4px', border: `1px solid ${TOKENS.colors.brand[100]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.primary }}>
                    <strong style={{ color: TOKENS.colors.brand[700] }}>Recommended Action: </strong>
                    {f.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AGENT 2: LOSS HUNTER ────────────────────────────────────────── */}
      {activeTab === 'loss_hunter' && lossHunter && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          {/* Start Here Banner */}
          <div
            style={{
              background: '#FEF2F2',
              border: `1px solid #FECACA`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              <Target size={16} />
              <span>OWNER PRIORITY ATTACK PLAN</span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '6px 0 4px 0', color: '#991B1B' }}>
              {lossHunter.start_here.title}
            </h3>
            <div style={{ fontSize: '13px', color: '#7F1D1D' }}>
              <strong>Immediate Action: </strong>
              {lossHunter.start_here.priority_action} on <strong>{lossHunter.start_here.target_machines}</strong>. Estimated recoverable revenue: <strong>₹{lossHunter.start_here.potential_recovery_inr.toLocaleString()}</strong>.
            </div>
          </div>

          {/* Loss Waterfall Breakdown */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 12px 0', color: TOKENS.colors.text.primary }}>
              Floor Financial Waste Attribution
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lossHunter.top_loss_today.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: `1px solid ${TOKENS.colors.surface.border}`,
                    background: TOKENS.colors.surface.cardAlt,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.brand[600], background: TOKENS.colors.brand[100], padding: '2px 6px', borderRadius: '3px' }}>
                        #{idx + 1} LOSS
                      </span>
                      <strong style={{ fontSize: '13.5px', color: TOKENS.colors.text.primary }}>{item.category}</strong>
                      <span style={{ fontSize: '12px', color: TOKENS.colors.text.muted }}>({item.lost_units})</span>
                    </div>
                    <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, marginTop: '4px' }}>
                      Driver: {item.primary_driver} · Target: <strong>{item.affected_entities}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono }}>
                      ₹{item.amount_inr.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>{item.share_pct}% of total waste</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AGENT 3: OPPORTUNITY DETECTOR ───────────────────────────────── */}
      {activeTab === 'opportunity' && opportunities && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0', color: TOKENS.colors.text.primary }}>
                  Constraint-Aware Output Opportunities
                </h3>
                <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary }}>
                  AI analyzes style allocations, loom speed headroom, and weaver skills to identify realistic output gains.
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Total Potential Output Gain</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: TOKENS.colors.status.healthy.text, fontFamily: TOKENS.typography.fontMono }}>
                  +{opportunities.total_potential_output_gain_metres.toLocaleString()} m (₹{opportunities.total_potential_revenue_gain_inr.toLocaleString()})
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {opportunities.opportunities.map((opp) => (
              <div
                key={opp.opportunity_id}
                style={{
                  background: TOKENS.colors.surface.card,
                  border: `1px solid ${TOKENS.colors.surface.border}`,
                  borderRadius: TOKENS.radius.md,
                  padding: '16px 20px',
                  boxShadow: TOKENS.shadows.card,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.brand[600], background: TOKENS.colors.brand[100], padding: '2px 6px', borderRadius: '3px' }}>
                      {opp.category}
                    </span>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, margin: '6px 0', color: TOKENS.colors.text.primary }}>
                      {opp.headline}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: TOKENS.colors.status.healthy.text, fontFamily: TOKENS.typography.fontMono }}>
                      +{opp.potential_gain_metres} m
                    </div>
                    <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>+₹{opp.potential_gain_inr.toLocaleString()} value</div>
                  </div>
                </div>

                <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: '4px', margin: '8px 0', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: TOKENS.colors.text.muted, marginBottom: '4px' }}>OPERATIONAL CONSTRAINTS VERIFIED</div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                    {opp.constraints_verified.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ fontSize: '12.5px', color: TOKENS.colors.text.primary }}>
                  <strong>Review Action: </strong>
                  {opp.suggested_review}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AGENT 4: PREDICTIVE MAINTENANCE ─────────────────────────────── */}
      {activeTab === 'predictive' && predictions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          <KpiStrip columns={4}>
            <KpiCard
              label="Fleet Looms Evaluated"
              value={`${predictions.total_looms_evaluated} Looms`}
              status="HEALTHY"
              provenance="PREDICTED"
              driver="Model: GradientBoostedTrees_v2"
            />
            <KpiCard
              label="High Failure Risk (> 70%)"
              value={`${predictions.high_risk_count} Looms`}
              status={predictions.high_risk_count > 0 ? 'CRITICAL' : 'HEALTHY'}
              provenance="PREDICTED"
              driver="Flagged for shift pre-inspection"
            />
            <KpiCard
              label="Data Sufficiency Gate"
              value={predictions.data_sufficiency.label}
              status="HEALTHY"
              provenance="ACTUAL"
              driver="31 / 30 Days active history"
            />
            <KpiCard
              label="Revenue Protected"
              value={`₹${predictions.business_impact_metrics.estimated_revenue_protected_inr.toLocaleString()}`}
              status="HEALTHY"
              provenance="ESTIMATED"
              driver="From proactive intervention"
            />
          </KpiStrip>

          {/* Predictive Inferences Table */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 12px 0', color: TOKENS.colors.text.primary }}>
              24-Hour Failure Risk Predictions
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {predictions.predictions.map((p) => (
                <div
                  key={p.loom_id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '4px',
                    border: `1px solid ${TOKENS.colors.surface.border}`,
                    background: TOKENS.colors.surface.cardAlt,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '13px', color: TOKENS.colors.brand[600] }}>Loom {p.loom_no}</strong>
                    <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>({p.loom_type})</span>
                    <StatusBadge status={p.risk_level === 'HIGH' ? 'CRITICAL' : p.risk_level === 'MEDIUM' ? 'WARNING' : 'HEALTHY'} label={p.risk_level} />
                    <span style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>{p.top_factors[0] || 'Nominal telemetry'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>24h Risk: </span>
                      <strong style={{ fontSize: '14px', color: p.breakdown_risk_pct > 60 ? TOKENS.colors.status.critical.text : TOKENS.colors.text.primary, fontFamily: TOKENS.typography.fontMono }}>
                        {p.breakdown_risk_pct}%
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AGENT 5: REVENUE GUARDIAN ───────────────────────────────────── */}
      {activeTab === 'revenue' && revenueGuardian && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          <KpiStrip columns={3}>
            <KpiCard
              label="Target Daily Revenue"
              value={`₹${revenueGuardian.target_revenue_inr.toLocaleString()}`}
              status="HEALTHY"
              provenance="ESTIMATED"
              driver="Based on scheduled meter output"
            />
            <KpiCard
              label="Actual Billable Revenue"
              value={`₹${revenueGuardian.actual_revenue_inr.toLocaleString()}`}
              status="HEALTHY"
              provenance="ESTIMATED"
              driver="Floor output multiplied by rate card"
            />
            <KpiCard
              label="Revenue at Risk / Exposure"
              value={`₹${revenueGuardian.total_revenue_at_risk_inr.toLocaleString()}`}
              status="CRITICAL"
              provenance="ESTIMATED"
              driver={`${revenueGuardian.exposure_share_pct}% shortfall against target`}
            />
          </KpiStrip>

          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '16px 20px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 12px 0', color: TOKENS.colors.text.primary }}>
              Revenue Leakage Causes & Protection
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {revenueGuardian.loss_breakdown.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '4px',
                    border: `1px solid ${TOKENS.colors.surface.border}`,
                    background: TOKENS.colors.surface.cardAlt,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: TOKENS.colors.text.primary }}>{item.category}</span>
                  <strong style={{ fontSize: '14px', color: TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono }}>
                    -₹{item.loss_inr.toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AGENT 6: ACTION MANAGER (CLOSED-LOOP) ────────────────────────── */}
      {activeTab === 'action_manager' && actions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          <KpiStrip columns={4}>
            <KpiCard
              label="Tracked Floor Actions"
              value={`${actions.total_actions} Actions`}
              status="HEALTHY"
              provenance="ACTUAL"
              driver="Assigned to shift supervisors"
            />
            <KpiCard
              label="Open / In Progress"
              value={`${actions.open_actions}`}
              status="WARNING"
              provenance="ACTUAL"
              driver="Awaiting completion"
            />
            <KpiCard
              label="Verified Outcome Improvements"
              value={`${actions.verified_outcomes}`}
              status="HEALTHY"
              provenance="CALCULATED"
              driver={`${actions.verification_rate_pct}% closed-loop verified`}
            />
            <KpiCard
              label="Verified Revenue Recovered"
              value={`₹${actions.verified_financial_savings_inr.toLocaleString()}`}
              status="HEALTHY"
              provenance="CALCULATED"
              driver="Demonstrated output recovery"
            />
          </KpiStrip>

          {/* Action Lifecycle List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {actions.actions.map((act) => (
              <div
                key={act.action_id}
                style={{
                  background: TOKENS.colors.surface.card,
                  border: `1px solid ${TOKENS.colors.surface.border}`,
                  borderRadius: TOKENS.radius.md,
                  padding: '16px 20px',
                  boxShadow: TOKENS.shadows.card,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge status={act.priority === 'P1' ? 'CRITICAL' : 'WARNING'} label={act.priority} />
                    <strong style={{ fontSize: '14px', color: TOKENS.colors.brand[600] }}>Loom {act.loom_no}</strong>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: TOKENS.colors.text.primary }}>{act.issue}</span>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: act.outcome_status === 'VERIFIED_IMPROVED' ? TOKENS.colors.status.healthy.bg : TOKENS.colors.brand[100],
                      color: act.outcome_status === 'VERIFIED_IMPROVED' ? TOKENS.colors.status.healthy.text : TOKENS.colors.brand[700],
                      border: `1px solid ${act.outcome_status === 'VERIFIED_IMPROVED' ? TOKENS.colors.status.healthy.border : TOKENS.colors.brand[500]}`,
                    }}
                  >
                    {act.outcome_status === 'VERIFIED_IMPROVED' ? 'VERIFIED OUTCOME' : act.status}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: TOKENS.colors.text.secondary, marginBottom: '10px' }}>
                  <strong>Recommended Action: </strong>
                  {act.recommended_action}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                  <div>
                    <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted }}>Assignee & Deadline</div>
                    <div style={{ fontSize: '12px', color: TOKENS.colors.text.primary, fontWeight: 600 }}>{act.assignee || 'Unassigned'}</div>
                    <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>{act.deadline || 'Shift 1'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted }}>Before Metric (Baseline)</div>
                    <div style={{ fontSize: '12px', color: TOKENS.colors.status.critical.text, fontWeight: 700 }}>{act.baseline_metric}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted }}>After Metric (Measured)</div>
                    <div style={{ fontSize: '12px', color: TOKENS.colors.status.healthy.text, fontWeight: 700 }}>{act.post_action_metric || 'Pending verification'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', color: TOKENS.colors.text.muted }}>Verified Result</div>
                    <div style={{ fontSize: '12px', color: TOKENS.colors.brand[600], fontWeight: 700 }}>{act.actual_improvement || 'Awaiting shift close'}</div>
                  </div>
                </div>

                {act.action_taken && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: TOKENS.colors.text.muted }}>
                    <strong>Floor Action Taken: </strong>
                    {act.action_taken}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Contextual AI Drawer ────────────────────────────────────────── */}
      <ContextualAiDrawer
        isOpen={drawerContext !== null}
        onClose={() => setDrawerContext(null)}
        context={drawerContext}
        onAssignAction={(_ctx) => {
          setActiveTab('action_manager');
        }}
      />
    </div>
  );
}
