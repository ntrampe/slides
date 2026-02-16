import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceContext, services } from './shared/context/ServiceContext';
import { ControlsProvider } from './shared/context/ControlsContext';
import { Slideshow } from './features/slideshow';

import { useControls } from './shared/hooks';
import { SettingsPanel, useSettingsPanel } from './features/settings';
import { Settings } from 'lucide-react';
import { useTheme } from './features/theme';

const queryClient = new QueryClient();

function AppContent() {
  // Apply theme at app level
  useTheme();

  const { state: { isOpen: isSettingsPanelVisible }, actions: { toggle: toggleSettings, close: closeSettings } } = useSettingsPanel();
  const { areControlsVisible } = useControls();

  return (
    <main className="h-screen w-screen bg-background select-none overflow-hidden relative">
      {/* Slideshow Container - shrinks when settings are visible */}
      <div
        className="h-full transition-all duration-500 ease-in-out"
        style={{
          width: isSettingsPanelVisible ? 'calc(100% - 320px)' : '100%'
        }}
      >
        <Slideshow />
      </div>

      {/* Settings Button */}
      <button
        onClick={toggleSettings}
        className={`absolute top-4 transition-all duration-500 ease-in-out text-white hover:bg-white/20 rounded-full p-3 z-10 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        style={{
          right: isSettingsPanelVisible ? 'calc(320px + 1rem)' : '1rem'
        }}
        aria-label="Settings"
      >
        <Settings size={24} strokeWidth={2} />
      </button>

      {/* Settings Panel - always rendered, positioned absolutely */}
      <div
        className="absolute top-0 right-0 h-full w-80 transition-transform duration-500 ease-in-out"
        style={{
          transform: isSettingsPanelVisible ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <SettingsPanel onClose={closeSettings} />
      </div>
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