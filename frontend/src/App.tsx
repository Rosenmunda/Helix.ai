import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/common/Header';
import { Dashboard } from './pages/Dashboard';

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
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light font-sans antialiased">
        
        {/* Top Navbar */}
        <Header />

        {/* Core Main Dashboard */}
        <Dashboard />

      </div>
    </QueryClientProvider>
  );
};

export default App;
