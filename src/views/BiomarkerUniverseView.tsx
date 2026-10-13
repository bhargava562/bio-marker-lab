import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  ShieldAlert, 
  Layers 
} from 'lucide-react';
import { BIOMARKERS } from '../data/biomarkers';
import { BiomarkerCanvas3D } from '../components/biomarkers/BiomarkerCanvas3D';
import { BiomarkerDetailPanel } from '../components/biomarkers/BiomarkerDetailPanel';
import type { Biomarker, ExplorationMode } from '../types';

interface BiomarkerUniverseViewProps {
  mode: ExplorationMode;
}

export const BiomarkerUniverseView: React.FC<BiomarkerUniverseViewProps> = ({ mode }) => {
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(BIOMARKERS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Biomarkers' },
    { id: 'glycaemic', label: 'Glycaemic' },
    { id: 'insulin', label: 'Insulin Physiology' },
    { id: 'lipid', label: 'Lipid Profile' },
    { id: 'renal', label: 'Renal / Nephropathy' },
    { id: 'anthropometric', label: 'Anthropometrics' },
    { id: 'inflammatory', label: 'Inflammatory' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Heading & Scope */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Screen 02 • Conceptual Space
            </span>
            <span className="text-xs text-slate-400">14 Multi-Domain Parameters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">The Biomarker Universe</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Interactive multi-analyte network representing candidate laboratory variables from Table 0 of the project report submitted to BRAINS.
          </p>
        </div>

        {/* Reset & Category filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSelectedBiomarker(null);
            }}
            className="btn-sci-secondary text-xs px-2.5 py-1.5 flex items-center gap-1.5"
            title="Reset scene to full network"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 text-xs scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Visual Composition: 3D Scene + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive 3D Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <BiomarkerCanvas3D
            biomarkers={BIOMARKERS}
            selectedBiomarker={selectedBiomarker}
            onSelectBiomarker={(b) => setSelectedBiomarker(b)}
            activeCategory={activeCategory}
          />

          {/* Scientific Disclaimer & Integrity Safeguard */}
          <div className="sci-card p-3 flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-medium">Scientific Integrity Rule:</strong> Connection lines in this 3D landscape depict conceptual pathophysiological groupings, <span className="text-slate-200 underline decoration-slate-600">not proved statistical correlations</span>. Inclusion of candidate biomarkers (e.g. fasting insulin, hs-CRP) does not imply independent clinical diagnostic authority.
            </div>
          </div>
        </div>

        {/* Right: Biomarker Detail Profile */}
        <div className="lg:col-span-4">
          <BiomarkerDetailPanel
            biomarker={selectedBiomarker}
            mode={mode}
            onClose={() => setSelectedBiomarker(null)}
          />
        </div>
      </div>

      {/* Table 0 Reference Summary from Report */}
      {mode === 'research' && (
        <div className="mt-10 sci-panel p-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Table 0: Review of Diabetic Biomarkers & Variables</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Project Report Reference</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2 px-3">Biomarker / Variable</th>
                  <th className="py-2 px-3">Potential Relevance</th>
                  <th className="py-2 px-3">Typical Role in Study</th>
                  <th className="py-2 px-3">Analytical Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {BIOMARKERS.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBiomarker(b)}
                    className={`cursor-pointer hover:bg-slate-800/40 transition-colors ${
                      selectedBiomarker?.id === b.id ? 'bg-cyan-950/40 text-cyan-200' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">
                      <span className="font-mono text-cyan-400 mr-1.5">{b.abbreviation}</span>
                      {b.name}
                    </td>
                    <td className="py-2 px-3 text-slate-400">{b.potentialRelevance}</td>
                    <td className="py-2 px-3 font-mono text-[11px] text-indigo-300">{b.typicalRole}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        b.analyticalTier === 'established' ? 'badge-established' :
                        b.analyticalTier === 'candidate' ? 'badge-candidate' : 'badge-covariate'
                      }`}>
                        {b.analyticalTier}
                      </span>
                    </td>
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
