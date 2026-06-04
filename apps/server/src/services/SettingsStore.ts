import type { DomainAppSettings } from '../domain/settings.js';
import type { DeepPartial } from '@slides/shared/utils/deepMerge';

export interface SettingsStore {
    getOverrides(): Promise<DeepPartial<DomainAppSettings> | null>;
    setOverrides(overrides: DeepPartial<DomainAppSettings>): Promise<void>;
    clearOverrides(): Promise<void>;
}
