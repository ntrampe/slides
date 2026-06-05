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

/** z.coerce.boolean() treats any non-empty string (including "false") as true. */
const urlBooleanSchema = z
    .union([z.boolean(), z.string(), z.number()])
    .transform((v) => {
        if (typeof v === 'boolean') return v;
        if (typeof v === 'number') return v !== 0;
        const s = v.toLowerCase();
        if (s === 'false' || s === '0' || s === 'no' || s === 'off') return false;
        if (s === 'true' || s === '1' || s === 'yes' || s === 'on') return true;
        return false;
    })
    .optional();

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
        shuffle: urlBooleanSchema,
    })
    .partial();

const playbackUrlSchema = z
    .object({
        intervalMs: z.coerce.number().optional(),
        autoplay: urlBooleanSchema,
        layout: z.enum(['single', 'split']).optional(),
        photoScaleMode: z.enum(['fit_inside', 'fill_crop', 'stretch', 'original']).optional(),
        transitionType: z.enum(['fade', 'slide', 'none']).optional(),
        transitionDuration: z.coerce.number().optional(),
        photoAnimationType: z
            .enum(['none', 'zoom-in', 'zoom-out', 'pan', 'ken-burns'])
            .optional(),
        photoAnimationDuration: z.coerce.number().optional(),
        photoAnimationIntensity: z.coerce.number().optional(),
        livePhotoEnabled: urlBooleanSchema,
        livePhotoDelay: z.coerce.number().optional(),
    })
    .partial();

const configurationUrlSchema = z
    .object({
        dateFormat: z.string().optional(),
        hourFormat: z.enum(['12', '24']).optional(),
        weatherLat: z.coerce.number().optional(),
        weatherLng: z.coerce.number().optional(),
    })
    .partial();

export type UrlQueryOverrides = {
    query?: Partial<components['schemas']['QuerySettings']>;
    playback?: Partial<components['schemas']['PlaybackSettings']>;
    configuration?: Partial<components['schemas']['ConfigurationSettings']>;
};

export const settingsUrlSchemas = {
    query: queryUrlSchema,
    playback: playbackUrlSchema,
    configuration: configurationUrlSchema,
} as const;
