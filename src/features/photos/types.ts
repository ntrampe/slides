import type { SlideshowFilter } from '../../shared/types/config';

export interface Photo {
    id: string;
    url: string;
    location?: string;
    createdAt: Date;
    description?: string;
}

export interface PaginationParams extends SlideshowFilter {
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