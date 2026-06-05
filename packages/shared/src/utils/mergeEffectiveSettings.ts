import type { AppSettings } from '@slides/api-contract';

type DomainOverrides = {
    query?: Partial<AppSettings['query']>;
    playback?: Partial<AppSettings['playback']>;
    configuration?: Partial<AppSettings['configuration']>;
};

/**
 * Shallow-merge per domain: defaults ← persisted overrides ← URL overrides.
 */
export function mergeEffectiveSettings(
    defaults: AppSettings,
    persisted: DomainOverrides = {},
    urlOverrides: DomainOverrides = {}
): AppSettings {
    return {
        query: { ...defaults.query, ...persisted.query, ...urlOverrides.query },
        playback: { ...defaults.playback, ...persisted.playback, ...urlOverrides.playback },
        configuration: {
            ...defaults.configuration,
            ...persisted.configuration,
            ...urlOverrides.configuration,
        },
    };
}
