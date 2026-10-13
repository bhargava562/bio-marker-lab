import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Info 
} from 'lucide-react';
import { GLOBAL_FEATURE_IMPORTANCES, LOCAL_PATIENT_EXPLANATION } from '../../data/metrics';
import type { ExplorationMode } from '../../types';

interface ExplainabilityToolProps {
  mode: ExplorationMode;
}

export const ExplainabilityTool: React.FC<ExplainabilityToolProps> = ({ mode: _mode }) => {
  const [viewType, setViewType] = useState<'local' | 'global'>('local');
  const [selectedFeature, setSelectedFeature] = useState<string>('HbA1c');

  const activeLocalItem = LOCAL_PATIENT_EXPLANATION.contributions.find((c) =>
    c.feature.toLowerCase().includes(selectedFeature.toLowerCase())
  ) || LOCAL_PATIENT_EXPLANATION.contributions[0];

  return (
    <div className="space-y-6">
      
      {/* Tool Introduction & Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-600" />
            <span>Explainability Studio · Feature Attribution</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Inspect how multivariable models make individual predictions. Explore localized SHAP-style feature attributions and population rankings without treating algorithms as opaque black boxes.
          </p>
        </div>
        <div className="flex-shrink-0 text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Attribution ≠ Causation · Illustrative Demonstration</span>
        </div>
      </div>

      {/* View Controls: Global vs Local View */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
            Local Specimen Waterfall (SYNTH-BLJ-1041)
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
            Global Cohort Feature Ranking
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {viewType === 'local' ? 'Base risk: 0.22 → Output risk: 0.74' : 'N = 1000 Population Aggregation'}
        </div>
      </div>

      {/* Main Grid: Left 65% Chart / Right 35% Clinical Interpretation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 65%: Diverging Horizontal SHAP Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                {viewType === 'local' 
                  ? 'Local SHAP-Style Attributions (Impact on Risk Probability)' 
                  : 'Mean Absolute SHAP Value (Population Importance)'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {viewType === 'local' 
                  ? 'Red bars increase predicted risk; cyan bars decrease predicted risk relative to base rate.' 
                  : 'Ranks which biomarkers exerted highest average impact across cohort.'}
              </p>
            </div>
          </div>

          {/* Local View: Horizontal Diverging Bars */}
          {viewType === 'local' ? (
            <div className="space-y-3 pt-2">
              {LOCAL_PATIENT_EXPLANATION.contributions.map((c) => {
                const isSelected = selectedFeature.toLowerCase().includes(c.feature.toLowerCase());
                const isPositive = c.impact > 0;
                const widthPercent = Math.min(100, Math.abs(c.impact) * 320);

                return (
                  <div
                    key={c.feature}
                    onClick={() => setSelectedFeature(c.feature)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-sm'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.feature}</span>
                      </div>
                      <span className={`font-bold ${isPositive ? 'text-red-600' : 'text-cyan-700'}`}>
                        {isPositive ? `+${c.impact.toFixed(3)}` : c.impact.toFixed(3)}
                      </span>
                    </div>

                    {/* Diverging Bar Track */}
                    <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden flex items-center">
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 z-10" />
                      
                      {isPositive ? (
                        <div
                          style={{ left: '50%', width: `${widthPercent / 2}%` }}
                          className="absolute h-full bg-gradient-to-r from-red-400 to-red-500 rounded-r-full transition-all duration-300"
                        />
                      ) : (
                        <div
                          style={{ right: '50%', width: `${widthPercent / 2}%` }}
                          className="absolute h-full bg-gradient-to-l from-cyan-400 to-cyan-500 rounded-l-full transition-all duration-300"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Global View: Ranked Bar Chart */
            <div className="space-y-3 pt-2">
              {GLOBAL_FEATURE_IMPORTANCES.map((item, idx) => {
                const widthPercent = Math.min(100, item.importance * 280);
                return (
                  <div key={item.name} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between text-xs mb-1 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[10px]">#{idx + 1}</span>
                        <span className="font-bold text-slate-900">{item.name}</span>
                        <span className="text-slate-400 text-[11px]">({item.category})</span>
                      </div>
                      <span className="font-bold text-slate-700">{item.importance.toFixed(3)}</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${widthPercent}%` }}
                        className="h-full bg-slate-900 rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
            <span>Left: Decreases Risk (-)</span>
            <span>Zero Centerline (Base Risk)</span>
            <span>Right: Increases Risk (+)</span>
          </div>
        </div>

        {/* Right 35%: 3-Part Clinical Interpretation Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Feature Attribution Profile</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeLocalItem.feature}</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Attribution Value */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">
                Local Impact on Log-Odds
              </div>
              <div className="text-lg font-bold font-mono text-slate-900">
                {activeLocalItem.impact > 0 ? `+${activeLocalItem.impact.toFixed(3)}` : activeLocalItem.impact.toFixed(3)}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {activeLocalItem.impact > 0 
                  ? 'Pushes the patient prediction higher toward abnormal status.' 
                  : 'Exerts protective counter-weight pulling prediction toward normoglycaemia.'}
              </p>
            </div>

            {/* Biological Interpretation */}
            <div className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-200">
              <div className="text-[10px] font-mono text-cyan-800 uppercase font-bold mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-cyan-700" /> Biological Plausibility
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {activeLocalItem.reasoning}
              </p>
            </div>

            {/* Clinical Guardrail */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-[10px] font-mono text-amber-800 uppercase font-bold mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Scientific Limitation
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                High feature attribution confirms statistical utility within this specific algorithm, not that lowering this marker directly reduces patient disease incidence.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Educational Callout: Why Explainability Matters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Why Post-Hoc Feature Attribution Protects Patients</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Black-box models can achieve high accuracy by learning non-clinical artifacts (such as which machine processed the blood or the clinic shift time). Decomposing individual patient outputs into additive feature contributions allows clinicians to verify that predictions are rooted in genuine metabolic pathophysiology.
        </p>
      </div>

    </div>
  );
};
