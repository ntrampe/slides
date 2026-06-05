import type { SlideshowQueryRequest, SlideshowResponse } from '@slides/api-contract';
import { apiPost } from './http.js';
import { revivePhoto } from '../features/photos/revivePhoto.js';
import type { SlideshowData } from '../features/slideshow/types.js';

export async function querySlideshow(body: SlideshowQueryRequest): Promise<SlideshowData> {
    const data = await apiPost<SlideshowResponse>('/slideshow/query', body);
    return {
        total: data.total,
        photos: data.photos.map(revivePhoto),
    };
}
