import type {
    AppSettings,
    ConfigurationSettings,
    PlaybackSettings,
    QuerySettings,
} from '@slides/api-contract';
import { apiDelete, apiGet, apiPatch } from './http.js';

export async function fetchSettings(search = ''): Promise<AppSettings> {
    const path = search.length > 0 ? `/settings${search}` : '/settings';
    return apiGet<AppSettings>(path);
}

export async function patchQuerySettings(query: Partial<QuerySettings>): Promise<AppSettings> {
    return apiPatch<AppSettings>('/settings/query', query);
}

export async function patchPlaybackSettings(playback: Partial<PlaybackSettings>): Promise<AppSettings> {
    return apiPatch<AppSettings>('/settings/playback', playback);
}

export async function patchConfigurationSettings(
    configuration: Partial<ConfigurationSettings>
): Promise<AppSettings> {
    return apiPatch<AppSettings>('/settings/configuration', configuration);
}

export async function clearAllSettings(): Promise<void> {
    await apiDelete('/settings');
}

export async function clearQuerySettings(): Promise<void> {
    await apiDelete('/settings/query');
}

export async function clearPlaybackSettings(): Promise<void> {
    await apiDelete('/settings/playback');
}

export async function clearConfigurationSettings(): Promise<void> {
    await apiDelete('/settings/configuration');
}
