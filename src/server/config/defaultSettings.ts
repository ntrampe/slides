import type { AppSettings } from '../../features/settings/types';

// Helper functions (same as current frontend)
const parseBool = (value: string | undefined, fallback: boolean): boolean => {
    if (!value) return fallback;
    return value.toLowerCase() === 'true';
};

const parseNumber = (value: string | undefined, fallback: number): number => {
    if (!value) return fallback;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
};

const parseFloat = (value: string | undefined, fallback: number): number => {
    if (!value) return fallback;
    const parsed = Number(value);
    return isNaN(parsed) ? fallback : parsed;
};

const parseIdArray = (value: string | undefined): string[] => {
    if (!value) return [];
    return value.split(',').map(id => id.trim()).filter(Boolean);
};

const parseString = (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    return value.trim() || undefined;
};

/**
 * Build default settings from server environment variables
 */
export function buildDefaultSettings(): AppSettings {
    return {
        slideshow: {
            layout: (process.env.DEFAULT_LAYOUT as AppSettings['slideshow']['layout']) || 'single',
            intervalMs: parseNumber(process.env.DEFAULT_INTERVAL_MS, 5000),
            shuffle: parseBool(process.env.DEFAULT_SHUFFLE, true),
            autoplay: parseBool(process.env.DEFAULT_AUTOPLAY, true),
            filter: {
                albumIds: parseIdArray(process.env.DEFAULT_ALBUM_IDS),
                personIds: parseIdArray(process.env.DEFAULT_PERSON_IDS),
                location: {
                    country: parseString(process.env.DEFAULT_LOCATION_COUNTRY),
                    state: parseString(process.env.DEFAULT_LOCATION_STATE),
                    city: parseString(process.env.DEFAULT_LOCATION_CITY),
                },
                startDate: parseString(process.env.DEFAULT_START_DATE),  // ISO format: YYYY-MM-DD
                endDate: parseString(process.env.DEFAULT_END_DATE),      // ISO format: YYYY-MM-DD
            },
            transition: {
                type: (process.env.DEFAULT_TRANSITION_TYPE as AppSettings['slideshow']['transition']['type']) || 'fade',
                duration: parseNumber(process.env.DEFAULT_TRANSITION_DURATION, 500),
            },
            ui: {
                showProgressBar: parseBool(process.env.DEFAULT_SHOW_PROGRESS_BAR, true),
            }
        },
        photos: {
            fit: (process.env.DEFAULT_OBJECT_FIT as AppSettings['photos']['fit']) || 'cover',
            livePhoto: {
                enabled: parseBool(process.env.DEFAULT_SHOW_LIVE_PHOTO, false),
                delay: parseNumber(process.env.DEFAULT_LIVE_PHOTO_DELAY, 1000),
            },
            animation: {
                type: (process.env.DEFAULT_PHOTO_ANIMATION_TYPE as AppSettings['photos']['animation']['type']) || 'ken-burns',
                duration: parseNumber(process.env.DEFAULT_PHOTO_ANIMATION_DURATION, parseNumber(process.env.DEFAULT_INTERVAL_MS, 5000)), // Match interval by default
                intensity: parseFloat(process.env.DEFAULT_PHOTO_ANIMATION_INTENSITY, 1.2),
            },
            metadata: {
                enabled: parseBool(process.env.DEFAULT_SHOW_PHOTO_METADATA, true),
                dateFormat: 'MMM dd, yyyy',
            },
        },
        clock: {
            enabled: parseBool(process.env.DEFAULT_SHOW_CLOCK, true),
            use24HourFormat: parseBool(process.env.DEFAULT_24_HOUR_FORMAT, false),
            dateFormat: 'MMM dd, yyyy',
        },
        weather: {
            enabled: parseBool(process.env.DEFAULT_SHOW_WEATHER, false),
            location: {
                lat: parseFloat(process.env.DEFAULT_WEATHER_LAT, 51.5074),
                lng: parseFloat(process.env.DEFAULT_WEATHER_LNG, -0.1278),
            },
        },
        theme: {
            mode: (process.env.DEFAULT_THEME as AppSettings['theme']['mode']) || 'dark',
        },
        debug: {
            showDebugStats: false,
        },
        support: {
            enabled: true,
        },
    };
}