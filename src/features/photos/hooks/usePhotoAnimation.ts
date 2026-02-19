import { useMemo } from 'react';
import type { PhotoAnimationType } from '../../settings/types';

export interface UsePhotoAnimationParams {
    type: PhotoAnimationType;
    duration: number; // in milliseconds
    intensity: number; // 1.0 - 2.0
    photoId: string; // Used to generate consistent random values per photo
}

export interface UsePhotoAnimationReturn {
    animationClass: string;
    animationStyles: React.CSSProperties;
}

/**
 * Hook to generate photo animation CSS classes and styles
 */
export function usePhotoAnimation({
    type,
    duration,
    intensity,
    photoId,
}: UsePhotoAnimationParams): UsePhotoAnimationReturn {
    // Generate consistent pseudo-random values based on photoId
    const randomSeed = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < photoId.length; i++) {
            hash = ((hash << 5) - hash) + photoId.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }, [photoId]);

    const animationConfig = useMemo(() => {
        if (type === 'none') {
            return { class: '', styles: {} };
        }

        // Use photoId to determine animation direction consistently
        const direction = randomSeed % 4; // 0-3 for different directions
        const durationSec = duration / 1000;
        const styles: React.CSSProperties = {
            animation: `photo-${type}-${direction} ${durationSec}s ease-in-out forwards`,
            '--animation-intensity': intensity.toString(),
        } as React.CSSProperties;

        return {
            class: 'photo-animated',
            styles,
        };
    }, [type, duration, intensity, photoId, randomSeed]);

    return {
        animationClass: animationConfig.class,
        animationStyles: animationConfig.styles,
    };
}