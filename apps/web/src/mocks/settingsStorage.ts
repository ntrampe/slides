import type {
    AppSettings,
    ConfigurationSettings,
    PlaybackSettings,
    QuerySettings,
} from '@slides/api-contract';
import { FALLBACK_APP_SETTINGS } from '@slides/shared/constants';
import { mergeEffectiveSettings } from '@slides/shared/utils/mergeEffectiveSettings';

const STORAGE_KEY = 'slides:settings';

export interface MockDomainOverrides {
    query?: QuerySettings;
    playback?: PlaybackSettings;
    configuration?: ConfigurationSettings;
}

export function loadSettingsOverrides(): MockDomainOverrides | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as MockDomainOverrides;
    } catch {
        return null;
    }
}

export function saveDomainOverrides<K extends keyof MockDomainOverrides>(
    domain: K,
    value: Partial<NonNullable<MockDomainOverrides[K]>>
): void {
    const current = loadSettingsOverrides() ?? {};
    const existing = current[domain] ?? {};
    current[domain] = { ...existing, ...value } as NonNullable<MockDomainOverrides[K]>;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function clearDomainOverrides(domain: keyof MockDomainOverrides): void {
    const current = loadSettingsOverrides();
    if (!current) return;
    delete current[domain];
    if (Object.keys(current).length === 0) {
        localStorage.removeItem(STORAGE_KEY);
    } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
}

export function clearSettingsOverrides(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export function getEffectiveMockSettings(
    urlOverrides: {
        query?: Partial<QuerySettings>;
        playback?: Partial<PlaybackSettings>;
        configuration?: Partial<ConfigurationSettings>;
    } = {}
): AppSettings {
    const saved = loadSettingsOverrides() ?? {};
    return mergeEffectiveSettings(FALLBACK_APP_SETTINGS, saved, urlOverrides);
}
