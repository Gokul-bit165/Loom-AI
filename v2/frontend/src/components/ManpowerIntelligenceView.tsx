import { useEffect, useState } from 'react';
import { fetchManpowerAnalytics } from '../api';
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

export function ManpowerIntelligenceView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchManpowerAnalytics('2026-07-31', 'ATM')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load manpower data:', err);
        setError('Failed to retrieve operator attendance roster.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading manpower & attendance telemetry..." />;
  if (error || !data) return <ErrorState message={error || 'Unable to load manpower data.'} onRetry={loadData} />;

  const weaverColumns: ColumnDef<any>[] = [
    {
      key: 'name',
      header: 'Weaver Name',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.text.primary }}>{row.name}</strong>,
    },
    {
      key: 'employee_code',
      header: 'Emp Code',
      render: (row) => <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>{row.employee_code}</span>,
    },
    {
      key: 'grade',
      header: 'Grade',
      align: 'center',
      render: (row) => (
        <span style={{ fontSize: '11px', background: '#F3F4F6', color: TOKENS.colors.text.secondary, padding: '2px 6px', borderRadius: '3px' }}>
          {row.grade}
        </span>
      ),
    },
    {
      key: 'assigned_looms',
      header: 'Looms',
      align: 'right',
      render: (row) => <span>{row.assigned_looms} Looms</span>,
    },
    {
      key: 'metres_produced',
      header: 'Metres Woven',
      align: 'right',
      sortable: true,
      render: (row) => <span>{row.metres_produced.toLocaleString()} m</span>,
    },
    {
      key: 'actual_efficiency_pct',
      header: 'Actual Eff %',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: row.actual_efficiency_pct >= row.std_efficiency_pct ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.critical.text }}>
          {row.actual_efficiency_pct}%
        </strong>
      ),
    },
    {
      key: 'std_efficiency_pct',
      header: 'Benchmark %',
      align: 'right',
      render: (row) => <span style={{ color: TOKENS.colors.text.muted }}>{row.std_efficiency_pct}%</span>,
    },
    {
      key: 'weaver_index',
      header: 'Weaver Index',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ color: (row.weaver_index || 1) >= 1.0 ? TOKENS.colors.status.healthy.text : TOKENS.colors.status.critical.text }}>
          {row.weaver_index ? row.weaver_index.toFixed(3) : '—'}
        </strong>
      ),
    },
    {
      key: 'performance_status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.performance_status} />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title="Manpower & Weaver Intelligence (Q8–Q11)"
        subtitle="Shift attendance roster, operator efficiency index, absenteeism capacity shortage model, and grade allocation matrix."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <KpiStrip columns={4}>
        <KpiCard
          label="Active Headcount"
          value={`${data.present_count} / ${data.total_roster_headcount}`}
          unit="weavers"
          status={data.overall_attendance_pct >= 92 ? 'HEALTHY' : 'WARNING'}
          provenance="ACTUAL"
          driver={`Attendance: ${data.overall_attendance_pct}%`}
        />

        <KpiCard
          label="Absenteeism Shortage"
          value={`${data.absent_count}`}
          unit="weavers"
          target="0 absent"
          status={data.absent_count > 3 ? 'CRITICAL' : 'WARNING'}
          provenance="ACTUAL"
          driver={`${data.absent_count * 6} looms understaffed`}
        />

        <KpiCard
          label="Shortage Production Loss"
          value={`${data.total_manpower_shortage_metres.toLocaleString()} m`}
          status="CRITICAL"
          provenance="ESTIMATED"
          driver={`Loss: ₹${data.total_manpower_shortage_revenue_loss_rs.toLocaleString()}`}
        />

        <KpiCard
          label="Standard Allotment"
          value="6 Looms / Weaver"
          status="HEALTHY"
          provenance="ACTUAL"
          driver="G1+ Benchmark: 92.5% Eff"
        />
      </KpiStrip>

      {/* ── Q8: Shift Attendance Distribution ──────────────────────────── */}
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
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Shift Attendance Distribution (Q8)
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Roll-call attendance across shifts with estimated capacity shortage impact.
            </div>
          </div>
          <DataTrustBadge provenance="ACTUAL" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
          {data.shift_attendance.map((s: any) => (
            <div
              key={s.shift_id}
              style={{
                background: TOKENS.colors.surface.cardAlt,
                padding: '12px',
                borderRadius: TOKENS.radius.sm,
                border: s.attendance_pct >= 90 ? `1px solid ${TOKENS.colors.surface.border}` : '1px solid #FECACA',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ color: TOKENS.colors.text.primary, fontSize: '13px' }}>Shift {s.shift_code}</strong>
                <StatusBadge status={s.attendance_pct >= 90 ? 'HEALTHY' : 'CRITICAL'} label={`${s.attendance_pct}% ATTENDANCE`} />
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted, marginBottom: '2px' }}>
                Present: <strong style={{ color: TOKENS.colors.text.primary }}>{s.present_count}</strong> / {s.total_headcount} weavers
              </div>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted, marginBottom: '6px' }}>
                Shortage: <strong style={{ color: s.shortage_weavers > 0 ? TOKENS.colors.status.critical.text : TOKENS.colors.status.healthy.text }}>{s.shortage_weavers} operators</strong>
              </div>
              <div style={{ borderTop: `1px solid ${TOKENS.colors.surface.border}`, paddingTop: '4px', fontSize: '11px', color: TOKENS.colors.text.secondary }}>
                Output Deficit: <strong style={{ color: TOKENS.colors.status.critical.text }}>{s.estimated_loss_metres.toLocaleString()} m</strong> (-₹{s.estimated_loss_rs.toLocaleString()})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Q9: Weaver Performance Index Table ─────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: TOKENS.spacing[2] }}>
          <div>
            <h3 style={{ fontSize: TOKENS.typography.sizes.sectionHeading, fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Weaver Performance & Efficiency Index (Q9)
            </h3>
            <div style={{ fontSize: TOKENS.typography.sizes.metadata, color: TOKENS.colors.text.muted }}>
              Formula: <code style={{ color: TOKENS.colors.brand[700] }}>Weaver Index = Actual Efficiency % / Grade Standard %</code>
            </div>
          </div>
          <DataTrustBadge provenance="CALCULATED" />
        </div>

        <IndustrialTable
          columns={weaverColumns}
          data={data.top_performing_weavers.concat(data.bottom_performing_weavers)}
          keyExtractor={(row) => row.employee_id}
          initialLimit={8}
        />
      </div>

      {/* ── Q11: Grade Matrix ──────────────────────────────────────────── */}
      <div
        style={{
          background: TOKENS.colors.surface.card,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          borderRadius: TOKENS.radius.md,
          padding: '14px 16px',
          boxShadow: TOKENS.shadows.card,
        }}
      >
        <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 10px 0', color: TOKENS.colors.text.primary }}>
          Operator Grade & Work Allotment Matrix (Q11)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {data.grade_allotment_matrix.map((g: any, idx: number) => (
            <div key={idx} style={{ background: TOKENS.colors.surface.cardAlt, padding: '10px 12px', borderRadius: TOKENS.radius.sm, border: `1px solid ${TOKENS.colors.surface.border}` }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: TOKENS.colors.brand[600] }}>{g.grade} — {g.label}</div>
              <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                Standard Load: <strong style={{ color: TOKENS.colors.text.primary }}>{g.std_looms} Looms</strong>
              </div>
              <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted }}>
                Benchmark Eff: <strong style={{ color: TOKENS.colors.status.healthy.text }}>{g.std_eff_pct}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
