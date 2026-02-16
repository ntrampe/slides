import type { LocationRepo, MapMarker, LocationHierarchy, LocationItem, LocationSelection } from '../types';

export class ImmichLocationRepo implements LocationRepo {
    private proxyUrl = "/api/immich";

    async getMapMarkers(): Promise<MapMarker[]> {
        const res = await fetch(`${this.proxyUrl}/api/map/markers`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            throw new Error(`Immich map markers fetch failed: ${res.status}`);
        }

        return await res.json();
    }

    async getLocationHierarchy(): Promise<LocationHierarchy> {
        const markers = await this.getMapMarkers();

        // Count occurrences and build relationships
        const countryCounts = new Map<string, number>();
        const stateCounts = new Map<string, number>();
        const cityCounts = new Map<string, number>();
        const statesByCountry = new Map<string, Set<string>>();
        const citiesByState = new Map<string, Set<string>>();

        markers.forEach(marker => {
            // Count countries
            countryCounts.set(marker.country, (countryCounts.get(marker.country) || 0) + 1);

            // Count states and track by country
            const stateKey = `${marker.country}:${marker.state}`;
            stateCounts.set(stateKey, (stateCounts.get(stateKey) || 0) + 1);

            if (!statesByCountry.has(marker.country)) {
                statesByCountry.set(marker.country, new Set());
            }
            statesByCountry.get(marker.country)!.add(marker.state);

            // Count cities and track by state
            const cityKey = `${marker.state}:${marker.city}`;
            cityCounts.set(cityKey, (cityCounts.get(cityKey) || 0) + 1);

            if (!citiesByState.has(marker.state)) {
                citiesByState.set(marker.state, new Set());
            }
            citiesByState.get(marker.state)!.add(marker.city);
        });

        // Build hierarchy
        const countries: LocationItem[] = Array.from(countryCounts.entries())
            .filter(([name]) => name != null)
            .map(([name, count]) => ({
                id: name,
                name,
                count
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        const states: Record<string, LocationItem[]> = {};
        statesByCountry.forEach((stateSet, country) => {
            states[country] = Array.from(stateSet)
                .filter(state => state != null)
                .map(state => ({
                    id: `${country}:${state}`,
                    name: state,
                    count: stateCounts.get(`${country}:${state}`) || 0
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        });

        const cities: Record<string, LocationItem[]> = {};
        citiesByState.forEach((citySet, state) => {
            cities[state] = Array.from(citySet)
                .filter(city => city != null)
                .map(city => ({
                    id: `${state}:${city}`,
                    name: city,
                    count: cityCounts.get(`${state}:${city}`) || 0
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        });

        return { countries, states, cities };
    }

    async resolveLocation(partial: Partial<LocationSelection>): Promise<LocationSelection | null> {
        const markers = await this.getMapMarkers();

        // Find a marker that matches the partial selection
        const matchingMarker = markers.find(marker => {
            if (partial.city && marker.city !== partial.city) return false;
            if (partial.state && marker.state !== partial.state) return false;
            if (partial.country && marker.country !== partial.country) return false;
            return true;
        });

        if (!matchingMarker) return null;

        return {
            country: matchingMarker.country,
            state: matchingMarker.state,
            city: matchingMarker.city
        };
    }
}