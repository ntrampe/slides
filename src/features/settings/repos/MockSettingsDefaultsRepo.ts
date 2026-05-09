import { FALLBACK_APP_SETTINGS } from '../../../shared/constants';
import type { AppSettings, SettingsDefaultsRepo } from '../types';

export class MockSettingsDefaultsRepo implements SettingsDefaultsRepo {
    async fetchDefaults(): Promise<AppSettings> {
        return FALLBACK_APP_SETTINGS;
    }
}
