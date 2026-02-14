import type { Person, PeopleRepo } from '../types';

const MOCK_PEOPLE: Person[] = [
    {
        id: 'mock-1',
        name: 'Alice Johnson',
        birthDate: '1990-05-15',
        thumbnailUrl: 'https://i.pravatar.cc/150?u=alice',
        isHidden: false,
        isFavorite: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 'mock-2',
        name: 'Bob Smith',
        birthDate: null,
        thumbnailUrl: 'https://i.pravatar.cc/150?u=bob',
        isHidden: false,
        isFavorite: false,
        updatedAt: new Date().toISOString()
    },
    {
        id: 'mock-3',
        name: 'Carol Williams',
        birthDate: '1985-12-03',
        thumbnailUrl: 'https://i.pravatar.cc/150?u=carol',
        isHidden: false,
        isFavorite: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 'mock-4',
        name: 'David Brown',
        birthDate: '1992-07-22',
        thumbnailUrl: 'https://i.pravatar.cc/150?u=david',
        isHidden: false,
        isFavorite: false,
        updatedAt: new Date().toISOString()
    },
    {
        id: 'mock-5',
        name: 'Eve Martinez',
        birthDate: null,
        thumbnailUrl: 'https://i.pravatar.cc/150?u=eve',
        isHidden: false,
        isFavorite: false,
        updatedAt: new Date().toISOString()
    }
];

export class MockPeopleRepo implements PeopleRepo {
    async getPeople(): Promise<Person[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return [...MOCK_PEOPLE];
    }
}