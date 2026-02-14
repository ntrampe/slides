import type { PeopleService, Person } from '../types';

export class ImmichPeopleService implements PeopleService {
    private proxyUrl = "/immich";

    async getPeople(): Promise<Person[]> {
        const res = await fetch(`${this.proxyUrl}/api/people`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            throw new Error(`Immich people fetch failed: ${res.status}`);
        }

        const json = await res.json();
        const people = json.people ?? [];

        // Map to Person type
        return people.map((person: any) => ({
            id: person.id,
            name: person.name,
            birthDate: person.birthDate,
            thumbnailUrl: `${this.proxyUrl}/api/people/${person.id}/thumbnail`,
            isHidden: person.isHidden,
            isFavorite: person.isFavorite,
            updatedAt: person.updatedAt
        }));
    }
}