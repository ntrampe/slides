import { FALLBACK_APP_SETTINGS } from '../constants';
import type { AppSettings } from '../types';

export interface ConfigRepo {
    fetchDefaultConfig(): Promise<AppSettings>;
}

/**
 * Fetches default configuration from server
 */
export class MockConfigRepo implements ConfigRepo {
    async fetchDefaultConfig(): Promise<AppSettings> {
        return FALLBACK_APP_SETTINGS;
    }
}