import { PhotoMetadataOverlay } from './PhotoMetadataOverlay';
import { useIdle } from '../../../hooks';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { usePresentationSettings } from '../../settings';
import type { Photo, PhotoScaleMode } from '../types';
import { useState } from 'react';
import { LivePhotoDisplay } from './LivePhotoDisplay';
import { PhotoDisplay } from './PhotoDisplay';

interface MediaDisplayProps {
    photo: Photo;
    photoScaleMode?: PhotoScaleMode;
}

export const MediaDisplay = ({
    photo,
    photoScaleMode = 'fill_crop',
}: MediaDisplayProps) => {
    const { isIdle } = useIdle();
    const { settings } = useSettingsData();
    const { presentation } = usePresentationSettings();
    const [isExpanded, setIsExpanded] = useState(false);

    const showLivePhoto = Boolean(photo.livePhotoVideoUrl) && settings.playback.livePhotoEnabled;

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Media Layer */}
            {showLivePhoto ? (
                <LivePhotoDisplay photo={photo} photoScaleMode={photoScaleMode} />
            ) : (
                <PhotoDisplay photo={photo} photoScaleMode={photoScaleMode} />
            )}

            {/* Metadata Overlay */}
            {presentation.photoMetadataEnabled && (
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
