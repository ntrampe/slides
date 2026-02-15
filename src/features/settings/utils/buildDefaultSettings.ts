import type { AppSettings } from '../types';
import type { ThemeMode } from '../../theme';

/**
 * Builds default settings from environment variables.
 * Falls back to hardcoded defaults if env vars are not set.
 */
export function buildDefaultSettings(): AppSettings {
    const env = import.meta.env;

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

    return {
        slideshow: {
            layout: (env.VITE_DEFAULT_LAYOUT as AppSettings['slideshow']['layout']) || 'single',
            intervalMs: parseNumber(env.VITE_DEFAULT_INTERVAL_MS, 5000),
            shuffle: parseBool(env.VITE_DEFAULT_SHUFFLE, true),
            autoplay: parseBool(env.VITE_DEFAULT_AUTOPLAY, true),
            filter: {
                albumIds: parseIdArray(env.VITE_DEFAULT_ALBUM_IDS),
                personIds: parseIdArray(env.VITE_DEFAULT_PERSON_IDS),
                location: {
                    country: parseString(env.VITE_DEFAULT_LOCATION_COUNTRY),
                    state: parseString(env.VITE_DEFAULT_LOCATION_STATE),
                    city: parseString(env.VITE_DEFAULT_LOCATION_CITY),
                },
            },
            transition: {
                type: (env.VITE_DEFAULT_TRANSITION_TYPE as AppSettings['slideshow']['transition']['type']) || 'fade',
                duration: parseNumber(env.VITE_DEFAULT_TRANSITION_DURATION, 500),
            },
        },
        photo: {
            fit: (env.VITE_DEFAULT_OBJECT_FIT as AppSettings['photo']['fit']) || 'cover',
            dateFormat: 'MMM dd, yyyy',
        },
        clock: {
            show24HourFormat: parseBool(env.VITE_DEFAULT_24_HOUR_FORMAT, false),
            dateFormat: 'MMM dd, yyyy',
        },
        weather: {
            location: {
                lat: parseFloat(env.VITE_DEFAULT_WEATHER_LAT, 51.5074),
                lng: parseFloat(env.VITE_DEFAULT_WEATHER_LNG, -0.1278),
            },
        },
        ui: {
            showClock: parseBool(env.VITE_DEFAULT_SHOW_CLOCK, true),
            showWeather: parseBool(env.VITE_DEFAULT_SHOW_WEATHER, false),
            showProgressBar: parseBool(env.VITE_DEFAULT_SHOW_PROGRESS_BAR, true),
            showPhotoMetadata: parseBool(env.VITE_DEFAULT_SHOW_PHOTO_METADATA, true),
            fontSize: (env.VITE_DEFAULT_FONT_SIZE as AppSettings['ui']['fontSize']) || 'base',
        },
        theme: {
            mode: (env.VITE_DEFAULT_THEME as ThemeMode) || 'dark',
        },
        debug: {
            showDebugStats: false, // Never default to true from env
        },
    };
}