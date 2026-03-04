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
    // Date range filter (ISO date strings)
    startDate?: string;  // Inclusive start date (YYYY-MM-DD)
    endDate?: string;    // Inclusive end date (YYYY-MM-DD)
}