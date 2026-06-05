import type {
    DomainAppSettings,
    DomainDisplaySettings,
    DomainPlaybackSettings,
    DomainQuerySettings,
    SettingsDomain,
} from '../domain/settings.js';
import { parseUrlQueryOverrides } from '../domain/settings/urlQueryOverrides.js';
import type { SettingsStore } from './SettingsStore.js';
import { mergeEffectiveSettings } from '@slides/shared/utils/mergeEffectiveSettings';

/**
 * Owns global configuration: env defaults + persisted per-domain overrides +
 * optional URL query overrides (session-only, highest precedence on GET).
 */
export class SettingsService {
    constructor(
        private readonly defaults: DomainAppSettings,
        private readonly store: SettingsStore
    ) {}

    getDefaults(): DomainAppSettings {
        return this.defaults;
    }

    async getEffective(reqQuery: Record<string, unknown> = {}): Promise<DomainAppSettings> {
        const { query, playback, display } = await this.store.getAllDomainOverrides();
        const urlOverrides = parseUrlQueryOverrides(reqQuery);

        return mergeEffectiveSettings(
            this.defaults,
            {
                ...(query ? { query } : {}),
                ...(playback ? { playback } : {}),
                ...(display ? { display } : {}),
            },
            urlOverrides
        );
    }

    async setQuerySettings(body: DomainQuerySettings): Promise<DomainAppSettings> {
        await this.store.setDomainOverrides('query', body);
        return this.getEffective();
    }

    async setPlaybackSettings(body: DomainPlaybackSettings): Promise<DomainAppSettings> {
        await this.store.setDomainOverrides('playback', body);
        return this.getEffective();
    }

    async setDisplaySettings(body: DomainDisplaySettings): Promise<DomainAppSettings> {
        await this.store.setDomainOverrides('display', body);
        return this.getEffective();
    }

    async clearDomainOverrides(domain: SettingsDomain): Promise<DomainAppSettings> {
        await this.store.clearDomainOverrides(domain);
        return this.getEffective();
    }

    async clearAllOverrides(): Promise<DomainAppSettings> {
        await this.store.clearAllOverrides();
        return this.defaults;
    }
}
