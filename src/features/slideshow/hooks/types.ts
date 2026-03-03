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
    refetch: () => void;
    isLoading: boolean;
    isError: boolean;
    error?: Error;
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
        isTransitioning: boolean;
        transitionStyles: React.CSSProperties;
        layoutClass: string;
        objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    };
    actions: {
        goToPrevious: () => void;
        goToNext: () => void;
        togglePlayPause: () => void;
        refetch: () => void;
    };
    debug?: SlideshowDebugInfo;
}
