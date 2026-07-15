import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/common/Header';
import { Dashboard } from './pages/Dashboard';
import logo from './assets/logo.jpg';

// Initialize TanStack React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing target databases...');

  useEffect(() => {
    // Start filling progress bar immediately on mount
    const frame = requestAnimationFrame(() => {
      setProgress(100);
    });

    // Animate loading text
    const textTimer1 = setTimeout(() => setLoadingText('Loading Graph Neural Network models...'), 850);
    const textTimer2 = setTimeout(() => setLoadingText('Caching GCN & GraphSAGE predictions...'), 1750);
    const textTimer3 = setTimeout(() => setLoadingText('System check complete. Ready.'), 2550);

    // Fade out overlay after 2.8s
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2800);

    // Completely remove overlay after 3.3s
    const removeTimer = setTimeout(() => {
      setShowLoader(false);
    }, 3300);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(textTimer3);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light font-sans antialiased">
        
        {/* Top Navbar */}
        <Header />

        {/* Core Main Dashboard */}
        <Dashboard />

        {/* Premium Fading Loading Screen */}
        {showLoader && (
          <div
            className={`fixed inset-0 z-[100] bg-[#090a10] flex flex-col items-center justify-center transition-opacity duration-500 ease-out select-none ${
              fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="flex flex-col items-center max-w-sm px-6">
              {/* Pulsing Logo Container */}
              <div className="relative w-24 h-24 md:w-28 h-28 bg-[#13141f] rounded-2xl border border-white/5 p-4 flex items-center justify-center shadow-2xl animate-[pulse_2s_infinite]">
                <img src={logo} alt="Protein Notebook Logo" className="w-full h-full object-contain rounded" />
              </div>

              {/* Application Brand Name */}
              <h1 className="font-extrabold text-2xl md:text-3xl text-white tracking-wide mt-6 text-center">
                Protein Notebook
              </h1>

              {/* Subheading */}
              <p className="text-[9px] md:text-[10px] font-bold text-brand-gray/60 uppercase tracking-widest text-center mt-2">
                GNN Essentiality & Drug Repurposing Engine
              </p>

              {/* Animated Progress Bar */}
              <div className="w-48 h-1 bg-white/10 rounded-full mt-8 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-brand-crimson to-brand-red rounded-full transition-all duration-[2800ms] ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Changing Status Text */}
              <p className="text-[10px] font-mono text-brand-gray/60 mt-3 animate-pulse uppercase tracking-wider text-center">
                {loadingText}
              </p>
            </div>
          </div>
        )}

      </div>
    </QueryClientProvider>
  );
};

export default App;
