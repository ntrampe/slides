import { useEffect, useState } from 'react';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import type { Photo } from '../types';

interface UseLivePhotoReturn {
    hasVideo: boolean;
    showVideo: boolean;
    onVideoCanPlay: () => void;
}

export function useLivePhoto(photo?: Photo): UseLivePhotoReturn {
    const { settings } = useSettingsData();
    const livePhotoEnabled = settings.photos.livePhoto.enabled;
    const livePhotoDelay = settings.photos.livePhoto.delay;

    const [videoReady, setVideoReady] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const hasVideo = Boolean(photo?.livePhotoVideoUrl) && livePhotoEnabled;

    useEffect(() => {
        if (!hasVideo || !videoReady) return;

        const timer = setTimeout(() => {
            setShowVideo(true);
        }, livePhotoDelay);

        return () => clearTimeout(timer);
    }, [videoReady, hasVideo, livePhotoDelay]);

    // Reset state on photo change
    useEffect(() => {
        setVideoReady(false);
        setShowVideo(false);
    }, [photo?.id]);

    return {
        hasVideo,
        showVideo,
        onVideoCanPlay: () => setVideoReady(true),
    };
}