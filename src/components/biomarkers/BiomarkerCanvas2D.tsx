import React from 'react';
import { Box } from 'lucide-react';
import type { Biomarker } from '../../types';

interface BiomarkerCanvas2DProps {
  biomarkers: Biomarker[];
  selectedBiomarker: Biomarker | null;
  onSelectBiomarker: (biomarker: Biomarker) => void;
  activeCategory: string;
  onSwitchTo3D?: () => void;
}

export const BiomarkerCanvas2D: React.FC<BiomarkerCanvas2DProps> = ({
  biomarkers,
  selectedBiomarker,
  onSelectBiomarker,
  activeCategory,
  onSwitchTo3D,
}) => {
  // Map 3D positions to 2D canvas coordinates (width=800, height=520, center=(400, 260))
  const project2D = (pos: [number, number, number]): { x: number; y: number } => {
    const scale = 85;
    const x = 400 + pos[0] * scale + pos[2] * 20;
    const y = 260 - pos[1] * scale + pos[2] * 15;
    return { x, y };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'glycaemic':
        return '#0284c7'; // Sky / Cyan
      case 'insulin':
        return '#6366f1'; // Indigo
      case 'lipid':
        return '#d97706'; // Amber
      case 'renal':
        return '#db2777'; // Rose
      case 'anthropometric':
        return '#059669'; // Emerald
      default:
        return '#64748b'; // Slate
    }
  };

  const filteredBiomarkers = activeCategory === 'all'
    ? biomarkers
    : biomarkers.filter((b) => b.category === activeCategory);

  return (
    <div className="relative w-full h-[520px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <defs>
          <pattern id="grid2d-light" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2d-light)" />
        <circle cx="50%" cy="50%" r="180" fill="none" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="4 4" />
        <circle cx="50%" cy="50%" r="260" fill="none" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 6" />
      </svg>

      {/* Top Left Projection Badge */}
      <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2 z-20">
        <span className="text-[11px] font-semibold text-slate-700 bg-white/95 px-3 py-1 rounded-full border border-slate-200 shadow-2xs flex items-center gap-1.5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-600" />
          2D Scientific Projection
        </span>
      </div>

      {/* Interactive 2D Network */}
      <svg className="w-full h-full max-w-[800px] max-h-[520px] relative z-10" viewBox="0 0 800 520">
        {/* Connection lines between related nodes */}
        <g stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.2" strokeDasharray="3 3">
          {filteredBiomarkers.map((b1, i) => {
            const p1 = project2D(b1.position3D);
            return filteredBiomarkers.slice(i + 1).map((b2) => {
              if (b1.category === b2.category || b1.id === 'fpg' || b2.id === 'hba1c') {
                const p2 = project2D(b2.position3D);
                const isConnectedToSelected =
                  selectedBiomarker && (selectedBiomarker.id === b1.id || selectedBiomarker.id === b2.id);
                return (
                  <line
                    key={`${b1.id}-${b2.id}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isConnectedToSelected ? 'rgba(2, 132, 199, 0.8)' : 'rgba(148, 163, 184, 0.3)'}
                    strokeWidth={isConnectedToSelected ? 2.5 : 1}
                  />
                );
              }
              return null;
            });
          })}
        </g>

        {/* Nodes */}
        {filteredBiomarkers.map((b) => {
          const pt = project2D(b.position3D);
          const isSelected = selectedBiomarker?.id === b.id;
          const color = getCategoryColor(b.category);

          return (
            <g
              key={b.id}
              onClick={() => onSelectBiomarker(b)}
              className="cursor-pointer transition-transform duration-150 group"
              transform={`translate(${pt.x}, ${pt.y})`}
            >
              {/* Outer selection halo */}
              {isSelected && (
                <circle
                  r="24"
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  className="animate-spin origin-center"
                  style={{ animationDuration: '8s' }}
                />
              )}

              {/* Node aura */}
              <circle
                r={isSelected ? 18 : 13}
                fill={color}
                fillOpacity={isSelected ? 0.35 : 0.15}
                className="group-hover:fill-opacity-40 transition-all"
              />

              {/* Core node */}
              <circle
                r={isSelected ? 10 : 7}
                fill={color}
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Label */}
              <text
                y={isSelected ? 26 : 22}
                textAnchor="middle"
                fill={isSelected ? '#0f172a' : '#475569'}
                fontSize={isSelected ? '12px' : '10px'}
                fontWeight={isSelected ? '700' : '600'}
                className="select-none font-sans"
              >
                {b.abbreviation}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Bottom Controls Bar: Hint + Switch to 3D Button */}
      <div className="absolute bottom-3 right-4 flex items-center gap-2 z-20">
        <div className="text-[11px] font-medium text-slate-500 bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          Click node to inspect • Orthographic projection
        </div>
        {onSwitchTo3D && (
          <button
            type="button"
            onClick={onSwitchTo3D}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-all hover:shadow-sm active:scale-95 cursor-pointer"
            title="Switch back to 3D Universe"
          >
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch to 3D Universe</span>
          </button>
        )}
      </div>
    </div>
  );
};
