import { PhotoDisplay } from '../../photos';
import { Overlay } from '../components/Overlay';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useSlideshow } from '../hooks/useSlideshow';
import { DebugPanel } from '../../debug-panel';
import { HudButton, hudTextSizes } from '../../../shared/components';

export const Slideshow = () => {
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
            <Overlay progress={state.progress} />

            <div
                className={`grid h-full w-full ${state.layoutClass}`}
                style={state.transitionStyles}
            >
                <PhotoDisplay
                    key={state.displayedPhoto.id}
                    photo={state.displayedPhoto}
                    objectFit={state.objectFit}
                />
                {state.layoutClass.includes('grid-cols-2') && state.displayedNextPhoto && (
                    <PhotoDisplay
                        key={state.displayedNextPhoto.id}
                        photo={state.displayedNextPhoto}
                        objectFit={state.objectFit}
                    />
                )}
            </div>

            {/* Navigation Arrows */}
            <HudButton
                onClick={actions.goToPrevious}
                label="Previous photo"
                size="large"
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${state.areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <ChevronLeft strokeWidth={2} />
            </HudButton>
            <HudButton
                onClick={actions.goToNext}
                label="Next photo"
                size="large"
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${state.areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <ChevronRight strokeWidth={2} />
            </HudButton>

            {/* Play/Pause Button */}
            <HudButton
                onClick={actions.togglePlayPause}
                label={state.isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                size="large"
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${state.areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {state.isPlaying ? <Pause strokeWidth={2} /> : <Play strokeWidth={2} />}
            </HudButton>

            {/* Debug Panel */}
            {debug && <DebugPanel debug={debug} />}
        </div>
    );
};