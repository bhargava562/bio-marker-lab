import React from 'react';
import { X, Network, FlaskConical, ShieldAlert, BookOpen, CheckCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 relative text-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-lg transition-colors hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">Biomarker Lab Guide</h3>
            <p className="text-[11px] text-slate-500 font-medium">Diabetic Biomarker Exploration Platform</p>
          </div>
        </div>

        <div className="space-y-3.5 my-4 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-600" /> Platform Mission
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              An interactive clinical research exploration application for multivariable diabetic biomarker discovery, preprocessing audits, model architecture comparisons, and explainable feature attribution.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-600" /> Core Modules
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li>• <strong className="text-slate-900">Overview:</strong> Introduction to clinical inquiries and research pathways.</li>
              <li>• <strong className="text-slate-900">Explore:</strong> 3D interactive constellation of 14 clinical markers across 5 categories.</li>
              <li>• <strong className="text-slate-900">Research Lab:</strong> Dedicated workbench containing Data Quality, Model Studio, Validation, and Explainability.</li>
              <li>• <strong className="text-slate-900">About the Science:</strong> Editorial roadmap, ethics, fairness, and clinical oversight.</li>
            </ul>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-[11px] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-semibold">Educational Application:</strong> All specimen records, confusion matrices, and feature weights shown are illustrative demonstrations. No clinical diagnostic AI model is deployed for real-world medical decision-making.
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Got it</span>
          </button>
        </div>
      </div>
    </div>
  );
};
