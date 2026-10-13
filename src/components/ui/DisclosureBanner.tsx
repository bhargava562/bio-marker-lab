import React from 'react';
import { AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import type { ExplorationMode } from '../../types';

interface DisclosureBannerProps {
  mode: ExplorationMode;
}

export const DisclosureBanner: React.FC<DisclosureBannerProps> = ({ mode }) => {
  return (
    <div className="w-full bg-[#0b1326]/90 border-b border-amber-500/20 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertCircle className="w-3 h-3" />
          </div>
          <span>
            <strong className="text-amber-300 font-medium">Research Demonstration Prototype:</strong> All patient records, confusion matrices, and model weights displayed are <span className="underline decoration-amber-500/50">illustrative & synthetic</span>. Not an approved medical device.
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-400 self-end sm:self-auto">
          {mode === 'research' ? (
            <span className="flex items-center gap-1 text-indigo-300 font-mono">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Research Explorer Mode: Full Methodological Schema Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-cyan-300 font-mono">
              <ShieldAlert className="w-3 h-3 text-cyan-400" /> Discovery Mode: High-Level Clinical Concepts
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
