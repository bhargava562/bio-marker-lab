import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Database, 
  Cpu, 
  Calculator, 
  Sliders, 
  FlaskConical, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import { DataQualityTool } from '../components/lab/DataQualityTool';
import { ModelStudioTool } from '../components/lab/ModelStudioTool';
import { ValidationTool } from '../components/lab/ValidationTool';
import { ExplainabilityTool } from '../components/lab/ExplainabilityTool';
import type { ExplorationMode } from '../types';

interface ResearchLabViewProps {
  mode: ExplorationMode;
}

export type LabTabId = 'data' | 'models' | 'validation' | 'explainability';

export const ResearchLabView: React.FC<ResearchLabViewProps> = ({ mode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTab = (searchParams.get('tab') as LabTabId) || 'data';

  const handleTabChange = (tabId: LabTabId) => {
    setSearchParams({ tab: tabId });
  };

  const tabs: { id: LabTabId; label: string; icon: React.ReactNode; desc: string; badge: string }[] = [
    {
      id: 'data',
      label: 'Data Quality',
      icon: <Database className="w-4 h-4" />,
      desc: 'Synthetic specimen audits & preprocessing',
      badge: '8 Specimens',
    },
    {
      id: 'models',
      label: 'Model Studio',
      icon: <Cpu className="w-4 h-4" />,
      desc: 'Five candidate learning architectures',
      badge: '5 Architectures',
    },
    {
      id: 'validation',
      label: 'Validation',
      icon: <Calculator className="w-4 h-4" />,
      desc: 'Confusion matrix & performance metrics',
      badge: 'Tested Math',
    },
    {
      id: 'explainability',
      label: 'Explainability',
      icon: <Sliders className="w-4 h-4" />,
      desc: 'SHAP-style attribution & guardrails',
      badge: 'Interpretability',
    },
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Research Lab Header */}
        <div className="pb-6 mb-6 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-700 mb-1 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-cyan-600" />
                <span>RESEARCH WORKBENCH · INVESTIGATION SUITE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Research Lab
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Four interactive workstations to inspect clinical laboratory data, compare candidate algorithms, evaluate diagnostic trust, and decompose predictive decisions.
              </p>
            </div>

            {/* Quick Context Switcher / CTA */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="text-xs font-medium px-3.5 py-2 min-h-[38px] rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm transition-all cursor-pointer"
              >
                ← Biomarker Explorer
              </button>
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="text-xs font-semibold px-3.5 py-2 min-h-[38px] rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>About the Science</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Local Sub-Navigation Tabs */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isActive
                      ? 'bg-white border-slate-900 text-slate-900 shadow-md ring-2 ring-slate-900/5'
                      : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <span className={isActive ? 'text-cyan-600' : 'text-slate-400'}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      isActive 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {tab.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    {tab.desc}
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-[1px] left-3 right-3 h-0.5 bg-cyan-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tool Render */}
        <div className="animate-in fade-in-50 duration-200">
          {currentTab === 'data' && <DataQualityTool mode={mode} />}
          {currentTab === 'models' && <ModelStudioTool mode={mode} />}
          {currentTab === 'validation' && <ValidationTool mode={mode} />}
          {currentTab === 'explainability' && <ExplainabilityTool mode={mode} />}
        </div>

        {/* Global Footer Sub-navigation inside Lab */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>Biomarker Lab Research Suite · Multivariable Diagnostics & Algorithmic Governance</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold tracking-wide text-[11px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Active Module: {tabs.find((t) => t.id === currentTab)?.label}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
