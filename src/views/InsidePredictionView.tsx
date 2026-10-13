import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  HelpCircle, 
  Info, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders 
} from 'lucide-react';
import { GLOBAL_FEATURE_IMPORTANCES, LOCAL_PATIENT_EXPLANATION } from '../data/metrics';
import type { ExplorationMode } from '../types';

interface InsidePredictionViewProps {
  mode: ExplorationMode;
}

export const InsidePredictionView: React.FC<InsidePredictionViewProps> = ({ mode: _mode }) => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'local' | 'global'>('local');
  const [selectedFeature, setSelectedFeature] = useState<string>('HbA1c');

  const activeLocalItem = LOCAL_PATIENT_EXPLANATION.contributions.find((c) =>
    c.feature.toLowerCase().includes(selectedFeature.toLowerCase())
  ) || LOCAL_PATIENT_EXPLANATION.contributions[0];

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-slate-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-semibold mb-0.5">
            Stage 06 · 2D Investigate · Model Explainability
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inside the Prediction
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Inspect how multivariable models make decisions. Explore localized SHAP-style feature attributions and population rankings without treating algorithms as opaque black boxes.
          </p>
          <div className="mt-2 text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Illustrative explanation — no trained clinical model connected</span>
          </div>
        </div>

        {/* View Controls: Global vs Local View */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setViewType('local')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewType === 'local'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Local Output View (SYNTH-BLJ-1041)
            </button>
            <button
              type="button"
              onClick={() => setViewType('global')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewType === 'global'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Global Dataset Importance
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Center line = Zero impact · Bars extend in opposite directions
          </div>
        </div>

        {/* Left-to-Right 3-Part Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          
          {/* Left 25%: Controls & Example Case */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Hypothetical Case Profile */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Hypothetical Case</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 font-mono">SYNTH-BLJ-1041</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                  74% Model Output
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Baseline population risk: 22% · Net multivariable elevation: +52%
              </p>
            </div>

            {/* Feature Selector */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                Select Feature to Inspect
              </span>
              {LOCAL_PATIENT_EXPLANATION.contributions.map((item) => {
                const isSelected = item.feature.toLowerCase().includes(selectedFeature.toLowerCase());
                return (
                  <button
                    key={item.feature}
                    type="button"
                    onClick={() => setSelectedFeature(item.feature.split(' ')[0])}
                    className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.feature}</span>
                    <span className={item.impact > 0 ? (isSelected ? 'text-amber-300' : 'text-amber-700') : (isSelected ? 'text-emerald-300' : 'text-emerald-700')}>
                      {item.impact > 0 ? `+${item.impact.toFixed(2)}` : item.impact.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stability Concept Note */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs">
              <div className="text-[10px] font-mono text-cyan-800 font-bold uppercase mb-1 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-600" /> Explanation Stability
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Feature attributions may vary across cross-validation folds due to collinearity between glucose subfractions. Consistent stability across resamples is required for clinical faith.
              </p>
            </div>

          </div>

          {/* Centre 50%: Diverging Feature-Contribution Diagram */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[460px] flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Diverging Feature Contribution Chart (SHAP Convention)
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Opposite Bar Directions
              </span>
            </div>

            {viewType === 'local' ? (
              <div className="my-auto py-4 space-y-3">
                {/* Visual Axis Guide */}
                <div className="grid grid-cols-2 text-[10px] font-mono border-b border-slate-200 pb-1 text-center">
                  <div className="text-emerald-700 font-bold">← Decreases Risk (Protective)</div>
                  <div className="text-amber-700 font-bold">Increases Risk (Elevates) →</div>
                </div>

                {/* Horizontal Diverging Bars */}
                {LOCAL_PATIENT_EXPLANATION.contributions.map((c) => {
                  const isPositive = c.impact > 0;
                  const isSelected = c.feature.toLowerCase().includes(selectedFeature.toLowerCase());
                  const barWidth = Math.min(100, Math.abs(c.impact) * 300);

                  return (
                    <div
                      key={c.feature}
                      onClick={() => setSelectedFeature(c.feature.split(' ')[0])}
                      className={`grid grid-cols-12 items-center gap-2 py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Label */}
                      <div className="col-span-4 text-xs font-mono font-medium text-slate-800 truncate">
                        {c.feature}
                      </div>

                      {/* Diverging Bar Area (col-span-6) with center line */}
                      <div className="col-span-6 relative h-5 flex items-center">
                        {/* Center zero line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 z-10" />

                        {/* Negative bar (extends left from center) */}
                        {!isPositive && (
                          <div className="w-1/2 flex justify-end pr-0.5">
                            <div
                              style={{ width: `${barWidth}%` }}
                              className="h-4 bg-emerald-500 rounded-l"
                              title={`${c.feature}: ${c.impact}`}
                            />
                          </div>
                        )}

                        {/* Positive bar (extends right from center) */}
                        {isPositive && (
                          <div className="w-1/2 ml-auto pl-0.5">
                            <div
                              style={{ width: `${barWidth}%` }}
                              className="h-4 bg-amber-500 rounded-r"
                              title={`${c.feature}: +${c.impact}`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Value (col-span-2) */}
                      <div className="col-span-2 text-right text-xs font-mono font-bold">
                        <span className={isPositive ? 'text-amber-700' : 'text-emerald-700'}>
                          {isPositive ? `+${c.impact.toFixed(2)}` : c.impact.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Global Importance Ranking View */
              <div className="my-auto py-4 space-y-3">
                <div className="text-xs font-mono text-slate-600 mb-2">
                  Global Mean |SHAP| Attribution across Synthetic Cohort (N=500):
                </div>
                {GLOBAL_FEATURE_IMPORTANCES.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-xs font-mono gap-3">
                    <span className="w-28 text-slate-800 font-semibold truncate">#{i + 1} {item.name}</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.importance * 260}%` }}
                        className="h-full bg-cyan-700 rounded-full"
                      />
                    </div>
                    <span className="w-14 text-right font-bold text-cyan-900">
                      {(item.importance * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-[10px] font-mono text-slate-400 text-center border-t border-slate-100 pt-2">
              Values denote model sensitivity · Does not represent clinical causality
            </div>
          </div>

          {/* Right 25%: 3 Required Plain-English Interpretation Sections */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Interpretation Panel</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activeLocalItem.feature}</h4>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Section 1: What the model used */}
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-600" /> What the model used
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  The model identified the feature value as a weighted contributor ({activeLocalItem.impact > 0 ? `+${activeLocalItem.impact}` : activeLocalItem.impact}) to this patient's prediction under TreeSHAP coalition averaging.
                </p>
              </div>

              {/* Section 2: What the explanation means */}
              <div className="border-t border-slate-100 pt-2">
                <div className="text-[10px] font-mono uppercase text-cyan-800 font-bold mb-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-cyan-600" /> What the explanation means
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  Describes internal model behavior, <strong className="text-slate-900">not proof of a biological causal mechanism</strong>. A feature can have high attribution due to correlated surrogate markers.
                </p>
              </div>

              {/* Section 3: What remains uncertain */}
              <div className="border-t border-slate-100 pt-2">
                <div className="text-[10px] font-mono uppercase text-amber-800 font-bold mb-1 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-amber-600" /> What remains uncertain
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Attribution depends heavily on training cohort quality, missing-data handling, and potential confounding from concurrent medications (e.g., Metformin exposure).
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Next Step Navigation */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/validation')}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium"
          >
            ← Back to Validation
          </button>

          <button
            type="button"
            onClick={() => navigate('/responsibility')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition-all shadow-sm"
          >
            <span>Next: From Research to Responsibility</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
