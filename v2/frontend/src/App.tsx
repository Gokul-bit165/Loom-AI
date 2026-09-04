import { useState } from 'react';
import { OverviewLandingView } from './components/OverviewLandingView';
import { CommandCenterView } from './components/CommandCenterView';
import { ProductionIntelligenceView } from './components/ProductionIntelligenceView';
import { BreakdownHubView } from './components/BreakdownHubView';
import type { BreakdownSubPage } from './components/BreakdownHubView';
import { RootCauseInvestigationView } from './components/RootCauseInvestigationView';
import { BreakdownAnomaliesView } from './components/BreakdownAnomaliesView';
import { BreakdownLossImpactView } from './components/BreakdownLossImpactView';
import { WhyProductionLowModal } from './components/WhyProductionLowModal';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import type { AgentTab } from './components/AiAgentsHubView';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
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
  Search,
  ShieldAlert,
  UploadCloud,
  Users,
  Wind,
  Wrench,
  Clock,
  User,
} from 'lucide-react';

export type ViewMode =
  | 'overview'
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
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [productionSubmodule, setProductionSubmodule] = useState<ProductionSubmodule>('daily');
  const [showProductionGroup, setShowProductionGroup] = useState<boolean>(true);
  const [breakdownSubPage, setBreakdownSubPage] = useState<BreakdownSubPage>('insights');
  const [breakdownContext, setBreakdownContext] = useState<{ loomId?: number; eventId?: number }>({});
  const [breakdownsExpanded, setBreakdownsExpanded] = useState<boolean>(true);
  const [showAllModules, setShowAllModules] = useState<boolean>(false);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
  const [initialAgentTab] = useState<AgentTab>('watchtower');
  const [selectedLoomId, setSelectedLoomId] = useState<number | null>(118);

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
          {/* DEMO CORE WORKSPACES */}
          <div className="nav-section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '4px' }}>
            <span>CORE DEMO MODULES</span>
            <span style={{ fontSize: '9px', background: '#DBEAFE', color: '#1D4ED8', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.04em' }}>DEMO READY</span>
          </div>

          {/* 0. EXECUTIVE OVERVIEW (LANDING) */}
          <button
            className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentView('overview')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}
          >
            <LayoutDashboard size={16} />
            <span style={{ fontWeight: 700 }}>Executive Overview</span>
          </button>
          
          {/* 1. PRODUCTION Intelligence Module */}
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
                <span style={{ fontWeight: 700 }}>Production Intelligence</span>
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
                  className={`nav-subitem ${currentView === 'production' && productionSubmodule === 'daily' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('production');
                    setProductionSubmodule('daily');
                  }}
                >
                  <BarChart3 size={13} />
                  <span>Daily Production</span>
                </button>
                <button
                  className={`nav-subitem ${currentView === 'production' && productionSubmodule === 'performance' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('production');
                    setProductionSubmodule('performance');
                  }}
                >
                  <Activity size={13} />
                  <span>Loom Performance</span>
                </button>
                <button
                  className={`nav-subitem ${currentView === 'production' && productionSubmodule === 'trends' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('production');
                    setProductionSubmodule('trends');
                  }}
                >
                  <Clock size={13} />
                  <span>Trends & History</span>
                </button>
                <button
                  className={`nav-subitem ${currentView === 'production' && productionSubmodule === 'reports' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('production');
                    setProductionSubmodule('reports');
                  }}
                >
                  <FileText size={13} />
                  <span>Management Reports</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. BREAKDOWNS INTELLIGENCE (4 Functional Workspaces) */}
          <div style={{ marginBottom: '4px' }}>
            <button
              className={`nav-item ${currentView === 'breakdowns' ? 'active' : ''}`}
              onClick={() => {
                if (currentView !== 'breakdowns') {
                  setCurrentView('breakdowns');
                  setBreakdownsExpanded(true);
                } else {
                  setBreakdownsExpanded(!breakdownsExpanded);
                }
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={16} />
                <span style={{ fontWeight: 700 }}>Breakdowns</span>
              </div>
              {breakdownsExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>

            {/* BREAKDOWNS SUB-PAGES */}
            {breakdownsExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', paddingLeft: '22px', marginTop: '2px' }}>
                <button
                  className={`nav-subitem ${currentView === 'breakdowns' && breakdownSubPage === 'insights' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('breakdowns');
                    setBreakdownSubPage('insights');
                  }}
                >
                  <BarChart3 size={13} />
                  <span>Breakdown Insights</span>
                </button>

                <button
                  className={`nav-subitem ${currentView === 'breakdowns' && breakdownSubPage === 'root-cause' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('breakdowns');
                    setBreakdownSubPage('root-cause');
                  }}
                >
                  <Search size={13} />
                  <span>Root Cause Analysis</span>
                </button>

                <button
                  className={`nav-subitem ${currentView === 'breakdowns' && breakdownSubPage === 'abnormal' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('breakdowns');
                    setBreakdownSubPage('abnormal');
                  }}
                >
                  <AlertTriangle size={13} />
                  <span>Abnormal Events</span>
                </button>

                <button
                  className={`nav-subitem ${currentView === 'breakdowns' && breakdownSubPage === 'loss-impact' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('breakdowns');
                    setBreakdownSubPage('loss-impact');
                  }}
                >
                  <IndianRupee size={13} />
                  <span>Production Loss Impact</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. WORKFORCE INTELLIGENCE (TOP-LEVEL) */}
          <button
            className={`nav-item ${currentView === 'workforce' ? 'active' : ''}`}
            onClick={() => setCurrentView('workforce')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}
          >
            <Award size={16} />
            <span style={{ fontWeight: 700 }}>Workforce Intelligence</span>
          </button>

          {/* 5. REVENUE & LOSS */}
          <button
            className={`nav-item ${currentView === 'revenue' ? 'active' : ''}`}
            onClick={() => setCurrentView('revenue')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}
          >
            <IndianRupee size={16} />
            <span style={{ fontWeight: 700 }}>Revenue & Loss</span>
          </button>

          {/* OPTIONAL EXTENDED MODULES TOGGLE (COLLAPSED BY DEFAULT FOR DEMO) */}
          <div style={{ marginTop: '16px', borderTop: '1px dashed #E2E8F0', paddingTop: '10px' }}>
            <button
              onClick={() => setShowAllModules(!showAllModules)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                fontSize: '11px',
                fontWeight: 600,
                padding: '5px 8px',
                cursor: 'pointer',
                textAlign: 'left',
                borderRadius: '4px',
              }}
            >
              <span>{showAllModules ? 'Hide other workspaces' : 'Other mill workspaces (11)'}</span>
              {showAllModules ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>

            {showAllModules && (
              <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button className={`nav-item ${currentView === 'command-center' ? 'active' : ''}`} onClick={() => setCurrentView('command-center')}>
                  <LayoutDashboard size={14} />
                  <span>Command Center</span>
                </button>
                <button className={`nav-item ${currentView === 'looms' ? 'active' : ''}`} onClick={() => setCurrentView('looms')}>
                  <Cpu size={14} />
                  <span>Loom 360° Profile</span>
                </button>
                <button className={`nav-item ${currentView === 'operations' ? 'active' : ''}`} onClick={() => setCurrentView('operations')}>
                  <LayoutGrid size={14} />
                  <span>Operations Table</span>
                </button>
                <button className={`nav-item ${currentView === 'manpower' ? 'active' : ''}`} onClick={() => setCurrentView('manpower')}>
                  <Users size={14} />
                  <span>Manpower Roster</span>
                </button>
                <button className={`nav-item ${currentView === 'maintenance' ? 'active' : ''}`} onClick={() => setCurrentView('maintenance')}>
                  <Activity size={14} />
                  <span>Maintenance</span>
                </button>
                <button className={`nav-item ${currentView === 'air' ? 'active' : ''}`} onClick={() => setCurrentView('air')}>
                  <Wind size={14} />
                  <span>Air & Compressor</span>
                </button>
                <button className={`nav-item ${currentView === 'quality' ? 'active' : ''}`} onClick={() => setCurrentView('quality')}>
                  <FileText size={14} />
                  <span>Quality & Defects</span>
                </button>
                <button className={`nav-item ${currentView === 'agents' ? 'active' : ''}`} onClick={() => setCurrentView('agents')}>
                  <ShieldAlert size={14} />
                  <span>AI Agents Hub</span>
                </button>
                <button className={`nav-item ${currentView === 'predictions' ? 'active' : ''}`} onClick={() => setCurrentView('predictions')}>
                  <BrainCircuit size={14} />
                  <span>Prediction Center</span>
                </button>
                <button className={`nav-item ${currentView === 'registry' ? 'active' : ''}`} onClick={() => setCurrentView('registry')}>
                  <HelpCircle size={14} />
                  <span>Decision Registry</span>
                </button>
                <button className={`nav-item ${currentView === 'assistant' ? 'active' : ''}`} onClick={() => setCurrentView('assistant')}>
                  <Bot size={14} />
                  <span>Decision Assistant</span>
                </button>
                <button className={`nav-item ${currentView === 'import' ? 'active' : ''}`} onClick={() => setCurrentView('import')}>
                  <UploadCloud size={14} />
                  <span>Data Ingestion</span>
                </button>
                <button className={`nav-item ${currentView === 'exports' ? 'active' : ''}`} onClick={() => setCurrentView('exports')}>
                  <FileText size={14} />
                  <span>Reports & Exports</span>
                </button>
              </div>
            )}
          </div>
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
            {currentView === 'overview' && 'Executive Overview & Factory Command'}
            {currentView === 'command-center' && 'Command Center'}
            {currentView === 'agents' && 'AI & Operational Agents Hub · Watchtower, Loss Hunter & Action Manager'}
            {currentView === 'production' && `Production Intelligence · ${
              productionSubmodule === 'daily' ? 'Daily Production Workspace' :
              productionSubmodule === 'performance' ? 'Loom & Weaver Performance' :
              productionSubmodule === 'trends' ? 'Production Trends & History' : 'Management Reports'
            }`}
            {currentView === 'breakdowns' &&
              (breakdownSubPage === 'insights'
                ? 'Breakdowns · 📊 Breakdown Insights ("What happened?")'
                : breakdownSubPage === 'root-cause'
                ? 'Breakdowns · 🔍 Root Cause Analysis ("Why did it happen?")'
                : breakdownSubPage === 'abnormal'
                ? 'Breakdowns · ⚠️ Abnormal Events ("What is unusual?")'
                : 'Breakdowns · 💰 Production Loss Impact ("What did we lose & why?")')}
            {currentView === 'revenue' && 'Revenue & Financial Loss Decision Room'}
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
            {/* Universal Header "Why is production low?" Button */}
            <button
              onClick={() => setIsWhyModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '6px',
                background: '#FEF2F2',
                border: '1.5px solid #F87171',
                color: '#B91C1C',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(220, 38, 38, 0.1)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              title="Click to analyze why production is low today"
            >
              <Search size={13} color="#DC2626" />
              <span>Why is production low?</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>Unit: <strong>ATM Main Shed</strong></span>
              <span>Data: <strong>31 Jul 2026, 06:00</strong></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <Clock size={12} />
                <span>Updated 4 min ago</span>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#065F46',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
                title="Operational factory intelligence layer active with authentic Ashok Textile Mills data"
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                <span>Live Demo</span>
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
          <ErrorBoundary key={currentView}>
            {currentView === 'overview' && (
              <OverviewLandingView
                onNavigateToModule={(view, subpage, ctx) => {
                  if (ctx) setBreakdownContext(ctx);
                  if (subpage) {
                    if (view === 'production') setProductionSubmodule(subpage as any);
                    if (view === 'breakdowns') setBreakdownSubPage(subpage as any);
                  }
                  setCurrentView(view as ViewMode);
                }}
                onOpenWhyModal={() => setIsWhyModalOpen(true)}
              />
            )}
            {currentView === 'command-center' && (
              <CommandCenterView
                onNavigateToModule={handleNavigate}
                onOpenWhyModal={() => setIsWhyModalOpen(true)}
              />
            )}
            {currentView === 'agents' && <AiAgentsHubView initialTab={initialAgentTab} onNavigateToModule={handleNavigate} />}
            {currentView === 'production' && (
              <ProductionIntelligenceView
                submodule={productionSubmodule}
                onSelectSubmodule={setProductionSubmodule}
                onSelectLoom={handleSelectLoom}
                onOpenWhyModal={() => setIsWhyModalOpen(true)}
              />
            )}
            {currentView === 'breakdowns' && (
              <>
                {breakdownSubPage === 'root-cause' ? (
                  <RootCauseInvestigationView
                    initialLoomId={breakdownContext.loomId}
                    initialEventId={breakdownContext.eventId}
                    onSelectLoom={handleSelectLoom}
                    onNavigateSubmodule={(tab, ctx) => {
                      if (ctx) setBreakdownContext(ctx);
                      setBreakdownSubPage(tab as BreakdownSubPage);
                    }}
                  />
                ) : breakdownSubPage === 'abnormal' ? (
                  <BreakdownAnomaliesView
                    initialLoomId={breakdownContext.loomId}
                    onSelectLoom={handleSelectLoom}
                    onNavigateSubmodule={(tab, ctx) => {
                      if (ctx) setBreakdownContext(ctx);
                      setBreakdownSubPage(tab as BreakdownSubPage);
                    }}
                  />
                ) : breakdownSubPage === 'loss-impact' ? (
                  <BreakdownLossImpactView
                    initialLoomId={breakdownContext.loomId}
                    onSelectLoom={handleSelectLoom}
                    onNavigateSubmodule={(tab, ctx) => {
                      if (ctx) setBreakdownContext(ctx);
                      setBreakdownSubPage(tab as BreakdownSubPage);
                    }}
                  />
                ) : (
                  <BreakdownHubView
                    activeTab={breakdownSubPage}
                    onTabChange={setBreakdownSubPage}
                    onSelectLoom={handleSelectLoom}
                    onNavigateSubmodule={(tab, ctx) => {
                      if (ctx) setBreakdownContext(ctx);
                      setBreakdownSubPage(tab as BreakdownSubPage);
                    }}
                  />
                )}
              </>
            )}
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
          </ErrorBoundary>
        </div>

        {/* Universal Why is Production Low Modal */}
        <WhyProductionLowModal
          isOpen={isWhyModalOpen}
          onClose={() => setIsWhyModalOpen(false)}
          onNavigateToLoom={handleSelectLoom}
          onNavigateToRootCause={(_loomNo) => {
            setCurrentView('breakdowns');
            setBreakdownSubPage('root-cause');
          }}
          targetMetres={10000}
          actualMetres={8200}
        />
      </main>
    </div>
  );
}
export default App;
