import type { QuerySettings } from '@slides/api-contract';
import type { ImmichPhotoGateway, PhotoQuery } from '../infra/ImmichPhotoGateway';
import type { LinkBuilder } from '../infra/LinkBuilder';
import { type DomainPhoto, type FilterOperator } from '../domain/photos.js';
import { DEFAULT_FILTER_OPERATOR } from '@slides/shared/constants';

/**
 * Application-level photo querying. Owns the filter business logic that used to
 * live in the browser: operator-aware query fan-out (AND/OR), union/intersection
 * of result sets, and exclusions. All Immich wire concerns are delegated to the
 * injected {@link ImmichPhotoGateway}, so this service is pure orchestration and
 * is unit-testable with a fake gateway.
 */
export class PhotoQueryService {
    constructor(private readonly gateway: ImmichPhotoGateway) {}

    async getPhotos(
        params: Partial<Omit<QuerySettings, 'shuffle'>>,
        links: LinkBuilder
    ): Promise<DomainPhoto[]> {
        const {
            albumIds,
            albumOperator = DEFAULT_FILTER_OPERATOR,
            personIds,
            personOperator = DEFAULT_FILTER_OPERATOR,
            excludeAlbumIds,
            excludePersonIds,
            locationCountry,
            locationState,
            locationCity,
            startDate,
            endDate,
            globalOperator = DEFAULT_FILTER_OPERATOR,
        } = params;

        const location =
            locationCountry || locationState || locationCity
                ? {
                      country: locationCountry,
                      state: locationState,
                      city: locationCity,
                  }
                : undefined;

        // IDs can appear in both selected and excluded (picker Minus on a chip). Inclusion must not
        // require an entity we later subtract, or AND results empty out.
        const excludeAlbumSet = new Set(excludeAlbumIds ?? []);
        const excludePersonSet = new Set(excludePersonIds ?? []);
        const effectiveAlbumIds = albumIds?.filter((id) => !excludeAlbumSet.has(id));
        const effectivePersonIds = personIds?.filter((id) => !excludePersonSet.has(id));

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

        const results: DomainPhoto[][] = [];
        for (const chunk of this.chunkArray(queries, 3)) {
            const chunkResults = await Promise.all(
                chunk.map((query) => this.gateway.search(query, links))
            );
            results.push(...chunkResults);
        }

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
    }): PhotoQuery[] {
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

        const albumQueries: PhotoQuery[] = [];
        const personQueries: PhotoQuery[] = [];
        const baseQuery: PhotoQuery = { location, startDate, endDate };

        if (albumIds.length > 0) {
            if (albumOperator === 'OR') {
                albumQueries.push(...albumIds.map((id) => ({ ...baseQuery, albumIds: [id] })));
            } else {
                albumQueries.push({ ...baseQuery, albumIds });
            }
        }

        if (personIds.length > 0) {
            if (personOperator === 'OR') {
                personQueries.push(...personIds.map((id) => ({ ...baseQuery, personIds: [id] })));
            } else {
                personQueries.push({ ...baseQuery, personIds });
            }
        }

        let queries: PhotoQuery[];

        if (albumQueries.length === 0 && personQueries.length === 0) {
            queries = [baseQuery];
        } else if (globalOperator === 'OR') {
            queries = [...albumQueries, ...personQueries];
        } else {
            if (albumQueries.length > 0 && personQueries.length > 0) {
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
                queries = albumQueries.length > 0 ? albumQueries : personQueries;
            }
        }

        return queries;
    }

    /**
     * Combine multiple result sets based on operators.
     * Multiple batches appear only when at least one operator is OR (union);
     * otherwise we have a single batch or an AND-only expansion (intersection).
     */
    private combineResults(
        results: DomainPhoto[][],
        operators: {
            albumOperator: FilterOperator;
            personOperator: FilterOperator;
            globalOperator: FilterOperator;
        }
    ): DomainPhoto[] {
        if (results.length === 0) return [];
        if (results.length === 1) return results[0];

        if (
            operators.globalOperator === 'OR' ||
            operators.albumOperator === 'OR' ||
            operators.personOperator === 'OR'
        ) {
            return this.unionPhotos(results);
        }

        return this.intersectPhotos(results);
    }

    private unionPhotos(results: DomainPhoto[][]): DomainPhoto[] {
        const photoMap = new Map<string, DomainPhoto>();
        for (const photoSet of results) {
            for (const photo of photoSet) {
                if (!photoMap.has(photo.id)) {
                    photoMap.set(photo.id, photo);
                }
            }
        }
        return Array.from(photoMap.values());
    }

    private intersectPhotos(results: DomainPhoto[][]): DomainPhoto[] {
        if (results.length === 0) return [];
        if (results.length === 1) return results[0];

        const photoMap = new Map<string, DomainPhoto>();
        for (const photo of results[0]) {
            photoMap.set(photo.id, photo);
        }

        for (let i = 1; i < results.length; i++) {
            const currentIds = new Set(results[i].map((p) => p.id));
            for (const id of photoMap.keys()) {
                if (!currentIds.has(id)) {
                    photoMap.delete(id);
                }
            }
        }

        return Array.from(photoMap.values());
    }

    private chunkArray<T>(arr: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    }

    /**
     * Apply exclusions by fetching IDs to subtract and filtering them out.
     * Items within each exclude list are OR'd together (union).
     */
    private async applyExclusions(
        photos: DomainPhoto[],
        exclusions: {
            excludeAlbumIds?: string[];
            excludePersonIds?: string[];
            location?: { country?: string; state?: string; city?: string };
            startDate?: string;
            endDate?: string;
        }
    ): Promise<DomainPhoto[]> {
        const excludeQueries: PhotoQuery[] = [];
        const baseQuery: PhotoQuery = {
            location: exclusions.location,
            startDate: exclusions.startDate,
            endDate: exclusions.endDate,
        };

        if (exclusions.excludeAlbumIds && exclusions.excludeAlbumIds.length > 0) {
            excludeQueries.push(
                ...exclusions.excludeAlbumIds.map((id) => ({ ...baseQuery, albumIds: [id] }))
            );
        }
        if (exclusions.excludePersonIds && exclusions.excludePersonIds.length > 0) {
            excludeQueries.push(
                ...exclusions.excludePersonIds.map((id) => ({ ...baseQuery, personIds: [id] }))
            );
        }

        if (excludeQueries.length === 0) return photos;

        const idResults: string[][] = [];
        for (const chunk of this.chunkArray(excludeQueries, 3)) {
            const chunkResults = await Promise.all(
                chunk.map((q) => this.gateway.searchIds(q))
            );
            idResults.push(...chunkResults);
        }
        const excludeIds = new Set(idResults.flat());
        return photos.filter((p) => !excludeIds.has(p.id));
    }
}
