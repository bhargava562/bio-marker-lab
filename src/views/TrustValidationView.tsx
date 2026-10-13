import React, { useState } from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  Calculator, 
  RotateCcw, 
  Activity 
} from 'lucide-react';
import { 
  DEFAULT_CONFUSION_MATRIX, 
  METRIC_DEFINITIONS_TABLE, 
  CLINICAL_CHALLENGE_SCENARIOS 
} from '../data/metrics';
import { 
  calculateAllMetrics, 
  formatMetricPercentage, 
  formatMetricDecimal 
} from '../lib/metricsCalculator';
import type { ConfusionMatrixData, ExplorationMode } from '../types';

interface TrustValidationViewProps {
  mode: ExplorationMode;
}

export const TrustValidationView: React.FC<TrustValidationViewProps> = ({ mode }) => {
  const [cm, setCm] = useState<ConfusionMatrixData>(DEFAULT_CONFUSION_MATRIX);
  const [selectedCell, setSelectedCell] = useState<'tp' | 'fp' | 'fn' | 'tn' | null>('tp');
  
  // Interactive clinical challenge state
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);

  const calculated = calculateAllMetrics(cm);
  const totalCases = cm.tp + cm.fp + cm.fn + cm.tn;
  const currentScenario = CLINICAL_CHALLENGE_SCENARIOS[activeScenarioIdx];

  const handleCellChange = (cell: keyof ConfusionMatrixData, value: number) => {
    setCm((prev) => ({
      ...prev,
      [cell]: Math.max(0, isNaN(value) ? 0 : value),
    }));
  };

  const getCellExplanation = () => {
    switch (selectedCell) {
      case 'tp':
        return {
          title: 'True Positive (TP)',
          count: cm.tp,
          desc: 'Patients with true abnormal diabetic status who were correctly identified by the biomarker model.',
          clinicalImpact: 'Enables timely clinical intervention, lifestyle counseling, and glycemic control stabilization before severe vascular complications occur.',
        };
      case 'fp':
        return {
          title: 'False Positive (FP)',
          count: cm.fp,
          desc: 'Patients with normal metabolic status who were incorrectly flagged as abnormal by the model.',
          clinicalImpact: 'Causes unnecessary psychological distress, unwarranted follow-up laboratory testing, and potential risk of inappropriate pharmacological prescription.',
        };
      case 'fn':
        return {
          title: 'False Negative (FN)',
          count: cm.fn,
          desc: 'Patients with active dysglycaemia or high complication risk who were incorrectly classified as low risk.',
          clinicalImpact: 'Dangerous clinical failure: missed opportunity for early intervention, allowing silent disease progression into nephropathy or retinopathy.',
        };
      case 'tn':
        return {
          title: 'True Negative (TN)',
          count: cm.tn,
          desc: 'Patients without abnormal glycaemia who were correctly identified as normal/low risk.',
          clinicalImpact: 'Reassures patient and clinician, avoiding excessive healthcare expenditure and redundant confirmatory diagnostic pipelines.',
        };
      default:
        return null;
    }
  };

  const cellInfo = getCellExplanation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            Screen 05 • Performance Evaluation & Rigour
          </span>
          <span className="text-xs text-slate-400">Section 16 & Table 4 of BRAINS Report</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Trust Under Testing</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Clinical AI cannot be evaluated by accuracy alone. Explore how sensitivity, specificity, predictive values, calibration, and leak-proof validation establish reliability.
        </p>
      </div>

      {/* Main Grid: Confusion Matrix + Calculated Metrics + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-10">
        
        {/* Left: Interactive Confusion Matrix */}
        <div className="lg:col-span-5 sci-panel p-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Illustrative Confusion Matrix</h3>
            </div>
            <button
              type="button"
              onClick={() => setCm(DEFAULT_CONFUSION_MATRIX)}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
              title="Reset to default synthetic 500-patient cohort"
            >
              <RotateCcw className="w-3 h-3" /> Reset (N=500)
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Click cells to inspect clinical significance or modify counts to observe dynamic mathematical metric recalculation:
          </p>

          {/* 2x2 Matrix Grid */}
          <div className="bg-[#070c18] p-3.5 rounded-xl border border-slate-800">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              {/* Header Corner */}
              <div className="p-2 text-[10px] text-slate-500 flex items-center justify-center">
                Actual \ Pred
              </div>
              <div className="p-2 text-slate-300 font-semibold bg-slate-900/60 rounded">
                Predicted Positive
              </div>
              <div className="p-2 text-slate-300 font-semibold bg-slate-900/60 rounded">
                Predicted Negative
              </div>

              {/* Actual Positive Row */}
              <div className="p-2 text-slate-300 font-semibold bg-slate-900/60 rounded flex items-center justify-center text-[11px]">
                Actual Positive
              </div>
              {/* TP Cell */}
              <div
                onClick={() => setSelectedCell('tp')}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedCell === 'tp'
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-400'
                }`}
              >
                <div className="text-[10px] text-emerald-400 font-semibold mb-1">True Positive (TP)</div>
                <input
                  type="number"
                  value={cm.tp}
                  onChange={(e) => handleCellChange('tp', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-emerald-500/40 rounded text-center text-emerald-200 font-bold py-1 text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>
              {/* FN Cell */}
              <div
                onClick={() => setSelectedCell('fn')}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedCell === 'fn'
                    ? 'bg-red-950/80 border-red-400 shadow-md shadow-red-500/20'
                    : 'bg-red-950/30 border-red-500/30 hover:border-red-400'
                }`}
              >
                <div className="text-[10px] text-red-400 font-semibold mb-1">False Negative (FN)</div>
                <input
                  type="number"
                  value={cm.fn}
                  onChange={(e) => handleCellChange('fn', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-red-500/40 rounded text-center text-red-200 font-bold py-1 text-sm focus:outline-none focus:border-red-400"
                />
              </div>

              {/* Actual Negative Row */}
              <div className="p-2 text-slate-300 font-semibold bg-slate-900/60 rounded flex items-center justify-center text-[11px]">
                Actual Negative
              </div>
              {/* FP Cell */}
              <div
                onClick={() => setSelectedCell('fp')}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedCell === 'fp'
                    ? 'bg-amber-950/80 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-amber-950/30 border-amber-500/30 hover:border-amber-400'
                }`}
              >
                <div className="text-[10px] text-amber-400 font-semibold mb-1">False Positive (FP)</div>
                <input
                  type="number"
                  value={cm.fp}
                  onChange={(e) => handleCellChange('fp', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-amber-500/40 rounded text-center text-amber-200 font-bold py-1 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              {/* TN Cell */}
              <div
                onClick={() => setSelectedCell('tn')}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedCell === 'tn'
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-cyan-950/30 border-cyan-500/30 hover:border-cyan-400'
                }`}
              >
                <div className="text-[10px] text-cyan-400 font-semibold mb-1">True Negative (TN)</div>
                <input
                  type="number"
                  value={cm.tn}
                  onChange={(e) => handleCellChange('tn', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded text-center text-cyan-200 font-bold py-1 text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Total Specimen Size: <strong className="text-white font-mono">{totalCases}</strong></span>
              <span className="font-mono text-cyan-400">Prevalence: {totalCases > 0 ? ((cm.tp + cm.fn) / totalCases * 100).toFixed(1) : 0}%</span>
            </div>
          </div>

          {/* Cell Clinical Impact Drawer */}
          {cellInfo && (
            <div className="mt-4 p-3 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs">
              <div className="flex items-center justify-between text-slate-200 font-semibold mb-1">
                <span>{cellInfo.title}</span>
                <span className="font-mono text-cyan-300">N = {cellInfo.count}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed mb-1.5">{cellInfo.desc}</p>
              <div className="text-[11px] text-indigo-300 font-mono border-t border-slate-800 pt-1.5">
                Clinical Consequence: {cellInfo.clinicalImpact}
              </div>
            </div>
          )}
        </div>

        {/* Center / Right: Dynamic Computed Metrics */}
        <div className="lg:col-span-7 space-y-4">
          <div className="sci-panel p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Mathematical Metric Derivation
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Division-by-Zero Protected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Sensitivity / Recall</div>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                  {formatMetricPercentage(calculated.sensitivity)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">TP / (TP + FN)</div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Specificity</div>
                <div className="text-xl font-bold text-indigo-400 font-mono mt-1">
                  {formatMetricPercentage(calculated.specificity)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">TN / (TN + FP)</div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Precision (PPV)</div>
                <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
                  {formatMetricPercentage(calculated.precision)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">TP / (TP + FP)</div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Negative Pred Value (NPV)</div>
                <div className="text-xl font-bold text-sky-400 font-mono mt-1">
                  {formatMetricPercentage(calculated.npv)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">TN / (TN + FN)</div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">F1-Score (Harmonic Mean)</div>
                <div className="text-xl font-bold text-amber-400 font-mono mt-1">
                  {formatMetricDecimal(calculated.f1Score)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">2·(P·R) / (P + R)</div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Headline Accuracy</div>
                <div className="text-xl font-bold text-slate-300 font-mono mt-1">
                  {formatMetricPercentage(calculated.accuracy)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">(TP + TN) / Total</div>
              </div>
            </div>

            {/* Warning on Imbalanced Accuracy */}
            <div className="mt-4 p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-slate-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Why accuracy alone misleads:</strong> If a complication occurs in only 5% of patients, a naive algorithm predicting everyone as negative achieves 95% accuracy while possessing 0% sensitivity. In clinical practice, Sensitivity, F1, and Calibration take priority.
              </div>
            </div>
          </div>

          {/* Validation Split Protocol Diagram */}
          <div className="sci-card p-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
              <span>Nested Partitioning & Leakage Prevention</span>
              <span className="text-cyan-400 text-[10px]">Section 15 Guidelines</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex h-7 rounded overflow-hidden text-center text-[10px] font-bold">
                <div className="bg-sky-600/80 text-white flex items-center justify-center w-[70%]">
                  Training Fold (70%) — Scaling & Selection Done HERE Only
                </div>
                <div className="bg-indigo-600/80 text-white flex items-center justify-center w-[15%]">
                  Inner Val (15%)
                </div>
                <div className="bg-emerald-600/80 text-white flex items-center justify-center w-[15%]">
                  Test Holdout (15%)
                </div>
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-1">
                Data leakage occurs if imputation parameters or feature selections touch validation/test holdouts before model locking.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Clinical Challenge: “Can this model be trusted yet?” */}
      <div className="sci-panel p-6 mb-10 border-indigo-500/30 bg-gradient-to-br from-[#0b1326] to-[#0d1630]">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Interactive Research Challenge: Can this model be trusted yet?</h3>
          </div>
          <div className="flex items-center gap-2">
            {CLINICAL_CHALLENGE_SCENARIOS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveScenarioIdx(i);
                  setSelectedOptionIdx(null);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  activeScenarioIdx === i
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/50'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Case #{i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-cyan-300 mb-1">{currentScenario.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            {currentScenario.scenarioDescription}
          </p>
        </div>

        <div className="text-xs font-semibold text-white mb-2">{currentScenario.question}</div>

        <div className="space-y-2 mb-4">
          {currentScenario.options.map((opt, idx) => {
            const isSelected = selectedOptionIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedOptionIdx(idx)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-start gap-2.5 border ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200'
                      : 'bg-red-950/40 border-red-400 text-red-200'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {selectedOptionIdx !== null && (
          <div className={`p-3.5 rounded-lg text-xs leading-relaxed border ${
            currentScenario.options[selectedOptionIdx].isCorrect
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          }`}>
            <strong className="block mb-1 font-mono">
              {currentScenario.options[selectedOptionIdx].isCorrect ? '✓ Scientific Evaluation Confirmed:' : '⚠ Methodological Pitfall:'}
            </strong>
            {currentScenario.options[selectedOptionIdx].feedback}
          </div>
        )}
      </div>

      {/* Table 4 Master Metrics Reference from Report */}
      {mode === 'research' && (
        <div className="sci-panel p-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Table 4: Clinical Metrics, Formulae & Importance</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Project Report Section 16</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2 px-3">Metric</th>
                  <th className="py-2 px-3">Formula / Interpretation</th>
                  <th className="py-2 px-3">Importance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {METRIC_DEFINITIONS_TABLE.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white">{m.name}</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300 text-[11px]">{m.formula}</td>
                    <td className="py-2.5 px-3 text-slate-400">{m.clinicalImportance}</td>
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
