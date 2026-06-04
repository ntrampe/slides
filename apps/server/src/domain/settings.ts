import type {
    DomainPhotoFilterParams,
    LayoutMode,
    ObjectFit,
    PhotoAnimationType,
} from './photos.js';
import type { ThemeMode } from './theme.js';

export type SlideshowTransitionType = 'fade' | 'slide' | 'none';

export interface DomainAppSettings {
    slideshow: {
        layout: LayoutMode;
        intervalMs: number;
        shuffle: boolean;
        autoplay: boolean;
        filter: DomainPhotoFilterParams;
        transition: {
            type: SlideshowTransitionType;
            duration: number;
        };
        ui: {
            showProgressBar: boolean;
        };
    };
    photos: {
        fit: ObjectFit;
        animation: {
            type: PhotoAnimationType;
            duration: number;
            intensity: number;
        };
        livePhoto: {
            enabled: boolean;
            delay: number;
        };
        metadata: {
            enabled: boolean;
            dateFormat: string;
        };
    };
    clock: {
        enabled: boolean;
        use24HourFormat: boolean;
        dateFormat: string;
    };
    weather: {
        enabled: boolean;
        location: {
            lat: number;
            lng: number;
        };
    };
    theme: {
        mode: ThemeMode;
    };
    debug: {
        showDebugStats: boolean;
    };
    support: {
        enabled: boolean;
    };
}
