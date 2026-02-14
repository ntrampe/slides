export interface Person {
    id: string;
    name: string;
    birthDate: string | null;
    thumbnailUrl: string;
    isHidden: boolean;
    isFavorite: boolean;
    updatedAt: string;
}

export interface PeopleResponse {
    people: Person[];
}

export interface PeopleService {
    getPeople: () => Promise<Person[]>;
}