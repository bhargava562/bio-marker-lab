import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Info, 
  Network,
  Cpu
} from 'lucide-react';
import { CANDIDATE_MODELS } from '../../data/models';
import type { ExplorationMode } from '../../types';

interface ModelStudioToolProps {
  mode: ExplorationMode;
}

export const ModelStudioTool: React.FC<ModelStudioToolProps> = ({ mode }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>('logistic_regression');
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  // Five required model architectures
  const models = [
    {
      id: 'logistic_regression',
      name: 'Logistic Regression',
      howItWorks: 'Models outcome probability using a sigmoid link function',
      mainConsideration: 'Baseline and interpretability; linear log-odds assumption',
      coreIdea: 'Fits a linear combination of biomarker weights transformed through a logistic link function to estimate the probability of the defined diabetic outcome.',
      strengths: [
        'High clinical transparency and established regulatory acceptance',
        'Direct mathematical odds ratios for each biomarker unit increase',
        'Transparent baseline against which nonlinear gains must be justified',
      ],
      limitations: [
        'Cannot automatically discover complex multi-analyte interactions without explicit interaction terms',
        'Sensitive to multicollinearity between related markers (e.g. FPG vs PPG)',
      ],
      considerations: 'Moderate sample size; standardized variables helpful; check calibration slope and intercept.',
      status: 'Candidate baseline method · Not yet evaluated on project data',
    },
    {
      id: 'decision_tree',
      name: 'Decision Tree (CART)',
      howItWorks: 'Follows hierarchical orthogonal branching rules',
      mainConsideration: 'Prone to overfitting; requires pruning',
      coreIdea: 'Recursively partitions the biomarker space using binary threshold decisions (e.g., "If HbA1c > 6.5% AND Triglycerides > 180 mg/dL").',
      strengths: [
        'Flowchart mirrors clinical diagnostic decision protocols',
        'Naturally handles mixed continuous and categorical variables',
        'Invariant to monotonic scaling transformations',
      ],
      limitations: [
        'High sample variance: small dataset shifts alter entire tree geometry',
        'Axis-aligned splits struggle with diagonal biological boundaries',
      ],
      considerations: 'Strict pre-pruning or minimum leaf size (min_samples_leaf) constraints mandatory to prevent deep leaf memorization.',
      status: 'Candidate method · Not yet evaluated on project data',
    },
    {
      id: 'random_forest',
      name: 'Random Forest',
      howItWorks: 'Combines many decorrelated decision trees via bagging',
      mainConsideration: 'More complex interpretation; ensemble variance reduction',
      coreIdea: 'Builds an ensemble of hundreds of decorrelated decision trees trained on bootstrap data partitions with random feature subsets, aggregating by majority vote.',
      strengths: [
        'Substantially mitigates single-tree variance and overfitting',
        'Captures intricate nonlinear interactions across lipid and renal markers',
        'Internal Out-Of-Bag (OOB) error estimates without separate validation splits',
      ],
      limitations: [
        'Ensemble averaging obscures simple transparent decision logic',
        'Can be biased toward continuous markers with numerous split values',
      ],
      considerations: 'Requires tuning of tree count (n_estimators) and max_features; pair with permutation feature importance.',
      status: 'Candidate ensemble method · Not yet evaluated on project data',
    },
    {
      id: 'svm',
      name: 'Support Vector Machine',
      howItWorks: 'Learns a maximum-margin separating boundary in Hilbert space',
      mainConsideration: 'Strict scaling and kernel parameter selection',
      coreIdea: 'Maps biomarker measurements into higher-dimensional space via kernel functions (RBF/Linear) to identify the hyperplane that maximizes the margin separating classes.',
      strengths: [
        'Effective in high-dimensional feature spaces with modest sample sizes',
        'Maximizes geometric separation margin, offering solid generalization bounds',
        'Robust to outliers situated far from the decision boundary',
      ],
      limitations: [
        'Black-box geometry makes direct clinical interpretation difficult',
        'Does not natively yield true posterior probabilities without Platt scaling',
      ],
      considerations: 'Strict standard scaling (zero mean, unit variance) mandatory; optimize cost C and kernel gamma via nested cross-validation.',
      status: 'Candidate kernel method · Not yet evaluated on project data',
    },
    {
      id: 'gradient_boosting',
      name: 'Gradient Boosting (XGBoost)',
      howItWorks: 'Builds a sequential ensemble fitting residual errors',
      mainConsideration: 'Hyperparameter tuning and overfitting control',
      coreIdea: 'Sequentially trains shallow decision trees where each subsequent learner targets the residual errors (gradient) of the existing ensemble combined with learning rate shrinkage.',
      strengths: [
        'State-of-the-art empirical performance on clinical tabular laboratory data',
        'Native handling of missing values without synthetic imputation',
        'Pairs naturally with TreeSHAP for exact game-theoretic attributions',
      ],
      limitations: [
        'High risk of overfitting if depth, learning rate, and subsample ratios are untuned',
        'Output probabilities frequently require post-hoc calibration',
      ],
      considerations: 'Use early stopping on an independent validation fold; strictly prevent temporal target leakage.',
      status: 'Candidate boosted method · Not yet evaluated on project data',
    },
  ];

  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

  return (
    <div className="space-y-6">
      
      {/* Tool Introduction & Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <span>Model Studio · Candidate Architectures</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Compare five candidate machine-learning architectures for biomarker prediction. No algorithm is pre-declared as superior; clinical utility requires empirical evaluation on locked cohorts.
          </p>
        </div>
        <div className="flex-shrink-0 text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-600" />
          <span>Conceptual Architectures · No Live Inference Connected</span>
        </div>
      </div>

      {/* 3-Column Layout: Left 25% Selector / Centre 47% Diagram / Right 28% Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 25%: Vertical Model Selector */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            Candidate Architectures
          </div>
          {models.map((m) => {
            const isSelected = selectedModelId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModelId(m.id)}
                className={`w-full text-left p-3 min-h-[50px] rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold">{m.name}</div>
                  <div className={`text-[10px] truncate max-w-[220px] sm:max-w-none mt-0.5 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {m.howItWorks}
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Centre 47%: Animated Interactive Diagram */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-sm min-h-0 sm:min-h-[460px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider truncate pr-2">
              {currentModel.name} · Architecture
            </span>
            <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
              Interactive Schema
            </span>
          </div>

          {/* Diagram Visualization per selected model */}
          <div className="my-auto py-4">
            {currentModel.id === 'logistic_regression' && (
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-600 mb-2 font-mono">
                  P(Y=1) = 1 / (1 + e<sup>-(β₀ + β₁·HbA1c + β₂·FPG)</sup>)
                </div>
                <svg className="w-full max-w-[380px] h-48 bg-slate-50 rounded-lg p-2 border border-slate-200" viewBox="0 0 320 180">
                  <line x1="30" y1="150" x2="290" y2="150" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="30" y1="20" x2="30" y2="150" stroke="#cbd5e1" strokeWidth="1.5" />
                  <text x="35" y="30" fontSize="9" fill="#64748b" fontFamily="monospace">1.0 (High Risk)</text>
                  <text x="35" y="145" fontSize="9" fill="#64748b" fontFamily="monospace">0.0 (Normal)</text>
                  
                  {/* Sigmoid curve */}
                  <path d="M 40 145 Q 140 145 160 85 T 280 25" fill="none" stroke="#0284c7" strokeWidth="3" />
                  
                  {/* Operating cutoff threshold */}
                  <line x1="160" y1="20" x2="160" y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="160" cy="85" r="5" fill="#f59e0b" />
                  <text x="165" y="95" fontSize="9" fill="#b45309" fontFamily="monospace">Threshold: 0.50</text>
                  <text x="130" y="170" fontSize="9" fill="#475569" fontFamily="monospace">Linear Predictor (z)</text>
                </svg>
                <div className="text-[11px] text-slate-500 mt-2 text-center">
                  Smooth probabilistic curve mapping multivariable biomarker risk scores to continuous risk probabilities.
                </div>
              </div>
            )}

            {currentModel.id === 'decision_tree' && (
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-600 mb-2 font-mono">
                  Click a decision node to trace clinical rule path:
                </div>
                <svg className="w-full max-w-[390px] h-52 bg-slate-50 rounded-lg p-2 border border-slate-200" viewBox="0 0 360 190">
                  {/* Root Node */}
                  <g onClick={() => setActiveBranch('root')} className="cursor-pointer">
                    <rect x="130" y="10" width="100" height="26" rx="4" fill="#0f172a" />
                    <text x="180" y="27" fill="#ffffff" fontSize="10" textAnchor="middle" fontFamily="monospace">HbA1c &gt; 6.5%</text>
                  </g>
                  
                  {/* Left Branch */}
                  <line x1="150" y1="36" x2="90" y2="70" stroke="#94a3b8" strokeWidth="2" />
                  <text x="110" y="50" fill="#64748b" fontSize="8" fontFamily="monospace">No</text>
                  <g onClick={() => setActiveBranch('left')} className="cursor-pointer">
                    <rect x="40" y="70" width="100" height="26" rx="4" fill="#0284c7" />
                    <text x="90" y="87" fill="#ffffff" fontSize="9" textAnchor="middle" fontFamily="monospace">FPG &gt; 126 mg/dL</text>
                  </g>

                  {/* Right Branch */}
                  <line x1="210" y1="36" x2="270" y2="70" stroke="#94a3b8" strokeWidth="2" />
                  <text x="250" y="50" fill="#64748b" fontSize="8" fontFamily="monospace">Yes</text>
                  <g onClick={() => setActiveBranch('right')} className="cursor-pointer">
                    <rect x="220" y="70" width="100" height="26" rx="4" fill="#0f172a" />
                    <text x="270" y="87" fill="#ffffff" fontSize="9" textAnchor="middle" fontFamily="monospace">TG &gt; 180 mg/dL</text>
                  </g>

                  {/* Terminals */}
                  <line x1="70" y1="96" x2="40" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="10" y="135" width="70" height="22" rx="3" fill="#10b981" />
                  <text x="45" y="150" fill="#ffffff" fontSize="8" textAnchor="middle" fontFamily="monospace">Normoglycaemic</text>

                  <line x1="110" y1="96" x2="140" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="110" y="135" width="70" height="22" rx="3" fill="#f59e0b" />
                  <text x="145" y="150" fill="#ffffff" fontSize="8" textAnchor="middle" fontFamily="monospace">Impaired FPG</text>

                  <line x1="270" y1="96" x2="270" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="230" y="135" width="85" height="22" rx="3" fill="#ef4444" />
                  <text x="272" y="150" fill="#ffffff" fontSize="8" textAnchor="middle" fontFamily="monospace">High Risk (89%)</text>
                </svg>

                {activeBranch && (
                  <div className="mt-2 text-[11px] text-cyan-800 bg-cyan-50 p-2 rounded border border-cyan-100 font-mono text-center">
                    Selected Node: {activeBranch === 'root' ? 'Primary Chronic Glycaemic Threshold' : activeBranch === 'left' ? 'Secondary Fasting Glucose Screen' : 'Synergistic Dyslipidaemia Risk Rule'}
                  </div>
                )}
              </div>
            )}

            {currentModel.id === 'random_forest' && (
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-600 mb-3 font-mono">
                  Bootstrap Aggregation: Decorrelated Trees Vote
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-[360px] mb-3">
                  {[1, 2, 3].map((t) => (
                    <div key={t} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <Network className="w-5 h-5 text-cyan-700 mx-auto mb-1" />
                      <div className="text-xs font-bold text-slate-800 font-mono">Tree #{t}</div>
                      <div className="text-[10px] text-slate-500">Subsample Bootstrap</div>
                    </div>
                  ))}
                </div>
                <div className="text-slate-400 my-1 font-mono text-xs">↓ Majority Consensus Voting ↓</div>
                <div className="bg-slate-900 text-white text-xs font-mono font-semibold py-2 px-5 rounded-lg shadow-sm">
                  Aggregated Prediction Output
                </div>
              </div>
            )}

            {currentModel.id === 'svm' && (
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-600 mb-2 font-mono">
                  Maximum Margin Hyperplane in Feature Space
                </div>
                <svg className="w-full max-w-[380px] h-48 bg-slate-50 rounded-lg p-2 border border-slate-200" viewBox="0 0 320 180">
                  {/* Normal points */}
                  <circle cx="80" cy="50" r="5" fill="#10b981" />
                  <circle cx="110" cy="40" r="5" fill="#10b981" />
                  <circle cx="95" cy="70" r="6" fill="#10b981" stroke="#0284c7" strokeWidth="2" />
                  
                  {/* Abnormal points */}
                  <circle cx="210" cy="110" r="6" fill="#ef4444" stroke="#0284c7" strokeWidth="2" />
                  <circle cx="230" cy="130" r="5" fill="#ef4444" />
                  <circle cx="240" cy="100" r="5" fill="#ef4444" />

                  {/* Hyperplane & margins */}
                  <line x1="50" y1="140" x2="260" y2="30" stroke="#0284c7" strokeWidth="2.5" />
                  <line x1="30" y1="120" x2="240" y2="10" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="70" y1="160" x2="280" y2="50" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

                  <text x="160" y="75" fill="#0284c7" fontSize="9" fontFamily="monospace">Margin (2/||w||)</text>
                </svg>
                <div className="text-[11px] text-slate-500 mt-2 text-center">
                  Hyperplane maximizes geometric separation margin to closest support vectors.
                </div>
              </div>
            )}

            {currentModel.id === 'gradient_boosting' && (
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-600 mb-3 font-mono">
                  Sequential Residual Learning (F<sub>m</sub> = F<sub>m-1</sub> + η·h<sub>m</sub>)
                </div>
                <div className="flex items-center gap-2 max-w-[380px] w-full text-center">
                  <div className="flex-1 p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold font-mono">Tree 1</div>
                    <div className="text-[10px] text-slate-500">Base Fit</div>
                  </div>
                  <div className="text-slate-400 font-bold">+</div>
                  <div className="flex-1 p-2 rounded bg-cyan-50 border border-cyan-200">
                    <div className="text-xs font-bold font-mono text-cyan-900">Tree 2</div>
                    <div className="text-[10px] text-cyan-700">Residual Error</div>
                  </div>
                  <div className="text-slate-400 font-bold">+</div>
                  <div className="flex-1 p-2 rounded bg-indigo-50 border border-indigo-200">
                    <div className="text-xs font-bold font-mono text-indigo-900">Tree M</div>
                    <div className="text-[10px] text-indigo-700">Shrinkage η</div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 font-mono text-center max-w-[360px]">
                  Each successive tree focuses on the error gradients left unexplained by previous trees.
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-slate-400 text-center border-t border-slate-100 pt-2">
            Conceptual mathematical diagram · Illustrative visual aid
          </div>
        </div>

        {/* Right 28%: Information Hierarchy */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Methodology Profile</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{currentModel.name}</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Core Mechanics</div>
              <p className="text-slate-700 text-[11px] leading-relaxed">{currentModel.coreIdea}</p>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold mb-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Potential Strengths
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                {currentModel.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase text-amber-700 font-bold mb-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Clinical Trade-offs
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                {currentModel.limitations.map((l, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px]">
              <div className="font-mono text-slate-500 uppercase font-bold text-[9px] mb-0.5">Validation Requirement</div>
              <div className="text-slate-700">{currentModel.considerations}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Table 2 Model Evaluation Framework (Research Explorer Mode) */}
      {mode === 'research' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Table 2: Candidate Models & Methodological Comparison
            </h3>
            <span className="text-[11px] font-semibold tracking-wide text-slate-500">Model Architecture Specifications</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Family</th>
                  <th className="py-2.5 px-3">Interpretability</th>
                  <th className="py-2.5 px-3">Primary Consideration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {CANDIDATE_MODELS.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-900">{m.name}</td>
                    <td className="py-2 px-3 text-slate-500">{m.family}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        m.interpretabilityScore.includes('High')
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.interpretabilityScore === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.interpretabilityScore}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 font-sans text-[11px]">{m.keyConsiderations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
