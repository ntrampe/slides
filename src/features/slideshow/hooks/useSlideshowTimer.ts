import { useState, useEffect, useCallback } from 'react';

export function useSlideshowTimer(interval: number, onAdvance: () => void) {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlayPause = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    const reset = useCallback(() => {
        setProgress(0);
    }, []);

    useEffect(() => {
        if (!isPlaying) {
            setProgress(0);
            return;
        }

        // Reset progress when timer starts
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
    }, [interval, isPlaying, onAdvance]);

    return {
        progress,
        isPlaying,
        togglePlayPause,
        reset,
    };
}