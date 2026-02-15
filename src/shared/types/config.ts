export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type LayoutMode = 'single' | 'split';

/**
 * Filter options for selecting photos in slideshows.
 * Centralized type for reuse across the application.
 */
export interface SlideshowFilter {
    albumIds?: string[];
    personIds?: string[];
    location?: {
        country?: string;
        state?: string;
        city?: string;
    };
}