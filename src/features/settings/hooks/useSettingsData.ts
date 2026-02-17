import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useServices } from '../../../shared/context/ServiceContext';
import type { AppSettings } from '../types';
import { FALLBACK_APP_SETTINGS } from '../constants';
import { deepMerge, type DeepPartial } from '../../../shared/utils/deepMerge';

export interface UseSettingsDataReturn {
    /** Current settings (user overrides merged with defaults) */
    settings: AppSettings;
    /** 
     * Update and persist partial settings to localStorage.
     * Deep merges with existing saved settings (not defaults).
     * Only saves user overrides, keeps defaults un-persisted.
     */
    updateSettings: (partialSettings: DeepPartial<AppSettings>) => void;
}

/**
 * Provides access to app settings with fallback chain:
 * 1. User overrides (localStorage) 
 * 2. Server defaults (/api/config endpoint)
 * 3. Hardcoded fallback (FALLBACK_APP_SETTINGS)
 * 
 * Settings are merged: saved overrides + server defaults + fallback.
 * When updating, only user overrides are persisted to localStorage.
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

    // Fetch user overrides from localStorage
    const settingsQuery = useQuery({
        queryKey: ['settings'],
        queryFn: () => settingsService.loadSettings(),
    });

    const mutation = useMutation({
        mutationFn: (newSettings: AppSettings | DeepPartial<AppSettings>) =>
            settingsService.saveSettings(newSettings as AppSettings),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
    });

    // Compute final settings: user overrides → server defaults → fallback
    const defaults = configQuery.data ?? FALLBACK_APP_SETTINGS;
    const settings = settingsQuery.data
        ? deepMerge(defaults, settingsQuery.data as DeepPartial<AppSettings>)
        : defaults;

    /**
     * Merges partial settings with SAVED settings (not computed settings).
     * This ensures localStorage only contains user overrides, not defaults.
     */
    const updateSettings = useCallback(
        (partialSettings: DeepPartial<AppSettings>) => {
            const currentSaved = settingsQuery.data ?? {} as DeepPartial<AppSettings>;
            const merged = deepMerge(currentSaved as AppSettings, partialSettings);
            mutation.mutate(merged);
        },
        [settingsQuery.data, mutation]
    );

    return {
        settings,
        updateSettings,
    };
}