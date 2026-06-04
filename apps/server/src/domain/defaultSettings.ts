import type { DomainAppSettings } from './settings.js';
import { FALLBACK_APP_SETTINGS } from '@slides/shared/constants';
import {
    parseBool,
    parseFloatEnv,
    parseIdArray,
    parseNumber,
    parseString,
} from './settings/envParsers.js';

/**
 * Build default settings from server environment variables.
 * Uses FALLBACK_APP_SETTINGS as base, with `DEFAULT_*` env var overrides.
 */
export function buildDefaultSettings(): DomainAppSettings {
    const fallback = FALLBACK_APP_SETTINGS;

    return {
        slideshow: {
            layout: (process.env.DEFAULT_LAYOUT as DomainAppSettings['slideshow']['layout']) || fallback.slideshow.layout,
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
                startDate: parseString(process.env.DEFAULT_START_DATE) || fallback.slideshow.filter.startDate,
                endDate: parseString(process.env.DEFAULT_END_DATE) || fallback.slideshow.filter.endDate,
                globalOperator: (process.env.DEFAULT_GLOBAL_OPERATOR as 'AND' | 'OR') || fallback.slideshow.filter.globalOperator,
            },
            transition: {
                type: (process.env.DEFAULT_TRANSITION_TYPE as DomainAppSettings['slideshow']['transition']['type']) || fallback.slideshow.transition.type,
                duration: parseNumber(process.env.DEFAULT_TRANSITION_DURATION, fallback.slideshow.transition.duration),
            },
            ui: {
                showProgressBar: parseBool(process.env.DEFAULT_SHOW_PROGRESS_BAR, fallback.slideshow.ui.showProgressBar),
            }
        },
        photos: {
            fit: (process.env.DEFAULT_OBJECT_FIT as DomainAppSettings['photos']['fit']) || fallback.photos.fit,
            livePhoto: {
                enabled: parseBool(process.env.DEFAULT_SHOW_LIVE_PHOTO, fallback.photos.livePhoto.enabled),
                delay: parseNumber(process.env.DEFAULT_LIVE_PHOTO_DELAY, fallback.photos.livePhoto.delay),
            },
            animation: {
                type: (process.env.DEFAULT_PHOTO_ANIMATION_TYPE as DomainAppSettings['photos']['animation']['type']) || fallback.photos.animation.type,
                duration: parseNumber(process.env.DEFAULT_PHOTO_ANIMATION_DURATION, fallback.photos.animation.duration),
                intensity: parseFloatEnv(process.env.DEFAULT_PHOTO_ANIMATION_INTENSITY, fallback.photos.animation.intensity),
            },
            metadata: {
                enabled: parseBool(process.env.DEFAULT_SHOW_PHOTO_METADATA, fallback.photos.metadata.enabled),
                dateFormat: fallback.photos.metadata.dateFormat,
            },
        },
        clock: {
            enabled: parseBool(process.env.DEFAULT_SHOW_CLOCK, fallback.clock.enabled),
            use24HourFormat: parseBool(process.env.DEFAULT_24_HOUR_FORMAT, fallback.clock.use24HourFormat),
            dateFormat: fallback.clock.dateFormat,
        },
        weather: {
            enabled: parseBool(process.env.DEFAULT_SHOW_WEATHER, fallback.weather.enabled),
            location: {
                lat: parseFloatEnv(process.env.DEFAULT_WEATHER_LAT, fallback.weather.location.lat),
                lng: parseFloatEnv(process.env.DEFAULT_WEATHER_LNG, fallback.weather.location.lng),
            },
        },
        theme: {
            mode: (process.env.DEFAULT_THEME as DomainAppSettings['theme']['mode']) || fallback.theme.mode,
        },
        debug: {
            showDebugStats: fallback.debug.showDebugStats,
        },
        support: {
            enabled: fallback.support.enabled,
        },
    };
}
