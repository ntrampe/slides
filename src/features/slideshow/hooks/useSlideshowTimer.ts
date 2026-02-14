import { useState, useEffect, useCallback } from 'react';

interface UseSlideshowTimerOptions {
    interval: number;
    onAdvance: () => void;
    currentIndex: number; // Add this to detect when photo changes
    isCurrentPhotoLoaded: boolean; // Add this to pause while loading
}

export function useSlideshowTimer({
    interval,
    onAdvance,
    currentIndex,
    isCurrentPhotoLoaded
}: UseSlideshowTimerOptions) {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlayPause = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    const reset = useCallback(() => {
        setProgress(0);
    }, []);

    useEffect(() => {
        // Don't run timer if paused or if current photo isn't loaded yet
        if (!isPlaying || !isCurrentPhotoLoaded) {
            setProgress(0);
            return;
        }

        // Reset progress when timer starts or when index changes
        setProgress(0);

        // Update progress every 100ms for smooth animation
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const increment = (100 / interval) * 100;
                return Math.min(prev + increment, 100);
            });
        }, 100);

        // Auto-advance
        const timer = setInterval(() => {
            onAdvance();
        }, interval);

        return () => {
            clearInterval(timer);
            clearInterval(progressInterval);
        };
    }, [interval, isPlaying, onAdvance, currentIndex, isCurrentPhotoLoaded]); // Add dependencies

    return {
        progress,
        isPlaying,
        togglePlayPause,
        reset,
    };
}