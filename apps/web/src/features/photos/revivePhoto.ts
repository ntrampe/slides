import type { Photo as PhotoDto } from '@slides/api-contract';
import type { Photo } from './types.js';

export function revivePhoto(dto: PhotoDto): Photo {
    return { ...dto, createdAt: new Date(dto.createdAt) };
}
