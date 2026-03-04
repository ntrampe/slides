export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type LayoutMode = 'single' | 'split';

/**
 * Filter options for querying photos.
 * Centralized type for reuse across the application.
 */
export interface PhotoFilterParams {
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