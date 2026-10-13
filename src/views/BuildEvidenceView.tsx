import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Filter, 
  Table, 
  FileCode, 
  Info, 
  Eye 
} from 'lucide-react';
import { SYNTHETIC_PATIENT_RECORDS, DATA_DOMAINS_TABLE } from '../data/dataQuality';
import type { SyntheticPatientRecord, ExplorationMode } from '../types';

interface BuildEvidenceViewProps {
  mode: ExplorationMode;
}

export const BuildEvidenceView: React.FC<BuildEvidenceViewProps> = ({ mode }) => {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<SyntheticPatientRecord>(SYNTHETIC_PATIENT_RECORDS[1]); // Default to rec-002 with unit mismatch
  const [issueFilter, setIssueFilter] = useState<string>('all');
  const [previewCleaned, setPreviewCleaned] = useState<boolean>(false);
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<number>(1);

  const filterOptions = [
    { id: 'all', label: 'All Records' },
    { id: 'flagged', label: 'Flagged Issues' },
    { id: 'implausible_unit', label: 'Unit Review (mmol/L)' },
    { id: 'biologically_implausible', label: 'Implausible (BMI)' },
    { id: 'missing', label: 'Missing Values' },
    { id: 'duplicate', label: 'Duplicates' },
  ];

  const filteredRecords = SYNTHETIC_PATIENT_RECORDS.filter((r) => {
    if (issueFilter === 'all') return true;
    if (issueFilter === 'flagged') return r.flaggedIssues.length > 0;
    return r.flaggedIssues.some((issue) => issue.issueType === issueFilter);
  });

  const activeIssue = selectedRecord.flaggedIssues[0] || null;

  const getCleanedValue = (rec: SyntheticPatientRecord, field: 'fpg' | 'bmi' | 'hba1c' | 'sex') => {
    if (!previewCleaned) return rec[field];
    if (rec.id === 'rec-002' && field === 'fpg') return '140.5 mg/dL';
    if (rec.id === 'rec-003' && field === 'bmi') return '24.2 kg/m²';
    if (rec.id === 'rec-004' && field === 'hba1c') return '[Imputed in Fold]';
    if (rec.id === 'rec-005' && field === 'sex') return 'M';
    return rec[field];
  };

  const workflowSteps = [
    {
      step: 1,
      title: 'Raw Data',
      desc: 'Heterogeneous clinical feeds, variable laboratory machines, inconsistent units (mg/dL vs mmol/L).',
      protocol: 'Lock initial extraction timestamp; assign unique anonymized study identifiers.',
    },
    {
      step: 2,
      title: 'Quality Checks',
      desc: 'Systematic screening for biologically impossible ranges, unit mismatches, and duplicated blood samples.',
      protocol: 'Document all anomalies in data dictionary prior to statistical modeling.',
    },
    {
      step: 3,
      title: 'Preprocessing',
      desc: 'Standardize units, winsorize entry typos, and estimate imputation strictly within training folds.',
      protocol: 'Prevent target leakage by freezing test holdouts during preprocessing.',
    },
    {
      step: 4,
      title: 'Model-Ready Data',
      desc: 'Harmonized, scaled tabular matrix verified for cross-validation and feature selection.',
      protocol: 'Verified analytic cohort ready for comparative candidate model training.',
    },
  ];

  const matrixColumns = ['FPG', 'PPG', 'HbA1c', 'Insulin', 'TG', 'HDL', 'Cr', 'eGFR', 'UACR'];

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Region */}
        <div className="mb-6 pb-4 border-b border-slate-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-semibold mb-0.5">
            Stage 03 · 2D Investigate · Research Workbench
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Build the Evidence
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Reliable machine learning begins with reliable data. Inspect the synthetic cohort, identify laboratory anomalies, and preview protocol-driven preprocessing.
          </p>
          <div className="mt-2 text-[11px] font-mono text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-600" />
            <span>Deterministic synthetic specimen cohort · N = 8 records for methodological demonstration</span>
          </div>
        </div>

        {/* Filter Toolbar & Preview Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {filterOptions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setIssueFilter(f.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  issueFilter === f.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPreviewCleaned(!previewCleaned)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              previewCleaned
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-600" />
            <span>{previewCleaned ? 'Showing: Cleaned State' : 'Preview Illustrative Cleaning'}</span>
          </button>
        </div>

        {/* Main Composition: Left 68% Table / Right 32% Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          
          {/* Left 68%: Record Table */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-cyan-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Specimen Records Table
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {filteredRecords.length} of 8 rows shown
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
                    <th className="py-2.5 px-3">Study ID</th>
                    <th className="py-2.5 px-2">Age/Sex</th>
                    <th className="py-2.5 px-2">BMI (kg/m²)</th>
                    <th className="py-2.5 px-2">FPG</th>
                    <th className="py-2.5 px-2">HbA1c</th>
                    <th className="py-2.5 px-2">Insulin</th>
                    <th className="py-2.5 px-3">Data Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRecords.map((rec) => {
                    const isSelected = selectedRecord.id === rec.id;
                    const hasIssues = rec.flaggedIssues.length > 0;
                    const fpg = getCleanedValue(rec, 'fpg');
                    const bmi = getCleanedValue(rec, 'bmi');
                    const hba1c = getCleanedValue(rec, 'hba1c');

                    return (
                      <tr
                        key={rec.id}
                        onClick={() => setSelectedRecord(rec)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-50/80 text-cyan-950 font-semibold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {rec.patientStudyId}
                          {rec.isDuplicate && !previewCleaned && (
                            <span className="ml-1 text-[9px] text-red-600 uppercase font-bold">[DUP]</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2">
                          {rec.age} / {getCleanedValue(rec, 'sex')}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={rec.bmi && rec.bmi > 80 && !previewCleaned ? 'text-red-600 font-bold underline' : ''}>
                            {bmi}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={rec.fpg && rec.fpg < 20 && !previewCleaned ? 'text-amber-700 font-bold underline' : ''}>
                            {fpg}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={rec.hba1c === null && !previewCleaned ? 'text-red-600 italic font-bold' : ''}>
                            {hba1c !== null ? `${hba1c}%` : 'MISSING'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-slate-500">
                          {rec.fastingInsulin ? `${rec.fastingInsulin} μIU` : 'null'}
                        </td>
                        <td className="py-2.5 px-3">
                          {hasIssues ? (
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                              previewCleaned
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {previewCleaned ? 'Harmonized' : rec.flaggedIssues[0].issueType.replace('_', ' ')}
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                              Verified
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right 32%: Selected Record & Quality Inspector */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Specimen Quality Inspector
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedRecord.patientStudyId}
              </h3>
              <p className="text-xs text-slate-500">
                Assigned Outcome: <strong className="text-slate-800">{selectedRecord.outcomeLabel}</strong>
              </p>
            </div>

            {activeIssue ? (
              <div className="space-y-3 text-xs">
                
                {/* Field: Issue */}
                <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200">
                  <div className="text-[10px] font-mono text-amber-800 font-bold uppercase mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Issue: {activeIssue.field.toUpperCase()} ({activeIssue.issueType.replace('_', ' ')})
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {activeIssue.description}
                  </p>
                </div>

                {/* Field: Why it matters */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] font-mono text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-cyan-600" /> Why it matters
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {activeIssue.impactExplanation}
                  </p>
                </div>

                {/* Field: Possible research response */}
                <div className="bg-cyan-50/70 p-3 rounded-lg border border-cyan-200">
                  <div className="text-[10px] font-mono text-cyan-800 font-bold uppercase mb-1 flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5 text-cyan-700" /> Possible research response
                  </div>
                  <p className="text-slate-800 leading-relaxed text-[11px]">
                    {activeIssue.proposedCleanAction}
                  </p>
                </div>

                {/* Action: Interactive Preview */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setPreviewCleaned(!previewCleaned)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors text-center"
                  >
                    {previewCleaned ? 'Revert to Raw Value' : 'Preview Illustrative Treatment'}
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-900">Clean Quality Specimen</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Measurements fall within standard physiological ranges with complete documentation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Supporting Visualisation: Compact Missingness Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Analyte Missingness Matrix (Rows = Specimens · Cols = Measurements)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Dark blue cell indicates measurement present; hatched orange cell indicates missing value requiring imputation strategy.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-cyan-800 rounded-sm" /> Present</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded-sm" /> Missing</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header row */}
              <div className="grid grid-cols-10 gap-1 text-[10px] font-mono text-slate-500 text-center mb-1">
                <div className="text-left font-semibold">Specimen</div>
                {matrixColumns.map((col) => (
                  <div key={col} className="bg-slate-100 py-1 rounded">{col}</div>
                ))}
              </div>

              {/* Data rows */}
              {SYNTHETIC_PATIENT_RECORDS.map((rec) => {
                const isSelected = selectedRecord.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`grid grid-cols-10 gap-1 text-[10px] font-mono py-0.5 cursor-pointer rounded ${
                      isSelected ? 'bg-cyan-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-left truncate font-medium text-slate-700 pr-1">{rec.patientStudyId.replace('SYNTH-BLJ-', '#')}</div>
                    <div className="h-4 rounded bg-cyan-800" title="FPG Present" />
                    <div className="h-4 rounded bg-cyan-800" title="PPG Present" />
                    <div className={`h-4 rounded ${rec.hba1c === null ? 'bg-amber-400' : 'bg-cyan-800'}`} title={rec.hba1c === null ? 'HbA1c Missing' : 'HbA1c Present'} />
                    <div className={`h-4 rounded ${rec.fastingInsulin === null ? 'bg-amber-400' : 'bg-cyan-800'}`} title={rec.fastingInsulin === null ? 'Insulin Missing' : 'Insulin Present'} />
                    <div className="h-4 rounded bg-cyan-800" title="TG Present" />
                    <div className="h-4 rounded bg-cyan-800" title="HDL Present" />
                    <div className="h-4 rounded bg-cyan-800" title="Cr Present" />
                    <div className="h-4 rounded bg-cyan-800" title="eGFR Present" />
                    <div className="h-4 rounded bg-cyan-800" title="UACR Present" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Preprocessing Sequence */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
            Preprocessing Workflow Pipeline (Click a stage to inspect protocol)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {workflowSteps.map((ws) => {
              const isSelected = selectedWorkflowStep === ws.step;
              return (
                <div
                  key={ws.step}
                  onClick={() => setSelectedWorkflowStep(ws.step)}
                  className={`p-3.5 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className={isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                      0{ws.step}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <h4 className="text-xs font-bold mb-1">{ws.title}</h4>
                  <p className={`text-[11px] leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {ws.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <strong className="text-slate-900 font-mono">Stage 0{selectedWorkflowStep} Protocol Rule:</strong>{' '}
            <span className="text-slate-600">{workflowSteps[selectedWorkflowStep - 1].protocol}</span>
          </div>
        </div>

        {/* Table 1 Data Domains (Research Explorer Mode) */}
        {mode === 'research' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Table 1: Data Domains & Quality-Control Requirements
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Clinical Data Protocol</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {DATA_DOMAINS_TABLE.map((dom) => (
                <div key={dom.domain} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                  <div className="font-mono text-slate-900 font-bold mb-1">{dom.domain}</div>
                  <div className="text-slate-600 text-[11px] mb-2">{dom.examples}</div>
                  <div className="text-[11px] text-cyan-800 bg-cyan-50 p-1.5 rounded border border-cyan-100 font-mono">
                    {dom.validationRule}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Step Navigation */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium"
          >
            ← Back to Biomarkers
          </button>

          <button
            type="button"
            onClick={() => navigate('/models')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition-all shadow-sm"
          >
            <span>Next: The Learning Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
