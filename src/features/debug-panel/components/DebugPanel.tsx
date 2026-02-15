import type { SlideshowDebugInfo } from '../types';
import { HudPanel, hudTextSizes } from '../../../shared/components';

interface DebugPanelProps {
    debug: SlideshowDebugInfo;
}

export const DebugPanel = ({ debug }: DebugPanelProps) => {
    return (
        <HudPanel
            variant="prominent"
            className="absolute bottom-4 right-4 font-mono space-y-2"
        >
            <div className={`font-bold border-b border-white/20 pb-2 ${hudTextSizes.caption}`}>
                Debug Info
            </div>
            <div className={hudTextSizes.caption}>
                <div>Current Index: {debug.currentIndex} / {debug.count}</div>
                <div>Playing: {debug.isPlaying ? '▶️' : '⏸️'}</div>
                <div>Progress: {debug.progress.toFixed(0)}%</div>
            </div>

            <div className={`font-bold border-b border-white/20 pb-2 mt-3 pt-2 ${hudTextSizes.caption}`}>
                Photo Pool
            </div>
            <div className={hudTextSizes.caption}>
                <div>Loaded: {debug.poolStats.loadedCount} images</div>
                <div>Window: {debug.poolStats.windowStart} → {debug.poolStats.windowEnd}</div>
                <div>Window Size: {debug.poolStats.windowSize}</div>
            </div>

            <div className={`font-bold border-b border-white/20 pb-2 mt-3 pt-2 ${hudTextSizes.caption}`}>
                Pagination
            </div>
            <div className={hudTextSizes.caption}>
                <div>Metadata Fetched: {debug.totalPhotos}</div>
                <div>Remaining: {debug.totalPhotos - debug.currentIndex}</div>
                <div>Has More: {debug.hasNextPage ? '✅' : '❌'}</div>
                <div>Loading: {debug.isFetchingNextPage ? '⏳' : '✅'}</div>
            </div>
        </HudPanel>
    );
};