import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { DisclosureBanner } from './components/ui/DisclosureBanner';
import { Footer } from './components/layout/Footer';
import { InvisibleStoryView } from './views/InvisibleStoryView';
import { BiomarkerUniverseView } from './views/BiomarkerUniverseView';
import { BuildEvidenceView } from './views/BuildEvidenceView';
import { LearningEngineView } from './views/LearningEngineView';
import { TrustValidationView } from './views/TrustValidationView';
import { InsidePredictionView } from './views/InsidePredictionView';
import { ResponsibilityView } from './views/ResponsibilityView';
import type { ExplorationMode } from './types';

export function App() {
  const [mode, setMode] = useState<ExplorationMode>('discovery');

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#070c18] text-slate-100 bg-grid-pattern selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Navigation & Research Banner */}
        <Navbar mode={mode} onToggleMode={(newMode) => setMode(newMode)} />
        <DisclosureBanner mode={mode} />

        {/* Dynamic Route Content */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<InvisibleStoryView mode={mode} />} />
            <Route path="/explore" element={<BiomarkerUniverseView mode={mode} />} />
            <Route path="/evidence" element={<BuildEvidenceView mode={mode} />} />
            <Route path="/models" element={<LearningEngineView mode={mode} />} />
            <Route path="/validation" element={<TrustValidationView mode={mode} />} />
            <Route path="/explainability" element={<InsidePredictionView mode={mode} />} />
            <Route path="/responsibility" element={<ResponsibilityView mode={mode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Research Attribution Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
