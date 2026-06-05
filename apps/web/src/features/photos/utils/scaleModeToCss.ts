import type { PlaybackSettings } from '@slides/api-contract';

export function scaleModeToCss(mode: PlaybackSettings['photoScaleMode']): 'contain' | 'cover' | 'fill' | 'none' {
    switch (mode) {
        case 'fit_inside':
            return 'contain';
        case 'fill_crop':
            return 'cover';
        case 'stretch':
            return 'fill';
        case 'original':
            return 'none';
        default:
            return 'contain';
    }
}
