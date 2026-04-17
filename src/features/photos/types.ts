export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type LayoutMode = 'single' | 'split';

export type FilterOperator = 'AND' | 'OR';

/** Default for album, person, and global filter combination operators. */
export const DEFAULT_FILTER_OPERATOR: FilterOperator = 'AND';

/**
 * Filter options for querying photos.
 * Centralized type for reuse across the application.
 */
export interface PhotoFilterParams {
    // Inclusion filters with operators
    albumIds?: string[];
    albumOperator?: FilterOperator;  // Default: 'AND'

    personIds?: string[];
    personOperator?: FilterOperator;  // Default: 'AND'

    // Exclusion filters (always OR'd together, then subtracted)
    excludeAlbumIds?: string[];  // Photos in ANY of these albums will be excluded
    excludePersonIds?: string[];  // Photos with ANY of these people will be excluded

    location?: {
        country?: string;
        state?: string;
        city?: string;
    };

    // Date range filter (ISO date strings) - always AND
    startDate?: string;  // Inclusive start date (YYYY-MM-DD)
    endDate?: string;    // Inclusive end date (YYYY-MM-DD)

    // Global operator between different filter categories
    // e.g., (albums) AND (people) vs (albums) OR (people)
    globalOperator?: FilterOperator;  // Default: 'AND'
}

export type PhotoAnimationType = 'none' | 'zoom-in' | 'zoom-out' | 'pan' | 'ken-burns';

export interface PhotoLocation {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}

export interface PhotoCameraInfo {
    make?: string;        // Camera manufacturer
    model?: string;       // Camera model
    lensModel?: string;   // Lens model
}

export interface PhotoExifSettings {
    fNumber?: number;       // Aperture (f/2.8)
    exposureTime?: string;  // Shutter speed (1/250s)
    iso?: number;          // ISO sensitivity
    focalLength?: number;   // Focal length in mm
}

export interface Photo {
    // Core identifiers
    id: string;
    url: string;
    inAppUrl?: string;  // URL to open photo in the source app
    livePhotoVideoUrl?: string;

    // Essential for layout/display
    width?: number;
    height?: number;
    type: 'IMAGE' | 'VIDEO';

    // Timestamp
    createdAt: Date;

    // Content metadata
    description?: string;
    rating?: number;        // 1-5 star rating
    isFavorite: boolean;
    tags?: string[];

    // Location (structured)
    location?: PhotoLocation;

    // Camera metadata
    camera?: PhotoCameraInfo;
    exifSettings?: PhotoExifSettings;

    // Additional useful fields
    orientation?: string;
    duration?: string;      // For videos
}

export interface PhotoRepo {
    /** Full list matching filters; asset loading is windowed separately (e.g. photo pool). */
    getPhotos: (params: PhotoFilterParams) => Promise<Photo[]>;
}