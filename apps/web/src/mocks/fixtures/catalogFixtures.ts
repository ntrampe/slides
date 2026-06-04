import type { Album, LocationHierarchy, MapMarker, Person } from '@slides/api-contract';

const NOW = new Date().toISOString();

/** Demo albums for filter pickers (offline build). */
export const MOCK_ALBUMS: Album[] = [
    {
        id: 'demo-album-1',
        name: 'Summer Vacation',
        description: 'Beach and travel highlights',
        thumbnailUrl: 'https://picsum.photos/seed/album1/200/200',
        assetCount: 128,
        createdAt: NOW,
        updatedAt: NOW,
        shared: false,
    },
    {
        id: 'demo-album-2',
        name: 'Family',
        description: null,
        thumbnailUrl: 'https://picsum.photos/seed/album2/200/200',
        assetCount: 342,
        createdAt: NOW,
        updatedAt: NOW,
        shared: true,
    },
    {
        id: 'demo-album-3',
        name: 'Landscapes',
        description: 'Mountains, coast, and cityscapes',
        thumbnailUrl: 'https://picsum.photos/seed/album3/200/200',
        assetCount: 89,
        createdAt: NOW,
        updatedAt: NOW,
        shared: false,
    },
    {
        id: 'demo-album-4',
        name: 'Favorites',
        description: 'Best shots',
        thumbnailUrl: 'https://picsum.photos/seed/album4/200/200',
        assetCount: 56,
        createdAt: NOW,
        updatedAt: NOW,
        shared: false,
    },
];

/** Demo people for filter pickers (offline build). */
export const MOCK_PEOPLE: Person[] = [
    {
        id: 'demo-person-1',
        name: 'Alex Morgan',
        birthDate: '1990-05-12',
        thumbnailUrl: 'https://picsum.photos/seed/person1/200/200',
        isHidden: false,
        isFavorite: true,
        updatedAt: NOW,
    },
    {
        id: 'demo-person-2',
        name: 'Jordan Lee',
        birthDate: null,
        thumbnailUrl: 'https://picsum.photos/seed/person2/200/200',
        isHidden: false,
        isFavorite: false,
        updatedAt: NOW,
    },
    {
        id: 'demo-person-3',
        name: 'Sam Taylor',
        birthDate: '1985-11-03',
        thumbnailUrl: 'https://picsum.photos/seed/person3/200/200',
        isHidden: false,
        isFavorite: false,
        updatedAt: NOW,
    },
    {
        id: 'demo-person-4',
        name: 'Riley Chen',
        birthDate: '1998-02-28',
        thumbnailUrl: 'https://picsum.photos/seed/person4/200/200',
        isHidden: false,
        isFavorite: true,
        updatedAt: NOW,
    },
];

/**
 * Location hierarchy aligned with slideshow fixture places.
 * IDs match server conventions: country id = name; state = `country:state`; city = `country:state:city`.
 */
export const MOCK_LOCATION_HIERARCHY: LocationHierarchy = {
    countries: [
        { id: 'USA', name: 'USA', count: 2 },
        { id: 'Japan', name: 'Japan', count: 1 },
        { id: 'France', name: 'France', count: 1 },
        { id: 'Iceland', name: 'Iceland', count: 1 },
        { id: 'Greece', name: 'Greece', count: 1 },
    ],
    states: {
        USA: [
            { id: 'USA:California', name: 'California', count: 1 },
            { id: 'USA:Colorado', name: 'Colorado', count: 1 },
        ],
        Japan: [{ id: 'Japan:Tokyo', name: 'Tokyo', count: 1 }],
        France: [{ id: 'France:Île-de-France', name: 'Île-de-France', count: 1 }],
        Iceland: [{ id: 'Iceland:Capital Region', name: 'Capital Region', count: 1 }],
        Greece: [{ id: 'Greece:South Aegean', name: 'South Aegean', count: 1 }],
    },
    cities: {
        'USA:California': [{ id: 'USA:California:Malibu', name: 'Malibu', count: 4 }],
        'USA:Colorado': [{ id: 'USA:Colorado:Aspen', name: 'Aspen', count: 4 }],
        'Japan:Tokyo': [{ id: 'Japan:Tokyo:Tokyo', name: 'Tokyo', count: 4 }],
        'France:Île-de-France': [{ id: 'France:Île-de-France:Paris', name: 'Paris', count: 4 }],
        'Iceland:Capital Region': [
            { id: 'Iceland:Capital Region:Reykjavik', name: 'Reykjavik', count: 4 },
        ],
        'Greece:South Aegean': [{ id: 'Greece:South Aegean:Santorini', name: 'Santorini', count: 4 }],
    },
};

/** Map markers for optional map UI in demo builds. */
export const MOCK_MAP_MARKERS: MapMarker[] = [
    { id: 'm1', lat: 34.0259, lon: -118.7798, city: 'Malibu', state: 'California', country: 'USA' },
    { id: 'm2', lat: 39.1911, lon: -106.8175, city: 'Aspen', state: 'Colorado', country: 'USA' },
    { id: 'm3', lat: 35.6762, lon: 139.6503, city: 'Tokyo', state: 'Tokyo', country: 'Japan' },
    { id: 'm4', lat: 48.8566, lon: 2.3522, city: 'Paris', state: 'Île-de-France', country: 'France' },
    { id: 'm5', lat: 64.1466, lon: -21.9426, city: 'Reykjavik', state: 'Capital Region', country: 'Iceland' },
    { id: 'm6', lat: 36.3932, lon: 25.4615, city: 'Santorini', state: 'South Aegean', country: 'Greece' },
];
