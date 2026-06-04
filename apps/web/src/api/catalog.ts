import type { Album, LocationHierarchy, LocationSelection, MapMarker, Person } from '@slides/api-contract';
import { apiGet } from './http.js';

export async function fetchAlbums(): Promise<Album[]> {
    const { albums } = await apiGet<{ albums: Album[] }>('/albums');
    return albums;
}

export async function fetchPeople(): Promise<Person[]> {
    const { people } = await apiGet<{ people: Person[] }>('/people');
    return people;
}

export async function fetchLocationHierarchy(): Promise<LocationHierarchy> {
    return apiGet<LocationHierarchy>('/locations');
}

export async function fetchMapMarkers(): Promise<MapMarker[]> {
    const { markers } = await apiGet<{ markers: MapMarker[] }>('/locations/markers');
    return markers;
}

export async function resolveLocation(
    partial: Partial<LocationSelection>
): Promise<LocationSelection | null> {
    const params = new URLSearchParams();
    if (partial.country) params.set('country', partial.country);
    if (partial.state) params.set('state', partial.state);
    if (partial.city) params.set('city', partial.city);
    const qs = params.toString();
    return apiGet<LocationSelection | null>(qs ? `/locations/resolve?${qs}` : '/locations/resolve');
}
