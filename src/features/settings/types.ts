import type { LayoutMode, ObjectFit, SlideshowFilter } from "../../shared/types/config";
import type { ThemeMode } from "../theme";

export interface AppSettings {
    slideshow: {
        layout: LayoutMode;
        intervalMs: number;
        shuffle: boolean;
        autoplay: boolean;
        filter: SlideshowFilter;
    };
    photo: {
        fit: ObjectFit;
        dateFormat: string;
    },
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
    theme: {
        mode: ThemeMode;
    },
    debug: {
        showDebugStats: boolean;
    },
}

export interface SettingsService {
    loadSettings: () => Promise<AppSettings>;
    saveSettings: (settings: AppSettings) => Promise<void>;
}

// Export the builder function for use by services
export { buildDefaultSettings as getDefaultSettings } from './utils/buildDefaultSettings';