import type { ObjectFit, Photo } from '../types';
import { PhotoDisplay } from './PhotoDisplay';
import { useLivePhoto } from '../hooks/useLivePhoto';

interface LivePhotoDisplayProps {
    photo: Photo;
    objectFit?: ObjectFit;
}

export const LivePhotoDisplay = ({
    photo,
    objectFit = 'cover',
}: LivePhotoDisplayProps) => {
    const { hasVideo, showVideo, onVideoCanPlay } = useLivePhoto(photo);

    return (
        <>
            {/* Base Image */}
            <PhotoDisplay
                photo={photo}
                objectFit={objectFit}
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
                    className={`absolute inset-0 w-full h-full ${objectFit === 'cover'
                        ? 'object-cover'
                        : 'object-contain'
                        } transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            )}
        </>
    );
};