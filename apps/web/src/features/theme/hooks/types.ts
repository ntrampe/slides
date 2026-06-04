import type { ThemeMode } from "../types";

export interface UseThemeReturn {
    // Theme mode
    mode: ThemeMode;

    // Action to set theme mode
    setMode: (mode: ThemeMode) => void;
}
