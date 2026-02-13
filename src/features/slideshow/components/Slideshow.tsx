import { useEffect } from 'react';
import { useInfinitePhotosFlattened } from '../../photos/hooks/useInfinitePhotosFlattened';
import { Overlay } from '../components/Overlay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSlideshow } from '../hooks/useSlideshow';

interface Props { layout: 'single' | 'split' }

export const Slideshow = ({ layout }: Props) => {
    // 1. Fetch photos with infinite pagination
    const {
        photos,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        totalFetched,
        totalAvailable
    } = useInfinitePhotosFlattened({ pageSize: 100 });

    // 2. Pass the flattened photos into the slideshow logic
    const { currentPhoto, nextPhoto, goToNext, goToPrevious, currentIndex } = useSlideshow(photos);

    // DEBUG: Log pagination status
    useEffect(() => {
        console.log('📸 Pagination Status:', {
            totalPhotos: photos.length,
            currentIndex,
            photosRemaining: photos.length - currentIndex,
            hasNextPage,
            isFetchingNextPage,
            totalFetched,
            totalAvailable
        });
    }, [photos.length, currentIndex, hasNextPage, isFetchingNextPage, totalFetched, totalAvailable]);

    // 3. Auto-load more photos when getting close to the end
    useEffect(() => {
        // When we're within 10 photos of the end, load more
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
            } else if (event.key === 'ArrowRight') {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrevious]);

    // 4. Handle loading/error states
    if (isLoading) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading your memories...</div>;
    if (isError || !currentPhoto) return <div className="text-white">Something went wrong.</div>;

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden">
            <Overlay photo={currentPhoto} />

            <div className={`grid h-full w-full transition-all duration-1000 ${layout === 'split' ? 'grid-cols-2 gap-2' : 'grid-cols-1'}`}>
                <img
                    key={currentPhoto.id}
                    src={currentPhoto.url}
                    className="w-full h-full object-cover animate-in fade-in duration-1000"
                />
                {layout === 'split' && nextPhoto && (
                    <img
                        key={nextPhoto.id}
                        src={nextPhoto.url}
                        className="w-full h-full object-cover animate-in slide-in-from-right duration-700"
                    />
                )}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                aria-label="Previous photo"
            >
                <ChevronLeft size={48} strokeWidth={2} />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                aria-label="Next photo"
            >
                <ChevronRight size={48} strokeWidth={2} />
            </button>

            {/* DEBUG: Pagination Info */}
            {import.meta.env.DEV && (
                <div className="absolute bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono">
                    <div>Photos Loaded: {photos.length}</div>
                    <div>Current Index: {currentIndex}</div>
                    <div>Has More: {hasNextPage ? '✅' : '❌'}</div>
                    <div>Loading: {isFetchingNextPage ? '⏳' : '✅'}</div>
                    <div>Total Available: {totalAvailable ?? '?'}</div>
                </div>
            )}
        </div>
    );
};