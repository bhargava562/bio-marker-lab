import React from 'react';
import { AlertTriangle, BookOpen, Layers, X, Info } from 'lucide-react';
import type { Biomarker, ExplorationMode } from '../../types';

interface BiomarkerDetailPanelProps {
  biomarker: Biomarker | null;
  mode: ExplorationMode;
  onClose: () => void;
}

export const BiomarkerDetailPanel: React.FC<BiomarkerDetailPanelProps> = ({
  biomarker,
  mode,
  onClose,
}) => {
  if (!biomarker) {
    return (
      <div className="sci-panel p-6 flex flex-col items-center justify-center text-center h-full min-h-[380px]">
        <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3">
          <Layers className="w-6 h-6 text-cyan-400/60" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200 mb-1">Select a Biomarker Node</h4>
        <p className="text-xs text-slate-400 max-w-xs">
          Click any node in the 3D universe to inspect physiological relevance, measurement units, research rationale, and clinical limitations.
        </p>
      </div>
    );
  }

  const getTierBadge = (tier: Biomarker['analyticalTier']) => {
    switch (tier) {
      case 'established':
        return <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded badge-established">Established Standard</span>;
      case 'candidate':
        return <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded badge-candidate">Research Candidate</span>;
      case 'covariate':
        return <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded badge-covariate">Clinical Covariate</span>;
    }
  };

  return (
    <div className="sci-panel p-5 relative flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-700/60 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
              {biomarker.abbreviation}
            </span>
            {getTierBadge(biomarker.analyticalTier)}
          </div>
          <h3 className="text-base font-semibold text-white tracking-tight">{biomarker.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{biomarker.categoryLabel}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Laboratory Reference Specifications */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <div className="text-[11px] font-mono text-slate-400">Typical Units</div>
          <div className="text-slate-200 font-medium mt-0.5 font-mono">{biomarker.typicalUnits}</div>
        </div>
        <div>
          <div className="text-[11px] font-mono text-slate-400">Reference Interval</div>
          <div className="text-slate-200 font-medium mt-0.5">{biomarker.referenceRange}</div>
        </div>
      </div>

      {/* Role from Table 0 */}
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-wider font-mono text-cyan-400 mb-1 flex items-center gap-1">
          <Info className="w-3 h-3" /> Typical Study Role (Table 0)
        </div>
        <div className="text-xs text-slate-300 bg-cyan-950/30 border border-cyan-500/20 p-2.5 rounded-md font-medium">
          {biomarker.typicalRole}
        </div>
      </div>

      {/* Description / Research Rationale */}
      <div className="space-y-3 mb-4 text-xs">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-mono text-slate-400 mb-1">
            {mode === 'research' ? 'Physiological Mechanism' : 'Plain-English Explanation'}
          </div>
          <p className="text-slate-300 leading-relaxed">
            {mode === 'research' ? biomarker.potentialRelevance : biomarker.plainDescription}
          </p>
        </div>

        {mode === 'research' && (
          <div className="border-t border-slate-800 pt-3">
            <div className="text-[11px] uppercase tracking-wider font-mono text-indigo-400 mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Research Rationale in Multivariable Modeling
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {biomarker.researchRationale}
            </p>
          </div>
        )}
      </div>

      {/* Clinical Caution */}
      <div className="mt-auto bg-amber-950/25 border border-amber-500/30 p-3 rounded-lg text-xs">
        <div className="text-amber-400 font-medium flex items-center gap-1.5 mb-1 text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5" /> Clinical & Analytical Caution
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          {biomarker.clinicalCaution}
        </p>
      </div>

      {/* Non-diagnostic notice */}
      <div className="mt-3 text-[10px] text-slate-400 text-center font-mono">
        Conceptual candidate variable • Requires clinical validation
      </div>
    </div>
  );
};
