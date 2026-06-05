import { settingsUrlSchemas, type UrlQueryOverrides } from '@slides/api-contract';

export type { UrlQueryOverrides };

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Parse bracket-notation URL overrides from Express req.query.
 * Express extended parsing nests domains before this runs; only query,
 * playback, and configuration are validated. Reserved top-level params (seed,
 * cursor, limit) are ignored.
 */
export function parseUrlQueryOverrides(
    query: Record<string, unknown>
): UrlQueryOverrides {
    const overrides: UrlQueryOverrides = {};

    if (isPlainObject(query.query)) {
        const result = settingsUrlSchemas.query.safeParse(query.query);
        if (result.success && Object.keys(result.data).length > 0) {
            overrides.query = result.data;
        }
    }

    if (isPlainObject(query.playback)) {
        const result = settingsUrlSchemas.playback.safeParse(query.playback);
        if (result.success && Object.keys(result.data).length > 0) {
            overrides.playback = result.data;
        }
    }

    if (isPlainObject(query.configuration)) {
        const result = settingsUrlSchemas.configuration.safeParse(query.configuration);
        if (result.success && Object.keys(result.data).length > 0) {
            overrides.configuration = result.data;
        }
    }

    return overrides;
}
