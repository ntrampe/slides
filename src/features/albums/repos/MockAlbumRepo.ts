import type { Album, AlbumRepo } from '../types';

const MOCK_ALBUMS: Album[] = [
    {
        id: 'mock-album-1',
        name: 'Summer Vacation 2024',
        description: 'Beach trip and hiking adventures',
        thumbnailUrl: 'https://picsum.photos/seed/album1/300/200',
        assetCount: 42,
        createdAt: new Date('2024-07-01').toISOString(),
        updatedAt: new Date('2024-07-15').toISOString(),
        shared: false
    },
    {
        id: 'mock-album-2',
        name: 'Family Photos',
        description: null,
        thumbnailUrl: 'https://picsum.photos/seed/album2/300/200',
        assetCount: 156,
        createdAt: new Date('2023-01-01').toISOString(),
        updatedAt: new Date('2024-06-30').toISOString(),
        shared: true
    },
    {
        id: 'mock-album-3',
        name: 'Wedding 2023',
        description: 'Our special day',
        thumbnailUrl: 'https://picsum.photos/seed/album3/300/200',
        assetCount: 287,
        createdAt: new Date('2023-09-15').toISOString(),
        updatedAt: new Date('2023-09-20').toISOString(),
        shared: true
    },
    {
        id: 'mock-album-4',
        name: 'Holiday Season',
        description: null,
        thumbnailUrl: 'https://picsum.photos/seed/album4/300/200',
        assetCount: 93,
        createdAt: new Date('2023-12-01').toISOString(),
        updatedAt: new Date('2024-01-05').toISOString(),
        shared: false
    },
    {
        id: 'mock-album-5',
        name: 'Nature Photography',
        description: 'Landscapes and wildlife',
        thumbnailUrl: 'https://picsum.photos/seed/album5/300/200',
        assetCount: 64,
        createdAt: new Date('2024-03-10').toISOString(),
        updatedAt: new Date('2024-05-22').toISOString(),
        shared: false
    }
];

export class MockAlbumRepo implements AlbumRepo {
    async getAlbums(): Promise<Album[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return [...MOCK_ALBUMS];
    }
}
