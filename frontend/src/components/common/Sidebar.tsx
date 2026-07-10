import React from 'react';
import { useStore } from '../../store/useStore';
import { LayoutDashboard, ShieldAlert, BookOpen, Dna, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, mockMode, setMockMode } = useStore();

  const navItems = [
    { id: 'dashboard', label: 'Model Metrics', icon: LayoutDashboard },
    { id: 'predict', label: 'Predict Essentiality', icon: Dna },
    { id: 'literature', label: 'Drugs & Literature', icon: BookOpen },
  ] as const;

  return (
    <aside className="w-68 bg-slate-950 border-r border-slate-800 text-slate-200 flex flex-col h-screen select-none">
      {/* Brand logo section */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Dna className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h2 className="font-extrabold text-lg bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
            Bio-AI Core
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
            Essentiality Predictor
          </p>
        </div>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/30 text-blue-400 shadow-md shadow-blue-950/20'
                  : 'hover:bg-slate-900 border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom configuration panel */}
      <div className="p-4 border-t border-slate-900 bg-slate-900/40 m-4 rounded-2xl border border-slate-800/40">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Configuration</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className={`w-4 h-4 ${mockMode ? 'text-amber-500' : 'text-emerald-500'}`} />
            <span className="text-xs font-semibold text-slate-400">Mock Sandbox</span>
          </div>
          <button
            onClick={() => setMockMode(!mockMode)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              mockMode ? 'bg-amber-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                mockMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 leading-normal">
          {mockMode 
            ? 'Running locally in sandbox. No active connection to FastAPI needed.' 
            : 'Connecting to live API endpoints.'}
        </div>
      </div>
    </aside>
  );
};
