import type {
    DomainAppSettings,
    DomainConfigurationSettings,
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
        const { query, playback, configuration } = await this.store.getAllDomainOverrides();
        const urlOverrides = parseUrlQueryOverrides(reqQuery);

        return mergeEffectiveSettings(
            this.defaults,
            {
                ...(query ? { query } : {}),
                ...(playback ? { playback } : {}),
                ...(configuration ? { configuration } : {}),
            },
            urlOverrides
        );
    }

    async setQuerySettings(update: Partial<DomainQuerySettings>): Promise<DomainAppSettings> {
        const { query } = await this.store.getAllDomainOverrides();
        const mergedQuery = { ...(query ?? {}), ...update };
        await this.store.setDomainOverrides('query', mergedQuery);
        return this.getEffective();
    }

    async setPlaybackSettings(update: Partial<DomainPlaybackSettings>): Promise<DomainAppSettings> {
        const { playback } = await this.store.getAllDomainOverrides();
        const mergedPlayback = { ...(playback ?? {}), ...update };
        await this.store.setDomainOverrides('playback', mergedPlayback);
        return this.getEffective();
    }

    async setConfigurationSettings(
        update: Partial<DomainConfigurationSettings>
    ): Promise<DomainAppSettings> {
        const { configuration } = await this.store.getAllDomainOverrides();
        const mergedConfiguration = { ...(configuration ?? {}), ...update };
        await this.store.setDomainOverrides('configuration', mergedConfiguration);
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
