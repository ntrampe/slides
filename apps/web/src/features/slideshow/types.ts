import type { Photo } from '../photos/types.js';

export interface SlideshowData {
    photos: Photo[];
    total: number;
}
