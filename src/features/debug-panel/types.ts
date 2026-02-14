// Pool/Photo loading stats
export interface PoolDebugInfo {
    loadedCount: number;
    windowStart: number;
    windowEnd: number;
    windowSize: number;
}

// Slideshow-specific debug info
export interface SlideshowDebugInfo {
    currentIndex: number;
    count: number;
    isPlaying: boolean;
    progress: number;
    poolStats: PoolDebugInfo;
    totalPhotos: number;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
}