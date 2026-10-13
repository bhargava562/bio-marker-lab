import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  BarChart, 
  UserCheck, 
  Info 
} from 'lucide-react';
import { GLOBAL_FEATURE_IMPORTANCES, LOCAL_PATIENT_EXPLANATION } from '../data/metrics';
import type { ExplorationMode } from '../types';

interface InsidePredictionViewProps {
  mode: ExplorationMode;
}

export const InsidePredictionView: React.FC<InsidePredictionViewProps> = ({ mode: _mode }) => {
  const [viewType, setViewType] = useState<'local' | 'global'>('local');
  const [selectedFeature, setSelectedFeature] = useState<string | null>('HbA1c');

  const activeLocalItem = LOCAL_PATIENT_EXPLANATION.contributions.find((c) =>
    selectedFeature ? c.feature.toLowerCase().includes(selectedFeature.toLowerCase()) : false
  ) || LOCAL_PATIENT_EXPLANATION.contributions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            Screen 06 • Explainability & Interpretability
          </span>
          <span className="text-xs text-slate-400">Section 17 of BRAINS Project Submission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Inside the Prediction</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Understand how multivariable machine learning forms decisions. Inspect population-level global biomarker rankings and patient-level localized SHAP contributions.
        </p>
      </div>

      {/* Mandatory Non-Causality Scientific Principle Banner */}
      <div className="sci-card p-4 mb-6 bg-cyan-950/20 border-cyan-500/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <strong className="text-cyan-300 font-semibold block text-sm mb-0.5 font-mono">
            “An explanation describes model behaviour. It does not prove causation.”
          </strong>
          A feature with high attribution in an XGBoost or Random Forest model reflects strong statistical predictive correlation in the dataset. It does not independently prove that modulating that biomarker will alter clinical disease trajectory.
        </div>
      </div>

      {/* View Switcher: Local Case vs Global Population */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center bg-[#0b1326] p-1 rounded-lg border border-slate-700/60">
          <button
            type="button"
            onClick={() => setViewType('local')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewType === 'local'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Local Case Explanation (SYNTH-BLJ-1041)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewType('global')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewType === 'global'
                ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart className="w-3.5 h-3.5" />
            <span>Global Population Feature Importance</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Illustrative SHAP Attribution Demonstration
        </span>
      </div>

      {/* Main Split Layout */}
      {viewType === 'local' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Patient Output Context & Waterfalls */}
          <div className="lg:col-span-7 sci-panel p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400">Specimen Case ID</span>
                <h3 className="text-base font-bold text-white font-mono">{LOCAL_PATIENT_EXPLANATION.patientId}</h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400">Model Risk Estimate</span>
                <div className="text-xl font-extrabold text-amber-400 font-mono">
                  {(LOCAL_PATIENT_EXPLANATION.predictedProbability * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Baseline to Output Risk Gradient Bar */}
            <div className="bg-[#070c18] p-3.5 rounded-lg border border-slate-800 text-xs">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-1.5">
                <span>Base Rate: {(LOCAL_PATIENT_EXPLANATION.baseRateRisk * 100).toFixed(0)}%</span>
                <span className="text-amber-400">Final Risk: {(LOCAL_PATIENT_EXPLANATION.predictedProbability * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: '22%' }} className="bg-slate-600 h-full" title="Base population risk" />
                <div style={{ width: '52%' }} className="bg-gradient-to-r from-amber-500 to-red-500 h-full" title="Net push from biomarker profile" />
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1.5 text-center">
                Net push: +0.52 from patient's multi-biomarker profile over population mean
              </div>
            </div>

            {/* Local SHAP Waterfall Contributions */}
            <div>
              <div className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider mb-2.5">
                Local Analyte Attributions (Click to Inspect)
              </div>
              <div className="space-y-2">
                {LOCAL_PATIENT_EXPLANATION.contributions.map((item, idx) => {
                  const isPositive = item.direction === 'increases_risk';
                  const isSelected = selectedFeature && item.feature.toLowerCase().includes(selectedFeature.toLowerCase());
                  const barWidth = Math.min(100, Math.abs(item.impact) * 320);

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedFeature(item.feature.split(' ')[0])}
                      className={`p-2.5 rounded-lg cursor-pointer transition-all border flex items-center justify-between text-xs ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-400/80 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 w-48 font-mono">
                        {isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        )}
                        <span className="text-slate-200 truncate">{item.feature}</span>
                      </div>

                      {/* Visual attribution bar */}
                      <div className="flex-1 max-w-xs mx-3 h-2 bg-slate-800 rounded-full overflow-hidden flex items-center">
                        <div
                          style={{ width: `${barWidth}%` }}
                          className={`h-full rounded-full ${isPositive ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        />
                      </div>

                      <div className={`font-mono text-xs font-semibold w-16 text-right ${
                        isPositive ? 'text-amber-300' : 'text-emerald-300'
                      }`}>
                        {item.impact > 0 ? `+${item.impact.toFixed(2)}` : item.impact.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Selected Feature Reasoning Drawer */}
          <div className="lg:col-span-5 sci-panel p-5 space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Detailed Factor Analysis</span>
              <h4 className="text-sm font-bold text-white mt-0.5">{activeLocalItem.feature}</h4>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Direction of Push:</span>
                <span className={activeLocalItem.direction === 'increases_risk' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {activeLocalItem.direction === 'increases_risk' ? 'Increases Predicted Risk' : 'Decreases Predicted Risk'}
                </span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Attribution Weight:</span>
                <span className="text-cyan-300 font-bold">{activeLocalItem.impact > 0 ? `+${activeLocalItem.impact.toFixed(2)}` : activeLocalItem.impact.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800 pt-2">
                <div className="text-[11px] font-mono text-slate-400 mb-1">Clinical Contextual Rationale</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{activeLocalItem.reasoning}</p>
              </div>
            </div>

            {/* Methodology Note */}
            <div className="bg-indigo-950/20 border border-indigo-500/30 p-3 rounded-lg text-xs">
              <div className="text-indigo-300 font-semibold mb-1 flex items-center gap-1 font-mono text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Explainability Method: TreeSHAP
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Shapley additive explanations calculate the marginal contribution of each variable across all possible feature coalitions, satisfying local accuracy, missingness, and consistency theorems.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Global Feature Importance View */
        <div className="sci-panel p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Global Mean Absolute Attribution Across Synthetic Cohort</h3>
              <p className="text-xs text-slate-400 mt-0.5">Permutation and TreeSHAP mean importance ranking</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">N = 500 Records</span>
          </div>

          <div className="space-y-3">
            {GLOBAL_FEATURE_IMPORTANCES.map((item, idx) => {
              const barWidth = item.importance * 100 * 2.5;
              return (
                <div key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div className="w-36 font-semibold text-white font-mono flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">#{idx + 1}</span>
                    <span>{item.name}</span>
                  </div>

                  <div className="flex-1 mx-4">
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${barWidth}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="w-24 text-right font-mono font-bold text-cyan-300 text-xs">
                    {(item.importance * 100).toFixed(0)}% Mean Push
                  </div>

                  <div className="w-48 text-[11px] text-slate-400 hidden md:block text-right">
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
