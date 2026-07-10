import React from 'react';
import { useStore } from '../../store/useStore';
import { ShieldAlert, Activity, LayoutDashboard, SearchCode, Database, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, mockMode, setMockMode, darkMode, toggleDarkMode } = useStore();

  return (
    <header className="h-14 bg-brand-dark border-b border-brand-gray/25 px-4 sm:px-6 flex items-center justify-between select-none shrink-0 text-brand-light">
      {/* Brand & Title */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-brand-crimson flex items-center justify-center font-bold text-white text-xs shrink-0">
            B
          </div>
          <span className="font-extrabold text-sm text-white tracking-tight shrink-0">
            Bio-AI <span className="text-brand-gray/60 font-normal text-xs ml-1.5 border-l border-brand-gray/20 pl-1.5 hidden md:inline">Research Platform</span>
          </span>
        </div>

        {/* Navigation Tabs (Horizontal) */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'dashboard'
                ? 'bg-brand-crimson text-white border border-brand-crimson/30 shadow'
                : 'text-brand-gray hover:text-white border border-transparent hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Metrics</span>
            <span className="hidden sm:inline">Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('predict')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab !== 'dashboard'
                ? 'bg-brand-crimson text-white border border-brand-crimson/30 shadow'
                : 'text-brand-gray hover:text-white border border-transparent hover:bg-white/5'
            }`}
          >
            <SearchCode className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Workspace</span>
          </button>
        </nav>
      </div>

      {/* Control panel & status */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Sandbox toggle */}
        <div className="flex items-center gap-2 pr-2 sm:pr-4 border-r border-brand-gray/25">
          <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wider hidden md:inline">Sandbox:</span>
          <button
            onClick={() => setMockMode(!mockMode)}
            className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus:outline-none ${
              mockMode ? 'bg-brand-crimson' : 'bg-brand-gray/40'
            }`}
            title="Toggle Mock/Live mode"
          >
            <span
              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow transition duration-200 ${
                mockMode ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Live/Sandbox status badge */}
        <div className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 ${
          mockMode 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {mockMode ? (
            <>
              <ShieldAlert className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline">SANDBOX</span>
            </>
          ) : (
            <>
              <Activity className="w-3 h-3 animate-pulse shrink-0" />
              <span className="hidden sm:inline">LIVE</span>
            </>
          )}
        </div>

        {/* UniProt External Link */}
        <a 
          href="https://uniprot.org" 
          target="_blank" 
          rel="noreferrer" 
          className="text-[10px] font-bold text-brand-light hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded border border-brand-gray/20 flex items-center gap-1 transition"
          title="Go to UniProt"
        >
          <Database className="w-3 h-3 text-brand-crimson shrink-0" />
          <span className="hidden xs:inline">UniProt</span>
        </a>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="text-brand-light hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded border border-brand-gray/20 flex items-center justify-center transition cursor-pointer"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Moon className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
        </button>
      </div>
    </header>
  );
};
export default Header;
