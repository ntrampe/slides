import type {
    DomainLocationHierarchy,
    DomainLocationItem,
    DomainMapMarker,
} from './locations.js';

/**
 * Aggregates raw map markers into a countries → states → cities hierarchy.
 *
 * Cities are keyed by "country:state" to avoid collision when two countries
 * share a state name. City IDs use the compound "country:state:city" format.
 * State IDs use "country:state".
 */
export function buildLocationHierarchy(markers: DomainMapMarker[]): DomainLocationHierarchy {
    const countryCounts = new Map<string, number>();
    const stateCounts = new Map<string, number>();
    const cityCounts = new Map<string, number>();
    const statesByCountry = new Map<string, Set<string>>();
    const citiesByCountryState = new Map<string, Set<string>>();

    for (const marker of markers) {
        if (!marker.country) continue;

        countryCounts.set(marker.country, (countryCounts.get(marker.country) ?? 0) + 1);

        const stateKey = `${marker.country}:${marker.state}`;
        stateCounts.set(stateKey, (stateCounts.get(stateKey) ?? 0) + 1);

        if (!statesByCountry.has(marker.country)) {
            statesByCountry.set(marker.country, new Set());
        }
        statesByCountry.get(marker.country)!.add(marker.state);

        const cityKey = `${marker.country}:${marker.state}:${marker.city}`;
        cityCounts.set(cityKey, (cityCounts.get(cityKey) ?? 0) + 1);

        if (!citiesByCountryState.has(stateKey)) {
            citiesByCountryState.set(stateKey, new Set());
        }
        citiesByCountryState.get(stateKey)!.add(marker.city);
    }

    const countries: DomainLocationItem[] = Array.from(countryCounts.entries())
        .map(([name, count]) => ({ id: name, name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const states: Record<string, DomainLocationItem[]> = {};
    statesByCountry.forEach((stateSet, country) => {
        states[country] = Array.from(stateSet)
            .filter(Boolean)
            .map((state) => ({
                id: `${country}:${state}`,
                name: state,
                count: stateCounts.get(`${country}:${state}`) ?? 0,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    });

    // Keyed by "country:state" so same-named states in different countries are distinct.
    const cities: Record<string, DomainLocationItem[]> = {};
    citiesByCountryState.forEach((citySet, countryState) => {
        cities[countryState] = Array.from(citySet)
            .filter(Boolean)
            .map((city) => ({
                id: `${countryState}:${city}`,
                name: city,
                count: cityCounts.get(`${countryState}:${city}`) ?? 0,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    });

    return { countries, states, cities };
}
