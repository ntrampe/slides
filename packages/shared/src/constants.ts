import type { AppSettings, FilterOperator } from '@slides/api-contract';

export const DEFAULT_FILTER_OPERATOR: FilterOperator = 'AND';

export const FALLBACK_APP_SETTINGS: AppSettings = {
    slideshow: {
        layout: 'single',
        intervalMs: 10000,
        shuffle: true,
        autoplay: true,
        filter: {
            albumIds: [],
            albumOperator: 'AND',
            personIds: [],
            personOperator: 'AND',
            excludeAlbumIds: [],
            excludePersonIds: [],
            location: {},
            startDate: undefined,
            endDate: undefined,
            globalOperator: 'AND',
        },
        transition: {
            type: 'fade',
            duration: 500,
        },
        ui: {
            showProgressBar: true,
        },
    },
    photos: {
        fit: 'cover',
        livePhoto: {
            enabled: false,
            delay: 1000,
        },
        animation: {
            type: 'zoom-in',
            duration: 10000,
            intensity: 1.2,
        },
        metadata: {
            enabled: true,
            dateFormat: 'MMM dd, yyyy',
        },
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
