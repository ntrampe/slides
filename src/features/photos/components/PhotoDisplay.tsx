import type { Photo, PhotoFit } from '../types';
import { PhotoMetadataOverlay } from './PhotoMetadataOverlay';

interface PhotoDisplayProps {
    photo: Photo;
    objectFit?: PhotoFit;
}

export const PhotoDisplay = ({ photo, objectFit = 'cover' }: PhotoDisplayProps) => {
    const objectFitClasses: Record<PhotoFit, string> = {
        contain: 'object-contain',
        cover: 'object-cover',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down',
    };

    return (
        <div className={`relative h-full w-full overflow-hidden animate-in fade-in duration-1000`}>
            {/* Photo Image */}
            <img
                src={photo.url}
                alt={photo.description || 'Photo'}
                className={`w-full h-full ${objectFitClasses[objectFit]}`}
            />

            {/* Date & Location Metadata Overlay */}
            <PhotoMetadataOverlay
                createdAt={photo.createdAt}
                location={photo.location}
            />
        </div>
    );
};