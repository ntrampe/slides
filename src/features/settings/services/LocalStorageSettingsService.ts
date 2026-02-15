import type { AppSettings, SettingsService } from "../types";
import { getDefaultSettings } from "../types";

export class LocalSettingsService implements SettingsService {
    private KEY = 'immich_slides_settings';
    private defaultSettings: AppSettings;

    constructor() {
        // Build defaults from environment variables once during construction
        this.defaultSettings = getDefaultSettings();
    }

    async loadSettings(): Promise<AppSettings> {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : this.defaultSettings;
    }

    async saveSettings(settings: AppSettings): Promise<void> {
        localStorage.setItem(this.KEY, JSON.stringify(settings));
    }
}