import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useServices } from '../../../shared/context/ServiceContext';
import type { AppSettings } from '../types';
import { FALLBACK_APP_SETTINGS } from '../constants';
import { deepMerge, type DeepPartial } from '../../../shared/utils/deepMerge';
import { parseUrlSettings } from '../utils/urlSettingsParser';

export interface UseSettingsDataReturn {
    /** Current settings (user overrides merged with defaults) */
    settings: AppSettings;
    /** 
     * Update and persist partial settings to localStorage.
     * Deep merges with existing saved settings (not defaults).
     * Only saves user overrides, keeps defaults un-persisted.
     */
    updateSettings: (partialSettings: DeepPartial<AppSettings>) => void;
    /** Clear all settings from localStorage, reverting to defaults */
    clearSettings: () => void;
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

    const defaults = configQuery.data ?? FALLBACK_APP_SETTINGS;
    const savedOverrides = (settingsQuery.data as DeepPartial<AppSettings>) ?? {};

    // Parse URL overrides every reload
    const urlOverrides = useMemo(() => {
        if (typeof window === 'undefined') return {};
        return parseUrlSettings(window.location.search, defaults);
    }, [defaults]);

    // Merge in deterministic order: fallback → server → URL → user
    const settings = useMemo(() => {
        let merged = deepMerge(defaults, configQuery.data ?? {});
        merged = deepMerge(merged, urlOverrides);
        merged = deepMerge(merged, savedOverrides);
        return merged;
    }, [defaults, configQuery.data, urlOverrides, savedOverrides]);

    const mutation = useMutation({
        mutationFn: (newSettings: DeepPartial<AppSettings>) =>
            settingsService.saveSettings(newSettings as AppSettings),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['settings'] }),
    });

    /**
     * Merges partial settings with SAVED settings (not computed settings).
     * This ensures localStorage only contains user overrides, not defaults.
     */
    const updateSettings = useCallback(
        (partialSettings: DeepPartial<AppSettings>) => {
            const currentSaved = (settingsQuery.data as DeepPartial<AppSettings>) ?? {};
            const merged = deepMerge(currentSaved as AppSettings, partialSettings);
            mutation.mutate(merged);
        },
        [settingsQuery.data, mutation]
    );

    const clearMutation = useMutation({
        mutationFn: () => settingsService.clearSettings(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
    });

    const clearSettings = useCallback(() => {
        clearMutation.mutate();
    }, [clearMutation]);

    return {
        settings,
        updateSettings,
        clearSettings
    };
}