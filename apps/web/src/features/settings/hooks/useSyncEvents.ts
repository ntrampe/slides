import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE } from '../../../api/http.js';

export function useSyncEvents(): void {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return;
        }

        const source = new EventSource(`${API_BASE}/events`);
        const search =
            typeof window !== 'undefined' ? window.location.search : '';

        const invalidateSettings = () => {
            void queryClient.invalidateQueries({ queryKey: ['settings', search] });
        };

        source.addEventListener('query_updated', () => {
            void queryClient.invalidateQueries({ queryKey: ['slideshow-photos'] });
            invalidateSettings();
        });

        source.addEventListener('playback_updated', () => {
            invalidateSettings();
        });

        source.addEventListener('display_updated', () => {
            invalidateSettings();
            void queryClient.invalidateQueries({ queryKey: ['weather'] });
        });

        source.addEventListener('settings_cleared', () => {
            void queryClient.invalidateQueries({ queryKey: ['slideshow-photos'] });
            void queryClient.invalidateQueries({ queryKey: ['weather'] });
            invalidateSettings();
        });

        return () => {
            source.close();
        };
    }, [queryClient]);
}
