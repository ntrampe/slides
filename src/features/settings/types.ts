import type { LayoutMode, ObjectFit } from "../../shared/types/config";

export interface AppSettings {
    slideshow: {
        layout: LayoutMode;
        photoFit: ObjectFit;
        intervalMs: number;
    };
    ui: {
        showClock: boolean;
        showWeather: boolean;
        showProgressBar: boolean;
        showPhotoMetadata: boolean;
        fontSize: 'sm' | 'base' | 'lg' | 'xl';
    };
}

export interface SettingsService {
    loadSettings: () => Promise<AppSettings>;
    saveSettings: (settings: AppSettings) => Promise<void>;
}

const defaultSettings: AppSettings = {
    slideshow: {
        layout: 'single',
        photoFit: 'cover',
        intervalMs: 5000,
    },
    ui: {
        showClock: true,
        showWeather: false,
        showProgressBar: true,
        showPhotoMetadata: true,
        fontSize: 'base',
    },
};

export default defaultSettings;