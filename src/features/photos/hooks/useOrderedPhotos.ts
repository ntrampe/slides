import { useMemo } from 'react';
import { usePhotos } from './usePhotos';
import { usePhotoOrdering } from './usePhotoOrdering';
import type { Photo, PhotoFilterParams } from '../types';

export interface UseOrderedPhotosParams extends PhotoFilterParams {
    shuffle?: boolean;
    /** Bumps shuffle / ordering when filters or slideshow reset identity change. */
    resetKey?: string;
}

/**
 * Fetches all photos matching filters once, then applies stable ordering and optional shuffle
 * for the slideshow photo pool.
 */
export function useOrderedPhotos(params: UseOrderedPhotosParams = {}) {
    const { shuffle = false, resetKey = '', ...filterParams } = params;
    const query = usePhotos(filterParams);

    const list = useMemo<Photo[]>(() => query.data ?? [], [query.data]);

    const orderedPhotos = usePhotoOrdering({
        photos: list,
        shuffle,
        queryKey: resetKey,
    });

    return {
        ...query,
        photos: orderedPhotos,
        totalFetched: orderedPhotos.length,
    };
}
