import type { AppSettings } from '@slides/api-contract';
import type { DeepPartial } from '@slides/shared/utils/deepMerge';

const OVERRIDES_KEY = 'slides:settings';

export function loadSettingsOverrides(): DeepPartial<AppSettings> | null {
    const data = localStorage.getItem(OVERRIDES_KEY);
    return data ? (JSON.parse(data) as DeepPartial<AppSettings>) : null;
}

export function saveSettingsOverrides(settings: DeepPartial<AppSettings>): void {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(settings));
}

export function clearSettingsOverrides(): void {
    localStorage.removeItem(OVERRIDES_KEY);
}
