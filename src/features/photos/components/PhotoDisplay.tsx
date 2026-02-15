import { useState } from 'react';
import type { ObjectFit } from '../../../shared/types/config';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { Photo } from '../types';
import { PhotoMetadataOverlay } from './PhotoMetadataOverlay';
import { Info } from 'lucide-react';
import { useControls } from '../../../shared/hooks';

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
            {settings.ui.showPhotoMetadata &&
                <PhotoMetadataOverlay
                    createdAt={photo.createdAt}
                    location={photo.location}
                />
            }

            {/* Info Button */}
            <button
                onClick={() => setShowPhotoInfo(prev => !prev)}
                className={`absolute top-4 left-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 z-10 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                aria-label="Photo information"
            >
                <Info size={20} strokeWidth={2} />
            </button>

            {/* Photo Info Panel */}
            {showPhotoInfo && (
                <div className="absolute top-16 left-4 bg-black/90 text-white p-4 rounded-lg max-w-md z-10">
                    <h3 className="font-semibold mb-2">Photo Details</h3>
                    <div className="space-y-1 text-sm">
                        <p><span className="opacity-70">ID:</span> {photo.id}</p>
                        {photo.description && <p><span className="opacity-70">Description:</span> {photo.description}</p>}
                        {photo.createdAt && <p><span className="opacity-70">Taken:</span> {new Date(photo.createdAt).toLocaleString()}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};