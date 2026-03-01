import type { AppSettings } from './types';

/**
 * Hardcoded fallback settings used ONLY when server is unreachable.
 * Normal defaults come from /api/config endpoint.
 */
export const FALLBACK_APP_SETTINGS: AppSettings = {
    slideshow: {
        layout: 'single',
        intervalMs: 5000,
        shuffle: true,
        autoplay: true,
        filter: {
            albumIds: [],
            personIds: [],
            location: {},
        },
        transition: {
            type: 'fade',
            duration: 500,
        },
        ui: {
            showProgressBar: true,
        }
    },
    photos: {
        display: {
            fit: 'cover',
            showMetadata: true,
            livePhoto: {
                enabled: false,
                delay: 1000,
            },
            animation: {
                type: 'ken-burns',
                duration: 5000, // Should match intervalMs
                intensity: 1.2, // 20% zoom/pan
            },
        },
        dateFormat: 'MMM dd, yyyy',
    },
    clock: {
        enabled: true,
        use24HourFormat: false,
        dateFormat: 'MMM dd, yyyy',
    },
    weather: {
        enabled: false,
        location: {
            lat: 51.5074,
            lng: -0.1278,
        },
    },
    theme: {
        mode: 'dark',
    },
    debug: {
        showDebugStats: false,
    },
};