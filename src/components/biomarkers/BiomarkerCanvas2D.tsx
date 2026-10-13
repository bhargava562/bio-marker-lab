import React from 'react';
import type { Biomarker } from '../../types';

interface BiomarkerCanvas2DProps {
  biomarkers: Biomarker[];
  selectedBiomarker: Biomarker | null;
  onSelectBiomarker: (biomarker: Biomarker) => void;
  activeCategory: string;
}

export const BiomarkerCanvas2D: React.FC<BiomarkerCanvas2DProps> = ({
  biomarkers,
  selectedBiomarker,
  onSelectBiomarker,
  activeCategory,
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
        return '#38bdf8'; // Cyan
      case 'insulin':
        return '#818cf8'; // Indigo
      case 'lipid':
        return '#34d399'; // Emerald
      case 'renal':
        return '#f472b6'; // Pink/Rose
      case 'inflammatory':
        return '#fbbf24'; // Amber
      case 'anthropometric':
      case 'demographic':
      default:
        return '#94a3b8'; // Slate
    }
  };

  const filteredBiomarkers = activeCategory === 'all'
    ? biomarkers
    : biomarkers.filter((b) => b.category === activeCategory);

  return (
    <div className="relative w-full h-[520px] bg-[#070c18] rounded-xl border border-cyan-500/20 overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="grid2d" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2d)" />
        <circle cx="50%" cy="50%" r="180" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="50%" cy="50%" r="260" fill="none" stroke="#818cf8" strokeWidth="0.5" strokeDasharray="2 6" />
      </svg>

      {/* Interactive 2D Network */}
      <svg className="w-full h-full max-w-[800px] max-h-[520px] relative z-10" viewBox="0 0 800 520">
        {/* Connection lines between related nodes */}
        <g stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" strokeDasharray="3 3">
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
                    stroke={isConnectedToSelected ? 'rgba(56, 189, 248, 0.6)' : 'rgba(56, 189, 248, 0.15)'}
                    strokeWidth={isConnectedToSelected ? 2 : 1}
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
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="animate-spin origin-center"
                  style={{ animationDuration: '8s' }}
                />
              )}

              {/* Node aura */}
              <circle
                r={isSelected ? 16 : 12}
                fill={color}
                fillOpacity={isSelected ? 0.4 : 0.2}
                className="group-hover:fill-opacity-50 transition-all"
              />

              {/* Core node */}
              <circle
                r={isSelected ? 9 : 6}
                fill={color}
                stroke="#070c18"
                strokeWidth="2"
              />

              {/* Label */}
              <text
                y={isSelected ? 26 : 22}
                textAnchor="middle"
                fill={isSelected ? '#ffffff' : '#cbd5e1'}
                fontSize={isSelected ? '12px' : '10px'}
                fontWeight={isSelected ? '600' : '400'}
                className="select-none font-mono"
              >
                {b.abbreviation}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 2D Fallback Notification Badge */}
      <div className="absolute bottom-3 right-4 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700/60 z-20">
        Scientific 2D Vector Projection Mode Active
      </div>
    </div>
  );
};
