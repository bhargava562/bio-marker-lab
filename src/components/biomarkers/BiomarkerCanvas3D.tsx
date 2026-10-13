import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, Play, Pause, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import type { Biomarker } from '../../types';
import { BiomarkerCanvas2D } from './BiomarkerCanvas2D';

interface BiomarkerCanvas3DProps {
  biomarkers: Biomarker[];
  selectedBiomarker: Biomarker | null;
  onSelectBiomarker: (biomarker: Biomarker) => void;
  activeCategory: string;
  onSwitchTo2D?: () => void;
}

export const BiomarkerCanvas3D: React.FC<BiomarkerCanvas3DProps> = ({
  biomarkers,
  selectedBiomarker,
  onSelectBiomarker,
  activeCategory,
  onSwitchTo2D,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<Biomarker | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    // Check if WebGL is supported
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlAvailable(false);
        return;
      }
    } catch {
      setWebGlAvailable(false);
      return;
    }

    if (!mountRef.current) return;
    const container = mountRef.current;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // Scene setup with deep cinematic atmospheric gradient
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d1e);
    scene.fog = new THREE.FogExp2(0x070d1e, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 8.4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer with physical lighting and high precision
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: false, 
        powerPreference: 'high-performance' 
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
    } catch {
      setWebGlAvailable(false);
      return;
    }

    // OrbitControls for standard 3D navigation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 3.2;
    controls.maxDistance = 15;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.7;
    controlsRef.current = controls;

    // Studio Depth Lighting Architecture
    // 1. Base Ambient
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    // 2. High-key Studio Directional Light (sharp glass specular highlights)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);

    // 3. Cool Cyan Rim Light (back-edge curvature illumination)
    const rimLightCyan = new THREE.DirectionalLight(0x00f2fe, 1.8);
    rimLightCyan.position.set(-7, -4, -6);
    scene.add(rimLightCyan);

    // 4. Soft Rose Fill Light (shadow depth contrast)
    const fillLightRose = new THREE.DirectionalLight(0xf472b6, 1.0);
    fillLightRose.position.set(4, -7, 4);
    scene.add(fillLightRose);

    // 5. Point Light from camera perspective for eye-level specular reflex
    const cameraLight = new THREE.PointLight(0xffffff, 1.2, 25);
    cameraLight.position.set(0, 5, 8);
    scene.add(cameraLight);

    // Atmospheric Parallax Dust Particle Field (creates physical 3D spatial depth)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 320;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 24;
      posArray[i + 1] = (Math.random() - 0.5) * 18;
      posArray[i + 2] = (Math.random() - 0.5) * 18;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // Concentric Orbital Reference Planes
    const ringMat1 = new THREE.MeshBasicMaterial({ 
      color: 0x0284c7, 
      opacity: 0.12, 
      transparent: true, 
      side: THREE.DoubleSide 
    });
    const ring1 = new THREE.Mesh(new THREE.RingGeometry(3.38, 3.42, 64), ringMat1);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({ 
      color: 0x6366f1, 
      opacity: 0.1, 
      transparent: true, 
      side: THREE.DoubleSide 
    });
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(4.78, 4.82, 64), ringMat2);
    ring2.rotation.x = Math.PI / 2.3;
    scene.add(ring2);

    // Category Color Palette
    const getHexColor = (cat: string): number => {
      switch (cat) {
        case 'glycaemic': return 0x00d2ff;     // Saturated Sky Cyan
        case 'insulin': return 0x818cf8;       // Royal Indigo
        case 'lipid': return 0xfbbf24;         // Warm Amber
        case 'renal': return 0xf472b6;         // Neon Rose
        case 'anthropometric': return 0x34d399; // Luminous Emerald
        default: return 0x94a3b8;
      }
    };

    // Hierarchical Node Radii (Tier-based biological importance)
    const getNodeScale = (id: string): { radius: number; isHub: boolean } => {
      // Diagnostic anchor hubs
      if (['hba1c', 'fpg', 'insulin', 'ogtt_2h'].includes(id)) {
        return { radius: 0.36, isHub: true };
      }
      // Metabolic mediators
      if (['homa_ir', 'homa_b', 'c_peptide', 'tg', 'hdl', 'egfr'].includes(id)) {
        return { radius: 0.28, isHub: false };
      }
      // Contextual covariates
      return { radius: 0.22, isHub: false };
    };

    const filtered = activeCategory === 'all'
      ? biomarkers
      : biomarkers.filter((b) => b.category === activeCategory);

    // Multi-Layer Depth Node Assembly
    interface NodeObject {
      group: THREE.Group;
      shellMesh: THREE.Mesh;
      coreMesh: THREE.Mesh;
      ringMesh?: THREE.Mesh;
      gimbalMesh?: THREE.Mesh;
      biomarker: Biomarker;
      baseRadius: number;
      isHub: boolean;
    }

    const nodeObjects: NodeObject[] = [];

    filtered.forEach((b) => {
      const colorHex = getHexColor(b.category);
      const isSelected = selectedBiomarker?.id === b.id;
      const { radius, isHub } = getNodeScale(b.id);

      const group = new THREE.Group();
      group.position.set(b.position3D[0], b.position3D[1], b.position3D[2]);

      // LAYER 1: Inner Glowing Luminous Core (vibrant optical depth source)
      const coreGeo = new THREE.SphereGeometry(radius * 0.68, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.1,
        metalness: 0.1,
        emissive: colorHex,
        emissiveIntensity: isSelected ? 0.95 : 0.55,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

      // LAYER 2: Outer Translucent Glass/Fresnel Shell (refraction, clearcoat specular rim)
      const shellGeo = new THREE.SphereGeometry(radius, 32, 32);
      const shellMat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.12,
        metalness: 0.05,
        transmission: 0.55,
        transparent: true,
        opacity: isSelected ? 0.85 : 0.62,
        ior: 1.45,
        reflectivity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        specularColor: new THREE.Color(0xffffff),
      });
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      shellMesh.userData = { biomarker: b };
      group.add(shellMesh);

      // LAYER 3: Equatorial Depth Ring (for Hubs or Selected Node)
      let ringMesh: THREE.Mesh | undefined;
      let gimbalMesh: THREE.Mesh | undefined;

      if (isHub || isSelected) {
        const ringGeo = new THREE.TorusGeometry(radius * 1.45, 0.016, 16, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0xffffff : colorHex,
          transparent: true,
          opacity: isSelected ? 0.8 : 0.35,
        });
        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 3;
        ringMesh.rotation.y = Math.PI / 6;
        group.add(ringMesh);
      }

      // LAYER 4: Selected Node Dual Gimbal Ring + Local Glow Beacon
      if (isSelected) {
        const gimbalGeo = new THREE.TorusGeometry(radius * 1.7, 0.012, 16, 48);
        const gimbalMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.65,
        });
        gimbalMesh = new THREE.Mesh(gimbalGeo, gimbalMat);
        gimbalMesh.rotation.x = -Math.PI / 4;
        gimbalMesh.rotation.z = Math.PI / 3;
        group.add(gimbalMesh);

        // Soft point light radiating from selected node onto surrounding geometry
        const nodeBeaconLight = new THREE.PointLight(colorHex, 1.8, 4.5);
        group.add(nodeBeaconLight);
      }

      scene.add(group);

      nodeObjects.push({
        group,
        shellMesh,
        coreMesh,
        ringMesh,
        gimbalMesh,
        biomarker: b,
        baseRadius: radius,
        isHub,
      });
    });

    // Connecting Network Lines with Depth Shading
    const lineGroup = new THREE.Group();
    scene.add(lineGroup);

    for (let i = 0; i < filtered.length; i++) {
      for (let j = i + 1; j < filtered.length; j++) {
        const b1 = filtered[i];
        const b2 = filtered[j];
        if (b1.category === b2.category || b1.id === 'fpg' || b2.id === 'hba1c') {
          const isConnectedToSelected =
            selectedBiomarker && (selectedBiomarker.id === b1.id || selectedBiomarker.id === b2.id);

          const points = [
            new THREE.Vector3(...b1.position3D),
            new THREE.Vector3(...b2.position3D),
          ];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

          const lineMat = new THREE.LineBasicMaterial({
            color: isConnectedToSelected ? 0x00f2fe : 0x38bdf8,
            transparent: true,
            opacity: isConnectedToSelected ? 0.75 : 0.18,
          });

          const line = new THREE.Line(lineGeo, lineMat);
          lineGroup.add(line);
        }
      }
    }

    // Raycasting for interactive hover and click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let downPos = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeObjects.map((n) => n.shellMesh));

      if (intersects.length > 0) {
        const hit = nodeObjects.find((n) => n.shellMesh === intersects[0].object);
        if (hit) {
          setHoveredNode(hit.biomarker);
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        setHoveredNode(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      // Distinguish clean click from camera orbit drag (< 6px movement)
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (dist < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeObjects.map((n) => n.shellMesh));

        if (intersects.length > 0) {
          const hit = nodeObjects.find((n) => n.shellMesh === intersects[0].object);
          if (hit) {
            onSelectBiomarker(hit.biomarker);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Animation Loop with Fluid Depth Dynamics
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      // Slow orbital drift of background parallax particles
      particleField.rotation.y = elapsedTime * 0.02;

      // Animate Nodes & Rings
      nodeObjects.forEach(({ group, ringMesh, gimbalMesh, biomarker }) => {
        // Spin equatorial & gimbal rings
        if (ringMesh) {
          ringMesh.rotation.z += 0.012;
        }
        if (gimbalMesh) {
          gimbalMesh.rotation.y -= 0.016;
          gimbalMesh.rotation.x += 0.008;
        }

        // Depth Breathing and Hover Expansion
        if (selectedBiomarker?.id === biomarker.id) {
          const s = 1.25 + Math.sin(elapsedTime * 3.5) * 0.08;
          group.scale.set(s, s, s);
        } else if (hoveredNode?.id === biomarker.id) {
          group.scale.set(1.18, 1.18, 1.18);
        } else {
          group.scale.set(1, 1, 1);
        }
      });

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
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [biomarkers, activeCategory, selectedBiomarker, autoRotate]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 1.8, 8.4);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (delta: number) => {
    if (cameraRef.current && controlsRef.current) {
      const dir = new THREE.Vector3();
      cameraRef.current.getWorldDirection(dir);
      cameraRef.current.position.addScaledVector(dir, delta);
      controlsRef.current.update();
    }
  };

  if (!webGlAvailable) {
    return (
      <BiomarkerCanvas2D
        biomarkers={biomarkers}
        selectedBiomarker={selectedBiomarker}
        onSelectBiomarker={onSelectBiomarker}
        activeCategory={activeCategory}
        onSwitchTo3D={() => setWebGlAvailable(true)}
      />
    );
  }

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-[#070d1e] group">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* 3D Scene Status & Hovered Node Tooltip */}
      <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-cyan-300 bg-slate-900/90 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-xs backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          WebGL 3D Multilayer Space
        </span>
        {hoveredNode && (
          <span className="text-[11px] font-semibold text-white bg-slate-800/95 px-3 py-1 rounded-full border border-slate-600 shadow-md backdrop-blur-sm animate-in fade-in duration-100">
            {hoveredNode.name} ({hoveredNode.abbreviation})
          </span>
        )}
      </div>

      {/* Instruction pill */}
      <div className="absolute bottom-3 left-4 text-[11px] text-slate-300 bg-slate-900/85 px-3 py-1.5 rounded-xl border border-slate-700/80 pointer-events-none backdrop-blur-xs font-medium">
        Drag to rotate • Scroll to zoom • Click node to inspect details
      </div>

      {/* On-screen Camera & Interaction Controls */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/80 shadow-md backdrop-blur-xs z-20">
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
            autoRotate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
          }`}
          title={autoRotate ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => handleZoom(1.0)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => handleZoom(-1.0)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleResetCamera}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

        {onSwitchTo2D && (
          <button
            type="button"
            onClick={onSwitchTo2D}
            className="px-2.5 py-1 text-[11px] font-semibold text-cyan-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 rounded-lg border border-cyan-500/30 cursor-pointer shadow-2xs"
            title="Switch to 2D Projection"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>2D View</span>
          </button>
        )}
      </div>
    </div>
  );
};
