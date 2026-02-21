import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useServices } from '../../../shared/context/ServiceContext';
import type { AppSettings } from '../types';
import { FALLBACK_APP_SETTINGS } from '../constants';
import { deepMerge, type DeepPartial } from '../../../shared/utils/deepMerge';
import { parseUrlSettings } from '../utils/urlSettingsParser';

export interface UseSettingsDataReturn {
    /**
     * Fully resolved settings object.
     *
     * This is the final computed configuration after merging all sources
     * according to the defined precedence chain (see useSettingsData docs).
     */
    settings: AppSettings;

    /**
     * Update and persist partial user settings.
     *
     * Important behavior:
     * - Only USER overrides are stored in localStorage.
     * - Defaults (server or fallback) are NEVER persisted.
     * - The partial update is deep-merged with existing saved overrides,
     *   not with the fully computed settings object.
     *
     * This ensures localStorage remains minimal and only contains
     * explicit user customizations.
     */
    updateSettings: (partialSettings: DeepPartial<AppSettings>) => void;

    /**
     * Removes all persisted user overrides from localStorage.
     *
     * After clearing:
     * - User overrides are removed.
     * - Effective settings fall back to:
     *     URL overrides (if present)
     *     → Server defaults (if available)
     *     → Hardcoded fallback defaults.
     */
    clearSettings: () => void;
}

/**
 * React hook providing resolved application settings with a deterministic
 * multi-layer fallback chain.
 *
 * ------------------------------------------------------------------------
 * SETTINGS RESOLUTION ORDER (LOWEST → HIGHEST PRECEDENCE)
 * ------------------------------------------------------------------------
 *
 * 1️⃣ FALLBACK_APP_SETTINGS (hardcoded defaults)
 *    - Guaranteed baseline configuration.
 *    - Used if server config is unavailable.
 *
 * 2️⃣ Server defaults (/api/config)
 *    - Fetched at runtime.
 *    - Overrides hardcoded fallback values.
 *
 * 3️⃣ URL overrides (query string)
 *    - Parsed on every reload.
 *    - Intended for temporary/session-based overrides.
 *    - Overrides server + fallback.
 *
 * 4️⃣ User overrides (localStorage)
 *    - Persisted user customizations.
 *    - Highest precedence.
 *    - Always win over URL + server + fallback.
 *
 * ------------------------------------------------------------------------
 * MERGE STRATEGY
 * ------------------------------------------------------------------------
 *
 * Merging is done via deepMerge in this exact order:
 *
 *     fallback → server → URL → user
 *
 * Each subsequent layer overrides the previous one.
 *
 * Final resolved settings = deepMerge(
 *     deepMerge(
 *         deepMerge(fallback, server),
 *         url
 *     ),
 *     user
 * )
 *
 * ------------------------------------------------------------------------
 * PERSISTENCE RULES
 * ------------------------------------------------------------------------
 *
 * - Only user overrides are stored in localStorage.
 * - The computed settings object is NEVER persisted.
 * - updateSettings() merges against SAVED overrides,
 *   not against computed settings.
 *
 * This prevents defaults from being unintentionally written
 * into storage and keeps persisted data minimal.
 */
export function useSettingsData(): UseSettingsDataReturn {
    const { settings: settingsService, config: configService } = useServices();
    const queryClient = useQueryClient();

    /**
     * Fetch server-provided default configuration.
     *
     * - Cached for 5 minutes.
     * - If unavailable, FALLBACK_APP_SETTINGS is used.
     */
    const configQuery = useQuery({
        queryKey: ['config'],
        queryFn: () => configService.fetchDefaultConfig(),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    /**
     * Load persisted user overrides from localStorage.
     *
     * Note: These are partial settings, not full configuration.
     */
    const settingsQuery = useQuery({
        queryKey: ['settings'],
        queryFn: () => settingsService.loadSettings(),
    });

    /**
     * Base defaults layer.
     *
     * If server config has loaded, use it.
     * Otherwise fall back to hardcoded defaults.
     */
    const defaults = configQuery.data ?? FALLBACK_APP_SETTINGS;

    /**
     * Persisted user overrides (highest precedence).
     */
    const savedOverrides =
        (settingsQuery.data as DeepPartial<AppSettings>) ?? {};

    /**
     * URL overrides are recalculated whenever defaults change.
     *
     * They are intentionally NOT persisted.
     * They sit between server defaults and user overrides.
     */
    const urlOverrides = useMemo(() => {
        if (typeof window === 'undefined') return {};
        return parseUrlSettings(window.location.search, defaults);
    }, [defaults]);

    /**
     * Final deterministic merge.
     *
     * Order:
     *   fallback → server → URL → user
     *
     * Later merges override earlier ones.
     */
    const settings = useMemo(() => {
        let merged = deepMerge(defaults, configQuery.data ?? {});
        merged = deepMerge(merged, urlOverrides);
        merged = deepMerge(merged, savedOverrides);
        return merged;
    }, [defaults, configQuery.data, urlOverrides, savedOverrides]);

    /**
     * Persists updated user overrides.
     *
     * IMPORTANT:
     * - Merges partial update with CURRENT SAVED overrides.
     * - Does NOT merge with computed settings.
     * - Prevents defaults from leaking into localStorage.
     */
    const mutation = useMutation({
        mutationFn: (newSettings: DeepPartial<AppSettings>) =>
            settingsService.saveSettings(newSettings as AppSettings),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['settings'] }),
    });

    const updateSettings = useCallback(
        (partialSettings: DeepPartial<AppSettings>) => {
            const currentSaved =
                (settingsQuery.data as DeepPartial<AppSettings>) ?? {};

            const merged = deepMerge(
                currentSaved as AppSettings,
                partialSettings
            );

            mutation.mutate(merged);
        },
        [settingsQuery.data, mutation]
    );

    /**
     * Clears all persisted user overrides.
     *
     * After clearing, effective settings recompute automatically
     * using URL → server → fallback layers.
     */
    const clearMutation = useMutation({
        mutationFn: () => settingsService.clearSettings(),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['settings'] }),
    });

    const clearSettings = useCallback(() => {
        clearMutation.mutate();
    }, [clearMutation]);

    return {
        settings,
        updateSettings,
        clearSettings,
    };
}