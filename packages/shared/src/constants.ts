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
        photoScaleMode: 'fill_crop',
        transitionType: 'fade',
        transitionDuration: 500,
        photoAnimationType: 'zoom-in',
        photoAnimationDuration: 10000,
        photoAnimationIntensity: 1.2,
        livePhotoEnabled: false,
        livePhotoDelay: 1000,
    },
    configuration: {
        dateFormat: 'MMM dd, yyyy',
        hourFormat: '12',
        weatherLat: 51.5074,
        weatherLng: -0.1278,
    },
};
