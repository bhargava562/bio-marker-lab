import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Responsive Layout & Viewport Configuration Audits', () => {
  it('verifies index.html has proper mobile viewport and responsive meta tags', () => {
    const indexPath = path.resolve(__dirname, '../../index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    expect(content).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    expect(content).toContain('lang="en"');
  });

  it('verifies global CSS contains overflow-x protections for 320px+ viewports', () => {
    const cssPath = path.resolve(__dirname, '../index.css');
    const content = fs.readFileSync(cssPath, 'utf-8');
    
    expect(content).toContain('overflow-x: hidden');
    expect(content).toContain('max-width: 100vw');
    expect(content).toContain('.scrollbar-none');
  });

  it('verifies Biomarker Explorer 3D canvas includes ResizeObserver and mobile heights', () => {
    const canvas3dPath = path.resolve(__dirname, '../components/biomarkers/BiomarkerCanvas3D.tsx');
    const content = fs.readFileSync(canvas3dPath, 'utf-8');
    
    expect(content).toContain('ResizeObserver');
    expect(content).toContain('h-[340px] sm:h-[420px]');
    expect(content).toContain('hidden md:block'); // Hides instruction pill on mobile to prevent overlapping controls
  });

  it('verifies Biomarker Explorer 2D canvas includes responsive heights and mobile controls', () => {
    const canvas2dPath = path.resolve(__dirname, '../components/biomarkers/BiomarkerCanvas2D.tsx');
    const content = fs.readFileSync(canvas2dPath, 'utf-8');
    
    expect(content).toContain('h-[340px] sm:h-[420px]');
    expect(content).toContain('Switch to 3D Space');
  });

  it('verifies Research Lab View supports 1-column mobile stack for workstations', () => {
    const labPath = path.resolve(__dirname, '../views/ResearchLabView.tsx');
    const content = fs.readFileSync(labPath, 'utf-8');
    
    expect(content).toContain('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4');
  });

  it('verifies Explainability tool toggles stack vertically on mobile to prevent overflow', () => {
    const explainPath = path.resolve(__dirname, '../components/lab/ExplainabilityTool.tsx');
    const content = fs.readFileSync(explainPath, 'utf-8');
    
    expect(content).toContain('flex flex-col sm:flex-row w-full sm:w-auto');
  });
});
