import { useEffect, useCallback } from 'react';
import { usePresentationSettings } from '../../settings';
import type { ThemeMode } from '../types';
import type { UseThemeReturn } from './types';

/**
 * Main theme hook - uses Tailwind v4 CSS-based theming with data-theme attribute.
 * Delegates persistence to client-side presentation settings.
 */
export function useTheme(): UseThemeReturn {
    const { presentation, updatePresentationSettings } = usePresentationSettings();
    const mode = presentation.themeMode;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode);
    }, [mode]);

    const setMode = useCallback(
        (newMode: ThemeMode) => {
            updatePresentationSettings({ themeMode: newMode });
        },
        [updatePresentationSettings]
    );

    return {
        mode,
        setMode,
    };
}
