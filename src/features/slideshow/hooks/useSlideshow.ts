import { useState, useEffect, useCallback } from 'react';
import type { Photo } from '../../photos';

export function useSlideshow(photos: Photo[], interval: number = 10000) {
    const [index, setIndex] = useState(0);

    const goToNext = useCallback(() => {
        setIndex((prev) => (prev + 1) % photos.length);
    }, [photos.length]);

    const goToPrevious = useCallback(() => {
        setIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }, [photos.length]);

    // Auto-advance timer - resets when index changes
    useEffect(() => {
        if (photos.length === 0) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % photos.length);
        }, interval);
        return () => clearInterval(timer);
    }, [photos.length, interval, index]);

    // Preload the next image
    useEffect(() => {
        const nextIndex = (index + 1) % photos.length;
        if (photos[nextIndex]) {
            const img = new Image();
            img.src = photos[nextIndex].url;
        }
    }, [index, photos]);

    return {
        currentPhoto: photos[index],
        nextPhoto: photos[(index + 1) % photos.length],
        currentIndex: index,
        goToNext,
        goToPrevious
    };
}