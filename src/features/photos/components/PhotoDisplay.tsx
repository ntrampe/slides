import { useState } from 'react';
import type { ObjectFit } from '../../../shared/types/config';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { Photo } from '../types';
import { PhotoMetadataOverlay } from './PhotoMetadataOverlay';
import { useControls } from '../../../shared/hooks';
import { usePhotoAnimation } from '../hooks/usePhotoAnimation';

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
    const { areControlsVisible } = useControls();
    const [isExpanded, setIsExpanded] = useState(false);

    // Get animation configuration
    const { animationClass, animationStyles } = usePhotoAnimation({
        type: settings.photos.display.animation.type,
        duration: settings.photos.display.animation.duration,
        intensity: settings.photos.display.animation.intensity,
        photoId: photo.id,
    });

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Photo Image */}
            <img
                src={photo.url}
                alt={photo.description || 'Photo'}
                className={`w-full h-full ${objectFitClasses[objectFit]} ${animationClass}`}
                style={animationStyles}
            />

            {/* Photo Metadata Overlay */}
            {settings.photos.display.showMetadata && (
                <PhotoMetadataOverlay
                    photo={photo}
                    isExpanded={isExpanded}
                    onToggleExpanded={() => setIsExpanded(prev => !prev)}
                    areControlsVisible={areControlsVisible}
                />
            )}




        </div>
    );
};