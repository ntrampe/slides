import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface IdleContextValue {
  isIdle: boolean;
  setIsIdle: (idle: boolean) => void;
}

const IdleContext = createContext<IdleContextValue | undefined>(undefined);

interface IdleProviderProps {
  children: ReactNode;
  delay?: number; // milliseconds before auto-hiding
}

export const IdleProvider = ({ children, delay = 5000 }: IdleProviderProps) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timeout: number;

    const reset = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => setIsIdle(true), delay);
    };

    window.addEventListener('mousemove', reset);
    window.addEventListener('touchstart', reset);
    reset();

    return () => {
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('touchstart', reset);
    };
  }, []);

  return (
    <IdleContext.Provider value={{ isIdle, setIsIdle }}>
      {children}
    </IdleContext.Provider>
  );
};

export const useIdle = () => {
  const context = useContext(IdleContext);
  if (!context) {
    throw new Error('useIdle must be used within a IdleProvider');
  }
  return context;
};
