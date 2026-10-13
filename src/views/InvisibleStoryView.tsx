import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Network, 
  Database, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import type { ExplorationMode } from '../types';

interface InvisibleStoryViewProps {
  mode: ExplorationMode;
}

export const InvisibleStoryView: React.FC<InvisibleStoryViewProps> = ({ mode }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-6rem)] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background scientific signal constellation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-3xl mx-auto text-center mt-4 sm:mt-8">
        
        {/* Project Header Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Interdisciplinary Research in Diabetes, Biomarker Analysis & AI</span>
        </div>

        {/* Master Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5">
          The clues are there.<br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            The challenge is connecting them.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
          Explore how biological measurements can help researchers investigate diabetes-related patterns. Discover the critical pipeline from raw laboratory data and quality control to transparent machine learning and clinical validation.
        </p>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="btn-sci-primary w-full sm:w-auto px-6 py-3 text-sm shadow-lg shadow-cyan-500/20"
          >
            <span>Explore the Biomarkers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/evidence')}
            className="btn-sci-secondary w-full sm:w-auto px-6 py-3 text-sm"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Audit the Data Quality</span>
          </button>
        </div>

        {/* Institutional Research Attribution */}
        <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 max-w-xl mx-auto">
          Submitted to <span className="text-slate-300 font-semibold">BRAINS</span> (Balaji Regional Associate Institute of Neuro Sciences)<br />
          Project Lead: <span className="text-slate-300">Dr. K. Chidambarathanu</span> • R. M. K. Engineering College
        </div>
      </div>

      {/* Interactive Central Signal Flow Overview */}
      <div className="relative z-10 mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto w-full">
        {[
          { step: '01', title: 'Biomarkers', desc: '14 Core & Candidate Variables', route: '/explore', icon: Network },
          { step: '02', title: 'Data Audit', desc: 'Pre-processing & Unit Checks', route: '/evidence', icon: Database },
          { step: '03', title: 'Models', desc: 'Candidate Algorithm Compare', route: '/models', icon: Cpu },
          { step: '04', title: 'Testing', desc: 'Confusion Matrix & Metrics', route: '/validation', icon: CheckCircle2 },
          { step: '05', title: 'Explainability', desc: 'Global & Local Prediction SHAP', route: '/explainability', icon: Sparkles },
          { step: '06', title: 'Governance', desc: '10-Stage Research Pathway', route: '/responsibility', icon: ShieldCheck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              onClick={() => navigate(item.route)}
              className="sci-card p-3.5 cursor-pointer hover:border-cyan-400/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-2">
                  <span>{item.step}</span>
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {item.desc}
                </div>
              </div>
              <div className="text-[10px] text-cyan-400/70 font-mono mt-3 flex items-center gap-1 group-hover:text-cyan-300">
                <span>Inspect</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Research Mode Details Banner */}
      {mode === 'research' && (
        <div className="relative z-10 mt-8 p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 max-w-4xl mx-auto flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-300 font-mono">Research Explorer Mode Active:</span> This prototype implements the exact research workflow defined in the BRAINS project submission. It provides deterministic quality audits, multi-metric clinical evaluation without zero-division errors, and honest disclosures of research limitations.
          </div>
        </div>
      )}
    </div>
  );
};
