import { useMemo } from 'react';
import { useInfinitePhotos } from './usePhotos';
import { usePhotoOrdering } from './usePhotoOrdering';
import type { Photo, PhotoFilterParams } from '../types';

interface UseInfinitePhotosFlattenedParams extends PhotoFilterParams {
    pageSize?: number;
    shuffle?: boolean;
    resetKey?: string;
}

/**
 * Hook that fetches photos with infinite pagination and flattens them into a single array.
 * Optionally shuffles photos while maintaining stable order across pagination.
 * Useful for slideshows that want to automatically load more photos as needed.
 */
export function useInfinitePhotosFlattened(params: UseInfinitePhotosFlattenedParams = {}) {
    const query = useInfinitePhotos(params);

    // Flatten all pages of photos into a single array
    const flattenedPhotos = useMemo<Photo[]>(() => {
        if (!query.data) return [];
        return query.data.pages.flatMap(page => page.photos);
    }, [query.data]);

    // Apply ordering (handles shuffle logic)
    const orderedPhotos = usePhotoOrdering({
        photos: flattenedPhotos,
        shuffle: params.shuffle ?? false,
        queryKey: params.resetKey ?? ''
    });

    return {
        ...query,
        photos: orderedPhotos,
        totalFetched: orderedPhotos.length,
    };
}
