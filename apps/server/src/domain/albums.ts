export interface DomainAlbum {
    id: string;
    name: string;
    description: string | null;
    thumbnailUrl: string;
    assetCount: number;
    createdAt: string;
    updatedAt: string;
    shared: boolean;
}
