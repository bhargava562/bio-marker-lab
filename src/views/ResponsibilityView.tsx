import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  FileText, 
  Compass, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  HeartHandshake 
} from 'lucide-react';
import { 
  RESEARCH_STAGES, 
  WORK_PLAN_PHASES 
} from '../data/stages';
import type { ExplorationMode } from '../types';

interface ResponsibilityViewProps {
  mode: ExplorationMode;
}

export const ResponsibilityView: React.FC<ResponsibilityViewProps> = ({ mode }) => {
  const navigate = useNavigate();
  const [selectedStageNumber, setSelectedStageNumber] = useState<number>(1);

  const activeStage = RESEARCH_STAGES.find((s) => s.stageNumber === selectedStageNumber) || RESEARCH_STAGES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            Screen 07 • Research Governance & Ethics
          </span>
          <span className="text-xs text-slate-400">Sections 9, 20, 21, 23 & Table 3, 5, 6 of BRAINS Report</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">From Research to Responsibility</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Scientific performance is only one part of clinical research. Discover the formal 10-stage pathway, ethical governance, external validation requirements, and future prospective trials.
        </p>
      </div>

      {/* Hero Closing Statement Banner */}
      <div className="sci-panel p-6 mb-8 text-center bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border-cyan-500/30">
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
          “A promising model is the beginning of clinical evidence, not the end.”
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Before any computational model can inform clinical care, it must clear institutional ethics, prove demographic subgroup fairness, demonstrate reproducible external calibration, and undergo prospective clinician validation.
        </p>
      </div>

      {/* 10-Stage Research Roadmap (Table 3) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Table 3: 10-Stage Research Pathway
          </div>
          <span className="text-[11px] font-mono text-slate-400">Click a stage to inspect protocol governance</span>
        </div>

        {/* Pathway Stage Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-4">
          {RESEARCH_STAGES.map((s) => {
            const isSelected = selectedStageNumber === s.stageNumber;
            return (
              <button
                key={s.stageNumber}
                type="button"
                onClick={() => setSelectedStageNumber(s.stageNumber)}
                className={`p-2.5 rounded-lg text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={isSelected ? 'text-cyan-300 font-bold' : ''}>S-{s.stageNumber}</span>
                  {s.completed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Clock className="w-3 h-3 text-slate-600" />
                  )}
                </div>
                <div className="text-[11px] font-semibold leading-tight line-clamp-2">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        <div className="sci-panel p-5 bg-[#0b1326] border-slate-700/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-3 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                Stage {activeStage.stageNumber} of 10 • {activeStage.phaseId} ({activeStage.phaseDuration})
              </span>
              <h3 className="text-base font-bold text-white mt-1">{activeStage.title}</h3>
            </div>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
              activeStage.completed ? 'badge-established' : 'badge-caution'
            }`}>
              {activeStage.completed ? 'Protocol Defined' : 'Future Multi-Centre Milestone'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-1">Research Activity (Table 3)</div>
              <p className="text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                {activeStage.activity}
              </p>
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 mb-1">Deliverable / Output (Table 3)</div>
              <p className="text-cyan-200/90 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
                {activeStage.output}
              </p>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-indigo-300 font-mono bg-indigo-950/20 p-2.5 rounded border border-indigo-500/20">
            Governance Requirement: {activeStage.governanceNote}
          </div>
        </div>
      </div>

      {/* 4 Pillars of Responsible Clinical Research */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="sci-card p-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2.5">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Privacy & Pseudonymization</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Direct personal identifiers removed prior to analytical ingestion. Dedicated study IDs and encrypted resting stores comply with institutional patient confidentiality charters.
          </p>
        </div>

        <div className="sci-card p-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2.5">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Subgroup Fairness & Bias</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Validation must verify equal sensitivity across biological sex and age brackets, guarding against underdiagnosis in protected or minority demographic cohorts.
          </p>
        </div>

        <div className="sci-card p-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white mb-1">External Multi-Centre Trials</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Internal cross-validation cannot substitute for independent external cohorts. Locked algorithms must prove generalizability across independent clinical sites.
          </p>
        </div>

        <div className="sci-card p-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2.5">
            <FileText className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Clinician-in-the-Loop</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Decision support only. Machine outputs provide transparent biomarker evidence to augment physician expertise; they never autonomously render patient diagnoses.
          </p>
        </div>
      </div>

      {/* Table 5 Work Plan from Report (Research Explorer Mode) */}
      {mode === 'research' && (
        <div className="sci-panel p-5 mb-10">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Table 5: 12-Month Project Work Plan</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Phases I to IX</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {WORK_PLAN_PHASES.map((p) => (
              <div key={p.phase} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between font-mono text-cyan-400 mb-1">
                  <span className="font-semibold">{p.phase}</span>
                  <span className="text-[11px] text-slate-400">{p.duration}</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">{p.activities}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restart & Exploration Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="btn-sci-primary w-full sm:w-auto px-6 py-2.5 text-xs"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Revisit Biomarker Universe</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-sci-secondary w-full sm:w-auto px-6 py-2.5 text-xs"
        >
          <span>Restart Research Journey</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
