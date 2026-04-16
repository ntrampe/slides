import type { AppSettings } from '../../features/settings/types';
import { FALLBACK_APP_SETTINGS } from '../../shared/constants';

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
 * Build default settings from server environment variables.
 * Uses FALLBACK_APP_SETTINGS as base, with environment variable overrides.
 */
export function buildDefaultSettings(): AppSettings {
    const fallback = FALLBACK_APP_SETTINGS;

    return {
        slideshow: {
            layout: (process.env.DEFAULT_LAYOUT as AppSettings['slideshow']['layout']) || fallback.slideshow.layout,
            intervalMs: parseNumber(process.env.DEFAULT_INTERVAL_MS, fallback.slideshow.intervalMs),
            shuffle: parseBool(process.env.DEFAULT_SHUFFLE, fallback.slideshow.shuffle),
            autoplay: parseBool(process.env.DEFAULT_AUTOPLAY, fallback.slideshow.autoplay),
            filter: {
                albumIds: process.env.DEFAULT_ALBUM_IDS ? parseIdArray(process.env.DEFAULT_ALBUM_IDS) : fallback.slideshow.filter.albumIds,
                albumOperator: (process.env.DEFAULT_ALBUM_OPERATOR as 'AND' | 'OR') || fallback.slideshow.filter.albumOperator,
                personIds: process.env.DEFAULT_PERSON_IDS ? parseIdArray(process.env.DEFAULT_PERSON_IDS) : fallback.slideshow.filter.personIds,
                personOperator: (process.env.DEFAULT_PERSON_OPERATOR as 'AND' | 'OR') || fallback.slideshow.filter.personOperator,
                excludeAlbumIds: process.env.DEFAULT_EXCLUDE_ALBUM_IDS ? parseIdArray(process.env.DEFAULT_EXCLUDE_ALBUM_IDS) : fallback.slideshow.filter.excludeAlbumIds,
                excludePersonIds: process.env.DEFAULT_EXCLUDE_PERSON_IDS ? parseIdArray(process.env.DEFAULT_EXCLUDE_PERSON_IDS) : fallback.slideshow.filter.excludePersonIds,
                location: {
                    country: parseString(process.env.DEFAULT_LOCATION_COUNTRY) || fallback.slideshow.filter.location?.country,
                    state: parseString(process.env.DEFAULT_LOCATION_STATE) || fallback.slideshow.filter.location?.state,
                    city: parseString(process.env.DEFAULT_LOCATION_CITY) || fallback.slideshow.filter.location?.city,
                },
                startDate: parseString(process.env.DEFAULT_START_DATE) || fallback.slideshow.filter.startDate,  // ISO format: YYYY-MM-DD
                endDate: parseString(process.env.DEFAULT_END_DATE) || fallback.slideshow.filter.endDate,      // ISO format: YYYY-MM-DD
                globalOperator: (process.env.DEFAULT_GLOBAL_OPERATOR as 'AND' | 'OR') || fallback.slideshow.filter.globalOperator,
            },
            transition: {
                type: (process.env.DEFAULT_TRANSITION_TYPE as AppSettings['slideshow']['transition']['type']) || fallback.slideshow.transition.type,
                duration: parseNumber(process.env.DEFAULT_TRANSITION_DURATION, fallback.slideshow.transition.duration),
            },
            ui: {
                showProgressBar: parseBool(process.env.DEFAULT_SHOW_PROGRESS_BAR, fallback.slideshow.ui.showProgressBar),
            }
        },
        photos: {
            fit: (process.env.DEFAULT_OBJECT_FIT as AppSettings['photos']['fit']) || fallback.photos.fit,
            livePhoto: {
                enabled: parseBool(process.env.DEFAULT_SHOW_LIVE_PHOTO, fallback.photos.livePhoto.enabled),
                delay: parseNumber(process.env.DEFAULT_LIVE_PHOTO_DELAY, fallback.photos.livePhoto.delay),
            },
            animation: {
                type: (process.env.DEFAULT_PHOTO_ANIMATION_TYPE as AppSettings['photos']['animation']['type']) || fallback.photos.animation.type,
                duration: parseNumber(process.env.DEFAULT_PHOTO_ANIMATION_DURATION, fallback.photos.animation.duration),
                intensity: parseFloat(process.env.DEFAULT_PHOTO_ANIMATION_INTENSITY, fallback.photos.animation.intensity),
            },
            metadata: {
                enabled: parseBool(process.env.DEFAULT_SHOW_PHOTO_METADATA, fallback.photos.metadata.enabled),
                dateFormat: fallback.photos.metadata.dateFormat, // Not configurable via env
            },
        },
        clock: {
            enabled: parseBool(process.env.DEFAULT_SHOW_CLOCK, fallback.clock.enabled),
            use24HourFormat: parseBool(process.env.DEFAULT_24_HOUR_FORMAT, fallback.clock.use24HourFormat),
            dateFormat: fallback.clock.dateFormat, // Not configurable via env
        },
        weather: {
            enabled: parseBool(process.env.DEFAULT_SHOW_WEATHER, fallback.weather.enabled),
            location: {
                lat: parseFloat(process.env.DEFAULT_WEATHER_LAT, fallback.weather.location.lat),
                lng: parseFloat(process.env.DEFAULT_WEATHER_LNG, fallback.weather.location.lng),
            },
        },
        theme: {
            mode: (process.env.DEFAULT_THEME as AppSettings['theme']['mode']) || fallback.theme.mode,
        },
        debug: {
            showDebugStats: fallback.debug.showDebugStats, // Not configurable via env
        },
        support: {
            enabled: fallback.support.enabled, // Not configurable via env
        },
    };
}