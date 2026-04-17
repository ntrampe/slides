import { NETWORK_ERROR_CODES, NetworkError, PhotoError, ServerError } from "../../../shared/errors";
import {
    DEFAULT_FILTER_OPERATOR,
    type FilterOperator,
    type Photo,
    type PhotoCameraInfo,
    type PhotoExifSettings,
    type PhotoFilterParams,
    type PhotoLocation,
    type PhotoRepo,
} from "../types";
import { parseErrorResponse } from "../utils/errorParser";

/** Max assets per Immich metadata search request (API ceiling). */
const IMMICH_SEARCH_PAGE_SIZE = 1000;

interface QueryConfig {
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

export class ImmichPhotoRepo implements PhotoRepo {
    private proxyUrl = "/api/immich";

    async getPhotos(params: PhotoFilterParams = {}): Promise<Photo[]> {
        const {
            albumIds,
            albumOperator = DEFAULT_FILTER_OPERATOR,
            personIds,
            personOperator = DEFAULT_FILTER_OPERATOR,
            excludeAlbumIds,
            excludePersonIds,
            location,
            startDate,
            endDate,
            globalOperator = DEFAULT_FILTER_OPERATOR,
        } = params;

        // IDs can appear in both selected and excluded (picker Minus on a chip). Inclusion must not
        // require an entity we later subtract, or AND results empty out.
        const excludeAlbumSet = new Set(excludeAlbumIds ?? []);
        const excludePersonSet = new Set(excludePersonIds ?? []);
        const effectiveAlbumIds = albumIds?.filter((id) => !excludeAlbumSet.has(id));
        const effectivePersonIds = personIds?.filter((id) => !excludePersonSet.has(id));

        try {
            // Build queries based on operators
            const queries = this.buildQueries({
                albumIds: effectiveAlbumIds,
                albumOperator,
                personIds: effectivePersonIds,
                personOperator,
                location,
                startDate,
                endDate,
                globalOperator,
            });

            // Execute all queries in parallel (each may issue multiple Immich pages until drained)
            const results = await Promise.all(
                queries.map(query => this.executeSingleQuery(query))
            );

            // Combine results based on operators
            let combinedPhotos = this.combineResults(results, {
                albumOperator,
                personOperator,
                globalOperator,
            });

            const hasExclusions =
                (excludeAlbumIds?.length ?? 0) > 0 || (excludePersonIds?.length ?? 0) > 0;
            if (hasExclusions) {
                combinedPhotos = await this.applyExclusions(combinedPhotos, {
                    excludeAlbumIds,
                    excludePersonIds,
                    location,
                    startDate,
                    endDate,
                });
            }

            return combinedPhotos;

        } catch (error) {
            // Re-throw if already a PhotoError
            if (error instanceof PhotoError) {
                throw error;
            }

            // Handle fetch failures (network errors)
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new NetworkError(
                    'Unable to connect to photo service. Check your network connection.',
                    NETWORK_ERROR_CODES.REFUSED
                );
            }

            // Unknown errors
            throw new ServerError(
                `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
                500
            );
        }
    }

    /**
     * Build query configurations based on filter operators.
     * OR: Create separate queries for each item
     * AND: Create single query with all items
     */
    private buildQueries(params: {
        albumIds?: string[];
        albumOperator: FilterOperator;
        personIds?: string[];
        personOperator: FilterOperator;
        location?: { country?: string; state?: string; city?: string };
        startDate?: string;
        endDate?: string;
        globalOperator: FilterOperator;
    }): QueryConfig[] {
        const {
            albumIds = [],
            albumOperator,
            personIds = [],
            personOperator,
            location,
            startDate,
            endDate,
            globalOperator,
        } = params;

        const albumQueries: QueryConfig[] = [];
        const personQueries: QueryConfig[] = [];
        const baseQuery: QueryConfig = { location, startDate, endDate };

        // Build album queries
        if (albumIds.length > 0) {
            if (albumOperator === 'OR') {
                // One query per album
                albumQueries.push(...albumIds.map(id => ({ ...baseQuery, albumIds: [id] })));
            } else {
                // AND: Single query with all albums (Immich handles AND)
                albumQueries.push({ ...baseQuery, albumIds });
            }
        }

        // Build person queries
        if (personIds.length > 0) {
            if (personOperator === 'OR') {
                // One query per person
                personQueries.push(...personIds.map(id => ({ ...baseQuery, personIds: [id] })));
            } else {
                // AND: Single query with all people (Immich handles AND)
                personQueries.push({ ...baseQuery, personIds });
            }
        }

        // Combine album and person queries based on globalOperator
        let queries: QueryConfig[];

        if (albumQueries.length === 0 && personQueries.length === 0) {
            // No album/person filters, just base query (location/date only)
            queries = [baseQuery];
        } else if (globalOperator === 'OR') {
            // Union of all queries
            queries = [...albumQueries, ...personQueries];
        } else {
            // AND - combine filters
            if (albumQueries.length > 0 && personQueries.length > 0) {
                // Cross-product: each album query × each person query
                queries = [];
                for (const aq of albumQueries) {
                    for (const pq of personQueries) {
                        queries.push({
                            ...baseQuery,
                            albumIds: aq.albumIds,
                            personIds: pq.personIds,
                        });
                    }
                }
            } else {
                // Only one type of filter
                queries = albumQueries.length > 0 ? albumQueries : personQueries;
            }
        }

        return queries;
    }

    /**
     * Run one logical Immich metadata search: walk Immich `page` until a page returns fewer
     * than IMMICH_SEARCH_PAGE_SIZE items (Immich API paging, unrelated to app photo list shape).
     */
    private async executeSingleQuery(query: QueryConfig): Promise<Photo[]> {
        const photos: Photo[] = [];
        let immichPage = 1;

        for (;;) {
            const searchBody: Record<string, unknown> = {
                page: immichPage,
                size: IMMICH_SEARCH_PAGE_SIZE,
                type: "IMAGE",
                withExif: true,
            };

            if (query.albumIds && query.albumIds.length > 0) {
                searchBody.albumIds = query.albumIds;
            }
            if (query.personIds && query.personIds.length > 0) {
                searchBody.personIds = query.personIds;
            }
            if (query.location?.country) searchBody.country = query.location.country;
            if (query.location?.state) searchBody.state = query.location.state;
            if (query.location?.city) searchBody.city = query.location.city;
            if (query.startDate) searchBody.takenAfter = query.startDate;
            if (query.endDate) searchBody.takenBefore = query.endDate;

            const res = await fetch(`${this.proxyUrl}/api/search/metadata`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(searchBody),
            });

            if (!res.ok) {
                throw await parseErrorResponse(res);
            }

            const json = await res.json();
            const assets: unknown[] = json.assets?.items ?? [];

            for (const asset of assets) {
                photos.push(this.mapAssetToPhoto(asset as any));
            }

            if (assets.length < IMMICH_SEARCH_PAGE_SIZE) {
                break;
            }
            immichPage += 1;
        }

        return photos;
    }

    /**
     * Map Immich asset to Photo domain model.
     */
    private mapAssetToPhoto(asset: any): Photo {
        const locationData: PhotoLocation | undefined = asset.exifInfo ? {
            city: asset.exifInfo.city,
            state: asset.exifInfo.state,
            country: asset.exifInfo.country,
            latitude: asset.exifInfo.latitude,
            longitude: asset.exifInfo.longitude,
        } : undefined;

        const cameraInfo: PhotoCameraInfo | undefined = asset.exifInfo ? {
            make: asset.exifInfo.make,
            model: asset.exifInfo.model,
            lensModel: asset.exifInfo.lensModel,
        } : undefined;

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
    }

    /**
     * Combine multiple result sets based on operators.
     * Invariant (with current buildQueries): multiple batches appear only when at least one of
     * globalOperator, albumOperator, or personOperator is OR, so union is the correct combiner;
     * otherwise we have a single batch or an AND-only expansion where intersection applies.
     */
    private combineResults(
        results: Photo[][],
        operators: {
            albumOperator: FilterOperator;
            personOperator: FilterOperator;
            globalOperator: FilterOperator;
        }
    ): Photo[] {
        if (results.length === 0) return [];
        if (results.length === 1) return results[0];

        if (operators.globalOperator === 'OR' ||
            operators.albumOperator === 'OR' ||
            operators.personOperator === 'OR') {
            return this.unionPhotos(results);
        }

        // For AND operations: intersection
        return this.intersectPhotos(results);
    }

    /**
     * Union: combine all photos, deduplicate by ID
     */
    private unionPhotos(results: Photo[][]): Photo[] {
        const photoMap = new Map<string, Photo>();

        for (const photoSet of results) {
            for (const photo of photoSet) {
                if (!photoMap.has(photo.id)) {
                    photoMap.set(photo.id, photo);
                }
            }
        }

        return Array.from(photoMap.values());
    }

    /**
     * Intersection: only photos that appear in ALL result sets
     */
    private intersectPhotos(results: Photo[][]): Photo[] {
        if (results.length === 0) return [];
        if (results.length === 1) return results[0];

        // Start with first set
        const photoMap = new Map<string, Photo>();
        for (const photo of results[0]) {
            photoMap.set(photo.id, photo);
        }

        // Keep only IDs that appear in all subsequent sets
        for (let i = 1; i < results.length; i++) {
            const currentIds = new Set(results[i].map(p => p.id));

            for (const id of photoMap.keys()) {
                if (!currentIds.has(id)) {
                    photoMap.delete(id);
                }
            }
        }

        return Array.from(photoMap.values());
    }

    /**
     * Apply exclusions by fetching photos to exclude and filtering them out.
     * Items within each exclude list are OR'd together (union).
     */
    private async applyExclusions(
        photos: Photo[],
        exclusions: {
            excludeAlbumIds?: string[];
            excludePersonIds?: string[];
            location?: { country?: string; state?: string; city?: string };
            startDate?: string;
            endDate?: string;
        }
    ): Promise<Photo[]> {
        const excludeQueries: QueryConfig[] = [];
        const baseQuery: QueryConfig = {
            location: exclusions.location,
            startDate: exclusions.startDate,
            endDate: exclusions.endDate,
        };

        // Build queries for items to exclude (each item is a separate query, OR'd together)
        if (exclusions.excludeAlbumIds && exclusions.excludeAlbumIds.length > 0) {
            excludeQueries.push(
                ...exclusions.excludeAlbumIds.map(id => ({
                    ...baseQuery,
                    albumIds: [id]
                }))
            );
        }
        if (exclusions.excludePersonIds && exclusions.excludePersonIds.length > 0) {
            excludeQueries.push(
                ...exclusions.excludePersonIds.map(id => ({
                    ...baseQuery,
                    personIds: [id]
                }))
            );
        }

        if (excludeQueries.length === 0) return photos;

        // Fetch all photos to exclude (union of all exclude queries)
        const excludeResults = await Promise.all(
            excludeQueries.map(q => this.executeSingleQuery(q))
        );

        const excludeIds = new Set(
            excludeResults.flat().map(p => p.id)
        );

        // Filter out excluded photos
        return photos.filter(p => !excludeIds.has(p.id));
    }

}
