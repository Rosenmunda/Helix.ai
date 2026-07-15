import React from 'react';
import { useStore } from '../store/useStore';
import { ModelSelection } from '../components/dashboard/ModelSelection';
import { ProteinSearch } from '../components/protein-search/ProteinSearch';
import { PredictionPanel } from '../components/prediction/PredictionPanel';
import { DrugPanel } from '../components/drug-panel/DrugPanel';
import { ResearchPanel } from '../components/research/ResearchPanel';
import { ShieldAlert, Info } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { activeTab, selectedProtein } = useStore();

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-brand-light dark:bg-brand-dark relative">
      {/* 2-Column Inference Workspace Split Pane (Always visible) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden divide-y md:divide-y-0 md:divide-x divide-brand-gray/25 dark:divide-brand-gray/10">
        
        {/* Left Column: Target Selection & Configuration (35% width on desktop, 100% on mobile) */}
        <div className="w-full md:w-96 flex flex-col overflow-visible md:overflow-y-auto p-4 sm:p-5 shrink-0 bg-white dark:bg-[#151622] border-r border-brand-gray/20 dark:border-brand-gray/10">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-brand-dark dark:text-white uppercase tracking-wider mb-2">Workspace Setup</h3>
              <p className="text-[11px] text-brand-gray dark:text-brand-gray/80 leading-normal">
                Configure model parameters and select the target protein for the inference run.
              </p>
            </div>

            {/* Protein Search and details card */}
            <ProteinSearch />
          </div>
        </div>

        {/* Right Column: Inference Output & Analytics (65% width on desktop, 100% on mobile) */}
        <div className="flex-1 flex flex-col overflow-visible md:overflow-y-auto p-4 sm:p-6 bg-brand-light dark:bg-brand-dark">
          {selectedProtein ? (
            <div className="space-y-6 max-w-4xl">
              
              {/* Active target banner */}
              <div className="bg-white dark:bg-[#151622] border border-brand-gray/20 dark:border-brand-gray/10 px-4 py-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-brand-dark dark:text-brand-light shadow-sm">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-brand-gray dark:text-brand-gray/60 font-semibold">Active target:</span>
                  <span className="font-extrabold text-brand-crimson dark:text-brand-red">{selectedProtein.name}</span>
                  <span className="text-brand-gray dark:text-brand-gray/60">({selectedProtein.uniprot_id || selectedProtein.protein_id})</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-gray dark:text-brand-gray/60 font-medium">
                  <Info className="w-3.5 h-3.5 text-brand-crimson dark:text-brand-red" />
                  Interactive Workbench
                </div>
              </div>

              {/* Prediction Trigger & Explanations */}
              <PredictionPanel />

              {/* matched Drugs and Literature results */}
              <DrugPanel />
              <ResearchPanel />

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-brand-gray min-h-[300px]">
              <ShieldAlert className="w-8 h-8 text-brand-gray/50 mb-3" />
              <p className="text-xs font-bold text-brand-dark dark:text-white uppercase tracking-wider">No active target</p>
              <p className="text-xs text-brand-gray dark:text-brand-gray/60 max-w-xs mt-1.5 leading-normal">
                Use the left panel to search and load a protein symbol. The inference pipeline will load here.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Slide-over Side Drawer for Model Selection (Analysis) */}
      {activeTab === 'dashboard' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
            onClick={() => useStore.setState({ activeTab: 'predict' })}
          />
          
          {/* Slide Drawer Content Container */}
          <div className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-4xl h-full bg-white dark:bg-[#151622] shadow-2xl flex flex-col border-l border-brand-gray/20 dark:border-brand-gray/10 animate-slide-in overflow-hidden">
            {/* Header of Drawer */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray/20 dark:border-brand-gray/10 bg-brand-light dark:bg-slate-950 text-brand-dark dark:text-white shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                <span>Model Comparison & Metrics</span>
              </h3>
              <button 
                onClick={() => useStore.setState({ activeTab: 'predict' })}
                className="text-xs text-brand-crimson dark:text-brand-red hover:text-brand-red dark:hover:text-brand-crimson font-bold cursor-pointer bg-brand-crimson/10 dark:bg-brand-red/10 px-3 py-1.5 rounded transition"
              >
                Close Panel
              </button>
            </div>
            {/* Content of Drawer */}
            <div className="flex-1 overflow-y-auto p-6 bg-brand-light dark:bg-[#11121d]">
              <ModelSelection />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
