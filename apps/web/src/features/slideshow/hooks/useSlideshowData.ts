import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSlideshow } from '../../../api/slideshow.js';
import { usePhotoPool } from '../../photo-pool';
import { getSlideshowSeed } from '@slides/shared/utils/slideshowSeed';
import { AuthError, ClientError, NetworkError } from '@slides/shared/errors';
import type { UseSlideshowDataReturn } from './types.js';

interface UseSlideshowDataOptions {
    preloadForward?: number;
    preloadBackward?: number;
}

export function useSlideshowData({
    preloadForward = 5,
    preloadBackward = 2,
}: UseSlideshowDataOptions = {}): UseSlideshowDataReturn {
    const search =
        typeof window !== 'undefined' ? window.location.search : '';
    const seed = useMemo(() => getSlideshowSeed(), []);

    const slideshowQuery = useQuery({
        queryKey: ['slideshow', search, seed],
        queryFn: () => fetchSlideshow(search, seed),
        refetchInterval: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (error instanceof NetworkError) return false;
            if (error instanceof AuthError) return false;
            if (error instanceof ClientError) return false;
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    });

    const photos = useMemo(
        () => slideshowQuery.data?.photos ?? [],
        [slideshowQuery.data]
    );

    const resetKey = useMemo(
        () => `${search}:${seed}:${slideshowQuery.dataUpdatedAt}`,
        [search, seed, slideshowQuery.dataUpdatedAt]
    );

    const {
        current: currentLoaded,
        index: currentIndex,
        count,
        next: goToNext,
        previous: goToPrevious,
        jumpTo,
        getPhotoAt,
        poolStats,
    } = usePhotoPool(photos, {
        resetKey,
        preloadForward,
        preloadBackward,
    });

    return {
        currentLoaded,
        currentIndex,
        count,
        goToNext,
        goToPrevious,
        jumpTo,
        getPhotoAt,
        refetch: () => {
            void slideshowQuery.refetch();
        },
        isLoading: slideshowQuery.isLoading,
        isError: slideshowQuery.isError,
        error: slideshowQuery.error ?? undefined,
        isRefetching: slideshowQuery.isFetching && !slideshowQuery.isLoading,
        poolStats,
        totalPhotos: photos.length,
    };
}
