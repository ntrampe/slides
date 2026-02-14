import type { PhotoService, PaginationParams, PaginatedPhotos } from "../types";

export class ImmichPhotoService implements PhotoService {
    private proxyUrl = "/immich";

    async getPhotos(params: PaginationParams = {}): Promise<PaginatedPhotos> {
        const {
            page = 1,
            pageSize = 100,
            albumIds,
            personIds,
        } = params;

        const searchBody: any = {
            page,
            size: pageSize,
            type: "IMAGE",
        };

        if (albumIds && albumIds.length > 0) searchBody.albumIds = albumIds;
        if (personIds && personIds.length > 0) searchBody.personIds = personIds;

        const res = await fetch(`${this.proxyUrl}/api/search/metadata`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(searchBody),
        });

        if (!res.ok) {
            throw new Error(`Immich search failed: ${res.status}`);
        }

        const json = await res.json();

        const assets = json.assets?.items ?? [];

        const photos = assets.map((asset: any) => ({
            id: asset.id,
            url: `${this.proxyUrl}/api/assets/${asset.id}/thumbnail?size=preview`,
            createdAt: new Date(asset.fileCreatedAt ?? asset.createdAt),
            location:
                asset.exifInfo?.city ??
                asset.exifInfo?.state ??
                asset.exifInfo?.country ??
                "Unknown",
            description: asset.exifInfo?.description,
        }));

        return {
            photos,
            page,
            pageSize,
            hasMore: assets.length === pageSize,
        };
    }
}