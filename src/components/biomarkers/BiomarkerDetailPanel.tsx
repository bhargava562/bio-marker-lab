import React from 'react';
import { AlertTriangle, Layers, X, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Biomarker, ExplorationMode } from '../../types';

interface BiomarkerDetailPanelProps {
  biomarker: Biomarker | null;
  mode: ExplorationMode;
  onClose: () => void;
}

export const BiomarkerDetailPanel: React.FC<BiomarkerDetailPanelProps> = ({
  biomarker,
  mode: _mode,
  onClose,
}) => {
  if (!biomarker) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[380px] shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-3">
          <Layers className="w-6 h-6 text-cyan-600" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 mb-1 font-display">Select a Biomarker Node</h4>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Click any biomarker sphere in the 3D network to inspect clinical definition, physiological relevance, reference ranges, and research limitations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col h-full shadow-sm relative overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700 mb-0.5">
            SELECTED BIOMARKER
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight font-display">{biomarker.name}</h3>
            <span className="font-semibold text-xs px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
              {biomarker.abbreviation}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{biomarker.categoryLabel}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Required Evidence Fields */}
      <div className="space-y-3.5 text-xs">
        
        {/* Field 1: What is it? */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-cyan-800 mb-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-600" /> 1. What is it?
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            {biomarker.plainDescription}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-600 flex items-center justify-between">
            <span>Units: <strong className="text-slate-900">{biomarker.typicalUnits}</strong></span>
            <span>Range: <strong className="text-slate-900">{biomarker.referenceRange.split(';')[0]}</strong></span>
          </div>
        </div>

        {/* Field 2: Why investigate it? */}
        <div className="bg-cyan-50/50 p-3.5 rounded-xl border border-cyan-200">
          <div className="text-[11px] font-semibold text-cyan-900 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> 2. Why investigate it?
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            {biomarker.potentialRelevance}
          </p>
          <p className="text-cyan-800 text-[10px] mt-1.5 font-medium">
            Role: {biomarker.typicalRole}
          </p>
        </div>

        {/* Field 3: What should we be careful about? */}
        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
          <div className="text-[11px] font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> 3. Scientific Caution & Limitations
          </div>
          <p className="text-slate-800 leading-relaxed text-[11px]">
            {biomarker.clinicalCaution}
          </p>
        </div>

        {/* Field 4: Research status */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 4. Research Status
          </div>
          <p className="text-slate-600 text-[11px]">
            Candidate analytical variable evaluated within prospective multivariable machine-learning workflows.
          </p>
          <div className="mt-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase border ${
              biomarker.analyticalTier === 'established' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              biomarker.analyticalTier === 'candidate' ? 'bg-cyan-50 text-cyan-800 border-cyan-200' :
              'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}>
              Tier: {biomarker.analyticalTier}
            </span>
          </div>
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
        Conceptual relationship · Not an autonomous diagnostic test
      </div>
    </div>
  );
};
