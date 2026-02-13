import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceContext, services } from './shared/context/ServiceContext';
import { ControlsProvider } from './shared/context/ControlsContext';
import { Slideshow } from './features/slideshow';

import { useKeyToggle, useControls } from './shared/hooks';
import { SettingsPanel } from './features/settings';
import { Settings } from 'lucide-react';
import { useState } from 'react';

const queryClient = new QueryClient();


function AppContent() {
  const { isActive: isSettingsShown } = useKeyToggle('s');
  const [showSettings, setShowSettings] = useState(false);
  const { areControlsVisible } = useControls();

  const toggleSettings = () => setShowSettings(prev => !prev);
  const isSettingsPanelVisible = isSettingsShown || showSettings;

  return (
    <main className="h-screen w-screen bg-black cursor-none select-none">
      <Slideshow />

      {/* Settings Button */}
      <button
        onClick={toggleSettings}
        className={`absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-3 transition-all duration-300 z-10 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-label="Settings"
      >
        <Settings size={24} strokeWidth={2} />
      </button>

      {isSettingsPanelVisible && <SettingsPanel />}
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ServiceContext.Provider value={services}>




        <ControlsProvider autoHideDelay={3000}>
          <AppContent />
        </ControlsProvider>
      </ServiceContext.Provider>
    </QueryClientProvider>
  );
}