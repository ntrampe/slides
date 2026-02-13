import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceContext, services } from './shared/context/ServiceContext';
import { Slideshow } from './features/slideshow';

const queryClient = new QueryClient();

export default function App() {
  const [layout, setLayout] = useState<'single' | 'split'>('single');

  // Simple key listener to toggle layout for testing
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 's') setLayout(prev => prev === 'single' ? 'split' : 'single');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ServiceContext.Provider value={services}>
        <main className="h-screen w-screen bg-black cursor-none select-none">
          <Slideshow layout={layout} />
        </main>
      </ServiceContext.Provider>
    </QueryClientProvider>
  );
}