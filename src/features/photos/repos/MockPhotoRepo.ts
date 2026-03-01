import type { Photo, PhotoRepo, PaginationParams, PaginatedPhotos, PhotoExifSettings } from '../types';

const LOCATIONS = [
    { city: 'Malibu', state: 'California', country: 'USA', latitude: 34.0259, longitude: -118.7798 },
    { city: 'Aspen', state: 'Colorado', country: 'USA', latitude: 39.1911, longitude: -106.8175 },
    { city: 'Tokyo', state: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
    { city: 'Paris', state: 'Île-de-France', country: 'France', latitude: 48.8566, longitude: 2.3522 },
    { city: 'Manaus', state: 'Amazonas', country: 'Brazil', latitude: -3.1190, longitude: -60.0217 },
    { city: 'Merzouga', state: 'Meknès-Tafilalet', country: 'Morocco', latitude: 31.0801, longitude: -4.0133 },
    { city: 'Grand Canyon Village', state: 'Arizona', country: 'USA', latitude: 36.0544, longitude: -112.1401 },
    { city: 'Reykjavik', state: 'Capital Region', country: 'Iceland', latitude: 64.1466, longitude: -21.9426 },
    { city: 'Santorini', state: 'South Aegean', country: 'Greece', latitude: 36.3932, longitude: 25.4615 },
    { city: 'Cusco', state: 'Cusco', country: 'Peru', latitude: -13.5319, longitude: -71.9675 },
];

const CAMERAS = [
    { make: 'Canon', model: 'EOS R5', lensModel: 'RF 24-70mm f/2.8L IS USM' },
    { make: 'Nikon', model: 'D850', lensModel: 'AF-S NIKKOR 70-200mm f/2.8E FL ED VR' },
    { make: 'Sony', model: 'α7R IV', lensModel: 'FE 85mm f/1.4 GM' },
    { make: 'Fujifilm', model: 'X-T4', lensModel: 'XF 16-55mm f/2.8 R LM WR' },
    { make: 'Olympus', model: 'OM-D E-M1 Mark III', lensModel: 'M.ZUIKO DIGITAL ED 12-40mm f/2.8 PRO' },
];

const DESCRIPTIONS = [
    'Golden hour captures the perfect light',
    'A moment of pure tranquility',
    'Nature\'s incredible display of colors',
    'Street photography at its finest',
    'The magic of early morning mist',
    'Architectural marvel in perfect symmetry',
    'Wildlife in its natural habitat',
    'The dance of light and shadow',
    undefined, // Some photos don't have descriptions
    undefined,
];

/**
 * Generate a random date between the start and end dates
 */
function getRandomDate(startDate: Date, endDate: Date): Date {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime);
}

/**
 * Generate random EXIF settings
 */
function getRandomExifSettings(): PhotoExifSettings {
    const apertures = [1.4, 1.8, 2.8, 4.0, 5.6, 8.0, 11.0];
    const shutterSpeeds = ['1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15'];
    const isoValues = [100, 200, 400, 800, 1600, 3200, 6400];
    const focalLengths = [24, 35, 50, 85, 135, 200, 300];

    return {
        fNumber: apertures[Math.floor(Math.random() * apertures.length)],
        exposureTime: shutterSpeeds[Math.floor(Math.random() * shutterSpeeds.length)],
        iso: isoValues[Math.floor(Math.random() * isoValues.length)],
        focalLength: focalLengths[Math.floor(Math.random() * focalLengths.length)],
    };
}

/**
 * Generate mock photos with comprehensive metadata
 */
function generateMockPhotos(count: number): Photo[] {
    const photos: Photo[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 3); // 3 years ago

    const aspectRatios = [
        { width: 1920, height: 1080 }, // 16:9
        { width: 1080, height: 1920 }, // 9:16 (portrait)
        { width: 1600, height: 1600 }, // 1:1 (square)
        { width: 1920, height: 1280 }, // 3:2
        { width: 1280, height: 1920 }, // 2:3 (portrait)
    ];

    for (let i = 1; i <= count; i++) {
        const dimensions = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
        const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        const camera = CAMERAS[Math.floor(Math.random() * CAMERAS.length)];
        const description = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];

        photos.push({
            id: String(i),
            url: `https://picsum.photos/${dimensions.width}/${dimensions.height}?${i}`,
            inAppUrl: `https://picsum.photos/${dimensions.width}/${dimensions.height}?${i}`,
            livePhotoVideoUrl: undefined,
            width: dimensions.width,
            height: dimensions.height,
            type: 'IMAGE',
            createdAt: getRandomDate(startDate, endDate),
            description,
            rating: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : undefined,
            isFavorite: Math.random() > 0.8,
            tags: Math.random() > 0.6 ? ['landscape', 'nature', 'travel'].slice(0, Math.floor(Math.random() * 3) + 1) : [],
            location,
            camera,
            exifSettings: getRandomExifSettings(),
            orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
        });
    }

    return photos;
}

export class MockPhotoRepo implements PhotoRepo {
    private allPhotos: Photo[] = generateMockPhotos(500);

    async getPhotos(params: PaginationParams = {}): Promise<PaginatedPhotos> {
        const { page = 1, pageSize = 10 } = params;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const photos = this.allPhotos.slice(startIndex, endIndex);
        const total = this.allPhotos.length;
        const hasMore = endIndex < total;

        return {
            photos,
            page,
            pageSize,
            hasMore,
        };
    }
}