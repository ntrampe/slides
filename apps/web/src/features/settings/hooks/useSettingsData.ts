import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type {
    AppSettings,
    DisplaySettings,
    PlaybackSettings,
    QuerySettings,
} from '@slides/api-contract';
import { FALLBACK_APP_SETTINGS } from '@slides/shared/constants';
import {
    clearAllSettings,
    fetchSettings,
    patchDisplaySettings,
    patchPlaybackSettings,
    patchQuerySettings,
} from '../../../api/settings.js';

export interface UseSettingsDataReturn {
    settings: AppSettings;
    updateQuerySettings: (query: QuerySettings) => void;
    updatePlaybackSettings: (playback: PlaybackSettings) => void;
    updateDisplaySettings: (display: DisplaySettings) => void;
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
        mutationFn: (query: QuerySettings) => patchQuerySettings(query),
        onSuccess: (effective) => {
            queryClient.setQueryData(['settings', search], effective);
            void queryClient.invalidateQueries({ queryKey: ['slideshow-photos'] });
        },
    });

    const playbackMutation = useMutation({
        mutationFn: (playback: PlaybackSettings) => patchPlaybackSettings(playback),
        onSuccess: (effective) => {
            queryClient.setQueryData(['settings', search], effective);
        },
    });

    const displayMutation = useMutation({
        mutationFn: (display: DisplaySettings) => patchDisplaySettings(display),
        onSuccess: (effective) => {
            queryClient.setQueryData(['settings', search], effective);
            void queryClient.invalidateQueries({ queryKey: ['weather'] });
        },
    });

    const updateQuerySettings = useCallback(
        (query: QuerySettings) => {
            queryMutation.mutate(query);
        },
        [queryMutation]
    );

    const updatePlaybackSettings = useCallback(
        (playback: PlaybackSettings) => {
            playbackMutation.mutate(playback);
        },
        [playbackMutation]
    );

    const updateDisplaySettings = useCallback(
        (display: DisplaySettings) => {
            displayMutation.mutate(display);
        },
        [displayMutation]
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
        updateDisplaySettings,
        clearSettings,
    };
}
