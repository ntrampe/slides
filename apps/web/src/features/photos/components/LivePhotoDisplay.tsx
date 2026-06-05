import type { Photo, PhotoScaleMode } from '../types';
import { PhotoDisplay } from './PhotoDisplay';
import { useLivePhoto } from '../hooks/useLivePhoto';
import { scaleModeToCss } from '../utils/scaleModeToCss';

interface LivePhotoDisplayProps {
    photo: Photo;
    photoScaleMode?: PhotoScaleMode;
}

export const LivePhotoDisplay = ({
    photo,
    photoScaleMode = 'fill_crop',
}: LivePhotoDisplayProps) => {
    const { hasVideo, showVideo, onVideoCanPlay } = useLivePhoto(photo);

    return (
        <>
            {/* Base Image */}
            <PhotoDisplay
                photo={photo}
                photoScaleMode={photoScaleMode}
                className={`transition-opacity duration-500 ${showVideo ? 'opacity-0' : 'opacity-100'
                    }`}
            />

            {/* Video Layer */}
            {hasVideo && (
                <video
                    src={photo.livePhotoVideoUrl}
                    muted
                    playsInline
                    autoPlay
                    loop
                    preload="auto"
                    onCanPlay={onVideoCanPlay}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{ objectFit: scaleModeToCss(photoScaleMode) }}
                />
            )}
        </>
    );
};
