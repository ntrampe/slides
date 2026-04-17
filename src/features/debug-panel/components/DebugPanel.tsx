import type { SlideshowDebugInfo } from '../types';
import { HudPanel, hudTextSizes } from '../../../shared/components';

interface DebugPanelProps {
    debug: SlideshowDebugInfo;
}

export const DebugPanel = ({ debug }: DebugPanelProps) => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-safe-or-4 right-safe-or-4 sm:bottom-safe-or-6 sm:right-safe-or-6 pointer-events-auto">
                <HudPanel
                    variant="prominent"
                    className="font-mono space-y-2"
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
                </HudPanel>
            </div>
        </div>
    );
};