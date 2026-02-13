import { useEffect } from 'react';
import { usePhotos } from '../../photos/hooks/usePhotos';
import { useSlideshow } from '../../photos/hooks/useSlideshow';
import { Overlay } from '../components/Overlay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props { layout: 'single' | 'split' }

export const Slideshow = ({ layout }: Props) => {
    // 1. Fetch the data
    const { data: myPhotos, isLoading, isError } = usePhotos();

    // 2. Pass the data into the slideshow logic
    // We use the empty array fallback [] so useSlideshow doesn't crash while loading
    const { currentPhoto, nextPhoto, goToNext, goToPrevious } = useSlideshow(myPhotos ?? []);

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

    // 3. Handle loading/error states
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
        </div>
    );
};