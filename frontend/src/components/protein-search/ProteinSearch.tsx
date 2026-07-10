import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { Search, ChevronRight, Cpu } from 'lucide-react';

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

  const { data: results, isLoading } = useQuery({
    queryKey: ['proteinSearch', debouncedQuery],
    queryFn: () => api.searchProteins(debouncedQuery, 10).then(r => r.data.results),
    enabled: debouncedQuery.length >= 2,
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
    <div className="space-y-6 select-none text-brand-dark">
      
      {/* 1. Model Configuration selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-brand-gray uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-brand-crimson" />
          <span>Inference Classifier Engine</span>
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value as 'ML' | 'GNN' | 'Graph')}
          className="w-full bg-white border border-brand-gray/40 rounded-lg px-3 py-2 text-xs text-brand-dark outline-none focus:border-brand-crimson transition cursor-pointer shadow-sm"
        >
          <option value="ML">Classical Classifier (Random Forest)</option>
          <option value="GNN">Graph Convolutional Network (GNN)</option>
          <option value="Graph">Clustering Centrality Network</option>
        </select>
      </div>

      {/* 2. Search Autocomplete input */}
      <div className="space-y-2 relative" ref={dropdownRef}>
        <label className="text-[10px] font-bold text-brand-gray uppercase tracking-wider flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-brand-crimson" />
          <span>Query Target Protein</span>
        </label>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Enter gene symbol (e.g. TP53)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            className="w-full bg-white border border-brand-gray/40 focus:border-brand-crimson rounded-lg px-3 py-2 text-xs text-brand-dark placeholder-brand-gray/50 outline-none transition shadow-sm"
          />

          {dropdownOpen && searchQuery.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brand-gray/30 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto divide-y divide-brand-gray/10">
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
                  className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-brand-light transition text-left cursor-pointer text-xs text-brand-dark font-medium"
                >
                  <div>
                    <span className="font-bold text-brand-dark">{p.name}</span>
                    <span className="text-[10px] text-brand-gray ml-2 font-mono">({p.uniprot_id || p.protein_id})</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-brand-crimson" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Selected Protein details (Clean, tabular high-density layout) */}
      {selectedProtein ? (
        <div className="border border-brand-gray/25 rounded-lg p-4 bg-brand-light/50 space-y-4 shadow-sm">
          <div className="border-b border-brand-gray/20 pb-3">
            <span className="text-[10px] text-brand-gray font-bold uppercase tracking-wider">Active target details</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-extrabold text-brand-dark">{selectedProtein.name}</span>
              <span className="text-[10px] font-mono text-brand-gray">{selectedProtein.uniprot_id || selectedProtein.protein_id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs text-brand-dark">
            <div className="flex justify-between py-1 border-b border-brand-gray/10">
              <span className="text-brand-gray font-medium">pLI Score:</span>
              <span className="text-brand-dark font-mono font-bold">{getPliLabel(selectedProtein.pli_score)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-gray/10">
              <span className="text-brand-gray font-medium">Degree Centrality:</span>
              <span className="text-brand-dark font-mono font-medium">{selectedProtein.features?.degree_centrality?.toFixed(4) || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-gray/10">
              <span className="text-brand-gray font-medium">Betweenness Centrality:</span>
              <span className="text-brand-dark font-mono font-medium">{selectedProtein.features?.betweenness_centrality?.toFixed(4) || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-gray/10">
              <span className="text-brand-gray font-medium">Sequence Length:</span>
              <span className="text-brand-dark font-mono font-medium">{selectedProtein.features?.sequence_length?.toLocaleString() || 'N/A'} aa</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-brand-gray font-medium">mRNA Expression:</span>
              <span className="text-brand-dark font-mono font-medium">{selectedProtein.features?.expression_level?.toFixed(4) || 'N/A'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-brand-gray/30 rounded-lg p-6 text-center text-brand-gray text-[11px] leading-normal font-medium bg-brand-light/20">
          Select a protein target to view biochemical parameters.
        </div>
      )}

    </div>
  );
};
export default ProteinSearch;
