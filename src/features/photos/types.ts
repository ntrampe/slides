export interface Photo {
    id: string;
    url: string;
    location?: string;
    createdAt: Date;
    description?: string;
}

export interface PhotoService {
    getPhotos: (params: { albumId?: string; personId?: string }) => Promise<Photo[]>;
}