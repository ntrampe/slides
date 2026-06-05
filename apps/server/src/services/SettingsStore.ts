import type {
    DomainAppSettings,
    DomainDisplaySettings,
    DomainPlaybackSettings,
    DomainQuerySettings,
    SettingsDomain,
} from '../domain/settings.js';

export interface SettingsStore {
    getAllDomainOverrides(): Promise<{
        query: DomainQuerySettings | null;
        playback: DomainPlaybackSettings | null;
        display: DomainDisplaySettings | null;
    }>;
    setDomainOverrides(
        domain: SettingsDomain,
        value: DomainAppSettings[SettingsDomain]
    ): Promise<void>;
    clearDomainOverrides(domain: SettingsDomain): Promise<void>;
    clearAllOverrides(): Promise<void>;
}
