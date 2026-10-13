import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  HelpCircle, 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  BookOpen, 
  FlaskConical 
} from 'lucide-react';
import type { ExplorationMode } from '../../types';

interface NavbarProps {
  mode: ExplorationMode;
  onToggleMode: (mode: ExplorationMode) => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode, onToggleMode, onOpenHelp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/explore', label: 'Explore' },
    { to: '/lab', label: 'Research Lab', isLab: true },
    { to: '/about', label: 'About the Science' },
  ];

  const isLabActive = location.pathname.startsWith('/lab');

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 border-b border-slate-200 text-slate-900 shadow-2xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand identity: multi-color constellation logo */}
        <div className="flex items-center space-x-8">
          <NavLink to="/" className="flex items-center space-x-2.5 text-decoration-none group">
            <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="10" fill="#0284c7" />
              <circle cx="50" cy="24" r="7" fill="#6366f1" />
              <circle cx="50" cy="76" r="7" fill="#10b981" />
              <circle cx="24" cy="50" r="7" fill="#f59e0b" />
              <circle cx="76" cy="50" r="7" fill="#ec4899" />
              <circle cx="32" cy="32" r="5" fill="#8b5cf6" />
              <circle cx="68" cy="32" r="5" fill="#38bdf8" />
              <circle cx="32" cy="68" r="5" fill="#059669" />
              <circle cx="68" cy="68" r="5" fill="#d97706" />
            </svg>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 font-display">
                biomarker lab
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-300">
                app
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const isActive = item.isLab 
                ? isLabActive 
                : location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.isLab && <FlaskConical className="w-3.5 h-3.5 text-cyan-600" />}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center space-x-3">
          
          {/* Presentation Mode Switcher */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg border bg-slate-100 border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => onToggleMode('discovery')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                mode === 'discovery'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Discovery mode: accessible explanations"
            >
              <Compass className="w-3 h-3 text-cyan-600" />
              <span>Discovery</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleMode('research')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                mode === 'research'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Research Explorer mode: full equations & methodology"
            >
              <BookOpen className="w-3 h-3 text-indigo-600" />
              <span>Explorer</span>
            </button>
          </div>

          {/* Help Control Button */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="p-2 rounded-lg transition-colors text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            title="About this platform"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sleek CTA Button */}
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-1.5 rounded-full text-xs transition-all shadow-xs hover:scale-105"
          >
            <span>Start exploring</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-black"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 border-t bg-white border-slate-200">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                (item.isLab ? isLabActive : location.pathname === item.to)
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2 flex justify-between items-center border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                onToggleMode(mode === 'discovery' ? 'research' : 'discovery');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-cyan-700 flex items-center gap-1 py-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mode: {mode === 'discovery' ? 'Discovery' : 'Research Explorer'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenHelp();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-500 py-1"
            >
              Help & Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
