import { useState, useEffect } from 'react';

/**
 * Hook to toggle a boolean state with a keyboard shortcut
 * @param key - The keyboard key to toggle the state
 * @param initialValue - Initial state value (default: false)
 * @returns Object with isActive state and toggle function
 */
export const useKeyToggle = (key: string, initialValue: boolean = false) => {
  const [isActive, setIsActive] = useState(initialValue);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        setIsActive(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key]);

  const toggle = () => setIsActive(prev => !prev);

  return { isActive, toggle };
};

/**
 * Convenience hook for debug mode toggle
 * @param key - The keyboard key to toggle debug mode (default: 'd')
 * @returns Object with isDebugMode state and toggle function
 */
export const useDebugToggle = (key: string = 'd') => {
  const { isActive, toggle } = useKeyToggle(key);
  return { isDebugMode: isActive, toggle };
};
