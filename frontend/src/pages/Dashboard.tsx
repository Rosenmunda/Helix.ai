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
    <div className="flex-1 overflow-hidden flex flex-col bg-brand-light">
      {activeTab === 'dashboard' ? (
        /* Performance Dashboard View */
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <ModelSelection />
          </div>
        </div>
      ) : (
        /* 2-Column Inference Workspace Split Pane */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-brand-gray/25">
          
          {/* Left Column: Target Selection & Configuration (35% width) */}
          <div className="w-full md:w-96 flex flex-col overflow-y-auto p-5 shrink-0 bg-white border-r border-brand-gray/20">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">Workspace Setup</h3>
                <p className="text-[11px] text-brand-gray leading-normal">
                  Configure model parameters and select the target protein for the inference run.
                </p>
              </div>

              {/* Protein Search and details card */}
              <ProteinSearch />
            </div>
          </div>

          {/* Right Column: Inference Output & Analytics (65% width) */}
          <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-brand-light">
            {selectedProtein ? (
              <div className="space-y-6 max-w-4xl">
                
                {/* Active target banner */}
                <div className="bg-white border border-brand-gray/20 px-4 py-3 rounded-lg flex items-center justify-between text-xs text-brand-dark shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-gray font-semibold">Active target:</span>
                    <span className="font-extrabold text-brand-crimson">{selectedProtein.name}</span>
                    <span className="text-brand-gray">({selectedProtein.uniprot_id || selectedProtein.protein_id})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-gray font-medium">
                    <Info className="w-3.5 h-3.5 text-brand-crimson" />
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
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-brand-gray">
                <ShieldAlert className="w-8 h-8 text-brand-gray/50 mb-3" />
                <p className="text-xs font-bold text-brand-dark uppercase tracking-wider">No active target</p>
                <p className="text-xs text-brand-gray max-w-xs mt-1.5 leading-normal">
                  Use the left panel to search and load a protein symbol. The inference pipeline will load here.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
export default Dashboard;
