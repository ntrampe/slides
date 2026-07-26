import type { ImmichClient } from './ImmichClient';
import type { LinkBuilder } from '../infra/LinkBuilder';
import type {
    DomainPhoto,
    DomainPhotoCameraInfo,
    DomainPhotoExifSettings,
    DomainPhotoLocation,
} from '../domain/photos.js';

/** Max assets per Immich metadata search request (API ceiling). */
const IMMICH_SEARCH_PAGE_SIZE = 1000;

/**
 * A single Immich metadata search. This is the infrastructure-level query shape
 * (one concrete set of criteria); the application layer fans filter params out
 * into one or more of these.
 */
export interface PhotoQuery {
    albumIds?: string[];
    personIds?: string[];
    location?: {
        country?: string;
        state?: string;
        city?: string;
    };
    startDate?: string;
    endDate?: string;
}

interface ImmichSearchResponse {
    assets?: { items?: ImmichAsset[] };
}

/** Immich asset DTO shape (fields accessed by this gateway). */
interface ImmichAsset {
    id: string;
    type: string;
    isFavorite: boolean;
    fileCreatedAt?: string;
    createdAt?: string;
    width?: number;
    height?: number;
    duration?: string;
    livePhotoVideoId?: string;
    tags?: { name: string }[];
    exifInfo?: {
        city?: string;
        state?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
        make?: string;
        model?: string;
        lensModel?: string;
        fNumber?: number;
        exposureTime?: string;
        iso?: number;
        focalLength?: number;
        exifImageWidth?: number;
        exifImageHeight?: number;
        description?: string;
        rating?: number;
        orientation?: string;
    };
}

/**
 * Infrastructure adapter for Immich photo search. Owns the Immich wire details:
 * search-body construction, pagination, the Immich asset DTO shape, and mapping
 * that DTO onto the `DomainPhoto` wire model (with absolute media URLs built
 * via the LinkBuilder).
 *
 * It contains no filter/operator business logic — that lives in the application
 * layer (`PhotoQueryService`).
 */
export class ImmichPhotoGateway {
    constructor(private readonly immich: ImmichClient) {}

    /** Runs one metadata search to completion and maps results to DomainPhoto. */
    async search(query: PhotoQuery, links: LinkBuilder): Promise<DomainPhoto[]> {
        const photos: DomainPhoto[] = [];
        await this.paginate(query, true, (assets) => {
            for (const asset of assets) {
                photos.push(this.mapAssetToPhoto(asset, links));
            }
        });
        return photos;
    }

    /**
     * Fetches only the matching asset IDs. Skips EXIF and the full mapping path
     * since callers (e.g. exclusion sets) only need IDs.
     */
    async searchIds(query: PhotoQuery): Promise<string[]> {
        const ids: string[] = [];
        await this.paginate(query, false, (assets) => {
            for (const asset of assets) {
                ids.push(asset.id);
            }
        });
        return ids;
    }

    /**
     * Walks Immich `page` until a page returns fewer than the page size,
     * invoking `onPage` with each batch.
     */
    private async paginate(
        query: PhotoQuery,
        withExif: boolean,
        onPage: (assets: ImmichAsset[]) => void
    ): Promise<void> {
        let page = 1;
        for (;;) {
            const json = await this.immich.post<ImmichSearchResponse>(
                '/api/search/metadata',
                this.buildSearchBody(query, page, withExif)
            );
            const assets = json.assets?.items ?? [];
            onPage(assets);

            if (assets.length < IMMICH_SEARCH_PAGE_SIZE) break;
            page += 1;
        }
    }

    private buildSearchBody(
        query: PhotoQuery,
        page: number,
        withExif: boolean
    ): Record<string, unknown> {
        const body: Record<string, unknown> = {
            page,
            size: IMMICH_SEARCH_PAGE_SIZE,
            // Only IMAGE assets are fetched for slideshow display. Native video
            // (non-live-photo) is not currently supported. Live-photo videos are
            // fetched separately via the /assets/:id/video proxy.
            type: 'IMAGE',
            withExif,
        };

        if (query.albumIds && query.albumIds.length > 0) body.albumIds = query.albumIds;
        if (query.personIds && query.personIds.length > 0) body.personIds = query.personIds;
        if (query.location?.country) body.country = query.location.country;
        if (query.location?.state) body.state = query.location.state;
        if (query.location?.city) body.city = query.location.city;
        if (query.startDate) body.takenAfter = this.toImmichTakenAfter(query.startDate);
        if (query.endDate) body.takenBefore = this.toImmichTakenBefore(query.endDate);

        return body;
    }

    /** Slides query dates are calendar `yyyy-MM-dd`; Immich v3 validates ISO datetimes. */
    private toImmichTakenAfter(calendarDate: string): string {
        if (calendarDate.includes('T')) return calendarDate;
        return `${calendarDate}T00:00:00.000Z`;
    }

    private toImmichTakenBefore(calendarDate: string): string {
        if (calendarDate.includes('T')) return calendarDate;
        return `${calendarDate}T23:59:59.999Z`;
    }

    /** Map an Immich asset DTO onto the DomainPhoto wire shape. */
    private mapAssetToPhoto(asset: ImmichAsset, links: LinkBuilder): DomainPhoto {
        const exif = asset.exifInfo;

        const location: DomainPhotoLocation | undefined = exif
            ? {
                  city: exif.city,
                  state: exif.state,
                  country: exif.country,
                  latitude: exif.latitude,
                  longitude: exif.longitude,
              }
            : undefined;

        const camera: DomainPhotoCameraInfo | undefined = exif
            ? { make: exif.make, model: exif.model, lensModel: exif.lensModel }
            : undefined;

        const exifSettings: DomainPhotoExifSettings | undefined = exif
            ? {
                  fNumber: exif.fNumber,
                  exposureTime: exif.exposureTime,
                  iso: exif.iso,
                  focalLength: exif.focalLength,
              }
            : undefined;

        return {
            id: asset.id,
            url: links.assetThumbnail(asset.id),
            inAppUrl: links.immichDeepLink(asset.id),
            livePhotoVideoUrl: asset.livePhotoVideoId
                ? links.assetVideo(asset.livePhotoVideoId)
                : undefined,
            width: asset.width || exif?.exifImageWidth,
            height: asset.height || exif?.exifImageHeight,
            type: asset.type as 'IMAGE',
            createdAt: new Date(asset.fileCreatedAt ?? asset.createdAt ?? 0).toISOString(),
            description: exif?.description,
            rating: exif?.rating,
            isFavorite: asset.isFavorite ?? false,
            tags: asset.tags?.map((tag) => tag.name) || [],
            location,
            camera,
            exifSettings,
            orientation: exif?.orientation,
            duration: asset.duration,
        };
    }
}
