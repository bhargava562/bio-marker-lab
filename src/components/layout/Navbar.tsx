import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Network, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Menu, 
  X, 
  BookOpen, 
  GraduationCap
} from 'lucide-react';
import type { ExplorationMode } from '../../types';

interface NavbarProps {
  mode: ExplorationMode;
  onToggleMode: (mode: ExplorationMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode, onToggleMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'The Story', icon: Compass },
    { to: '/explore', label: 'Biomarkers', icon: Network },
    { to: '/evidence', label: 'Evidence Audit', icon: Database },
    { to: '/models', label: 'Learning Engine', icon: Cpu },
    { to: '/validation', label: 'Trust Testing', icon: CheckCircle2 },
    { to: '/explainability', label: 'Prediction Logic', icon: Sparkles },
    { to: '/responsibility', label: 'Responsibility', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070c18]/90 backdrop-blur-md border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Project Branding & Institutional Credit */}
        <div className="flex items-center space-x-3">
          <NavLink to="/" className="flex items-center space-x-2.5 text-decoration-none group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                <span>Diabetic Biomarker Detection</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">Research Lab</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-cyan-400/70" />
                <span className="hidden md:inline">Submitted to BRAINS (Balaji Regional Associate Institute) • RMKEC</span>
                <span className="md:hidden">BRAINS • RMKEC</span>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Discovery vs Research Explorer Mode Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#0b1326] p-0.5 rounded-lg border border-slate-700/60 shadow-inner">
            <button
              type="button"
              onClick={() => onToggleMode('discovery')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                mode === 'discovery'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Discovery mode provides accessible plain-English clinical explanations"
            >
              <Compass className="w-3 h-3" />
              <span className="hidden sm:inline">Discovery</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleMode('research')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                mode === 'research'
                  ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Research Explorer mode displays methodological details, metrics, and data dictionaries"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Research Explorer</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070c18] border-b border-cyan-500/20 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};
