import { useState } from 'react';
import { CommandCenterView } from './components/CommandCenterView';
import { ProductionIntelligenceView } from './components/ProductionIntelligenceView';
import { BreakdownBoardView } from './components/BreakdownBoardView';
import { LoomDetailView } from './components/LoomDetailView';
import { OperationsView } from './components/OperationsView';
import { ManpowerIntelligenceView } from './components/ManpowerIntelligenceView';
import { MaintenanceIntelligenceView } from './components/MaintenanceIntelligenceView';
import { AirCompressorView } from './components/AirCompressorView';
import { QualityIntelligenceView } from './components/QualityIntelligenceView';
import { WorkforceIntelligenceView } from './components/WorkforceIntelligenceView';
import { RevenueLossView } from './components/RevenueLossView';
import { PredictionCenterView } from './components/PredictionCenterView';
import { DecisionRegistryView } from './components/DecisionRegistryView';
import { DataQualityImportView } from './components/DataQualityImportView';
import { AskEngineView } from './components/AskEngineView';
import { ExportsView } from './components/ExportsView';
import { AiAgentsHubView } from './components/AiAgentsHubView';
import type { AgentTab } from './components/AiAgentsHubView';
import {
  Activity,
  Award,
  Bot,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Cpu,
  Factory,
  FileText,
  HelpCircle,
  IndianRupee,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  ShieldAlert,
  UploadCloud,
  Users,
  Wind,
  Wrench,
  Clock,
  User,
} from 'lucide-react';

export type ViewMode =
  | 'command-center'
  | 'production'
  | 'breakdowns'
  | 'looms'
  | 'operations'
  | 'agents'
  | 'workforce'
  | 'manpower'
  | 'maintenance'
  | 'air'
  | 'quality'
  | 'revenue'
  | 'predictions'
  | 'registry'
  | 'import'
  | 'assistant'
  | 'exports';

