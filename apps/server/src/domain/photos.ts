export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type LayoutMode = 'single' | 'split';
export type FilterOperator = 'AND' | 'OR';

export type PhotoAnimationType = 'none' | 'zoom-in' | 'zoom-out' | 'pan' | 'ken-burns';

export interface DomainPhotoLocation {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}

export interface DomainPhotoCameraInfo {
    make?: string;
    model?: string;
    lensModel?: string;
}

export interface DomainPhotoExifSettings {
    fNumber?: number;
    exposureTime?: string;
    iso?: number;
    focalLength?: number;
}

export interface DomainPhoto {
    id: string;
    url: string;
    inAppUrl?: string;
    livePhotoVideoUrl?: string;
    width?: number;
    height?: number;
    type: 'IMAGE' | 'VIDEO';
    createdAt: string;
    description?: string;
    rating?: number;
    isFavorite: boolean;
    tags?: string[];
    location?: DomainPhotoLocation;
    camera?: DomainPhotoCameraInfo;
    exifSettings?: DomainPhotoExifSettings;
    orientation?: string;
    duration?: string;
}
