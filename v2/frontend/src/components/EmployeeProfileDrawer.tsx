import React, { useState } from 'react';
import type { EmployeeWorkforceItem } from '../api';
import { submitManagementReviewDecision } from '../api';
import {
  DataTrustBadge,
  TOKENS,
} from '../design-system';
import {
  X,
  Award,
  IndianRupee,
  Layers,
  Activity,
  Send,
} from 'lucide-react';

interface EmployeeProfileDrawerProps {
  employee: EmployeeWorkforceItem | null;
  onClose: () => void;
  onDecisionUpdated?: (empNo: string | number, review: any) => void;
}

export const EmployeeProfileDrawer: React.FC<EmployeeProfileDrawerProps> = ({
  employee,
  onClose,
  onDecisionUpdated,
}) => {
  const [decision, setDecision] = useState<string>('APPROVED_FOR_CYCLE');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!employee) return null;

  const handleDecisionSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitManagementReviewDecision(employee.emp_no, decision, 'Plant Manager', notes);
      setSuccessMsg(`Decision '${decision.replace(/_/g, ' ')}' successfully recorded.`);
      if (onDecisionUpdated) {
        onDecisionUpdated(employee.emp_no, res.review);
      }
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Failed to submit decision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY FOR REVIEW':
      case 'STRONG CANDIDATE':
        return { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669' };
      case 'POTENTIAL UNDER-GRADED':
        return { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' };
      case 'TRAINING REQUIRED':
        return { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' };
      case 'REVIEW REQUIRED':
        return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', border: '#E5E7EB', text: '#4B5563' };
    }
  };

  const statusStyle = getStatusColor(employee.progression_status);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${TOKENS.colors.surface.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: TOKENS.colors.surface.cardAlt,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: TOKENS.colors.brand[600], background: '#EFF6FF', padding: '2px 6px', borderRadius: '3px', border: '1px solid #BFDBFE' }}>
                EMP #{employee.emp_no}
              </span>
              <span style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>
                {employee.dept}
              </span>
              <DataTrustBadge provenance="ACTUAL" compact />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
              {employee.name}
            </h2>
            <div style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, marginTop: '2px' }}>
              {employee.desig} · {employee.gender} · Joined {employee.doj} ({employee.tenure_years} yrs tenure)
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: '4px',
              padding: '6px',
              cursor: 'pointer',
              color: TOKENS.colors.text.secondary,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              backgroundColor: '#F8FAFC',
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Current Grade</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.brand[700] }}>
                {employee.grade}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Daily PDS Pay</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: TOKENS.colors.text.primary }}>
                ₹{employee.pds}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Loom Capacity</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: employee.looms_count >= 8 ? '#059669' : TOKENS.colors.text.primary }}>
                {employee.looms_count > 0 ? `${employee.looms_count} Looms` : 'Technical'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: TOKENS.colors.text.muted }}>Progression Status</div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: statusStyle.text,
                  backgroundColor: statusStyle.bg,
                  border: `1px solid ${statusStyle.border}`,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  marginTop: '2px',
                  display: 'inline-block',
                }}
              >
                {employee.progression_status}
              </div>
            </div>
          </div>

          {/* Section 1 & 2: Grade & Pay Progression Dossier */}
          <div
            style={{
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <IndianRupee size={15} color="#2563EB" />
              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                Grade & Pay Progression Analysis
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '12px' }}>
              <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                <span style={{ color: TOKENS.colors.text.muted, display: 'block', fontSize: '11px' }}>Current Pay & Grade</span>
                <strong>{employee.grade}</strong> · ₹{employee.pds} PDS
              </div>
              <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                <span style={{ color: TOKENS.colors.text.muted, display: 'block', fontSize: '11px' }}>Proposed Benchmark</span>
                <strong>{employee.proposed_grade}</strong> · ₹{employee.potential_revised_pds} PDS
              </div>
              <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}` }}>
                <span style={{ color: TOKENS.colors.text.muted, display: 'block', fontSize: '11px' }}>Projected Increment</span>
                <strong style={{ color: employee.potential_revised_pds > employee.pds ? '#059669' : TOKENS.colors.text.primary }}>
                  {employee.increment_display}
                </strong> ({employee.increment_source})
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Loom Handling Capability & Performance Evidence */}
          <div
            style={{
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Layers size={15} color="#2563EB" />
              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                Loom Handling Capability & Observed Performance
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Configured Capability Criteria:</span>
                <strong>{employee.capability || 'Departmental Technical Benchmark'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Target Efficiency Standard:</span>
                <strong>{employee.target_eff_pct > 0 ? `${employee.target_eff_pct}%` : 'N/A'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Demonstrated Observed Efficiency:</span>
                <strong style={{ color: (employee.observed_efficiency_pct || 0) >= employee.target_eff_pct ? '#059669' : '#D97706' }}>
                  {employee.observed_efficiency_pct ? `${employee.observed_efficiency_pct}%` : 'Telemetry Not Monitored'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Capability Qualification:</span>
                <span style={{ fontWeight: 600, color: TOKENS.colors.text.primary }}>{employee.observed_qualification}</span>
              </div>
            </div>
          </div>

          {/* Section 5 & 6: Promotion Readiness & Skill Development Gap */}
          <div
            style={{
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Award size={15} color="#2563EB" />
              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                Promotion Readiness & Skill Development Queue
              </h4>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: TOKENS.colors.text.muted }}>Readiness Index:</span>
                <strong>{employee.readiness_score} / 100</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${employee.readiness_score}%`,
                    height: '100%',
                    background: employee.readiness_score >= 80 ? '#059669' : employee.readiness_score >= 65 ? '#2563EB' : '#D97706',
                  }}
                />
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '4px', border: `1px solid ${TOKENS.colors.surface.border}`, fontSize: '12px' }}>
              <div style={{ color: TOKENS.colors.text.muted, marginBottom: '2px', fontSize: '11px', fontWeight: 600 }}>
                IDENTIFIED SKILL / CAPACITY GAP:
              </div>
              <div style={{ color: TOKENS.colors.text.primary, fontWeight: 500 }}>
                {employee.training_gap}
              </div>
            </div>
          </div>

          {/* Section 7: Workforce Decision Assistant (Evidence -> Interpretation -> Recommendation) */}
          <div
            style={{
              border: '1px solid #BFDBFE',
              borderLeft: '3px solid #2563EB',
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              backgroundColor: '#EFF6FF',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={15} color="#2563EB" />
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: '#1E3A5F' }}>
                  Workforce Decision Assistant
                </h4>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E40AF', background: '#DBEAFE', padding: '1px 6px', borderRadius: '3px' }}>
                {employee.decision_assistant.confidence}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#1E293B', lineHeight: 1.45 }}>
              <div>
                <strong style={{ color: '#1E3A5F' }}>Evidence: </strong>
                {employee.decision_assistant.evidence}
              </div>
              <div>
                <strong style={{ color: '#1E3A5F' }}>Interpretation: </strong>
                {employee.decision_assistant.interpretation}
              </div>
              <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '4px', border: '1px solid #BFDBFE', marginTop: '4px' }}>
                <strong style={{ color: '#2563EB' }}>Recommended Action: </strong>
                {employee.decision_assistant.recommendation}
              </div>
            </div>
          </div>

          {/* Management Review & Decision Action Panel */}
          <div
            style={{
              border: `1px solid ${TOKENS.colors.surface.border}`,
              borderRadius: TOKENS.radius.md,
              padding: '14px 16px',
              backgroundColor: TOKENS.colors.surface.cardAlt,
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px 0', color: TOKENS.colors.text.primary }}>
              Management Review & Action Log
            </h4>

            {employee.management_review.decision && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '8px 10px', borderRadius: '4px', marginBottom: '12px', fontSize: '11.5px', color: '#065F46' }}>
                <strong>Current Decision:</strong> {employee.management_review.decision.replace(/_/g, ' ')} (Logged by {employee.management_review.reviewed_by} on {employee.management_review.reviewed_at})
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: TOKENS.colors.text.secondary, marginBottom: '4px' }}>
                  MANAGEMENT ACTION:
                </label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '12px' }}
                >
                  <option value="APPROVED_FOR_CYCLE">Approve for Upcoming Grade Review Cycle</option>
                  <option value="SCHEDULE_TRAINING">Schedule for 8-Loom Airjet Upskilling Module</option>
                  <option value="HOLD_ADDITIONAL_EVIDENCE">Hold — Require 30 Days Additional Shift Telemetry</option>
                  <option value="ACKNOWLEDGED">Acknowledge Current Grade Standard Alignment</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: TOKENS.colors.text.secondary, marginBottom: '4px' }}>
                  SUPERVISOR / PM EVALUATION NOTES:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter specific floor feedback or appraisal notes..."
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '8px 10px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: `1px solid ${TOKENS.colors.surface.border}`,
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {successMsg && (
                <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                  ✓ {successMsg}
                </div>
              )}

              <button
                onClick={handleDecisionSubmit}
                disabled={isSubmitting}
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '8px 14px', fontSize: '12.5px' }}
              >
                <Send size={14} />
                <span>{isSubmitting ? 'Recording Decision...' : 'Commit Management Decision'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
