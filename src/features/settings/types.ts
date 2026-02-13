import type { LayoutMode, ObjectFit } from "../../shared/types/config";

export interface AppSettings {
    slideshow: {
        layout: LayoutMode;
        photoFit: ObjectFit;
        intervalMs: number;
    };
    clock: {
        show24HourFormat: boolean;
        dateFormat: string;
    },
    weather: {
        location: {
            lat: number;
            lng: number;
        },
    },
    ui: {
        showClock: boolean;
        showWeather: boolean;
        showProgressBar: boolean;
        showPhotoMetadata: boolean;
        fontSize: 'sm' | 'base' | 'lg' | 'xl';
    };
    debug: {
        showDebugStats: boolean;
    },
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
    clock: {
        show24HourFormat: false,
        dateFormat: 'MMM dd, yyyy',
    },
    weather: {
        location: {
            lat: 51.5074,
            lng: -0.1278,
        },
    },
    ui: {
        showClock: true,
        showWeather: false,
        showProgressBar: true,
        showPhotoMetadata: true,
        fontSize: 'base',
    },
    debug: {
        showDebugStats: false,
    }
};

export default defaultSettings;