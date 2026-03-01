import { useState, useEffect } from 'react';
import type { Photo } from '../../photos/types';
import type { AppSettings } from '../../settings/types';

interface UseSlideshowTransitionParams {
    currentPhoto: Photo | undefined;
    nextPhoto: Photo | undefined;
    transitionSettings: AppSettings['slideshow']['transition'];
    layoutClass: string;
}

interface UseSlideshowTransitionReturn {
    displayedPhoto: Photo | undefined;
    displayedNextPhoto: Photo | undefined;
    displayedLayoutClass: string;
    isTransitioning: boolean;
    transitionStyles: React.CSSProperties;
}

/**
 * Handles photo transitions with configurable types and durations.
 * Manages the visual state during transitions between photos.
 */
export function useSlideshowTransition({
    currentPhoto,
    nextPhoto,
    transitionSettings,
    layoutClass,
}: UseSlideshowTransitionParams): UseSlideshowTransitionReturn {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayedPhoto, setDisplayedPhoto] = useState(currentPhoto);
    const [displayedNextPhoto, setDisplayedNextPhoto] = useState(nextPhoto);
    const [displayedLayoutClass, setDisplayedLayoutClass] = useState(layoutClass);

    // Handle photo transitions
    useEffect(() => {
        if (!currentPhoto) return;

        if (transitionSettings.type === 'none') {
            // No transition - immediately update
            setDisplayedPhoto(currentPhoto);
            setDisplayedNextPhoto(nextPhoto);
            setDisplayedLayoutClass(layoutClass);
            return;
        }

        // Start transition
        setIsTransitioning(true);

        // After fade out is nearly complete, update photos
        const updateTimeout = setTimeout(() => {
            setDisplayedPhoto(currentPhoto);
            setDisplayedNextPhoto(nextPhoto);
            setDisplayedLayoutClass(layoutClass);
        }, transitionSettings.duration * 0.8);

        // Complete transition
        const completeTimeout = setTimeout(() => {
            setIsTransitioning(false);
        }, transitionSettings.duration);

        return () => {
            clearTimeout(updateTimeout);
            clearTimeout(completeTimeout);
        };
    }, [currentPhoto?.id, nextPhoto?.id, layoutClass, transitionSettings.type, transitionSettings.duration]);

    // Calculate transition styles based on settings
    const getTransitionStyles = (): React.CSSProperties => {
        if (transitionSettings.type === 'none') {
            return {
                transition: 'none',
                opacity: 1,
                transform: 'translateX(0)',
            };
        }

        const duration = `${transitionSettings.duration}ms`;

        switch (transitionSettings.type) {
            case 'fade':
                return {
                    transition: `opacity ${duration} ease-in-out`,
                    opacity: isTransitioning ? 0 : 1,
                    transform: 'translateX(0)',
                };
            case 'slide':
                return {
                    transition: `transform ${duration} ease-in-out, opacity ${duration} ease-in-out`,
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? 'translateX(100px)' : 'translateX(0)',
                };
            default:
                return {
                    transition: 'opacity 500ms ease-in-out',
                    opacity: isTransitioning ? 0 : 1,
                    transform: 'translateX(0)',
                };
        }
    };

    return {
        displayedPhoto,
        displayedNextPhoto,
        displayedLayoutClass,
        isTransitioning,
        transitionStyles: getTransitionStyles(),
    };
}