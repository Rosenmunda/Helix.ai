import { create } from 'zustand';
import type { Protein, Prediction, Drug, Paper } from '../types';
import apiClient from '../services/api';

interface AppState {
  activeTab: 'dashboard' | 'predict' | 'literature';
  setActiveTab: (tab: 'dashboard' | 'predict' | 'literature') => void;
  
  selectedModel: 'GCN' | 'GraphSAGE' | 'GAT' | 'GraphTheory';
  setSelectedModel: (model: 'GCN' | 'GraphSAGE' | 'GAT' | 'GraphTheory') => void;
  
  selectedProtein: Protein | null;
  setSelectedProtein: (protein: Protein | null) => void;
  
  currentPrediction: Prediction | null;
  setCurrentPrediction: (prediction: Prediction | null) => void;
  
  explanation: string | null;
  setExplanation: (explanation: string | null) => void;
  
  geminiBrief: string | null;
  setGeminiBrief: (brief: string | null) => void;
  
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
  
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Initialise dark mode on boot
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
}

export const useStore = create<AppState>((set) => ({
  activeTab: 'predict',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  selectedModel: 'GCN',
  setSelectedModel: (model) => set({ 
    selectedModel: model, 
    selectedProtein: null, 
    currentPrediction: null, 
    explanation: null,
    geminiBrief: null,
    drugs: [],
    papers: [] 
  }),
  
  selectedProtein: null,
  setSelectedProtein: (protein) => {
    // Reset prediction results when protein changes
    set({ 
      selectedProtein: protein, 
      currentPrediction: null, 
      explanation: null,
      geminiBrief: null,
      drugs: [],
      papers: [] 
    });
  },
  
  currentPrediction: null,
  setCurrentPrediction: (prediction) => set({ currentPrediction: prediction }),
  
  explanation: null,
  setExplanation: (explanation) => set({ explanation }),
  
  geminiBrief: null,
  setGeminiBrief: (brief) => set({ geminiBrief: brief }),
  
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
  },
  
  darkMode: true,
  toggleDarkMode: () => set((state) => {
    const nextMode = !state.darkMode;
    if (typeof document !== 'undefined') {
      if (nextMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { darkMode: nextMode };
  })
}));

// Update store when backend healthcheck resolves
apiClient.onConnectionChange = (mock) => {
  useStore.setState({ mockMode: mock });
};
export default useStore;
