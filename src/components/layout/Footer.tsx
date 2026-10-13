import React from 'react';
import { Network, ShieldAlert, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-7 px-4 sm:px-6 lg:px-8 text-xs border-t bg-white border-slate-200 text-slate-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2 font-bold text-sm text-slate-900 mb-1">
            <Network className="w-4 h-4 text-cyan-600" />
            <span className="font-display">Biomarker Lab</span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-300">
              Application
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>High Precision Diabetic Biomarker Detection & Evaluation Platform</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Multivariable Analyte Analysis · Preprocessing Audits · Candidate Model Evaluation · Explainability
          </div>
        </div>

        <div className="max-w-md text-[11px] p-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-600 flex items-start gap-2.5 shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800">Application Notice:</strong> This platform is an interactive research exploration and educational application. It does not provide medical diagnoses or replace professional clinical oversight.
          </span>
        </div>
      </div>
    </footer>
  );
};
