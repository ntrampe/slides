export interface Photo {
    id: string;
    url: string;
    location?: string;
    createdAt: Date;
    description?: string;
}

export interface PaginationParams {
    page?: number;
    pageSize?: number;
    albumId?: string;
    personId?: string;
}

export interface PaginatedPhotos {
    photos: Photo[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export interface PhotoService {
    getPhotos: (params: PaginationParams) => Promise<PaginatedPhotos>;
}