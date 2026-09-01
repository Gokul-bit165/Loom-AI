import { useEffect, useState } from 'react';
import {
  fetchWorkforceOverview,
  fetchWorkforceEmployees,
  fetchPromotionReadyCandidates,
  fetchLoomCapabilityMatrix,
  fetchGradeAlignmentMismatches,
  fetchPayProgression,
  fetchTrainingQueue,
} from '../api';
import type {
  EmployeeWorkforceItem,
  WorkforceOverviewResponse,
  LoomCapabilityMatrixResponse,
  GradeAlignmentResponse,
  PayProgressionResponse,
  TrainingQueueResponse,
} from '../api';
import {
  PageHeader,
  FilterBar,
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
import { EmployeeProfileDrawer } from './EmployeeProfileDrawer';
import {
  Users,
  Award,
  Layers,
  IndianRupee,
  BookOpen,
  ArrowRight,
  SlidersHorizontal,
  Search,
} from 'lucide-react';

export function WorkforceIntelligenceView() {
  const [activeTab, setActiveTab] = useState<
    'PROMOTION' | 'CAPABILITY' | 'ALIGNMENT' | 'PAY' | 'TRAINING' | 'ROSTER'
  >('PROMOTION');

  // Overview data
  const [overview, setOverview] = useState<WorkforceOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab-specific datasets
  const [promotionData, setPromotionData] = useState<EmployeeWorkforceItem[]>([]);
  const [capabilityData, setCapabilityData] = useState<LoomCapabilityMatrixResponse | null>(null);
  const [alignmentData, setAlignmentData] = useState<GradeAlignmentResponse | null>(null);
  const [payData, setPayData] = useState<PayProgressionResponse | null>(null);
  const [trainingData, setTrainingData] = useState<TrainingQueueResponse | null>(null);
  const [allEmployees, setAllEmployees] = useState<EmployeeWorkforceItem[]>([]);

  // Filters for Roster tab
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [capabilityFilter, setCapabilityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected employee for 360° Profile Drawer
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWorkforceItem | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, prom, cap, align, pay, train, empList] = await Promise.all([
        fetchWorkforceOverview(),
        fetchPromotionReadyCandidates(),
        fetchLoomCapabilityMatrix(),
        fetchGradeAlignmentMismatches(),
        fetchPayProgression(),
        fetchTrainingQueue(),
        fetchWorkforceEmployees(),
      ]);

      setOverview(ov);
      setPromotionData(prom.candidates);
      setCapabilityData(cap);
      setAlignmentData(align);
      setPayData(pay);
      setTrainingData(train);
      setAllEmployees(empList.employees);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to load workforce intelligence data:', err);
      setError(err.message || 'Failed to retrieve workforce datasets.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleDecisionUpdated = (empNo: string | number, review: any) => {
    // Update locally in employee lists
    setAllEmployees((prev) =>
      prev.map((e) => (String(e.emp_no) === String(empNo) ? { ...e, management_review: review } : e))
    );
    setPromotionData((prev) =>
      prev.map((e) => (String(e.emp_no) === String(empNo) ? { ...e, management_review: review } : e))
    );
    if (selectedEmployee && String(selectedEmployee.emp_no) === String(empNo)) {
      setSelectedEmployee((prev) => (prev ? { ...prev, management_review: review } : null));
    }
  };

  if (loading) return <LoadingState message="Loading Weaving Workforce Intelligence (Grade, Skill & Pay Progression)..." />;
  if (error || !overview) return <ErrorState message={error || 'Unable to load workforce dataset.'} onRetry={loadAllData} />;

  // Columns for Promotion Readiness
  const promotionColumns: ColumnDef<EmployeeWorkforceItem>[] = [
    {
      key: 'rank',
      header: 'Rank',
      width: '45px',
      align: 'center',
      render: (row) => (
        <strong style={{ color: TOKENS.colors.brand[600], fontFamily: TOKENS.typography.fontMono }}>
          #{row.rank || row.s_no}
        </strong>
      ),
    },
    {
      key: 'name',
      header: 'Employee Candidate',
      render: (row) => (
        <div style={{ cursor: 'pointer' }} onClick={() => setSelectedEmployee(row)}>
          <div style={{ fontWeight: 700, color: TOKENS.colors.text.primary, fontSize: '12.5px' }}>
            {row.name}
          </div>
          <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
            EMP #{row.emp_no} · {row.desig} · {row.dept}
          </div>
        </div>
      ),
    },
    {
      key: 'grade',
      header: 'Current Grade',
      align: 'center',
      render: (row) => (
        <span style={{ fontSize: '11.5px', fontWeight: 700, background: '#F1F5F9', padding: '2px 7px', borderRadius: '4px', color: TOKENS.colors.text.primary }}>
          {row.grade}
        </span>
      ),
    },
    {
      key: 'pds',
      header: 'Current PDS',
      align: 'right',
      sortable: true,
      render: (row) => (
        <strong style={{ fontFamily: TOKENS.typography.fontMono, color: TOKENS.colors.text.primary }}>
          ₹{row.pds}
        </strong>
      ),
    },
    {
      key: 'looms_count',
      header: 'Loom Capability',
      align: 'center',
      render: (row) => (
        <span style={{ fontSize: '11.5px', fontWeight: 600, color: row.looms_count >= 8 ? '#059669' : TOKENS.colors.text.primary }}>
          {row.looms_count > 0 ? `${row.looms_count} Looms (${row.target_eff_pct}%)` : 'Support'}
        </span>
      ),
    },
    {
      key: 'observed_qualification',
      header: 'Performance Qualification',
      render: (row) => (
        <span style={{ fontSize: '11.5px', color: TOKENS.colors.status.healthy.text, fontWeight: 600 }}>
          {row.observed_qualification}
        </span>
      ),
    },
    {
      key: 'tenure_years',
      header: 'Tenure',
      align: 'right',
      sortable: true,
      render: (row) => <span>{row.tenure_years} yrs</span>,
    },
    {
      key: 'progression_status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.progression_status === 'READY FOR REVIEW' ? 'HEALTHY' : 'WARNING'} label={row.progression_status} />,
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setSelectedEmployee(row)}
          className="btn-secondary"
          style={{ fontSize: '11px', padding: '3px 8px' }}
        >
          <span>Review</span>
          <ArrowRight size={11} />
        </button>
      ),
    },
  ];

  // Columns for All Employees Roster
  const rosterColumns: ColumnDef<EmployeeWorkforceItem>[] = [
    {
      key: 'emp_no',
      header: 'Emp No',
      width: '60px',
      sortable: true,
      render: (row) => <strong style={{ color: TOKENS.colors.brand[600], fontFamily: TOKENS.typography.fontMono }}>#{row.emp_no}</strong>,
    },
    {
      key: 'name',
      header: 'Employee Name',
      sortable: true,
      render: (row) => (
        <div style={{ cursor: 'pointer' }} onClick={() => setSelectedEmployee(row)}>
          <div style={{ fontWeight: 600, color: TOKENS.colors.text.primary, fontSize: '12.5px' }}>{row.name}</div>
          <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>{row.desig} · {row.gender}</div>
        </div>
      ),
    },
    {
      key: 'dept',
      header: 'Department',
      render: (row) => <span style={{ fontSize: '11.5px', color: TOKENS.colors.text.secondary }}>{row.dept}</span>,
    },
    {
      key: 'grade',
      header: 'Grade',
      align: 'center',
      render: (row) => (
        <span style={{ fontSize: '11px', fontWeight: 700, background: '#F3F4F6', padding: '2px 6px', borderRadius: '3px' }}>
          {row.grade}
        </span>
      ),
    },
    {
      key: 'pds',
      header: 'Daily PDS',
      align: 'right',
      sortable: true,
      render: (row) => <strong style={{ fontFamily: TOKENS.typography.fontMono }}>₹{row.pds}</strong>,
    },
    {
      key: 'capability',
      header: 'Loom Load / Criteria',
      render: (row) => <span style={{ fontSize: '11.5px' }}>{row.capability || 'Technical / Support'}</span>,
    },
    {
      key: 'doj',
      header: 'Joining Date',
      render: (row) => <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>{row.doj}</span>,
    },
    {
      key: 'alignment_status',
      header: 'Grade Alignment',
      align: 'center',
      render: (row) => (
        <StatusBadge
          status={
            row.alignment_status === 'POTENTIAL UNDER-GRADED'
              ? 'WARNING'
              : row.alignment_status === 'REVIEW REQUIRED'
              ? 'CRITICAL'
              : 'HEALTHY'
          }
          label={row.alignment_status}
        />
      ),
    },
    {
      key: 'action',
      header: 'Profile',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setSelectedEmployee(row)}
          className="btn-secondary"
          style={{ fontSize: '11px', padding: '2px 7px' }}
        >
          View
        </button>
      ),
    },
  ];

  // Filtered Roster
  const filteredRoster = allEmployees.filter((e) => {
    const matchDept = deptFilter === 'ALL' || e.dept === deptFilter;
    const matchGrade = gradeFilter === 'ALL' || e.grade === gradeFilter;
    const matchCap =
      capabilityFilter === 'ALL' ||
      (capabilityFilter === '8' && e.looms_count === 8) ||
      (capabilityFilter === '7' && e.looms_count === 7) ||
      (capabilityFilter === '6' && e.looms_count === 6) ||
      (capabilityFilter === '5' && e.looms_count === 5) ||
      (capabilityFilter === '4' && e.looms_count === 4);
    const matchStatus = statusFilter === 'ALL' || e.progression_status === statusFilter;
    const matchSearch =
      !searchQuery ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(e.emp_no).includes(searchQuery);
    return matchDept && matchGrade && matchCap && matchStatus && matchSearch;
  });

  const m = overview.metrics;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title="Weaving Workforce Intelligence"
        subtitle="Fair, evidence-based decision support for employee grade, loom capability, and pay progression."
        unit="ATM Main Shed & Weaving Division"
        date="01-Jul-2026"
      />

      {/* ── Executive Progression KPI Strip ───────────────────────────── */}
      <KpiStrip columns={5}>
        <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('ROSTER')}>
          <KpiCard
            label="Employees Reviewed"
            value={`${m.employees_reviewed}`}
            unit="personnel"
            status="HEALTHY"
            provenance="ACTUAL"
            driver="100% verified from Excel registry"
          />
        </div>

        <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('PROMOTION')}>
          <KpiCard
            label="Promotion Ready"
            value={`${m.promotion_ready_count}`}
            unit="candidates"
            status={m.promotion_ready_count > 0 ? 'HEALTHY' : 'DISABLED'}
            provenance="CALCULATED"
            driver="Demonstrating next-grade capability"
          />
        </div>

        <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('ALIGNMENT')}>
          <KpiCard
            label="Grade Review Required"
            value={`${m.grade_review_required_count}`}
            unit="mismatches"
            status={m.grade_review_required_count > 0 ? 'WARNING' : 'HEALTHY'}
            provenance="CALCULATED"
            driver={`${m.potential_undergraded_count} undergraded · ${m.review_required_count} need evidence`}
          />
        </div>

        <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('TRAINING')}>
          <KpiCard
            label="Training Required"
            value={`${m.training_required_count}`}
            unit="trainees"
            status="WARNING"
            provenance="ACTUAL"
            driver="4-loom trainees & upskilling queue"
          />
        </div>

        <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('CAPABILITY')}>
          <KpiCard
            label="High-Capability Handlers"
            value={`${m.high_capability_count}`}
            unit="weavers"
            status="HEALTHY"
            provenance="ACTUAL"
            driver="8-Looms + 97.5% master weavers"
          />
        </div>
      </KpiStrip>

      {/* ── Tab Navigation Bar ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: `1px solid ${TOKENS.colors.surface.border}`,
          paddingBottom: '2px',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveTab('PROMOTION')}
          className={activeTab === 'PROMOTION' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <Award size={14} />
          <span>Promotion Readiness ({promotionData.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CAPABILITY')}
          className={activeTab === 'CAPABILITY' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <Layers size={14} />
          <span>Loom Handling Capability</span>
        </button>

        <button
          onClick={() => setActiveTab('ALIGNMENT')}
          className={activeTab === 'ALIGNMENT' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <SlidersHorizontal size={14} />
          <span>Grade Alignment Mismatch ({m.grade_review_required_count})</span>
        </button>

        <button
          onClick={() => setActiveTab('PAY')}
          className={activeTab === 'PAY' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <IndianRupee size={14} />
          <span>Pay & PDS Progression</span>
        </button>

        <button
          onClick={() => setActiveTab('TRAINING')}
          className={activeTab === 'TRAINING' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <BookOpen size={14} />
          <span>Skill Development Queue ({trainingData?.queue_count || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('ROSTER')}
          className={activeTab === 'ROSTER' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <Users size={14} />
          <span>Full Workforce Roster (137)</span>
        </button>
      </div>

      {/* ── Tab 1: Promotion Readiness ─────────────────────────────────── */}
      {activeTab === 'PROMOTION' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[3] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                Promotion & Grade Readiness — "Who Is Ready for Progression?"
              </h3>
              <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted }}>
                Ranked evaluation of operators demonstrating machine capability, efficiency standards, and tenure for grade upgrade.
              </div>
            </div>
            <DataTrustBadge provenance="CALCULATED" />
          </div>

          <IndustrialTable
            columns={promotionColumns}
            data={promotionData}
            keyExtractor={(row) => String(row.emp_no)}
            initialLimit={10}
          />

          {/* Configured Grade Structure Ladder */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              marginTop: '8px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px 0', color: TOKENS.colors.text.primary }}>
              Configured Grade Structure & Capability Progression Ladder
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {overview.configured_grade_structure.map((cg, idx) => (
                <div
                  key={idx}
                  style={{
                    background: TOKENS.colors.surface.cardAlt,
                    padding: '10px 12px',
                    borderRadius: TOKENS.radius.sm,
                    border: `1px solid ${TOKENS.colors.surface.border}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: TOKENS.colors.brand[700], fontSize: '13px' }}>{cg.grade}</strong>
                    <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>₹{cg.standard_pds} PDS</span>
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: TOKENS.colors.text.primary, marginTop: '2px' }}>
                    {cg.capability}
                  </div>
                  <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                    {cg.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Loom Handling Capability ───────────────────────────── */}
      {activeTab === 'CAPABILITY' && capabilityData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[3] }}>
          <div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Loom Handling Capability Matrix — "Who Can Handle More Machines?"
            </h3>
            <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted }}>
              Workforce distribution partitioned strictly by demonstrated machine handling capacity.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
            {Object.entries(capabilityData.groups).map(([key, grp]) => (
              <div
                key={key}
                style={{
                  background: TOKENS.colors.surface.card,
                  border: `1px solid ${TOKENS.colors.surface.border}`,
                  borderRadius: TOKENS.radius.md,
                  padding: '14px 16px',
                  boxShadow: TOKENS.shadows.card,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: TOKENS.colors.brand[700] }}>
                      {grp.title}
                    </h4>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1px 6px', borderRadius: '3px' }}>
                      {grp.count} Weavers
                    </span>
                  </div>

                  <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginBottom: '10px', display: 'flex', gap: '10px' }}>
                    <span>Standard: <strong>{grp.standard_grade}</strong></span>
                    <span>Target Eff: <strong>{grp.benchmark_eff}</strong></span>
                    <span>Base PDS: <strong>₹{grp.standard_pds}</strong></span>
                  </div>

                  {/* Sample employees in group */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                    {grp.employees.slice(0, 6).map((emp) => (
                      <div
                        key={emp.emp_no}
                        onClick={() => setSelectedEmployee(emp)}
                        style={{
                          background: TOKENS.colors.surface.cardAlt,
                          padding: '6px 8px',
                          borderRadius: '4px',
                          border: `1px solid ${TOKENS.colors.surface.border}`,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '11.5px',
                        }}
                      >
                        <div>
                          <strong>{emp.name}</strong> <span style={{ color: TOKENS.colors.text.muted }}>(#{emp.emp_no})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: TOKENS.colors.text.muted }}>₹{emp.pds}</span>
                          <StatusBadge status={emp.grade === grp.standard_grade ? 'HEALTHY' : 'WARNING'} label={emp.grade} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {grp.count > 6 && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: TOKENS.colors.text.muted, textAlign: 'center' }}>
                    + {grp.count - 6} more operators in this tier
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 3: Grade Alignment & Mismatch Detection ─────────────────── */}
      {activeTab === 'ALIGNMENT' && alignmentData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          <div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Grade–Capability Alignment & Evidence Review
            </h3>
            <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted }}>
              Objective anomaly detection identifying operators whose machine capability exceeds or requires verification against current grade.
            </div>
          </div>

          {/* Category A: Potential Under-graded */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: '1px solid #BFDBFE',
              borderLeft: '3px solid #2563EB',
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.brand[700] }}>
                  Category A: {alignmentData.category_a.label} ({alignmentData.category_a.count} Employees)
                </h4>
                <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                  {alignmentData.category_a.description}
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', background: '#DBEAFE', padding: '2px 8px', borderRadius: '4px' }}>
                PRIORITY REVIEW
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {alignmentData.category_a.employees.map((emp) => (
                <div
                  key={emp.emp_no}
                  onClick={() => setSelectedEmployee(emp)}
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${TOKENS.colors.surface.border}`,
                    borderRadius: '4px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '12.5px', color: TOKENS.colors.text.primary }}>{emp.name}</strong>
                    <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>#{emp.emp_no}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                    Current: <strong>{emp.grade}</strong> (₹{emp.pds} PDS) · Handles <strong>{emp.looms_count} Looms</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '4px', fontWeight: 600 }}>
                    → {emp.recommended_action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category B: Review Required */}
          <div
            style={{
              background: TOKENS.colors.surface.card,
              border: '1px solid #FDE68A',
              borderLeft: '3px solid #D97706',
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: '#92400E' }}>
                  Category B: {alignmentData.category_b.label} ({alignmentData.category_b.count} Employees)
                </h4>
                <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary }}>
                  {alignmentData.category_b.description}
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', background: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                MONITORING
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {alignmentData.category_b.employees.map((emp) => (
                <div
                  key={emp.emp_no}
                  onClick={() => setSelectedEmployee(emp)}
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${TOKENS.colors.surface.border}`,
                    borderRadius: '4px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '12.5px', color: TOKENS.colors.text.primary }}>{emp.name}</strong>
                    <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>#{emp.emp_no}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: TOKENS.colors.text.muted, marginTop: '2px' }}>
                    Current Grade: <strong>{emp.grade}</strong> · Recorded Load: <strong>{emp.looms_count} Looms</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#D97706', marginTop: '4px', fontWeight: 600 }}>
                    → {emp.recommended_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: Pay & PDS Progression Simulator ────────────────────── */}
      {activeTab === 'PAY' && payData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          <div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Pay & PDS Progression Simulator
            </h3>
            <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted }}>
              Financial modeling of proposed grade adjustments and budget impact across Ashok Textile Mills.
            </div>
          </div>

          {/* Financial summary strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              boxShadow: TOKENS.shadows.card,
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Eligible Candidates</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TOKENS.colors.brand[700] }}>
                {payData.candidate_count} Employees
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Daily Budget Delta</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TOKENS.colors.text.primary }}>
                +₹{payData.financial_summary.daily_increment_budget_rs.toLocaleString()} / day
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Monthly Increment Impact</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>
                +₹{payData.financial_summary.monthly_increment_budget_rs.toLocaleString()} / mo
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Annualized Investment</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TOKENS.colors.brand[600] }}>
                ₹{payData.financial_summary.annual_investment_rs.toLocaleString()} / yr
              </div>
            </div>
          </div>

          <IndustrialTable
            columns={[
              {
                key: 'emp_no',
                header: 'Emp No',
                width: '60px',
                render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>#{row.emp_no}</strong>,
              },
              {
                key: 'name',
                header: 'Candidate Name',
                render: (row) => (
                  <div style={{ cursor: 'pointer' }} onClick={() => setSelectedEmployee(row)}>
                    <strong>{row.name}</strong>
                    <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>{row.dept} · {row.desig}</div>
                  </div>
                ),
              },
              {
                key: 'grade',
                header: 'Current Grade',
                align: 'center',
                render: (row) => <span>{row.grade}</span>,
              },
              {
                key: 'pds',
                header: 'Current PDS',
                align: 'right',
                render: (row) => <span>₹{row.pds}</span>,
              },
              {
                key: 'proposed_grade',
                header: 'Proposed Grade',
                align: 'center',
                render: (row) => <strong style={{ color: '#059669' }}>{row.proposed_grade}</strong>,
              },
              {
                key: 'potential_revised_pds',
                header: 'Proposed PDS',
                align: 'right',
                render: (row) => (
                  <strong style={{ color: '#059669', fontFamily: TOKENS.typography.fontMono }}>
                    ₹{row.potential_revised_pds}
                  </strong>
                ),
              },
              {
                key: 'increment_display',
                header: 'Increment',
                align: 'right',
                render: (row) => <span>{row.increment_display}</span>,
              },
              {
                key: 'action',
                header: 'Action',
                align: 'right',
                render: (row) => (
                  <button onClick={() => setSelectedEmployee(row)} className="btn-secondary" style={{ fontSize: '11px', padding: '3px 8px' }}>
                    Review
                  </button>
                ),
              },
            ]}
            data={payData.candidates}
            keyExtractor={(row) => String(row.emp_no)}
            initialLimit={8}
          />
        </div>
      )}

      {/* ── Tab 5: Skill Development Queue ────────────────────────────── */}
      {activeTab === 'TRAINING' && trainingData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4] }}>
          <div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              Skill Development & Training Queue
            </h3>
            <div style={{ fontSize: '12px', color: TOKENS.colors.text.muted }}>
              Structured queue of trainee weavers and developing operators advancing toward next machine tier.
            </div>
          </div>

          <IndustrialTable
            columns={[
              {
                key: 'emp_no',
                header: 'Emp No',
                width: '60px',
                render: (row) => <strong style={{ color: TOKENS.colors.brand[600] }}>#{row.emp_no}</strong>,
              },
              {
                key: 'name',
                header: 'Operator Name',
                render: (row) => (
                  <div style={{ cursor: 'pointer' }} onClick={() => setSelectedEmployee(row)}>
                    <strong>{row.name}</strong>
                    <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>{row.dept} · {row.desig}</div>
                  </div>
                ),
              },
              {
                key: 'grade',
                header: 'Grade',
                align: 'center',
                render: (row) => <span>{row.grade}</span>,
              },
              {
                key: 'looms_count',
                header: 'Current Load',
                align: 'center',
                render: (row) => <span>{row.looms_count} Looms</span>,
              },
              {
                key: 'training_gap',
                header: 'Identified Capability Gap',
                render: (row) => <span style={{ color: TOKENS.colors.text.primary, fontWeight: 500 }}>{row.training_gap}</span>,
              },
              {
                key: 'recommended_action',
                header: 'Suggested Training Module',
                render: (row) => <span style={{ color: '#2563EB', fontSize: '11.5px' }}>{row.recommended_action}</span>,
              },
              {
                key: 'action',
                header: 'Action',
                align: 'right',
                render: (row) => (
                  <button onClick={() => setSelectedEmployee(row)} className="btn-secondary" style={{ fontSize: '11px', padding: '3px 8px' }}>
                    Dossier
                  </button>
                ),
              },
            ]}
            data={trainingData.queue}
            keyExtractor={(row) => String(row.emp_no)}
            initialLimit={8}
          />
        </div>
      )}

      {/* ── Tab 6: Full Workforce Roster ───────────────────────────────── */}
      {activeTab === 'ROSTER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[3] }}>
          <FilterBar
            filters={[
              {
                id: 'dept',
                label: 'Department',
                value: deptFilter,
                options: [
                  { label: 'All Departments (10)', value: 'ALL' },
                  { label: 'Airjet Weaving (57)', value: 'AIRJET WEAVING' },
                  { label: 'Warehouse & Vendor (30)', value: 'WAREHOUSE & VENDOR' },
                  { label: 'Sulzer Weaving (15)', value: 'SULZER WEAVING' },
                  { label: 'Maintenance (11)', value: 'MAINTENANCE M/C' },
                  { label: 'Housekeeping (6)', value: 'HOUSE KEEPING' },
                  { label: 'Loading / Unloading (5)', value: 'LOADING & UNLOADING' },
                  { label: 'Knotting (4)', value: 'KNOTTING' },
                  { label: 'Electrical (3)', value: 'ELECTRICAL' },
                  { label: 'Gaiting (3)', value: 'GAITING' },
                  { label: 'Training (3)', value: 'TRAINING' },
                ],
                onChange: setDeptFilter,
              },
              {
                id: 'grade',
                label: 'Grade',
                value: gradeFilter,
                options: [
                  { label: 'All Grades', value: 'ALL' },
                  { label: 'G1+', value: 'G1+' },
                  { label: 'G1', value: 'G1' },
                  { label: 'G2', value: 'G2' },
                  { label: 'G2+', value: 'G2+' },
                  { label: 'G3 / G3+', value: 'G3' },
                  { label: 'G4', value: 'G4' },
                ],
                onChange: setGradeFilter,
              },
              {
                id: 'capability',
                label: 'Loom Capacity',
                value: capabilityFilter,
                options: [
                  { label: 'All Loads', value: 'ALL' },
                  { label: '8 Looms', value: '8' },
                  { label: '7 Looms', value: '7' },
                  { label: '6 Looms', value: '6' },
                  { label: '5 Looms', value: '5' },
                  { label: '4 Looms (Trainee)', value: '4' },
                ],
                onChange: setCapabilityFilter,
              },
              {
                id: 'status',
                label: 'Progression Status',
                value: statusFilter,
                options: [
                  { label: 'All Statuses', value: 'ALL' },
                  { label: 'READY FOR REVIEW', value: 'READY FOR REVIEW' },
                  { label: 'STRONG CANDIDATE', value: 'STRONG CANDIDATE' },
                  { label: 'DEVELOPING', value: 'DEVELOPING' },
                  { label: 'TRAINING REQUIRED', value: 'TRAINING REQUIRED' },
                  { label: 'OPTIMAL', value: 'OPTIMAL' },
                ],
                onChange: setStatusFilter,
              },
            ]}
            rightSlot={
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: 10 }} />
                <input
                  type="text"
                  placeholder="Search name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: 30, fontSize: '12px' }}
                />
              </div>
            }
          />

          <IndustrialTable
            columns={rosterColumns}
            data={filteredRoster}
            keyExtractor={(row) => String(row.emp_no)}
            initialLimit={12}
          />
        </div>
      )}

      {/* ── Slide-Over 360° Employee Dossier ──────────────────────────── */}
      <EmployeeProfileDrawer
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onDecisionUpdated={handleDecisionUpdated}
      />
    </div>
  );
}
