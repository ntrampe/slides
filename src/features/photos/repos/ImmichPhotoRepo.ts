import type { PhotoRepo, PaginationParams, PaginatedPhotos } from "../types";

export class ImmichPhotoRepo implements PhotoRepo {
    private proxyUrl = "/immich";

    async getPhotos(params: PaginationParams = {}): Promise<PaginatedPhotos> {
        const {
            page = 1,
            pageSize = 100,
            albumIds,
            personIds,
            location,
        } = params;

        const searchBody: any = {
            page,
            size: pageSize,
            type: "IMAGE",
            withExif: true,
        };

        if (albumIds && albumIds.length > 0) searchBody.albumIds = albumIds;
        if (personIds && personIds.length > 0) searchBody.personIds = personIds;

        // Add location filters if provided
        if (location?.country) searchBody.country = location.country;
        if (location?.state) searchBody.state = location.state;
        if (location?.city) searchBody.city = location.city;

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
            location: [
                asset.exifInfo?.city,
                asset.exifInfo?.state,
                asset.exifInfo?.country
            ]
                .filter(Boolean)
                .join(", "),
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