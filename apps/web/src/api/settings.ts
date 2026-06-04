import type { AppSettings } from '@slides/api-contract';
import { apiGet, apiPut, apiDelete } from './http.js';
import type { DeepPartial } from '@slides/shared/utils/deepMerge';

export async function fetchSettingsResolved(search: string): Promise<AppSettings> {
    const path = search.length > 0 ? `/settings/resolved${search}` : '/settings/resolved';
    return apiGet<AppSettings>(path);
}

export async function loadSettingsOverrides(): Promise<DeepPartial<AppSettings> | null> {
    const data = await apiGet<DeepPartial<AppSettings>>('/settings');
    return Object.keys(data).length > 0 ? data : null;
}

export async function saveSettingsOverrides(settings: DeepPartial<AppSettings>): Promise<void> {
    await apiPut<DeepPartial<AppSettings>>('/settings', settings);
}

export async function clearSettingsOverrides(): Promise<void> {
    await apiDelete('/settings');
}
