import React, { useState } from 'react';
import { 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Filter, 
  ShieldCheck, 
  Table, 
  FileCode, 
  CopyCheck 
} from 'lucide-react';
import { SYNTHETIC_PATIENT_RECORDS, DATA_DOMAINS_TABLE } from '../data/dataQuality';
import type { SyntheticPatientRecord, ExplorationMode } from '../types';

interface BuildEvidenceViewProps {
  mode: ExplorationMode;
}

export const BuildEvidenceView: React.FC<BuildEvidenceViewProps> = ({ mode }) => {
  const [selectedRecord, setSelectedRecord] = useState<SyntheticPatientRecord>(SYNTHETIC_PATIENT_RECORDS[1]); // Default to rec-002 with unit mismatch
  const [issueFilter, setIssueFilter] = useState<string>('all');
  const [viewCleanedVersion, setViewCleanedVersion] = useState<boolean>(false);

  const filterOptions = [
    { id: 'all', label: 'All Records (8 Specimens)' },
    { id: 'flagged', label: 'Flagged Anomalies (5)' },
    { id: 'implausible_unit', label: 'Unit Mismatch (mmol/L)' },
    { id: 'biologically_implausible', label: 'Biologically Implausible (BMI)' },
    { id: 'missing', label: 'Missing Core Analyte' },
    { id: 'duplicate', label: 'Duplicate Entry' },
  ];

  const filteredRecords = SYNTHETIC_PATIENT_RECORDS.filter((r) => {
    if (issueFilter === 'all') return true;
    if (issueFilter === 'flagged') return r.flaggedIssues.length > 0;
    return r.flaggedIssues.some((issue) => issue.issueType === issueFilter);
  });

  // Illustrative cleaned record values for specimen comparison
  const getCleanedRecordValue = (
    record: SyntheticPatientRecord,
    field: 'fpg' | 'bmi' | 'hba1c' | 'fastingInsulin' | 'sex'
  ): string | number | null => {
    if (!viewCleanedVersion) return record[field];

    if (record.id === 'rec-002' && field === 'fpg') return '140.5 mg/dL';
    if (record.id === 'rec-003' && field === 'bmi') return '24.2 kg/m²';
    if (record.id === 'rec-004' && field === 'hba1c') return '[MAR Imputed]';
    if (record.id === 'rec-005' && field === 'sex') return 'M';
    if (record.id === 'rec-007' && field === 'fastingInsulin') return '[Stratified Branch]';

    return record[field];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            Screen 03 • Data Governance & Pre-Processing
          </span>
          <span className="text-xs text-slate-400">Section 10 & 11 of BRAINS Project Submission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Build the Evidence</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          High precision begins before machine learning. Explore how laboratory unit harmonization, anomaly isolation, and strict leakage prevention ensure data readiness.
        </p>
      </div>

      {/* 4-Step Clinical Data Preprocessing Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        {[
          { step: '01', title: 'Raw Ingestion', desc: 'Heterogeneous hospital EHR feeds, variable laboratory machines & units' },
          { step: '02', title: 'Quality Audit', desc: 'Plausibility screening, duplicate pruning, missingness pattern detection' },
          { step: '03', title: 'Pre-Processing', desc: 'Harmonization, scaling, encoding within cross-validation training folds' },
          { step: '04', title: 'Model-Ready Matrix', desc: 'Feature matrix protected from target leakage and measurement bias' },
        ].map((item, idx) => (
          <div key={item.step} className="sci-card p-3 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                <span>Phase {item.step}</span>
                {idx < 3 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden md:block" />}
              </div>
              <div className="text-xs font-semibold text-white mb-0.5">{item.title}</div>
              <div className="text-[11px] text-slate-400 leading-tight">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Bar: Issue filter and Raw vs Cleaned Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        {/* Issue Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setIssueFilter(f.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap text-xs font-medium transition-all ${
                issueFilter === f.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle: Raw vs Cleaned */}
        <div className="flex items-center bg-[#0b1326] p-1 rounded-lg border border-slate-700/60">
          <button
            type="button"
            onClick={() => setViewCleanedVersion(false)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              !viewCleanedVersion
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Ingested Records
          </button>
          <button
            type="button"
            onClick={() => setViewCleanedVersion(true)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              viewCleanedVersion
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Proposed Cleaned State
          </button>
        </div>
      </div>

      {/* Main Specimen Table and Focused Quality Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Specimen Table */}
        <div className="lg:col-span-8 sci-panel p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Synthetic Cohort Records</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Click a record to audit quality metadata</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2 px-2.5">Study ID</th>
                  <th className="py-2 px-2.5">Age/Sex</th>
                  <th className="py-2 px-2.5">BMI</th>
                  <th className="py-2 px-2.5">FPG</th>
                  <th className="py-2 px-2.5">HbA1c</th>
                  <th className="py-2 px-2.5">Insulin</th>
                  <th className="py-2 px-2.5">eGFR</th>
                  <th className="py-2 px-2.5">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRecords.map((rec) => {
                  const isSelected = selectedRecord.id === rec.id;
                  const hasIssues = rec.flaggedIssues.length > 0;
                  const fpgDisplay = getCleanedRecordValue(rec, 'fpg');
                  const bmiDisplay = getCleanedRecordValue(rec, 'bmi');
                  const hba1cDisplay = getCleanedRecordValue(rec, 'hba1c');
                  const insulinDisplay = getCleanedRecordValue(rec, 'fastingInsulin');

                  return (
                    <tr
                      key={rec.id}
                      onClick={() => setSelectedRecord(rec)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/50 text-cyan-200 font-semibold'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-2.5 px-2.5 text-cyan-300 font-medium">
                        {rec.patientStudyId}
                        {rec.isDuplicate && !viewCleanedVersion && (
                          <span className="ml-1 text-[9px] text-red-400 uppercase">[DUP]</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-300">
                        {rec.age} / {getCleanedRecordValue(rec, 'sex') as string}
                      </td>
                      <td className="py-2.5 px-2.5">
                        <span className={rec.bmi && rec.bmi > 80 && !viewCleanedVersion ? 'text-red-400 underline font-bold' : ''}>
                          {bmiDisplay ?? 'null'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5">
                        <span className={rec.fpg && rec.fpg < 20 && !viewCleanedVersion ? 'text-amber-300 underline font-bold' : ''}>
                          {fpgDisplay ?? 'null'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5">
                        <span className={rec.hba1c === null && !viewCleanedVersion ? 'text-red-400 italic' : ''}>
                          {hba1cDisplay !== null ? `${hba1cDisplay}%` : 'MISSING'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-400">
                        {insulinDisplay !== null ? `${insulinDisplay}` : 'null'}
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-400">
                        {rec.egfr ?? 'null'}
                      </td>
                      <td className="py-2.5 px-2.5">
                        {hasIssues ? (
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            viewCleanedVersion ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'badge-flagged'
                          }`}>
                            {viewCleanedVersion ? 'Cleaned' : `${rec.flaggedIssues.length} Flagged`}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded badge-established font-mono">
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

        {/* Quality Audit Inspector */}
        <div className="lg:col-span-4 sci-panel p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <div className="text-[11px] font-mono text-cyan-400">Record Inspection</div>
              <h3 className="text-sm font-bold text-white">{selectedRecord.patientStudyId}</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Age {selectedRecord.age} • {selectedRecord.sex}
            </span>
          </div>

          {selectedRecord.flaggedIssues.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-semibold text-emerald-300">Clean Analytical Specimen</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                No unit discrepancies, biologically impossible ranges, duplicates, or missing core biomarkers detected.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedRecord.flaggedIssues.map((issue, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3.5 rounded-lg border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-400 font-semibold uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Field: {issue.field.toUpperCase()}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                      {issue.issueType.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono text-slate-400">Identified Anomaly</div>
                    <p className="text-xs text-slate-200 mt-0.5">{issue.description}</p>
                  </div>

                  <div className="border-t border-slate-800 pt-2">
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CopyCheck className="w-3 h-3" /> Proposed Pre-Processing Rule
                    </div>
                    <p className="text-xs text-emerald-200/90 mt-0.5">{issue.proposedCleanAction}</p>
                  </div>

                  <div className="border-t border-slate-800 pt-2">
                    <div className="text-[11px] font-mono text-indigo-400 flex items-center gap-1">
                      <FileCode className="w-3 h-3" /> Modeling Impact
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{issue.impactExplanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Current Clinical Outcome Label */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
            <div className="text-[11px] font-mono text-slate-400">Assigned Target Label</div>
            <div className="text-slate-200 font-medium mt-0.5 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                selectedRecord.outcomeLabel.includes('High Risk') ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span>{selectedRecord.outcomeLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table 1 Data Domains Reference from Report */}
      {mode === 'research' && (
        <div className="mt-10 sci-panel p-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Table 1: Data Domains & Quality-Control Requirements</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Project Report Reference</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {DATA_DOMAINS_TABLE.map((dom) => (
              <div key={dom.domain} className="sci-card p-3 text-xs">
                <div className="font-mono text-cyan-400 font-semibold mb-1 flex items-center justify-between">
                  <span>{dom.domain}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="text-slate-300 mb-2 font-medium">Examples: {dom.examples}</div>
                <div className="text-[11px] text-slate-400 mb-1">
                  <strong className="text-slate-300">Requirement:</strong> {dom.requirement}
                </div>
                <div className="text-[11px] text-indigo-300 bg-indigo-950/30 p-1.5 rounded border border-indigo-500/20 font-mono">
                  Rule: {dom.validationRule}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
