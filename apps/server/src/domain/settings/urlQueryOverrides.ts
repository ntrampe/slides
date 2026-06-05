import { z } from 'zod';
import type { AppSettings } from '@slides/api-contract';

const RESERVED_QUERY_PARAMS = new Set(['seed', 'cursor', 'limit']);

const idArraySchema = z.union([
    z.array(z.string()),
    z.string().transform((s) =>
        s
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
    ),
]);

const filterOperatorSchema = z.enum(['AND', 'OR']);

const queryUrlSchema = z
    .object({
        albumIds: idArraySchema.optional(),
        albumOperator: filterOperatorSchema.optional(),
        personIds: idArraySchema.optional(),
        personOperator: filterOperatorSchema.optional(),
        excludeAlbumIds: idArraySchema.optional(),
        excludePersonIds: idArraySchema.optional(),
        locationCountry: z.string().optional(),
        locationState: z.string().optional(),
        locationCity: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        globalOperator: filterOperatorSchema.optional(),
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
    query?: Partial<AppSettings['query']>;
    playback?: Partial<AppSettings['playback']>;
    display?: Partial<AppSettings['display']>;
};

/**
 * Parse bracket-notation URL overrides from Express req.query.
 * e.g. ?query[shuffle]=false&display[weatherLat]=51.5
 */
export function parseUrlQueryOverrides(
    query: Record<string, unknown>
): UrlQueryOverrides {
    const overrides: UrlQueryOverrides = {};

    for (const key of Object.keys(query)) {
        if (RESERVED_QUERY_PARAMS.has(key)) continue;
    }

    const queryDomain = query.query;
    if (queryDomain && typeof queryDomain === 'object') {
        const result = queryUrlSchema.safeParse(queryDomain);
        if (result.success && Object.keys(result.data).length > 0) {
            overrides.query = result.data;
        }
    }

    const playbackDomain = query.playback;
    if (playbackDomain && typeof playbackDomain === 'object') {
        const result = playbackUrlSchema.safeParse(playbackDomain);
        if (result.success && Object.keys(result.data).length > 0) {
            overrides.playback = result.data;
        }
    }

    const displayDomain = query.display;
    if (displayDomain && typeof displayDomain === 'object') {
        const result = displayUrlSchema.safeParse(displayDomain);
        if (result.success && Object.keys(result.data).length > 0) {
            overrides.display = result.data;
        }
    }

    return overrides;
}
