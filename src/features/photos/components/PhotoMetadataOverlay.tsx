import { format } from 'date-fns';
import { Calendar, MapPin, Info, ExternalLink } from 'lucide-react';
import type { Photo } from '../types';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { HudPanel, HudButton, hudTextSizes } from '../../../shared/components';

interface PhotoMetadataOverlayProps {
    photo: Photo;
    isExpanded?: boolean;
    onToggleExpanded?: () => void;
    areControlsVisible?: boolean;
}

export const PhotoMetadataOverlay = ({
    photo,
    isExpanded = false,
    onToggleExpanded,
    areControlsVisible
}: PhotoMetadataOverlayProps) => {
    const { settings } = useSettingsData();

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

    const location = formatLocation(photo.location);
    const hasButtons = areControlsVisible && (onToggleExpanded || photo.inAppUrl);
    const hasBasicMetadata = photo.createdAt || location;

    if (!hasBasicMetadata && !hasButtons) return null;

    return (
        <HudPanel
            variant="subtle"
            className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-6 transition-all duration-300 ease-in-out max-h-[50vh] overflow-y-auto ${isExpanded ? 'max-w-xs sm:max-w-md' : 'max-w-fit'
                }`}
        >
            {/* Basic Metadata - Always Visible */}
            {hasBasicMetadata && (
                <div className={hasButtons || isExpanded ? 'mb-3' : ''}>
                    {photo.createdAt && (
                        <div className={`flex items-center gap-2 sm:gap-3 ${location ? 'mb-1 sm:mb-2' : ''}`}>
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 opacity-60" />
                            <p className={`font-medium ${hudTextSizes.body}`}>
                                {format(new Date(photo.createdAt), settings.photos.dateFormat)}
                            </p>
                        </div>
                    )}
                    {location && (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 opacity-60" />
                            <h2 className={`font-medium ${hudTextSizes.body}`}>{location}</h2>
                        </div>
                    )}
                </div>
            )}

            {/* Expanded Details */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className={`space-y-3 ${hudTextSizes.caption} mb-3`}>
                    {/* Basic Info */}
                    <div className="space-y-1">
                        <h4 className="font-medium opacity-90 text-xs">Photo Details</h4>
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
                            <h4 className="font-medium opacity-90 text-xs">Camera</h4>
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

                    {/* Extended Location Info */}
                    {photo.location && (photo.location.latitude || photo.location.longitude) && (
                        <div className="space-y-1 pt-2 border-t border-white/10">
                            <h4 className="font-medium opacity-90 text-xs">Coordinates</h4>
                            {photo.location.latitude && photo.location.longitude && (
                                <p className="opacity-70">
                                    {photo.location.latitude.toFixed(4)}, {photo.location.longitude.toFixed(4)}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Content Metadata */}
                    {(photo.description || photo.rating || photo.isFavorite || (photo.tags && photo.tags.length > 0)) && (
                        <div className="space-y-1 pt-2 border-t border-white/10">
                            <h4 className="font-medium opacity-90 text-xs">Content</h4>
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
            </div>

            {/* Control Buttons */}
            {hasButtons && (
                <div className="flex gap-2">
                    {onToggleExpanded && (
                        <HudButton
                            onClick={onToggleExpanded}
                            label={isExpanded ? "Hide photo information" : "Show photo information"}
                            size="small"
                            className={isExpanded ? 'bg-white/20' : ''}
                        >
                            <Info strokeWidth={2} />
                        </HudButton>
                    )}
                    {photo.inAppUrl && (
                        <HudButton
                            onClick={() => window.open(photo.inAppUrl, '_blank')}
                            label="Open in app"
                            size="small"
                        >
                            <ExternalLink strokeWidth={2} />
                        </HudButton>
                    )}
                </div>
            )}
        </HudPanel>
    );
};