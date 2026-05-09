import type { AppSettings, SettingsDefaultsRepo } from '../types';

/**
 * Fetches settings defaults from the backend.
 */
export class ApiSettingsDefaultsRepo implements SettingsDefaultsRepo {
    async fetchDefaults(): Promise<AppSettings> {
        const response = await fetch('/api/settings/defaults');

        if (!response.ok) {
            throw new Error(`Failed to fetch settings defaults: ${response.statusText}`);
        }

        return response.json();
    }
}
