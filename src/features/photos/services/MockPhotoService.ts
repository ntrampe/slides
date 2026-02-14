import type { Photo, PhotoService, PaginationParams, PaginatedPhotos } from '../types';

const LOCATIONS = [
    'Sunset Beach',
    'Rocky Mountains',
    'Tokyo Tower',
    'Paris Streets',
    'Amazon Rainforest',
    'Sahara Desert',
    'Grand Canyon',
    'Northern Lights, Iceland',
    'Santorini, Greece',
    'Machu Picchu, Peru',
    'Great Wall of China',
    'Venice Canals',
    'Swiss Alps',
    'Bali Temple',
    'New York City Skyline',
    'Scottish Highlands',
    'Australian Outback',
    'Norwegian Fjords',
    'Taj Mahal, India',
    'Maldives Beach',
    'Dubai Skyline',
    'Cherry Blossoms, Japan',
    'Niagara Falls',
    'Yosemite National Park',
    'Antarctic Peninsula',
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
 * Generate a random location from the predefined list
 */
function getRandomLocation(): string {
    return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

/**
 * Generate mock photos with random locations and dates
 */
function generateMockPhotos(count: number): Photo[] {
    const photos: Photo[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 3); // 3 years ago

    for (let i = 1; i <= count; i++) {
        photos.push({
            id: String(i),
            url: `https://picsum.photos/1920/1080?${i}`,
            location: getRandomLocation(),
            createdAt: getRandomDate(startDate, endDate),
        });
    }

    return photos;
}

export class MockPhotoService implements PhotoService {
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