import type { SlideshowQueryRequest } from '@slides/api-contract';
import type { PhotoQueryService } from './PhotoQueryService.js';
import type { LinkBuilder } from '../infra/LinkBuilder.js';
import type { DomainSlideshowResult } from '../domain/slideshow.js';
import { seededShuffle } from '../domain/seededShuffle.js';

/**
 * Stateless slideshow photo query — filter/shuffle from request body only.
 */
export class SlideshowService {
    constructor(private readonly photos: PhotoQueryService) {}

    async queryPhotos(
        body: SlideshowQueryRequest,
        links: LinkBuilder
    ): Promise<DomainSlideshowResult> {
        const { shuffle: _shuffle, seed, ...queryParams } = body;
        const photos = await this.photos.getPhotos(queryParams, links);

        const ordered = body.shuffle ? seededShuffle(photos, seed ?? defaultSeed()) : photos;

        return { photos: ordered, total: ordered.length };
    }
}

function defaultSeed(): string {
    return String(Date.now());
}
