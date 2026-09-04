import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Eye,
  Flame,
  Gauge,
  Layers,
  LayoutGrid,
  MapPin,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react';

export interface LoomHeatmapItem {
  loom_id: number;
  loom_no: string;
  loom_type: string;
  metres: number;
  efficiency_pct: number;
  stopped_minutes: number;
  status: 'GREEN' | 'AMBER' | 'RED' | 'GREY';
  // Enriched industrial metadata
  shed_name?: string;
  bay_name?: string;
  line_no?: number;
  rpm?: number;
  std_rpm?: number;
  fabric_sort?: string;
  weaver_name?: string;
  weaver_grade?: string;
  stop_reason?: string;
  current_state?: 'RUNNING' | 'WARP_STOP' | 'WEFT_STOP' | 'MECHANICAL' | 'MAINTENANCE' | 'SLOW';
}

interface LoomHeatmapProps {
  looms?: LoomHeatmapItem[];
  selectedDate?: string;
  onSelectLoom: (loomId: number) => void;
  onExplainLoom: (loomNo: string) => void;
}

type ViewMode = 'SPATIAL_FLOOR' | 'TELEMETRY_CARDS' | 'BAY_SUMMARY';
type ShedFilter = 'ALL' | 'AIRJET_1' | 'AIRJET_2' | 'RAPIER';
type StatusFilter = 'ALL' | 'CRITICAL' | 'WARNING' | 'OPTIMAL';
type SortOption = 'EFFICIENCY_ASC' | 'DOWNTIME_DESC' | 'LOOM_NO_ASC' | 'OUTPUT_DESC';

