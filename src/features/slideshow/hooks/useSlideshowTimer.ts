import { useState, useEffect, useCallback } from 'react';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { UseSlideshowTimerReturn } from './types';
import { useVisibility } from '../../../shared/context/VisibilityContext';

interface UseSlideshowTimerOptions {
    onAdvance: () => void;
    currentIndex: number;
    isCurrentPhotoLoaded: boolean;
    isTransitioning?: boolean;
}

export function useSlideshowTimer({
    onAdvance,
    currentIndex,
    isCurrentPhotoLoaded,
    isTransitioning = false,
}: UseSlideshowTimerOptions): UseSlideshowTimerReturn {
    const { settings, updateSettings } = useSettingsData();
    const [progress, setProgress] = useState(0);
    const { isVisible } = useVisibility();

    // Get playing state and interval from settings
    const isPlaying = settings.slideshow.autoplay;
    const interval = settings.slideshow.intervalMs;

    // Reset progress manually when navigating
    const reset = useCallback(() => {
        setProgress(0);
    }, []);

    // Toggle play/pause by updating settings
    const togglePlayPause = useCallback(() => {
        updateSettings({
            slideshow: { autoplay: !settings.slideshow.autoplay },
        });
    }, [settings.slideshow.autoplay, updateSettings]);

    // Timer effect: handles progress tracking and auto-advance
    useEffect(() => {
        // Don't run timer if paused, if current photo isn't loaded yet, or during transitions, or is we aren't visible.
        if (!isPlaying || !isCurrentPhotoLoaded || isTransitioning || !isVisible) {
            // Only reset progress if not transitioning (preserve progress during transitions)
            if (!isTransitioning) {
                setProgress(0);
            }
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

        // Auto-advance after interval
        const timer = setInterval(() => {
            onAdvance();
        }, interval);

        return () => {
            clearInterval(timer);
            clearInterval(progressInterval);
        };
    }, [interval, isPlaying, onAdvance, currentIndex, isCurrentPhotoLoaded, isTransitioning, isVisible]);

    return {
        isPlaying,
        progress,
        togglePlayPause,
        reset,
    };
}
