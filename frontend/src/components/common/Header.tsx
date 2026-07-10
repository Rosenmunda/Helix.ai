import React from 'react';
import { useStore } from '../../store/useStore';
import { ShieldAlert, Activity, LayoutDashboard, SearchCode, Database } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, mockMode, setMockMode } = useStore();

  return (
    <header className="h-14 bg-brand-dark border-b border-brand-gray/25 px-6 flex items-center justify-between select-none shrink-0 text-brand-light">
      {/* Brand & Title */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-brand-crimson flex items-center justify-center font-bold text-white text-xs">
            B
          </div>
          <span className="font-extrabold text-sm text-white tracking-tight">
            Bio-AI Core <span className="text-brand-gray/60 font-normal text-xs ml-1.5 border-l border-brand-gray/20 pl-1.5">Research Platform</span>
          </span>
        </div>

        {/* Navigation Tabs (Horizontal) */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'dashboard'
                ? 'bg-brand-crimson text-white border border-brand-crimson/30 shadow'
                : 'text-brand-gray hover:text-white border border-transparent hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Metrics Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('predict')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab !== 'dashboard'
                ? 'bg-brand-crimson text-white border border-brand-crimson/30 shadow'
                : 'text-brand-gray hover:text-white border border-transparent hover:bg-white/5'
            }`}
          >
            <SearchCode className="w-3.5 h-3.5" />
            <span>Inference Workspace</span>
          </button>
        </nav>
      </div>

      {/* Control panel & status */}
      <div className="flex items-center gap-4">
        {/* Sandbox toggle */}
        <div className="flex items-center gap-2 pr-4 border-r border-brand-gray/25">
          <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">Sandbox Mode:</span>
          <button
            onClick={() => setMockMode(!mockMode)}
            className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus:outline-none ${
              mockMode ? 'bg-brand-crimson' : 'bg-brand-gray/40'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow transition duration-200 ${
                mockMode ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Live/Sandbox status badge */}
        <div className={`px-2.5 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5 ${
          mockMode 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {mockMode ? (
            <>
              <ShieldAlert className="w-3 h-3" />
              <span>SANDBOX ACTIVE</span>
            </>
          ) : (
            <>
              <Activity className="w-3 h-3 animate-pulse" />
              <span>LIVE CONNECTION</span>
            </>
          )}
        </div>

        {/* UniProt External Link */}
        <a 
          href="https://uniprot.org" 
          target="_blank" 
          rel="noreferrer" 
          className="text-[10px] font-bold text-brand-light hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded border border-brand-gray/20 flex items-center gap-1 transition"
        >
          <Database className="w-3 h-3 text-brand-crimson" />
          UniProt
        </a>
      </div>
    </header>
  );
};
export default Header;
