import type { AppSettings } from './types';

// Helper to parse boolean env vars
const parseBool = (value: string | undefined, fallback: boolean): boolean => {
    if (!value) return fallback;
    return value.toLowerCase() === 'true';
};

// Helper to parse number env vars
const parseNumber = (value: string | undefined, fallback: number): number => {
    if (!value) return fallback;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
};

// Helper to parse float env vars
const parseFloat = (value: string | undefined, fallback: number): number => {
    if (!value) return fallback;
    const parsed = Number(value);
    return isNaN(parsed) ? fallback : parsed;
};

// Helper to parse comma-separated IDs
const parseIdArray = (value: string | undefined): string[] => {
    if (!value) return [];
    return value.split(',').map(id => id.trim()).filter(Boolean);
};

// Helper to parse optional string
const parseString = (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    return value.trim() || undefined;
};

/**
 * Default application settings built from VITE_* environment variables.
 * Set via .env file or Docker build args.
 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
    slideshow: {
        layout: (import.meta.env.VITE_DEFAULT_LAYOUT as AppSettings['slideshow']['layout']) || 'single',
        intervalMs: parseNumber(import.meta.env.VITE_DEFAULT_INTERVAL_MS, 5000),
        shuffle: parseBool(import.meta.env.VITE_DEFAULT_SHUFFLE, true),
        autoplay: parseBool(import.meta.env.VITE_DEFAULT_AUTOPLAY, true),
        filter: {
            albumIds: parseIdArray(import.meta.env.VITE_DEFAULT_ALBUM_IDS),
            personIds: parseIdArray(import.meta.env.VITE_DEFAULT_PERSON_IDS),
            location: {
                country: parseString(import.meta.env.VITE_DEFAULT_LOCATION_COUNTRY),
                state: parseString(import.meta.env.VITE_DEFAULT_LOCATION_STATE),
                city: parseString(import.meta.env.VITE_DEFAULT_LOCATION_CITY),
            },
        },
        transition: {
            type: (import.meta.env.VITE_DEFAULT_TRANSITION_TYPE as AppSettings['slideshow']['transition']['type']) || 'fade',
            duration: parseNumber(import.meta.env.VITE_DEFAULT_TRANSITION_DURATION, 500),
        },
        ui: {
            showProgressBar: parseBool(import.meta.env.VITE_DEFAULT_SHOW_PROGRESS_BAR, true),
        }
    },
    photos: {
        display: {
            fit: (import.meta.env.VITE_DEFAULT_OBJECT_FIT as AppSettings['photos']['display']['fit']) || 'cover',
            showMetadata: parseBool(import.meta.env.VITE_DEFAULT_SHOW_PHOTO_METADATA, true),
        },
        dateFormat: 'MMM dd, yyyy',
    },
    clock: {
        enabled: parseBool(import.meta.env.VITE_DEFAULT_SHOW_CLOCK, true),
        use24HourFormat: parseBool(import.meta.env.VITE_DEFAULT_24_HOUR_FORMAT, false),
        dateFormat: 'MMM dd, yyyy',
    },
    weather: {
        enabled: parseBool(import.meta.env.VITE_DEFAULT_SHOW_WEATHER, false),
        location: {
            lat: parseFloat(import.meta.env.VITE_DEFAULT_WEATHER_LAT, 51.5074),
            lng: parseFloat(import.meta.env.VITE_DEFAULT_WEATHER_LNG, -0.1278),
        },
    },
    ui: {
        fontSize: (import.meta.env.VITE_DEFAULT_FONT_SIZE as AppSettings['ui']['fontSize']) || 'base',
    },
    theme: {
        mode: (import.meta.env.VITE_DEFAULT_THEME as AppSettings['theme']['mode']) || 'dark',
    },
    debug: {
        showDebugStats: false,
    },
};
