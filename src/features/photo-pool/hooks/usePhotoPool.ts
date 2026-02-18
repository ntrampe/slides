import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "../../photos";
import { preloadImage } from "../utils/preloadImage";
import { shuffle } from "../utils/shuffle";
import type { LoadedPhoto, PhotoPoolOptions } from "../types";

export function usePhotoPool(
    photos: Photo[],
    options: PhotoPoolOptions = {}
) {
    const {
        shuffle: shouldShuffle = false,
        preloadForward = 5,
        preloadBackward = 2,
    } = options;

    const orderedPhotos = useMemo(() => {
        return shouldShuffle ? shuffle(photos) : photos;
    }, [photos, shouldShuffle]);

    const [index, setIndex] = useState(0);
    const poolRef = useRef<Map<string, LoadedPhoto>>(new Map());
    const [, forceRender] = useState(0); // minimal state signal

    // Reset index when photos array changes (filters, new data, etc.)
    useEffect(() => {
        setIndex(0);
        poolRef.current.clear();
    }, [orderedPhotos]);

    const windowStart = Math.max(0, index - preloadBackward);
    const windowEnd = Math.min(
        orderedPhotos.length - 1,
        index + preloadForward
    );

    const loadPhoto = useCallback(async (photo: Photo) => {
        if (poolRef.current.has(photo.id)) return;

        try {
            const image = await preloadImage(photo.url);
            poolRef.current.set(photo.id, { photo, image });
            forceRender((n) => n + 1);
        } catch {
            // swallow errors for now (bad image, network, etc.)
        }
    }, []);

    const evictOutsideWindow = useCallback(() => {
        for (const [id, _loaded] of poolRef.current.entries()) {
            const pos = orderedPhotos.findIndex((p) => p.id === id);
            if (pos < windowStart || pos > windowEnd) {
                poolRef.current.delete(id);
            }
        }
    }, [orderedPhotos, windowStart, windowEnd]);

    useEffect(() => {
        for (let i = windowStart; i <= windowEnd; i++) {
            const photo = orderedPhotos[i];
            if (photo) {
                loadPhoto(photo);
            }
        }

        evictOutsideWindow();
    }, [windowStart, windowEnd, orderedPhotos, loadPhoto, evictOutsideWindow]);

    const current = orderedPhotos[index];
    const currentLoaded = current
        ? poolRef.current.get(current.id)
        : undefined;

    const next = useCallback(() => {
        setIndex((i) => (i + 1) % orderedPhotos.length);
    }, [orderedPhotos.length]);

    const previous = useCallback(() => {
        setIndex((i) => (i - 1 + orderedPhotos.length) % orderedPhotos.length);
    }, [orderedPhotos.length]);

    const jumpTo = useCallback((i: number) => {
        setIndex(Math.max(0, Math.min(i, orderedPhotos.length - 1)));
    }, [orderedPhotos.length]);

    const getPhotoAt = useCallback((targetIndex: number): LoadedPhoto | undefined => {
        const photo = orderedPhotos[targetIndex];
        if (!photo) return undefined;
        return poolRef.current.get(photo.id);
    }, [orderedPhotos]);

    const poolStats = useMemo(() => ({
        loadedCount: poolRef.current.size,
        windowStart,
        windowEnd,
        windowSize: windowEnd - windowStart + 1,
    }), [windowStart, windowEnd, poolRef.current.size]);

    return {
        current: currentLoaded,
        index,
        count: orderedPhotos.length,
        next,
        previous,
        jumpTo,
        getPhotoAt,
        poolStats,
    };
}