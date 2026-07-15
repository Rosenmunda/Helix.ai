import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { Search, ChevronRight, Cpu, ChevronDown } from 'lucide-react';

export const ProteinSearch: React.FC = () => {
  const {
    selectedModel,
    setSelectedModel,
    selectedProtein,
    setSelectedProtein
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Refetch when model or search query changes, limit to 50 for performance dropdown
  const { data: results, isLoading } = useQuery({
    queryKey: ['proteinSearch', selectedModel, debouncedQuery],
    queryFn: () => api.searchProteins(debouncedQuery, 50, selectedModel).then(r => r.data.results),
    staleTime: 5 * 60 * 1000,
  });

  const handleSelect = (protein: any) => {
    setSelectedProtein(protein);
    setSearchQuery('');
    setDropdownOpen(false);
  };

  const getPliLabel = (score?: number) => {
    if (score === undefined) return 'N/A';
    if (score >= 0.9) return `${score.toFixed(2)} (High Intolerance)`;
    if (score >= 0.5) return `${score.toFixed(2)} (Moderate)`;
    return `${score.toFixed(2)} (Low Intolerance)`;
  };

  return (
    <div className="space-y-6 select-none text-brand-dark dark:text-brand-light">

      {/* 1. Model Configuration selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-brand-gray uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-brand-crimson dark:text-brand-red" />
          <span>Inference Classifier Engine</span>
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value as 'GCN' | 'GraphSAGE' | 'GAT' | 'GraphTheory')}
          className="w-full bg-white dark:bg-[#1a1b26] border border-brand-gray/40 dark:border-brand-gray/10 rounded-lg px-3 py-2 text-xs text-brand-dark dark:text-brand-light outline-none focus:border-brand-crimson dark:focus:border-brand-red transition cursor-pointer shadow-sm"
        >
          <option value="GCN">GCN (Graph Convolutional Network)</option>
          <option value="GraphSAGE">GraphSAGE Network</option>
          <option value="GAT">GAT (Graph Attention Network)</option>
          <option value="GraphTheory">Network Graph Theory</option>
        </select>
      </div>

      {/* 2. Search Autocomplete input */}
      <div className="space-y-2 relative" ref={dropdownRef}>
        <label className="text-[10px] font-bold text-brand-gray uppercase tracking-wider flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-brand-crimson dark:text-brand-red" />
          <span>Query Target Protein</span>
        </label>

        <div className="relative">
          {/* Dropdown Selector Button */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-white dark:bg-[#1a1b26] border border-brand-gray/40 dark:border-brand-gray/10 rounded-lg px-3 py-2 text-left text-xs text-brand-dark dark:text-brand-light flex items-center justify-between outline-none focus:border-brand-crimson dark:focus:border-brand-red transition shadow-sm cursor-pointer"
          >
            <span className={selectedProtein ? "font-bold text-brand-dark dark:text-white" : "text-brand-gray/60"}>
              {selectedProtein ? `${selectedProtein.uniprot_id || selectedProtein.protein_id} (${selectedProtein.name})` : 'Select a Protein Target...'}
            </span>
            <ChevronDown className={`w-4 h-4 text-brand-crimson dark:text-brand-red transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Search Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1b26] border border-brand-gray/30 dark:border-brand-gray/10 rounded-lg shadow-xl z-20 max-h-64 flex flex-col overflow-hidden">
              {/* Dropdown Search Bar */}
              <div className="p-2 border-b border-brand-gray/15 dark:border-brand-gray/10 shrink-0 bg-brand-light/20 dark:bg-slate-900 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-brand-gray/60" />
                <input
                  type="text"
                  placeholder="Filter proteins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-brand-dark dark:text-brand-light outline-none"
                  autoFocus
                />
              </div>

              {/* Scrollable list of proteins */}
              <div className="overflow-y-auto flex-1 divide-y divide-brand-gray/10 dark:divide-brand-gray/5">
                {isLoading && (
                  <div className="p-3 text-center text-[10px] text-brand-gray animate-pulse font-semibold">
                    Querying database index...
                  </div>
                )}
                {results && results.length === 0 && (
                  <div className="p-3 text-center text-[10px] text-brand-gray font-semibold">
                    No records matched query.
                  </div>
                )}
                {results?.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-brand-light dark:hover:bg-white/5 transition text-left cursor-pointer text-xs text-brand-dark dark:text-brand-light font-medium"
                  >
                    <div>
                      <span className="font-bold text-brand-dark dark:text-white">{p.uniprot_id || p.protein_id}</span>
                      <span className="text-[10px] text-brand-gray ml-2 font-mono">({p.name})</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-brand-crimson dark:text-brand-red" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Selected Protein details (Clean, tabular high-density layout) */}
      {selectedProtein ? (
        <div className="border border-brand-gray/25 dark:border-brand-gray/10 rounded-lg p-4 bg-brand-light/50 dark:bg-[#1a1b26]/30 space-y-4 shadow-sm">
          <div className="border-b border-brand-gray/20 dark:border-brand-gray/10 pb-3">
            <span className="text-[10px] text-brand-gray font-bold uppercase tracking-wider">Active target details</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-extrabold text-brand-dark dark:text-white">{selectedProtein.name}</span>
              <span className="text-[10px] font-mono text-brand-gray">{selectedProtein.uniprot_id || selectedProtein.protein_id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs text-brand-dark dark:text-brand-light">
            <div className="flex justify-between py-1 border-b border-brand-gray/10 dark:border-brand-gray/5">
              <span className="text-brand-gray font-medium">pLI Score:</span>
              <span className="text-brand-dark dark:text-white font-mono font-bold">{getPliLabel(selectedProtein.pli_score)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-gray/10 dark:border-brand-gray/5">
              <span className="text-brand-gray font-medium">Degree Centrality:</span>
              <span className="text-brand-dark dark:text-white font-mono font-medium">{selectedProtein.features?.degree_centrality?.toFixed(4) || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-gray/10 dark:border-brand-gray/5">
              <span className="text-brand-gray font-medium">Betweenness Centrality:</span>
              <span className="text-brand-dark dark:text-white font-mono font-medium">{selectedProtein.features?.betweenness_centrality?.toFixed(4) || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-gray/10 dark:border-brand-gray/5">
              <span className="text-brand-gray font-medium">Sequence Length:</span>
              <span className="text-brand-dark dark:text-white font-mono font-medium">{selectedProtein.features?.sequence_length?.toLocaleString() || 'N/A'} aa</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-brand-gray font-medium">mRNA Expression:</span>
              <span className="text-brand-dark dark:text-white font-mono font-medium">{selectedProtein.features?.expression_level?.toFixed(4) || 'N/A'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-brand-gray/30 dark:border-brand-gray/10 rounded-lg p-6 text-center text-brand-gray text-[11px] leading-normal font-medium bg-brand-light/20 dark:bg-[#1a1b26]/10">
          Select a protein target to view biochemical parameters.
        </div>
      )}

    </div>
  );
};
export default ProteinSearch;
