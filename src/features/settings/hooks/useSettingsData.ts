import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../../shared/context/ServiceContext';
import type { AppSettings } from '../types';
import { FALLBACK_APP_SETTINGS } from '../constants';

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
    const { settings: settingsService, config: configService } = useServices();
    const queryClient = useQueryClient();

    // Fetch server defaults
    const configQuery = useQuery({
        queryKey: ['config'],
        queryFn: () => configService.fetchDefaultConfig(),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1, // Only retry once
    });

    // Fetch user overrides
    const settingsQuery = useQuery({
        queryKey: ['settings'],
        queryFn: () => settingsService.loadSettings(),
    });

    const mutation = useMutation({
        mutationFn: (newSettings: AppSettings) => settingsService.saveSettings(newSettings),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
    });

    const settings = settingsQuery.data ?? configQuery.data ?? FALLBACK_APP_SETTINGS;

    return {
        settings,
        updateSettings: mutation.mutate,
    };
}