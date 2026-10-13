import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldAlert, BookOpen, Compass } from 'lucide-react';
import type { ExplorationMode } from '../../types';

interface DisclosureBannerProps {
  mode: ExplorationMode;
}

export const DisclosureBanner: React.FC<DisclosureBannerProps> = ({ mode }) => {
  const location = useLocation();
  const isDarkLayer = location.pathname === '/' || location.pathname === '/explore';

  return (
    <div className={`w-full px-4 py-1.5 text-xs border-b transition-colors ${
      isDarkLayer 
        ? 'bg-[#091122]/90 border-cyan-500/10 text-slate-300' 
        : 'bg-amber-50/70 border-amber-200/60 text-slate-700'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-[11px]">
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex items-center gap-1.5 font-semibold tracking-wide px-2 py-0.5 rounded text-[10px] uppercase shadow-sm ${
            isDarkLayer 
              ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30' 
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            Illustrative Research Prototype
          </span>
          <span className={isDarkLayer ? 'text-slate-300 font-normal' : 'text-slate-600 font-normal'}>
            Illustrative data · No clinical model deployed · Proposed research framework
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-medium tracking-wide">
          {mode === 'research' ? (
            <span className={`flex items-center gap-1 ${isDarkLayer ? 'text-indigo-300' : 'text-indigo-700'}`}>
              <BookOpen className="w-3 h-3" /> Research Explorer Mode
            </span>
          ) : (
            <span className={`flex items-center gap-1 ${isDarkLayer ? 'text-cyan-300' : 'text-cyan-700'}`}>
              <Compass className="w-3 h-3" /> Discovery Mode
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
