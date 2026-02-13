import { useState, useEffect } from 'react';
import type { Photo } from '../types';

export function useSlideshow(photos: Photo[], interval: number = 10000) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (photos.length === 0) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % photos.length);
        }, interval);
        return () => clearInterval(timer);
    }, [photos, interval]);

    // Preload the next image
    useEffect(() => {
        const nextIndex = (index + 1) % photos.length;
        if (photos[nextIndex]) {
            const img = new Image();
            img.src = photos[nextIndex].url;
        }
    }, [index, photos]);

    return { currentPhoto: photos[index], nextPhoto: photos[(index + 1) % photos.length] };
}