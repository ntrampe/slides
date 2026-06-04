import { useEffect, useCallback } from 'react';
import { useSettingsData } from '../../../features/settings/hooks/useSettingsData';
import type { ThemeMode } from "../types";
import type { UseThemeReturn } from './types';

/**
 * Main theme hook - uses Tailwind v4 CSS-based theming with data-theme attribute.
 * Delegates persistence to existing settings system.
 */
export function useTheme(): UseThemeReturn {
    const { settings, updateSettings } = useSettingsData();
    const mode = settings.theme.mode;

    // Apply theme to DOM by setting data-theme attribute
    // CSS handles the rest via :root[data-theme="light"] and :root[data-theme="dark"]
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode);
    }, [mode]);

    // Set theme mode
    const setMode = useCallback((newMode: ThemeMode) => {
        updateSettings({ theme: { mode: newMode } });
    }, [updateSettings]);

    return {
        mode,
        setMode,
    };
}
