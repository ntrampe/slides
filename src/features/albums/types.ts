export interface Album {
    id: string;
    name: string;
    description: string | null;
    thumbnailUrl: string;
    assetCount: number;
    createdAt: string;
    updatedAt: string;
    shared: boolean;
}

export interface AlbumRepo {
    getAlbums: () => Promise<Album[]>;
}
