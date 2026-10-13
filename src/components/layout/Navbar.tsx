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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand identity: multi-color constellation logo */}
        <div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
          <NavLink to="/" className="flex items-center space-x-2 text-decoration-none group shrink-0">
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
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 font-display whitespace-nowrap">
                biomarker lab
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-300">
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
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
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
            className="p-2 min-w-[36px] min-h-[36px] rounded-lg transition-colors text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            title="About this platform"
            aria-label="Open platform help guide"
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
            className="md:hidden p-2 min-w-[40px] min-h-[40px] rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 space-y-2 border-t bg-white border-slate-200 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                  (item.isLab ? isLabActive : location.pathname === item.to)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.isLab && <FlaskConical className="w-4 h-4 text-cyan-500" />}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-3 flex flex-col gap-2.5 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                onToggleMode(mode === 'discovery' ? 'research' : 'discovery');
                setMobileMenuOpen(false);
              }}
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg flex items-center justify-between font-semibold"
            >
              <span className="flex items-center gap-1.5 text-cyan-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active Mode:</span>
              </span>
              <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
                {mode === 'discovery' ? 'Discovery' : 'Research Explorer'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/explore');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs"
            >
              <span>Start Exploring Network</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
