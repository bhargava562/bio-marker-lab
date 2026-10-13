import React from 'react';
import { Network, ShieldAlert, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070c18] border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-white font-semibold text-sm mb-1">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>High Precision Diabetic Biomarker Detection</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400/80" />
            <span>Proposed Interdisciplinary Research Project in Diabetes, Biomarker Analysis & AI</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Submitted to <strong className="text-slate-300">BRAINS</strong> (Balaji Regional Associate Institute of Neuro Sciences) • Lead: <strong className="text-slate-300">Dr. K. Chidambarathanu</strong>, R. M. K. Engineering College
          </div>
        </div>

        <div className="max-w-md text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-amber-300">Notice:</strong> This application is an interactive research and educational demonstration prototype. It does not provide medical diagnoses or replace clinical oversight.
          </span>
        </div>
      </div>
    </footer>
  );
};
