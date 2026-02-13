import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceContext, services } from './shared/context/ServiceContext';
import { Slideshow } from './features/slideshow';
import { useKeyToggle } from './shared/hooks';

const queryClient = new QueryClient();

export default function App() {
  // Toggle layout with 's' key
  const { isActive: isSplitLayout } = useKeyToggle('s');

  return (
    <QueryClientProvider client={queryClient}>
      <ServiceContext.Provider value={services}>
        <main className="h-screen w-screen bg-black cursor-none select-none">
          <Slideshow layout={isSplitLayout ? 'split' : 'single'} />
        </main>
      </ServiceContext.Provider>
    </QueryClientProvider>
  );
}