import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { AppSettings } from '@slides/api-contract';
import { FALLBACK_APP_SETTINGS } from '@slides/shared/constants';
import { deepMerge, type DeepPartial } from '@slides/shared/utils/deepMerge';
import {
    clearSettingsOverrides,
    fetchSettingsResolved,
    loadSettingsOverrides,
    saveSettingsOverrides,
} from '../../../api/settings.js';

export interface UseSettingsDataReturn {
    settings: AppSettings;
    updateSettings: (partialSettings: DeepPartial<AppSettings>) => void;
    clearSettings: () => void;
}

export function useSettingsData(): UseSettingsDataReturn {
    const queryClient = useQueryClient();

    const search =
        typeof window !== 'undefined' ? window.location.search : '';

    const resolvedQuery = useQuery({
        queryKey: ['settings-resolved', search],
        queryFn: () => fetchSettingsResolved(search),
        placeholderData: FALLBACK_APP_SETTINGS,
        retry: 1,
        refetchInterval: 3000,
        refetchIntervalInBackground: true,
    });

    const overridesQuery = useQuery({
        queryKey: ['settings-overrides'],
        queryFn: () => loadSettingsOverrides(),
    });

    const settings = resolvedQuery.data ?? FALLBACK_APP_SETTINGS;

    const mutation = useMutation({
        mutationFn: (newSettings: DeepPartial<AppSettings>) =>
            saveSettingsOverrides(newSettings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings-overrides'] });
            queryClient.invalidateQueries({ queryKey: ['settings-resolved'] });
            queryClient.invalidateQueries({ queryKey: ['slideshow'] });
            queryClient.invalidateQueries({ queryKey: ['weather'] });
        },
    });

    const updateSettings = useCallback(
        (partialSettings: DeepPartial<AppSettings>) => {
            const currentSaved = overridesQuery.data ?? {};
            const merged = deepMerge(currentSaved as AppSettings, partialSettings);
            mutation.mutate(merged);
        },
        [overridesQuery.data, mutation]
    );

    const clearMutation = useMutation({
        mutationFn: () => clearSettingsOverrides(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings-overrides'] });
            queryClient.invalidateQueries({ queryKey: ['settings-resolved'] });
            queryClient.invalidateQueries({ queryKey: ['slideshow'] });
            queryClient.invalidateQueries({ queryKey: ['weather'] });
        },
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
