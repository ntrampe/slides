import type { Photo } from '../../photos';
import type { LoadedPhoto } from '../../photo-pool';

export interface PoolStats {
    loadedCount: number;
    windowStart: number;
    windowEnd: number;
    windowSize: number;
}

export interface UseSlideshowDataReturn {
    currentLoaded: LoadedPhoto | undefined;
    currentIndex: number;
    count: number;
    goToNext: () => void;
    goToPrevious: () => void;
    jumpTo: (index: number) => void;
    getPhotoAt: (index: number) => LoadedPhoto | undefined;
    isLoading: boolean;
    isError: boolean;
    isFetchingNextPage: boolean;
    poolStats: PoolStats;
    totalPhotos: number;
    hasNextPage: boolean | undefined;
}

export interface UseSlideshowTimerReturn {
    isPlaying: boolean;
    progress: number;
    togglePlayPause: () => void;
    reset: () => void;
}

export interface SlideshowDebugInfo {
    currentIndex: number;
    count: number;
    isPlaying: boolean;
    progress: number;
    poolStats: PoolStats;
    totalPhotos: number;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
}

export interface UseSlideshowReturn {
    state: {
        currentPhoto: Photo | undefined;
        nextPhoto: Photo | undefined;
        currentIndex: number;
        count: number;
        isLoading: boolean;
        isError: boolean;
        isPlaying: boolean;
        progress: number;
        areControlsVisible: boolean;
    };
    actions: {
        goToPrevious: () => void;
        goToNext: () => void;
        togglePlayPause: () => void;
    };
    debug?: SlideshowDebugInfo;
}
