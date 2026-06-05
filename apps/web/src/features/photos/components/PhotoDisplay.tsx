import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { ObjectFit, Photo } from '../types';
import { usePhotoAnimation } from '../hooks/usePhotoAnimation';

interface PhotoDisplayProps {
    photo: Photo;
    objectFit?: ObjectFit;
    className?: string;
}

export const PhotoDisplay = ({
    photo,
    objectFit = 'cover',
    className = '',
}: PhotoDisplayProps) => {
    const objectFitClasses: Record<ObjectFit, string> = {
        contain: 'object-contain',
        cover: 'object-cover',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down',
    };

    const { settings } = useSettingsData();

    const { animationClass, animationStyles } = usePhotoAnimation({
        type: settings.playback.photoAnimationType,
        duration: settings.playback.photoAnimationDuration,
        intensity: settings.playback.photoAnimationIntensity,
        photoId: photo.id,
    });

    return (
        <img
            src={photo.url}
            alt={photo.description || 'Photo'}
            className={`absolute inset-0 w-full h-full ${objectFitClasses[objectFit]} ${animationClass} ${className}`}
            style={animationStyles}
        />
    );
};