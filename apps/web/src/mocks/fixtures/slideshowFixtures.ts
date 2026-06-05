import type { Photo } from '@slides/api-contract';

/**
 * Canned slideshow fixtures for the offline demo build (`VITE_USE_MOCK=true`).
 *
 * These are static wire-shaped DTOs that stand in for a `POST /api/v1/slideshow/query`
 * response. The demo intentionally performs NO filtering, shuffling, or settings
 * resolution on the client — that business logic lives only on the server. This
 * file is fixture data, not domain logic.
 */

const LOCATIONS = [
    { city: 'Malibu', state: 'California', country: 'USA', latitude: 34.0259, longitude: -118.7798 },
    { city: 'Aspen', state: 'Colorado', country: 'USA', latitude: 39.1911, longitude: -106.8175 },
    { city: 'Tokyo', state: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
    { city: 'Paris', state: 'Île-de-France', country: 'France', latitude: 48.8566, longitude: 2.3522 },
    { city: 'Reykjavik', state: 'Capital Region', country: 'Iceland', latitude: 64.1466, longitude: -21.9426 },
    { city: 'Santorini', state: 'South Aegean', country: 'Greece', latitude: 36.3932, longitude: 25.4615 },
];

const CAMERAS = [
    { make: 'Canon', model: 'EOS R5', lensModel: 'RF 24-70mm f/2.8L IS USM' },
    { make: 'Sony', model: 'α7R IV', lensModel: 'FE 85mm f/1.4 GM' },
    { make: 'Fujifilm', model: 'X-T4', lensModel: 'XF 16-55mm f/2.8 R LM WR' },
];

const DESCRIPTIONS = [
    'Golden hour captures the perfect light',
    'A moment of pure tranquility',
    "Nature's incredible display of colors",
    'The magic of early morning mist',
    undefined,
];

const ASPECT_RATIOS = [
    { width: 3840, height: 2160 },
    { width: 2160, height: 3840 },
    { width: 3000, height: 3000 },
    { width: 3840, height: 2560 },
    { width: 2560, height: 3840 },
];

const FIXTURE_COUNT = 24;

/** Deterministic fixtures so the demo looks identical across loads. */
export const MOCK_SLIDESHOW_PHOTOS: Photo[] = Array.from(
    { length: FIXTURE_COUNT },
    (_, index): Photo => {
        const i = index + 1;
        const dim = ASPECT_RATIOS[index % ASPECT_RATIOS.length];
        const location = LOCATIONS[index % LOCATIONS.length];
        const camera = CAMERAS[index % CAMERAS.length];
        const description = DESCRIPTIONS[index % DESCRIPTIONS.length];
        const daysAgo = index * 17;
        const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        return {
            id: String(i),
            url: `https://picsum.photos/${dim.width}/${dim.height}?${i}`,
            inAppUrl: `https://picsum.photos/${dim.width}/${dim.height}?${i}`,
            width: dim.width,
            height: dim.height,
            type: 'IMAGE',
            createdAt: createdAt.toISOString(),
            description,
            rating: index % 3 === 0 ? (index % 5) + 1 : undefined,
            isFavorite: index % 4 === 0,
            tags: index % 2 === 0 ? ['landscape', 'nature', 'travel'] : [],
            location,
            camera,
            exifSettings: { fNumber: 2.8, exposureTime: '1/250', iso: 200, focalLength: 50 },
            orientation: dim.width > dim.height ? 'landscape' : 'portrait',
        };
    }
);
