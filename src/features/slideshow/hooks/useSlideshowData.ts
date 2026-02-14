import { useEffect } from 'react';
import { useInfinitePhotosFlattened } from '../../photos';
import { usePhotoPool } from '../../photo-pool';
import type { SlideshowFilter } from '../../../shared/types/config';

interface UseSlideshowDataOptions extends SlideshowFilter {
    pageSize?: number;
    shuffle?: boolean;
    preloadForward?: number;
    preloadBackward?: number;
}

export function useSlideshowData({
    albumIds,
    personIds,
    pageSize = 1000,
    shuffle = false,
    preloadForward = 5,
    preloadBackward = 2,
}: UseSlideshowDataOptions) {
    // 1. Fetch photos with infinite pagination
    const {
        photos,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfinitePhotosFlattened({
        albumIds,
        personIds,
        pageSize,
    });

    // 2. Use photo pool for preloading
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
        shuffle,
        preloadForward,
        preloadBackward,
    });

    // 3. Auto-load more photos when getting close to the end
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

        // Loading states
        isLoading,
        isError,
        isFetchingNextPage,

        // Stats for debug
        poolStats,
        totalPhotos: photos.length,
        hasNextPage,
    };
}
