import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { Loader2, BrainCircuit, Activity, FileJson, Sparkles } from 'lucide-react';

export const PredictionPanel: React.FC = () => {
  const { 
    selectedProtein, 
    selectedModel, 
    currentPrediction, 
    setCurrentPrediction,
    explanation,
    setExplanation,
    geminiBrief,
    setGeminiBrief,
    drugs,
    setDrugs,
    papers,
    setPapers,
    loading, 
    setLoading, 
    error, 
    setError 
  } = useStore();

  const [scanState, setScanState] = useState<'idle' | 'extracting' | 'inferring' | 'explaining' | 'fetching_drugs' | 'fetching_research'>('idle');
  const [loadingBrief, setLoadingBrief] = useState(false);

  const handlePredict = async () => {
    if (!selectedProtein) return;
    
    setLoading(true);
    setError(null);
    setCurrentPrediction(null);
    setExplanation(null);
    setGeminiBrief(null);
    setDrugs([]);
    setPapers([]);
    
    try {
      setScanState('extracting');
      await new Promise(r => setTimeout(r, 400));

      setScanState('inferring');
      const predictionRes = await api.createPrediction(selectedProtein.id, selectedModel);
      const prediction = predictionRes.data;
      
      setScanState('explaining');
      const explanationRes = await api.getExplanation(prediction.id);
      let explanationText = explanationRes.data.explanation;
      if (!explanationText) {
        explanationText = api.getFallbackExplanation(
          selectedProtein.name, 
          prediction.prediction === 'Essential', 
          prediction.confidence, 
          selectedModel
        );
      }
      
      setScanState('fetching_drugs');
      const drugsRes = await api.getDrugs(selectedProtein.id, selectedModel);
      
      setScanState('fetching_research');
      const researchRes = await api.getResearch(selectedProtein.id, selectedModel);

      // Fetch Gemini AI Brief Section
      setLoadingBrief(true);
      try {
        const briefRes = await api.getGeminiBrief(
          selectedProtein.id,
          selectedModel,
          prediction.prediction,
          prediction.confidence
        );
        setGeminiBrief(briefRes.data.brief);
      } catch (briefErr) {
        console.error("Gemini brief fetch error:", briefErr);
        setGeminiBrief("Failed to generate Gemini brief.");
      } finally {
        setLoadingBrief(false);
      }

      setCurrentPrediction(prediction);
      setExplanation(explanationText);
      setDrugs(drugsRes.data.drugs);
      setPapers(researchRes.data.papers);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Inference pipeline failure.');
    } finally {
      setLoading(false);
      setScanState('idle');
    }
  };

  const handleExportJSON = () => {
    if (!selectedProtein || !currentPrediction) return;
    const report = {
      timestamp: new Date().toISOString(),
      protein: selectedProtein,
      model: selectedModel,
      prediction: currentPrediction,
      explanation,
      drugs,
      papers
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Inference_Report_${selectedProtein.name}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!selectedProtein) return null;

  return (
    <div className="space-y-4 select-none text-brand-dark dark:text-brand-light">
      {/* trigger prediction bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-brand-gray/25 dark:border-brand-gray/10 bg-white dark:bg-[#151622] rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-brand-dark dark:text-white">
          <BrainCircuit className="w-4 h-4 text-brand-crimson dark:text-brand-red" />
          <span className="text-xs font-bold">Run Inference Ensemble Pipeline</span>
        </div>
        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full sm:w-auto bg-brand-crimson hover:bg-brand-red text-white font-bold px-5 py-2 rounded text-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>
                {scanState === 'extracting' && 'Extracting descriptors...'}
                {scanState === 'inferring' && 'Model predicting...'}
                {scanState === 'explaining' && 'Writing reasoning...'}
                {scanState === 'fetching_drugs' && 'Querying DrugBank...'}
                {scanState === 'fetching_research' && 'Searching PubMed...'}
              </span>
            </>
          ) : (
            <>
              <Activity className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>Execute Inference</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Loading spacer */}
      {loading && (
        <div className="border border-brand-gray/20 dark:border-brand-gray/10 bg-white dark:bg-[#151622] rounded-lg p-6 flex flex-col items-center justify-center space-y-3 h-48 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-brand-crimson dark:text-brand-red" />
          <span className="text-xs text-brand-gray dark:text-brand-gray/60 font-semibold">Computing classification network metrics...</span>
        </div>
      )}

      {/* Flat Prediction results display */}
      {currentPrediction && !loading && (
        <div className="border border-brand-gray/25 dark:border-brand-gray/10 rounded-lg overflow-hidden bg-white dark:bg-[#151622] shadow-sm">
          
          {/* Header */}
          <div className="bg-brand-light dark:bg-slate-950 px-4 py-2.5 border-b border-brand-gray/20 dark:border-brand-gray/10 flex justify-between items-center text-brand-dark dark:text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider">Inference Results</span>
            <button
              onClick={handleExportJSON}
              className="text-brand-crimson dark:text-brand-red hover:text-brand-red dark:hover:text-brand-crimson font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Save Raw Data</span>
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Classification & flat bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <span className="text-[10px] text-brand-gray dark:text-brand-gray/60 font-bold uppercase tracking-wider block">Essentiality Classification</span>
                <span className={`inline-block text-xs font-extrabold px-2.5 py-0.5 rounded border mt-1.5 ${
                  currentPrediction.prediction === 'Essential'
                    ? 'bg-rose-50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-455'
                    : 'bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-455'
                }`}>
                  {currentPrediction.prediction}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-brand-gray dark:text-brand-gray/60 font-bold uppercase tracking-wider block">Inference Confidence</span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-brand-light dark:bg-brand-dark h-2 rounded border border-brand-gray/20 dark:border-brand-gray/10 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${currentPrediction.prediction === 'Essential' ? 'bg-brand-crimson' : 'bg-brand-gray'}`}
                      style={{ width: `${currentPrediction.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-brand-dark dark:text-white font-mono">{(currentPrediction.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-brand-gray dark:text-brand-gray/60 font-bold uppercase tracking-wider block">Inference Latency</span>
                <span className="text-xs font-bold text-brand-dark dark:text-white font-mono block mt-1.5">{currentPrediction.execution_time_ms} ms</span>
              </div>
            </div>

            {/* Explanation box */}
            <div className="pt-3 border-t border-brand-gray/15 dark:border-brand-gray/10">
              <span className="text-[10px] text-brand-gray dark:text-brand-gray/60 font-bold uppercase tracking-wider block mb-1.5">Biological Basis & Annotations</span>
              <div className="bg-brand-light dark:bg-brand-dark/40 border border-brand-gray/20 dark:border-brand-gray/10 p-3.5 rounded text-xs text-brand-dark dark:text-brand-light leading-relaxed font-mono">
                {explanation || 'Reasoning text failed to load.'}
              </div>
            </div>

            {/* Gemini AI Brief Section */}
            <div className="pt-3 border-t border-brand-gray/15 dark:border-brand-gray/10">
              <span className="text-[10px] text-brand-crimson dark:text-brand-red font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-crimson dark:text-brand-red animate-pulse" />
                <span>AI Essentiality Brief (Powered by Gemini)</span>
              </span>
              <div className="bg-brand-crimson/5 dark:bg-brand-red/5 border border-brand-crimson/25 dark:border-brand-crimson/10 p-3.5 rounded text-xs text-brand-dark dark:text-brand-light leading-relaxed">
                {loadingBrief ? (
                  <div className="flex items-center gap-2 text-brand-gray/70 py-1 font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-crimson dark:text-brand-red" />
                    <span>Generating Gemini brief...</span>
                  </div>
                ) : geminiBrief ? (
                  <p className="font-medium text-brand-dark dark:text-brand-light">{geminiBrief}</p>
                ) : (
                  <p className="text-brand-gray/60 italic">No brief generated. Run inference to query Gemini.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
export default PredictionPanel;
