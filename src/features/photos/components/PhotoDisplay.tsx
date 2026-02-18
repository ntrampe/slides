import { useState } from 'react';
import type { ObjectFit } from '../../../shared/types/config';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { Photo } from '../types';
import { PhotoMetadataOverlay } from './PhotoMetadataOverlay';
import { Info } from 'lucide-react';
import { useControls } from '../../../shared/hooks';
import { HudPanel, HudButton, hudTextSizes } from '../../../shared/components';

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
    const [showPhotoInfo, setShowPhotoInfo] = useState(false);

    // Helper function to format location
    const formatLocation = (location: Photo['location']) => {
        if (!location) return undefined;
        const parts = [location.city, location.state, location.country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : undefined;
    };

    // Helper function to format camera info
    const formatCamera = (camera: Photo['camera']) => {
        if (!camera) return undefined;
        const parts = [camera.make, camera.model].filter(Boolean);
        return parts.length > 0 ? parts.join(' ') : undefined;
    };

    // Helper function to format EXIF settings
    const formatExifSettings = (settings: Photo['exifSettings']) => {
        if (!settings) return [];
        const parts = [];
        if (settings.fNumber) parts.push(`f/${settings.fNumber}`);
        if (settings.exposureTime) parts.push(settings.exposureTime);
        if (settings.iso) parts.push(`ISO ${settings.iso}`);
        if (settings.focalLength) parts.push(`${settings.focalLength}mm`);
        return parts;
    };

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Photo Image */}
            <img
                src={photo.url}
                alt={photo.description || 'Photo'}
                className={`w-full h-full ${objectFitClasses[objectFit]}`}
            />

            {/* Date & Location Metadata Overlay */}
            {settings.photos.display.showMetadata && (
                <PhotoMetadataOverlay
                    createdAt={photo.createdAt}
                    location={formatLocation(photo.location)}
                />
            )}

            {/* Info Button */}
            <HudButton
                onClick={() => setShowPhotoInfo(prev => !prev)}
                label="Photo information"
                size="small"
                className={`absolute top-4 left-4 z-10 transition-all duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <Info strokeWidth={2} />
            </HudButton>

            {/* Photo Info Panel */}
            {showPhotoInfo && (
                <HudPanel
                    variant="standard"
                    className="absolute top-14 sm:top-16 left-4 max-w-xs sm:max-w-md z-10"
                >
                    <h3 className={`font-semibold mb-3 ${hudTextSizes.body}`}>Photo Details</h3>
                    <div className={`space-y-2 ${hudTextSizes.caption}`}>
                        {/* Basic Info */}
                        <div className="space-y-1">
                            <p><span className="opacity-70">ID:</span> {photo.id}</p>
                            {photo.width && photo.height && (
                                <p><span className="opacity-70">Dimensions:</span> {photo.width} × {photo.height}px</p>
                            )}
                            <p><span className="opacity-70">Type:</span> {photo.type}</p>
                            <p><span className="opacity-70">Taken:</span> {photo.createdAt.toLocaleString()}</p>
                        </div>

                        {/* Camera Info */}
                        {(photo.camera || photo.exifSettings) && (
                            <div className="space-y-1 pt-2 border-t border-white/10">
                                <h4 className="font-medium opacity-90">Camera</h4>
                                {formatCamera(photo.camera) && (
                                    <p><span className="opacity-70">Body:</span> {formatCamera(photo.camera)}</p>
                                )}
                                {photo.camera?.lensModel && (
                                    <p><span className="opacity-70">Lens:</span> {photo.camera.lensModel}</p>
                                )}
                                {photo.exifSettings && formatExifSettings(photo.exifSettings).length > 0 && (
                                    <p><span className="opacity-70">Settings:</span> {formatExifSettings(photo.exifSettings).join(' • ')}</p>
                                )}
                            </div>
                        )}

                        {/* Location */}
                        {photo.location && (
                            <div className="space-y-1 pt-2 border-t border-white/10">
                                <h4 className="font-medium opacity-90">Location</h4>
                                <p>{formatLocation(photo.location)}</p>
                                {photo.location.latitude && photo.location.longitude && (
                                    <p className="opacity-70 text-xs">
                                        {photo.location.latitude.toFixed(4)}, {photo.location.longitude.toFixed(4)}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Content Metadata */}
                        {(photo.description || photo.rating || photo.isFavorite || (photo.tags && photo.tags.length > 0)) && (
                            <div className="space-y-1 pt-2 border-t border-white/10">
                                <h4 className="font-medium opacity-90">Content</h4>
                                {photo.description && (
                                    <p><span className="opacity-70">Description:</span> {photo.description}</p>
                                )}
                                {photo.rating && (
                                    <p><span className="opacity-70">Rating:</span> {'★'.repeat(photo.rating)}{'☆'.repeat(5 - photo.rating)}</p>
                                )}
                                {photo.isFavorite && (
                                    <p><span className="opacity-70">Favorite:</span> ❤️</p>
                                )}
                                {photo.tags && photo.tags.length > 0 && (
                                    <p><span className="opacity-70">Tags:</span> {photo.tags.join(', ')}</p>
                                )}
                            </div>
                        )}
                    </div>
                </HudPanel>
            )}
        </div>
    );
};