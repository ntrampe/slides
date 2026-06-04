import type { DomainAppSettings } from '../domain/settings.js';
import { parseUrlSettings } from '../domain/settings/urlSettingsParser.js';
import { deepMerge, type DeepPartial } from '@slides/shared/utils/deepMerge';
import type { SettingsStore } from './SettingsStore.js';

/**
 * Owns settings resolution business logic on the server: runtime defaults
 * (from DEFAULT_* env vars), persisted user overrides, and merging of
 * URL/query overrides into a fully resolved configuration.
 */
export class SettingsService {
    constructor(
        private readonly defaults: DomainAppSettings,
        private readonly store: SettingsStore
    ) {}

    getDefaults(): DomainAppSettings {
        return this.defaults;
    }

    async getOverrides(): Promise<DeepPartial<DomainAppSettings>> {
        return (await this.store.getOverrides()) ?? {};
    }

    async setOverrides(overrides: DeepPartial<DomainAppSettings>): Promise<void> {
        await this.store.setOverrides(overrides);
    }

    async clearOverrides(): Promise<void> {
        await this.store.clearOverrides();
    }

    async resolve(search: string): Promise<DomainAppSettings> {
        const urlOverrides = search
            ? parseUrlSettings(stripNonSettingsQueryParams(search), this.defaults)
            : {};

        let merged = deepMerge(this.defaults, urlOverrides);
        merged = deepMerge(merged, await this.getOverrides());
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
