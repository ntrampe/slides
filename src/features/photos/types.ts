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

export interface PaginationParams extends PhotoFilterParams {
    page?: number;
    pageSize?: number;
}

export interface PaginatedPhotos {
    photos: Photo[];
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export interface PhotoRepo {
    getPhotos: (params: PaginationParams) => Promise<PaginatedPhotos>;
}