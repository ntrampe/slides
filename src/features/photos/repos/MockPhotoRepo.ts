import {
    DEFAULT_FILTER_OPERATOR,
    type FilterOperator,
    type Photo,
    type PhotoExifSettings,
    type PhotoFilterParams,
    type PhotoRepo,
} from '../types';

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

/** Album ids aligned with MockAlbumRepo. */
function mockAlbumMembershipForPhotoId(photoId: string): string[] {
    const n = Number.parseInt(photoId, 10) || 0;
    const out: string[] = [];
    for (let a = 1; a <= 5; a++) {
        if ((n + a * 7) % 11 < 5) {
            out.push(`mock-album-${a}`);
        }
    }
    if (out.length === 0) {
        out.push('mock-album-1');
    }
    return out;
}

/** Person ids aligned with MockPeopleRepo. */
function mockPersonMembershipForPhotoId(photoId: string): string[] {
    const n = Number.parseInt(photoId, 10) || 0;
    const out: string[] = [];
    for (let p = 1; p <= 5; p++) {
        if ((n + p * 13) % 17 < 6) {
            out.push(`mock-${p}`);
        }
    }
    if (out.length === 0) {
        out.push('mock-1');
    }
    return out;
}

interface QueryConfig {
    albumIds?: string[];
    personIds?: string[];
    location?: {
        country?: string;
        state?: string;
        city?: string;
    };
    startDate?: string;
    endDate?: string;
}

function normField(value: string | undefined): string | undefined {
    if (value === undefined || value === '') return undefined;
    return value.trim().toLowerCase();
}

function matchesLocation(
    photo: Photo,
    location: NonNullable<QueryConfig['location']> | undefined
): boolean {
    if (!location) return true;
    const pl = photo.location;
    if (!pl) return false;
    if (location.country !== undefined && location.country !== '') {
        if (normField(pl.country) !== normField(location.country)) return false;
    }
    if (location.state !== undefined && location.state !== '') {
        if (normField(pl.state) !== normField(location.state)) return false;
    }
    if (location.city !== undefined && location.city !== '') {
        if (normField(pl.city) !== normField(location.city)) return false;
    }
    return true;
}

