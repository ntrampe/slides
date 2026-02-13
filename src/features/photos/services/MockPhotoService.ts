import type { Photo, PhotoService } from '../types';

export class MockPhotoService implements PhotoService {
    async getPhotos(): Promise<Photo[]> {
        return [
            { id: '1', url: 'https://picsum.photos/1920/1080?1', location: 'Sunset Beach', createdAt: new Date() },
            { id: '2', url: 'https://picsum.photos/1920/1080?2', location: 'Rocky Mountains', createdAt: new Date() },
            { id: '3', url: 'https://picsum.photos/1920/1080?3', location: 'Tokyo Tower', createdAt: new Date() },
            { id: '4', url: 'https://picsum.photos/1920/1080?4', location: 'Paris Streets', createdAt: new Date() },
            { id: '5', url: 'https://picsum.photos/1920/1080?5', location: 'Amazon Rainforest', createdAt: new Date() },
            { id: '6', url: 'https://picsum.photos/1920/1080?6', location: 'Sahara Desert', createdAt: new Date() },
            { id: '7', url: 'https://picsum.photos/1920/1080?7', location: 'Grand Canyon', createdAt: new Date() },
            { id: '8', url: 'https://picsum.photos/1920/1080?8', location: 'Northern Lights, Iceland', createdAt: new Date() },
            { id: '9', url: 'https://picsum.photos/1920/1080?9', location: 'Santorini, Greece', createdAt: new Date() },
            { id: '10', url: 'https://picsum.photos/1920/1080?10', location: 'Machu Picchu, Peru', createdAt: new Date() },
            { id: '11', url: 'https://picsum.photos/1920/1080?11', location: 'Great Wall of China', createdAt: new Date() },
            { id: '12', url: 'https://picsum.photos/1920/1080?12', location: 'Venice Canals', createdAt: new Date() },
            { id: '13', url: 'https://picsum.photos/1920/1080?13', location: 'Swiss Alps', createdAt: new Date() },
            { id: '14', url: 'https://picsum.photos/1920/1080?14', location: 'Bali Temple', createdAt: new Date() },
            { id: '15', url: 'https://picsum.photos/1920/1080?15', location: 'New York City Skyline', createdAt: new Date() },
            { id: '16', url: 'https://picsum.photos/1920/1080?16', location: 'Scottish Highlands', createdAt: new Date() },
            { id: '17', url: 'https://picsum.photos/1920/1080?17', location: 'Australian Outback', createdAt: new Date() },
            { id: '18', url: 'https://picsum.photos/1920/1080?18', location: 'Norwegian Fjords', createdAt: new Date() },
            { id: '19', url: 'https://picsum.photos/1920/1080?19', location: 'Taj Mahal, India', createdAt: new Date() },
            { id: '20', url: 'https://picsum.photos/1920/1080?20', location: 'Maldives Beach', createdAt: new Date() },
            { id: '21', url: 'https://picsum.photos/1920/1080?21', location: 'Dubai Skyline', createdAt: new Date() },
            { id: '22', url: 'https://picsum.photos/1920/1080?22', location: 'Cherry Blossoms, Japan', createdAt: new Date() },
            { id: '23', url: 'https://picsum.photos/1920/1080?23', location: 'Niagara Falls', createdAt: new Date() },
            { id: '24', url: 'https://picsum.photos/1920/1080?24', location: 'Yosemite National Park', createdAt: new Date() },
            { id: '25', url: 'https://picsum.photos/1920/1080?25', location: 'Antarctic Peninsula', createdAt: new Date() },
        ];
    }
}