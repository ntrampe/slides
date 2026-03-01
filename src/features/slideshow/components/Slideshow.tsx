import { SlideshowHUD } from './SlideshowHUD';
import { useSlideshow } from '../hooks/useSlideshow';
import { DebugPanel } from '../../debug-panel';
import { hudTextSizes } from '../../../shared/components';
import { MediaDisplay } from '../../photos/components/MediaDisplay';

interface SlideshowProps {
    onToggleSettings: () => void;
}

export const Slideshow = ({ onToggleSettings }: SlideshowProps) => {
    const { state, actions, debug } = useSlideshow();

    // Handle loading/error states
    if (state.isLoading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                Loading metadata...
            </div>
        );
    }

    if (state.isError) {
        return <div className="text-white">Something went wrong.</div>;
    }

    if (!state.currentPhoto || !state.displayedPhoto) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <div className={`mb-2 ${hudTextSizes.heading}`}>Loading photo...</div>
                    <div className={`opacity-60 ${hudTextSizes.caption}`}>{state.currentIndex + 1} / {state.count}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black overflow-hidden">
            {/* Photo Display Layer */}
            <div
                className={`grid h-full w-full ${state.layoutClass}`}
                style={state.transitionStyles}
            >
                <MediaDisplay
                    key={state.displayedPhoto.id}
                    photo={state.displayedPhoto}
                    objectFit={state.objectFit}
                />
                {state.layoutClass.includes('grid-cols-2') && state.displayedNextPhoto && (
                    <MediaDisplay
                        key={state.displayedNextPhoto.id}
                        photo={state.displayedNextPhoto}
                        objectFit={state.objectFit}
                    />
                )}
            </div>

            {/* Global HUD Layer */}
            <SlideshowHUD
                progress={state.progress}
                isPlaying={state.isPlaying}
                areControlsVisible={state.areControlsVisible}
                onPrevious={actions.goToPrevious}
                onNext={actions.goToNext}
                onTogglePlayPause={actions.togglePlayPause}
                onToggleSettings={onToggleSettings}
            />

            {/* Debug Panel */}
            {debug && <DebugPanel debug={debug} />}
        </div>
    );
};