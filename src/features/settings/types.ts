import type { LayoutMode, ObjectFit, PhotoAnimationType, PhotoFilterParams } from "../../features/photos";
import type { ThemeMode } from "../../features/theme";

export interface AppSettings {
    // Slideshow feature
    slideshow: {
        layout: LayoutMode;
        intervalMs: number;
        shuffle: boolean;
        autoplay: boolean;
        filter: PhotoFilterParams;
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
        fit: ObjectFit;
        animation: {
            type: PhotoAnimationType;
            duration: number; // in milliseconds, should match or be slightly longer than intervalMs
            intensity: number; // 1.0 = subtle, 2.0 = dramatic (zoom/pan amount)
        };
        livePhoto: {
            enabled: boolean,
            delay: number, // in milliseconds
        },
        metadata: {
            enabled: boolean;
            dateFormat: string;
        },
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

    // Theme feature
    theme: {
        mode: ThemeMode;
    };

    // Debug feature
    debug: {
        showDebugStats: boolean;
    };

    support: {
        enabled: boolean;
    };
}

export interface SettingsDefaultsRepo {
    fetchDefaults(): Promise<AppSettings>;
}

export interface SettingsOverridesRepo {
    loadOverrides: () => Promise<AppSettings | null>;
    saveOverrides: (settings: AppSettings) => Promise<void>;
    clearOverrides: () => Promise<void>;
}
