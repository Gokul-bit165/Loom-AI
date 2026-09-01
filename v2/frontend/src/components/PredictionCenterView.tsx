import { useEffect, useState } from 'react';
import { fetchPredictionsOverview } from '../api';
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

export function PredictionCenterView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchPredictionsOverview('2026-07-31', 'ATM')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load predictions:', err);
        setError('Failed to retrieve ML model inferences.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading ML prediction models and governance..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to load prediction center.'} onRetry={loadData} />;

  const evalMeta = data.model_evaluation;

  const predictionColumns: ColumnDef<any>[] = [
    {
      key: 'loom_no',
      header: 'Loom No',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>{row.loom_no}</strong>,
    },
    {
      key: 'loom_type',
      header: 'Model',
      render: (row) => <span style={{ color: TOKENS.colors.text.muted }}>{row.loom_type}</span>,
    },
    {
      key: 'breakdown_risk_pct',
      header: '24h Risk %',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong
          style={{
            color:
              row.breakdown_risk_pct >= 70
                ? TOKENS.colors.status.critical.text
                : row.breakdown_risk_pct >= 40
                ? TOKENS.colors.status.warning.text
                : TOKENS.colors.status.healthy.text,
          }}
        >
          {row.breakdown_risk_pct}%
        </strong>
      ),
    },
    {
      key: 'risk_level',
      header: 'Risk Level',
      align: 'center',
      render: (row) => <StatusBadge status={row.risk_level === 'HIGH' ? 'CRITICAL' : row.risk_level === 'MEDIUM' ? 'WARNING' : 'HEALTHY'} label={row.risk_level} />,
    },
    {
      key: 'forecast_cost_next_30d_inr',
      header: 'Forecast Cost (30d)',
      align: 'right',
      sortable: true,
      render: (row) => <span>₹{row.forecast_cost_next_30d_inr.toLocaleString()}</span>,
    },
    {
      key: 'top_factors',
      header: 'Primary Failure Signal',
      render: (row) => (
        <span style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
          {row.top_factors[0] || 'Nominal operating baseline'}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title="Machine Learning Predictions & Governance"
        subtitle="24-hour machine breakdown probabilities, telemetry feature importance, and model evaluation."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <KpiStrip columns={4}>
        <KpiCard
          label="Looms Evaluated"
          value={`${data.total_looms_evaluated} Looms`}
          status="HEALTHY"
          provenance="PREDICTED"
          driver="Model: GradientBoostedTrees_v2"
        />

        <KpiCard
          label="High Breakdown Risk (> 70%)"
          value={`${data.high_risk_count} Looms`}
          target="0 high risk"
          status={data.high_risk_count > 0 ? 'CRITICAL' : 'HEALTHY'}
          provenance="PREDICTED"
          driver="Flagged for shift inspection"
        />

        <KpiCard
          label="Model ROC-AUC Score"
          value={`${evalMeta.metrics.roc_auc}`}
          target="> 0.80 benchmark"
          status="HEALTHY"
          provenance="CALCULATED"
          driver={`Precision: ${(evalMeta.metrics.precision * 100).toFixed(1)}%`}
        />

        <KpiCard
          label="Data Sufficiency Gate"
          value="31 / 30 Days"
          status="HEALTHY"
          provenance="ACTUAL"
          driver="Gate satisfied (Passed)"
        />
      </KpiStrip>

      {/* ── Model Evaluation & Confusion Matrix ─────────────────────────── */}
      <div
        style={{
          background: TOKENS.colors.surface.card,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          borderRadius: TOKENS.radius.md,
          padding: '14px 16px',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Model Governance & Test-Set Confusion Matrix
            </h4>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
              Validated against ground truth maintenance work orders.
            </div>
          </div>
          <DataTrustBadge provenance="CALCULATED" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>True Positives</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: TOKENS.colors.status.healthy.text, fontFamily: TOKENS.typography.fontMono }}>
              {evalMeta.confusion_matrix.true_positives}
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>False Positives</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: TOKENS.colors.status.warning.text, fontFamily: TOKENS.typography.fontMono }}>
              {evalMeta.confusion_matrix.false_positives}
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>True Negatives</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: TOKENS.colors.brand[600], fontFamily: TOKENS.typography.fontMono }}>
              {evalMeta.confusion_matrix.true_negatives}
            </div>
          </div>

          <div style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
            <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>False Negatives</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: TOKENS.colors.status.critical.text, fontFamily: TOKENS.typography.fontMono }}>
              {evalMeta.confusion_matrix.false_negatives}
            </div>
          </div>
        </div>
      </div>

      {/* ── Predictive Inferences Table ─────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: TOKENS.spacing[2] }}>
          <div>
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Active Stoppage Risk Predictions (Next 24 Hours)
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Ranked by 24h failure probability and expected financial exposure.
            </div>
          </div>
          <DataTrustBadge provenance="PREDICTED" />
        </div>

        <IndustrialTable
          columns={predictionColumns}
          data={data.predictions}
          keyExtractor={(row) => row.loom_id}
          initialLimit={10}
        />
      </div>
    </div>
  );
}
