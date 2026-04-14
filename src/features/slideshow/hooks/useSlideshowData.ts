import { useEffect, useMemo } from 'react';
import { useInfinitePhotosFlattened, type PhotoFilterParams } from '../../photos';
import { usePhotoPool } from '../../photo-pool';
import type { UseSlideshowDataReturn } from './types';

interface UseSlideshowDataOptions extends PhotoFilterParams {
    pageSize?: number;
    shuffle?: boolean;
    preloadForward?: number;
    preloadBackward?: number;
}

export function useSlideshowData({
    albumIds,
    personIds,
    location,
    startDate,
    endDate,
    pageSize = 1000,
    shuffle = false,
    preloadForward = 5,
    preloadBackward = 2,
}: UseSlideshowDataOptions): UseSlideshowDataReturn {
    // 1. Create resetKey for photo pool / shuffling - resets when filter params change
    const resetKey = useMemo(
        () => JSON.stringify({
            albumIds,
            personIds,
            location,
            startDate,
            endDate,
        }),
        [albumIds, personIds, location, startDate, endDate]
    );

    // 2. Fetch photos with infinite pagination and shuffling
    const {
        photos,
        isLoading,
        isError,
        error,
        fetchNextPage,
        refetch,
        hasNextPage,
        isFetchingNextPage,
    } = useInfinitePhotosFlattened({
        albumIds,
        personIds,
        location,
        startDate,
        endDate,
        pageSize,
        shuffle,
        resetKey,
    });

    // 3. Use photo pool for preloading
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

    // 4. Auto-load more photos when getting close to the end
    useEffect(() => {
        const photosRemaining = photos.length - currentIndex;
        if (photosRemaining <= 10 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [currentIndex, photos.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return {
        // Current state
        currentLoaded,
        currentIndex,
        count,

        // Navigation
        goToNext,
        goToPrevious,
        jumpTo,
        getPhotoAt,
        refetch: refetch,

        // Loading states
        isLoading,
        isError,
        error: error || undefined,
        isFetchingNextPage,

        // Stats for debug
        poolStats,
        totalPhotos: photos.length,
        hasNextPage,
    };
}