import type { SlideshowDebugInfo } from '../types';

interface DebugPanelProps {
    debug: SlideshowDebugInfo;
}

export const DebugPanel = ({ debug }: DebugPanelProps) => {
    return (
        <div className="absolute bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono space-y-2">
            <div className="font-bold border-b border-white/20 pb-2">Debug Info</div>
            <div>Current Index: {debug.currentIndex} / {debug.count}</div>
            <div>Playing: {debug.isPlaying ? '▶️' : '⏸️'}</div>
            <div>Progress: {debug.progress.toFixed(0)}%</div>

            <div className="font-bold border-b border-white/20 pb-2 mt-3 pt-2">Photo Pool</div>
            <div>Loaded: {debug.poolStats.loadedCount} images</div>
            <div>Window: {debug.poolStats.windowStart} → {debug.poolStats.windowEnd}</div>
            <div>Window Size: {debug.poolStats.windowSize}</div>

            <div className="font-bold border-b border-white/20 pb-2 mt-3 pt-2">Pagination</div>
            <div>Metadata Fetched: {debug.totalPhotos}</div>
            <div>Remaining: {debug.totalPhotos - debug.currentIndex}</div>
            <div>Has More: {debug.hasNextPage ? '✅' : '❌'}</div>
            <div>Loading: {debug.isFetchingNextPage ? '⏳' : '✅'}</div>
        </div>
    );
};