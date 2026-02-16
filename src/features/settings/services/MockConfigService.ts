import { FALLBACK_APP_SETTINGS } from '../constants';
import type { AppSettings } from '../types';

export interface ConfigService {
    fetchDefaultConfig(): Promise<AppSettings>;
}

/**
 * Fetches default configuration from server
 */
export class MockConfigService implements ConfigService {
    async fetchDefaultConfig(): Promise<AppSettings> {
        return FALLBACK_APP_SETTINGS;
    }
}