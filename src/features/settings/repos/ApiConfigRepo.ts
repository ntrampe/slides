import type { AppSettings, ConfigRepo } from '../types';

/**
 * Fetches default configuration from server
 */
export class ApiConfigRepo implements ConfigRepo {
    async fetchDefaultConfig(): Promise<AppSettings> {
        const response = await fetch('/api/config');

        if (!response.ok) {
            throw new Error(`Failed to fetch config: ${response.statusText}`);
        }

        return response.json();
    }
}