import type { AppSettings } from '@slides/api-contract';

export const DEFAULT_FILTER_OPERATOR = 'AND' as const;

export const FALLBACK_APP_SETTINGS: AppSettings = {
    query: {
        albumIds: [],
        albumOperator: 'AND',
        personIds: [],
        personOperator: 'AND',
        excludeAlbumIds: [],
        excludePersonIds: [],
        globalOperator: 'AND',
        shuffle: true,
    },
    playback: {
        layout: 'single',
        intervalMs: 10000,
        autoplay: true,
        photoFit: 'cover',
        transitionType: 'fade',
        transitionDuration: 500,
        photoAnimationType: 'zoom-in',
        photoAnimationDuration: 10000,
        photoAnimationIntensity: 1.2,
        livePhotoEnabled: false,
        livePhotoDelay: 1000,
    },
    display: {
        themeMode: 'dark',
        showProgressBar: true,
        showDebugStats: false,
        supportEnabled: true,
        photoMetadataEnabled: true,
        photoMetadataDateFormat: 'MMM dd, yyyy',
        showClock: true,
        clockUse24HourFormat: false,
        clockDateFormat: 'MMM dd, yyyy',
        showWeather: false,
        weatherLat: 51.5074,
        weatherLng: -0.1278,
    },
};
