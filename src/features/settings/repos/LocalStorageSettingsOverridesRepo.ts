import type { AppSettings, SettingsOverridesRepo } from "../types";

/**
 * Manages settings overrides persistence in localStorage.
 * Does not handle defaults - that's done by useSettingsData hook.
 */
export class LocalStorageSettingsOverridesRepo implements SettingsOverridesRepo {
    private KEY = 'slides:settings';

    async loadOverrides(): Promise<AppSettings | null> {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : null;
    }

    async saveOverrides(settings: AppSettings): Promise<void> {
        localStorage.setItem(this.KEY, JSON.stringify(settings));
    }

    async clearOverrides(): Promise<void> {
        localStorage.removeItem(this.KEY);
    }
}
