import { usePhotos } from '../../photos/hooks/usePhotos';
import { useSlideshow } from '../../photos/hooks/useSlideshow';
import { Overlay } from '../components/Overlay';

interface Props { layout: 'single' | 'split' }

export const Slideshow = ({ layout }: Props) => {
    // 1. Fetch the data
    const { data: myPhotos, isLoading, isError } = usePhotos();

    // 2. Pass the data into the slideshow logic
    // We use the empty array fallback [] so useSlideshow doesn't crash while loading
    const { currentPhoto, nextPhoto } = useSlideshow(myPhotos ?? []);

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
        </div>
    );
};