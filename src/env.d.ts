/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Existing
    readonly VITE_USE_MOCK?: string;
    readonly VITE_OWM_KEY?: string;

    // Settings Defaults
    readonly VITE_DEFAULT_LAYOUT?: 'single' | 'split';
    readonly VITE_DEFAULT_INTERVAL_MS?: string;
    readonly VITE_DEFAULT_SHUFFLE?: string;
    readonly VITE_DEFAULT_AUTOPLAY?: string;
    readonly VITE_DEFAULT_OBJECT_FIT?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    readonly VITE_DEFAULT_THEME?: 'light' | 'dark' | 'system';
    readonly VITE_DEFAULT_SHOW_CLOCK?: string;
    readonly VITE_DEFAULT_SHOW_WEATHER?: string;
    readonly VITE_DEFAULT_SHOW_PROGRESS_BAR?: string;
    readonly VITE_DEFAULT_SHOW_PHOTO_METADATA?: string;
    readonly VITE_DEFAULT_FONT_SIZE?: 'sm' | 'base' | 'lg' | 'xl';
    readonly VITE_DEFAULT_24_HOUR_FORMAT?: string;
    readonly VITE_DEFAULT_WEATHER_LAT?: string;
    readonly VITE_DEFAULT_WEATHER_LNG?: string;
    readonly VITE_DEFAULT_ALBUM_IDS?: string; // Comma-separated
    readonly VITE_DEFAULT_PERSON_IDS?: string; // Comma-separated
    readonly VITE_DEFAULT_LOCATION_COUNTRY?: string;
    readonly VITE_DEFAULT_LOCATION_STATE?: string;
    readonly VITE_DEFAULT_LOCATION_CITY?: string;
    readonly VITE_DEFAULT_TRANSITION_TYPE?: 'fade' | 'slide' | 'none';
    readonly VITE_DEFAULT_TRANSITION_DURATION?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}