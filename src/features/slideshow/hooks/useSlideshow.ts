import { useCallback, useMemo } from 'react';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { useControls } from '../../../shared/hooks';
import { useSlideshowData } from './useSlideshowData';
import { useSlideshowTimer } from './useSlideshowTimer';
import { useSlideshowKeyboard } from './useSlideshowKeyboard';
import { useSlideshowTransition } from './useSlideshowTransition';
import type { UseSlideshowReturn } from './types';
import type { Photo } from '../../photos';

export function useSlideshow(): UseSlideshowReturn {
    const { settings } = useSettingsData();
    const { areControlsVisible } = useControls();

    // Data layer: photos, pooling, navigation
    const data = useSlideshowData({
        ...(settings.slideshow.filter.albumIds?.length && { albumIds: settings.slideshow.filter.albumIds }),
        ...(settings.slideshow.filter.personIds?.length && { personIds: settings.slideshow.filter.personIds }),
        ...(settings.slideshow.filter.location && { location: settings.slideshow.filter.location }),
        pageSize: 1000,
        shuffle: settings.slideshow.shuffle,
        preloadForward: 5,
        preloadBackward: 2,
    });

    // Get next photo for split view
    const nextLoaded = data.getPhotoAt(data.currentIndex + 1);

    // Layout calculation with auto-portrait logic
    const shouldUseSplitLayout = useMemo(() => {
        if (settings.slideshow.layout === 'single') {
            return false;
        }

        if (settings.slideshow.layout === 'split') {
            // Auto-enable split for portrait pairs
            return areBothPortrait(data.currentLoaded?.photo, nextLoaded?.photo);
        }

        return false;
    }, [
        settings.slideshow.layout,
        data.currentLoaded?.photo,
        nextLoaded?.photo
    ]);

    // Layout calculation based on settings
    const layoutClass = shouldUseSplitLayout ? 'grid-cols-2 gap-2' : 'grid-cols-1';

    // Transition layer: handles photo transitions with configurable effects
    const transition = useSlideshowTransition({
        currentPhoto: data.currentLoaded?.photo,
        nextPhoto: nextLoaded?.photo,
        transitionSettings: settings.slideshow.transition,
        layoutClass
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
            layoutClass: transition.displayedLayoutClass,
            objectFit: settings.photos.display.fit,
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

function isPortrait(photo: Photo | undefined): boolean {
    if (!photo?.width || !photo?.height) {
        return false; // Default to landscape if dimensions unknown
    }
    return photo.height > photo.width;
}

function areBothPortrait(photo1: Photo | undefined, photo2: Photo | undefined): boolean {
    return isPortrait(photo1) && isPortrait(photo2);
}