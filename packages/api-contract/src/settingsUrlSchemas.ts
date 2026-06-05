import { z } from 'zod';
import type { components } from './generated/openapi.js';
import { schemas } from './generated/schemas.js';

/**
 * Partial coercion schemas for bracket-notation URL query overrides
 * (e.g. ?query[shuffle]=false&playback[intervalMs]=5000).
 *
 * Express extended / qs parsing yields string primitives; comma-separated
 * values become a single string while repeated keys produce native arrays.
 * Top-level reserved params (seed, cursor, limit) are not validated here.
 */
const idArraySchema = z.union([
    z.array(z.string()),
    z.string().transform((s) =>
        s
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
    ),
]);

const queryUrlSchema = z
    .object({
        albumIds: idArraySchema.optional(),
        albumOperator: schemas.FilterOperator.optional(),
        personIds: idArraySchema.optional(),
        personOperator: schemas.FilterOperator.optional(),
        excludeAlbumIds: idArraySchema.optional(),
        excludePersonIds: idArraySchema.optional(),
        locationCountry: z.string().optional(),
        locationState: z.string().optional(),
        locationCity: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        globalOperator: schemas.FilterOperator.optional(),
        shuffle: z.coerce.boolean().optional(),
    })
    .partial();

const playbackUrlSchema = z
    .object({
        intervalMs: z.coerce.number().optional(),
        autoplay: z.coerce.boolean().optional(),
        layout: z.enum(['single', 'split']).optional(),
        photoFit: z.enum(['contain', 'cover', 'fill', 'none', 'scale-down']).optional(),
        transitionType: z.enum(['fade', 'slide', 'none']).optional(),
        transitionDuration: z.coerce.number().optional(),
        photoAnimationType: z
            .enum(['none', 'zoom-in', 'zoom-out', 'pan', 'ken-burns'])
            .optional(),
        photoAnimationDuration: z.coerce.number().optional(),
        photoAnimationIntensity: z.coerce.number().optional(),
        livePhotoEnabled: z.coerce.boolean().optional(),
        livePhotoDelay: z.coerce.number().optional(),
    })
    .partial();

const displayUrlSchema = z
    .object({
        themeMode: z.enum(['light', 'dark']).optional(),
        showProgressBar: z.coerce.boolean().optional(),
        showDebugStats: z.coerce.boolean().optional(),
        supportEnabled: z.coerce.boolean().optional(),
        photoMetadataEnabled: z.coerce.boolean().optional(),
        photoMetadataDateFormat: z.string().optional(),
        showClock: z.coerce.boolean().optional(),
        clockUse24HourFormat: z.coerce.boolean().optional(),
        clockDateFormat: z.string().optional(),
        showWeather: z.coerce.boolean().optional(),
        weatherLat: z.coerce.number().optional(),
        weatherLng: z.coerce.number().optional(),
    })
    .partial();

export type UrlQueryOverrides = {
    query?: Partial<components['schemas']['QuerySettings']>;
    playback?: Partial<components['schemas']['PlaybackSettings']>;
    display?: Partial<components['schemas']['DisplaySettings']>;
};

export const settingsUrlSchemas = {
    query: queryUrlSchema,
    playback: playbackUrlSchema,
    display: displayUrlSchema,
} as const;