export const LoomHeatmap: React.FC<LoomHeatmapProps> = ({
  looms,
  selectedDate = '2026-07-31',
  onSelectLoom,
  onExplainLoom,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('SPATIAL_FLOOR');
  const [selectedShed, setSelectedShed] = useState<ShedFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('EFFICIENCY_ASC');
  const [activeLoom, setActiveLoom] = useState<LoomHeatmapItem | null>(null);

  // 1. Generate or enrich 192 looms with authentic industrial telemetry
  const allLooms: LoomHeatmapItem[] = useMemo(() => {
    const dateDay = selectedDate ? (parseInt(selectedDate.slice(-2), 10) || 31) : 31;

    const STYLES = [
      '30s VSF Plain (66x55)',
      '40s VOT Satin (132x80)',
      '20s Excel VOT (56x52)',
      '30s VSF Slub Plain',
      '12s VSF Slub (56x44)',
    ];

    const WEAVERS = [
      { name: 'R. Kumar', grade: 'G1+' },
      { name: 'S. Murugan', grade: 'G2+' },
      { name: 'M. Velu', grade: 'G1' },
      { name: 'K. Selvam', grade: 'G2' },
      { name: 'P. Rajan', grade: 'G1+' },
      { name: 'A. Suresh', grade: 'G3' },
      { name: 'D. Vignesh', grade: 'G2' },
      { name: 'T. Anand', grade: 'G1' },
    ];

    if (looms && looms.length > 0) {
      return looms.map((l) => {
        const shed = l.loom_id <= 64 ? 'Airjet Shed 1' : l.loom_id <= 128 ? 'Airjet Shed 2' : 'Rapier Shed';
        const bayNum = Math.floor(((l.loom_id - 1) % 64) / 8) + 1;
        const bay = `Bay ${bayNum}`;
        const line = ((l.loom_id - 1) % 8) < 4 ? 1 : 2;
        const style = STYLES[l.loom_id % STYLES.length];
        const weaver = WEAVERS[l.loom_id % WEAVERS.length];
        const stdRpm = l.loom_type.toLowerCase().includes('airjet') ? 650 : 220;
        const rpm = l.status === 'RED' ? 0 : Math.round(stdRpm * (l.efficiency_pct / 100));

        let stopReason: string | undefined;
        let currentState: LoomHeatmapItem['current_state'] = 'RUNNING';

        if (l.status === 'RED') {
          currentState = l.loom_id % 2 === 0 ? 'WARP_STOP' : 'MECHANICAL';
          stopReason = l.loom_id % 2 === 0 ? 'Warp Break (Tension Peak)' : 'Main Drive Motor Trip';
        } else if (l.status === 'AMBER') {
          currentState = l.efficiency_pct < 87 ? 'WEFT_STOP' : 'SLOW';
          stopReason = l.efficiency_pct < 87 ? 'Weft Insertion Failure' : 'Sub-Standard RPM Creep';
        }

        return {
          ...l,
          shed_name: l.shed_name || shed,
          bay_name: l.bay_name || bay,
          line_no: l.line_no || line,
          std_rpm: l.std_rpm || stdRpm,
          rpm: l.rpm ?? rpm,
          fabric_sort: l.fabric_sort || style,
          weaver_name: l.weaver_name || weaver.name,
          weaver_grade: l.weaver_grade || weaver.grade,
          stop_reason: l.stop_reason || stopReason,
          current_state: l.current_state || currentState,
        };
      });
    }

    return Array.from({ length: 192 }, (_, i) => {
      const id = i + 1;
      const isAirjet = id <= 128;
      const shedName = id <= 64 ? 'Airjet Shed 1' : id <= 128 ? 'Airjet Shed 2' : 'Rapier Shed';
      const bayIndex = Math.floor(((id - 1) % 64) / 8) + 1;
      const bayName = `Bay ${bayIndex}`;
      const lineNo = ((id - 1) % 8) < 4 ? 1 : 2;
      const loomNo = isAirjet ? `AJ-${String(id).padStart(3, '0')}` : `SZ-${String(id - 128).padStart(3, '0')}`;
      const loomType = isAirjet ? (id <= 64 ? 'Toyota JAT810' : 'Tsudakoma ZAX') : 'Sulzer 340';
      const stdRpm = isAirjet ? 650 : 220;

      // Date-aware dynamic variation across dates
      let eff = 89.5 + (((id * 17 + dateDay * 19) % 9) - 4.5);
      let stoppedMinutes = 45;
      let stopReason: string | undefined;
      let currentState: LoomHeatmapItem['current_state'] = 'RUNNING';

      // Explicit realistic critical downtime looms depending on date
      if (dateDay === 31) {
        // Baseline 31 Jul
        if (id === 118) {
          eff = 74.2;
          stoppedMinutes = 310;
          stopReason = 'Warp Beam Knotting Failure';
          currentState = 'WARP_STOP';
        } else if (id === 132) {
          eff = 76.5;
          stoppedMinutes = 280;
          stopReason = 'Rapier Ribbon Jam / Fitter Call';
          currentState = 'MECHANICAL';
        } else if (id === 146) {
          eff = 78.0;
          stoppedMinutes = 245;
          stopReason = 'Compressor Air Drop (< 5.2 bar)';
          currentState = 'WEFT_STOP';
        } else if (id === 44 || id === 18) {
          eff = 96.2;
          stoppedMinutes = 15;
        }
      } else if (dateDay === 30) {
        // 30 Jul: AJ-018 and AJ-042 stopped
        if (id === 18) {
          eff = 71.5;
          stoppedMinutes = 330;
          stopReason = 'Drive Motor Overload Trip';
          currentState = 'MECHANICAL';
        } else if (id === 42) {
          eff = 73.8;
          stoppedMinutes = 290;
          stopReason = 'Warp Knotter Tension Defect';
          currentState = 'WARP_STOP';
        } else if (id >= 20 && id <= 40) {
          eff = Math.min(97.0, eff + 5.0); // High output run
        }
      } else if (dateDay === 29) {
        // 29 Jul: Yarn friction / speed loss day
        if (id === 88) {
          eff = 72.0;
          stoppedMinutes = 260;
          stopReason = 'Yarn Package Friction Drag';
          currentState = 'SLOW';
        } else if (id === 124) {
          eff = 74.5;
          stoppedMinutes = 220;
          stopReason = 'Weft Feeder Sensor Error';
          currentState = 'WEFT_STOP';
        }
      } else if (dateDay === 28) {
        // 28 Jul: Major mechanical breakdown day
        if (id === 64) {
          eff = 58.4;
          stoppedMinutes = 380;
          stopReason = 'Main Drive Motor Bearing Seizure';
          currentState = 'MECHANICAL';
        } else if (id === 140) {
          eff = 64.2;
          stoppedMinutes = 320;
          stopReason = 'Rapier Drive Clutch Fracture';
          currentState = 'MECHANICAL';
        } else if (id === 92) {
          eff = 73.1;
          stoppedMinutes = 210;
          stopReason = 'Pneumatic Solenoid Valve Leak';
          currentState = 'WEFT_STOP';
        }
      } else if (dateDay === 26) {
        // 26 Jul: Power interruption in Shed 2 (looms 65-96)
        if (id >= 65 && id <= 96) {
          eff = 74.0 + (id % 5);
          stoppedMinutes = 160;
          stopReason = 'Shed 2 Grid Power Cut Event';
          currentState = 'MECHANICAL';
        }
      } else if (dateDay === 25) {
        // 25 Jul: Peak banner day! All running optimal
        eff = Math.min(98.5, eff + 5.5);
        stoppedMinutes = 15;
        currentState = 'RUNNING';
      } else if (dateDay === 22) {
        // 22 Jul: Compressor air drop crisis (Airjets 1-40)
        if (id <= 40) {
          eff = 69.0 + (id % 6);
          stoppedMinutes = 250;
          stopReason = 'Compressor Pressure Drop (< 4.8 bar)';
          currentState = 'WEFT_STOP';
        }
      } else {
        // Other dates: dynamic variance
        if (id % 47 === (dateDay % 47)) {
          eff = 75.0;
          stoppedMinutes = 230;
          stopReason = 'Weft Insertion Sensor Error';
          currentState = 'WEFT_STOP';
        } else if (id % 59 === (dateDay % 59)) {
          eff = 77.2;
          stoppedMinutes = 210;
          stopReason = 'Warp Beam Knotting Failure';
          currentState = 'WARP_STOP';
        }
      }

      const status: 'GREEN' | 'AMBER' | 'RED' | 'GREY' =
        eff >= 90.0 ? 'GREEN' : eff >= 85.0 ? 'AMBER' : 'RED';

      const currentRpm = status === 'RED' ? 0 : Math.round(stdRpm * (eff / 100));
      const style = STYLES[id % STYLES.length];
      const weaver = WEAVERS[id % WEAVERS.length];

      return {
        loom_id: id,
        loom_no: loomNo,
        loom_type: loomType,
        metres: Math.round(eff * 5.6),
        efficiency_pct: Number(eff.toFixed(1)),
        stopped_minutes: stoppedMinutes,
        status,
        shed_name: shedName,
        bay_name: bayName,
        line_no: lineNo,
        rpm: currentRpm,
        std_rpm: stdRpm,
        fabric_sort: style,
        weaver_name: weaver.name,
        weaver_grade: weaver.grade,
        stop_reason: stopReason,
        current_state: currentState,
      };
    });
  }, [looms, selectedDate]);

  // 2. High-level telemetry summary
  const stats = useMemo(() => {
    const total = allLooms.length;
    const green = allLooms.filter((l) => l.status === 'GREEN').length;
    const amber = allLooms.filter((l) => l.status === 'AMBER').length;
    const red = allLooms.filter((l) => l.status === 'RED').length;
    const totalMeters = allLooms.reduce((acc, l) => acc + l.metres, 0);
    const avgEff = (allLooms.reduce((acc, l) => acc + l.efficiency_pct, 0) / (total || 1)).toFixed(1);
    const avgRpm = Math.round(allLooms.reduce((acc, l) => acc + (l.rpm || 0), 0) / (total || 1));
    const runningCount = allLooms.filter((l) => (l.rpm ?? 0) > 0).length;

    return { total, green, amber, red, totalMeters, avgEff, avgRpm, runningCount };
  }, [allLooms]);

  // 3. Filter and search logic
  const filteredLooms = useMemo(() => {
    return allLooms
      .filter((loom) => {
        // Shed filter
        if (selectedShed === 'AIRJET_1' && loom.shed_name !== 'Airjet Shed 1') return false;
        if (selectedShed === 'AIRJET_2' && loom.shed_name !== 'Airjet Shed 2') return false;
        if (selectedShed === 'RAPIER' && loom.shed_name !== 'Rapier Shed') return false;

        // Status filter
        if (statusFilter === 'CRITICAL' && loom.status !== 'RED') return false;
        if (statusFilter === 'WARNING' && loom.status !== 'AMBER') return false;
        if (statusFilter === 'OPTIMAL' && loom.status !== 'GREEN') return false;

        // Search
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchNo = loom.loom_no.toLowerCase().includes(q);
          const matchStyle = loom.fabric_sort?.toLowerCase().includes(q) ?? false;
          const matchWeaver = loom.weaver_name?.toLowerCase().includes(q) ?? false;
          const matchReason = loom.stop_reason?.toLowerCase().includes(q) ?? false;
          const matchType = loom.loom_type.toLowerCase().includes(q);
          if (!matchNo && !matchStyle && !matchWeaver && !matchReason && !matchType) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'EFFICIENCY_ASC') return a.efficiency_pct - b.efficiency_pct;
        if (sortOption === 'DOWNTIME_DESC') return b.stopped_minutes - a.stopped_minutes;
        if (sortOption === 'OUTPUT_DESC') return b.metres - a.metres;
        return a.loom_id - b.loom_id;
      });
  }, [allLooms, selectedShed, statusFilter, searchTerm, sortOption]);

  // Group by Shed and Bay for the Spatial Floor Plan
  const spatialHierarchy = useMemo(() => {
    const sheds = [
      { id: 'Airjet Shed 1', name: 'Airjet Shed 1 (Toyota JAT810)', total: 64 },
      { id: 'Airjet Shed 2', name: 'Airjet Shed 2 (Tsudakoma ZAX)', total: 64 },
      { id: 'Rapier Shed', name: 'Rapier Shed (Sulzer 340/280)', total: 64 },
    ];

    return sheds
      .map((shed) => {
        const shedLooms = filteredLooms.filter((l) => l.shed_name === shed.id);
        const bays = Array.from({ length: 8 }, (_, bIdx) => {
          const bayName = `Bay ${bIdx + 1}`;
          const bayLooms = shedLooms.filter((l) => l.bay_name === bayName);
          const line1 = bayLooms.filter((l) => l.line_no === 1);
          const line2 = bayLooms.filter((l) => l.line_no === 2);
          return { bayName, bayLooms, line1, line2 };
        }).filter((b) => b.bayLooms.length > 0);

        return {
          ...shed,
          shedLooms,
          bays,
        };
      })
      .filter((s) => s.shedLooms.length > 0);
  }, [filteredLooms]);

  // Helpers
  const getStatusColor = (status: string) => {
    if (status === 'GREEN') return '#16A34A';
    if (status === 'AMBER') return '#D97706';
    if (status === 'RED') return '#DC2626';
    return '#64748B';
  };

  const getStatusBg = (status: string) => {
    if (status === 'GREEN') return '#F0FDF4';
    if (status === 'AMBER') return '#FFFBEB';
    if (status === 'RED') return '#FEF2F2';
    return '#F8FAFC';
  };

  const getStatusBorder = (status: string) => {
    if (status === 'GREEN') return '#BBF7D0';
    if (status === 'AMBER') return '#FDE68A';
    if (status === 'RED') return '#FECACA';
    return '#E2E8F0';
  };

  return (
    <div
      className="loom-production-floor-suite"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E6EA',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── TOP EXECUTIVE TELEMETRY RIBBON ───────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
          borderBottom: '1px solid #E2E8F0',
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              background: '#1E3A5F',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Gauge size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0F172A',
                  letterSpacing: '-0.01em',
                }}
              >
                Shed Production Intelligence & Floor Map
              </h3>
              <span
                style={{
                  background: '#E2E8F0',
                  color: '#334155',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '10px',
                }}
              >
                192 Looms Connected
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
              Spatial live floor status across Airjet Shed 1 (AJ-001–064), Airjet Shed 2 (AJ-065–128) & Rapier Shed (SZ-001–064).
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            onClick={() => setStatusFilter(statusFilter === 'OPTIMAL' ? 'ALL' : 'OPTIMAL')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: statusFilter === 'OPTIMAL' ? '#DCFCE7' : '#FFFFFF',
              border: `1px solid ${statusFilter === 'OPTIMAL' ? '#16A34A' : '#E2E8F0'}`,
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#166534',
              transition: 'all 0.15s ease',
            }}
            title="Click to toggle filter"
          >
            <CheckCircle2 size={13} color="#16A34A" />
            <span>&ge; 90% Optimal:</span>
            <strong>{stats.green}</strong>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'WARNING' ? 'ALL' : 'WARNING')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: statusFilter === 'WARNING' ? '#FEF3C7' : '#FFFFFF',
              border: `1px solid ${statusFilter === 'WARNING' ? '#D97706' : '#E2E8F0'}`,
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#92400E',
              transition: 'all 0.15s ease',
            }}
            title="Click to toggle filter"
          >
            <AlertTriangle size={13} color="#D97706" />
            <span>85–89% Risk:</span>
            <strong>{stats.amber}</strong>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: statusFilter === 'CRITICAL' ? '#FEE2E2' : '#FFFFFF',
              border: `1px solid ${statusFilter === 'CRITICAL' ? '#DC2626' : '#E2E8F0'}`,
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#991B1B',
              animation: stats.red > 0 ? 'pulse 2s infinite' : 'none',
              transition: 'all 0.15s ease',
            }}
            title="Click to focus on critical stopped looms"
          >
            <Flame size={13} color="#DC2626" />
            <span>&lt; 85% Stopped/Crit:</span>
            <strong>{stats.red}</strong>
          </div>

          <div
            style={{
              borderLeft: '1px solid #CBD5E1',
              paddingLeft: '10px',
              marginLeft: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '11px',
              color: '#475569',
            }}
          >
            <div>
              Speed: <strong style={{ color: '#0F172A' }}>{stats.avgRpm} RPM</strong>
            </div>
            <div>
              Output: <strong style={{ color: '#0F172A' }}>{stats.totalMeters.toLocaleString()} m</strong>
            </div>
            <div>
              Fleet OEE: <strong style={{ color: '#16A34A' }}>{stats.avgEff}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR: CONTROLS, VIEW MODES & FILTERS ─────────────────────── */}
      <div
        style={{
          padding: '10px 18px',
          borderBottom: '1px solid #E2E8F0',
          background: '#FFFFFF',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        {/* Left: View Mode Segmented Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginRight: '4px' }}>
            View:
          </span>
          <div
            style={{
              display: 'inline-flex',
              background: '#F1F5F9',
              padding: '2px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
            }}
          >
            <button
              onClick={() => setViewMode('SPATIAL_FLOOR')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'SPATIAL_FLOOR' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'SPATIAL_FLOOR' ? '#1E3A5F' : '#64748B',
                boxShadow: viewMode === 'SPATIAL_FLOOR' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <MapPin size={12} />
              Shed Floor (Bays & Aisles)
            </button>
            <button
              onClick={() => setViewMode('TELEMETRY_CARDS')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'TELEMETRY_CARDS' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'TELEMETRY_CARDS' ? '#1E3A5F' : '#64748B',
                boxShadow: viewMode === 'TELEMETRY_CARDS' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <LayoutGrid size={12} />
              Dense Machine Cards
            </button>
            <button
              onClick={() => setViewMode('BAY_SUMMARY')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'BAY_SUMMARY' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'BAY_SUMMARY' ? '#1E3A5F' : '#64748B',
                boxShadow: viewMode === 'BAY_SUMMARY' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <Layers size={12} />
              Bay Rollup
            </button>
          </div>
        </div>

        {/* Center: Shed Selector Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {(
            [
              { id: 'ALL', label: 'All Sheds (192)' },
              { id: 'AIRJET_1', label: 'Airjet Shed 1 (64)' },
              { id: 'AIRJET_2', label: 'Airjet Shed 2 (64)' },
              { id: 'RAPIER', label: 'Rapier Shed (64)' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedShed(s.id)}
              style={{
                padding: '4px 9px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '4px',
                cursor: 'pointer',
                border: '1px solid',
                background: selectedShed === s.id ? '#EFF6FF' : '#FFFFFF',
                borderColor: selectedShed === s.id ? '#3B82F6' : '#E2E8F0',
                color: selectedShed === s.id ? '#1D4ED8' : '#64748B',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Right: Search & Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search box */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={13}
              style={{ position: 'absolute', left: '8px', color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="Search Loom, Sort, Weaver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '4px 8px 4px 26px',
                fontSize: '11.5px',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                width: '180px',
                outline: 'none',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  padding: 0,
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              color: '#334155',
              background: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="EFFICIENCY_ASC">Lowest Efficiency First (Attention)</option>
            <option value="DOWNTIME_DESC">Most Downtime First</option>
            <option value="OUTPUT_DESC">Highest Metres First</option>
            <option value="LOOM_NO_ASC">Loom Number (Asc)</option>
          </select>
        </div>
      </div>

      {/* Filter banner if active */}
      {(statusFilter !== 'ALL' || selectedShed !== 'ALL' || searchTerm) && (
        <div
          style={{
            background: '#F0F9FF',
            borderBottom: '1px solid #BAE6FD',
            padding: '6px 18px',
            fontSize: '11px',
            color: '#0369A1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>
            Filtering: Showing <strong>{filteredLooms.length}</strong> of 192 looms
            {statusFilter !== 'ALL' && ` • Status: ${statusFilter}`}
            {selectedShed !== 'ALL' && ` • Shed: ${selectedShed}`}
            {searchTerm && ` • Matching: "${searchTerm}"`}
          </span>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setSelectedShed('ALL');
              setSearchTerm('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284C7',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <div style={{ padding: '16px 18px', background: '#F8FAFC', minHeight: '380px' }}>
        {filteredLooms.length === 0 ? (
          <div
            style={{
              padding: '48px',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: '6px',
              border: '1px dashed #CBD5E1',
              color: '#64748B',
            }}
          >
            <AlertTriangle size={24} color="#F59E0B" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>
              No Looms Found Matching Current Criteria
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Try adjusting your search query, status filter, or shed selection.
            </div>
          </div>
        ) : viewMode === 'SPATIAL_FLOOR' ? (
          /* ── VIEW 1: SPATIAL MILL FLOOR (BAYS & AISLES) ──────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {spatialHierarchy.map((shed) => (
              <div
                key={shed.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                }}
              >
                {/* Shed Section Title */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#2563EB',
                      }}
                    />
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0F172A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {shed.name}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      ({shed.shedLooms.length} Looms shown)
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Layout: 8 Production Bays • Dual Lines with Central Weaver Gangway
                  </div>
                </div>

                {/* Bays Grid in this Shed */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {shed.bays.map((bay) => (
                    <div
                      key={bay.bayName}
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      {/* Bay Header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          color: '#475569',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid #E2E8F0',
                          paddingBottom: '4px',
                        }}
                      >
                        <span>{bay.bayName}</span>
                        <span style={{ fontWeight: 500, color: '#64748B' }}>
                          {bay.bayLooms.filter((l) => l.status === 'RED').length > 0 ? (
                            <span style={{ color: '#DC2626', fontWeight: 700 }}>
                              ⚠️ {bay.bayLooms.filter((l) => l.status === 'RED').length} Stopped
                            </span>
                          ) : (
                            <span style={{ color: '#16A34A' }}>Running Normal</span>
                          )}
                        </span>
                      </div>

                      {/* Line 1 (North Rack) */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                        {bay.line1.map((loom) => renderLoomNode(loom))}
                      </div>

                      {/* Central Weaver Alleyway */}
                      <div
                        style={{
                          background: '#E2E8F0',
                          height: '14px',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '8.5px',
                          fontWeight: 600,
                          color: '#64748B',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}
                      >
                        ⇌ Weaver Alleyway
                      </div>

                      {/* Line 2 (South Rack) */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                        {bay.line2.map((loom) => renderLoomNode(loom))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'TELEMETRY_CARDS' ? (
          /* ── VIEW 2: DENSE MACHINE TELEMETRY CARDS ───────────────────────── */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '10px',
            }}
          >
            {filteredLooms.map((loom) => (
              <div
                key={loom.loom_id}
                onClick={() => setActiveLoom(loom)}
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${activeLoom?.loom_id === loom.loom_id ? '#2563EB' : getStatusBorder(loom.status)}`,
                  borderRadius: '6px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  boxShadow:
                    activeLoom?.loom_id === loom.loom_id
                      ? '0 0 0 2px rgba(37,99,235,0.2)'
                      : '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {/* Card Header: Loom & Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getStatusColor(loom.status),
                        boxShadow: loom.status === 'RED' ? '0 0 6px #DC2626' : 'none',
                      }}
                    />
                    <strong style={{ fontSize: '13px', color: '#0F172A' }}>{loom.loom_no}</strong>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: getStatusColor(loom.status),
                      background: getStatusBg(loom.status),
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: `1px solid ${getStatusBorder(loom.status)}`,
                    }}
                  >
                    {loom.efficiency_pct}%
                  </span>
                </div>

                {/* Machine Subtitle */}
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                  {loom.loom_type} • {loom.bay_name}
                </div>

                {/* Progress bar */}
                <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(loom.efficiency_pct, 100)}%`,
                      background: getStatusColor(loom.status),
                    }}
                  />
                </div>

                {/* Telemetry Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4px',
                    fontSize: '10.5px',
                    padding: '4px 0',
                    borderTop: '1px solid #F1F5F9',
                  }}
                >
                  <div>
                    <span style={{ color: '#94A3B8' }}>Speed: </span>
                    <strong style={{ color: loom.status === 'RED' ? '#DC2626' : '#1E293B' }}>
                      {loom.rpm} RPM
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#94A3B8' }}>Output: </span>
                    <strong style={{ color: '#1E293B' }}>{loom.metres} m</strong>
                  </div>
                </div>

                {/* Stop reason or style */}
                {loom.stop_reason ? (
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#DC2626',
                      background: '#FEF2F2',
                      padding: '3px 6px',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={loom.stop_reason}
                  >
                    ⚠️ {loom.stop_reason} ({loom.stopped_minutes}m)
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#475569',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={loom.fabric_sort}
                  >
                    Sort: {loom.fabric_sort}
                  </div>
                )}

                {/* Weaver & Action triggers */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    color: '#64748B',
                    paddingTop: '4px',
                    borderTop: '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <User size={10} />
                    <span>{loom.weaver_name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExplainLoom(loom.loom_no);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563EB',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '10px',
                        padding: 0,
                      }}
                      title="Explain root cause with AI"
                    >
                      AI
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLoom(loom.loom_id);
                      }}
                      style={{
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '2px',
                        color: '#1D4ED8',
                        fontSize: '9.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '1px 4px',
                      }}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── VIEW 3: BAY WORKLOAD & SUMMARY ROLLUP ────────────────────────── */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '14px',
            }}
          >
            {spatialHierarchy.flatMap((s) =>
              s.bays.map((bay) => {
                const totalBayMetres = bay.bayLooms.reduce((acc, l) => acc + l.metres, 0);
                const avgBayEff = (
                  bay.bayLooms.reduce((acc, l) => acc + l.efficiency_pct, 0) / (bay.bayLooms.length || 1)
                ).toFixed(1);
                const stoppedCount = bay.bayLooms.filter((l) => l.status === 'RED').length;
                const warningCount = bay.bayLooms.filter((l) => l.status === 'AMBER').length;
                const weaversInBay = Array.from(new Set(bay.bayLooms.map((l) => l.weaver_name))).filter(Boolean);

                return (
                  <div
                    key={`${s.id}-${bay.bayName}`}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#0F172A' }}>
                          {s.name.split(' (')[0]} • {bay.bayName}
                        </strong>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {bay.bayLooms.length} Looms Assigned
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: Number(avgBayEff) >= 90 ? '#16A34A' : '#D97706',
                        }}
                      >
                        {avgBayEff}%
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '6px',
                        background: '#F8FAFC',
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <span style={{ color: '#64748B' }}>Output:</span>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{totalBayMetres} m</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748B' }}>Stopped:</span>
                        <div style={{ fontWeight: 700, color: stoppedCount > 0 ? '#DC2626' : '#16A34A' }}>
                          {stoppedCount}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#64748B' }}>Warning:</span>
                        <div style={{ fontWeight: 700, color: warningCount > 0 ? '#D97706' : '#64748B' }}>
                          {warningCount}
                        </div>
                      </div>
                    </div>

                    {/* Loom mini-nodes list in this bay */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {bay.bayLooms.map((l) => (
                        <div
                          key={l.loom_id}
                          onClick={() => setActiveLoom(l)}
                          style={{
                            padding: '3px 6px',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: getStatusBg(l.status),
                            color: getStatusColor(l.status),
                            border: `1px solid ${getStatusBorder(l.status)}`,
                          }}
                          title={`${l.loom_no}: ${l.efficiency_pct}% (${l.rpm} RPM)`}
                        >
                          {l.loom_no} ({l.efficiency_pct}%)
                        </div>
                      ))}
                    </div>

                    {/* Weavers assigned */}
                    <div style={{ fontSize: '10.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={11} />
                      <span>Weavers: {weaversInBay.join(', ')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── INTERACTIVE LOOM DETAIL INSPECTION DRAWER / POPOVER ──────────── */}
      {activeLoom && (
        <div
          style={{
            borderTop: '2px solid #2563EB',
            background: '#FFFFFF',
            padding: '16px 20px',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Machine identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: getStatusBg(activeLoom.status),
                border: `1px solid ${getStatusBorder(activeLoom.status)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cpu size={24} color={getStatusColor(activeLoom.status)} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                  Loom {activeLoom.loom_no}
                </h4>
                <span
                  style={{
                    background: getStatusBg(activeLoom.status),
                    color: getStatusColor(activeLoom.status),
                    border: `1px solid ${getStatusBorder(activeLoom.status)}`,
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {activeLoom.efficiency_pct}% Efficiency
                </span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  {activeLoom.loom_type} • {activeLoom.shed_name} ({activeLoom.bay_name})
                </span>
              </div>

              <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
                Active Sort: <strong>{activeLoom.fabric_sort}</strong> • Assigned Weaver:{' '}
                <strong>
                  {activeLoom.weaver_name} ({activeLoom.weaver_grade})
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Telemetry Pill Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
            <div style={{ background: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <span style={{ color: '#64748B', display: 'block', fontSize: '10px' }}>SPEED STATUS</span>
              <strong style={{ color: activeLoom.status === 'RED' ? '#DC2626' : '#0F172A' }}>
                {activeLoom.rpm} RPM{' '}
                <span style={{ color: '#94A3B8', fontWeight: 400 }}>/ {activeLoom.std_rpm} Std</span>
              </strong>
            </div>

            <div style={{ background: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <span style={{ color: '#64748B', display: 'block', fontSize: '10px' }}>SHIFT OUTPUT</span>
              <strong style={{ color: '#0F172A' }}>{activeLoom.metres} Metres</strong>
            </div>

            <div style={{ background: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <span style={{ color: '#64748B', display: 'block', fontSize: '10px' }}>STOPPED TIME</span>
              <strong style={{ color: activeLoom.stopped_minutes > 120 ? '#DC2626' : '#D97706' }}>
                {activeLoom.stopped_minutes} min
              </strong>
            </div>

            {activeLoom.stop_reason && (
              <div
                style={{
                  background: '#FEF2F2',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #FECACA',
                }}
              >
                <span style={{ color: '#DC2626', display: 'block', fontSize: '10px', fontWeight: 700 }}>
                  CURRENT ROOT REASON
                </span>
                <strong style={{ color: '#991B1B', fontSize: '11px' }}>{activeLoom.stop_reason}</strong>
              </div>
            )}
          </div>

          {/* Action triggers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onExplainLoom(activeLoom.loom_no)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F0FDF4',
                color: '#166534',
                border: '1px solid #BBF7D0',
                borderRadius: '6px',
                padding: '7px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Sparkles size={14} color="#16A34A" />
              Ask AI Root Cause
            </button>

            <button
              onClick={() => onSelectLoom(activeLoom.loom_id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(37,99,235,0.2)',
              }}
            >
              <Eye size={14} />
              Open Full Profile
            </button>

            <button
              onClick={() => setActiveLoom(null)}
              style={{
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '6px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
              title="Close inspection"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ── HELPER: RENDER COMPACT INDUSTRIAL LOOM NODE FOR FLOOR MAP ─────────────
  function renderLoomNode(loom: LoomHeatmapItem) {
    const isSelected = activeLoom?.loom_id === loom.loom_id;
    const isCritical = loom.status === 'RED';

    return (
      <div
        key={loom.loom_id}
        onClick={() => setActiveLoom(loom)}
        style={{
          background: isSelected ? '#EFF6FF' : getStatusBg(loom.status),
          border: `1px solid ${isSelected ? '#2563EB' : getStatusBorder(loom.status)}`,
          borderRadius: '4px',
          padding: '5px 6px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          boxShadow: isSelected
            ? '0 0 0 2px rgba(37,99,235,0.3)'
            : isCritical
            ? '0 0 4px rgba(220,38,38,0.25)'
            : 'none',
          position: 'relative',
          transition: 'all 0.12s ease',
        }}
        title={`${loom.loom_no} (${loom.loom_type}): ${loom.efficiency_pct}% • Speed: ${loom.rpm} RPM • ${loom.weaver_name}${loom.stop_reason ? ` • ⚠️ ${loom.stop_reason}` : ''}`}
      >
        {/* Top: Loom No & Status Dot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1,
            }}
          >
            {loom.loom_no.replace('AJ-', '').replace('SZ-', '#')}
          </span>

          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: getStatusColor(loom.status),
              boxShadow: isCritical ? '0 0 4px #DC2626' : 'none',
            }}
          />
        </div>

        {/* Center: Efficiency % */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: getStatusColor(loom.status),
            lineHeight: 1.1,
          }}
        >
          {loom.efficiency_pct}%
        </div>

        {/* Bottom: Speed or Stop alert */}
        <div
          style={{
            fontSize: '8.5px',
            fontWeight: 600,
            color: isCritical ? '#DC2626' : '#64748B',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1,
          }}
        >
          {isCritical ? 'STOPPED' : `${loom.rpm} RPM`}
        </div>
      </div>
    );
  }
};
