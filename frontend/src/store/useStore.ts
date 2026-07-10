import { create } from 'zustand';
import type { Protein, Prediction, Drug, Paper } from '../types';
import apiClient from '../services/api';

interface AppState {
  activeTab: 'dashboard' | 'predict' | 'literature';
  setActiveTab: (tab: 'dashboard' | 'predict' | 'literature') => void;
  
  selectedModel: 'ML' | 'GNN' | 'Graph';
  setSelectedModel: (model: 'ML' | 'GNN' | 'Graph') => void;
  
  selectedProtein: Protein | null;
  setSelectedProtein: (protein: Protein | null) => void;
  
  currentPrediction: Prediction | null;
  setCurrentPrediction: (prediction: Prediction | null) => void;
  
  explanation: string | null;
  setExplanation: (explanation: string | null) => void;
  
  drugs: Drug[];
  setDrugs: (drugs: Drug[]) => void;
  
  papers: Paper[];
  setPapers: (papers: Paper[]) => void;
  
  loading: boolean;
  setLoading: (loading: boolean) => void;
  
  error: string | null;
  setError: (error: string | null) => void;
  
  mockMode: boolean;
  setMockMode: (mock: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  selectedModel: 'ML',
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  selectedProtein: null,
  setSelectedProtein: (protein) => {
    // Reset prediction results when protein changes
    set({ 
      selectedProtein: protein, 
      currentPrediction: null, 
      explanation: null,
      drugs: [],
      papers: [] 
    });
  },
  
  currentPrediction: null,
  setCurrentPrediction: (prediction) => set({ currentPrediction: prediction }),
  
  explanation: null,
  setExplanation: (explanation) => set({ explanation }),
  
  drugs: [],
  setDrugs: (drugs) => set({ drugs }),
  
  papers: [],
  setPapers: (papers) => set({ papers }),
  
  loading: false,
  setLoading: (loading) => set({ loading }),
  
  error: null,
  setError: (error) => set({ error }),
  
  mockMode: apiClient.isMockMode(),
  setMockMode: (mock) => {
    apiClient.setMockMode(mock);
    set({ mockMode: mock });
  }
}));
