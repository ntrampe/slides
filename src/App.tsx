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
      <div className="h-full transition-all duration-500 ease-in-out">
        <Slideshow />
      </div>

      {/* Settings Button */}
      <button
        onClick={toggleSettings}
        className={`absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-3 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Settings"
      >
        <Settings size={24} strokeWidth={2} />
      </button>

      {/* Backdrop - catches touches outside settings panel */}
      {isSettingsPanelVisible && (
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-500 ease-in-out"
          onClick={closeSettings}
          onTouchStart={(e) => {
            // Prevent touches on backdrop from reaching slideshow
            e.preventDefault();
            closeSettings();
          }}
        />
      )}

      {/* Settings Panel - always rendered, positioned absolutely */}
      <div
        className="absolute top-0 right-0 h-full w-80 transition-transform duration-500 ease-in-out z-10"
        style={{
          transform: isSettingsPanelVisible ? 'translateX(0)' : 'translateX(100%)',
          pointerEvents: isSettingsPanelVisible ? 'auto' : 'none'
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