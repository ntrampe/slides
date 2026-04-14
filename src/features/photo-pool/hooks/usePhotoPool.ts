import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "../../photos";
import { preloadImage } from "../utils/preloadImage";
import type { LoadedPhoto, PhotoPoolOptions } from "../types";

export function usePhotoPool(
    photos: Photo[],
    options: PhotoPoolOptions = {}
) {
    const {
        resetKey,
        preloadForward = 5,
        preloadBackward = 2,
    } = options;

    const [index, setIndex] = useState(0);
    const poolRef = useRef<Map<string, LoadedPhoto>>(new Map());
    const [, forceRender] = useState(0); // minimal state signal

    // Reset index and pool when resetKey changes (new query)
    useEffect(() => {
        setIndex(0);
        poolRef.current.clear();
    }, [resetKey]);

    const windowStart = Math.max(0, index - preloadBackward);
    const windowEnd = Math.min(
        photos.length - 1,
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
            const pos = photos.findIndex((p) => p.id === id);
            if (pos < windowStart || pos > windowEnd) {
                poolRef.current.delete(id);
            }
        }
    }, [photos, windowStart, windowEnd]);

    useEffect(() => {
        for (let i = windowStart; i <= windowEnd; i++) {
            const photo = photos[i];
            if (photo) {
                loadPhoto(photo);
            }
        }

        evictOutsideWindow();
    }, [windowStart, windowEnd, photos, loadPhoto, evictOutsideWindow]);

    const current = photos[index];
    const currentLoaded = current
        ? poolRef.current.get(current.id)
        : undefined;

    const next = useCallback(() => {
        if (photos.length === 0) return;
        setIndex((i) => (i + 1) % photos.length);
    }, [photos.length]);

    const previous = useCallback(() => {
        if (photos.length === 0) return;
        setIndex((i) => (i - 1 + photos.length) % photos.length);
    }, [photos.length]);

    const jumpTo = useCallback((i: number) => {
        if (photos.length === 0) return;
        setIndex(Math.max(0, Math.min(i, photos.length - 1)));
    }, [photos.length]);

    const getPhotoAt = useCallback((targetIndex: number): LoadedPhoto | undefined => {
        const photo = photos[targetIndex];
        if (!photo) return undefined;
        return poolRef.current.get(photo.id);
    }, [photos]);

    const poolStats = useMemo(() => ({
        loadedCount: poolRef.current.size,
        windowStart,
        windowEnd,
        windowSize: windowEnd - windowStart + 1,
    }), [windowStart, windowEnd, poolRef.current.size]);

    return {
        current: currentLoaded,
        index,
        count: photos.length,
        next,
        previous,
        jumpTo,
        getPhotoAt,
        poolStats,
    };
}