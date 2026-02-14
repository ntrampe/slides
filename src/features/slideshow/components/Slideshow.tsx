import { useEffect } from 'react';
import { useInfinitePhotosFlattened, PhotoDisplay } from '../../photos';
import { usePhotoPool } from '../../photo-pool';
import { Overlay } from '../components/Overlay';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useSlideshowTimer } from '../hooks/useSlideshowTimer';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { useControls } from '../../../shared/hooks';

export const Slideshow = () => {
    const { settings } = useSettingsData();

    // 1. Fetch photos with infinite pagination
    const {
        photos,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfinitePhotosFlattened({
        pageSize: 1000,
        personId: "607b51ff-9483-46ab-a6bb-956cea8551a7"
    });

    // 2. Use photo pool for preloading
    const {
        current: currentLoaded,
        index: currentIndex,
        count,
        next: goToNext,
        previous: goToPrevious,
        jumpTo,
        getPhotoAt,
        poolStats,
    } = usePhotoPool(photos, {
        shuffle: settings.slideshow.shuffle,
        preloadForward: 5,
        preloadBackward: 2,
    });

    // 3. Use timer for auto-advance
    const { progress, isPlaying, togglePlayPause, reset } = useSlideshowTimer({
        interval: settings.slideshow.intervalMs,
        onAdvance: goToNext,
        currentIndex,
        isCurrentPhotoLoaded: !!currentLoaded, // Timer only runs when photo is loaded
    });

    const { areControlsVisible } = useControls();

    // Get next photo for split view (manually since we have the index)
    const nextLoaded = getPhotoAt(currentIndex + 1);

    // 4. Auto-load more photos when getting close to the end
    useEffect(() => {
        const photosRemaining = photos.length - currentIndex;
        if (photosRemaining <= 10 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [currentIndex, photos.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                goToPrevious();
                reset(); // Reset timer when manually navigating
            } else if (event.key === 'ArrowRight') {
                goToNext();
                reset();
            } else if (event.key === ' ' || event.key === 'Spacebar') {
                event.preventDefault();
                togglePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrevious, togglePlayPause, reset]);

    // 5. Handle loading/error states
    if (isLoading) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading metadata...</div>;
    if (isError) return <div className="text-white">Something went wrong.</div>;
    if (!currentLoaded) {
        // Show loading state while waiting for photo
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

            {/* DEBUG: Enhanced Stats Panel */}
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
                    <div>Metadata Fetched: {photos.length}</div>
                    <div>Remaining: {photos.length - currentIndex}</div>
                    <div>Has More: {hasNextPage ? '✅' : '❌'}</div>
                    <div>Loading: {isFetchingNextPage ? '⏳' : '✅'}</div>
                </div>
            )}
        </div>
    );
};