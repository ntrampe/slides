import { useMemo } from 'react';
import { useInfinitePhotos } from './usePhotos';
import type { Photo, PhotoFilterParams } from '../types';
import { shuffle } from '../utils/shuffle';

interface UseInfinitePhotosFlattenedParams extends PhotoFilterParams {
    pageSize?: number;
    shuffle?: boolean;
}

/**
 * Hook that fetches photos with infinite pagination and flattens them into a single array.
 * Optionally shuffles photos.
 * Useful for slideshows that want to automatically load more photos as needed.
 */
export function useInfinitePhotosFlattened(params: UseInfinitePhotosFlattenedParams = {}) {
    const query = useInfinitePhotos(params);

    // Flatten all pages of photos into a single array
    const flattenedPhotos = useMemo<Photo[]>(() => {
        if (!query.data) return [];
        return query.data.pages.flatMap(page => page.photos);
    }, [query.data]);

    const orderedPhotos = useMemo(() => params.shuffle ? shuffle(flattenedPhotos) : flattenedPhotos, [flattenedPhotos, params.shuffle])

    return {
        ...query,
        photos: orderedPhotos,
        queryKey: orderedPhotos,
        totalFetched: orderedPhotos.length,
    };
}
