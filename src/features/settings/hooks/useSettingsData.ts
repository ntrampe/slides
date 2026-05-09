import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useServices } from '../../../shared/context/ServiceContext';
import type { AppSettings } from '../types';
import { FALLBACK_APP_SETTINGS } from '../../../shared/constants';
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
     * - Only USER overrides are persisted via SettingsOverridesRepo (/api/settings in live mode).
     * - Defaults (server or fallback) are NEVER persisted.
     * - The partial update is deep-merged with existing saved overrides,
     *   not with the fully computed settings object.
     *
     * This ensures persisted overrides remain minimal and only contain
     * explicit user customizations.
     */
    updateSettings: (partialSettings: DeepPartial<AppSettings>) => void;

    /**
     * Removes all persisted user overrides from the active SettingsOverridesRepo.
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
 * 2️⃣ Server defaults (/api/settings/defaults)
 *    - Fetched at runtime.
 *    - Overrides hardcoded fallback values.
 *
 * 3️⃣ URL overrides (query string)
 *    - Parsed on every reload.
 *    - Intended for temporary/session-based overrides.
 *    - Overrides server + fallback.
 *
 * 4️⃣ User overrides (SettingsOverridesRepo, /api/settings in live mode)
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
 * - Only user overrides are stored in the active SettingsOverridesRepo.
 * - The computed settings object is NEVER persisted.
 * - updateSettings() merges against SAVED overrides,
 *   not against computed settings.
 *
 * This prevents defaults from being unintentionally written
 * into storage and keeps persisted data minimal.
 */
export function useSettingsData(): UseSettingsDataReturn {
    const {
        settingsOverrides: settingsOverridesRepo,
        settingsDefaults: settingsDefaultsRepo,
    } = useServices();
    const queryClient = useQueryClient();

    /**
     * Fetch server-provided default configuration.
     *
     * - Cached for 5 minutes.
     * - If unavailable, FALLBACK_APP_SETTINGS is used.
     */
    const configQuery = useQuery({
        queryKey: ['settings-defaults'],
        queryFn: () => settingsDefaultsRepo.fetchDefaults(),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    /**
     * Load persisted user overrides from SettingsOverridesRepo.
     *
     * Note: These are partial settings, not full configuration.
     * Query polling keeps multiple clients synced when one client updates
     * shared server-backed overrides.
     */
    const settingsQuery = useQuery({
        queryKey: ['settings-overrides'],
        queryFn: () => settingsOverridesRepo.loadOverrides(),
        refetchInterval: 3000,
        refetchIntervalInBackground: true,
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
     * - Prevents defaults from leaking into persisted overrides.
     */
    const mutation = useMutation({
        mutationFn: (newSettings: DeepPartial<AppSettings>) =>
            settingsOverridesRepo.saveOverrides(newSettings as AppSettings),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['settings-overrides'] }),
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
        mutationFn: () => settingsOverridesRepo.clearOverrides(),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['settings-overrides'] }),
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