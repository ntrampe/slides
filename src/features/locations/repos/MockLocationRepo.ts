import type { LocationRepo, MapMarker, LocationHierarchy, LocationSelection } from '../types';

const MOCK_MARKERS: MapMarker[] = [
    {
        id: 'marker-1',
        lat: 37.7749,
        lon: -122.4194,
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America'
    },
    {
        id: 'marker-2',
        lat: 34.0522,
        lon: -118.2437,
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America'
    },
    {
        id: 'marker-3',
        lat: 40.7128,
        lon: -74.0060,
        city: 'New York City',
        state: 'New York',
        country: 'United States of America'
    },
    {
        id: 'marker-4',
        lat: 51.5074,
        lon: -0.1278,
        city: 'London',
        state: 'England',
        country: 'United Kingdom'
    },
    {
        id: 'marker-5',
        lat: 48.8566,
        lon: 2.3522,
        city: 'Paris',
        state: 'Île-de-France',
        country: 'France'
    },
    {
        id: 'marker-6',
        lat: 35.6762,
        lon: 139.6503,
        city: 'Tokyo',
        state: 'Tokyo',
        country: 'Japan'
    },
    {
        id: 'marker-7',
        lat: 52.5200,
        lon: 13.4050,
        city: 'Berlin',
        state: 'Berlin',
        country: 'Germany'
    },
    {
        id: 'marker-8',
        lat: 41.9028,
        lon: 12.4964,
        city: 'Rome',
        state: 'Lazio',
        country: 'Italy'
    },
    {
        id: 'marker-9',
        lat: 37.5665,
        lon: 126.9780,
        city: 'Seoul',
        state: 'Seoul',
        country: 'South Korea'
    },
    {
        id: 'marker-10',
        lat: -33.8688,
        lon: 151.2093,
        city: 'Sydney',
        state: 'New South Wales',
        country: 'Australia'
    },
    // Add some additional markers to same locations for count variety
    {
        id: 'marker-11',
        lat: 37.7849,
        lon: -122.4094,
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America'
    },
    {
        id: 'marker-12',
        lat: 37.7649,
        lon: -122.4294,
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America'
    },
    {
        id: 'marker-13',
        lat: 34.0422,
        lon: -118.2337,
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America'
    },
    {
        id: 'marker-14',
        lat: 51.5174,
        lon: -0.1378,
        city: 'London',
        state: 'England',
        country: 'United Kingdom'
    },
    {
        id: 'marker-15',
        lat: 51.4974,
        lon: -0.1178,
        city: 'London',
        state: 'England',
        country: 'United Kingdom'
    }
];

export class MockLocationRepo implements LocationRepo {
    async getMapMarkers(): Promise<MapMarker[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 400));
        return [...MOCK_MARKERS];
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
        const countries = Array.from(countryCounts.entries())
            .map(([name, count]) => ({
                id: name,
                name,
                count
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        const states: Record<string, any[]> = {};
        statesByCountry.forEach((stateSet, country) => {
            states[country] = Array.from(stateSet)
                .map(state => ({
                    id: `${country}:${state}`,
                    name: state,
                    count: stateCounts.get(`${country}:${state}`) || 0
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        });

        const cities: Record<string, any[]> = {};
        citiesByState.forEach((citySet, state) => {
            cities[state] = Array.from(citySet)
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