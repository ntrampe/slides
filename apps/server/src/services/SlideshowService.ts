import type { SlideshowQueryRequest, SortOrder } from '@slides/api-contract';
import { DEFAULT_SORT_ORDER } from '@slides/shared/constants';
import type { PhotoQueryService } from './PhotoQueryService.js';
import type { CatalogService } from './CatalogService.js';
import type { LinkBuilder } from '../infra/LinkBuilder.js';
import type { DomainSlideshowResult } from '../domain/slideshow.js';
import { seededShuffle } from '../domain/seededShuffle.js';
import { resolveSortDirection, sortPhotos, type SortDirection } from '../domain/sortPhotos.js';

/**
 * Stateless slideshow photo query — filter, then shuffle or sort, from request body only.
 */
export class SlideshowService {
    constructor(
        private readonly photos: PhotoQueryService,
        private readonly catalog: CatalogService
    ) {}

    async queryPhotos(
        body: SlideshowQueryRequest,
        links: LinkBuilder
    ): Promise<DomainSlideshowResult> {
        const { shuffle, seed, sortOrder, ...queryParams } = body;
        const photos = await this.photos.getPhotos(queryParams, links);

        const ordered = shuffle
            ? seededShuffle(photos, seed ?? defaultSeed())
            : sortPhotos(photos, await this.resolveDirection(sortOrder ?? DEFAULT_SORT_ORDER, body));

        return { photos: ordered, total: ordered.length };
    }

    private async resolveDirection(
        sortOrder: SortOrder,
        body: SlideshowQueryRequest
    ): Promise<SortDirection> {
        if (sortOrder !== 'album') return resolveSortDirection(sortOrder);

        const excluded = new Set(body.excludeAlbumIds ?? []);
        const albumIds = (body.albumIds ?? []).filter((id) => !excluded.has(id));
        try {
            return resolveSortDirection('album', await this.catalog.getAlbumOrders(albumIds));
        } catch (err) {
            console.warn('[slideshow] album order lookup failed; using oldest first', err);
            return resolveSortDirection('album');
        }
    }
}

function defaultSeed(): string {
    return String(Date.now());
}
