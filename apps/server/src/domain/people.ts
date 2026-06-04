export interface DomainPerson {
    id: string;
    name: string;
    birthDate: string | null;
    thumbnailUrl: string;
    isHidden: boolean;
    isFavorite: boolean;
    updatedAt: string;
}
