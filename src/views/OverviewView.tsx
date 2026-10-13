import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  HelpCircle, 
  Network, 
  Database, 
  CheckCircle2, 
  X, 
  Layers, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';
import * as THREE from 'three';
import type { ExplorationMode } from '../types';

interface OverviewViewProps {
  mode: ExplorationMode;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ mode: _mode }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // 3D Celestial Cluster Constellation adapted for clean high-contrast presentation
  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 5 Distinct Chromatic Clusters:
    // Cyan (Glycaemic), Violet (Insulin), Gold (Lipids), Rose (Renal), Emerald (Context)
    const clusterCenters = [
      { pos: new THREE.Vector3(-1.8, 1.4, 0.2), color: 0x0284c7, label: 'Glycaemic' },
      { pos: new THREE.Vector3(1.4, 1.6, 0.5), color: 0x6366f1, label: 'Insulin' },
      { pos: new THREE.Vector3(2.0, -0.9, -0.4), color: 0xd97706, label: 'Lipids' },
      { pos: new THREE.Vector3(-1.2, -1.5, 0.6), color: 0xdb2777, label: 'Renal' },
      { pos: new THREE.Vector3(0.1, 0.1, 0.9), color: 0x059669, label: 'Context' },
    ];

    const allPositions: number[] = [];
    const allColors: number[] = [];
    const starCenters: THREE.Vector3[] = [];

    clusterCenters.forEach((c) => {
      starCenters.push(c.pos);
      const col = new THREE.Color(c.color);

      // Core anchor point
      allPositions.push(c.pos.x, c.pos.y, c.pos.z);
      allColors.push(col.r, col.g, col.b);

      // Radiating satellites
      for (let i = 0; i < 34; i++) {
        const radius = 0.2 + Math.random() * 0.95;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;

        const x = c.pos.x + radius * Math.cos(theta) * Math.cos(phi);
        const y = c.pos.y + radius * Math.sin(theta) * Math.cos(phi);
        const z = c.pos.z + radius * Math.sin(phi);

        allPositions.push(x, y, z);
        allColors.push(col.r, col.g, col.b);
      }
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(allPositions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(allColors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });

    const pointsMesh = new THREE.Points(geom, mat);
    scene.add(pointsMesh);

    // Fine connecting lines between cluster satellites
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.25,
    });

    const linesGroup = new THREE.Group();
    for (let i = 0; i < clusterCenters.length; i++) {
      for (let j = i + 1; j < clusterCenters.length; j++) {
        const p1 = clusterCenters[i].pos;
        const p2 = clusterCenters[j].pos;

        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        mid.z += 0.8;

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const pts = curve.getPoints(16);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(lineGeo, linesMat);
        linesGroup.add(line);
      }
    }
    scene.add(linesGroup);

    // Interactive mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.4;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.4;
    };

    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, mouseX * 0.35 + Math.sin(t * 0.2) * 0.12, 0.05);
      scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, -mouseY * 0.3 + Math.cos(t * 0.18) * 0.08, 0.05);

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Hero Section: Left 45% Text / Right 55% Constellation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 sm:pt-8 pb-10 sm:pb-12 my-auto">
        
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col items-start z-10">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-4 sm:mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Clinical Biomarker Discovery</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] sm:leading-[1.08] mb-4 sm:mb-5 font-display">
            The clues are there.<br />
            <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              The challenge is connecting them.
            </span>
          </h1>

          {/* Exact Supporting Content */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8 font-normal">
            Explore the biological measurements researchers study to understand diabetes-related patterns—and how those signals must be tested before they can support clinical decisions.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 sm:px-7 py-3 sm:py-3.5 min-h-[44px] rounded-full text-xs sm:text-sm transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <span>Start exploring</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              type="button"
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-5 sm:px-6 py-3 sm:py-3.5 min-h-[44px] rounded-full text-xs sm:text-sm transition-all shadow-2xs hover:border-slate-400 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <span>How the research works</span>
            </button>
          </div>

          {/* Research Status Note */}
          <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Proposed research framework · No clinical model deployed</span>
          </div>
        </div>

        {/* Right 55% Luminous Cluster Constellation */}
        <div className="lg:col-span-7 h-[280px] sm:h-[380px] lg:h-[540px] relative w-full flex items-center justify-center bg-white/60 rounded-3xl border border-slate-200/80 shadow-xs backdrop-blur-xs">
          <div ref={canvasRef} className="w-full h-full" />
          
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 text-[10px] sm:text-[11px] font-semibold tracking-wide text-cyan-800 bg-white/90 px-2.5 sm:px-3 py-1 rounded-full border border-cyan-200 pointer-events-none shadow-xs backdrop-blur-sm">
            Interactive Signal Universe · 5 Biomarker Domains
          </div>
        </div>
      </div>

      {/* Three Concise Ways to Continue (Below Hero) */}
      <div className="pt-6 pb-10 border-t border-slate-200">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 font-display">
          Ways to Explore the Research
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Explore biomarkers */}
          <div
            onClick={() => navigate('/explore')}
            className="p-5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-cyan-500/50 cursor-pointer transition-all shadow-2xs hover:shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors flex items-center justify-between">
              <span>Explore biomarkers</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interact with the 3D network of 14 clinical measurements across glucose, insulin, lipids, and renal markers.
            </p>
          </div>

          {/* Card 2: Understand the data */}
          <div
            onClick={() => navigate('/lab?tab=data')}
            className="p-5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-indigo-500/50 cursor-pointer transition-all shadow-2xs hover:shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors flex items-center justify-between">
              <span>Understand the data</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect how missing values, unit inconsistencies (mmol/L vs mg/dL), and duplicates are audited prior to machine learning.
            </p>
          </div>

          {/* Card 3: How models are evaluated */}
          <div
            onClick={() => navigate('/lab?tab=validation')}
            className="p-5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-emerald-500/50 cursor-pointer transition-all shadow-2xs hover:shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
              <span>How models are evaluated</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test confusion matrices, examine sensitivity vs specificity trade-offs, and learn why accuracy alone can be misleading.
            </p>
          </div>

        </div>
      </div>

      {/* How the Research Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-5 sm:p-6 relative text-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-lg transition-colors hover:bg-slate-100 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 font-display">How the Research Works</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">A 3-step investigation workflow from multi-analyte laboratory feeds to clinical validation.</p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-0.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-600" /> Assemble & Audit Biomarkers
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Identify candidate variables across glucose, insulin, lipid, and renal domains. Harmonize incompatible measurement units and exclude biologically impossible entries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-0.5 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Compare Candidate Models
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Evaluate baseline logistic regression against nonlinear boosted ensembles using nested cross-validation to prevent data leakage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Test Trust & Explainability
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Scrutinize sensitivity and specificity across patient subgroups. Explain model predictions with SHAP attribution while noting that correlation does not prove causation.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowHowItWorks(false);
                  navigate('/explore');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-full text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Continue to Explorer</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
