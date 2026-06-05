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
        query: {
            albumIds: process.env.DEFAULT_ALBUM_IDS
                ? parseIdArray(process.env.DEFAULT_ALBUM_IDS)
                : [...fallback.query.albumIds],
            albumOperator:
                (process.env.DEFAULT_ALBUM_OPERATOR as DomainAppSettings['query']['albumOperator']) ||
                fallback.query.albumOperator,
            personIds: process.env.DEFAULT_PERSON_IDS
                ? parseIdArray(process.env.DEFAULT_PERSON_IDS)
                : [...fallback.query.personIds],
            personOperator:
                (process.env.DEFAULT_PERSON_OPERATOR as DomainAppSettings['query']['personOperator']) ||
                fallback.query.personOperator,
            excludeAlbumIds: process.env.DEFAULT_EXCLUDE_ALBUM_IDS
                ? parseIdArray(process.env.DEFAULT_EXCLUDE_ALBUM_IDS)
                : [...fallback.query.excludeAlbumIds],
            excludePersonIds: process.env.DEFAULT_EXCLUDE_PERSON_IDS
                ? parseIdArray(process.env.DEFAULT_EXCLUDE_PERSON_IDS)
                : [...fallback.query.excludePersonIds],
            locationCountry:
                parseString(process.env.DEFAULT_LOCATION_COUNTRY) || fallback.query.locationCountry,
            locationState:
                parseString(process.env.DEFAULT_LOCATION_STATE) || fallback.query.locationState,
            locationCity:
                parseString(process.env.DEFAULT_LOCATION_CITY) || fallback.query.locationCity,
            startDate: parseString(process.env.DEFAULT_START_DATE) || fallback.query.startDate,
            endDate: parseString(process.env.DEFAULT_END_DATE) || fallback.query.endDate,
            globalOperator:
                (process.env.DEFAULT_GLOBAL_OPERATOR as DomainAppSettings['query']['globalOperator']) ||
                fallback.query.globalOperator,
            shuffle: parseBool(process.env.DEFAULT_SHUFFLE, fallback.query.shuffle),
        },
        playback: {
            layout:
                (process.env.DEFAULT_LAYOUT as DomainAppSettings['playback']['layout']) ||
                fallback.playback.layout,
            intervalMs: parseNumber(
                process.env.DEFAULT_INTERVAL_MS,
                fallback.playback.intervalMs
            ),
            autoplay: parseBool(process.env.DEFAULT_AUTOPLAY, fallback.playback.autoplay),
            transitionType:
                (process.env.DEFAULT_TRANSITION_TYPE as DomainAppSettings['playback']['transitionType']) ||
                fallback.playback.transitionType,
            transitionDuration: parseNumber(
                process.env.DEFAULT_TRANSITION_DURATION,
                fallback.playback.transitionDuration
            ),
            photoFit:
                (process.env.DEFAULT_OBJECT_FIT as DomainAppSettings['playback']['photoFit']) ||
                fallback.playback.photoFit,
            livePhotoEnabled: parseBool(
                process.env.DEFAULT_SHOW_LIVE_PHOTO,
                fallback.playback.livePhotoEnabled
            ),
            livePhotoDelay: parseNumber(
                process.env.DEFAULT_LIVE_PHOTO_DELAY,
                fallback.playback.livePhotoDelay
            ),
            photoAnimationType:
                (process.env.DEFAULT_PHOTO_ANIMATION_TYPE as DomainAppSettings['playback']['photoAnimationType']) ||
                fallback.playback.photoAnimationType,
            photoAnimationDuration: parseNumber(
                process.env.DEFAULT_PHOTO_ANIMATION_DURATION,
                fallback.playback.photoAnimationDuration
            ),
            photoAnimationIntensity: parseFloatEnv(
                process.env.DEFAULT_PHOTO_ANIMATION_INTENSITY,
                fallback.playback.photoAnimationIntensity
            ),
        },
        display: {
            showProgressBar: parseBool(
                process.env.DEFAULT_SHOW_PROGRESS_BAR,
                fallback.display.showProgressBar
            ),
            photoMetadataEnabled: parseBool(
                process.env.DEFAULT_SHOW_PHOTO_METADATA,
                fallback.display.photoMetadataEnabled
            ),
            photoMetadataDateFormat: fallback.display.photoMetadataDateFormat,
            showClock: parseBool(process.env.DEFAULT_SHOW_CLOCK, fallback.display.showClock),
            clockUse24HourFormat: parseBool(
                process.env.DEFAULT_24_HOUR_FORMAT,
                fallback.display.clockUse24HourFormat
            ),
            clockDateFormat: fallback.display.clockDateFormat,
            showWeather: parseBool(process.env.DEFAULT_SHOW_WEATHER, fallback.display.showWeather),
            weatherLat: parseFloatEnv(process.env.DEFAULT_WEATHER_LAT, fallback.display.weatherLat),
            weatherLng: parseFloatEnv(process.env.DEFAULT_WEATHER_LNG, fallback.display.weatherLng),
            themeMode:
                (process.env.DEFAULT_THEME as DomainAppSettings['display']['themeMode']) ||
                fallback.display.themeMode,
            showDebugStats: fallback.display.showDebugStats,
            supportEnabled: fallback.display.supportEnabled,
        },
    };
}
