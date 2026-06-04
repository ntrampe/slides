import type { DomainPhoto } from './photos.js';

export interface DomainSlideshowResult {
    photos: DomainPhoto[];
    total: number;
}
