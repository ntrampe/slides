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

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Photo Image */}
            <img
                src={photo.url}
                alt={photo.description || 'Photo'}
                className={`w-full h-full ${objectFitClasses[objectFit]}`}
            />

            {/* Date & Location Metadata Overlay */}
            {settings.photos.display.showMetadata &&
                <PhotoMetadataOverlay
                    createdAt={photo.createdAt}
                    location={photo.location}
                />
            }

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
                    <h3 className={`font-semibold mb-2 ${hudTextSizes.body}`}>Photo Details</h3>
                    <div className={`space-y-1 ${hudTextSizes.caption}`}>
                        <p><span className="opacity-70">ID:</span> {photo.id}</p>
                        {photo.description && <p><span className="opacity-70">Description:</span> {photo.description}</p>}
                        {photo.createdAt && <p><span className="opacity-70">Taken:</span> {new Date(photo.createdAt).toLocaleString()}</p>}
                    </div>
                </HudPanel>
            )}
        </div>
    );
};