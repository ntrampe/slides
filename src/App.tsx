import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceContext, services } from './shared/context/ServiceContext';
import { ControlsProvider } from './shared/context/ControlsContext';
import { Slideshow } from './features/slideshow';
import { SettingsPanel, useSettingsPanel } from './features/settings';
import { useTheme } from './features/theme';

const queryClient = new QueryClient();

function AppContent() {
  // Apply theme at app level
  useTheme();

  const { state: { isOpen: isSettingsPanelVisible }, actions: { toggle: toggleSettings, close: closeSettings } } = useSettingsPanel();

  return (
    <main className="safe-areas h-screen w-screen bg-background select-none overflow-hidden relative">
      {/* Slideshow Container */}
      <div className="h-full transition-all duration-500 ease-in-out">
        <Slideshow onToggleSettings={toggleSettings} />
      </div>

      {/* Backdrop - catches touches outside settings panel */}
      {isSettingsPanelVisible && (
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-500 ease-in-out z-10"
          onClick={closeSettings}
        />
      )}

      {/* Settings Panel - always rendered, positioned absolutely */}
      <div
        className="no-safe-areas absolute top-0 right-0 h-full w-80 transition-transform duration-500 ease-in-out z-20"
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