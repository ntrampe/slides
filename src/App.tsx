import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceContext, services } from './shared/context/ServiceContext';
import { ControlsProvider } from './shared/context/ControlsContext';
import { Slideshow } from './features/slideshow';

import { useKeyToggle, useControls } from './shared/hooks';
import { SettingsPanel } from './features/settings';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from './features/theme';

const queryClient = new QueryClient();


function AppContent() {
  // Apply theme at app level
  useTheme();

  const { isActive: isSettingsShown } = useKeyToggle('s');
  const [showSettings, setShowSettings] = useState(false);
  const { areControlsVisible } = useControls();

  const toggleSettings = () => setShowSettings(prev => !prev);
  const isSettingsPanelVisible = isSettingsShown || showSettings;

  return (
    <main
      className="select-none overflow-hidden relative bg-black"
      style={{
        // Use modern dynamic viewport height (fallback handled by CSS)
        height: '100dvh',
      }}
    >
      {/* Slideshow Container - extends to true edges, shrinks when settings visible */}
      <div
        className="absolute inset-0 transition-all duration-500 ease-in-out"
        style={{
          width: isSettingsPanelVisible ? 'calc(100% - 320px)' : '100%'
        }}
      >
        <Slideshow />
      </div>

      {/* Settings Button - with safe area awareness and fallback */}
      <button
        onClick={toggleSettings}
        className={`absolute transition-all duration-500 ease-in-out text-white hover:bg-white/20 rounded-full p-3 z-10 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        style={{
          // Safe area aware positioning (falls back to 1rem on unsupported browsers)
          top: 'max(1rem, env(safe-area-inset-top, 0px))',
          right: isSettingsPanelVisible ? 'calc(320px + 1rem)' : '1rem'
        }}
        aria-label="Settings"
      >
        <Settings size={24} strokeWidth={2} />
      </button>

      {/* Settings Panel - always rendered, positioned absolutely with safe area padding */}
      <div
        className="absolute right-0 w-80 transition-transform duration-500 ease-in-out"
        style={{
          top: '0',
          height: '100dvh',
          transform: isSettingsPanelVisible ? 'translateX(0)' : 'translateX(100%)',
          // Safe area padding for iOS
          paddingTop: 'max(0px, env(safe-area-inset-top, 0px))',
          paddingBottom: 'max(0px, env(safe-area-inset-bottom, 0px))'
        }}
      >
        <SettingsPanel />
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