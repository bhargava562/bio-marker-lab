import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { DisclosureBanner } from './components/ui/DisclosureBanner';
import { Footer } from './components/layout/Footer';
import { HelpModal } from './components/ui/HelpModal';
import { OverviewView } from './views/OverviewView';
import { BiomarkerUniverseView } from './views/BiomarkerUniverseView';
import { ResearchLabView } from './views/ResearchLabView';
import { AboutScienceView } from './views/AboutScienceView';
import type { ExplorationMode } from './types';

function AppContent() {
  const [mode, setMode] = useState<ExplorationMode>('discovery');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 bg-grid-light selection:bg-cyan-500/20">
      {/* Product Header & Research Banner */}
      <Navbar 
        mode={mode} 
        onToggleMode={(newMode) => setMode(newMode)} 
        onOpenHelp={() => setIsHelpOpen(true)}
      />
      <DisclosureBanner mode={mode} />

      {/* Product Experiences */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<OverviewView mode={mode} />} />
          <Route path="/explore" element={<BiomarkerUniverseView mode={mode} />} />
          <Route path="/lab" element={<ResearchLabView mode={mode} />} />
          <Route path="/about" element={<AboutScienceView mode={mode} />} />
          
          {/* Backwards compatibility redirects */}
          <Route path="/evidence" element={<Navigate to="/lab?tab=data" replace />} />
          <Route path="/models" element={<Navigate to="/lab?tab=models" replace />} />
          <Route path="/validation" element={<Navigate to="/lab?tab=validation" replace />} />
          <Route path="/explainability" element={<Navigate to="/lab?tab=explainability" replace />} />
          <Route path="/responsibility" element={<Navigate to="/about" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Research Attribution Footer */}
      <Footer />

      {/* Global Product Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