/** Inclusive YYYY-MM-DD using UTC day boundaries. */
function matchesDateRange(photo: Photo, startDate?: string, endDate?: string): boolean {
    const t = photo.createdAt.getTime();
    if (startDate) {
        const start = new Date(`${startDate}T00:00:00.000Z`).getTime();
        if (t < start) return false;
    }
    if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999Z`).getTime();
        if (t > end) return false;
    }
    return true;
}

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
        { width: 3840, height: 2160 }, // 16:9 (4K)
        { width: 2160, height: 3840 }, // 9:16 (4K portrait)
        { width: 3000, height: 3000 }, // 1:1 (square)
        { width: 3840, height: 2560 }, // 3:2 (high res)
        { width: 2560, height: 3840 }, // 2:3 (portrait high res)
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
    private readonly allPhotos: Photo[];
    private readonly photoAlbums = new Map<string, ReadonlySet<string>>();
    private readonly photoPeople = new Map<string, ReadonlySet<string>>();

    constructor() {
        this.allPhotos = generateMockPhotos(500);
        for (const p of this.allPhotos) {
            this.photoAlbums.set(p.id, new Set(mockAlbumMembershipForPhotoId(p.id)));
            this.photoPeople.set(p.id, new Set(mockPersonMembershipForPhotoId(p.id)));
        }
    }

    async getPhotos(params: PhotoFilterParams = {}): Promise<Photo[]> {
        const {
            albumIds,
            albumOperator = DEFAULT_FILTER_OPERATOR,
            personIds,
            personOperator = DEFAULT_FILTER_OPERATOR,
            excludeAlbumIds,
            excludePersonIds,
            location,
            startDate,
            endDate,
            globalOperator = DEFAULT_FILTER_OPERATOR,
        } = params;

        const excludeAlbumSet = new Set(excludeAlbumIds ?? []);
        const excludePersonSet = new Set(excludePersonIds ?? []);
        const effectiveAlbumIds = albumIds?.filter((id) => !excludeAlbumSet.has(id));
        const effectivePersonIds = personIds?.filter((id) => !excludePersonSet.has(id));

        const queries = this.buildQueries({
            albumIds: effectiveAlbumIds,
            albumOperator,
            personIds: effectivePersonIds,
            personOperator,
            location,
            startDate,
            endDate,
            globalOperator,
        });

        const results = queries.map((query) => this.executeSingleQuery(query));

        let combinedPhotos = this.combineResults(results, {
            albumOperator,
            personOperator,
            globalOperator,
        });

        const hasExclusions =
            (excludeAlbumIds?.length ?? 0) > 0 || (excludePersonIds?.length ?? 0) > 0;
        if (hasExclusions) {
            combinedPhotos = this.applyExclusions(combinedPhotos, {
                excludeAlbumIds,
                excludePersonIds,
                location,
                startDate,
                endDate,
            });
        }

        return combinedPhotos;
    }

    private buildQueries(params: {
        albumIds?: string[];
        albumOperator: FilterOperator;
        personIds?: string[];
        personOperator: FilterOperator;
        location?: { country?: string; state?: string; city?: string };
        startDate?: string;
        endDate?: string;
        globalOperator: FilterOperator;
    }): QueryConfig[] {
        const {
            albumIds = [],
            albumOperator,
            personIds = [],
            personOperator,
            location,
            startDate,
            endDate,
            globalOperator,
        } = params;

        const albumQueries: QueryConfig[] = [];
        const personQueries: QueryConfig[] = [];
        const baseQuery: QueryConfig = { location, startDate, endDate };

        if (albumIds.length > 0) {
            if (albumOperator === 'OR') {
                albumQueries.push(...albumIds.map((id) => ({ ...baseQuery, albumIds: [id] })));
            } else {
                albumQueries.push({ ...baseQuery, albumIds });
            }
        }

        if (personIds.length > 0) {
            if (personOperator === 'OR') {
                personQueries.push(...personIds.map((id) => ({ ...baseQuery, personIds: [id] })));
            } else {
                personQueries.push({ ...baseQuery, personIds });
            }
        }

        let queries: QueryConfig[];

        if (albumQueries.length === 0 && personQueries.length === 0) {
            queries = [baseQuery];
        } else if (globalOperator === 'OR') {
            queries = [...albumQueries, ...personQueries];
        } else {
            if (albumQueries.length > 0 && personQueries.length > 0) {
                queries = [];
                for (const aq of albumQueries) {
                    for (const pq of personQueries) {
                        queries.push({
                            ...baseQuery,
                            albumIds: aq.albumIds,
                            personIds: pq.personIds,
                        });
                    }
                }
            } else {
                queries = albumQueries.length > 0 ? albumQueries : personQueries;
            }
        }

        return queries;
    }

    private executeSingleQuery(query: QueryConfig): Photo[] {
        return this.allPhotos.filter((photo) => this.photoMatchesQuery(photo, query));
    }

    private photoMatchesQuery(photo: Photo, query: QueryConfig): boolean {
        if (!matchesLocation(photo, query.location)) {
            return false;
        }
        if (!matchesDateRange(photo, query.startDate, query.endDate)) {
            return false;
        }

        const albums = this.photoAlbums.get(photo.id);
        if (query.albumIds && query.albumIds.length > 0) {
            if (!albums) return false;
            for (const id of query.albumIds) {
                if (!albums.has(id)) return false;
            }
        }

        const people = this.photoPeople.get(photo.id);
        if (query.personIds && query.personIds.length > 0) {
            if (!people) return false;
            for (const id of query.personIds) {
                if (!people.has(id)) return false;
            }
        }

        return true;
    }

    private combineResults(
        results: Photo[][],
        operators: {
            albumOperator: FilterOperator;
            personOperator: FilterOperator;
            globalOperator: FilterOperator;
        }
    ): Photo[] {
        if (results.length === 0) return [];
        if (results.length === 1) return results[0];

        if (
            operators.globalOperator === 'OR' ||
            operators.albumOperator === 'OR' ||
            operators.personOperator === 'OR'
        ) {
            return this.unionPhotos(results);
        }

        return this.intersectPhotos(results);
    }

    private unionPhotos(results: Photo[][]): Photo[] {
        const photoMap = new Map<string, Photo>();

        for (const photoSet of results) {
            for (const photo of photoSet) {
                if (!photoMap.has(photo.id)) {
                    photoMap.set(photo.id, photo);
                }
            }
        }

        return Array.from(photoMap.values());
    }

    private intersectPhotos(results: Photo[][]): Photo[] {
        if (results.length === 0) return [];
        if (results.length === 1) return results[0];

        const photoMap = new Map<string, Photo>();
        for (const photo of results[0]) {
            photoMap.set(photo.id, photo);
        }

        for (let i = 1; i < results.length; i++) {
            const currentIds = new Set(results[i].map((p) => p.id));

            for (const id of photoMap.keys()) {
                if (!currentIds.has(id)) {
                    photoMap.delete(id);
                }
            }
        }

        return Array.from(photoMap.values());
    }

    private applyExclusions(
        photos: Photo[],
        exclusions: {
            excludeAlbumIds?: string[];
            excludePersonIds?: string[];
            location?: { country?: string; state?: string; city?: string };
            startDate?: string;
            endDate?: string;
        }
    ): Photo[] {
        const excludeQueries: QueryConfig[] = [];
        const baseQuery: QueryConfig = {
            location: exclusions.location,
            startDate: exclusions.startDate,
            endDate: exclusions.endDate,
        };

        if (exclusions.excludeAlbumIds && exclusions.excludeAlbumIds.length > 0) {
            excludeQueries.push(
                ...exclusions.excludeAlbumIds.map((id) => ({
                    ...baseQuery,
                    albumIds: [id],
                }))
            );
        }
        if (exclusions.excludePersonIds && exclusions.excludePersonIds.length > 0) {
            excludeQueries.push(
                ...exclusions.excludePersonIds.map((id) => ({
                    ...baseQuery,
                    personIds: [id],
                }))
            );
        }

        if (excludeQueries.length === 0) return photos;

        const excludeResults = excludeQueries.map((q) => this.executeSingleQuery(q));
        const excludeIds = new Set(excludeResults.flat().map((p) => p.id));

        return photos.filter((p) => !excludeIds.has(p.id));
    }
}
