import type { AppSettings, SettingsService } from "../types";

/**
 * Manages settings persistence in localStorage.
 * Does not handle defaults - that's done by useSettingsData hook.
 */
export class LocalSettingsService implements SettingsService {
    private KEY = 'immich_slides_settings';

    async loadSettings(): Promise<AppSettings | null> {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : null;
    }

    async saveSettings(settings: AppSettings): Promise<void> {
        localStorage.setItem(this.KEY, JSON.stringify(settings));
    }
}