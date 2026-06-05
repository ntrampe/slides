import type { Photo, ObjectFit } from '../../photos';
import type { LoadedPhoto } from '../../photo-pool';
import type { PoolDebugInfo, SlideshowDebugInfo } from '../../debug-panel';

export interface UseSlideshowDataReturn {
    currentLoaded: LoadedPhoto | undefined;
    currentIndex: number;
    count: number;
    goToNext: () => void;
    goToPrevious: () => void;
    jumpTo: (index: number) => void;
    getPhotoAt: (index: number) => LoadedPhoto | undefined;
    refetch: () => void;
    isLoading: boolean;
    isError: boolean;
    error?: Error;
    /** True while a background refetch is in progress (e.g. hourly photo list refresh). */
    isRefetching: boolean;
    poolStats: PoolDebugInfo;
    totalPhotos: number;
}

export interface UseSlideshowTimerReturn {
    isPlaying: boolean;
    progress: number;
    togglePlayPause: () => void;
    reset: () => void;
    setPlaying: (playing: boolean) => void;
}

export interface UseSlideshowReturn {
    state: {
        currentPhoto: Photo | undefined;
        nextPhoto: Photo | undefined;
        displayedPhoto: Photo | undefined;
        displayedNextPhoto: Photo | undefined;
        currentIndex: number;
        count: number;
        isEmpty: boolean;
        isLoading: boolean;
        isError: boolean;
        error: Error | undefined;
        isPlaying: boolean;
        progress: number;
        areControlsVisible: boolean;
        showPlaybackControls: boolean;
        isTransitioning: boolean;
        transitionStyles: React.CSSProperties;
        layoutClass: string;
        objectFit: ObjectFit;
    };
    actions: {
        goToPrevious: () => void;
        goToNext: () => void;
        togglePlayPause: () => void;
        refetch: () => void;
    };
    debug?: SlideshowDebugInfo;
}
