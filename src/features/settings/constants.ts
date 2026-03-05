import type { AppSettings } from './types';

/**
 * Hardcoded fallback settings used ONLY when server is unreachable.
 * Normal defaults come from /api/config endpoint.
 */
export const FALLBACK_APP_SETTINGS: AppSettings = {
    slideshow: {
        layout: 'single',
        intervalMs: 10000,
        shuffle: true,
        autoplay: true,
        filter: {
            albumIds: [],
            personIds: [],
            location: {},
            startDate: undefined,  // No date filter by default
            endDate: undefined,
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
        fit: 'cover',
        livePhoto: {
            enabled: false,
            delay: 1000,
        },
        animation: {
            type: 'zoom-in',
            duration: 10000, // Should match intervalMs
            intensity: 1.2, // 20% zoom/pan
        },
        metadata: {
            enabled: true,
            dateFormat: 'MMM dd, yyyy',
        }
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
    support: {
        enabled: true,
    },
};