import { useCallback } from 'react';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { useControls } from '../../../shared/hooks';
import { useSlideshowData } from './useSlideshowData';
import { useSlideshowTimer } from './useSlideshowTimer';
import { useSlideshowKeyboard } from './useSlideshowKeyboard';
import { useSlideshowTransition } from './useSlideshowTransition';
import type { UseSlideshowReturn } from './types';

export function useSlideshow(): UseSlideshowReturn {
    const { settings } = useSettingsData();
    const { areControlsVisible } = useControls();

    // Data layer: photos, pooling, navigation
    const data = useSlideshowData({
        ...(settings.slideshow.filter.albumIds?.length && { albumIds: settings.slideshow.filter.albumIds }),
        ...(settings.slideshow.filter.personIds?.length && { personIds: settings.slideshow.filter.personIds }),
        pageSize: 1000,
        shuffle: settings.slideshow.shuffle,
        preloadForward: 5,
        preloadBackward: 2,
    });

    // Get next photo for split view
    const nextLoaded = data.getPhotoAt(data.currentIndex + 1);

    // Transition layer: handles photo transitions with configurable effects
    const transition = useSlideshowTransition({
        currentPhoto: data.currentLoaded?.photo,
        nextPhoto: nextLoaded?.photo,
        transitionSettings: settings.slideshow.transition,
    });

    // Timer layer: autoplay, progress tracking (paused during transitions)
    const timer = useSlideshowTimer({
        onAdvance: data.goToNext,
        currentIndex: data.currentIndex,
        isCurrentPhotoLoaded: !!data.currentLoaded,
        isTransitioning: transition.isTransitioning,
    });

    // Coordination: reset timer when manually navigating
    const handlePrevious = useCallback(() => {
        data.goToPrevious();
        timer.reset();
    }, [data, timer]);

    const handleNext = useCallback(() => {
        data.goToNext();
        timer.reset();
    }, [data, timer]);

    // Keyboard navigation
    useSlideshowKeyboard({
        onPrevious: handlePrevious,
        onNext: handleNext,
        onTogglePlayPause: timer.togglePlayPause,
        onReset: timer.reset,
    });

    // Layout calculation based on settings
    const layoutClass = settings.slideshow.layout === 'split' ? 'grid-cols-2 gap-2' : 'grid-cols-1';

    return {
        state: {
            currentPhoto: data.currentLoaded?.photo,
            nextPhoto: nextLoaded?.photo,
            displayedPhoto: transition.displayedPhoto,
            displayedNextPhoto: transition.displayedNextPhoto,
            currentIndex: data.currentIndex,
            count: data.count,
            isLoading: data.isLoading,
            isError: data.isError,
            isPlaying: timer.isPlaying,
            progress: timer.progress,
            areControlsVisible,
            isTransitioning: transition.isTransitioning,
            transitionStyles: transition.transitionStyles,
            layoutClass,
            objectFit: settings.photo.fit,
        },
        actions: {
            goToPrevious: handlePrevious,
            goToNext: handleNext,
            togglePlayPause: timer.togglePlayPause,
        },
        debug: settings.debug.showDebugStats
            ? {
                currentIndex: data.currentIndex,
                count: data.count,
                isPlaying: timer.isPlaying,
                progress: timer.progress,
                poolStats: data.poolStats,
                totalPhotos: data.totalPhotos,
                hasNextPage: data.hasNextPage,
                isFetchingNextPage: data.isFetchingNextPage,
            }
            : undefined,
    };
}
