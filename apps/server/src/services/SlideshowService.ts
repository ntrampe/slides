import type { PhotoQueryService } from './PhotoQueryService.js';
import type { SettingsService } from './SettingsService.js';
import type { LinkBuilder } from '../infra/LinkBuilder.js';
import type { DomainSlideshowResult } from '../domain/slideshow.js';
import { seededShuffle } from '../domain/seededShuffle.js';

/**
 * The headline thin-client endpoint logic: resolve settings, query photos with
 * the configured filter, and apply ordering/shuffle server-side so a client
 * (e.g. a native mobile app) only needs to render the result.
 */
export class SlideshowService {
    constructor(
        private readonly photos: PhotoQueryService,
        private readonly settings: SettingsService
    ) {}

    async getSlideshow(
        search: string,
        links: LinkBuilder,
        options: { seed?: string } = {}
    ): Promise<DomainSlideshowResult> {
        const settings = this.settings.resolve(search);

        const photos = await this.photos.getPhotos(settings.slideshow.filter, links);

        const ordered = settings.slideshow.shuffle
            ? seededShuffle(photos, options.seed ?? defaultSeed())
            : photos;

        return { photos: ordered, total: ordered.length };
    }
}

function defaultSeed(): string {
    return String(Date.now());
}
