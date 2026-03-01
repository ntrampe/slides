import type { PhotoRepo, PaginationParams, PaginatedPhotos, Photo, PhotoLocation, PhotoCameraInfo, PhotoExifSettings } from "../types";

export class ImmichPhotoRepo implements PhotoRepo {
    private proxyUrl = "/api/immich";

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

        const photos: Photo[] = assets.map((asset: any) => {
            // Location data
            const locationData: PhotoLocation | undefined = asset.exifInfo ? {
                city: asset.exifInfo.city,
                state: asset.exifInfo.state,
                country: asset.exifInfo.country,
                latitude: asset.exifInfo.latitude,
                longitude: asset.exifInfo.longitude,
            } : undefined;

            // Camera info
            const cameraInfo: PhotoCameraInfo | undefined = asset.exifInfo ? {
                make: asset.exifInfo.make,
                model: asset.exifInfo.model,
                lensModel: asset.exifInfo.lensModel,
            } : undefined;

            // EXIF settings
            const exifSettings: PhotoExifSettings | undefined = asset.exifInfo ? {
                fNumber: asset.exifInfo.fNumber,
                exposureTime: asset.exifInfo.exposureTime,
                iso: asset.exifInfo.iso,
                focalLength: asset.exifInfo.focalLength,
            } : undefined;

            return {
                id: asset.id,
                url: `${this.proxyUrl}/api/assets/${asset.id}/thumbnail?size=preview`,
                inAppUrl: `https://my.immich.app/photos/${asset.id}`,
                livePhotoVideoUrl: asset.livePhotoVideoId
                    ? `${this.proxyUrl}/api/assets/${asset.livePhotoVideoId}/video/playback`
                    : undefined,
                width: asset.width || asset.exifInfo?.exifImageWidth,
                height: asset.height || asset.exifInfo?.exifImageHeight,
                type: asset.type as 'IMAGE' | 'VIDEO',
                createdAt: new Date(asset.fileCreatedAt ?? asset.createdAt),
                description: asset.exifInfo?.description,
                rating: asset.exifInfo?.rating,
                isFavorite: asset.isFavorite ?? false,
                tags: asset.tags?.map((tag: any) => tag.name) || [],
                location: locationData,
                camera: cameraInfo,
                exifSettings: exifSettings,
                orientation: asset.exifInfo?.orientation,
                duration: asset.duration,
            };
        });

        return {
            photos,
            page,
            pageSize,
            hasMore: assets.length === pageSize,
        };
    }
}