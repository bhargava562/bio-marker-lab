import React, { useState } from 'react';
import { 
  Cpu, 
  GitBranch, 
  Sliders, 
  ShieldAlert, 
  BarChart3, 
  Check, 
  AlertCircle, 
  Workflow 
} from 'lucide-react';
import { CANDIDATE_MODELS } from '../data/models';
import type { CandidateModel, ExplorationMode } from '../types';

interface LearningEngineViewProps {
  mode: ExplorationMode;
}

export const LearningEngineView: React.FC<LearningEngineViewProps> = ({ mode }) => {
  const [selectedModel, setSelectedModel] = useState<CandidateModel>(CANDIDATE_MODELS[0]);

  // Diagram visualization component per architectural type
  const renderArchitectureVisual = (type: CandidateModel['architecturalType']) => {
    switch (type) {
      case 'linear':
        return (
          <div className="w-full h-44 bg-[#070c18] rounded-lg border border-cyan-500/20 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="text-[11px] font-mono text-cyan-400">Sigmoid Log-Odds Hyperplane: P(Y=1) = 1 / (1 + e^-z)</div>
            <svg className="w-full h-24" viewBox="0 0 300 80">
              <line x1="20" y1="70" x2="280" y2="70" stroke="#334155" strokeWidth="1" />
              <line x1="20" y1="10" x2="20" y2="70" stroke="#334155" strokeWidth="1" />
              {/* Sigmoid S-curve */}
              <path d="M 30 68 Q 120 68 150 40 T 270 12" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="150" cy="40" r="4" fill="#38bdf8" />
              <line x1="150" y1="10" x2="150" y2="70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
              <text x="155" y="30" fill="#f59e0b" fontSize="9" fontFamily="monospace">Cutoff: 0.50</text>
            </svg>
            <div className="text-[10px] text-slate-400 font-mono flex justify-between">
              <span>Low Biomarker Risk (z &lt; 0)</span>
              <span>High Risk (z &gt; 0)</span>
            </div>
          </div>
        );
      case 'tree':
        return (
          <div className="w-full h-44 bg-[#070c18] rounded-lg border border-cyan-500/20 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="text-[11px] font-mono text-cyan-400">Orthogonal Split Logic (CART Node Partitioning)</div>
            <svg className="w-full h-24" viewBox="0 0 300 80">
              {/* Root node */}
              <rect x="110" y="5" width="80" height="20" rx="3" fill="#0e172e" stroke="#38bdf8" strokeWidth="1" />
              <text x="150" y="18" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">HbA1c &gt; 6.5%</text>
              {/* Left Branch */}
              <line x1="130" y1="25" x2="80" y2="45" stroke="#64748b" strokeWidth="1.5" />
              <rect x="40" y="45" width="80" height="20" rx="3" fill="#0e172e" stroke="#34d399" strokeWidth="1" />
              <text x="80" y="58" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="monospace">TG &lt; 150 mg/dL</text>
              {/* Right Branch */}
              <line x1="170" y1="25" x2="220" y2="45" stroke="#64748b" strokeWidth="1.5" />
              <rect x="180" y="45" width="80" height="20" rx="3" fill="#0e172e" stroke="#f87171" strokeWidth="1" />
              <text x="220" y="58" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="monospace">High Risk (89%)</text>
            </svg>
            <div className="text-[10px] text-slate-400 font-mono">Pruned binary decision splits mirror clinical protocols</div>
          </div>
        );
      case 'ensemble':
      case 'gradient_boost':
        return (
          <div className="w-full h-44 bg-[#070c18] rounded-lg border border-cyan-500/20 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="text-[11px] font-mono text-cyan-400">
              {type === 'ensemble' ? 'Bagged Sub-Tree Aggregation (B=500 Trees)' : 'Sequential Gradient Residual Boosting (η=0.05)'}
            </div>
            <div className="grid grid-cols-4 gap-2 my-auto">
              {[1, 2, 3, 4].map((t) => (
                <div key={t} className="p-2 rounded bg-slate-900 border border-slate-700/60 text-center">
                  <GitBranch className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <div className="text-[9px] font-mono text-slate-300">Tree #{t}</div>
                  <div className="text-[8px] font-mono text-slate-400">{type === 'ensemble' ? 'Bootstrapped' : 'Error Fit'}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Variance Reduction via Averaging</span>
              <span className="text-cyan-300">Target Loss: Logistic Loss</span>
            </div>
          </div>
        );
      case 'hyperplane':
        return (
          <div className="w-full h-44 bg-[#070c18] rounded-lg border border-cyan-500/20 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="text-[11px] font-mono text-cyan-400">Maximum Margin Separating Hyperplane in Hilbert Space</div>
            <svg className="w-full h-24" viewBox="0 0 300 80">
              {/* Negative support points */}
              <circle cx="60" cy="25" r="4" fill="#34d399" />
              <circle cx="90" cy="18" r="4" fill="#34d399" />
              <circle cx="100" cy="35" r="5" fill="#34d399" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Positive support points */}
              <circle cx="200" cy="50" r="5" fill="#f87171" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="230" cy="65" r="4" fill="#f87171" />
              <circle cx="210" cy="72" r="4" fill="#f87171" />
              {/* Separating boundary */}
              <line x1="50" y1="75" x2="250" y2="10" stroke="#38bdf8" strokeWidth="2" />
              <line x1="30" y1="65" x2="230" y2="0" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="70" y1="85" x2="270" y2="20" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
            <div className="text-[10px] text-slate-400 font-mono">Kernel Trick: K(x, x') = exp(-γ||x - x'||²)</div>
          </div>
        );
      case 'neural':
      default:
        return (
          <div className="w-full h-44 bg-[#070c18] rounded-lg border border-cyan-500/20 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="text-[11px] font-mono text-cyan-400">Multilayer Perceptron (Input → Hidden ReLU → Sigmoid)</div>
            <div className="flex items-center justify-around my-auto">
              <div className="flex flex-col gap-1.5 text-[9px] font-mono text-slate-400">
                <span>[FPG]</span>
                <span>[HbA1c]</span>
                <span>[TG]</span>
              </div>
              <div className="text-slate-600">→</div>
              <div className="flex flex-col gap-1">
                {[1, 2, 3, 4].map((h) => (
                  <span key={h} className="w-3 h-3 rounded-full bg-indigo-500/40 border border-indigo-400" />
                ))}
              </div>
              <div className="text-slate-600">→</div>
              <div className="w-4 h-4 rounded-full bg-cyan-500/40 border border-cyan-400 flex items-center justify-center text-[8px] font-bold">
                P
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Dense weight tensors with Dropout & Weight Decay</div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            Screen 04 • Machine-Learning Framework
          </span>
          <span className="text-xs text-slate-400">Table 2 of Project Report</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">The Learning Engine</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Comparative evaluation of candidate statistical learning and machine-learning models. Algorithms must be chosen empirically through cross-validated evidence, not predetermined favoritism.
        </p>
      </div>

      {/* Mandatory Scientific Notice */}
      <div className="sci-card p-3.5 mb-6 flex items-start gap-3 bg-amber-950/20 border-amber-500/30">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <strong className="text-amber-300 font-medium">Candidate Models Only:</strong> No final model has been trained or locked. Algorithms displayed below represent the approved candidate pool from Table 2 of the BRAINS research protocol. Selection will be dictated strictly by prospective nested cross-validation and calibration audits.
        </div>
      </div>

      {/* Candidate Algorithm Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {CANDIDATE_MODELS.map((m) => {
          const isSelected = selectedModel.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedModel(m)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Cpu className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Model Investigation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Architecture Breakdown */}
        <div className="lg:col-span-7 sci-panel p-5 space-y-5">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">{selectedModel.family}</div>
              <h2 className="text-lg font-bold text-white mt-0.5">{selectedModel.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{selectedModel.purpose}</p>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
              Interpretability: {selectedModel.interpretabilityScore}
            </span>
          </div>

          {/* Mathematical / Architectural Visual */}
          {renderArchitectureVisual(selectedModel.architecturalType)}

          {/* Mathematical Mechanics Description */}
          <div>
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Algorithmic Mechanics
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {selectedModel.mechanicsDescription}
            </p>
          </div>

          {/* Key Considerations from Table 2 */}
          <div className="bg-indigo-950/20 border border-indigo-500/30 p-3 rounded-lg text-xs">
            <div className="text-indigo-300 font-semibold mb-1 flex items-center gap-1.5 font-mono text-[11px]">
              <Workflow className="w-3.5 h-3.5 text-indigo-400" /> Key Considerations (Table 2)
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {selectedModel.keyConsiderations}
            </p>
          </div>
        </div>

        {/* Right: Comparative Trade-offs & Empirical Metrics */}
        <div className="lg:col-span-5 space-y-4">
          {/* Strengths & Limitations */}
          <div className="sci-panel p-5">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-2">
              Clinical Trade-Off Matrix
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-1.5 font-mono text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Methodological Strengths
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {selectedModel.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <div className="text-amber-400 font-semibold mb-2 flex items-center gap-1.5 font-mono text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" /> Clinical Vulnerabilities
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {selectedModel.limitations.map((l, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                <strong className="text-slate-300 font-mono">Cohort Data Requirement:</strong> {selectedModel.dataRequirement}
              </div>
            </div>
          </div>

          {/* Illustrative Benchmark Discrimination */}
          <div className="sci-card p-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Illustrative Internal Discrimination</span>
              <span className="text-[10px] text-amber-400">Synthetic CV Benchmark</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">AUROC</div>
                <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">{selectedModel.illustrativeAuroc.toFixed(3)}</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">Sensitivity</div>
                <div className="text-sm font-bold text-emerald-300 font-mono mt-0.5">{(selectedModel.illustrativeSensitivity * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">Specificity</div>
                <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">{(selectedModel.illustrativeSpecificity * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table 2 Master Overview Reference from Report */}
      {mode === 'research' && (
        <div className="mt-10 sci-panel p-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Table 2: Candidate Models, Purpose & Key Considerations</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Project Report Section 13</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2 px-3">Model</th>
                  <th className="py-2 px-3">Purpose</th>
                  <th className="py-2 px-3">Key Considerations</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {CANDIDATE_MODELS.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`cursor-pointer hover:bg-slate-800/40 transition-colors ${
                      selectedModel.id === m.id ? 'bg-cyan-950/40 text-cyan-200' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-semibold text-white">{m.name}</td>
                    <td className="py-2 px-3 text-cyan-300">{m.purpose}</td>
                    <td className="py-2 px-3 text-slate-400">{m.keyConsiderations}</td>
                    <td className="py-2 px-3 font-mono text-[11px] text-cyan-400">
                      {selectedModel.id === m.id ? 'Active' : 'Inspect'}
                    </td>
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
