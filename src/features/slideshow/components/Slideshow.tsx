import { PhotoDisplay } from '../../photos';
import { Overlay } from '../components/Overlay';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useSlideshow } from '../hooks/useSlideshow';
import { useSlideshowData } from '../hooks/useSlideshowData';
import { useSlideshowKeyboard } from '../hooks/useSlideshowKeyboard';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { useControls } from '../../../shared/hooks';

export const Slideshow = () => {
    const { settings } = useSettingsData();

    // Data layer: photos, pooling, navigation
    const {
        currentLoaded,
        currentIndex,
        count,
        goToNext,
        goToPrevious,
        getPhotoAt,
        isLoading,
        isError,
        poolStats,
        totalPhotos,
        hasNextPage,
        isFetchingNextPage,
    } = useSlideshowData({
        ...(settings.slideshow.filter.albumIds?.length && { albumIds: settings.slideshow.filter.albumIds }),
        ...(settings.slideshow.filter.personIds?.length && { personIds: settings.slideshow.filter.personIds }),
        pageSize: 1000,
        shuffle: settings.slideshow.shuffle,
        preloadForward: 5,
        preloadBackward: 2,
    });

    // Control layer: timer, play/pause
    const { progress, isPlaying, togglePlayPause, reset } = useSlideshow({
        onAdvance: goToNext,
        currentIndex,
        isCurrentPhotoLoaded: !!currentLoaded,
    });

    // Keyboard navigation
    useSlideshowKeyboard({
        onPrevious: goToPrevious,
        onNext: goToNext,
        onTogglePlayPause: togglePlayPause,
        onReset: reset,
    });

    const { areControlsVisible } = useControls();

    // Get next photo for split view
    const nextLoaded = getPhotoAt(currentIndex + 1);

    // Handle loading/error states
    if (isLoading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                Loading metadata...
            </div>
        );
    }

    if (isError) {
        return <div className="text-white">Something went wrong.</div>;
    }

    if (!currentLoaded) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="text-xl mb-2">Loading photo...</div>
                    <div className="text-sm opacity-60">{currentIndex + 1} / {count}</div>
                </div>
            </div>
        );
    }

    const currentPhoto = currentLoaded.photo;
    const nextPhoto = nextLoaded?.photo;

    return (
        <div className="relative h-full w-full bg-black overflow-hidden">
            <Overlay progress={progress} />

            <div className={`grid h-full w-full transition-all duration-1000 ${settings.slideshow.layout === 'split' ? 'grid-cols-2 gap-2' : 'grid-cols-1'
                }`}>
                <PhotoDisplay
                    key={currentPhoto.id}
                    photo={currentPhoto}
                    objectFit={settings.photo.fit}
                />
                {settings.slideshow.layout === 'split' && nextPhoto && (
                    <PhotoDisplay
                        key={nextPhoto.id}
                        photo={nextPhoto}
                        objectFit={settings.photo.fit}
                    />
                )}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => {
                    goToPrevious();
                    reset();
                }}
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                aria-label="Previous photo"
            >
                <ChevronLeft size={48} strokeWidth={2} />
            </button>
            <button
                onClick={() => {
                    goToNext();
                    reset();
                }}
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                aria-label="Next photo"
            >
                <ChevronRight size={48} strokeWidth={2} />
            </button>

            {/* Play/Pause Button */}
            <button
                onClick={togglePlayPause}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-4 transition-all duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
                {isPlaying ? <Pause size={48} strokeWidth={2} /> : <Play size={48} strokeWidth={2} />}
            </button>

            {/* DEBUG: Stats Panel */}
            {settings.debug.showDebugStats && (
                <div className="absolute bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono space-y-2">
                    <div className="font-bold border-b border-white/20 pb-2">Slideshow Stats</div>
                    <div>Current Index: {currentIndex} / {count}</div>
                    <div>Playing: {isPlaying ? '▶️' : '⏸️'}</div>
                    <div>Progress: {progress.toFixed(0)}%</div>

                    <div className="font-bold border-b border-white/20 pb-2 mt-3 pt-2">Photo Pool</div>
                    <div>Loaded: {poolStats.loadedCount} images</div>
                    <div>Window: {poolStats.windowStart} → {poolStats.windowEnd}</div>
                    <div>Window Size: {poolStats.windowSize}</div>

                    <div className="font-bold border-b border-white/20 pb-2 mt-3 pt-2">Pagination</div>
                    <div>Metadata Fetched: {totalPhotos}</div>
                    <div>Remaining: {totalPhotos - currentIndex}</div>
                    <div>Has More: {hasNextPage ? '✅' : '❌'}</div>
                    <div>Loading: {isFetchingNextPage ? '⏳' : '✅'}</div>
                </div>
            )}
        </div>
    );
};