import type { AppSettings } from '../types';

export interface ConfigService {
    fetchDefaultConfig(): Promise<AppSettings>;
}

/**
 * Fetches default configuration from server
 */
export class ApiConfigService implements ConfigService {
    async fetchDefaultConfig(): Promise<AppSettings> {
        const response = await fetch('/api/config');

        if (!response.ok) {
            throw new Error(`Failed to fetch config: ${response.statusText}`);
        }

        return response.json();
    }
}