import type { ThemeMode } from '../theme/types';

export type {
    AppSettings,
    QuerySettings,
    PlaybackSettings,
    ConfigurationSettings,
    FilterOperator,
} from '@slides/api-contract';

/** Client-local presentation toggles (not in the API contract). */
export interface PresentationSettings {
    themeMode: ThemeMode;
    showClock: boolean;
    showWeather: boolean;
    showProgressBar: boolean;
    photoMetadataEnabled: boolean;
    showDebugStats: boolean;
    supportEnabled: boolean;
}

export const DEFAULT_PRESENTATION_SETTINGS: PresentationSettings = {
    themeMode: 'dark',
    showProgressBar: true,
    showDebugStats: false,
    supportEnabled: true,
    photoMetadataEnabled: true,
    showClock: true,
    showWeather: false,
};
