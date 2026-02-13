import type { Photo } from '../types';
import { PhotoMetadataOverlay } from './PhotoMetadataOverlay';

interface PhotoDisplayProps {
    photo: Photo;
}

export const PhotoDisplay = ({ photo }: PhotoDisplayProps) => {
    return (
        <div className={`relative h-full w-full overflow-hidden animate-in fade-in duration-1000`}>
            {/* Photo Image */}
            <img
                src={photo.url}
                alt={photo.description || 'Photo'}
                className="w-full h-full object-cover"
            />

            {/* Date & Location Metadata Overlay */}
            <PhotoMetadataOverlay
                createdAt={photo.createdAt}
                location={photo.location}
            />
        </div>
    );
};