import { useCallback, useMemo } from 'react';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { usePresentationSettings } from '../../settings';
import { useIdle } from '../../../hooks';
import { useSlideshowData } from './useSlideshowData';
import { useSlideshowTimer } from './useSlideshowTimer';
import { useSlideshowKeyboard } from './useSlideshowKeyboard';
import { useSlideshowTransition } from './useSlideshowTransition';
import type { UseSlideshowReturn } from './types';
import type { Photo } from '../../photos';

export function useSlideshow(): UseSlideshowReturn {
    const { settings } = useSettingsData();
    const { presentation } = usePresentationSettings();
    const { isIdle } = useIdle();

    const data = useSlideshowData({
        preloadForward: 5,
        preloadBackward: 2,
    });

    const isEmpty = !data.isLoading && !data.isError && data.count === 0;

    const nextLoaded = data.getPhotoAt(data.currentIndex + 1);

    const shouldUseSplitLayout = useMemo(() => {
        if (settings.playback.layout === 'single') {
            return false;
        }

        if (settings.playback.layout === 'split') {
            return areBothPortrait(data.currentLoaded?.photo, nextLoaded?.photo);
        }

        return false;
    }, [settings.playback.layout, data.currentLoaded?.photo, nextLoaded?.photo]);

    const layoutClass = shouldUseSplitLayout ? 'grid-cols-2 gap-2' : 'grid-cols-1';

    const transition = useSlideshowTransition({
        currentPhoto: data.currentLoaded?.photo,
        nextPhoto: nextLoaded?.photo,
        transitionSettings: {
            type: settings.playback.transitionType,
            duration: settings.playback.transitionDuration,
        },
        layoutClass,
    });

    const pinHudChrome =
        isEmpty ||
        data.isError ||
        data.isLoading ||
        (data.count > 0 &&
            (!data.currentLoaded?.photo || !transition.displayedPhoto));

    const showPlaybackControls =
        !isEmpty &&
        !data.isError &&
        !data.isLoading &&
        Boolean(data.currentLoaded?.photo && transition.displayedPhoto);

    const timer = useSlideshowTimer({
        onAdvance: data.goToNext,
        currentIndex: data.currentIndex,
        isEmpty: isEmpty,
        isLoading: data.isLoading,
        isTransitioning: transition.isTransitioning,
    });

    const handlePrevious = useCallback(() => {
        data.goToPrevious();
        timer.reset();
    }, [data, timer]);

    const handleNext = useCallback(() => {
        data.goToNext();
        timer.reset();
    }, [data, timer]);

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
            isEmpty,
            isLoading: data.isLoading,
            isError: data.isError,
            error: data.error,
            isPlaying: timer.isPlaying,
            progress: timer.progress,
            areControlsVisible: !isIdle || pinHudChrome,
            showPlaybackControls,
            isTransitioning: transition.isTransitioning,
            transitionStyles: transition.transitionStyles,
            layoutClass: transition.displayedLayoutClass,
            photoScaleMode: settings.playback.photoScaleMode,
        },
        actions: {
            goToPrevious: handlePrevious,
            goToNext: handleNext,
            togglePlayPause: timer.togglePlayPause,
            refetch: data.refetch,
        },
        debug: presentation.showDebugStats
            ? {
                  currentIndex: data.currentIndex,
                  count: data.count,
                  isPlaying: timer.isPlaying,
                  progress: timer.progress,
                  poolStats: data.poolStats,
                  totalPhotos: data.totalPhotos,
                  isRefetching: data.isRefetching,
              }
            : undefined,
    };
}

function isPortrait(photo: Photo | undefined): boolean {
    if (!photo?.width || !photo?.height) {
        return false;
    }
    return photo.height > photo.width;
}

function areBothPortrait(photo1: Photo | undefined, photo2: Photo | undefined): boolean {
    return isPortrait(photo1) && isPortrait(photo2);
}
