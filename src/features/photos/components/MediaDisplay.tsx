import { PhotoMetadataOverlay } from './PhotoMetadataOverlay';
import { useIdle } from '../../../shared/hooks';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { Photo } from '../types';
import type { ObjectFit } from '../../../shared/types/config';
import { useState } from 'react';
import { LivePhotoDisplay } from './LivePhotoDisplay';
import { PhotoDisplay } from './PhotoDisplay';

interface MediaDisplayProps {
    photo: Photo;
    objectFit?: ObjectFit;
}

export const MediaDisplay = ({
    photo,
    objectFit = 'cover',
}: MediaDisplayProps) => {
    const { isIdle } = useIdle();
    const { settings } = useSettingsData();
    const [isExpanded, setIsExpanded] = useState(false);

    const showLivePhoto = Boolean(photo.livePhotoVideoUrl) && settings.photos.display.livePhoto.enabled;

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Media Layer */}
            {showLivePhoto ? (
                <LivePhotoDisplay photo={photo} objectFit={objectFit} />
            ) : (
                <PhotoDisplay photo={photo} objectFit={objectFit} />
            )}

            {/* Metadata Overlay */}
            {settings.photos.display.showMetadata && (
                <PhotoMetadataOverlay
                    photo={photo}
                    isExpanded={isExpanded}
                    onToggleExpanded={() =>
                        setIsExpanded(prev => !prev)
                    }
                    areControlsVisible={!isIdle}
                />
            )}
        </div>
    );
};