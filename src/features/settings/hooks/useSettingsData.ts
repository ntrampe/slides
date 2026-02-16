import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../../shared/context/ServiceContext';
import type { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';

export interface UseSettingsDataReturn {
    /** Current settings (saved → defaults) */
    settings: AppSettings;
    /** Update and persist settings to localStorage */
    updateSettings: (newSettings: AppSettings) => void;
}

/**
 * Provides access to app settings with fallback:
 * 1. Saved settings (localStorage)
 * 2. Default settings (build-time env vars)
 */
export function useSettingsData(): UseSettingsDataReturn {
    const { settings: service } = useServices();
    const queryClient = useQueryClient();

    const settingsQuery = useQuery({
        queryKey: ['settings'],
        queryFn: () => service.loadSettings(),
    });

    const mutation = useMutation({
        mutationFn: (newSettings: AppSettings) => service.saveSettings(newSettings),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
    });

    const settings = settingsQuery.data ?? DEFAULT_APP_SETTINGS;

    return {
        settings,
        updateSettings: mutation.mutate,
    };
}