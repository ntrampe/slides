import { useMemo } from 'react';
import { useOrderedPhotos, type PhotoFilterParams } from '../../photos';
import { usePhotoPool } from '../../photo-pool';
import type { UseSlideshowDataReturn } from './types';

interface UseSlideshowDataOptions extends PhotoFilterParams {
    shuffle?: boolean;
    preloadForward?: number;
    preloadBackward?: number;
}

export function useSlideshowData({
    albumIds,
    excludeAlbumIds,
    albumOperator,
    personIds,
    excludePersonIds,
    personOperator,
    location,
    startDate,
    endDate,
    globalOperator,
    shuffle = false,
    preloadForward = 5,
    preloadBackward = 2,
}: UseSlideshowDataOptions): UseSlideshowDataReturn {
    // 1. Create resetKey for photo pool / shuffling - resets when filter params change
    const resetKey = useMemo(
        () => JSON.stringify({
            albumIds,
            excludeAlbumIds,
            albumOperator,
            personIds,
            excludePersonIds,
            personOperator,
            location,
            startDate,
            endDate,
            globalOperator,
        }),
        [albumIds, excludeAlbumIds, albumOperator, personIds, excludePersonIds, personOperator, location, startDate, endDate, globalOperator]
    );

    // 2. Fetch all matching photo metadata once; photo pool windows asset requests.
    const {
        photos,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useOrderedPhotos({
        albumIds,
        excludeAlbumIds,
        albumOperator,
        personIds,
        excludePersonIds,
        personOperator,
        location,
        startDate,
        endDate,
        globalOperator,
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
        isFetchingNextPage: isFetching && !isLoading,

        // Stats for debug
        poolStats,
        totalPhotos: photos.length,
        hasNextPage: false,
    };
}