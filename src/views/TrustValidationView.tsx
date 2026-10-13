import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2 
} from 'lucide-react';
import { DEFAULT_CONFUSION_MATRIX, METRIC_DEFINITIONS_TABLE } from '../data/metrics';
import { calculateAllMetrics, formatMetricPercentage, formatMetricDecimal } from '../lib/metricsCalculator';
import type { ConfusionMatrixData, ExplorationMode } from '../types';

interface TrustValidationViewProps {
  mode: ExplorationMode;
}

export const TrustValidationView: React.FC<TrustValidationViewProps> = ({ mode: _mode }) => {
  const navigate = useNavigate();
  const [cm, setCm] = useState<ConfusionMatrixData>(DEFAULT_CONFUSION_MATRIX);
  const [selectedCell, setSelectedCell] = useState<'tp' | 'fp' | 'fn' | 'tn'>('tp');
  const [selectedMetric, setSelectedMetric] = useState<string>('Sensitivity / Recall');
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);

  const calculated = calculateAllMetrics(cm);
  const total = cm.tp + cm.fp + cm.fn + cm.tn;

  const handleCellChange = (cell: keyof ConfusionMatrixData, val: number) => {
    setCm((prev) => ({
      ...prev,
      [cell]: Math.max(0, isNaN(val) ? 0 : val),
    }));
  };

  const getCellDetails = () => {
    switch (selectedCell) {
      case 'tp':
        return {
          title: 'True Positive (TP)',
          count: cm.tp,
          fraction: total > 0 ? ((cm.tp / total) * 100).toFixed(1) : '0',
          desc: 'Patients with true abnormal diabetic status correctly flagged by the candidate model.',
          clinicalMeaning: 'Enables timely medical intervention, glucose stabilization, and early complication prevention.',
        };
      case 'fn':
        return {
          title: 'False Negative (FN)',
          count: cm.fn,
          fraction: total > 0 ? ((cm.fn / total) * 100).toFixed(1) : '0',
          desc: 'Patients with abnormal metabolic status incorrectly classified as normal/low-risk.',
          clinicalMeaning: 'Critical clinical risk: missed disease progression allowing silent onset of microvascular complications.',
        };
      case 'fp':
        return {
          title: 'False Positive (FP)',
          count: cm.fp,
          fraction: total > 0 ? ((cm.fp / total) * 100).toFixed(1) : '0',
          desc: 'Normoglycaemic patients incorrectly classified as abnormal.',
          clinicalMeaning: 'Causes patient anxiety, unnecessary confirmatory testing costs, and potential overtreatment risk.',
        };
      case 'tn':
        return {
          title: 'True Negative (TN)',
          count: cm.tn,
          fraction: total > 0 ? ((cm.tn / total) * 100).toFixed(1) : '0',
          desc: 'Patients without diabetes correctly identified as low risk.',
          clinicalMeaning: 'Reassures clinician and patient; avoids redundant healthcare expenditures.',
        };
    }
  };

  const cellDetails = getCellDetails();
  const activeMetricDef = METRIC_DEFINITIONS_TABLE.find((m) => m.name === selectedMetric) || METRIC_DEFINITIONS_TABLE[0];

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-slate-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-semibold mb-0.5">
            Stage 05 · 2D Investigate · Evaluation & Rigour
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trust Under Testing
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Understand how clinical model reliability is evaluated beyond accuracy. Inspect the confusion matrix, understand denominator effects, and explore validation rigour.
          </p>
        </div>

        {/* SECTION A — UNDERSTAND THE ERRORS */}
        <div className="mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-cyan-600" />
            Section A — Understand the Errors
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Interactive Confusion Matrix */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                    Illustrative Confusion Matrix
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Example counts only · Not measured clinical model performance
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCm(DEFAULT_CONFUSION_MATRIX)}
                  className="text-[11px] font-mono text-cyan-700 hover:text-cyan-900 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset (N=500)
                </button>
              </div>

              {/* 2x2 Matrix */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  {/* Header Corner */}
                  <div className="p-2 text-[10px] text-slate-400 flex items-center justify-center">
                    Actual \ Pred
                  </div>
                  <div className="p-2 text-slate-800 font-bold bg-white rounded border border-slate-200 text-[11px]">
                    Predicted Positive
                  </div>
                  <div className="p-2 text-slate-800 font-bold bg-white rounded border border-slate-200 text-[11px]">
                    Predicted Negative
                  </div>

                  {/* Actual Positive Row */}
                  <div className="p-2 text-slate-800 font-bold bg-white rounded border border-slate-200 flex items-center justify-center text-[11px]">
                    Actual Positive
                  </div>
                  {/* TP Cell */}
                  <div
                    onClick={() => setSelectedCell('tp')}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedCell === 'tp'
                        ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="text-[10px] text-emerald-800 font-bold mb-1">True Positive (TP)</div>
                    <input
                      type="number"
                      value={cm.tp}
                      onChange={(e) => handleCellChange('tp', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-emerald-300 rounded text-center text-slate-900 font-bold py-1 text-sm focus:outline-none"
                    />
                  </div>
                  {/* FN Cell */}
                  <div
                    onClick={() => setSelectedCell('fn')}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedCell === 'fn'
                        ? 'bg-red-50 border-red-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-red-300'
                    }`}
                  >
                    <div className="text-[10px] text-red-800 font-bold mb-1">False Negative (FN)</div>
                    <input
                      type="number"
                      value={cm.fn}
                      onChange={(e) => handleCellChange('fn', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-red-300 rounded text-center text-slate-900 font-bold py-1 text-sm focus:outline-none"
                    />
                  </div>

                  {/* Actual Negative Row */}
                  <div className="p-2 text-slate-800 font-bold bg-white rounded border border-slate-200 flex items-center justify-center text-[11px]">
                    Actual Negative
                  </div>
                  {/* FP Cell */}
                  <div
                    onClick={() => setSelectedCell('fp')}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedCell === 'fp'
                        ? 'bg-amber-50 border-amber-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-[10px] text-amber-800 font-bold mb-1">False Positive (FP)</div>
                    <input
                      type="number"
                      value={cm.fp}
                      onChange={(e) => handleCellChange('fp', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-amber-300 rounded text-center text-slate-900 font-bold py-1 text-sm focus:outline-none"
                    />
                  </div>
                  {/* TN Cell */}
                  <div
                    onClick={() => setSelectedCell('tn')}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedCell === 'tn'
                        ? 'bg-cyan-50 border-cyan-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-cyan-300'
                    }`}
                  >
                    <div className="text-[10px] text-cyan-800 font-bold mb-1">True Negative (TN)</div>
                    <input
                      type="number"
                      value={cm.tn}
                      onChange={(e) => handleCellChange('tn', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-cyan-300 rounded text-center text-slate-900 font-bold py-1 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
                  <span>Total Cases: <strong className="text-slate-900">{total}</strong></span>
                  <span>Prevalence: {total > 0 ? (((cm.tp + cm.fn) / total) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>

              {/* Dynamic Aligned Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {[
                  { name: 'Sensitivity / Recall', label: 'Sensitivity', val: calculated.sensitivity, formula: 'TP / (TP+FN)' },
                  { name: 'Specificity', label: 'Specificity', val: calculated.specificity, formula: 'TN / (TN+FP)' },
                  { name: 'Precision / PPV', label: 'Precision', val: calculated.precision, formula: 'TP / (TP+FP)' },
                  { name: 'NPV', label: 'NPV', val: calculated.npv, formula: 'TN / (TN+FN)' },
                  { name: 'F1-score', label: 'F1 Score', val: calculated.f1Score, isDecimal: true, formula: 'Harmonic Mean' },
                ].map((m) => {
                  const isSelected = selectedMetric === m.name;
                  return (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setSelectedMetric(m.name)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] font-mono opacity-80">{m.label}</div>
                      <div className="text-base font-bold font-mono my-0.5">
                        {m.isDecimal ? formatMetricDecimal(m.val) : formatMetricPercentage(m.val)}
                      </div>
                      <div className="text-[9px] font-mono opacity-60 truncate">{m.formula}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Cell's Explanation & Active Metric Definition */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Cell Clinical Details */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    Selected Matrix Cell: {cellDetails.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                    N = {cellDetails.count} ({cellDetails.fraction}%)
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {cellDetails.desc}
                </p>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                  <strong className="text-slate-900 font-mono text-[11px] block mb-0.5">Clinical Implication:</strong>
                  <span className="text-slate-600 text-[11px]">{cellDetails.clinicalMeaning}</span>
                </div>
              </div>

              {/* Metric Plain English Definition */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Selected Metric Analysis</span>
                  <h4 className="text-sm font-bold text-slate-900">{activeMetricDef.name}</h4>
                  <div className="text-xs font-mono text-cyan-700 mt-0.5">{activeMetricDef.formula}</div>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Interpretation:</strong> {activeMetricDef.interpretation}
                </div>
                <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                  <strong className="text-slate-900">Clinical Importance:</strong> {activeMetricDef.clinicalImportance}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SECTION B — TEST THE EVIDENCE */}
        <div className="mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
            Section B — Test the Evidence
          </div>

          {/* 4 Conceptual Evaluation Diagrams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            
            {/* Diagram 1: ROC Curve */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Conceptual ROC Curve</h4>
                <p className="text-[11px] text-slate-500 mb-2">Sensitivity vs False-Positive Rate across thresholds.</p>
                <svg className="w-full h-32 bg-slate-50 rounded border border-slate-200" viewBox="0 0 140 100">
                  <line x1="20" y1="80" x2="120" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="20" y1="10" x2="20" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="20" y1="80" x2="120" y2="10" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                  <path d="M 20 80 Q 25 25 120 10" fill="none" stroke="#0284c7" strokeWidth="2" />
                  <text x="35" y="92" fontSize="7" fill="#64748b" fontFamily="monospace">1 - Specificity</text>
                  <text x="22" y="20" fontSize="7" fill="#64748b" fontFamily="monospace">Sensitivity</text>
                </svg>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                Conceptual diagram · No fabricated AUC
              </div>
            </div>

            {/* Diagram 2: Precision-Recall Curve */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Precision–Recall Curve</h4>
                <p className="text-[11px] text-slate-500 mb-2">Trade-off when positive cases are uncommon.</p>
                <svg className="w-full h-32 bg-slate-50 rounded border border-slate-200" viewBox="0 0 140 100">
                  <line x1="20" y1="80" x2="120" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="20" y1="10" x2="20" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                  <path d="M 20 20 Q 90 22 120 75" fill="none" stroke="#818cf8" strokeWidth="2" />
                  <text x="45" y="92" fontSize="7" fill="#64748b" fontFamily="monospace">Recall</text>
                  <text x="22" y="20" fontSize="7" fill="#64748b" fontFamily="monospace">Precision</text>
                </svg>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                Informative under severe outcome imbalance
              </div>
            </div>

            {/* Diagram 3: Calibration Plot */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Calibration Reliability</h4>
                <p className="text-[11px] text-slate-500 mb-2">Predicted probabilities vs observed event rates.</p>
                <svg className="w-full h-32 bg-slate-50 rounded border border-slate-200" viewBox="0 0 140 100">
                  <line x1="20" y1="80" x2="120" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="20" y1="10" x2="20" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="20" y1="80" x2="120" y2="10" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="40" cy="65" r="2.5" fill="#10b981" />
                  <circle cx="70" cy="45" r="2.5" fill="#10b981" />
                  <circle cx="100" cy="25" r="2.5" fill="#10b981" />
                  <text x="35" y="92" fontSize="7" fill="#64748b" fontFamily="monospace">Predicted Prob</text>
                  <text x="22" y="20" fontSize="7" fill="#64748b" fontFamily="monospace">Observed Rate</text>
                </svg>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                Clinical safety demands calibrated probabilities
              </div>
            </div>

            {/* Diagram 4: Data Split Diagram */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Data Split Containment</h4>
                <p className="text-[11px] text-slate-500 mb-2">Strict separation prevents target leakage.</p>
                <div className="space-y-1.5 my-2">
                  <div className="p-1.5 bg-sky-100 border border-sky-300 rounded text-[10px] font-mono text-sky-900 text-center font-bold">
                    Training Fold (70%)
                  </div>
                  <div className="p-1.5 bg-indigo-100 border border-indigo-300 rounded text-[10px] font-mono text-indigo-900 text-center font-bold">
                    Validation Tuning (15%)
                  </div>
                  <div className="p-1.5 bg-emerald-100 border border-emerald-300 rounded text-[10px] font-mono text-emerald-900 text-center font-bold">
                    Locked Test Holdout (15%)
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">
                Preprocessing parameters learned in train only
              </div>
            </div>

          </div>

          {/* Interactive Challenge: Can you trust this model? */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Interactive Challenge: Can you trust this model?
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              “A model performs well on a random split of records from one dataset. Has it been shown to work reliably in a different hospital or community population?”
            </p>

            <div className="space-y-2 mb-4">
              {[
                { id: 1, text: 'Yes — High cross-validated performance mathematically guarantees external validity.' },
                { id: 2, text: 'No — Internal results alone do not establish generalisability; dataset shift and laboratory assay variations require independent external validation.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChallengeAnswer(opt.id)}
                  className={`w-full text-left p-3 rounded-lg text-xs transition-all border flex items-center justify-between ${
                    challengeAnswer === opt.id
                      ? opt.id === 2
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-medium'
                        : 'bg-red-50 border-red-400 text-red-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt.text}</span>
                  <span className="font-mono text-xs opacity-60">Option {opt.id}</span>
                </button>
              ))}
            </div>

            {challengeAnswer !== null && (
              <div className={`p-3 rounded-lg text-xs leading-relaxed border ${
                challengeAnswer === 2
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                <strong className="block mb-0.5 font-mono">
                  {challengeAnswer === 2 ? '✓ Correct Clinical Research Lesson:' : '⚠ Methodological Fallacy:'}
                </strong>
                Strong internal cross-validation only demonstrates performance on records sharing the exact same population distributions and laboratory equipment. True clinical reliability requires prospective validation across independent geographic institutions.
              </div>
            )}
          </div>

        </div>

        {/* Next Step Navigation */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/models')}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium"
          >
            ← Back to Models
          </button>

          <button
            type="button"
            onClick={() => navigate('/explainability')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition-all shadow-sm"
          >
            <span>Next: Inside the Prediction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
