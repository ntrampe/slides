import type { ThemeMode } from '../../types/config';

export interface UseThemeReturn {
    // Theme mode
    mode: ThemeMode;

    // Action to set theme mode
    setMode: (mode: ThemeMode) => void;
}
