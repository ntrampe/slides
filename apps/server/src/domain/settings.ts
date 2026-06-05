import type { DisplaySettings, PlaybackSettings, QuerySettings } from '@slides/api-contract';

/** Server domain mirror of AppSettings from the API contract. */
export interface DomainAppSettings {
    query: DomainQuerySettings;
    playback: DomainPlaybackSettings;
    display: DomainDisplaySettings;
}

export type DomainQuerySettings = QuerySettings;
export type DomainPlaybackSettings = PlaybackSettings;
export type DomainDisplaySettings = DisplaySettings;

export type SettingsDomain = 'query' | 'playback' | 'display';
