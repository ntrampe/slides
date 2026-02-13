import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceContext, services } from './shared/context/ServiceContext';
import { Slideshow } from './features/slideshow';
import { useKeyToggle } from './shared/hooks';
import { SettingsPanel } from './features/settings';

const queryClient = new QueryClient();

export default function App() {
  const { isActive: isSettingsShown } = useKeyToggle('s');

  return (
    <QueryClientProvider client={queryClient}>
      <ServiceContext.Provider value={services}>
        <main className="h-screen w-screen bg-black cursor-none select-none">
          <Slideshow />
          {isSettingsShown && <SettingsPanel />}
        </main>
      </ServiceContext.Provider>
    </QueryClientProvider>
  );
}