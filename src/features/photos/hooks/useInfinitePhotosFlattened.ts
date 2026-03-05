import { useMemo } from 'react';
import { useInfinitePhotos } from './usePhotos';
import type { Photo, PhotoFilterParams } from '../types';

interface UseInfinitePhotosFlattenedParams extends PhotoFilterParams {
    pageSize?: number;
}

/**
 * Hook that fetches photos with infinite pagination and flattens them into a single array.
 * Useful for slideshows that want to automatically load more photos as needed.
 */
export function useInfinitePhotosFlattened(params: UseInfinitePhotosFlattenedParams = {}) {
    const query = useInfinitePhotos(params);

    // Flatten all pages of photos into a single array
    const allPhotos = useMemo<Photo[]>(() => {
        if (!query.data) return [];
        return query.data.pages.flatMap(page => page.photos);
    }, [query.data]);

    return {
        ...query,
        photos: allPhotos,
        totalFetched: allPhotos.length,
    };
}
