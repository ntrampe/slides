import type { AppSettings, SettingsRepo } from '../types';

/**
 * Persists user settings overrides to the backend API.
 */
export class ApiSettingsRepo implements SettingsRepo {
    async loadSettings(): Promise<AppSettings | null> {
        const response = await fetch('/api/settings');

        if (!response.ok) {
            throw new Error(`Failed to load settings: ${response.statusText}`);
        }

        const data = (await response.json()) as AppSettings;
        return Object.keys(data).length > 0 ? data : null;
    }

    async saveSettings(settings: AppSettings): Promise<void> {
        const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });

        if (!response.ok) {
            throw new Error(`Failed to save settings: ${response.statusText}`);
        }
    }

    async clearSettings(): Promise<void> {
        const response = await fetch('/api/settings', {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to clear settings: ${response.statusText}`);
        }
    }
}
