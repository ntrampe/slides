import type { DomainAppSettings } from '../domain/settings.js';
import { parseUrlSettings } from '../domain/settings/urlSettingsParser.js';
import { deepMerge, type DeepPartial } from '@slides/shared/utils/deepMerge';

/**
 * Owns settings resolution business logic on the server: runtime defaults
 * (from DEFAULT_* env vars), persisted user overrides, and merging of
 * URL/query overrides into a fully resolved configuration.
 */
export class SettingsService {
    private userOverrides: DeepPartial<DomainAppSettings> | null = null;

    constructor(private readonly defaults: DomainAppSettings) {}

    getDefaults(): DomainAppSettings {
        return this.defaults;
    }

    getOverrides(): DeepPartial<DomainAppSettings> {
        return this.userOverrides ?? {};
    }

    setOverrides(overrides: DeepPartial<DomainAppSettings>): void {
        this.userOverrides = overrides;
    }

    clearOverrides(): void {
        this.userOverrides = null;
    }

    resolve(search: string): DomainAppSettings {
        const urlOverrides = search
            ? parseUrlSettings(stripNonSettingsQueryParams(search), this.defaults)
            : {};

        let merged = deepMerge(this.defaults, urlOverrides);
        merged = deepMerge(merged, this.getOverrides());
        return merged;
    }
}

const NON_SETTINGS_QUERY_PARAMS = new Set(['seed', 'cursor', 'limit', 'filter']);

function stripNonSettingsQueryParams(search: string): string {
    if (!search) return '';
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    for (const key of NON_SETTINGS_QUERY_PARAMS) {
        params.delete(key);
    }
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}
