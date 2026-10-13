import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  HelpCircle, 
  ChevronDown, 
  X, 
  Layers, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';
import * as THREE from 'three';
import type { ExplorationMode } from '../types';

interface InvisibleStoryViewProps {
  mode: ExplorationMode;
}

export const InvisibleStoryView: React.FC<InvisibleStoryViewProps> = ({ mode: _mode }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // 3D Animated Scientific Signal Field for Right 55%
  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 5 loosely organised groups of signal points
    // 0: Glycaemic, 1: Insulin, 2: Lipids, 3: Renal, 4: Context
    const groupCenters = [
      new THREE.Vector3(-1.8, 1.2, 0),
      new THREE.Vector3(1.6, 1.5, 0.4),
      new THREE.Vector3(1.8, -1.2, -0.2),
      new THREE.Vector3(-1.4, -1.4, 0.3),
      new THREE.Vector3(0.1, 0.2, 0.8),
    ];

    const groupColors = [0x38bdf8, 0x818cf8, 0x34d399, 0xf472b6, 0x94a3b8];

    const pointGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    // Luminous points cluster
    for (let g = 0; g < groupCenters.length; g++) {
      const center = groupCenters[g];
      const col = new THREE.Color(groupColors[g]);

      for (let i = 0; i < 24; i++) {
        const x = center.x + (Math.random() - 0.5) * 1.4;
        const y = center.y + (Math.random() - 0.5) * 1.4;
        const z = center.z + (Math.random() - 0.5) * 1.2;
        positions.push(x, y, z);
        colors.push(col.r, col.g, col.b);
      }
    }

    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const pointsMesh = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(pointsMesh);

    // Fine connecting arcs between groups
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });

    const linesGroup = new THREE.Group();
    for (let g = 0; g < groupCenters.length; g++) {
      for (let h = g + 1; h < groupCenters.length; h++) {
        const p1 = groupCenters[g];
        const p2 = groupCenters[h];
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        mid.z += 0.8; // subtle curve

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const pts = curve.getPoints(20);
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geom, lineMaterial);
        linesGroup.add(line);
      }
    }
    scene.add(linesGroup);

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.2;
    };

    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slow ambient movement
      scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, mouseX * 0.4 + Math.sin(t * 0.25) * 0.15, 0.05);
      scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, -mouseY * 0.3 + Math.cos(t * 0.2) * 0.1, 0.05);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-6rem)] flex flex-col justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Main Hero Viewport Split: Left 45% / Right 55% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-8">
        
        {/* Left 45% Content Column */}
        <div className="lg:col-span-5 flex flex-col items-start z-10">
          
          <div className="inline-block text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold mb-3">
            INTRODUCTION TO THE RESEARCH
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12] mb-5">
            The clues are there.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              The challenge is connecting them.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Different biological measurements reveal different aspects of health. Explore how researchers investigate these signals together to study diabetes-related patterns.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-[1.02]"
            >
              <span>Explore biomarkers</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium px-5 py-3 rounded-lg text-sm transition-all"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>How the research works</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Proposed research · No clinical model deployed</span>
          </div>
        </div>

        {/* Right 55% Cinematic Signal Constellation */}
        <div className="lg:col-span-7 h-[380px] sm:h-[460px] lg:h-[540px] relative w-full flex items-center justify-center">
          <div ref={canvasRef} className="w-full h-full" />
          
          <div className="absolute top-4 right-4 text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20 pointer-events-none">
            5 Physiological Signal Categories
          </div>
        </div>
      </div>

      {/* Bottom Edge Exploration Cue */}
      <div className="py-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
        >
          <span>Begin exploration</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </button>

        <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
          Stage 01 of 07 · The Invisible Story
        </span>
      </div>

      {/* How the Research Works Modal / Drawer */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1326] border border-cyan-500/30 rounded-xl max-w-xl w-full p-6 relative text-slate-100 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">How the Research Works</h3>
            <p className="text-xs text-slate-400 mb-6">A 3-step investigation workflow from multi-analyte laboratory feeds to clinical validation.</p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" /> Assemble & Audit Biomarkers
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Identify candidate variables across glucose, insulin, lipid, and renal domains. Harmonize incompatible measurement units and exclude biologically impossible entries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Compare Candidate Models
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Evaluate baseline logistic regression against nonlinear boosted ensembles using nested cross-validation to prevent data leakage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Test Trust & Explainability
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Scrutinize sensitivity and specificity across patient subgroups. Explain model predictions with SHAP attribution while noting that correlation does not prove causation.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowHowItWorks(false);
                  navigate('/explore');
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Continue to Biomarkers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
