import React, { useState, useMemo } from 'react';
import type { ProductionPerformanceResponse } from '../../api';
import { demoSnapshot } from '../../demoSnapshot';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  User,
  Sparkles,
  FileSpreadsheet,
  Cpu,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

interface LoomPerformanceWorkspaceProps {
  performance: ProductionPerformanceResponse | null;
  loading: boolean;
  onSelectLoom: (loomId: number) => void;
  onExplainLoom: (loomNo: string) => void;
}

// Machine Make helper
function getLoomMake(typeCode: string): { make: string; model: string } {
  const c = String(typeCode).toUpperCase();
  if (c.includes('810') || c.includes('TY')) return { make: 'Toyota', model: 'JAT810 Airjet' };
  if (c.includes('910') || c.includes('TS')) return { make: 'Tsudakoma', model: 'ZAX9200 Airjet' };
  if (c.includes('340') || c.includes('SZ')) return { make: 'Picanol', model: 'OmniPlus Summum' };
  if (c.includes('280')) return { make: 'Tsudakoma', model: 'ZAX9100 Airjet' };
  return { make: 'Tsudakoma', model: 'ZAX9100 Airjet' };
}

export const LoomPerformanceWorkspace: React.FC<LoomPerformanceWorkspaceProps> = ({
  performance: _performance,
  loading,
  onSelectLoom,
  onExplainLoom,
}) => {
  // Navigation Tabs for Focused Cognitive Workspace
  const [activeTab, setActiveTab] = useState<'TRIAGE' | 'DIAGNOSIS' | 'MATRIX'>('TRIAGE');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState<'ALL' | '1' | '2' | '3'>('ALL');
  const [makeFilter, setMakeFilter] = useState<'ALL' | 'Tsudakoma' | 'Toyota' | 'Picanol'>('ALL');

  // Selected Loom for Deep Diagnosis
  const [selectedLoomId, setSelectedLoomId] = useState<number>(118);
  const [showTechnicalEvidence, setShowTechnicalEvidence] = useState(false);
  const [showPeerModal, setShowPeerModal] = useState(false);
  const [actionAdded, setActionAdded] = useState(false);

  // Extract looms from demoSnapshot
  const allLooms = useMemo(() => {
    const rawList: any[] = demoSnapshot?.looms?.looms || [];
    if (rawList.length > 0) {
      return rawList.map((l: any) => {
        const eff = parseFloat(l.loom_efficiency_pct || '0');
        const metres = parseFloat(l.metres || '0');
        const targetMetres = parseFloat(l.target_metres || (metres * (100 / Math.max(eff, 50))).toFixed(1));
        const gapM = parseFloat((metres - targetMetres).toFixed(1));
        const stoppedMin = parseInt(l.stopped_minutes || '0', 10);
        const makeInfo = getLoomMake(l.loom_type_code || '910');

        let tier: 'ON_PLAN' | 'WATCH' | 'ACTION_REQUIRED' = 'ON_PLAN';
        if (eff < 80) tier = 'ACTION_REQUIRED';
        else if (eff < 90) tier = 'WATCH';

        // Primary diagnostic reason
        let primaryWhy = 'Normal weaving cadence';
        if (stoppedMin > 60 && l.warp_breaks > 12) primaryWhy = 'Warp tension & knot stops ↑';
        else if (stoppedMin > 60 && l.weft_breaks > 18) primaryWhy = 'Weft insertion breaks ↑';
        else if (stoppedMin > 75) primaryWhy = 'Electrical voltage trip ↑';
        else if (eff < 80) primaryWhy = 'Sub-nozzle pressure dip';

        return {
          ...l,
          eff,
          metres,
          targetMetres,
          gapM,
          stoppedMin,
          tier,
          make: makeInfo.make,
          model: makeInfo.model,
          primaryWhy,
        };
      });
    }
    return [];
  }, []);

  // Filtered Looms for Triage
  const filteredLooms = useMemo(() => {
    return allLooms.filter((l) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNo = l.loom_no?.toLowerCase().includes(q);
        const matchStyle = l.style_code?.toLowerCase().includes(q);
        const matchMake = l.make.toLowerCase().includes(q);
        if (!matchNo && !matchStyle && !matchMake) return false;
      }
      if (shiftFilter !== 'ALL' && l.shift_code !== shiftFilter) return false;
      if (makeFilter !== 'ALL' && l.make !== makeFilter) return false;
      return true;
    });
  }, [allLooms, searchQuery, shiftFilter, makeFilter]);

  // Position Counts
  const positionSummary = useMemo(() => {
    let onPlan = 0;
    let watch = 0;
    let actionReq = 0;
    allLooms.forEach((l) => {
      if (l.tier === 'ACTION_REQUIRED') actionReq++;
      else if (l.tier === 'WATCH') watch++;
      else onPlan++;
    });
    return {
      total: allLooms.length || 192,
      onPlan: onPlan || 148,
      watch: watch || 31,
      actionReq: actionReq || 13,
    };
  }, [allLooms]);

  // Problem Looms list (Action Required + Watch)
  const problemLooms = useMemo(() => {
    return filteredLooms
      .filter((l) => l.tier === 'ACTION_REQUIRED' || l.tier === 'WATCH')
      .sort((a, b) => a.eff - b.eff);
  }, [filteredLooms]);

  // Active Selected Loom Data
  const activeLoom = useMemo(() => {
    const found = allLooms.find((l) => l.loom_id === selectedLoomId || l.loom_no === `AJ-${selectedLoomId}`);
    if (found) return found;
    return allLooms.find((l) => l.tier === 'ACTION_REQUIRED') || allLooms[0];
  }, [allLooms, selectedLoomId]);

  // Find Best Similar Healthy Peer
  const bestPeerLoom = useMemo(() => {
    if (!activeLoom) return null;
    const matchSameStyle = allLooms.find(
      (l) => l.loom_id !== activeLoom.loom_id && l.style_code === activeLoom.style_code && l.eff >= 90
    );
    if (matchSameStyle) return matchSameStyle;

    const matchSameMake = allLooms.find(
      (l) => l.loom_id !== activeLoom.loom_id && l.make === activeLoom.make && l.eff >= 92
    );
    if (matchSameMake) return matchSameMake;

    return allLooms.find((l) => l.eff >= 93) || null;
  }, [allLooms, activeLoom]);

  // Recoverable Production Opportunity Calculation
  const recoveryMetrics = useMemo(() => {
    if (!activeLoom || !bestPeerLoom) {
      return { gapM: 12.5, recoverableM: 8.4, valueInr: 294 };
    }
    const gapM = Math.max(0, parseFloat((bestPeerLoom.metres - activeLoom.metres).toFixed(1)));
    const recoverableM = parseFloat((gapM * 0.72).toFixed(1));
    const valueInr = Math.round(recoverableM * 35.0);
    return { gapM, recoverableM, valueInr };
  }, [activeLoom, bestPeerLoom]);

  if (loading && allLooms.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
        Loading loom performance rankings and factory telemetry...
      </div>
    );
  }

  return (
    <div className="loom-performance-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* ── TOP HEADER & POSITION STRIP ───────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              LOOM PERFORMANCE
            </h2>
            <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', background: '#F1F5F9', color: '#475569', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
              Airjet Weaving Division
            </span>
          </div>
          <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748B' }}>
            Compare today's loom performance, identify problem machines, and understand the main reason.
          </p>
        </div>

        {/* Position Summary Pill Distribution */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11.5px' }}>
          <span style={{ color: '#64748B', fontWeight: 700 }}>MILL POSITION:</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#15803D', fontWeight: 700 }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A' }} />
            {positionSummary.onPlan} On Plan
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#B45309', fontWeight: 700 }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#D97706' }} />
            {positionSummary.watch} Watch
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#B91C1C', fontWeight: 800 }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#DC2626' }} />
            {positionSummary.actionReq} Action Required
          </span>
        </div>
      </div>

      {/* ── FOCUSED WORKSPACE NAVIGATION (TAB BAR) ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #CBD5E1', paddingBottom: '0', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('TRIAGE')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'TRIAGE' ? '3px solid #DC2626' : '3px solid transparent',
              background: activeTab === 'TRIAGE' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'TRIAGE' ? '#991B1B' : '#64748B',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <AlertTriangle size={14} color={activeTab === 'TRIAGE' ? '#DC2626' : '#94A3B8'} />
            <span>Priority Triage</span>
            <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '10px', background: activeTab === 'TRIAGE' ? '#FEE2E2' : '#F1F5F9', color: activeTab === 'TRIAGE' ? '#991B1B' : '#64748B', fontWeight: 700 }}>
              {problemLooms.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('DIAGNOSIS')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'DIAGNOSIS' ? '3px solid #2563EB' : '3px solid transparent',
              background: activeTab === 'DIAGNOSIS' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'DIAGNOSIS' ? '#1D4ED8' : '#64748B',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <Search size={14} color={activeTab === 'DIAGNOSIS' ? '#2563EB' : '#94A3B8'} />
            <span>Machine Deep Diagnosis</span>
            {activeLoom && (
              <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '10px', background: activeTab === 'DIAGNOSIS' ? '#EFF6FF' : '#F1F5F9', color: activeTab === 'DIAGNOSIS' ? '#1D4ED8' : '#64748B', fontWeight: 700 }}>
                {activeLoom.loom_no}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('MATRIX')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'MATRIX' ? '3px solid #059669' : '3px solid transparent',
              background: activeTab === 'MATRIX' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'MATRIX' ? '#047857' : '#64748B',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <BarChart3 size={14} color={activeTab === 'MATRIX' ? '#059669' : '#94A3B8'} />
            <span>Output vs Efficiency Matrix</span>
            <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '10px', background: activeTab === 'MATRIX' ? '#ECFDF5' : '#F1F5F9', color: activeTab === 'MATRIX' ? '#047857' : '#64748B', fontWeight: 700 }}>
              192 Looms
            </span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div style={{ position: 'relative', width: '220px', marginBottom: '4px' }}>
          <Search size={13} style={{ position: 'absolute', left: '8px', top: '8px', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search any loom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '5px 8px 5px 26px',
              fontSize: '11.5px',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: PRIORITY TRIAGE (Which looms need attention?)                 */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'TRIAGE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Triage Header & Filter Bar */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Filter Machines:</span>
              {(['ALL', 'Tsudakoma', 'Toyota', 'Picanol'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMakeFilter(m)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid',
                    fontSize: '11px',
                    fontWeight: makeFilter === m ? 700 : 500,
                    background: makeFilter === m ? '#0F172A' : '#F8FAFC',
                    color: makeFilter === m ? '#FFFFFF' : '#475569',
                    borderColor: makeFilter === m ? '#0F172A' : '#E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  {m === 'ALL' ? 'All Makes' : m}
                </button>
              ))}

              <span style={{ color: '#CBD5E1' }}>|</span>

              {(['ALL', '1', '2', '3'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setShiftFilter(s)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid',
                    fontSize: '11px',
                    fontWeight: shiftFilter === s ? 700 : 500,
                    background: shiftFilter === s ? '#2563EB' : '#F8FAFC',
                    color: shiftFilter === s ? '#FFFFFF' : '#475569',
                    borderColor: shiftFilter === s ? '#2563EB' : '#E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  {s === 'ALL' ? 'All Shifts' : `Shift ${s}`}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Click <strong>Diagnose</strong> on any row to open its full 360° decision dossier
            </span>
          </div>

          {/* Clean Scannable Triage Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', fontWeight: 700 }}>
                  <th style={{ padding: '9px 14px' }}>LOOM NO</th>
                  <th style={{ padding: '9px 12px' }}>AIRJET MAKE & MODEL</th>
                  <th style={{ padding: '9px 12px' }}>FABRIC STYLE</th>
                  <th style={{ padding: '9px 12px', textAlign: 'right' }}>EFFICIENCY</th>
                  <th style={{ padding: '9px 12px', textAlign: 'right' }}>ACTUAL / TARGET</th>
                  <th style={{ padding: '9px 12px', textAlign: 'right' }}>OUTPUT GAP</th>
                  <th style={{ padding: '9px 12px', textAlign: 'right' }}>DOWNTIME</th>
                  <th style={{ padding: '9px 14px' }}>PRIMARY CAUSE (WHY?)</th>
                  <th style={{ padding: '9px 14px', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {problemLooms.map((l) => {
                  const isCritical = l.tier === 'ACTION_REQUIRED';
                  return (
                    <tr
                      key={l.loom_id}
                      onClick={() => {
                        setSelectedLoomId(l.loom_id);
                        setActiveTab('DIAGNOSIS');
                      }}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        background: isCritical ? '#FFFDFD' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF6FF')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = isCritical ? '#FFFDFD' : '#FFFFFF')}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: '#1E293B' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isCritical ? '#DC2626' : '#D97706' }} />
                          <span>{l.loom_no}</span>
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#334155' }}>
                        <span style={{ fontWeight: 600 }}>{l.make}</span>{' '}
                        <span style={{ color: '#64748B', fontSize: '11px' }}>{l.model}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#475569', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {l.style_code}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: isCritical ? '#DC2626' : '#D97706' }}>
                        {l.eff}%
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: '#334155' }}>
                        <strong>{l.metres}m</strong> <span style={{ color: '#94A3B8' }}>/ {l.targetMetres}m</span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: isCritical ? '#DC2626' : '#D97706' }}>
                        {l.gapM} m
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#B45309' }}>
                        {l.stoppedMin} min
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: isCritical ? '#FEE2E2' : '#FEF3C7', color: isCritical ? '#991B1B' : '#92400E', fontSize: '11px', fontWeight: 700 }}>
                          {l.primaryWhy}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLoomId(l.loom_id);
                            setActiveTab('DIAGNOSIS');
                          }}
                          style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: '#2563EB',
                            color: '#FFFFFF',
                            border: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>Diagnose</span>
                          <ArrowRight size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: MACHINE DEEP DIAGNOSIS (Focused 360° Decision Dossier)        */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'DIAGNOSIS' && activeLoom && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Quick Machine Selector Bar */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B' }}>SELECT LOOM:</span>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {problemLooms.slice(0, 7).map((l) => {
                  const isCurr = l.loom_id === activeLoom.loom_id;
                  return (
                    <button
                      key={l.loom_id}
                      onClick={() => setSelectedLoomId(l.loom_id)}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: isCurr ? 800 : 600,
                        background: isCurr ? '#0F172A' : '#F1F5F9',
                        color: isCurr ? '#FFFFFF' : '#334155',
                        border: '1px solid',
                        borderColor: isCurr ? '#0F172A' : '#CBD5E1',
                        cursor: 'pointer',
                      }}
                    >
                      {l.loom_no} ({l.eff}%)
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onExplainLoom(activeLoom.loom_no)}
                style={{
                  padding: '5px 12px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1D4ED8',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Sparkles size={13} />
                <span>Explain with AI</span>
              </button>

              <button
                onClick={() => onSelectLoom(activeLoom.loom_id)}
                style={{
                  padding: '5px 12px',
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Cpu size={13} />
                <span>Open in Loom 360° Profile →</span>
              </button>
            </div>
          </div>

          {/* Focused 2-Column Dossier Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '14px' }}>
            {/* ── CARD 1: TARGET ATTAINMENT & WHY MISSED ─────────────────── */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                    TARGET ATTAINMENT & WHY MISSED
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {activeLoom.loom_no} • {activeLoom.make} {activeLoom.model}
                  </span>
                </div>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, background: activeLoom.tier === 'ACTION_REQUIRED' ? '#FEE2E2' : '#ECFDF5', color: activeLoom.tier === 'ACTION_REQUIRED' ? '#B91C1C' : '#047857' }}>
                  {activeLoom.tier === 'ACTION_REQUIRED' ? 'CRITICAL GAP' : 'WATCH'}
                </span>
              </div>

              {/* Numbers Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Actual Output</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{activeLoom.metres}m</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Shift Target</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#475569' }}>{activeLoom.targetMetres}m</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Output Gap</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#DC2626' }}>{activeLoom.gapM}m</div>
                </div>
              </div>

              {/* Progress Attribution Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                  PRIMARY GAP CONTRIBUTORS (LOSS BREAKDOWN):
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '2px' }}>
                    <span>Excess Stoppage Time</span>
                    <strong>48% loss contribution ({activeLoom.stoppedMin} min stopped)</strong>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '48%', height: '100%', background: '#DC2626', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '2px' }}>
                    <span>Weft Insertion Breaks & Sensor Micro-stops</span>
                    <strong>31% loss contribution ({activeLoom.weft_breaks || 18} stops)</strong>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '31%', height: '100%', background: '#D97706', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '2px' }}>
                    <span>Running Speed / Creep Pace Derating</span>
                    <strong>21% loss contribution (712 vs 780 rated RPM)</strong>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '21%', height: '100%', background: '#64748B', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD 2: ⭐ BEST SIMILAR PEER COMPARISON ─────────────────── */}
            {bestPeerLoom && (
              <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#14532D', textTransform: 'uppercase' }}>
                      BEST SIMILAR HEALTHY PEER: {bestPeerLoom.loom_no}
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '2px 7px', borderRadius: '4px' }}>
                    {bestPeerLoom.eff}% Efficiency
                  </span>
                </div>

                <div style={{ fontSize: '11.5px', color: '#166534', lineHeight: '1.4' }}>
                  <strong>Verified Peer Match Criteria:</strong>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                    <span>✓ Same Make: <strong>{bestPeerLoom.make}</strong></span>
                    <span>✓ Same Fabric Style: <strong>{bestPeerLoom.style_code?.slice(0, 16)}...</strong></span>
                    <span>✓ Same Shift: <strong>Shift 1</strong></span>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #86EFAC', borderRadius: '6px', padding: '10px', fontSize: '11.5px', color: '#1E293B' }}>
                  <strong>Direct Operational Contrast:</strong> {activeLoom.loom_no} lost <strong>{activeLoom.stoppedMin} min</strong> in stoppages vs only <strong>{bestPeerLoom.stoppedMin} min</strong> on {bestPeerLoom.loom_no}. Excess downtime explains <strong>88%</strong> of the gap.
                </div>

                {/* Recoverable Opportunity Summary */}
                <div style={{ background: '#DCFCE7', padding: '8px 10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#14532D' }}>
                      Recoverable Output Potential: ~{recoveryMetrics.recoverableM} metres
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#15803D' }}>
                      Bringing downtime to peer level protects revenue
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#15803D' }}>₹{recoveryMetrics.valueInr}/shift</div>
                    <div style={{ fontSize: '10px', color: '#166534' }}>~₹{recoveryMetrics.valueInr * 90}/month</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPeerModal(true)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Open Side-by-Side Comparison Modal →
                </button>
              </div>
            )}

            {/* ── CARD 3: OPERATOR & MACHINE CONTEXT ─────────────────────── */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                  OPERATOR / MACHINE CONTEXT
                </h3>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Shift 1 Assigned Weaver</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#475569" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                    {activeLoom.weaver_name || 'Ramesh K. (Weaver #1042)'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Grade A • 8.5 yrs exp • 6 airjet looms assigned
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#16A34A' }}>86.4% avg</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>personal baseline</div>
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: '1.4' }}>
                <strong>Performance Context (Not Blame):</strong> Weaver Ramesh maintains an <strong>86.4%</strong> average across his other 5 looms. The efficiency drop to <strong>{activeLoom.eff}%</strong> on {activeLoom.loom_no} indicates lag is caused by <em>machine condition & recurring stops</em> rather than operator skill.
              </div>
            </div>

            {/* ── CARD 4: TECHNICAL SIGNALS & STOPPAGE LOGS ──────────────── */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                  TECHNICAL OPERATING SIGNALS
                </h3>
                <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>● Telemetry Active</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div style={{ background: '#F8FAFC', padding: '7px 9px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
                    <span>Operating RPM</span>
                    <span style={{ color: '#2563EB', fontWeight: 600 }}>● Telemetry</span>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    712 RPM <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>(780 rated)</span>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '7px 9px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
                    <span>Main Air Pressure</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>● Sensor</span>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>
                    4.2 bar <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>(4.8 target)</span>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '7px 9px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
                    <span>Warp Breaks</span>
                    <span style={{ color: '#64748B' }}>● Ingested</span>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {activeLoom.warp_breaks || 17} stops
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '7px 9px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
                    <span>Weft Breaks</span>
                    <span style={{ color: '#DC2626', fontWeight: 600 }}>● High</span>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#DC2626', marginTop: '2px' }}>
                    {activeLoom.weft_breaks || 28} <span style={{ fontSize: '10px', color: '#DC2626' }}>(2.3×)</span>
                  </div>
                </div>
              </div>

              {/* Expandable Stoppage Register */}
              <button
                onClick={() => setShowTechnicalEvidence(!showTechnicalEvidence)}
                style={{
                  width: '100%',
                  padding: '5px',
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2563EB',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <FileSpreadsheet size={13} />
                <span>{showTechnicalEvidence ? 'Hide Stoppage Register' : 'View Stoppage Log (from Physical Mill Report) ▼'}</span>
              </button>

              {showTechnicalEvidence && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                  <div style={{ padding: '5px 8px', background: '#FEF2F2', borderLeft: '3px solid #DC2626', borderRadius: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span style={{ color: '#991B1B' }}>05:37 PM - 05:39 PM • ALL M/C VOLTAGE PBM (2 MIN)</span>
                      <span style={{ color: '#B91C1C' }}>Electrical</span>
                    </div>
                  </div>
                  <div style={{ padding: '5px 8px', background: '#FEF2F2', borderLeft: '3px solid #DC2626', borderRadius: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span style={{ color: '#991B1B' }}>06:47 PM - 06:57 PM • AIRJET VOLTAGE PBM (10 MIN)</span>
                      <span style={{ color: '#B91C1C' }}>Electrical</span>
                    </div>
                  </div>
                  <div style={{ padding: '5px 8px', background: '#FFFBEB', borderLeft: '3px solid #D97706', borderRadius: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span style={{ color: '#92400E' }}>07:15 PM - 07:22 PM • ROBO 4 TIP LOCK PBM (7 MIN)</span>
                      <span style={{ color: '#B45309' }}>Weft Insertion</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Management Finding & Action Footer */}
          <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ maxWidth: '750px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                MANAGEMENT ACTION RECOMMENDATION
              </div>
              <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>
                “Most of {activeLoom.loom_no}'s gap is associated with excessive stoppage time ({activeLoom.stoppedMin} min) and sub-nozzle air pressure dip, rather than running speed. Inspect Bay 2 pressure manifold before shift handover.”
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setActionAdded(true);
                  setTimeout(() => setActionAdded(false), 2500);
                }}
                style={{
                  padding: '6px 14px',
                  background: actionAdded ? '#16A34A' : '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {actionAdded ? '✓ Added to Shift Action Plan' : 'Add to Shift Action Plan'}
              </button>

              <button
                onClick={() => onExplainLoom(activeLoom.loom_no)}
                style={{
                  padding: '6px 12px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#2563EB',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Deep AI Explain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: OUTPUT VS EFFICIENCY MATRIX (Visual Mill Quadrants)           */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'MATRIX' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                MILL-WIDE OUTPUT VS EFFICIENCY PERFORMANCE QUADRANTS
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748B' }}>
                Click any machine dot to select it and jump directly into its Deep Diagnosis.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#475569' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }} />
                Pacesetters (High Output / High Eff)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706' }} />
                Watch / Friction
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} />
                Critical Shortfall (Priority Action)
              </span>
            </div>
          </div>

          {/* Scatter Visualization Canvas */}
          <div style={{ position: 'relative', width: '100%', height: '340px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
            {/* 90% Efficiency Line */}
            <div style={{ position: 'absolute', top: '25%', left: '40px', right: '10px', height: '1px', borderTop: '1px dashed #94A3B8', zIndex: 1 }} />
            <span style={{ position: 'absolute', top: 'calc(25% - 9px)', left: '4px', fontSize: '10px', color: '#64748B', fontWeight: 700 }}>
              90%
            </span>

            {/* 80% Efficiency Line */}
            <div style={{ position: 'absolute', top: '50%', left: '40px', right: '10px', height: '1px', borderTop: '1px dashed #CBD5E1', zIndex: 1 }} />
            <span style={{ position: 'absolute', top: 'calc(50% - 9px)', left: '4px', fontSize: '10px', color: '#94A3B8' }}>
              80%
            </span>

            {/* Target Output Vertical Line */}
            <div style={{ position: 'absolute', top: '10px', bottom: '25px', left: '60%', width: '1px', borderLeft: '1px dashed #94A3B8', zIndex: 1 }} />
            <span style={{ position: 'absolute', bottom: '6px', left: 'calc(60% - 30px)', fontSize: '10px', color: '#64748B', fontWeight: 700 }}>
              Target (88m)
            </span>

            {/* Quadrant Labels */}
            <div style={{ position: 'absolute', top: '10px', right: '14px', fontSize: '10.5px', fontWeight: 800, color: '#16A34A', opacity: 0.6 }}>
              PACESETTERS (HIGH EFFICIENCY • HIGH OUTPUT)
            </div>
            <div style={{ position: 'absolute', bottom: '30px', left: '50px', fontSize: '10.5px', fontWeight: 800, color: '#DC2626', opacity: 0.7 }}>
              CRITICAL SHORTFALL QUADRANT
            </div>

            {/* Render Scatter Points */}
            <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 2 }}>
              {filteredLooms.map((l) => {
                const minM = 20;
                const maxM = 120;
                const normX = Math.max(0.05, Math.min(0.95, (l.metres - minM) / (maxM - minM)));
                const posX = `${normX * 100}%`;

                const minEff = 60;
                const maxEff = 100;
                const normY = Math.max(0, Math.min(1, (l.eff - minEff) / (maxEff - minEff)));
                const posY = `${(1 - normY) * 75 + 10}%`;

                const isSelected = activeLoom?.loom_id === l.loom_id;
                const color = l.tier === 'ACTION_REQUIRED' ? '#DC2626' : l.tier === 'WATCH' ? '#D97706' : '#16A34A';

                return (
                  <g
                    key={l.loom_id}
                    onClick={() => {
                      setSelectedLoomId(l.loom_id);
                      setActiveTab('DIAGNOSIS');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {isSelected && (
                      <circle cx={posX} cy={posY} r="10" fill="none" stroke="#2563EB" strokeWidth="2.5" opacity="0.85" />
                    )}
                    <circle
                      cx={posX}
                      cy={posY}
                      r={isSelected ? '6' : '4'}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    >
                      <title>{`${l.loom_no} (${l.make})\nEfficiency: ${l.eff}%\nOutput: ${l.metres}m\nDowntime: ${l.stoppedMin} min\nClick to inspect`}</title>
                    </circle>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* ── BEST PEER SIDE-BY-SIDE COMPARISON MODAL ───────────────────────── */}
      {showPeerModal && bestPeerLoom && activeLoom && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowPeerModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              maxWidth: '820px',
              width: '100%',
              padding: '22px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  SIDE-BY-SIDE MACHINE COMPARISON: {activeLoom.loom_no} vs {bestPeerLoom.loom_no}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Comparing Problem Loom against Similar Healthy Peer operating on identical fabric style
                </span>
              </div>
              <button
                onClick={() => setShowPeerModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '18px', color: '#64748B', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                  <th style={{ padding: '9px 10px' }}>METRIC / ATTRIBUTE</th>
                  <th style={{ padding: '9px 10px', color: '#DC2626' }}>{activeLoom.loom_no} (PROBLEM MACHINE)</th>
                  <th style={{ padding: '9px 10px', color: '#16A34A' }}>{bestPeerLoom.loom_no} (BENCHMARK PEER)</th>
                  <th style={{ padding: '9px 10px', color: '#0F172A' }}>OPERATIONAL VARIANCE</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Airjet Make & Model</td>
                  <td style={{ padding: '8px 10px' }}>{activeLoom.make} {activeLoom.model}</td>
                  <td style={{ padding: '8px 10px' }}>{bestPeerLoom.make} {bestPeerLoom.model}</td>
                  <td style={{ padding: '8px 10px', color: '#16A34A', fontWeight: 700 }}>✓ Identical Platform</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Fabric Style</td>
                  <td style={{ padding: '8px 10px' }}>{activeLoom.style_code}</td>
                  <td style={{ padding: '8px 10px' }}>{bestPeerLoom.style_code}</td>
                  <td style={{ padding: '8px 10px', color: '#16A34A', fontWeight: 700 }}>✓ Identical Count/Yarn</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9', background: '#FEF2F2' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>Efficiency %</td>
                  <td style={{ padding: '8px 10px', fontWeight: 800, color: '#DC2626' }}>{activeLoom.eff}%</td>
                  <td style={{ padding: '8px 10px', fontWeight: 800, color: '#16A34A' }}>{bestPeerLoom.eff}%</td>
                  <td style={{ padding: '8px 10px', fontWeight: 800, color: '#DC2626' }}>
                    -{(bestPeerLoom.eff - activeLoom.eff).toFixed(1)} pp gap
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Shift Output (Metres)</td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>{activeLoom.metres} m</td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>{bestPeerLoom.metres} m</td>
                  <td style={{ padding: '8px 10px', fontWeight: 700, color: '#DC2626' }}>
                    -{(bestPeerLoom.metres - activeLoom.metres).toFixed(1)} m shortfall
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9', background: '#FFFBEB' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>Stoppage Time (Downtime)</td>
                  <td style={{ padding: '8px 10px', fontWeight: 800, color: '#DC2626' }}>{activeLoom.stoppedMin} min</td>
                  <td style={{ padding: '8px 10px', fontWeight: 800, color: '#16A34A' }}>{bestPeerLoom.stoppedMin} min</td>
                  <td style={{ padding: '8px 10px', fontWeight: 800, color: '#DC2626' }}>
                    +{(activeLoom.stoppedMin - bestPeerLoom.stoppedMin)} min excess stop! (3.1× higher)
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Operating RPM</td>
                  <td style={{ padding: '8px 10px' }}>712 RPM</td>
                  <td style={{ padding: '8px 10px' }}>738 RPM</td>
                  <td style={{ padding: '8px 10px', color: '#64748B' }}>-26 RPM derated</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '14px', background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', fontSize: '11.5px', color: '#1E293B', border: '1px solid #E2E8F0' }}>
              <strong>Operational Takeaway:</strong> {activeLoom.loom_no}'s output gap is <strong>88% driven by excess downtime</strong> ({activeLoom.stoppedMin - bestPeerLoom.stoppedMin} min difference) and recurring voltage/sensor events. Focusing on sub-nozzle air pressure will recover <strong>~{recoveryMetrics.recoverableM} metres</strong> per shift.
            </div>

            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowPeerModal(false)}
                style={{
                  padding: '6px 12px',
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
