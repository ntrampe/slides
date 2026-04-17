import { SlideshowHUD } from './SlideshowHUD';
import { SlideshowContent } from './SlideshowContent';
import { useSlideshow } from '../hooks/useSlideshow';
import { DebugPanel } from '../../debug-panel';

interface SlideshowProps {
    onToggleSettings: () => void;
}

export const Slideshow = ({ onToggleSettings }: SlideshowProps) => {
    const { state, actions, debug } = useSlideshow();

    return (
        <div className="fixed inset-0 bg-black overflow-hidden">
            <div className="absolute inset-0">
                <SlideshowContent
                    state={state}
                    onRetry={actions.refetch}
                    onToggleSettings={onToggleSettings}
                />
            </div>

            <SlideshowHUD
                progress={state.progress}
                isPlaying={state.isPlaying}
                areControlsVisible={state.areControlsVisible}
                showPlaybackControls={state.showPlaybackControls}
                onPrevious={actions.goToPrevious}
                onNext={actions.goToNext}
                onTogglePlayPause={actions.togglePlayPause}
                onToggleSettings={onToggleSettings}
            />

            {debug && <DebugPanel debug={debug} />}
        </div>
    );
};
