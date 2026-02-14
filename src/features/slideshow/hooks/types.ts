import type { Photo } from '../../photos';
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
    isLoading: boolean;
    isError: boolean;
    isFetchingNextPage: boolean;
    poolStats: PoolDebugInfo;  // Updated type name
    totalPhotos: number;
    hasNextPage: boolean | undefined;
}

export interface UseSlideshowTimerReturn {
    isPlaying: boolean;
    progress: number;
    togglePlayPause: () => void;
    reset: () => void;
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