export type ProductionSubmodule = 'daily' | 'performance' | 'trends' | 'reports';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('command-center');
  const [productionSubmodule, setProductionSubmodule] = useState<ProductionSubmodule>('daily');
  const [showProductionGroup, setShowProductionGroup] = useState<boolean>(true);
  const [initialAgentTab, setInitialAgentTab] = useState<AgentTab>('watchtower');
  const [selectedLoomId, setSelectedLoomId] = useState<number | null>(118);
  const [showSupportSection, setShowSupportSection] = useState<boolean>(true);

  const handleSelectLoom = (loomId: number) => {
    setSelectedLoomId(loomId);
    setCurrentView('looms');
  };

  const handleNavigate = (view: string, loomId?: number) => {
    if (loomId) setSelectedLoomId(loomId);
    setCurrentView(view as ViewMode);
  };

  return (
    <div className="app-container">
      {/* ── Light Enterprise Sidebar Navigation ─────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-title">
            <Factory size={18} color="#2563EB" />
            <span>LOOM AI</span>
          </div>
          <div className="brand-sub">Ashok Textile Mills — Weaving</div>
        </div>

        <nav className="sidebar-nav">
          {/* OVERVIEW */}
          <div className="nav-section-label">OVERVIEW</div>
          <button
            className={`nav-item ${currentView === 'command-center' ? 'active' : ''}`}
            onClick={() => setCurrentView('command-center')}
          >
            <LayoutDashboard size={16} />
            <span>Command Center</span>
          </button>

          {/* OPERATIONS */}
          <div className="nav-section-label" style={{ marginTop: '8px' }}>OPERATIONS</div>
          
          {/* PRODUCTION Head Module */}
          <div style={{ marginBottom: '4px' }}>
            <button
              className={`nav-item ${currentView === 'production' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('production');
                setShowProductionGroup(true);
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} />
                <span style={{ fontWeight: 700 }}>PRODUCTION</span>
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProductionGroup(!showProductionGroup);
                }}
                style={{ padding: '2px', display: 'flex' }}
              >
                {showProductionGroup ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </span>
            </button>

            {showProductionGroup && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', paddingLeft: '22px', marginTop: '2px' }}>
                <button
                  onClick={() => {
                    setCurrentView('production');
                    setProductionSubmodule('daily');
                  }}
                  style={{
                    background: (currentView === 'production' && productionSubmodule === 'daily') ? '#EFF6FF' : 'transparent',
                    color: (currentView === 'production' && productionSubmodule === 'daily') ? '#2563EB' : 'var(--text-secondary)',
                    fontWeight: (currentView === 'production' && productionSubmodule === 'daily') ? 700 : 500,
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Daily Production
                </button>
                <button
                  onClick={() => {
                    setCurrentView('production');
                    setProductionSubmodule('performance');
                  }}
                  style={{
                    background: (currentView === 'production' && productionSubmodule === 'performance') ? '#EFF6FF' : 'transparent',
                    color: (currentView === 'production' && productionSubmodule === 'performance') ? '#2563EB' : 'var(--text-secondary)',
                    fontWeight: (currentView === 'production' && productionSubmodule === 'performance') ? 700 : 500,
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Loom Performance
                </button>
                <button
                  onClick={() => {
                    setCurrentView('production');
                    setProductionSubmodule('trends');
                  }}
                  style={{
                    background: (currentView === 'production' && productionSubmodule === 'trends') ? '#EFF6FF' : 'transparent',
                    color: (currentView === 'production' && productionSubmodule === 'trends') ? '#2563EB' : 'var(--text-secondary)',
                    fontWeight: (currentView === 'production' && productionSubmodule === 'trends') ? 700 : 500,
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Trends & History
                </button>
                <button
                  onClick={() => {
                    setCurrentView('production');
                    setProductionSubmodule('reports');
                  }}
                  style={{
                    background: (currentView === 'production' && productionSubmodule === 'reports') ? '#EFF6FF' : 'transparent',
                    color: (currentView === 'production' && productionSubmodule === 'reports') ? '#2563EB' : 'var(--text-secondary)',
                    fontWeight: (currentView === 'production' && productionSubmodule === 'reports') ? 700 : 500,
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Reports
                </button>
              </div>
            )}
          </div>

          <button
            className={`nav-item ${currentView === 'breakdowns' ? 'active' : ''}`}
            onClick={() => setCurrentView('breakdowns')}
          >
            <Wrench size={16} />
            <span>Breakdowns</span>
          </button>

          <button
            className={`nav-item ${currentView === 'looms' ? 'active' : ''}`}
            onClick={() => setCurrentView('looms')}
          >
            <Cpu size={16} />
            <span>Looms</span>
          </button>

          <button
            className={`nav-item ${currentView === 'operations' ? 'active' : ''}`}
            onClick={() => setCurrentView('operations')}
          >
            <LayoutGrid size={16} />
            <span>Operations Table</span>
          </button>

          {/* BUSINESS */}
          <div className="nav-section-label" style={{ marginTop: '8px' }}>BUSINESS</div>
          <button
            className={`nav-item ${currentView === 'revenue' ? 'active' : ''}`}
            onClick={() => setCurrentView('revenue')}
          >
            <IndianRupee size={16} />
            <span>Revenue & Loss</span>
          </button>

          {/* OPERATIONS SUPPORT */}
          <div style={{ marginTop: '8px' }}>
            <button
              onClick={() => setShowSupportSection(!showSupportSection)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '8px 10px 4px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                textTransform: 'uppercase',
              }}
            >
              <span>OPERATIONS SUPPORT</span>
              {showSupportSection ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>

            {showSupportSection && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button
                  className={`nav-item ${currentView === 'workforce' ? 'active' : ''}`}
                  onClick={() => setCurrentView('workforce')}
                >
                  <Award size={16} />
                  <span>Workforce Intelligence</span>
                </button>

                <button
                  className={`nav-item ${currentView === 'manpower' ? 'active' : ''}`}
                  onClick={() => setCurrentView('manpower')}
                >
                  <Users size={16} />
                  <span>Manpower Roster</span>
                </button>

                <button
                  className={`nav-item ${currentView === 'maintenance' ? 'active' : ''}`}
                  onClick={() => setCurrentView('maintenance')}
                >
                  <Activity size={16} />
                  <span>Maintenance</span>
                </button>

                <button
                  className={`nav-item ${currentView === 'air' ? 'active' : ''}`}
                  onClick={() => setCurrentView('air')}
                >
                  <Wind size={16} />
                  <span>Air & Compressor</span>
                </button>

                <button
                  className={`nav-item ${currentView === 'quality' ? 'active' : ''}`}
                  onClick={() => setCurrentView('quality')}
                >
                  <FileText size={16} />
                  <span>Quality & Defects</span>
                </button>
              </div>
            )}
          </div>

          {/* AI & AGENTS */}
          <div className="nav-section-label" style={{ marginTop: '8px' }}>AI & OPERATIONAL AGENTS</div>
          <button
            className={`nav-item ${currentView === 'agents' ? 'active' : ''}`}
            onClick={() => {
              setInitialAgentTab('watchtower');
              setCurrentView('agents');
            }}
          >
            <ShieldAlert size={16} color="#2563EB" />
            <span>AI Agents Hub (6)</span>
          </button>

          {/* INTELLIGENCE */}
          <div className="nav-section-label" style={{ marginTop: '8px' }}>INTELLIGENCE</div>
          <button
            className={`nav-item ${currentView === 'predictions' ? 'active' : ''}`}
            onClick={() => setCurrentView('predictions')}
          >
            <BrainCircuit size={16} />
            <span>Prediction Center</span>
          </button>

          <button
            className={`nav-item ${currentView === 'registry' ? 'active' : ''}`}
            onClick={() => setCurrentView('registry')}
          >
            <HelpCircle size={16} />
            <span>Decision Registry</span>
          </button>

          <button
            className={`nav-item ${currentView === 'assistant' ? 'active' : ''}`}
            onClick={() => setCurrentView('assistant')}
          >
            <Bot size={16} />
            <span>Decision Assistant</span>
          </button>

          {/* DATA */}
          <div className="nav-section-label" style={{ marginTop: '8px' }}>DATA</div>
          <button
            className={`nav-item ${currentView === 'import' ? 'active' : ''}`}
            onClick={() => setCurrentView('import')}
          >
            <UploadCloud size={16} />
            <span>Data Ingestion</span>
          </button>

          <button
            className={`nav-item ${currentView === 'exports' ? 'active' : ''}`}
            onClick={() => setCurrentView('exports')}
          >
            <FileText size={16} />
            <span>Reports & Exports</span>
          </button>
        </nav>

        {/* Footer Meta */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>Telemetry:</span>
            <strong style={{ color: '#059669' }}>Connected (192)</strong>
          </div>
          <div>DQI Score: <strong>97.4%</strong></div>
        </div>
      </aside>

      {/* ── Main Workspace Area ─────────────────────────────────────────── */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            {currentView === 'command-center' && 'Command Center'}
            {currentView === 'agents' && 'AI & Operational Agents Hub · Watchtower, Loss Hunter & Action Manager'}
            {currentView === 'production' && `Production Intelligence · ${
              productionSubmodule === 'daily' ? 'Daily Production Workspace' :
              productionSubmodule === 'performance' ? 'Loom & Weaver Performance' :
              productionSubmodule === 'trends' ? 'Production Trends & History' : 'Management Reports'
            }`}
            {currentView === 'breakdowns' && 'Breakdowns & Downtime'}
            {currentView === 'revenue' && 'Revenue & Loss Attribution'}
            {currentView === 'looms' && 'Loom 360° Profile'}
            {currentView === 'operations' && 'Daily Operations Table'}
            {currentView === 'workforce' && 'Weaving Workforce Intelligence · Grade, Skill & Pay Progression'}
            {currentView === 'manpower' && 'Manpower Attendance & Absenteeism'}
            {currentView === 'maintenance' && 'Maintenance & Spares Schedule'}
            {currentView === 'air' && 'Compressed Air & Energy'}
            {currentView === 'quality' && 'Fabric Quality & Defects'}
            {currentView === 'predictions' && 'Machine Learning Predictions'}
            {currentView === 'registry' && 'Decision Intelligence Registry'}
            {currentView === 'import' && 'Sheet Ingestion & Validation'}
            {currentView === 'assistant' && 'AI Decision Assistant'}
            {currentView === 'exports' && 'Reports & Exports Dispatch'}
          </div>

          <div className="topbar-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>Unit: <strong>ATM Main Shed</strong></span>
              <span>Data: <strong>31 Jul 2026, 06:00</strong></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <Clock size={12} />
                <span>Updated 4 min ago</span>
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '11.5px',
                color: 'var(--text-main)',
              }}
            >
              <User size={13} color="#2563EB" />
              <span>Plant Manager</span>
            </div>
          </div>
        </header>

        <div className="page-body">
          {currentView === 'command-center' && <CommandCenterView onNavigateToModule={handleNavigate} />}
          {currentView === 'agents' && <AiAgentsHubView initialTab={initialAgentTab} onNavigateToModule={handleNavigate} />}
          {currentView === 'production' && (
            <ProductionIntelligenceView
              submodule={productionSubmodule}
              onSelectSubmodule={setProductionSubmodule}
              onSelectLoom={handleSelectLoom}
            />
          )}
          {currentView === 'breakdowns' && <BreakdownBoardView />}
          {currentView === 'revenue' && <RevenueLossView />}
          {currentView === 'looms' && <LoomDetailView loomId={selectedLoomId || 118} onBack={() => setCurrentView('production')} />}
          {currentView === 'operations' && <OperationsView onSelectLoom={handleSelectLoom} />}
          {currentView === 'workforce' && <WorkforceIntelligenceView />}
          {currentView === 'manpower' && <ManpowerIntelligenceView />}
          {currentView === 'maintenance' && <MaintenanceIntelligenceView />}
          {currentView === 'air' && <AirCompressorView />}
          {currentView === 'quality' && <QualityIntelligenceView />}
          {currentView === 'predictions' && <PredictionCenterView />}
          {currentView === 'registry' && <DecisionRegistryView />}
          {currentView === 'import' && <DataQualityImportView />}
          {currentView === 'assistant' && <AskEngineView />}
          {currentView === 'exports' && <ExportsView />}
        </div>
      </main>
    </div>
  );
}
export default App;
