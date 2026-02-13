import type { ObjectFit } from '../../../shared/types/config';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { Photo } from '../types';
import { PhotoMetadataOverlay } from './PhotoMetadataOverlay';

interface PhotoDisplayProps {
    photo: Photo;
    objectFit?: ObjectFit;
}

export const PhotoDisplay = ({ photo, objectFit = 'cover' }: PhotoDisplayProps) => {
    const objectFitClasses: Record<ObjectFit, string> = {
        contain: 'object-contain',
        cover: 'object-cover',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down',
    };

    const { settings } = useSettingsData();

    return (
        <div className={`relative h-full w-full overflow-hidden animate-in fade-in duration-1000`}>
            {/* Photo Image */}
            <img
                src={photo.url}
                alt={photo.description || 'Photo'}
                className={`w-full h-full ${objectFitClasses[objectFit]}`}
            />

            {/* Date & Location Metadata Overlay */}
            {settings.ui.showPhotoMetadata &&
                <PhotoMetadataOverlay
                    createdAt={photo.createdAt}
                    location={photo.location}
                />
            }
        </div>
    );
};