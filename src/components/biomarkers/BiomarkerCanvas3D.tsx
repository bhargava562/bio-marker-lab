import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Biomarker } from '../../types';
import { BiomarkerCanvas2D } from './BiomarkerCanvas2D';

interface BiomarkerCanvas3DProps {
  biomarkers: Biomarker[];
  selectedBiomarker: Biomarker | null;
  onSelectBiomarker: (biomarker: Biomarker) => void;
  activeCategory: string;
}

export const BiomarkerCanvas3D: React.FC<BiomarkerCanvas3DProps> = ({
  biomarkers,
  selectedBiomarker,
  onSelectBiomarker,
  activeCategory,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 520;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070c18);
    scene.fog = new THREE.FogExp2(0x070c18, 0.08);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 7.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);
    } catch {
      setWebGlAvailable(false);
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 2, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x818cf8, 1.5, 20);
    pointLight2.position.set(-5, -5, -3);
    scene.add(pointLight2);

    // Subtle orbital guide rings
    const ringGeo1 = new THREE.RingGeometry(3.18, 3.2, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, opacity: 0.12, transparent: true, side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(4.48, 4.5, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x818cf8, opacity: 0.08, transparent: true, side: THREE.DoubleSide });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.3;
    scene.add(ring2);

    // Node Meshes
    const nodeMeshes: { mesh: THREE.Mesh; biomarker: Biomarker }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.24, 24, 24);

    const getHexColor = (cat: string): number => {
      switch (cat) {
        case 'glycaemic': return 0x38bdf8;
        case 'insulin': return 0x818cf8;
        case 'lipid': return 0x34d399;
        case 'renal': return 0xf472b6;
        case 'inflammatory': return 0xfbbf24;
        default: return 0x94a3b8;
      }
    };

    const filtered = activeCategory === 'all'
      ? biomarkers
      : biomarkers.filter((b) => b.category === activeCategory);

    filtered.forEach((b) => {
      const color = getHexColor(b.category);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.25,
        metalness: 0.3,
        emissive: color,
        emissiveIntensity: selectedBiomarker?.id === b.id ? 0.6 : 0.2,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(b.position3D[0], b.position3D[1], b.position3D[2]);
      scene.add(mesh);

      nodeMeshes.push({ mesh, biomarker: b });
    });

    // Connecting Network Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
    });

    for (let i = 0; i < filtered.length; i++) {
      for (let j = i + 1; j < filtered.length; j++) {
        const b1 = filtered[i];
        const b2 = filtered[j];
        if (b1.category === b2.category || b1.id === 'fpg' || b2.id === 'hba1c') {
          const points = [
            new THREE.Vector3(...b1.position3D),
            new THREE.Vector3(...b2.position3D),
          ];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, lineMat);
          scene.add(line);
        }
      }
    }

    // Raycasting for interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

      if (intersects.length > 0) {
        const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
        if (hit) {
          setHoveredNode(hit.biomarker.name);
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        setHoveredNode(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

      if (intersects.length > 0) {
        const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
        if (hit) {
          onSelectBiomarker(hit.biomarker);
        }
      }
    };

    // Simple smooth orbital rotation drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onMouseUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const onMouseMoveDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      rotationVelocityY = deltaX * 0.005;
      rotationVelocityX = deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMoveDrag);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle continuous ambient drift
      if (!isDragging) {
        scene.rotation.y += 0.0015;
      } else {
        scene.rotation.y += rotationVelocityY;
        scene.rotation.x += rotationVelocityX;
        rotationVelocityX *= 0.92;
        rotationVelocityY *= 0.92;
      }

      // Gentle breathing animation on selected node
      nodeMeshes.forEach(({ mesh, biomarker }) => {
        if (selectedBiomarker?.id === biomarker.id) {
          const s = 1.35 + Math.sin(elapsedTime * 4) * 0.12;
          mesh.scale.set(s, s, s);
        } else {
          mesh.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMoveDrag);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousemove', onPointerMove);
        renderer.domElement.removeEventListener('click', onClick);
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.dispose();
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [biomarkers, activeCategory, selectedBiomarker]);

  if (!webGlAvailable) {
    return (
      <BiomarkerCanvas2D
        biomarkers={biomarkers}
        selectedBiomarker={selectedBiomarker}
        onSelectBiomarker={onSelectBiomarker}
        activeCategory={activeCategory}
      />
    );
  }

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-cyan-500/20 bg-[#070c18] group">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* 3D Scene Controls & Tooltips */}
      <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2">
        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1.5 shadow">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          WebGL 3D Biomarker Space
        </span>
        {hoveredNode && (
          <span className="text-[11px] font-mono text-white bg-slate-800/90 px-2 py-0.5 rounded border border-slate-600/60 shadow">
            Node: {hoveredNode}
          </span>
        )}
      </div>

      <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700/60 pointer-events-none">
        Drag to rotate scene • Click node to inspect evidence profile
      </div>

      <button
        type="button"
        onClick={() => setWebGlAvailable(false)}
        className="absolute bottom-3 right-4 text-[10px] font-mono text-cyan-400 hover:text-cyan-200 bg-slate-900/80 px-2.5 py-1 rounded border border-cyan-500/30 hover:border-cyan-400 transition-colors"
      >
        Switch to 2D Fallback
      </button>
    </div>
  );
};
