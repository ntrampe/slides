import type { SlideshowResponse } from '@slides/api-contract';
import { apiGet } from './http.js';
import { revivePhoto } from '../features/photos/revivePhoto.js';
import type { SlideshowData } from '../features/slideshow/types.js';

export async function fetchSlideshow(search: string, seed?: string): Promise<SlideshowData> {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    if (seed) params.set('seed', seed);

    const qs = params.toString();
    const path = qs ? `/slideshow?${qs}` : '/slideshow';

    const data = await apiGet<SlideshowResponse>(path);
    return {
        total: data.total,
        photos: data.photos.map(revivePhoto),
    };
}
