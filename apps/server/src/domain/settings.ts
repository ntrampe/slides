import type {
    ConfigurationSettings,
    PlaybackSettings,
    QuerySettings,
} from '@slides/api-contract';

/** Server domain mirror of AppSettings from the API contract. */
export interface DomainAppSettings {
    query: DomainQuerySettings;
    playback: DomainPlaybackSettings;
    configuration: DomainConfigurationSettings;
}

export type DomainQuerySettings = QuerySettings;
export type DomainPlaybackSettings = PlaybackSettings;
export type DomainConfigurationSettings = ConfigurationSettings;

export type SettingsDomain = 'query' | 'playback' | 'configuration';
