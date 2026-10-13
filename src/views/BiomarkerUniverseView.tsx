import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  ArrowRight, 
  Box, 
  Layers 
} from 'lucide-react';
import { BIOMARKERS } from '../data/biomarkers';
import { BiomarkerCanvas3D } from '../components/biomarkers/BiomarkerCanvas3D';
import { BiomarkerCanvas2D } from '../components/biomarkers/BiomarkerCanvas2D';
import { BiomarkerDetailPanel } from '../components/biomarkers/BiomarkerDetailPanel';
import type { Biomarker, ExplorationMode } from '../types';

interface BiomarkerUniverseViewProps {
  mode: ExplorationMode;
}

export const BiomarkerUniverseView: React.FC<BiomarkerUniverseViewProps> = ({ mode }) => {
  const navigate = useNavigate();
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(BIOMARKERS[2]); // Default to HbA1c
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'glycaemic', label: 'Glycaemic' },
    { id: 'insulin', label: 'Insulin' },
    { id: 'lipid', label: 'Lipids' },
    { id: 'renal', label: 'Renal' },
    { id: 'anthropometric', label: 'Patient context' },
  ];

  const filteredBiomarkers = BIOMARKERS.filter((b) => {
    const matchesCat = activeCategory === 'all' || b.category === activeCategory;
    const matchesQuery = searchQuery === '' || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4 mb-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-700 mb-0.5">
            INTERACTIVE NETWORK · 14 CLINICAL MEASUREMENTS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Biomarker Explorer
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Rotate · Select · Inspect relationships across 5 biological categories
          </p>
        </div>

        {/* Search & Fallback Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-44 min-w-[130px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search biomarker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-sans shadow-2xs"
            />
          </div>

          {/* 3D vs 2D Mode Switcher Segmented Control */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="3D Universe View"
            >
              <Box className="w-3.5 h-3.5 text-cyan-600" />
              <span>3D Space</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === '2d'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="2D Vector Projection View"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              <span>2D View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setSelectedBiomarker(BIOMARKERS[2]);
            }}
            className="p-2 min-w-[36px] min-h-[36px] rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
            title="Reset Filters"
            aria-label="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 text-xs scrollbar-none">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1 mr-1 shrink-0">
          <Filter className="w-3 h-3 text-cyan-600" /> FILTERS:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 min-h-[36px] rounded-full whitespace-nowrap text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main 3-Part Composition: Canvas + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Central 3D Canvas / 2D Map */}
        <div className="lg:col-span-8">
          {viewMode === '2d' ? (
            <BiomarkerCanvas2D
              biomarkers={filteredBiomarkers}
              selectedBiomarker={selectedBiomarker}
              onSelectBiomarker={(b) => setSelectedBiomarker(b)}
              activeCategory={activeCategory}
              onSwitchTo3D={() => setViewMode('3d')}
            />
          ) : (
            <BiomarkerCanvas3D
              biomarkers={filteredBiomarkers}
              selectedBiomarker={selectedBiomarker}
              onSelectBiomarker={(b) => setSelectedBiomarker(b)}
              activeCategory={activeCategory}
              onSwitchTo2D={() => setViewMode('2d')}
            />
          )}

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 px-1 gap-1 font-medium">
            <span>Visual Encoding: Multilayer glass-core node spheres with category color assignment</span>
            <span>Orbital planes indicate biological functional clusters</span>
          </div>
        </div>

        {/* Right-Side Information Panel */}
        <div className="lg:col-span-4 h-auto lg:h-[520px] max-h-[640px] lg:max-h-[520px]">
          <BiomarkerDetailPanel
            biomarker={selectedBiomarker}
            mode={mode}
            onClose={() => setSelectedBiomarker(null)}
          />
        </div>
      </div>

      {/* Table 0 Review in Research Explorer Mode */}
      {mode === 'research' && (
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600" />
              <h3 className="text-sm font-bold text-slate-900 font-display">Review of Diabetic Biomarkers & Variables</h3>
            </div>
            <span className="text-[11px] font-semibold tracking-wide text-slate-500">Clinical Reference Data</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50 font-semibold">
                  <th className="py-2.5 px-3">Variable</th>
                  <th className="py-2.5 px-3">Potential Relevance</th>
                  <th className="py-2.5 px-3">Typical Role</th>
                  <th className="py-2.5 px-3">Reference Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {BIOMARKERS.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBiomarker(b)}
                    className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedBiomarker?.id === b.id ? 'bg-cyan-50/80 text-cyan-950 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {b.name} ({b.abbreviation})
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{b.potentialRelevance}</td>
                    <td className="py-2.5 px-3 text-indigo-700 font-medium">{b.typicalRole}</td>
                    <td className="py-2.5 px-3 text-slate-500">{b.typicalUnits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Next-Step Navigation */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          ← Back to Overview
        </button>

        <button
          type="button"
          onClick={() => navigate('/lab?tab=data')}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs hover:scale-105"
        >
          <span>Open Research Lab</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

    </div>
  );
};
