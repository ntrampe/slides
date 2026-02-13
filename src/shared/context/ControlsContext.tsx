import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface ControlsContextValue {
  areControlsVisible: boolean;
  showControls: () => void;
  hideControls: () => void;
}

const ControlsContext = createContext<ControlsContextValue | undefined>(undefined);

interface ControlsProviderProps {
  children: ReactNode;
  autoHideDelay?: number; // milliseconds before auto-hiding
}

export const ControlsProvider = ({ children, autoHideDelay = 3000 }: ControlsProviderProps) => {
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [hideTimeout, setHideTimeout] = useState<number | null>(null);

  const showControls = useCallback(() => {
    setAreControlsVisible(true);

    // Clear existing timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }

    // Set new timeout to auto-hide
    const timeout = setTimeout(() => {
      setAreControlsVisible(false);
    }, autoHideDelay);

    setHideTimeout(timeout);
  }, [hideTimeout, autoHideDelay]);

  const hideControls = useCallback(() => {
    setAreControlsVisible(false);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  }, [hideTimeout]);

  // Handle mouse movement (desktop)
  useEffect(() => {
    const handleMouseMove = () => {
      showControls();
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [showControls, hideTimeout]);

  // Handle touch/click (mobile)
  useEffect(() => {
    const handleTouch = (event: TouchEvent) => {
      // Ignore touches on interactive elements (buttons, inputs, etc.)
      const target = event.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('a') ||
        target.closest('[role="button"]')
      ) {
        return;
      }

      // Toggle controls when tapping on the photo/background
      if (areControlsVisible) {
        hideControls();
      } else {
        showControls();
      }
    };

    window.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [areControlsVisible, showControls, hideControls]);

  return (
    <ControlsContext.Provider value={{ areControlsVisible, showControls, hideControls }}>
      {children}
    </ControlsContext.Provider>
  );
};

export const useControls = () => {
  const context = useContext(ControlsContext);
  if (!context) {
    throw new Error('useControls must be used within a ControlsProvider');
  }
  return context;
};
