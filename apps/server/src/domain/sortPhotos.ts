import type { SortOrder } from '@slides/api-contract';
import type { DomainPhoto } from './photos.js';

/** Concrete chronological direction after resolving `album` mode. */
export type SortDirection = 'asc' | 'desc';

/** Immich album display order (`AlbumResponseDto.order`). */
export type ImmichAlbumOrder = 'asc' | 'desc';

/**
 * Resolve `album` mode to a concrete direction. Follows the Immich album display
 * order only when every selected album shares it; otherwise (no albums, mixed
 * orders) falls back to oldest-first, which suits trips and events best.
 */
export function resolveSortDirection(
    sortOrder: SortOrder,
    albumOrders: ImmichAlbumOrder[] = []
): SortDirection {
    if (sortOrder === 'newest') return 'desc';
    if (sortOrder === 'oldest') return 'asc';

    const unique = new Set(albumOrders);
    if (albumOrders.length > 0 && unique.size === 1) {
        return albumOrders[0];
    }
    return 'asc';
}

/**
 * Stable chronological sort by capture date (`createdAt`, mapped from Immich
 * `fileCreatedAt`). Ties break on asset ID so the order is deterministic across
 * refetches and multi-album unions.
 */
export function sortPhotos(photos: DomainPhoto[], direction: SortDirection): DomainPhoto[] {
    const sign = direction === 'asc' ? 1 : -1;
    return photos
        .map((photo) => ({ photo, time: Date.parse(photo.createdAt) || 0 }))
        .sort((a, b) => {
            if (a.time !== b.time) return (a.time - b.time) * sign;
            return a.photo.id < b.photo.id ? -1 : a.photo.id > b.photo.id ? 1 : 0;
        })
        .map(({ photo }) => photo);
}
