export interface MapMarker {
    id: string;
    lat: number;
    lon: number;
    city: string;
    state: string;
    country: string;
}

export interface LocationHierarchy {
    countries: LocationItem[];
    states: Record<string, LocationItem[]>; // keyed by country
    cities: Record<string, LocationItem[]>; // keyed by state
}

export interface LocationItem {
    id: string;
    name: string;
    count: number; // number of photos/markers
}

export interface LocationSelection {
    country?: string;
    state?: string;
    city?: string;
}

export interface LocationRepo {
    getMapMarkers: () => Promise<MapMarker[]>;
    getLocationHierarchy: () => Promise<LocationHierarchy>;
    resolveLocation: (partial: Partial<LocationSelection>) => Promise<LocationSelection | null>;
}