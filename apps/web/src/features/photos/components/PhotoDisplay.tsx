import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { Photo, PhotoScaleMode } from '../types';
import { usePhotoAnimation } from '../hooks/usePhotoAnimation';
import { scaleModeToCss } from '../utils/scaleModeToCss';

interface PhotoDisplayProps {
    photo: Photo;
    photoScaleMode?: PhotoScaleMode;
    className?: string;
}

export const PhotoDisplay = ({
    photo,
    photoScaleMode = 'fill_crop',
    className = '',
}: PhotoDisplayProps) => {
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
            className={`absolute inset-0 w-full h-full ${animationClass} ${className}`}
            style={{ objectFit: scaleModeToCss(photoScaleMode), ...animationStyles }}
        />
    );
};
