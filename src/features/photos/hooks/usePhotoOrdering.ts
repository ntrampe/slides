import { useMemo, useRef } from 'react';
import { shuffle } from '../utils/shuffle';
import type { Photo } from '../types';

interface UsePhotoOrderingOptions {
    photos: Photo[];
    shuffle: boolean;
    queryKey: string;
}

/**
 * Hook that handles photo ordering with stable shuffle.
 * When shuffle is enabled, maintains the same order across re-renders
 * and appends newly loaded photos (doesn't re-shuffle existing ones).
 */
export function usePhotoOrdering({ photos, shuffle: shouldShuffle, queryKey }: UsePhotoOrderingOptions): Photo[] {
    const orderRef = useRef<{ queryKey: string; orderedIds: string[] }>({
        queryKey: '',
        orderedIds: [],
    });

    return useMemo(() => {
        if (!shouldShuffle) {
            // Clear shuffle order when shuffle is disabled
            if (orderRef.current.orderedIds.length > 0) {
                orderRef.current = { queryKey: '', orderedIds: [] };
            }
            return photos;
        }

        const prevState = orderRef.current;

        // New query or re-enabling shuffle - full shuffle
        if (prevState.queryKey !== queryKey) {
            const shuffled = shuffle(photos);
            orderRef.current = {
                queryKey,
                orderedIds: shuffled.map(p => p.id),
            };
            return shuffled;
        }

        // Same query - check for new photos
        const currentIds = new Set(prevState.orderedIds);
        const newPhotos = photos.filter(p => !currentIds.has(p.id));

        // No new photos - reconstruct from existing order
        if (newPhotos.length === 0) {
            const photoMap = new Map(photos.map(p => [p.id, p]));
            return prevState.orderedIds
                .map(id => photoMap.get(id))
                .filter((p): p is Photo => p !== undefined);
        }

        // New photos - shuffle and append
        const shuffledNew = shuffle(newPhotos);
        const updatedOrder = [...prevState.orderedIds, ...shuffledNew.map(p => p.id)];
        orderRef.current = {
            queryKey,
            orderedIds: updatedOrder,
        };

        // Reconstruct full array
        const photoMap = new Map(photos.map(p => [p.id, p]));
        return updatedOrder
            .map(id => photoMap.get(id))
            .filter((p): p is Photo => p !== undefined);
    }, [photos, shouldShuffle, queryKey]);
}
