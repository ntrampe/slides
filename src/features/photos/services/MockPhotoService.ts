import type { Photo, PhotoService } from '../types';

export class MockPhotoService implements PhotoService {
    async getPhotos(): Promise<Photo[]> {
        return [
            { id: '1', url: 'https://picsum.photos/1920/1080?1', location: 'Mock Beach', createdAt: new Date() },
            { id: '2', url: 'https://picsum.photos/1920/1080?2', location: 'Mock Mountain', createdAt: new Date() },
        ];
    }
}