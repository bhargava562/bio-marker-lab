import React, { useState } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { DEFAULT_CONFUSION_MATRIX, METRIC_DEFINITIONS_TABLE } from '../../data/metrics';
import { calculateAllMetrics, formatMetricPercentage, formatMetricDecimal } from '../../lib/metricsCalculator';
import type { ConfusionMatrixData, ExplorationMode } from '../../types';

interface ValidationToolProps {
  mode: ExplorationMode;
}

export const ValidationTool: React.FC<ValidationToolProps> = ({ mode }) => {
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
          desc: 'Healthy/normoglycaemic individuals correctly identified as normal.',
          clinicalMeaning: 'Prevents unwarranted interventions and reassures low-risk patients.',
        };
    }
  };

  const activeCellInfo = getCellDetails();

  return (
    <div className="space-y-6">
      
      {/* Tool Introduction & Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span>Validation Studio · Metrics & Evaluation</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            In clinical screening, overall accuracy alone can be dangerously deceptive. Test how confusion matrix cell distributions govern Sensitivity, Specificity, Precision, NPV, and F1.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCm(DEFAULT_CONFUSION_MATRIX)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 hover:text-slate-900 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Counts</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left 50% Confusion Matrix & Inspector / Right 50% Derived Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 50%: Interactive 2x2 Matrix */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Interactive 2×2 Confusion Matrix
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Click any cell or edit counts directly to recalculate metrics</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Total N = {total}</span>
          </div>

          {/* 2x2 Table Layout with Row/Col Headers */}
          <div className="relative pt-6 pl-10 pr-2">
            
            {/* Top axis label */}
            <div className="text-[11px] font-mono uppercase text-slate-500 font-bold text-center mb-2 tracking-wider">
              Predicted Condition
            </div>
            
            {/* Left axis label */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-mono uppercase text-slate-500 font-bold tracking-wider origin-center">
              Actual
            </div>

            <div className="grid grid-cols-2 gap-3">
              
              {/* TP Cell */}
              <div
                onClick={() => setSelectedCell('tp')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCell === 'tp'
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-800 font-bold mb-1">
                  <span>True Positive (TP)</span>
                  <span className="text-[9px] bg-emerald-200/80 px-1.5 py-0.5 rounded text-emerald-900">Hit</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    min="0"
                    value={cm.tp}
                    onChange={(e) => handleCellChange('tp', parseInt(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 text-2xl font-bold font-mono text-slate-900 bg-transparent border-b border-emerald-400/60 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-xs text-slate-500 font-mono">
                    ({total > 0 ? ((cm.tp / total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Correctly identified positive</div>
              </div>

              {/* FN Cell */}
              <div
                onClick={() => setSelectedCell('fn')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCell === 'fn'
                    ? 'border-red-500 bg-red-50/80 shadow-md ring-2 ring-red-400/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-red-800 font-bold mb-1">
                  <span>False Negative (FN)</span>
                  <span className="text-[9px] bg-red-200/80 px-1.5 py-0.5 rounded text-red-900">Miss</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    min="0"
                    value={cm.fn}
                    onChange={(e) => handleCellChange('fn', parseInt(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 text-2xl font-bold font-mono text-red-700 bg-transparent border-b border-red-400/60 focus:outline-none focus:border-red-600"
                  />
                  <span className="text-xs text-slate-500 font-mono">
                    ({total > 0 ? ((cm.fn / total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="text-[10px] text-red-600 font-medium mt-1">Missed positive cases (critical)</div>
              </div>

              {/* FP Cell */}
              <div
                onClick={() => setSelectedCell('fp')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCell === 'fp'
                    ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-800 font-bold mb-1">
                  <span>False Positive (FP)</span>
                  <span className="text-[9px] bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900">False Alarm</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    min="0"
                    value={cm.fp}
                    onChange={(e) => handleCellChange('fp', parseInt(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 text-2xl font-bold font-mono text-slate-900 bg-transparent border-b border-amber-400/60 focus:outline-none focus:border-amber-600"
                  />
                  <span className="text-xs text-slate-500 font-mono">
                    ({total > 0 ? ((cm.fp / total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Normal incorrectly flagged</div>
              </div>

              {/* TN Cell */}
              <div
                onClick={() => setSelectedCell('tn')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCell === 'tn'
                    ? 'border-cyan-500 bg-cyan-50/80 shadow-md ring-2 ring-cyan-400/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-800 font-bold mb-1">
                  <span>True Negative (TN)</span>
                  <span className="text-[9px] bg-cyan-200/80 px-1.5 py-0.5 rounded text-cyan-900">Correct Normal</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    min="0"
                    value={cm.tn}
                    onChange={(e) => handleCellChange('tn', parseInt(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 text-2xl font-bold font-mono text-slate-900 bg-transparent border-b border-cyan-400/60 focus:outline-none focus:border-cyan-600"
                  />
                  <span className="text-xs text-slate-500 font-mono">
                    ({total > 0 ? ((cm.tn / total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Correctly identified normal</div>
              </div>

            </div>
          </div>

          {/* Selected Cell Inspector */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900">{activeCellInfo.title}</span>
              <span className="font-mono text-cyan-800 font-bold">{activeCellInfo.count} cases ({activeCellInfo.fraction}%)</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">{activeCellInfo.desc}</p>
            <div className="text-[11px] text-slate-800 bg-white p-2 rounded border border-slate-200">
              <strong className="text-slate-900">Clinical Impact:</strong> {activeCellInfo.clinicalMeaning}
            </div>
          </div>
        </div>

        {/* Right 50%: Pure Mathematically Derived Performance Metrics */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Derived Clinical Performance Metrics
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Calculated using tested pure TypeScript functions</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Auto-Calculated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            
            {/* Sensitivity */}
            <div
              onClick={() => setSelectedMetric('Sensitivity / Recall')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedMetric.includes('Sensitivity')
                  ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Sensitivity (Recall)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {formatMetricPercentage(calculated.sensitivity)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">TP / (TP + FN)</div>
            </div>

            {/* Specificity */}
            <div
              onClick={() => setSelectedMetric('Specificity')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedMetric.includes('Specificity')
                  ? 'border-cyan-500 bg-cyan-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Specificity</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {formatMetricPercentage(calculated.specificity)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">TN / (TN + FP)</div>
            </div>

            {/* Precision / PPV */}
            <div
              onClick={() => setSelectedMetric('Precision / PPV')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedMetric.includes('Precision')
                  ? 'border-indigo-500 bg-indigo-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Precision (PPV)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {formatMetricPercentage(calculated.precision)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">TP / (TP + FP)</div>
            </div>

            {/* Negative Predictive Value */}
            <div
              onClick={() => setSelectedMetric('NPV')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedMetric.includes('NPV')
                  ? 'border-sky-500 bg-sky-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Negative Pred Value (NPV)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {formatMetricPercentage(calculated.npv)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">TN / (TN + FN)</div>
            </div>

            {/* F1 Score */}
            <div
              onClick={() => setSelectedMetric('F1 Score')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedMetric.includes('F1')
                  ? 'border-purple-500 bg-purple-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">F1 Score (Harmonic Mean)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {formatMetricDecimal(calculated.f1Score)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">2·(P·R)/(P + R)</div>
            </div>

            {/* Accuracy */}
            <div
              onClick={() => setSelectedMetric('Accuracy')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedMetric.includes('Accuracy')
                  ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Accuracy</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {formatMetricPercentage(calculated.accuracy)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">(TP + TN) / Total</div>
            </div>

          </div>

          {/* Metric Interpretation Panel */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="font-mono font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>Metric Focus: {selectedMetric}</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {selectedMetric.includes('Sensitivity') && 'Measures the proportion of patients with diabetes who are correctly identified. High sensitivity is crucial for early screening to minimize false negatives.'}
              {selectedMetric.includes('Specificity') && 'Measures the proportion of healthy individuals correctly classified as non-diabetic. High specificity avoids burdening normal individuals with unnecessary clinical diagnostic cascades.'}
              {selectedMetric.includes('Precision') && 'Of all patients flagged positive by the model, how many actually have diabetes. Heavily influenced by disease prevalence in the tested clinical population.'}
              {selectedMetric.includes('NPV') && 'Of all patients flagged negative, the proportion who truly do not have diabetes. Essential for safely ruling out disease.'}
              {selectedMetric.includes('F1') && 'The harmonic mean between precision and recall, providing a balanced summary when class imbalance makes raw accuracy misleading.'}
              {selectedMetric.includes('Accuracy') && 'Overall proportion of correct classifications. In imbalanced cohorts (e.g. 5% prevalence), a dumb model predicting everyone is normal achieves 95% accuracy while missing every single patient!'}
            </p>
          </div>
        </div>

      </div>

      {/* Conceptual Performance Visualisations: ROC, Precision-Recall, Calibration */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Conceptual Diagnostic Performance Curves
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Illustrative ROC, Precision–Recall, and Calibration plots showing how threshold shifts trade off true positives against false alarms.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Illustrative curves</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* ROC Curve */}
          <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold font-mono text-slate-800 mb-1">ROC Curve (AUROC ~ 0.89)</div>
            <svg className="w-full h-36" viewBox="0 0 160 120">
              <line x1="25" y1="100" x2="145" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="25" y1="15" x2="25" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Chance diagonal */}
              <line x1="25" y1="100" x2="145" y2="15" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
              {/* ROC Curve */}
              <path d="M 25 100 Q 35 25 145 15" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              {/* Current operating point */}
              <circle cx="50" cy="35" r="4" fill="#f59e0b" />
              <text x="30" y="112" fontSize="7" fill="#64748b" fontFamily="monospace">0.0</text>
              <text x="135" y="112" fontSize="7" fill="#64748b" fontFamily="monospace">1.0 FPR</text>
              <text x="10" y="25" fontSize="7" fill="#64748b" fontFamily="monospace">TPR</text>
            </svg>
            <div className="text-[10px] text-slate-500 text-center mt-1">
              True Positive Rate vs False Positive Rate across all cutoffs.
            </div>
          </div>

          {/* Precision-Recall Curve */}
          <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold font-mono text-slate-800 mb-1">Precision-Recall (AUPRC)</div>
            <svg className="w-full h-36" viewBox="0 0 160 120">
              <line x1="25" y1="100" x2="145" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="25" y1="15" x2="25" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Baseline prevalence */}
              <line x1="25" y1="85" x2="145" y2="85" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
              {/* PR Curve */}
              <path d="M 25 22 C 70 24 105 45 145 85" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <circle cx="85" cy="36" r="4" fill="#f59e0b" />
              <text x="30" y="112" fontSize="7" fill="#64748b" fontFamily="monospace">0.0</text>
              <text x="130" y="112" fontSize="7" fill="#64748b" fontFamily="monospace">1.0 Recall</text>
              <text x="5" y="25" fontSize="7" fill="#64748b" fontFamily="monospace">Prec</text>
            </svg>
            <div className="text-[10px] text-slate-500 text-center mt-1">
              Maintains diagnostic honesty under severe prevalence skew.
            </div>
          </div>

          {/* Calibration Curve */}
          <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold font-mono text-slate-800 mb-1">Calibration Reliability</div>
            <svg className="w-full h-36" viewBox="0 0 160 120">
              <line x1="25" y1="100" x2="145" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="25" y1="15" x2="25" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Perfect 45-degree calibration */}
              <line x1="25" y1="100" x2="145" y2="15" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
              {/* Actual calibration */}
              <path d="M 25 100 L 55 80 L 85 58 L 115 35 L 145 15" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              <text x="30" y="112" fontSize="7" fill="#64748b" fontFamily="monospace">Pred Prob</text>
              <text x="5" y="25" fontSize="7" fill="#64748b" fontFamily="monospace">Obs</text>
            </svg>
            <div className="text-[10px] text-slate-500 text-center mt-1">
              Verifies if a 70% risk estimate reflects 7 in 10 observed events.
            </div>
          </div>

        </div>
      </div>

      {/* Clinical Challenge Scenario: "Can you trust this model?" */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Research Challenge: Can You Trust This Model?
          </h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed mb-4 max-w-3xl">
          Suppose an experimental model screens a cohort of 1,000 patients where 50 individuals actually have diabetes (5% prevalence). The algorithm flags 45 of them correctly (90% sensitivity), but also generates 95 false alarms (90% specificity). What is the probability that a patient who tested positive truly has diabetes?
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {[
            { id: 1, label: '90% (Matching Sensitivity)', correct: false },
            { id: 2, label: '32.1% (Calculated Precision)', correct: true },
            { id: 3, label: '50% (Equally likely)', correct: false },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setChallengeAnswer(opt.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                challengeAnswer === opt.id
                  ? opt.correct
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold'
                    : 'bg-red-50 text-red-900 border-red-400'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {challengeAnswer !== null && (
          <div className={`p-3 rounded-lg border text-xs ${
            challengeAnswer === 2
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {challengeAnswer === 2 ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Correct!</strong> Total positive predictions = 45 TP + 95 FP = 140. The Positive Predictive Value is 45 / 140 = <strong className="font-mono">32.1%</strong>. This illustrates why high sensitivity alone is not enough in low-prevalence screening without evaluating PPV!
                </div>
              </div>
            ) : (
              <div>
                <strong className="font-semibold">Not quite.</strong> Remember to calculate PPV = TP / (TP + FP). In this cohort: 45 / (45 + 95) = 32.1%. A positive result means a 32% chance of disease, not 90%!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table 3 Performance Metrics Table (Research Mode) */}
      {mode === 'research' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Table 3: Evaluation Metrics for Diabetic Biomarker Models
            </h3>
            <span className="text-[11px] font-semibold tracking-wide text-slate-500">Diagnostic Evaluation Standards</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                  <th className="py-2.5 px-3">Metric</th>
                  <th className="py-2.5 px-3">Mathematical Formula</th>
                  <th className="py-2.5 px-3">Clinical Significance</th>
                  <th className="py-2.5 px-3">Risk of Misinterpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {METRIC_DEFINITIONS_TABLE.map((m) => (
                  <tr key={m.name} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-900">{m.name}</td>
                    <td className="py-2 px-3 text-cyan-800">{m.formula}</td>
                    <td className="py-2 px-3 text-slate-600 font-sans text-[11px]">{m.interpretation}</td>
                    <td className="py-2 px-3 text-indigo-700 font-sans text-[11px]">{m.clinicalImportance}</td>
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
