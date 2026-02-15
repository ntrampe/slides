import type { LayoutMode, ObjectFit, SlideshowFilter } from "../../shared/types/config";
import type { ThemeMode } from "../theme";

export interface AppSettings {
    // Slideshow feature
    slideshow: {
        layout: LayoutMode;
        intervalMs: number;
        shuffle: boolean;
        autoplay: boolean;
        filter: SlideshowFilter;
        transition: {
            type: 'fade' | 'slide' | 'none';
            duration: number; // in milliseconds
        };
        ui: {
            showProgressBar: boolean;
        }
    };

    // Photos feature
    photos: {
        display: {
            fit: ObjectFit;
            showMetadata: boolean;
        }
        dateFormat: string;
    };

    // Clock feature
    clock: {
        enabled: boolean;
        use24HourFormat: boolean;
        dateFormat: string;
    };

    // Weather feature
    weather: {
        enabled: boolean;
        location: {
            lat: number;
            lng: number;
        };
    };

    // UI feature (shared/global UI settings)
    ui: {
        fontSize: 'sm' | 'base' | 'lg' | 'xl';
    };

    // Theme feature
    theme: {
        mode: ThemeMode;
    };

    // Debug feature
    debug: {
        showDebugStats: boolean;
    };
}

export interface SettingsService {
    loadSettings: () => Promise<AppSettings>;
    saveSettings: (settings: AppSettings) => Promise<void>;
}

// Export the builder function for use by services
export { buildDefaultSettings as getDefaultSettings } from './utils/buildDefaultSettings';