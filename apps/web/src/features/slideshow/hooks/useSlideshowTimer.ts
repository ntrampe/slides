import { useState, useEffect, useCallback } from 'react';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { UseSlideshowTimerReturn } from './types';
import { useVisibility } from '../../../context/VisibilityContext';

interface UseSlideshowTimerOptions {
    onAdvance: () => void;
    currentIndex: number;
    isEmpty: boolean;
    isLoading: boolean;
    isTransitioning?: boolean;
}

export function useSlideshowTimer({
    onAdvance,
    currentIndex,
    isEmpty,
    isLoading,
    isTransitioning = false,
}: UseSlideshowTimerOptions): UseSlideshowTimerReturn {
    const { settings } = useSettingsData();
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(settings.playback.autoplay);
    const { isVisible } = useVisibility();

    useEffect(() => {
        setIsPlaying(settings.playback.autoplay);
    }, [settings.playback.autoplay]);

    const interval = settings.playback.intervalMs;

    const reset = useCallback(() => {
        setProgress(0);
    }, []);

    const togglePlayPause = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    const setPlaying = useCallback((playing: boolean) => {
        setIsPlaying(playing);
    }, []);

    useEffect(() => {
        if (!isPlaying || isLoading || isEmpty || isTransitioning || !isVisible) {
            if (!isTransitioning) {
                setProgress(0);
            }
            return;
        }

        setProgress(0);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const increment = (100 / interval) * 100;
                return Math.min(prev + increment, 100);
            });
        }, 100);

        const timer = setInterval(() => {
            onAdvance();
        }, interval);

        return () => {
            clearInterval(timer);
            clearInterval(progressInterval);
        };
    }, [interval, isPlaying, onAdvance, currentIndex, isLoading, isEmpty, isTransitioning, isVisible]);

    return {
        isPlaying,
        progress,
        togglePlayPause,
        reset,
        setPlaying,
    };
}
