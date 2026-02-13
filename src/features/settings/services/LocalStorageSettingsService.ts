import type { AppSettings, SettingsService } from "../types";
import defaultSettings from "../types";

export class LocalSettingsService implements SettingsService {
    private KEY = 'immich_slides_settings';

    async loadSettings(): Promise<AppSettings> {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : defaultSettings;
    }

    async saveSettings(settings: AppSettings): Promise<void> {
        localStorage.setItem(this.KEY, JSON.stringify(settings));
    }
}