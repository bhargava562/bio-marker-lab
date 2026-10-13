import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Users, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  RotateCcw, 
  HeartHandshake 
} from 'lucide-react';
import type { ExplorationMode } from '../types';

interface ResponsibilityViewProps {
  mode: ExplorationMode;
}

export const ResponsibilityView: React.FC<ResponsibilityViewProps> = ({ mode: _mode }) => {
  const navigate = useNavigate();
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  const timelineStages = [
    {
      num: '01',
      title: 'Define the endpoint',
      summary: 'Specify exactly what the research aims to predict.',
      details: 'Whether predicting diabetes incidence, abnormal glycaemic status, or specific microvascular complications (e.g. diabetic nephropathy), the target endpoint must be clinically pre-specified before viewing analytical datasets.',
    },
    {
      num: '02',
      title: 'Secure appropriate data',
      summary: 'Establish data access, ethics and privacy safeguards.',
      details: 'Obtain institutional ethics approvals (IEC), establish data sharing governance with partner hospitals like BRAINS, and ensure patient pseudonymization with strict access controls.',
    },
    {
      num: '03',
      title: 'Prepare the evidence',
      summary: 'Document data quality and preprocessing decisions.',
      details: 'Audit laboratory measurement unit consistency (e.g. mg/dL vs mmol/L), identify biological implausibilities, and apply imputation algorithms strictly within training folds to avoid target leakage.',
    },
    {
      num: '04',
      title: 'Develop and test models',
      summary: 'Compare candidate methods with appropriate evaluation.',
      details: 'Evaluate baseline logistic regression against nonlinear boosted trees using nested cross-validation, prioritizing sensitivity, specificity, and probability calibration over raw accuracy.',
    },
    {
      num: '05',
      title: 'Check generalisability',
      summary: 'Investigate subgroup performance and independent validation.',
      details: 'Verify that sensitivity remains equitable across biological sex and age brackets, and evaluate locked algorithm configurations on independent multi-centre external cohorts.',
    },
    {
      num: '06',
      title: 'Assess clinical usefulness',
      summary: 'Seek expert review before considering real-world use.',
      details: 'Conduct clinician usability trials and assess whether multivariable biomarker insights improve physician risk stratification without introducing automated diagnostic reliance.',
    },
  ];

  return (
    <div className="bg-[#fbfbfa] text-slate-800 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-800 font-semibold mb-2">
            EDITORIAL STORYTELLING · RESEARCH RESPONSIBILITY
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            From Research to Responsibility
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            High precision is only the beginning. Clinical adoption demands ethical governance, fairness testing across patient populations, and transparent methodological humility.
          </p>
        </div>

        {/* Main Visual: Horizontal Timeline on Desktop / Vertical on Mobile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-6 text-center">
            The 6-Stage Clinical Research Pathway
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:grid grid-cols-6 gap-3 relative">
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-200 z-0" />
            
            {timelineStages.map((s, idx) => {
              const isExpanded = expandedStage === idx;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => setExpandedStage(isExpanded ? null : idx)}
                    className={`w-12 h-12 rounded-full font-mono font-bold text-sm flex items-center justify-center transition-all border mb-3 ${
                      isExpanded
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                        : 'bg-white text-slate-800 border-slate-300 hover:border-slate-800'
                    }`}
                  >
                    {s.num}
                  </button>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{s.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight mb-2">{s.summary}</p>
                  <button
                    type="button"
                    onClick={() => setExpandedStage(isExpanded ? null : idx)}
                    className="text-[10px] font-mono text-cyan-700 hover:text-cyan-900 flex items-center gap-0.5"
                  >
                    <span>{isExpanded ? 'Less' : 'Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-4">
            {timelineStages.map((s, idx) => {
              const isExpanded = expandedStage === idx;
              return (
                <div key={s.num} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                      {s.num}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedStage(isExpanded ? null : idx)}
                      className="text-xs font-mono text-slate-500 flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide' : 'Expand'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{s.summary}</p>
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-700 leading-relaxed">
                      {s.details}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Expanded Drawer for Desktop */}
          {expandedStage !== null && (
            <div className="hidden lg:block mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed text-center animate-fadeIn">
              <strong className="font-mono text-slate-900 block mb-1">
                Stage {timelineStages[expandedStage].num} Research Protocol: {timelineStages[expandedStage].title}
              </strong>
              {timelineStages[expandedStage].details}
            </div>
          )}
        </div>

        {/* 3 Restrained Supporting Editorial Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Privacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Protect sensitive patient medical information through rigorous pseudonymization, role-based database permissions, and encrypted laboratory transmission standards.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Fairness</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Investigate whether model sensitivity and predictive values vary across biological sex, age brackets, and comorbid patient subgroups to prevent algorithmic health disparities.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Clinical Responsibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A prototype or promising model is never an autonomous substitute for physician diagnosis. All outputs serve solely as transparent evidence to assist qualified clinical oversight.
            </p>
          </div>

        </div>

        {/* Final Closing Composition */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 text-center shadow-lg relative overflow-hidden mb-10">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-3">
            “A promising model is the beginning of clinical evidence, not the end.”
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
            The road from computational discovery to clinical adoption requires rigorous external validation, multi-centre trials, and clinician trust.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-xs transition-colors shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore biomarkers again</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-5 py-2.5 rounded-lg text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revisit the research workflow</span>
            </button>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center text-xs text-slate-500 font-medium">
          Biomarker Lab Platform · Advanced Diabetic Biomarker Exploration Application
        </div>

      </div>
    </div>
  );
};
