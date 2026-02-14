import { PhotoDisplay } from '../../photos';
import { Overlay } from '../components/Overlay';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useSlideshow } from '../hooks/useSlideshow';
import { useSettingsData } from '../../settings/hooks/useSettingsData';

export const Slideshow = () => {
    const { settings } = useSettingsData();
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

    if (!state.currentPhoto) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="text-xl mb-2">Loading photo...</div>
                    <div className="text-sm opacity-60">{state.currentIndex + 1} / {state.count}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full bg-black overflow-hidden">
            <Overlay progress={state.progress} />

            <div className={`grid h-full w-full transition-all duration-1000 ${settings.slideshow.layout === 'split' ? 'grid-cols-2 gap-2' : 'grid-cols-1'
                }`}>
                <PhotoDisplay
                    key={state.currentPhoto.id}
                    photo={state.currentPhoto}
                    objectFit={settings.photo.fit}
                />
                {settings.slideshow.layout === 'split' && state.nextPhoto && (
                    <PhotoDisplay
                        key={state.nextPhoto.id}
                        photo={state.nextPhoto}
                        objectFit={settings.photo.fit}
                    />
                )}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={actions.goToPrevious}
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 ${state.areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                aria-label="Previous photo"
            >
                <ChevronLeft size={48} strokeWidth={2} />
            </button>
            <button
                onClick={actions.goToNext}
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 ${state.areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                aria-label="Next photo"
            >
                <ChevronRight size={48} strokeWidth={2} />
            </button>

            {/* Play/Pause Button */}
            <button
                onClick={actions.togglePlayPause}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-4 transition-all duration-300 ${state.areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                aria-label={state.isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
                {state.isPlaying ? <Pause size={48} strokeWidth={2} /> : <Play size={48} strokeWidth={2} />}
            </button>

            {/* DEBUG: Stats Panel */}
            {debug && (
                <div className="absolute bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono space-y-2">
                    <div className="font-bold border-b border-white/20 pb-2">Slideshow Stats</div>
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
            )}
        </div>
    );
};