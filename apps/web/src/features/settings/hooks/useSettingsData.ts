import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type {
    AppSettings,
    ConfigurationSettings,
    PlaybackSettings,
    QuerySettings,
} from '@slides/api-contract';
import { FALLBACK_APP_SETTINGS } from '@slides/shared/constants';
import {
    clearAllSettings,
    fetchSettings,
    patchConfigurationSettings,
    patchPlaybackSettings,
    patchQuerySettings,
} from '../../../api/settings.js';

export interface UseSettingsDataReturn {
    settings: AppSettings;
    updateQuerySettings: (query: Partial<QuerySettings>) => void;
    updatePlaybackSettings: (playback: Partial<PlaybackSettings>) => void;
    updateConfigurationSettings: (configuration: Partial<ConfigurationSettings>) => void;
    clearSettings: () => void;
}

export function useSettingsData(): UseSettingsDataReturn {
    const queryClient = useQueryClient();

    const search =
        typeof window !== 'undefined' ? window.location.search : '';

    const settingsQuery = useQuery({
        queryKey: ['settings', search],
        queryFn: () => fetchSettings(search),
        placeholderData: FALLBACK_APP_SETTINGS,
        retry: 1,
        staleTime: Infinity,
    });

    const settings = settingsQuery.data ?? FALLBACK_APP_SETTINGS;

    const queryMutation = useMutation({
        mutationFn: (query: Partial<QuerySettings>) => patchQuerySettings(query),
        onSuccess: (effective) => {
            queryClient.setQueryData(['settings', search], effective);
            void queryClient.invalidateQueries({ queryKey: ['slideshow-photos'] });
        },
    });

    const playbackMutation = useMutation({
        mutationFn: (playback: Partial<PlaybackSettings>) => patchPlaybackSettings(playback),
        onSuccess: (effective) => {
            queryClient.setQueryData(['settings', search], effective);
        },
    });

    const configurationMutation = useMutation({
        mutationFn: (configuration: Partial<ConfigurationSettings>) =>
            patchConfigurationSettings(configuration),
        onSuccess: (effective) => {
            queryClient.setQueryData(['settings', search], effective);
            void queryClient.invalidateQueries({ queryKey: ['weather'] });
        },
    });

    const updateQuerySettings = useCallback(
        (query: Partial<QuerySettings>) => {
            queryMutation.mutate(query);
        },
        [queryMutation]
    );

    const updatePlaybackSettings = useCallback(
        (playback: Partial<PlaybackSettings>) => {
            playbackMutation.mutate(playback);
        },
        [playbackMutation]
    );

    const updateConfigurationSettings = useCallback(
        (configuration: Partial<ConfigurationSettings>) => {
            configurationMutation.mutate(configuration);
        },
        [configurationMutation]
    );

    const clearMutation = useMutation({
        mutationFn: () => clearAllSettings(),
        onSuccess: async () => {
            const effective = await fetchSettings(search);
            queryClient.setQueryData(['settings', search], effective);
            void queryClient.invalidateQueries({ queryKey: ['slideshow-photos'] });
            void queryClient.invalidateQueries({ queryKey: ['weather'] });
        },
    });

    const clearSettings = useCallback(() => {
        clearMutation.mutate();
    }, [clearMutation]);

    return {
        settings,
        updateQuerySettings,
        updatePlaybackSettings,
        updateConfigurationSettings,
        clearSettings,
    };
}
