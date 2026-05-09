import type { AppSettings, SettingsOverridesRepo } from '../types';

/**
 * Persists user settings overrides to the backend API.
 */
export class ApiSettingsOverridesRepo implements SettingsOverridesRepo {
    async loadOverrides(): Promise<AppSettings | null> {
        const response = await fetch('/api/settings');

        if (!response.ok) {
            throw new Error(`Failed to load settings overrides: ${response.statusText}`);
        }

        const data = (await response.json()) as AppSettings;
        return Object.keys(data).length > 0 ? data : null;
    }

    async saveOverrides(settings: AppSettings): Promise<void> {
        const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });

        if (!response.ok) {
            throw new Error(`Failed to save settings overrides: ${response.statusText}`);
        }
    }

    async clearOverrides(): Promise<void> {
        const response = await fetch('/api/settings', {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to clear settings overrides: ${response.statusText}`);
        }
    }
}
