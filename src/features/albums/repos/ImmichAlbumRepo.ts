import type { AlbumRepo, Album } from '../types';

export class ImmichAlbumRepo implements AlbumRepo {
    private proxyUrl = "/immich";

    async getAlbums(): Promise<Album[]> {
        const res = await fetch(`${this.proxyUrl}/api/albums`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            throw new Error(`Immich albums fetch failed: ${res.status}`);
        }

        const albums = await res.json();

        // Map API response to domain Album type
        return albums.map((album: any) => ({
            id: album.id,
            name: album.albumName,
            description: album.description ?? null,
            thumbnailUrl: album.albumThumbnailAssetId 
                ? `${this.proxyUrl}/api/assets/${album.albumThumbnailAssetId}/thumbnail?size=preview`
                : '',
            assetCount: album.assetCount ?? 0,
            createdAt: album.createdAt,
            updatedAt: album.updatedAt,
            shared: album.shared ?? false
        }));
    }
}
